import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get("/jobs");
        setJobs(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Loading jobs...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">Available Positions</h1>

      {jobs.length === 0 && (
        <div className="card text-center text-slate-500">No active jobs found.</div>
      )}

      <div className="grid gap-4">
        {jobs.map((job) => (
          <article key={job._id} className="card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {job.recruiter?.user?.name || "Recruiter"} - {job.location}
                </p>
              </div>
              <StatusBadge status={job.status} />
            </div>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{job.description}</p>

            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                {new Date(job.createdAt).toLocaleDateString()}
              </p>
              <Link to={`/jobs/${job._id}`} className="btn-primary text-sm">
                View Details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
