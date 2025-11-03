import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in both fields.");
      return;
    }

    // TODO: replace with real auth call
    console.log("Login attempt:", form);
    // simple success flow: go to home
    navigate("/");
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", color: "var(--white)" }}>
      <h2 style={{ marginBottom: 8 }}>Login</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        {error && <div style={{ color: "#ffb4b4" }}>{error}</div>}

        <label style={{ display: "block" }}>
          <div style={{ fontSize: 14, marginBottom: 6 }}>Email</div>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "#0b0b0b", color: "var(--white)" }}
          />
        </label>

        <label style={{ display: "block" }}>
          <div style={{ fontSize: 14, marginBottom: 6 }}>Password</div>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "#0b0b0b", color: "var(--white)" }}
          />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="apply-button" style={{ background: "var(--btn-color)" }}>
            Sign in
          </button>
          <button type="button" onClick={() => navigate(-1)} style={{ background: "transparent", color: "var(--white)", border: "1px solid rgba(255,255,255,0.08)", padding: "8px 12px", borderRadius: 8 }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}