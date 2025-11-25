import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function ApplyForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const job = location.state?.job || { id: params.id, title: "" };

  const [form, setForm] = useState({
    name: "",
    email: "",
    socials: {
      tiktok: "",
      instagram: "",
      youtube: "",
    },
    whyPickYou: "",
    anythingElse: "",
  });

  const [active, setActive] = useState("tiktok");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // load logged-in creator data and prefill 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // not logged in — keep blank
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.warn("Failed to fetch profile for apply form");
          return;
        }
        const data = await res.json();
        if (!mounted) return;
        // *TODO* add fullname to creator model?
        // prefer fullName, otherwise username
        const name = data.fullName || data.username || "";
        setForm((f) => ({ ...f, name, email: data.email || "" }));
        // *TODO* add socials to creator in db
        if (data.socials) {
          setForm((f) => ({ ...f, socials: { ...f.socials, ...data.socials } }));
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name.startsWith("socials.")) {
      const key = name.split(".")[1];
      setForm((f) => ({ ...f, socials: { ...f.socials, [key]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const body = {
        campaignId: Number(job.id),
        applicantName: form.name,
        applicantEmail: form.email,
        socials: form.socials,
        whyPickYou: form.whyPickYou,
        anythingElse: form.anythingElse,
      };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Apply failed");
      }

      // navigate back to campaign or you page
      navigate("/you");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to apply");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", color: "var(--white)" }}>
      <h2>Apply — {job.title}</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Name</div>
          <input name="name" value={form.name} onChange={handleChange} required style={{ width: "100%", padding: 10, borderRadius: 8 }} />
        </label>

        <label>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Email</div>
          <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: "100%", padding: 10, borderRadius: 8 }} />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 13, marginBottom: 6 }}>TikTok</div>
            <input name="socials.tiktok" value={form.socials.tiktok} onChange={handleChange} placeholder="@yourtiktok" style={{ width: "100%", padding: 10, borderRadius: 8 }} />
          </label>

          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Instagram</div>
            <input name="socials.instagram" value={form.socials.instagram} onChange={handleChange} placeholder="@yourinsta" style={{ width: "100%", padding: 10, borderRadius: 8 }} />
          </label>

          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 13, marginBottom: 6 }}>YouTube</div>
            <input name="socials.youtube" value={form.socials.youtube} onChange={handleChange} placeholder="channel url" style={{ width: "100%", padding: 10, borderRadius: 8 }} />
          </label>
        </div>

        <label>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Why we should pick you?</div>
          <textarea name="whyPickYou" value={form.whyPickYou} onChange={handleChange} rows={5} required style={{ width: "100%", padding: 10, borderRadius: 8 }} />
        </label>

        <label>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Anything else you want to tell us?</div>
          <textarea name="anythingElse" value={form.anythingElse} onChange={handleChange} rows={4} style={{ width: "100%", padding: 10, borderRadius: 8 }} />
        </label>

        {error && <div style={{ color: "#ffb4b4" }}>{error}</div>}

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="apply-button" disabled={loading}>{loading ? "Applying…" : "Apply"}</button>
          <button type="button" onClick={() => navigate(-1)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "var(--white)", padding: "8px 12px", borderRadius: 8 }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}