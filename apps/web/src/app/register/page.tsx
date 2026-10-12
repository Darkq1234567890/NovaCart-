"use client";

import { useRef, useState, type FormEvent } from "react";
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
  UserRound,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://novacart-zpm6.onrender.com";

type ApiResult = {
  success?: boolean;
  message?: string;
  error?: string;
  email?: string;
  secondsRemaining?: number;
  attemptsRemaining?: number;
};

export default function RegisterPage() {
  const router = useRouter();
  const submitting = useRef(false);

  const [step, setStep] = useState<"register" | "verify">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);

  async function request(
    endpoint: string,
    body: Record<string, string>
  ): Promise<ApiResult> {
    const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result: ApiResult = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      throw new Error(
        result.message ||
          result.error ||
          `Request failed (${response.status}). Please try again.`
      );
    }

    return result;
  }

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
      const result = await request("register", {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password,
      });

      setEmail(result.email || cleanEmail);
      setStep("verify");
      setOtp("");
      setResendSeconds(60);
      setSuccess("Verification code sent. Check your email inbox and spam folder.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start registration. Please try again."
      );
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }
  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the six-digit code sent to your email.");
      return;
    }

    submitting.current = true;
    setLoading(true);

    try {
      await request("verify-email-otp", {
        email: email.trim().toLowerCase(),
        otp,
      });

      setSuccess("Your email is verified. Redirecting to sign in...");
      window.setTimeout(() => router.replace("/login"), 900);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again."
      );
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resending || resendSeconds > 0) return;

    setError("");
    setSuccess("");
    setResending(true);

    try {
      const result = await request("resend-email-otp", {
        email: email.trim().toLowerCase(),
      });

      setOtp("");
      setResendSeconds(60);
      setSuccess(result.message || "A new verification code has been sent.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to resend the verification code."
      );
    } finally {
      setResending(false);
    }
  }
  return (
    <main className="nc-register">
      <header className="nc-header">
        <Link href="/" className="nc-brand" aria-label="NovaCart home">
          <span className="nc-brand-icon">
            <ShoppingBag size={23} />
          </span>
          <span>Nova<span className="nc-brand-accent">Cart</span></span>
        </Link>

        <Link href="/login" className="nc-header-link">
          Already have an account? <strong>Sign in</strong>
        </Link>
      </header>

      <section className="nc-main">
        <aside className="nc-showcase">
          <div className="nc-showcase-badge">
            <ShieldCheck size={16} />
            Shopping made simple
          </div>

          <h1>
            Your next favorite
            <br />
            thing is <span>waiting.</span>
          </h1>

          <p className="nc-showcase-description">
            Discover fashion, accessories, and everyday essentials from
            one convenient place.
          </p>

          <div className="nc-feature-list">
            <div className="nc-feature">
              <span className="nc-feature-icon"><CheckCircle2 size={19} /></span>
              <div>
                <strong>A better way to shop</strong>
                <p>Explore products in one place.</p>
              </div>
            </div>

            <div className="nc-feature">
              <span className="nc-feature-icon"><ShieldCheck size={19} /></span>
              <div>
                <strong>Email verification</strong>
                <p>Help keep your account secure.</p>
              </div>
            </div>

            <div className="nc-feature">
              <span className="nc-feature-icon"><LockKeyhole size={19} /></span>
              <div>
                <strong>Your account, your way</strong>
                <p>Manage your details after signing in.</p>
              </div>
            </div>
          </div>

          <div className="nc-showcase-bottom">
            <span className="nc-showcase-dot" />
            Welcome to a smarter shopping experience
          </div>
        </aside>

        <section className="nc-form-panel">
          <div className="nc-form-heading">
            <div className="nc-mobile-icon">
              <ShoppingBag size={23} />
            </div>

            <p className="nc-eyebrow">
              {step === "register" ? "JOIN NOVACART" : "EMAIL VERIFICATION"}
            </p>

            <h2>
              {step === "register"
                ? "Create your account"
                : "Verify your email"}
            </h2>

            <p className="nc-form-subtitle">
              {step === "register"
                ? "Create an account to get started with NovaCart."
                : `We've sent a six-digit verification code to ${email}.`}
            </p>
          </div>

          {error && (
            <div className="nc-alert nc-alert-error" role="alert">
              <span className="nc-alert-symbol">!</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="nc-alert nc-alert-success" role="status">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          {step === "register" ? (
            <form className="nc-form" onSubmit={handleRegister}>
              <label className="nc-label" htmlFor="register-name">
                Full name
              </label>
              <div className="nc-input-wrap">
                <UserRound size={19} className="nc-input-icon" />
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={100}
                  required
                  disabled={loading}
                />
              </div>

              <label className="nc-label" htmlFor="register-email">
                Email address
              </label>
              <div className="nc-input-wrap">
                <Mail size={19} className="nc-input-icon" />
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <label className="nc-label" htmlFor="register-phone">
                Phone number <span className="nc-optional">Optional</span>
              </label>
              <div className="nc-input-wrap">
                <Phone size={19} className="nc-input-icon" />
                <input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  maxLength={20}
                  disabled={loading}
                />
              </div>

              <label className="nc-label" htmlFor="register-password">
                Password
              </label>
              <div className="nc-input-wrap">
                <LockKeyhole size={19} className="nc-input-icon" />
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={6}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="nc-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              <label className="nc-label" htmlFor="register-confirm-password">
                Confirm password
              </label>
              <div className="nc-input-wrap">
                <LockKeyhole size={19} className="nc-input-icon" />
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your password again"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="nc-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              <p className="nc-terms">
                By creating an account, you agree to use NovaCart responsibly
                and keep your sign-in details secure.
              </p>

              <button
                type="submit"
                className="nc-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="nc-spinner" />
                    Sending verification code...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form className="nc-form" onSubmit={handleVerify}>
              <label className="nc-label" htmlFor="register-otp">
                Six-digit verification code
              </label>

              <input
                id="register-otp"
                name="otp"
                className="nc-otp-input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                pattern="[0-9]{6}"
                required
                disabled={loading}
              />

              <p className="nc-otp-help">
                Check your inbox and spam folder. The code expires after
                10 minutes.
              </p>

              <button
                type="submit"
                className="nc-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="nc-spinner" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify email
                    <ArrowRight size={19} />
                  </>
                )}
              </button>

              <button
                type="button"
                className="nc-secondary-button"
                onClick={handleResend}
                disabled={resending || resendSeconds > 0}
              >
                {resending
                  ? "Sending new code..."
                  : resendSeconds > 0
                    ? `Resend code in ${resendSeconds}s`
                    : "Resend verification code"}
              </button>

              <button
                type="button"
                className="nc-back-button"
                onClick={() => {
                  setStep("register");
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
                disabled={loading || resending}
              >
                <ArrowLeft size={17} />
                Back to registration
              </button>
            </form>
          )}

          <div className="nc-form-footer">
            Already registered? <Link href="/login">Sign in here</Link>
          </div>
        </section>
      </section>

      <footer className="nc-page-footer">
        <span>© {new Date().getFullYear()} NovaCart</span>
        <span>Shopping made simple.</span>
      </footer>
    </main>
  );
}