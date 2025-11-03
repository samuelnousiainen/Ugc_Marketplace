import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";

export default function You({ creatorId = 1 }) { // pass creatorId from auth later
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "", linkedin: "" });
  const [editing, setEditing] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/creators/${creatorId}/campaigns`);
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setCampaigns(data);
      } catch (err) {
        console.error(err);
        setCampaigns([]);
      }
    }
    load();
  }, [creatorId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    setEditing(false);
    // TODO: persist to API
  }

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start", height: "100%" }}>
      {/* Left: personal info */}
      <section style={{ flex: "0 0 420px", padding: 16, boxSizing: "border-box" }}>
        <h2 style={{ marginTop: 0 }}>You</h2>
        <form onSubmit={(e) => { e.preventDefault(); setEditing(false); /* save logic */ }} style={{ display: "grid", gap: 12 }}>
          <label>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Full name</div>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              readOnly={!editing}
              disabled={!editing}
              style={{ width: "100%", padding: 10, borderRadius: 8 }}
            />
          </label>

          <label>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Email</div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              readOnly={!editing}
              disabled={!editing}
              style={{ width: "100%", padding: 10, borderRadius: 8 }}
            />
          </label>

          <label>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Phone</div>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              readOnly={!editing}
              disabled={!editing}
              style={{ width: "100%", padding: 10, borderRadius: 8 }}
            />
          </label>

          <label>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Address</div>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              readOnly={!editing}
              disabled={!editing}
              style={{ width: "100%", padding: 10, borderRadius: 8 }}
            />
          </label>

          <label>
            <div style={{ fontSize: 13, marginBottom: 6 }}>LinkedIn</div>
            <input
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              readOnly={!editing}
              disabled={!editing}
              style={{ width: "100%", padding: 10, borderRadius: 8 }}
            />
          </label>

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {!editing ? (
              <>
                <button type="button" className="apply-button" onClick={() => setEditing(true)}>
                  Edit
                </button>
              </>
            ) : (
              <>
                <button type="submit" className="apply-button">
                  Save
                </button>
                <button type="button" onClick={() => setEditing(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "var(--white)", padding: "8px 12px", borderRadius: 8 }}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </section>

      {/* Right: campaigns the creator has participated in */}
      <section style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
        <h2 style={{ marginTop: 0 }}>Your campaigns</h2>

        <div style={{ overflowY: "auto", flex: 1, display: "grid", gap: 12, paddingRight: 8 }}>
          {campaigns.length === 0 ? (
            <div style={{ padding: 24, borderRadius: 12, border: "1px dashed rgba(255,255,255,0.06)", color: "var(--mid)" }}>
              No campaigns yet.
            </div>
          ) : (
            campaigns.map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <JobCard
                    image={c.image || ""} // may be undefined in schema
                    title={c.title}
                    description={c.requirements || c.location || ""}
                    onClick={() => navigate(`/campaign/${c.id}`)}
                  />
                </div>
                <div style={{ minWidth: 120, textAlign: "right" }}>
                  <div style={{ color: "var(--mid)" }}>{c.currency} {c.payoutMin}–{c.payoutMax}</div>
                  <div style={{ fontSize: 12, color: "var(--mid)" }}>{c.company?.name}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}