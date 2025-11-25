import React from "react";
import { Link } from "react-router-dom";

export default function JobCard({ id, image, title, description, companyName, companyId, payout, onClick }) {
  return (
    <div
      className="job-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick && onClick(); }}
    >
      <img
        className="job-card-image"
        src={image || "/placeholder-64.png"}
        alt={title || "job"}
      />
      <div className="job-card-body">
        <h3 className="job-card-title">{title}</h3>

        {companyName && (
          companyId ? (
            <div style={{ fontSize: 12, color: "var(--mid)" }}>
              <Link to={`/company/${companyId}`} style={{ color: "inherit", textDecoration: "none" }}>
                {companyName}
              </Link>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "var(--mid)" }}>{companyName}</div>
          )
        )}

        <p className="job-card-desc">{description}</p>
        {payout && <div style={{ marginTop: 6, fontSize: 12, color: "var(--mid)" }}>{payout}</div>}
      </div>
    </div>
  );
}