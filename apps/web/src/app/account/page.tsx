
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type UserProfile = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
  avatar?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  createdAt?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "https://novacart-zpm6.onrender.com";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const possibleKeys = [
    "token",
    "authToken",
    "accessToken",
    "novacart_token",
    "novacartToken",
    "jwt",
  ];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);
    if (!value) continue;

    try {
      const parsed = JSON.parse(value);

      if (typeof parsed === "string" && parsed.length > 20) {
        return parsed;
      }

      if (parsed && typeof parsed === "object") {
        const candidate =
          parsed.token || parsed.accessToken || parsed.jwt;

        if (typeof candidate === "string" && candidate.length > 20) {
          return candidate;
        }
      }
    } catch {
      if (value.length > 20 && !value.includes(" ")) {
        return value;
      }
    }
  }

  return null;
}

async function apiRequest(path: string, options: RequestInit = {}) {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      "You are not logged in, or your login token was not found. Please log in again."
    );
  }

  const response = await fetch(`${API_BASE}${path}`, {
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
      result.message || `Request failed (${response.status}).`
    );
  }

  return result;
}

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await apiRequest("/api/users/me");
      const user = result.user || result.data?.user || result.data;

      if (!user || typeof user.name !== "string") {
        throw new Error("The API did not return a valid user profile.");
      }

      setProfile(user);
      setName(user.name || "");
      setPhone(user.phone || "");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load your profile."
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
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const result = await apiRequest("/api/users/me", {
        method: "PUT",
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });

      const updated =
        result.user || result.data?.user || result.data;

      if (updated && typeof updated.name === "string") {
        setProfile(updated);
        setName(updated.name || "");
        setPhone(updated.phone || "");
      } else {
        await loadProfile();
      }

      setMessage(result.message || "Your profile has been updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChangingPassword(true);
    setError("");
    setMessage("");

    try {
      const result = await apiRequest("/api/users/change-password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      setCurrentPassword("");
      setNewPassword("");
      setMessage(result.message || "Your password has been changed.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to change your password."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  const styles = `
    .account-page {
      min-height: 100vh;
      padding: 28px 16px 56px;
      background: #f5f7fa;
      color: #212121;
      font-family: Arial, Helvetica, sans-serif;
    }
    .account-container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .account-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 26px;
    }
    .account-brand {
      color: #1769aa;
      font-size: 25px;
      font-weight: 800;
      text-decoration: none;
      letter-spacing: -0.7px;
    }
    .account-back {
      color: #1769aa;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
    }
    .account-heading {
      margin: 0 0 7px;
      font-size: clamp(25px, 5vw, 32px);
      letter-spacing: -0.7px;
    }
    .account-subheading {
      margin: 0 0 24px;
      color: #666;
      font-size: 14px;
      line-height: 1.6;
    }
    .account-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
      gap: 20px;
      align-items: start;
    }
    .account-card {
      padding: 24px;
      background: #fff;
      border: 1px solid #e5e8ec;
      border-radius: 13px;
      box-shadow: 0 3px 12px rgba(20, 30, 50, 0.035);
      margin-bottom: 20px;
    }
    .account-card h2 {
      margin: 0 0 8px;
      font-size: 19px;
    }
    .account-muted {
      margin: 0 0 20px;
      color: #717780;
      font-size: 13px;
      line-height: 1.5;
    }
    .account-avatar {
      display: grid;
      place-items: center;
      width: 64px;
      height: 64px;
      margin-bottom: 14px;
      border-radius: 50%;
      background: #e7f1ff;
      color: #1769aa;
      font-size: 26px;
      font-weight: 700;
    }
    .account-user-name {
      margin: 0 0 6px;
      font-size: 20px;
      overflow-wrap: anywhere;
    }
    .account-email {
      margin: 0 0 15px;
      color: #666;
      font-size: 13px;
      overflow-wrap: anywhere;
    }
    .account-tag {
      display: inline-block;
      padding: 5px 9px;
      border-radius: 20px;
      background: #edf7ef;
      color: #21743b;
      font-size: 12px;
      font-weight: 700;
      text-transform: capitalize;
    }
    .account-details {
      margin-top: 20px;
      border-top: 1px solid #edf0f3;
    }
    .account-detail {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #edf0f3;
      font-size: 13px;
    }
    .account-detail span:first-child {
      color: #747982;
    }
    .account-detail span:last-child {
      text-align: right;
      font-weight: 600;
      overflow-wrap: anywhere;
    }
    .account-field {
      display: block;
      margin-bottom: 16px;
    }
    .account-field label {
      display: block;
      margin-bottom: 7px;
      font-size: 13px;
      font-weight: 600;
    }
    .account-field input {
      display: block;
      width: 100%;
      min-height: 44px;
      box-sizing: border-box;
      padding: 11px 12px;
      border: 1px solid #d9dee5;
      border-radius: 7px;
      background: #fff;
      color: #212121;
      font: inherit;
      font-size: 14px;
      outline: none;
    }
    .account-field input:focus {
      border-color: #2879c7;
      box-shadow: 0 0 0 3px rgba(40, 121, 199, 0.12);
    }
    .account-button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      min-height: 45px;
      padding: 12px 16px;
      border: none;
      border-radius: 7px;
      background: #1769aa;
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }
    .account-button:disabled {
      opacity: 0.6;
      cursor: wait;
    }
    .account-alert {
      padding: 12px 14px;
      margin-bottom: 18px;
      border-radius: 8px;
      font-size: 13px;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }
    .account-alert-error {
      background: #fff0f0;
      border: 1px solid #ffd4d4;
      color: #a32121;
    }
    .account-alert-success {
      background: #edf8ef;
      border: 1px solid #ccebd2;
      color: #206d34;
    }
    .account-loading {
      padding: 30px 10px;
      color: #666;
      text-align: center;
    }
    @media (max-width: 700px) {
      .account-page { padding: 20px 12px 40px; }
      .account-grid { grid-template-columns: 1fr; gap: 0; }
      .account-card { padding: 19px; }
      .account-topbar { margin-bottom: 22px; }
    }
  `;

  return (
    <main className="account-page">
      <style jsx global>{styles}</style>

      <div className="account-container">
        <header className="account-topbar">
          <a className="account-brand" href="/">NovaCart</a>
          <a className="account-back" href="/">← Back to shopping</a>
        </header>

        <h1 className="account-heading">My Account</h1>
        <p className="account-subheading">
          Manage your personal information and account security.
        </p>

        {error && (
          <div className="account-alert account-alert-error" role="alert">
            {error}
            {error.toLowerCase().includes("logged in") && (
              <>
                {" "}
                <a href="/login">Go to login</a>
              </>
            )}
          </div>
        )}

        {message && (
          <div className="account-alert account-alert-success" role="status">
            {message}
          </div>
        )}

        {loading ? (
          <div className="account-card account-loading">
            Loading your account...
          </div>
        ) : (
          <div className="account-grid">
            <section className="account-card">
              <h2>Profile overview</h2>
              <p className="account-muted">
                Your account information.
              </p>

              <div className="account-avatar" aria-hidden="true">
                {(profile?.name?.trim().charAt(0) || "N").toUpperCase()}
              </div>

              <h3 className="account-user-name">
                {profile?.name || "NovaCart customer"}
              </h3>
              <p className="account-email">{profile?.email || "No email available"}</p>

              <span className="account-tag">
                {profile?.role || "customer"}
              </span>

              <div className="account-details">
                <div className="account-detail">
                  <span>Phone</span>
                  <span>{profile?.phone || "Not added"}</span>
                </div>
                <div className="account-detail">
                  <span>Account status</span>
                  <span>{profile?.status || "Active"}</span>
                </div>
                <div className="account-detail">
                  <span>Email verified</span>
                  <span>{profile?.isEmailVerified ? "Yes" : "Not verified"}</span>
                </div>
                <div className="account-detail">
                  <span>Member since</span>
                  <span>
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </div>

              <button
                className="account-button"
                style={{ marginTop: 18 }}
                type="button"
                onClick={() => void loadProfile()}
              >
                Refresh profile
              </button>
            </section>

            <div>
              <section className="account-card">
                <h2>Edit profile</h2>
                <p className="account-muted">
                  Update your name and contact number. Your email is read-only.
                </p>

                <form onSubmit={handleSaveProfile}>
                  <div className="account-field">
                    <label htmlFor="account-name">Full name</label>
                    <input
                      id="account-name"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="account-field">
                    <label htmlFor="account-email">Email address</label>
                    <input
                      id="account-email"
                      type="email"
                      value={profile?.email || ""}
                      readOnly
                    />
                  </div>

                  <div className="account-field">
                    <label htmlFor="account-phone">Phone number</label>
                    <input
                      id="account-phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      maxLength={20}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <button className="account-button" type="submit" disabled={saving}>
                    {saving ? "Saving changes..." : "Save profile"}
                  </button>
                </form>
              </section>

              <section className="account-card">
                <h2>Change password</h2>
                <p className="account-muted">
                  Use your current password to set a new one.
                </p>

                <form onSubmit={handleChangePassword}>
                  <div className="account-field">
                    <label htmlFor="account-current-password">
                      Current password
                    </label>
                    <input
                      id="account-current-password"
                      type="password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      required
                    />
                  </div>

                  <div className="account-field">
                    <label htmlFor="account-new-password">New password</label>
                    <input
                      id="account-new-password"
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      minLength={8}
                      required
                    />
                  </div>

                  <button
                    className="account-button"
                    type="submit"
                    disabled={changingPassword}
                  >
                    {changingPassword ? "Updating password..." : "Update password"}
                  </button>
                </form>
              </section>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
