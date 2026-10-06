const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/User/User");

dotenv.config();

const createSuperAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required"
      );
    }

    if (password.length < 8) {
      throw new Error(
        "SUPER_ADMIN_PASSWORD must be at least 8 characters"
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      if (existingUser.role === "super_admin") {
        console.log("A super admin with this email already exists.");
      } else {
        existingUser.role = "super_admin";
        existingUser.status = "active";

        await existingUser.save();

        console.log("Existing user promoted to super_admin.");
      }

      await mongoose.disconnect();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: "NovaCart Super Admin",
      email: normalizedEmail,
      password: hashedPassword,
      role: "super_admin",
      status: "active",
      isEmailVerified: true
    });

    console.log("Super admin created successfully.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Super admin creation failed:", error.message);

    await mongoose.disconnect().catch(() => {});

    process.exit(1);
  }
};

createSuperAdmin();