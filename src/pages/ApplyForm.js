import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import igIcon from "../assets/ig.png";
import tiktokIcon from "../assets/tiktok.png";
import youtubeIcon from "../assets/youtube.png";

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
    yourIdea: "",
  });

  const [active, setActive] = useState("tiktok");

  const socials = [
    { name: "tiktok", label: "TikTok", src: tiktokIcon },
    { name: "instagram", label: "Instagram", src: igIcon },
    { name: "youtube", label: "YouTube", src: youtubeIcon },
  ];

  function handleChange(e) {
    const { name, value } = e.target;

    // socials update
    if (name.startsWith("socials.")) {
      const key = name.split(".")[1];
      setForm((f) => ({
        ...f,
        socials: {
          ...f.socials,
          [key]: value,
        },
      }));
    } else {
      // normal field update
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Application submitted:", form);
    alert("Application submitted!");
    navigate(-1);
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h2>Apply for: {job.title || `Job ${job.id}`}</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Name</label><br />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Email</label><br />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Socials</label><br />

          <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            {socials.map((s) => (
              <img
                key={s.name}
                src={s.src}
                alt={s.label}
                onClick={() => setActive(s.name)}
                style={{
                  width: 40,
                  height: 40,
                  cursor: "pointer",
                  opacity: active === s.name ? 1 : 0.4,
                  transition: "opacity 0.2s",
                }}
              />
            ))}
          </div>

          {socials.map((s) => (
            <div
              key={s.name}
              style={{ display: active === s.name ? "block" : "none" }}
            >
              <input
                name={`socials.${s.name}`}
                value={form.socials[s.name]}
                onChange={handleChange}
                placeholder={`Your ${s.label} link`}
                style={{ width: "100%", marginBottom: 8 }}
              />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Why we should pick you?</label><br />
          <textarea
            name="whyPickYou"
            value={form.whyPickYou}
            onChange={handleChange}
            rows={6}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Your idea</label><br />
          <textarea
            name="yourIdea"
            value={form.yourIdea}
            onChange={handleChange}
            rows={6}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="apply-button">Submit</button>
          <button type="button" className="apply-button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}