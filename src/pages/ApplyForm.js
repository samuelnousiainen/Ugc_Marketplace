import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function ApplyForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  // try to get job from location.state, fallback to params.id
  const job = location.state?.job || { id: params.id, title: "" };

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    resume: "",
    coverLetter: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // replace with real submit logic (API call)
    console.log("Application submitted for job:", job.id, form);
    alert("Application submitted. Thank you!");
    navigate(-1); // go back to previous page
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h2>Apply for: {job.title || `Job ${job.id}`}</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Name</label><br />
          <input name="name" value={form.name} onChange={handleChange} required style={{ width: "100%" }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Email</label><br />
          <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: "100%" }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Phone</label><br />
          <input name="phone" value={form.phone} onChange={handleChange} style={{ width: "100%" }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Resume (paste or short summary)</label><br />
          <textarea name="resume" value={form.resume} onChange={handleChange} rows={6} style={{ width: "100%" }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Cover Letter</label><br />
          <textarea name="coverLetter" value={form.coverLetter} onChange={handleChange} rows={6} style={{ width: "100%" }} />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="apply-button">Submit application</button>
          <button type="button" className="apply-button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}