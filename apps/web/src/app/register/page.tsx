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
const styles = `
.nc-register {
  --nc-blue: #1769e0;
  --nc-blue-dark: #1054bd;
  --nc-ink: #172033;
  --nc-muted: #697586;
  min-height: 100vh;
  background: #f4f7fc;
  color: var(--nc-ink);
  font-family: Arial, Helvetica, sans-serif;
}
.nc-register * { box-sizing: border-box; }
.nc-header {
  min-height: 76px;
  padding: 16px clamp(18px, 5vw, 72px);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #e8edf5;
}
.nc-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--nc-ink);
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -.8px;
}
.nc-brand-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  color: #fff;
  background: var(--nc-blue);
  border-radius: 13px;
}
.nc-brand-accent { color: var(--nc-blue); }
.nc-header-link {
  color: #647084;
  text-decoration: none;
  font-size: 13px;
}
.nc-header-link strong { color: var(--nc-blue); margin-left: 4px; }
.nc-main {
  width: min(1120px, calc(100% - 40px));
  margin: 44px auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: stretch;
  background: #fff;
  border: 1px solid #e6ebf3;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 18px 55px rgba(27, 52, 91, .08);
}
.nc-showcase {
  padding: clamp(30px, 4vw, 55px);
  color: #fff;
  background: linear-gradient(145deg, #0d3b83 0%, #1769e0 58%, #3989fa 100%);
  display: flex;
  flex-direction: column;
  min-height: 680px;
}
.nc-showcase-badge {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 8px;
  padding: 9px 12px;
  border: 1px solid rgba(255,255,255,.27);
  border-radius: 30px;
  background: rgba(255,255,255,.10);
  font-size: 12px;
}
.nc-showcase h1 {
  margin: 38px 0 16px;
  font-size: clamp(32px, 4vw, 45px);
  line-height: 1.13;
  letter-spacing: -1.5px;
}
.nc-showcase h1 span { color: #c5e2ff; }
.nc-showcase-description {
  max-width: 370px;
  margin: 0;
  color: #e0edff;
  font-size: 15px;
  line-height: 1.8;
}
.nc-feature-list { display: grid; gap: 24px; margin-top: 42px; }
.nc-feature { display: flex; gap: 13px; align-items: flex-start; }
.nc-feature-icon {
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(255,255,255,.14);
}
.nc-feature strong { display: block; margin: 2px 0 6px; font-size: 14px; }
.nc-feature p { margin: 0; color: #dceaff; font-size: 12px; line-height: 1.6; }
.nc-showcase-bottom {
  margin-top: auto;
  padding-top: 35px;
  display: flex;
  align-items: center;
  gap: 9px;
  color: #dceaff;
  font-size: 11px;
}
.nc-showcase-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #8ff0c1;
}
.nc-form-panel { padding: clamp(28px, 4vw, 52px); min-width: 0; }
.nc-form-heading { margin-bottom: 27px; }
.nc-mobile-icon {
  display: none;
  width: 46px;
  height: 46px;
  margin-bottom: 22px;
  place-items: center;
  color: var(--nc-blue);
  background: #edf4ff;
  border-radius: 14px;
}
.nc-eyebrow {
  margin: 0 0 10px;
  color: var(--nc-blue);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.7px;
}
.nc-form-heading h2 {
  margin: 0 0 10px;
  font-size: clamp(25px, 3vw, 31px);
  letter-spacing: -.8px;
}
.nc-form-subtitle { margin: 0; color: var(--nc-muted); font-size: 13px; line-height: 1.7; overflow-wrap: anywhere; }
.nc-form { display: flex; flex-direction: column; }
.nc-label { margin: 0 0 8px; font-size: 12px; font-weight: 700; color: #303c50; }
.nc-optional { float: right; color: #8a95a5; font-size: 11px; font-weight: 400; }
.nc-input-wrap {
  width: 100%;
  height: 49px;
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 18px;
  padding: 0 13px;
  border: 1px solid #dce3ed;
  border-radius: 10px;
  background: #fff;
  transition: border-color .2s, box-shadow .2s;
}
.nc-input-wrap:focus-within {
  border-color: var(--nc-blue);
  box-shadow: 0 0 0 3px rgba(23,105,224,.10);
}
.nc-input-icon { flex-shrink: 0; color: #8a97aa; }
.nc-input-wrap input {
  min-width: 0;
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--nc-ink);
  font: inherit;
  font-size: 13px;
}
.nc-input-wrap input::placeholder { color: #a1aaba; }
.nc-input-wrap input:disabled { opacity: .65; }
.nc-password-toggle {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  padding: 4px;
  border: 0;
  color: #7e8ba0;
  background: transparent;
  cursor: pointer;
}
.nc-terms { margin: 0 0 20px; color: #818b9b; font-size: 11px; line-height: 1.7; }
.nc-submit {
  width: 100%;
  min-height: 49px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 10px;
  background: var(--nc-blue);
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background .2s, transform .2s;
}
.nc-submit:hover:not(:disabled) { background: var(--nc-blue-dark); transform: translateY(-1px); }
.nc-submit:disabled { opacity: .7; cursor: not-allowed; }
.nc-spinner {
  width: 17px;
  height: 17px;
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: nc-spin .7s linear infinite;
}
@keyframes nc-spin { to { transform: rotate(360deg); } }
.nc-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 0 0 18px;
  padding: 12px;
  border-radius: 9px;
  font-size: 12px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
.nc-alert-error { color: #a72b35; background: #fff0f0; border: 1px solid #ffd8dc; }
.nc-alert-success { color: #167447; background: #edfbf3; border: 1px solid #ccefdc; }
.nc-alert-symbol { flex-shrink: 0; font-weight: 800; }
.nc-otp-input {
  width: 100%;
  min-height: 62px;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid #dce3ed;
  border-radius: 12px;
  outline: none;
  text-align: center;
  font: inherit;
  font-size: 27px;
  font-weight: 800;
  letter-spacing: 10px;
}
.nc-otp-input:focus { border-color: var(--nc-blue); box-shadow: 0 0 0 3px rgba(23,105,224,.10); }
.nc-otp-help { margin: 0 0 23px; color: var(--nc-muted); font-size: 12px; line-height: 1.7; }
.nc-secondary-button, .nc-back-button {
  width: 100%;
  min-height: 44px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #dce3ed;
  border-radius: 10px;
  background: #fff;
  color: #344156;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.nc-secondary-button:disabled, .nc-back-button:disabled { opacity: .55; cursor: not-allowed; }
.nc-back-button { border-color: transparent; color: #66748a; }
.nc-form-footer {
  margin-top: 27px;
  padding-top: 20px;
  border-top: 1px solid #edf0f5;
  text-align: center;
  color: #778296;
  font-size: 12px;
}
.nc-form-footer a { color: var(--nc-blue); font-weight: 700; text-decoration: none; }
.nc-page-footer {
  display: flex;
  justify-content: center;
  gap: 18px;
  padding: 0 16px 28px;
  color: #8a95a5;
  font-size: 11px;
}
@media (max-width: 850px) {
  .nc-main { width: min(570px, calc(100% - 28px)); margin: 25px auto; grid-template-columns: 1fr; }
  .nc-showcase { display: none; }
  .nc-form-panel { padding: clamp(25px, 6vw, 42px); }
  .nc-mobile-icon { display: grid; }
  .nc-form-heading h2 { font-size: 28px; }
}
@media (max-width: 480px) {
  .nc-header { min-height: 66px; padding: 12px 16px; }
  .nc-brand { gap: 8px; font-size: 22px; }
  .nc-brand-icon { width: 37px; height: 37px; border-radius: 11px; }
  .nc-header-link { font-size: 11px; text-align: right; }
  .nc-main { width: calc(100% - 20px); margin: 15px auto 24px; border-radius: 17px; }
  .nc-form-panel { padding: 25px 19px; }
  .nc-form-heading { margin-bottom: 23px; }
  .nc-form-heading h2 { font-size: 25px; }
  .nc-input-wrap { height: 47px; margin-bottom: 16px; }
  .nc-page-footer { flex-wrap: wrap; gap: 6px 14px; padding-bottom: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .nc-spinner { animation: none; }
  .nc-submit { transition: none; }
}
`;