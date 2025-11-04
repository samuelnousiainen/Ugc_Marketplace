import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function JobDetails({ job }) {
  const [data, setData] = useState(job || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if job is an object with full fields just use it,
    // otherwise if it's an id (number/string) or lacks details, fetch it.
    let id = null;
    if (!job) return; 
    if (typeof job === "number" || typeof job === "string") id = Number(job);
    else if (job && job.id) {
      id = job.id;
      // detect whether job has full fields or just minimal; adjust to your data
      const hasFull = job.company || job.requirements || job.payoutMin !== undefined;
      if (hasFull) {
        setData(job);
        return;
      }
    }

    if (id) {
      setLoading(true);
      fetch(`/api/campaigns/${id}`)
        .then((r) => r.json())
        .then((d) => setData(d))
        .catch((err) => {
          console.error("Failed to load campaign", err);
          setData(job); 
        })
        .finally(() => setLoading(false));
    }
  }, [job]);

  if (!job && !data) {
    return <div>Select a job from the sidebar.</div>;
  }

  if (loading) return <div>Loading job…</div>;
  if (!data) return <div>Job not found.</div>;

  return (
    <div>
      <h2>{data.title}</h2>
      {data.image && <img src={data.image} alt={data.title} style={{ maxWidth: "100%", height: "auto" }} />}
      <p>{data.description || data.requirements}</p>
      {data.details && <p>{data.details}</p>}
      {data.additionalInfo && <p>{data.additionalInfo}</p>}
      <p>Location: {data.location}</p>
      <p>Salary: {data.payoutMin && data.payoutMax ? `${data.currency} ${data.payoutMin}–${data.payoutMax}` : data.salary}</p>
      <p>Posted on: {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : data.datePosted}</p>
      {data.company && <p>Company: {data.company.name}</p>}

      <Link to={`/apply/${data.id}`} state={{ job: data }}>
        <button type="button" className="apply-button" style={{ marginTop: 16 }}>
          Apply
        </button>
      </Link>
    </div>
  );
}