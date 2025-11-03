import React from "react";

export default function JobCard({ image, title, description, onClick }) {
  return (
    <div
      className="job-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick && onClick(); }}
    >
      <img className="job-card-image" src={image} alt={title} />
      <div className="job-card-body">
        <h3 className="job-card-title">{title}</h3>
        <p className="job-card-desc">{description}</p>
      </div>
    </div>
  );
}