
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://novacart-zpm6.onrender.com";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please complete all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Your password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            password,
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message ||
            result.error ||
            "Registration failed. Please try again."
        );
      }

      setSuccess("Account created successfully! Redirecting to sign in...");

      window.setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-shell">
      <header className="topbar">
        <Link href="/" className="logo">
          <span className="logo-mark">
            <ShoppingBag size={24} strokeWidth={2.5} />
          </span>
          <span className="logo-text">
            Nova<span>Cart</span>
          </span>
        </Link>

        <Link href="/login" className="top-login">
          Already a member? <strong>Sign in</strong>
        </Link>
      </header>

      <div className="register-layout">
        <section className="welcome-panel">
          <div className="welcome-content">
            <span className="eyebrow">
              <Sparkles size={15} /> YOUR NEXT FAVORITE THING
            </span>

            <h1>
              Shopping better
              <br />
              starts <span>here.</span>
            </h1>

            <p className="welcome-copy">
              Create your NovaCart account for a smoother,
              smarter shopping experience.
            </p>

            <div className="benefit-list">
              <div className="benefit">
                <span className="benefit-icon">
                  <ShoppingBag size={20} />
                </span>
                <div>
                  <strong>Everything you love</strong>
                  <p>Discover fashion, accessories and more.</p>
                </div>
              </div>

              <div className="benefit">
                <span className="benefit-icon">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <strong>Your account, your way</strong>
                  <p>Manage your profile and orders in one place.</p>
                </div>
              </div>

              <div className="benefit">
                <span className="benefit-icon">
                  <CheckCircle2 size={20} />
                </span>
                <div>
                  <strong>Easy shopping experience</strong>
                  <p>Keep your shopping details together.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="panel-footer">
            <span className="footer-dot" />
            A smarter way to shop with NovaCart
          </div>
          <div className="decor decor-one" />
          <div className="decor decor-two" />
        </section>

        <section className="form-panel">
          <div className="form-heading">
            <Link href="/" className="mobile-back">
              <ArrowLeft size={17} /> Home
            </Link>

            <span className="form-kicker">GET STARTED FOR FREE</span>
            <h2>Create your account</h2>
            <p>Enter your details to join NovaCart.</p>
          </div>

          {error && (
            <div className="notice notice-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="notice notice-success" role="status">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <div className="input-wrap">
                <UserRound size={19} />
                <input
                  id="name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="email">Email address</label>
              <div className="input-wrap">
                <Mail size={19} />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="phone">
                Phone number <span className="optional">(optional)</span>
              </label>
              <div className="input-wrap">
                <Phone size={19} />
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <LockKeyhole size={19} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="visibility-button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="input-wrap">
                <LockKeyhole size={19} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Enter password again"
                  required
                />
                <button
                  type="button"
                  className="visibility-button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <p className="terms">
              By creating an account, you agree to our{" "}
              <Link href="/terms">Terms</Link> and{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>

            <button
              className="submit-button"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? "Creating your account..." : "Create account"}</span>
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <div className="signin-bottom">
            Already have an account?{" "}
            <Link href="/login">Sign in instead</Link>
          </div>

          <div className="secure-note">
            <ShieldCheck size={16} />
            Your information is sent securely over HTTPS.
          </div>
        </section>
      </div>

      <footer className="page-footer">
        <span>© {new Date().getFullYear()} NovaCart</span>
        <span>Made for a better shopping experience.</span>
      </footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          color: #172337;
          background: #f5f7fb;
        }

        a {
          -webkit-tap-highlight-color: transparent;
        }

        .register-shell {
          min-height: 100vh;
          padding: 0 5.5%;
          background:
            radial-gradient(ellipse at 8% 5%, #e5efff 0, transparent 32%),
            #f5f7fb;
        }

        .topbar {
          max-width: 1240px;
          min-height: 86px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #172337;
          text-decoration: none;
        }

        .logo-mark {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #1769d2;
          color: #fff;
          box-shadow: 0 6px 16px #1769d233;
        }

        .logo-text {
          font-size: 25px;
          font-weight: 850;
          letter-spacing: -1px;
        }

        .logo-text span {
          color: #1769d2;
        }

        .top-login {
          color: #68758a;
          font-size: 13px;
          text-decoration: none;
        }

        .top-login strong {
          margin-left: 4px;
          color: #1769d2;
        }

        .register-layout {
          width: 100%;
          max-width: 1120px;
          min-height: 680px;
          margin: 18px auto 36px;
          display: grid;
          grid-template-columns: 0.93fr 1.07fr;
          overflow: hidden;
          border: 1px solid #e7ebf2;
          border-radius: 25px;
          background: #fff;
          box-shadow: 0 24px 75px #20395d12;
        }

        .welcome-panel {
          position: relative;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          padding: 55px 43px 30px;
          background: linear-gradient(145deg, #1458bb, #1769d2 55%, #3688ee);
          color: #fff;
        }

        .welcome-content,
        .panel-footer {
          position: relative;
          z-index: 2;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 12px;
          border: 1px solid #ffffff45;
          border-radius: 30px;
          background: #ffffff14;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .welcome-panel h1 {
          margin: 30px 0 17px;
          font-size: clamp(36px, 4vw, 51px);
          line-height: 1.1;
          letter-spacing: -2px;
        }

        .welcome-panel h1 span {
          color: #ffdc87;
        }

        .welcome-copy {
          max-width: 330px;
          margin: 0;
          color: #e3efff;
          font-size: 15px;
          line-height: 1.8;
        }

        .benefit-list {
          display: grid;
          gap: 24px;
          margin-top: 40px;
        }

        .benefit {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .benefit-icon {
          flex: 0 0 44px;
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: 1px solid #ffffff40;
          border-radius: 13px;
          background: #ffffff19;
        }

        .benefit strong {
          font-size: 13px;
        }

        .benefit p {
          margin: 5px 0 0;
          color: #dbeaff;
          font-size: 11px;
          line-height: 1.6;
        }

        .panel-footer {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 40px;
          color: #e4efff;
          font-size: 11px;
        }

        .footer-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ffdc87;
        }

        .decor {
          position: absolute;
          z-index: 1;
          border: 1px solid #ffffff19;
          border-radius: 50%;
          pointer-events: none;
        }

        .decor-one {
          width: 350px;
          height: 350px;
          right: -180px;
          top: -100px;
          box-shadow: 0 0 0 35px #ffffff08, 0 0 0 70px #ffffff06;
        }

        .decor-two {
          width: 240px;
          height: 240px;
          bottom: -150px;
          left: -95px;
          box-shadow: 0 0 0 35px #ffffff08;
        }

        .form-panel {
          padding: 43px clamp(25px, 4vw, 55px);
          align-self: center;
        }

        .form-heading {
          margin-bottom: 27px;
        }

        .mobile-back {
          display: none;
        }

        .form-kicker {
          color: #1769d2;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .form-heading h2 {
          margin: 11px 0 9px;
          color: #172337;
          font-size: 30px;
          letter-spacing: -1px;
        }

        .form-heading p {
          margin: 0;
          color: #788498;
          font-size: 13px;
          line-height: 1.6;
        }

        .field {
          margin-bottom: 16px;
        }

        .field label {
          display: block;
          margin-bottom: 8px;
          color: #344258;
          font-size: 12px;
          font-weight: 750;
        }

        .optional {
          color: #929daf;
          font-size: 11px;
          font-weight: 400;
        }

        .input-wrap {
          min-height: 49px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 13px;
          border: 1px solid #e0e5ed;
          border-radius: 10px;
          background: #fbfcfe;
          color: #8995a8;
          transition: border-color .18s, box-shadow .18s, background .18s;
        }

        .input-wrap:focus-within {
          border-color: #1769d2;
          background: #fff;
          box-shadow: 0 0 0 3px #1769d21a;
        }

        .input-wrap input {
          width: 100%;
          min-width: 0;
          height: 47px;
          padding: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #172337;
          font: inherit;
          font-size: 13px;
        }

        .input-wrap input::placeholder {
          color: #a1aaba;
        }

        .visibility-button {
          flex: 0 0 28px;
          width: 28px;
          height: 35px;
          display: grid;
          place-items: center;
          padding: 0;
          border: 0;
          background: transparent;
          color: #8793a5;
          cursor: pointer;
        }

        .terms {
          margin: 3px 0 17px;
          color: #818da0;
          font-size: 10px;
          line-height: 1.8;
        }

        .terms a {
          color: #1769d2;
          font-weight: 700;
          text-decoration: none;
        }

        .submit-button {
          width: 100%;
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 0;
          border-radius: 10px;
          background: #1769d2;
          color: #fff;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          box-shadow: 0 7px 17px #1769d22b;
          transition: background .18s, transform .18s;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          background: #1058b9;
        }

        .submit-button:disabled {
          opacity: .65;
          cursor: wait;
        }

        .notice {
          margin-bottom: 17px;
          padding: 12px 14px;
          border-radius: 9px;
          font-size: 12px;
          line-height: 1.6;
        }

        .notice-error {
          border: 1px solid #ffd5d5;
          background: #fff4f3;
          color: #b42318;
        }

        .notice-success {
          border: 1px solid #b8ebce;
          background: #effcf4;
          color: #087443;
        }

        .signin-bottom {
          margin-top: 23px;
          text-align: center;
          color: #7d899b;
          font-size: 12px;
        }

        .signin-bottom a {
          color: #1769d2;
          font-weight: 750;
          text-decoration: none;
        }

        .secure-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 26px;
          padding-top: 17px;
          border-top: 1px solid #edf0f5;
          color: #8b96a7;
          font-size: 10px;
        }

        .secure-note svg {
          color: #21865a;
        }

        .page-footer {
          max-width: 1120px;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin: 0 auto;
          padding: 0 0 24px;
          color: #8a95a6;
          font-size: 10px;
        }

        @media (max-width: 850px) {
          .register-shell {
            padding: 0 20px;
          }

          .register-layout {
            max-width: 600px;
            grid-template-columns: 1fr;
            mar