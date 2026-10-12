const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../../models/User/User");
const PendingRegistration = require("../../models/User/PendingRegistration");

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    }
  );
};

const generateOtp = () =>
  crypto.randomInt(100000, 1000000).toString();

const hashOtp = (otp) =>
  crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(otp)
    .digest("hex");

const createMailer = () => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !process.env.EMAIL_FROM
  ) {
    throw new Error("SMTP environment variables are missing");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendOtpEmail = async (email, otp) => {
  const transporter = createMailer();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your NovaCart email",
    text:
      `Your NovaCart verification code is ${otp}.\n\n` +
      "This code expires in 10 minutes. " +
      "Do not share it with anyone.",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#172033">
        <h2 style="color:#1769e0">Welcome to NovaCart</h2>
        <p>Use this code to verify your email address:</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;padding:18px;background:#f1f5fb;text-align:center;border-radius:8px">
          ${otp}
        </div>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you did not request this code, you can ignore this email.</p>
      </div>
    `
  });
};

// REGISTER: SEND EMAIL OTP
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (
      !email ||
      typeof email !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    const now = new Date();

    const existingPending =
      await PendingRegistration.findOne({
        email: normalizedEmail
      });

    if (
      existingPending &&
      existingPending.resendAvailableAt > now
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP"
      });
    }

    const otp = generateOtp();
    const hashedPassword = await bcrypt.hash(password, 12);

    await sendOtpEmail(normalizedEmail, otp);

    await PendingRegistration.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          name:
            typeof name === "string"
              ? name.trim().slice(0, 100)
              : "",
          email: normalizedEmail,
          password: hashedPassword,
          phone:
            typeof phone === "string"
              ? phone.trim()
              : "",
          otpHash: hashOtp(otp),
          otpExpiresAt: new Date(
            now.getTime() + 10 * 60 * 1000
          ),
          resendAvailableAt: new Date(
            now.getTime() + 60 * 1000
          ),
          attempts: 0
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
      email: normalizedEmail
    });
  } catch (error) {
    console.error("Registration/OTP error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to send verification code. Please try again."
    });
  }
};
// VERIFY EMAIL OTP AND CREATE CUSTOMER ACCOUNT
const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (
      typeof email !== "string" ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid six-digit verification code"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const pending = await PendingRegistration.findOne({
      email: normalizedEmail
    }).select("+password +otpHash");

    if (!pending) {
      return res.status(404).json({
        success: false,
        message: "No pending registration found. Please register again."
      });
    }

    if (pending.otpExpiresAt <= new Date()) {
      await PendingRegistration.deleteOne({
        _id: pending._id
      });

      return res.status(400).json({
        success: false,
        message: "Verification code expired. Please register again."
      });
    }

    if (pending.attempts >= 5) {
      await PendingRegistration.deleteOne({
        _id: pending._id
      });

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please register again."
      });
    }

    const submittedHash = Buffer.from(hashOtp(otp), "hex");
    const storedHash = Buffer.from(pending.otpHash, "hex");

    const matches =
      submittedHash.length === storedHash.length &&
      crypto.timingSafeEqual(submittedHash, storedHash);

    if (!matches) {
      pending.attempts += 1;
      await pending.save();

      return res.status(400).json({
        success: false,
        message: "Incorrect verification code",
        attemptsRemaining: Math.max(0, 5 - pending.attempts)
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      await PendingRegistration.deleteOne({
        _id: pending._id
      });

      return res.status(409).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      phone: pending.phone,
      role: "customer",
      isEmailVerified: true
    });

    await PendingRegistration.deleteOne({
      _id: pending._id
    });

    return res.status(201).json({
      success: true,
      message: "Email verified and registration completed",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error("Email OTP verification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify your email. Please try again."
    });
  }
};

// RESEND EMAIL OTP
const resendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const pending = await PendingRegistration.findOne({
      email: normalizedEmail
    });

    if (!pending) {
      return res.status(404).json({
        success: false,
        message: "No pending registration found. Please register again."
      });
    }

    const now = new Date();

    if (pending.resendAvailableAt > now) {
      const secondsRemaining = Math.ceil(
        (pending.resendAvailableAt - now) / 1000
      );

      return res.status(429).json({
        success: false,
        message: `Please wait ${secondsRemaining} seconds before requesting another code`,
        secondsRemaining
      });
    }

    const otp = generateOtp();

    await sendOtpEmail(normalizedEmail, otp);

    pending.otpHash = hashOtp(otp);
    pending.otpExpiresAt = new Date(
      now.getTime() + 10 * 60 * 1000
    );
    pending.resendAvailableAt = new Date(
      now.getTime() + 60 * 1000
    );
    pending.attempts = 0;

    await pending.save();

    return res.status(200).json({
      success: true,
      message: "A new verification code has been sent"
    });
  } catch (error) {
    console.error("Resend email OTP error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to resend the verification code"
    });
  }
};
// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is not active"
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};

// TEMPORARY SUPER ADMIN: RESET A VENDOR PASSWORD
const resetVendorPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required"
      });
    }

    if (
      typeof newPassword !== "string" ||
      newPassword.length < 6
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "This endpoint can reset vendor accounts only"
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Vendor password reset successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(
      "Vendor password reset error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to reset vendor password"
    });
  }
};

module.exports = {
  register,
  verifyEmailOtp,
  resendEmailOtp,
  login,
  resetVendorPassword
};