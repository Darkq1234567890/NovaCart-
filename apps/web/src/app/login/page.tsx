
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://novacart-zpm6.onrender.com";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message ||
            result.error ||
            "Login failed. Please check your details and try again."
        );
      }

      const token =
        result.token ||
        result.accessToken ||
        result.data?.token ||
        result.data?.accessToken ||
        result.data?.access_token;

      if (!token || typeof token !== "string") {
        throw new Error(
          "The server did not return a login token. Please check the login API response."
        );
      }

      localStorage.setItem("token", token);
      localStorage.setItem("authToken", token);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("novacart_token", token);

      setSuccess("Login successful! Opening your account...");

      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (

    <main className="login-page">
      <div className="login-background login-background-one" />
      <div className="login-background login-background-two" />

      <div className="login-layout">
        <section className="login-brand-panel">
          <Link href="/" className="brand-logo">
            <span className="brand-icon">
              <ShoppingBag size={27} strokeWidth={2.5} />
            </span>
            <span>Nova<span className="brand-accent">Cart</span></span>
          </Link>

          <div className="brand-message">
            <span className="brand-eyebrow">
              YOUR EVERYDAY MARKETPLACE
            </span>

            <h1>
              Everything you love.
              <br />
              All in one place.
            </h1>

            <p>
              Discover fashion, lifestyle essentials and accessories
              from brands and sellers you can trust.
            </p>

            <div className="brand-benefits">
              <div className="benefit-item">
                <span className="benefit-check">✓</span>
                <span>Discover products you'll love</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-check">✓</span>
                <span>A simple, secure shopping experience</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-check">✓</span>
                <span>Your account, all in one place</span>
              </div>
            </div>
          </div>

          <div className="brand-footer">
            © {new Date().getFullYear()} NovaCart. All rights reserved.
          </div>
        </section>

        <section className="login-form-panel">
          <div className="mobile-brand">
            <Link href="/" className="brand-logo">
              <span className="brand-icon">
                <ShoppingBag size={24} strokeWidth={2.5} />
              </span>
              <span>Nova<span className="brand-accent">Cart</span></span>
            </Link>
          </div>

          <div className="form-heading">
            <div className="secure-icon">
              <LockKeyhole size={23} />
            </div>

            <span className="form-eyebrow">WELCOME BACK</span>
            <h2>Sign in to NovaCart</h2>
            <p>Enter your account details to continue shopping.</p>
          </div>

          {error && (
            <div className="message-box error-message" role="alert">
              <span className="message-symbol">!</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="message-box success-message" role="status">
              {success}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <label htmlFor="login-email">Email address</label>

            <div className="input-wrapper">
              <Mail size={19} className="input-icon" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="password-label-row">
              <label htmlFor="login-password">Password</label>
            </div>

            <div className="input-wrapper">
              <LockKeyhole size={19} className="input-icon" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={loading}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in to your account"}
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <div className="login-divider">
            <span>NEW TO NOVACART?</span>
          </div>

          <Link href="/register" className="register-link">
            Create an account
            <ArrowRight size={17} />
          </Link>

          <div className="security-note">
            <ShieldCheck size={18} />
            <span>Your account information is protected.</span>
          </div>
        </section>
      </div>
    </main>
  );
}

<style jsx global>{`
  * {
    box-sizing: border-box;
  }

  .login-page {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    background: #f4f7fb;
    color: #172337;
    font-family: Arial, Helvetica, sans-serif;
  }

  .login-background {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(2px);
  }

  .login-background-one {
    width: 440px;
    height: 440px;
    background: #dceaff;
    top: -220px;
    right: -100px;
    opacity: 0.7;
  }

  .login-background-two {
    width: 380px;
    height: 380px;
    background: #e2e8ff;
    bottom: -220px;
    left: -120px;
    opacity: 0.65;
  }

  .login-layout {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1080px;
    min-height: 640px;
    display: grid;
    grid-template-columns: 1fr 0.9fr;
    overflow: hidden;
    background: #fff;
    border: 1px solid #e6ebf3;
    border-radius: 24px;
    box-shadow: 0 24px 70px rgba(28, 54, 94, 0.12);
  }

  .login-brand-panel {
    padding: 48px 46px 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #fff;
    background: linear-gradient(145deg, #0755b8 0%, #0c73dc 55%, #1254b4 100%);
  }

  .brand-logo {
    display: inline-flex;
    align-items: center;
    gap: 11px;
    width: fit-content;
    color: inherit;
    text-decoration: none;
    font-size: 27px;
    font-weight: 850;
    letter-spacing: -1px;
  }

  .brand-icon {
    width: 46px;
    height: 46px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #075ac5;
    background: #fff;
    border-radius: 14px;
  }

  .brand-accent {
    color: #ffdb70;
  }

  .brand-message {
    margin: 70px 0;
  }

  .brand-eyebrow,
  .form-eyebrow {
    display: block;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
  }

  .brand-eyebrow {
    color: #c7e0ff;
  }

  .brand-message h1 {
    margin: 20px 0 17px;
    font-size: clamp(34px, 4vw, 47px);
    line-height: 1.16;
    letter-spacing: -1.7px;
    font-weight: 850;
  }

  .brand-message > p {
    max-width: 370px;
    color: #e0edff;
    font-size: 15px;
    line-height: 1.8;
  }

  .brand-benefits {
    display: grid;
    gap: 17px;
    margin-top: 32px;
  }

  .benefit-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: #f0f6ff;
  }

  .benefit-check {
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 50%;
    color: #0755b8;
    background: #fff;
    font-weight: 900;
  }

  .brand-footer {
    color: #c7dfff;
    font-size: 11px;
  }

  .login-form-panel {
    padding: 55px 48px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .mobile-brand {
    display: none;
  }

  .form-heading {
    margin-bottom: 30px;
  }

  .secure-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    color: #1264c8;
    background: #eaf3ff;
    border-radius: 15px;
  }

  .form-eyebrow {
    color: #1264c8;
    margin-bottom: 10px;
  }

  .form-heading h2 {
    margin: 0 0 12px;
    color: #172337;
    font-size: clamp(25px, 3vw, 31px);
    font-weight: 850;
    letter-spacing: -1px;
  }

  .form-heading p {
    margin: 0;
    color: #77849a;
    font-size: 13px;
    line-height: 1.7;
  }

  .login-form {
    display: flex;
    flex-direction: column;
  }

  .login-form label {
    margin-bottom: 9px;
    color: #344158;
    font-size: 12px;
    font-weight: 750;
  }

  .input-wrapper {
    height: 53px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 15px;
    margin-bottom: 22px;
    border: 1px solid #dce3ed;
    border-radius: 11px;
    background: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .input-wrapper:focus-within {
    border-color: #2478db;
    box-shadow: 0 0 0 3px rgba(36, 120, 219, 0.1);
  }

  .input-icon {
    flex-shrink: 0;
    color: #8c9ab0;
  }

  .input-wrapper input {
    width: 100%;
    min-width: 0;
    height: 100%;
    padding: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: #172337;
    font: inherit;
    font-size: 13px;
  }

  .input-wrapper input::placeholder {
    color: #a5afbe;
  }

  .password-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 5px;
    border: 0;
    color: #8794a8;
    background: transparent;
    cursor: pointer;
  }

  .login-submit {
    min-height: 53px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 3px;
    padding: 0 18px;
    border: 0;
    border-radius: 11px;
    color: #fff;
    background: #1769d2;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 7px 16px rgba(23, 105, 210, 0.19);
    transition: background 0.2s, transform 0.2s;
  }

  .login-submit:hover {
    background: #0958bd;
    transform: translateY(-1px);
  }

  .login-submit:disabled {
    opacity: 0.65;
    cursor: wait;
    transform: none;
  }

  .message-box {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 13px;
    margin-bottom: 20px;
    border-radius: 10px;
    font-size: 12px;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  .error-message {
    color: #a82727;
    background: #fff0f0;
    border: 1px solid #ffd5d5;
  }

  .success-message {
    color: #176c3a;
    background: #edfff4;
    border: 1px solid #c9f1d8;
  }

  .message-symbol {
    font-weight: 900;
  }

  .login-divider {
    display: flex;
    align-items: center;
    gap: 13px;
    margin: 29px 0 18px;
    color: #9aa5b5;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1px;
  }

  .login-divider::before,
  .login-divider::after {
    content: "";
    height: 1px;
    flex: 1;
    background: #e8edf4;
  }

  .register-link {
    min-height: 49px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    border: 1px solid #d9e4f2;
    border-radius: 11px;
    color: #1769d2;
    background: #fff;
    text-decoration: none;
    font-size: 13px;
    font-weight: 800;
    transition: background 0.2s, border-color 0.2s;
  }

  .register-link:hover {
    background: #f2f7ff;
    border-color: #9bbce9;
  }

  .security-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 25px;
    color: #8290a4;
    font-size: 11px;
  }

  .security-note svg {
    color: #27905b;
    flex-shrink: 0;
  }

  @media (max-width: 800px) {
    .login-page {
      padding: 22px 16px;
    }

    .login-layout {
      max-width: 500px;
      min-height: auto;
      grid-template-columns: 1fr;
      border-radius: 20px;
    }

    .login-brand-panel {
      display: none;
    }

    .login-form-panel {
      padding: 30px 26px 32px;
    }

    .mobile-brand {
      display: block;
      margin-bottom: 35px;
    }

    .mobile-brand .brand-logo {
      color: #172337;
      font-size: 24px;
    }

    .mobile-brand .brand-icon {
      color: #fff;
      background: #1769d2;
      width: 41px;
      height: 41px;
      border-radius: 12px;
    }

    .mobile-brand .brand-accent {
      color: #1769d2;
    }

    .form-heading {
      margin-bottom: 25px;
    }

    .secure-icon {
      margin-bottom: 18px;
    }
  }

  @media (max-width: 380px) {
    .login-page {
      padding: 12px 8px;
    }

    .login-form-panel {
      padding: 24px 18px;
    }

    .form-heading h2 {
      font-size: 25px;
    }
  }
`}</style>
