"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "https://novacart-zpm6.onrender.com";

type AccountUser = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  avatar?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  createdAt?: string;
};

function getAuthToken(): string {
  if (typeof window === "undefined") return "";

  const possibleKeys = [
    "token",
    "authToken",
    "accessToken",
    "novacart_token",
    "novacartToken",
    "jwt",
  ];

  for (const key of possibleKeys) {
    const stored = window.localStorage.getItem(key);
    if (!stored) continue;

    try {
      const parsed = JSON.parse(stored);

      if (typeof parsed === "string") return parsed;

      if (parsed && typeof parsed === "object") {
        const value =
          parsed.token || parsed.accessToken || parsed.jwt;

        if (typeof value === "string") return value;
      }
    } catch {
      return stored;
    }
  }

  return "";
}

async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      "LOGIN_REQUIRED: No login token was found. Please log in first."
    );
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: "no-store",
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message ||
        result.error ||
        `Request failed with status ${response.status}`
    );
  }

  return result;
}

function getUserFromResponse(result: any): AccountUser {
  return (
    result?.user ||
    result?.data?.user ||
    result?.data ||
    result
  );
}

function formatDate(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AccountPage() {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const result = await apiRequest("/api/users/me");
      const accountUser = getUserFromResponse(result);

      if (!accountUser || typeof accountUser !== "object") {
        throw new Error("The server returned an invalid profile.");
      }

      setUser(accountUser);
      setName(accountUser.name || "");
      setPhone(accountUser.phone || "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your account."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  async function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setSavingProfile(true);

    try {
      const result = await apiRequest("/api/users/me", {
        method: "PUT",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
        }),
      });

      const updatedUser = getUserFromResponse(result);

      setUser((previous) => ({
        ...previous,
        ...updatedUser,
        name: updatedUser.name || name.trim(),
        phone:
          updatedUser.phone !== undefined
            ? updatedUser.phone
            : phone.trim(),
      }));

      setName(updatedUser.name || name.trim());
      setPhone(
        updatedUser.phone !== undefined
          ? updatedUser.phone
          : phone.trim()
      );

      setEditing(false);
      setNotice("Your profile has been updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Your new password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The new password and confirmation do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      await apiRequest("/api/users/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNotice("Your password has been changed successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to change your password."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  const initials = (user?.name || "NovaCart")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <main className="account-page">
      <div className="account-container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <span>My Account</span>
        </nav>

        <header className="account-heading">
          <div>
            <p className="eyebrow">YOUR NOVACART</p>
            <h1>My Account</h1>
            <p className="heading-description">
              Manage your personal information and account security.
            </p>
          </div>

          <a className="store-link" href="/">
            <span aria-hidden="true">←</span> Continue shopping
          </a>
        </header>

        {error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon" aria-hidden="true">!</span>
            <div>
              <strong>Something needs your attention</strong>
              <p>{error}</p>
              {error.includes("LOGIN_REQUIRED") && (
                <p className="login-help">
                  Sign in to your NovaCart account, then return here.
                </p>
              )}
            </div>
            <button
              className="alert-close"
              type="button"
              aria-label="Dismiss error"
              onClick={() => setError("")}
            >
              ×
            </button>
          </div>
        )}

        {notice && (
          <div className="alert alert-success" role="status">
            <span className="success-icon" aria-hidden="true">✓</span>
            <p>{notice}</p>
            <button
              className="alert-close"
              type="button"
              aria-label="Dismiss message"
              onClick={() => setNotice("")}
            >
              ×
            </button>
          </div>
        )}

        {loading ? (
          <section className="loading-panel" aria-live="polite">
            <div className="spinner" />
            <h2>Loading your account</h2>
            <p>Please wait while we retrieve your profile.</p>
          </section>
        ) : !user ? (
          <section className="empty-panel">
            <div className="empty-icon" aria-hidden="true">♙</div>
            <h2>Your account could not be loaded</h2>
            <p>
              Check that you are signed in and try loading your profile
              again.
            </p>
            <button
              className="primary-button"
              type="button"
              onClick={() => void loadProfile()}
            >
              Try again
            </button>
            <a className="text-link" href="/login">
              Go to login
            </a>
          </section>
        ) : (
          <>
            <section className="welcome-card">
              <div className="welcome-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" />
                ) : (
                  <span>{initials || "N"}</span>
                )}
              </div>

              <div className="welcome-copy">
                <p className="welcome-label">WELCOME BACK</p>
                <h2>{user.name || "NovaCart Customer"}</h2>
                <p>{user.email || "Email not available"}</p>
              </div>

              <div className="account-badge">
                <span className="badge-dot" />
                {(user.role || "customer").replace(/_/g, " ")}
              </div>
            </section>

            <div className="account-layout">
              <aside className="account-sidebar">
                <div className="sidebar-title">ACCOUNT SETTINGS</div>

                <a className="sidebar-item active" href="#profile">
                  <span className="sidebar-icon" aria-hidden="true">♙</span>
                  <span>
                    <strong>Personal information</strong>
                    <small>Your name and contact details</small>
                  </span>
                  <span className="sidebar-arrow">›</span>
                </a>

                <a className="sidebar-item" href="#security">
                  <span className="sidebar-icon" aria-hidden="true">⌑</span>
                  <span>
                    <strong>Login & security</strong>
                    <small>Keep your account protected</small>
                  </span>
                  <span className="sidebar-arrow">›</span>
                </a>

                <a className="sidebar-item" href="/">
                  <span className="sidebar-icon" aria-hidden="true">⌂</span>
                  <span>
                    <strong>Continue shopping</strong>
                    <small>Explore NovaCart products</small>
                  </span>
                  <span className="sidebar-arrow">›</span>
                </a>

                <div className="sidebar-help">
                  <div className="help-symbol" aria-hidden="true">?</div>
                  <strong>Need help?</strong>
                  <p>
                    If you need assistance with your account, contact
                    NovaCart support.
                  </p>
                  <a href="mailto:support@novacart.com">
                    Contact support →
                  </a>
                </div>
              </aside>

              <div className="account-content">
                <section className="content-card" id="profile">
                  <div className="card-heading">
                    <div>
                      <h2>Personal information</h2>
                      <p>
                        Review and update your profile details.
                      </p>
                    </div>

                    {!editing && (
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                          setName(user.name || "");
                          setPhone(user.phone || "");
                          setEditing(true);
                          setError("");
                          setNotice("");
                        }}
                      >
                        Edit profile
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveProfile}>
                    <div className="form-grid">
                      <div className="field">
                        <label htmlFor="account-name">Full name</label>
                        <input
                          id="account-name"
                          type="text"
                          autoComplete="name"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Enter your full name"
                          disabled={!editing || savingProfile}
                          required
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="account-email">Email address</label>
                        <input
                          id="account-email"
                          type="email"
                          value={user.email || ""}
                          disabled
                          readOnly
                        />
                        <small>Email address cannot be edited here.</small>
                      </div>

                      <div className="field">
                        <label htmlFor="account-phone">Phone number</label>
                        <input
                          id="account-phone"
                          type="tel"
                          autoComplete="tel"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          placeholder="Enter your phone number"
                          disabled={!editing || savingProfile}
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="account-role">Account type</label>
                        <input
                          id="account-role"
                          type="text"
                          value={(user.role || "customer").replace(/_/g, " ")}
                          disabled
                          readOnly
                        />
                      </div>
                    </div>

                    {editing && (
                      <div className="form-actions">
                        <button
                          type="button"
                          className="cancel-button"
                          disabled={savingProfile}
                          onClick={() => {
                            setName(user.name || "");
                            setPhone(user.phone || "");
                            setEditing(false);
                            setError("");
                          }}
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className="primary-button"
                          disabled={savingProfile}
                        >
                          {savingProfile ? "Saving..." : "Save changes"}
                        </button>
                      </div>
                    )}
                  </form>
                </section>
                             <section className="content-card" id="security">
                  <div className="card-heading">
                    <div>
                      <h2>Login & security</h2>
                      <p>
                        Change your password to help protect your account.
                      </p>
                    </div>
                    <span className="security-symbol" aria-hidden="true">
                      ✓
                    </span>
                  </div>

                  <form onSubmit={handleChangePassword}>
                    <div className="password-fields">
                      <div className="field">
                        <label htmlFor="current-password">
                          Current password
                        </label>
                        <input
                          id="current-password"
                          type="password"
                          autoComplete="current-password"
                          value={currentPassword}
                          onChange={(event) =>
                            setCurrentPassword(event.target.value)
                          }
                          placeholder="Enter current password"
                          disabled={changingPassword}
                          required
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="new-password">New password</label>
                        <input
                          id="new-password"
                          type="password"
                          autoComplete="new-password"
                          value={newPassword}
                          onChange={(event) =>
                            setNewPassword(event.target.value)
                          }
                          placeholder="At least 6 characters"
                          minLength={6}
                          disabled={changingPassword}
                          required
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="confirm-password">
                          Confirm new password
                        </label>
                        <input
                          id="confirm-password"
                          type="password"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          placeholder="Enter new password again"
                          minLength={6}
                          disabled={changingPassword}
                          required
                        />
                      </div>
                    </div>

                    <div className="password-note">
                      <span aria-hidden="true">ⓘ</span>
                      Choose a password that you do not use on other
                      websites.
                    </div>

                    <div className="form-actions">
                      <button
                        type="submit"
                        className="primary-button"
                        disabled={changingPassword}
                      >
                        {changingPassword
                          ? "Updating password..."
                          : "Update password"}
                      </button>
                    </div>
                  </form>
                </section>

                <section className="content-card account-details">
                  <div className="card-heading">
                    <div>
                      <h2>Account overview</h2>
                      <p>Details associated with your NovaCart account.</p>
                    </div>
                  </div>

                  <div className="overview-row">
                    <div>
                      <span className="overview-label">Account status</span>
                      <strong className="overview-value">
                        {user.status || "Active"}
                      </strong>
                    </div>
                    <span className="status-indicator">
                      <span />
                      {user.status || "Active"}
                    </span>
                  </div>

                  <div className="overview-row">
                    <div>
                      <span className="overview-label">Email verification</span>
                      <strong className="overview-value">
                        {user.isEmailVerified ? "Verified" : "Not verified"}
                      </strong>
                    </div>
                    <span
                      className={
                        user.isEmailVerified
                          ? "verification-tag verified"
                          : "verification-tag"
                      }
                    >
                      {user.isEmailVerified ? "✓ Verified" : "Pending"}
                    </span>
                  </div>

                  <div className="overview-row">
                    <div>
                      <span className="overview-label">Phone verification</span>
                      <strong className="overview-value">
                        {user.isPhoneVerified ? "Verified" : "Not verified"}
                      </strong>
                    </div>
                    <span
                      className={
                        user.isPhoneVerified
                          ? "verification-tag verified"
                          : "verification-tag"
                      }
                    >
                      {user.isPhoneVerified ? "✓ Verified" : "Pending"}
                    </span>
                  </div>

                  <div className="overview-row">
                    <div>
                      <span className="overview-label">Member since</span>
                      <strong className="overview-value">
                        {formatDate(user.createdAt)}
                      </strong>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </>
        )}

        <footer className="account-footer">
          <a href="/">NovaCart Home</a>
          <span>•</span>
          <span>Shopping made simple.</span>
        </footer>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #f5f7fb;
          color: #172337;
          font-family: Arial, Helvetica, sans-serif;
        }

        .account-page {
          min-height: 100vh;
          padding: 24px 20px 40px;
          background: #f5f7fb;
        }

        .account-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          color: #8a94a6;
          font-size: 13px;
        }

        .breadcrumbs a,
        .store-link,
        .text-link {
          color: #1768d2;
          text-decoration: none;
        }

        .breadcrumbs a:hover,
        .store-link:hover,
        .text-link:hover {
          text-decoration: underline;
        }

        .account-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 26px;
        }

        .eyebrow,
        .welcome-label {
          margin: 0 0 8px;
          color: #1768d2;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .account-heading h1 {
          margin: 0;
          color: #152238;
          font-size: clamp(28px, 4vw, 36px);
          font-weight: 750;
          letter-spacing: -1px;
        }

        .heading-description {
          margin: 10px 0 0;
          color: #69758a;
          font-size: 14px;
          line-height: 1.6;
        }

        .store-link {
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
        }

        .store-link span {
          font-size: 18px;
        }

        .alert {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 20px;
          padding: 15px 16px;
          border: 1px solid;
          border-radius: 10px;
        }

        .alert-error {
          border-color: #f0c7c7;
          background: #fff7f7;
          color: #9f2929;
        }

        .alert-success {
          align-items: center;
          border-color: #bde8d0;
          background: #f1fcf5;
          color: #176b42;
        }

        .alert-icon,
        .success-icon {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          font-size: 13px;
          font-weight: 800;
        }

        .alert-icon {
          background: #ffe2e2;
        }

        .success-icon {
          background: #d7f6e4;
        }

        .alert strong {
          font-size: 13px;
        }

        .alert p {
          margin: 4px 0 0;
          overflow-wrap: anywhere;
          font-size: 13px;
          line-height: 1.6;
        }

        .alert .login-help {
          margin-top: 8px;
        }

        .alert-close {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          font-size: 22px;
          cursor: pointer;
        }

        .welcome-card {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 24px;
          padding: 25px;
          border: 1px solid #e9edf4;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 3px 14px rgb(25 45 75 / 4%);
        }

        .welcome-avatar {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 68px;
          height: 68px;
          overflow: hidden;
          border-radius: 50%;
          background: #e6efff;
          color: #175cc0;
          font-size: 25px;
          font-weight: 800;
        }

        .welcome-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .welcome-copy {
          min-width: 0;
        }

        .welcome-copy h2 {
          margin: 0 0 7px;
          overflow-wrap: anywhere;
          color: #152238;
          font-size: 21px;
        }

        .welcome-copy > p:last-child {
          margin: 0;
          overflow-wrap: anywhere;
          color: #7a8598;
          font-size: 13px;
        }

        .account-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-left: auto;
          padding: 8px 12px;
          border: 1px solid #dce8ff;
          border-radius: 30px;
          background: #f4f8ff;
          color: #245eae;
          font-size: 11px;
          font-weight: 750;
          text-transform: capitalize;
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #3479e6;
        }

        .account-layout {
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          align-items: start;
          gap: 24px;
        }

        .account-sidebar,
        .content-card {
          border: 1px solid #e8edf4;
          border-radius: 13px;
          background: #fff;
          box-shadow: 0 3px 14px rgb(25 45 75 / 3%);
        }

        .account-sidebar {
          padding: 18px 12px;
        }

        .sidebar-title {
          padding: 6px 10px 14px;
          color: #9aa3b2;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 5px;
          padding: 13px 10px;
          border-radius: 8px;
          color: #637087;
          text-decoration: none;
          transition: background 0.2s ease;
        }

        .sidebar-item:hover {
          background: #f5f8fe;
        }

        .sidebar-item.active {
          background: #edf4ff;
          color: #175fc2;
        }

        .sidebar-icon {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f0f3f8;
          font-size: 18px;
        }

        .sidebar-item.active .sidebar-icon {
          background: #dce9ff;
        }

        .sidebar-item > span:nth-child(2) {
          display: flex;
          min-width: 0;
          flex: 1;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-item strong {
          font-size: 12px;
          font-weight: 750;
        }

        .sidebar-item small {
          color: #929bad;
          font-size: 10px;
          line-height: 1.5;
        }

        .sidebar-arrow {
          font-size: 21px;
        }

        .sidebar-help {
          margin-top: 22px;
          padding: 16px 11px;
          border-top: 1px solid #edf0f5;
        }

        .help-symbol {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          margin-bottom: 10px;
          border-radius: 50%;
          background: #eef4ff;
          color: #1768d2;
          font-weight: 800;
        }

        .sidebar-help > strong {
          font-size: 13px;
        }

        .sidebar-help p {
          color: #7b8799;
          font-size: 11px;
          line-height: 1.7;
        }

        .sidebar-help a {
          color: #1768d2;
          font-size: 11px;
          font-weight: 750;
          text-decoration: none;
        }

        .account-content {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 22px;
        }

        .content-card {
          min-width: 0;
          padding: 25px;
          scroll-margin-top: 20px;
        }

        .card-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 24px;
        }

        .card-heading h2 {
          margin: 0;
          color: #172337;
          font-size: 17px;
          font-weight: 750;
        }

        .card-heading p {
          margin: 7px 0 0;
          color: #8690a1;
          font-size: 12px;
          line-height: 1.6;
        }

        .secondary-button,
        .cancel-button,
        .primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 41px;
          padding: 0 17px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .secondary-button {
          flex-shrink: 0;
          border: 1px solid #d9e4f4;
          background: #fff;
          color: #2466bd;
        }

        .secondary-button:hover {
          background: #f4f8ff;
        }

        .cancel-button {
          border: 1px solid #e0e5ed;
          background: #fff;
          color: #5e6a7d;
        }

        .primary-button {
          border: 1px solid #1768d2;
          background: #1768d2;
          color: #fff;
        }

        .primary-button:hover:not(:disabled) {
          background: #1056b4;
          transform: translateY(-1px);
        }

        .primary-button:disabled,
        .secondary-button:disabled,
        .cancel-button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 21px 18px;
        }

        .field {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 9px;
        }

        .field label {
          color: #354258;
          font-size: 12px;
          font-weight: 750;
        }

        .field input {
          width: 100%;
          min-width: 0;
          min-height: 44px;
          padding: 11px 13px;
          border: 1px solid #dce2eb;
          border-radius: 7px;
          outline: none;
          background: #fff;
          color: #243147;
          font: inherit;
          font-size: 13px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .field input:focus {
          border-color: #4488e8;
          box-shadow: 0 0 0 3px rgb(48 119 218 / 10%);
        }

        .field input:disabled,
        .field input[readonly] {
          border-color: #e7ebf1;
          background: #f7f9fc;
          color: #7c8798;
          opacity: 1;
        }

        .field input::placeholder {
          color: #a5adba;
        }

        .field small {
          color: #919bac;
          font-size: 10px;
          line-height: 1.5;
        }

        .form-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #eef1f5;
        }

        .password-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px 18px;
        }

        .password-fields .field:first-child {
          grid-column: 1 / -1;
        }

        .password-note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 20px;
          padding: 12px;
          border-radius: 7px;
          background: #f5f8fd;
          color: #77849a;
          font-size: 11px;
          line-height: 1.6;
        }

        .password-note span {
          color: #3277d4;
          font-size: 14px;
        }

        .security-symbol {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #eaf8ef;
          color: #25814d;
          font-weight: 800;
        }

        .overview-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 17px 0;
          border-bottom: 1px solid #eef1f5;
        }

        .overview-row:first-of-type {
          padding-top: 0;
        }

        .overview-row:last-child {
          padding-bottom: 0;
          border-bottom: 0;
        }

        .overview-row > div {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 7px;
        }

        .overview-label {
          color: #929bad;
          font-size: 11px;
        }

        .overview-value {
          overflow-wrap: anywhere;
          color: #344157;
          font-size: 12px;
          font-weight: 750;
          text-transform: capitalize;
        }

        .status-indicator,
        .verification-tag {
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          gap: 6px;
          padding: 6px 9px;
                        
