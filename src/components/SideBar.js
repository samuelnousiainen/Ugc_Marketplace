import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "./JobCard";

export default function SideBar({ jobs, onSelectJob }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleClick(job) {
    onSelectJob(job);
    navigate("/");
  }

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((job) => {
      const title = (job.title || "").toLowerCase();
      const location = (job.location || "").toLowerCase();
      const company = (job.company || "").toLowerCase();
      return title.includes(q) || location.includes(q) || company.includes(q);
    });
  }, [jobs, query]);

  return (
    <div
      className="sidebar"
      style={{ padding: "1rem", boxSizing: "border-box", height: "100%", minHeight: 0 }}
    >
      <h2 className="sidebar-title">Jobs</h2>

      {/* search input */}
      <div style={{ marginBottom: 12 }}>
        <input
          aria-label="Search jobs"
          className="sidebar-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, description or company..."
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.12)",
            boxSizing: "border-box",
            background: "rgba(255,255,255,0.03)",
            color: "var(--white)",
          }}
        />
      </div>

      <div className="sidebar-list">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            image={job.image}
            title={job.title}
            description={job.description}
            onClick={() => handleClick(job)}
          />
        ))}
      </div>
    </div>
  );
}