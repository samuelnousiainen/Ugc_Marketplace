import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "./JobCard";

export default function SideBar({ onSelectJob }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetch("/api/campaigns")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error("Expected JSON, got: " + text.slice(0, 100));
        }
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setJobs(data || []);
      })
      .catch((err) => {
        console.error("Failed to load campaigns", err);
        setJobs([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  function handleClick(job) {
    // pass full job object to app state and navigate to details
    onSelectJob && onSelectJob(job);
    navigate("/");
  }

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((c) => {
      const t = (c.title || "").toLowerCase();
      const comp = (c.company?.name || "").toLowerCase();
      const req = (c.requirements || "").toLowerCase();
      return t.includes(q) || comp.includes(q) || req.includes(q);
    });
  }, [jobs, query]);

  return (
    <div className="sidebar" style={{ padding: "1rem", boxSizing: "border-box", height: "100%", minHeight: 0 }}>
      <h2 className="sidebar-title">Jobs</h2>

      <div style={{ marginBottom: 12 }}>
        <input
          aria-label="Search jobs"
          className="sidebar-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, company or requirements..."
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.12)",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div className="sidebar-list" style={{ overflowY: "auto", flex: "1 1 auto", display: "grid", gap: "0.5rem" }}>
        {loading ? <div style={{ color: "var(--mid)" }}>Loading…</div> : null}
        {filtered.map((job) => (
          <JobCard
            key={job.id}
            id={job.id}
            image={job.image}
            title={job.title}
            description={job.requirements || job.description}
            companyName={job.company?.name}
            companyId={job.company?.id}   // <-- added
            payout={job.currency ? `${job.currency} ${job.payoutMin}–${job.payoutMax}` : undefined}
            onClick={() => handleClick(job)}
          />
        ))}
      </div>
    </div>
  );
}