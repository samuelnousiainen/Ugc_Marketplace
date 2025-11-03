import React from "react";
import { Link } from "react-router-dom";

export default function JobDetails({ job }) {
  if (!job) {
    return <div>Select a job from the sidebar.</div>;
  }

  return (
    <div>
      <h2>{job.title}</h2>
      <img
        src={job.image}
        alt={job.title}
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <p>{job.description}</p>
      <p>{job.details}</p>
      <p>{job.additionalInfo}</p>
      <p>Location: {job.location}</p>
      <p>Salary: {job.salary}</p>
      <p>Posted on: {job.datePosted}</p>
      <p>Company: {job.company}</p>

      <Link to={`/apply/${job.id}`} state={{ job }}>
        <button
          type="button"
          className="apply-button"
          style={{ marginTop: 16 }}
        >
          Apply
        </button>
      </Link>
    </div>
  );
}