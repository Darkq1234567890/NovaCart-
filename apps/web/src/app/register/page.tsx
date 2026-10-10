
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";

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
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || result.error || "Registration failed."
        );
      }

      setSuccess("Your account has been created. Please sign in.");
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
    <main className="register-page">
      <section className="register-card">
        <Link href="/" className="brand">
          <ShoppingBag size={30} />
          <span>Nova<span className="accent">Cart</span></span>
        </Link>

        <h1>Create your account</h1>
        <p className="subtitle">
          Join NovaCart and discover something you love.
        </p>

        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}

        <form onSubmit={handleRegister}>
          <label htmlFor="name">Full name *</label>
          <input
            id="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your full name"
            required
          />

          <label htmlFor="email">Email address *</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Enter your phone number"
          />

          <label htmlFor="password">Password *</label>
          <div className="password-wrap">
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
              className="eye-button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <label htmlFor="confirmPassword">Confirm password *</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Enter your password again"
            required
          />

          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="signin">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>

        <Link href="/" className="back-home">
          Back to NovaCart
        </Link>
      </section>

      <style jsx global>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #f3f6fb;
        }
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px 16px;
          background: radial-gradient(circle at top left, #dcecff, transparent 42%), #f3f6fb;
        }
        .register-card {
          width: 100%;
          max-width: 460px;
          padding: 32px;
          border: 1px solid #e6eaf0;
          border-radius: 20px;
          background: #fff;
          box-shadow: 0 18px 55px rgba(20, 42, 80, .09);
        }
        .brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #1769d2;
          font-size: 27px;
          font-weight: 800;
          text-decoration: none;
        }
        .accent { color: #f28c28; }
        h1 {
          margin: 28px 0 8px;
          text-align: center;
          color: #172337;
          font-size: 27px;
        }
        .subtitle {
          margin: 0 0 24px;
          text-align: center;
          color: #697586;
          font-size: 14px;
          line-height: 1.6;
        }
        form { display: flex; flex-direction: column; gap: 9px; }
        label {
          margin-top: 7px;
          color: #263449;
          font-size: 13px;
          font-weight: 700;
        }
        input {
          width: 100%;
          min-height: 46px;
          padding: 12px 13px;
          border: 1px solid #d7deea;
          border-radius: 9px;
          background: #fff;
          color: #172337;
          font-size: 15px;
          outline: none;
        }
        input:focus {
          border-color: #1769d2;
          box-shadow: 0 0 0 3px rgba(23, 105, 210, .10);
        }
        .password-wrap { position: relative; }
        .password-wrap input { padding-right: 46px; }
        .eye-button {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border: 0;
          background: transparent;
          color: #697586;
          cursor: pointer;
        }
        .submit-button {
          min-height: 48px;
          margin-top: 16px;
          border: 0;
          border-radius: 9px;
          background: #1769d2;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }
        .submit-button:hover { background: #1056b3; }
        .submit-button:disabled { opacity: .65; cursor: wait; }
        .message {
          margin-bottom: 15px;
          padding: 12px;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.5;
        }
        .error { background: #fff0f0; color: #b42318; }
        .success { background: #ecfdf3; color: #067647; }
        .signin {
          margin: 22px 0 14px;
          text-align: center;
          color: #697586;
          font-size: 14px;
        }
        .signin a { color: #1769d2; font-weight: 700; text-decoration: none; }
        .back-home {
          display: block;
          text-align: center;
          color: #697586;
          font-size: 13px;
          text-decoration: none;
        }
        @media (max-width: 480px) {
          .register-card { padding: 25px 20px; }
          h1 { font-size: 24px; }
        }
      `}</style>
    </main>
  );
}
