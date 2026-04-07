import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get("/applications/my");
        setApplications(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Loading applications...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">My Applications</h1>

      {applications.length === 0 && (
        <div className="card text-center">
          <p className="text-slate-500">You have not applied to any jobs yet.</p>
          <Link to="/jobs" className="mt-3 inline-block text-sm font-medium underline">
            Browse Jobs
          </Link>
        </div>
      )}

      <div className="grid gap-4">
        {applications.map((app) => (
          <article key={app._id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{app.job?.title || "Job"}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{app.job?.location || "N/A"}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
              <p>
                <span className="font-semibold">Score:</span>{" "}
                <span
                  className={`font-bold ${
                    app.screeningScore >= 60
                      ? "text-emerald-600 dark:text-emerald-400"
                      : app.screeningScore >= 30
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {app.screeningScore}%
                </span>
              </p>
              <p>
                <span className="font-semibold">Applied:</span>{" "}
                {new Date(app.appliedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={`h-2 rounded-full ${
                  app.screeningScore >= 60
                    ? "bg-emerald-500"
                    : app.screeningScore >= 30
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${app.screeningScore}%` }}
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Status flow: Applied, Screened, Shortlisted, Interview Scheduled, Offered
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
