import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";

export default function Company() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [about, setAbout] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      fetch(`/api/companies/${id}`).then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      }),
      // try a dedicated endpoint first; fallback to all campaigns filter
      fetch(`/api/companies/${id}/campaigns`).then(async (r) => {
        if (!r.ok) {
          // fallback: fetch all campaigns and filter client-side
          const all = await fetch("/api/campaigns").then((rr) => rr.json());
          return all.filter((c) => String(c.companyId || c.company?.id) === String(id));
        }
        return r.json();
      }),
      // fetch from microservice via server endpoint
      fetch(`/api/companies/${id}/about`).then(async (r) => {
        if (!r.ok) {
          // return null so we can fallback to company.description
          return null;
        }
        return r.json();
      }),
    ])
      .then(([companyData, campaignsData, aboutData]) => {
        if (!mounted) return;
        setCompany(companyData);
        setCampaigns(campaignsData || []);
        setAbout(aboutData?.about ?? companyData?.description ?? "No bio available.");
      })
      .catch((e) => {
        console.error(e);
        setErr("Failed to load company");
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (err) return <div>{err}</div>;
  if (!company) return <div>Company not found.</div>;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>{company.name}</h1>
          {company.website && (
            <a href={company.website} target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>
              {company.website}
            </a>
          )}
        </div>
      </header>

      <section style={{ color: "var(--mid)" }}>
        <h3>About</h3>
        <p>{about}</p>
      </section>

      <section>
        <h3>Campaigns</h3>
        {campaigns.length === 0 ? (
          <p style={{ color: "var(--mid)" }}>No campaigns found for this company.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {campaigns.map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <JobCard
                    id={c.id}
                    image={c.image}
                    title={c.title}
                    description={c.requirements || c.description}
                    companyName={company.name}
                    onClick={() => navigate(`/campaign/${c.id}`)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}