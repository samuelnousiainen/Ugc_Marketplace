import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import JobDetails from "./components/JobDetails";
import ApplyForm from "./pages/ApplyForm";
import JobData from "./JobData.json";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState(JobData);
  const [selectedJob, setSelectedJob] = useState(null);

  const NAV_HEIGHT = 64;

  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <NavBar />

        <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
          <aside
            style={{
              flex: "0 0 260px",
              borderRight: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              height: `calc(100vh - ${NAV_HEIGHT}px)`,
            }}
          >
            <SideBar jobs={jobs} onSelectJob={setSelectedJob} />
          </aside>

          <main className="main-content" style={{ flex: 1, padding: 24, minWidth: 0, minHeight: 0, overflow: "auto" }}>
            <Routes>
              <Route path="/" element={<JobDetails job={selectedJob} />} />

              <Route path="/apply/:id" element={<ApplyForm />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
