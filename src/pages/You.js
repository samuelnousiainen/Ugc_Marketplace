import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";

export default function You() {
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        setCreator(data);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
        if (err.message.includes("401")) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!creator) return null;

  // Filter applications into ongoing and completed
  const acceptedApplications = creator.applications.filter(
    (app) => app.status === "accepted"
  );

  const now = new Date();
  const ongoingCampaigns = acceptedApplications.filter((app) => {
    const deadline = app.campaign.deadline ? new Date(app.campaign.deadline) : null;
    return !deadline || deadline > now;
  });

  const completedCampaigns = acceptedApplications.filter((app) => {
    const deadline = app.campaign.deadline ? new Date(app.campaign.deadline) : null;
    return deadline && deadline <= now;
  });

  return (
    <div style={{ display: "flex", gap: 24, height: "100%" }}>
      <section style={{ flex: "0 0 420px" }}>
        <h2>Your Profile</h2>
        <div>
          <p>Username: {creator.username}</p>
          <p>Email: {creator.email}</p>
          {creator.about && <p>About: {creator.about}</p>}
        </div>
      </section>

      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Ongoing Campaigns */}
        <div>
          <h2>Ongoing Campaigns</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {ongoingCampaigns.length === 0 ? (
              <p style={{ color: "var(--mid)" }}>No ongoing campaigns</p>
            ) : (
              ongoingCampaigns.map((app) => (
                <div key={app.id}>
                  <JobCard
                    title={app.campaign.title}
                    description={app.campaign.requirements}
                    companyName={app.campaign.company.name}
                    onClick={() => navigate(`/campaign/${app.campaign.id}`)}
                  />
                  {app.campaign.deadline && (
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 14,
                        color: "var(--mid)",
                      }}
                    >
                      Deadline:{" "}
                      {new Date(app.campaign.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed Campaigns */}
        <div>
          <h2>Completed Campaigns</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {completedCampaigns.length === 0 ? (
              <p style={{ color: "var(--mid)" }}>No completed campaigns</p>
            ) : (
              completedCampaigns.map((app) => (
                <div key={app.id}>
                  <JobCard
                    title={app.campaign.title}
                    description={app.campaign.requirements}
                    companyName={app.campaign.company.name}
                    onClick={() => navigate(`/campaign/${app.campaign.id}`)}
                  />
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 14,
                      color: "var(--mid)",
                    }}
                  >
                    Completed:{" "}
                    {new Date(app.campaign.deadline).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Applications */}
        <div>
          <h2>Pending Applications</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {creator.applications
              .filter((app) => app.status === "pending")
              .map((app) => (
                <div key={app.id}>
                  <JobCard
                    title={app.campaign.title}
                    description={app.campaign.requirements}
                    companyName={app.campaign.company.name}
                    onClick={() => navigate(`/campaign/${app.campaign.id}`)}
                  />
                  <div style={{ marginTop: 4, fontSize: 14 }}>
                    Status:{" "}
                    <span style={{ color: "var(--accent)" }}>Pending</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}