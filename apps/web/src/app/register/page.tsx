
"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://novacart-zpm6.onrender.com";

export default function RegisterPage() {
  const router = useRouter();
  const submitting = useRef(false);

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

    if (submitting.current) return;

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanEmail || !password) {
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

    submitting.current = true;
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          password,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message ||
            result.error ||
            `Registration failed (${response.status}). Please try again.`
        );
      }

      setSuccess("Your account has been created. Redirecting to sign in...");
      router.replace("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account. Please try again."
      );
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  return (
    <main className="nc-register">
      <header className="nc-header">
        <Link href="/" className="nc-brand" aria-label="NovaCart home">
          <span className="nc-brand-icon">
            <ShoppingBag size={23} strokeWidth={2.5} />
          </span>
          <span className="nc-brand-name">
            Nova<span>Cart</span>
          </span>
        </Link>

        <div className="nc-header-account">
          <span>Already shopping with us?</span>
          <Link href="/login">Sign in</Link>
        </div>
      </header>

      <div className="nc-main">
        <section className="nc-showcase">
          <div className="nc-showcase-content">
            <span className="nc-eyebrow">
              YOUR SHOPPING JOURNEY STARTS HERE
            </span>

            <h1>
              Discover more.
              <br />
              Shop <span>smarter.</span>
            </h1>

            <p className="nc-showcase-description">
              One account for your shopping essentials. Discover products,
              manage your orders, and make every shopping experience simpler.
            </p>

            <div className="nc-benefits">
              <div className="nc-benefit">
                <span className="nc-benefit-icon">
                  <ShoppingBag size={20} />
                </span>
                <div>
                  <strong>Discover your favorites</strong>
                  <p>Explore fashion, accessories and more.</p>
                </div>
              </div>

              <div className="nc-benefit">
                <span className="nc-benefit-icon">
                  <CheckCircle2 size={20} />
                </span>
                <div>
                  <strong>Everything in one place</strong>
                  <p>Access your profile and order details.</p>
                </div>
              </div>

              <div className="nc-benefit">
                <span className="nc-benefit-icon">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <strong>Your account, your control</strong>
                  <p>Manage your account details whenever you need.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="nc-showcase-footer">
            <span className="nc-status-dot" />
            Welcome to a better way to shop.
          </div>

          <div className="nc-decoration nc-decoration-one" />
          <div className="nc-decoration nc-decoration-two" />
        </section>
        
        <section className="nc-form-panel">
          <div className="nc-form-heading">
            <span className="nc-form-eyebrow">JOIN NOVACART</span>
            <h2>Create your account</h2>
            <p>Fill in your details to get started.</p>
          </div>

          {error && (
            <div className="nc-message nc-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="nc-message nc-success" role="status">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} aria-busy={loading}>

            <label className="field-label" htmlFor="name">Full name</label>
            <div className="input-wrap">
              <UserRound size={19} />
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <label className="field-label" htmlFor="email">Email address</label>
            <div className="input-wrap">
              <Mail size={19} />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <label className="field-label" htmlFor="phone">Phone number</label>
            <div className="input-wrap">
              <Phone size={19} />
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>

            <label className="field-label" htmlFor="password">Password</label>
            <div className="input-wrap">
              <LockKeyhole size={19} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                disabled={loading}
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <label className="field-label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <div className="input-wrap">
              <ShieldCheck size={19} />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
                disabled={loading}
              />
            </div>

            <p className="terms-text">
              By creating an account, you agree to NovaCart's terms and
              acknowledge our privacy policy.
            </p>

            <button
              className="register-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>

          <div className="login-prompt">
            Already have an account? <Link href="/login">Sign in</Link>
          </div>

          <div className="secure-note">
            <ShieldCheck size={16} />
            Your information is protected by NovaCart.
          </div>
        </section>
      </div>

      <footer className="register-footer">
        © {new Date().getFullYear()} NovaCart. All rights reserved.
      </footer>

      <style jsx global>{`

        :root {
          color-scheme: light;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f1f3f6;
          font-family: Arial, Helvetica, sans-serif;
        }

        .register-page {
          min-height: 100vh;
          padding: 28px 20px 18px;
          color: #212121;
          background: #f1f3f6;
        }

        .register-header {
          width: 100%;
          max-width: 1040px;
          margin: 0 auto 22px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #2874f0;
          font-size: 27px;
          font-weight: 800;
          letter-spacing: -1px;
          text-decoration: none;
        }

        .brand-mark {
          display: grid;
          width: 36px;
          height: 36px;
          place-items: center;
          border-radius: 10px;
          color: #fff;
          background: #2874f0;
        }

        .register-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          width: 100%;
          max-width: 1040px;
          min-height: 610px;
          margin: 0 auto;
          overflow: hidden;
          border-radius: 12px;
          background: #fff;
          box-shadow: 0 8px 32px rgba(20, 40, 80, 0.08);
        }

        .showcase-panel {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 44px 38px;
          color: #fff;
          background: linear-gradient(145deg, #2874f0 0%, #1254b8 100%);
        }

        .showcase-panel h1 {
          margin: 0 0 16px;
          font-size: clamp(30px, 3vw, 42px);
          line-height: 1.15;
          letter-spacing: -1.2px;
        }

        .showcase-panel > div > p {
          margin: 0;
          color: rgba(255, 255, 255, 0.85);
          font-size: 15px;
          line-height: 1.8;
        }

        .benefits {
          display: grid;
          gap: 23px;
          margin-top: 38px;
        }

        .benefit {
          display: flex;
          align-items: flex-start;
          gap: 13px;
        }

        .benefit-icon {
          display: grid;
          flex: 0 0 42px;
          width: 42px;
          height: 42px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.24);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.12);
        }

        .benefit h3 {
          margin: 1px 0 5px;
          font-size: 15px;
        }

        .benefit p {
          margin: 0;
          color: rgba(255, 255, 255, 0.8);
          font-size: 13px;
          line-height: 1.6;
        }

        .showcase-bottom {
          margin-top: 38px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
        }

        .form-panel {
          padding: 38px 42px 30px;
        }

        .form-heading {
          margin-bottom: 26px;
        }

        .form-heading h2 {
          margin: 0 0 9px;
          color: #172337;
          font-size: 29px;
          letter-spacing: -0.8px;
        }

        .form-heading p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
        }

        .field-label {
          display: block;
          margin: 17px 0 8px;
          color: #374151;
          font-size: 13px;
          font-weight: 700;
        }

        .input-wrap {
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 48px;
          padding: 0 13px;
          border: 1px solid #d9dee7;
          border-radius: 7px;
          color: #7b8494;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input-wrap:focus-within {
          border-color: #2874f0;
          box-shadow: 0 0 0 3px rgba(40, 116, 240, 0.1);
        }

        .input-wrap input {
          width: 100%;
          min-width: 0;
          height: 46px;
          padding: 0;
          border: 0;
          outline: 0;
          color: #1f2937;
          background: transparent;
          font: inherit;
          font-size: 14px;
        }

        .input-wrap input::placeholder {
          color: #a0a7b4;
        }

        .input-wrap input:disabled {
          cursor: not-allowed;
        }

        .password-toggle {
          display: grid;
          flex: 0 0 28px;
          width: 28px;
          height: 32px;
          place-items: center;
          padding: 0;
          border: 0;
          color: #6b7280;
          background: transparent;
          cursor: pointer;
        }

        .password-toggle:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .terms-text {
          margin: 18px 0;
          color: #7b8494;
          font-size: 12px;
          line-height: 1.7;
        }

        .register-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          min-height: 49px;
          padding: 12px 18px;
          border: 0;
          border-radius: 7px;
          color: #fff;
          background: #fb641b;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .register-button:hover:not(:disabled) {
          background: #e95712;
          transform: translateY(-1px);
        }

        .register-button:disabled {
          cursor: wait;
          opacity: 0.75;
        }

        .spinner {
          display: inline-block;
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255, 255, 255, 0.45);
          border-top-color: #fff;
          border-radius: 50%;
          animation: register-spin 0.7s linear infinite;
        }

        @keyframes register-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .login-prompt {
          margin-top: 23px;
          color: #6b7280;
          font-size: 13px;
          text-align: center;
        }

        .login-prompt a {
          color: #2874f0;
          font-weight: 700;
          text-decoration: none;
        }

        .login-prompt a:hover {
          text-decoration: underline;
        }

        .secure-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 22px;
          color: #8a93a2;
          font-size: 12px;
        }

        .register-footer {
          max-width: 1040px;
          margin: 22px auto 0;
          color: #8a93a2;
          font-size: 12px;
          text-align: center;
        }

        @media (max-width: 760px) {
          .register-page {
            padding: 18px 14px;
          }

          .register-header {
            margin-bottom: 16px;
          }

          .register-layout {
            grid-template-columns: 1fr;
            max-width: 520px;
            min-height: auto;
          }

          .showcase-panel {
            padding: 25px 24px;
          }

          .showcase-panel h1 {
            font-size: 29px;
          }

          .benefits {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-top: 24px;
          }

          .showcase-bottom {
            margin-top: 24px;
          }

          .form-panel {
            padding: 28px 24px;
          }

          .form-heading {
            margin-bottom: 20px;
          }

          .form-heading h2 {
            font-size: 26px;
          }
        }

        @media (max-width: 380px) {
          .register-page {
            padding: 14px 10px;
          }

          .showcase-panel {
            padding: 22px 18px;
          }

          .form-panel {
            padding: 24px 17px;
          }

          .brand {
            font-size: 24px;
          }

          .showcase-panel h1 {
            font-size: 26px;
          }
        }
      `}</style>
    </main>
  );
}
