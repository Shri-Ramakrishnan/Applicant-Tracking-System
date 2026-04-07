import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get("/jobs/my-jobs");
        setJobs(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const toggleStatus = async (job) => {
    const newStatus = job.status === "active" ? "closed" : "active";
    try {
      await api.patch(`/jobs/${job._id}/status`, { status: newStatus });
      setJobs((prev) => prev.map((j) => (j._id === job._id ? { ...j, status: newStatus } : j)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Loading jobs...</div>;
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">My Job Postings</h1>
        <Link to="/recruiter/jobs/create" className="btn-primary text-sm">
          + Post New Job
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      {jobs.length === 0 && <div className="card text-center text-slate-500">No jobs posted yet.</div>}

      <div className="space-y-4">
        {jobs.map((job) => (
          <article key={job._id} className="card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {job.location} - {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={job.status} />
            </div>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{job.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link to={`/recruiter/jobs/${job._id}/applications`} className="btn-secondary text-sm">
                View Applications
              </Link>
              <button onClick={() => toggleStatus(job)} className="btn-danger text-sm" type="button">
                {job.status === "active" ? "Close Job" : "Reopen Job"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
