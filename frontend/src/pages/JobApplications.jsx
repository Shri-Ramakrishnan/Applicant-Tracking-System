import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

export default function JobApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: job }, { data: apps }] = await Promise.all([
          api.get(`/jobs/${jobId}`),
          api.get(`/applications/job/${jobId}`),
        ]);
        setJobTitle(job.title);
        setApplications(apps);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const handleAction = async (applicationId, action) => {
    setActionLoading(`${applicationId}-${action}`);
    try {
      const { data } = await api.patch(`/applications/${applicationId}/${action}`);
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status: data.status } : app)),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Loading applications...</div>;
  }

  return (
    <section>
      <div className="mb-6 flex items-center gap-4">
        <button type="button" onClick={() => navigate("/recruiter/jobs")} className="btn-secondary text-sm">
          Back
        </button>
        <h1 className="text-2xl font-bold">Applications: {jobTitle}</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      {applications.length === 0 && <div className="card text-center text-slate-500">No applications yet.</div>}

      <div className="grid gap-4">
        {applications.map((app) => (
          <article key={app._id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{app.applicant?.user?.name || "Unknown Applicant"}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {app.applicant?.user?.email || "N/A"}
                </p>
              </div>
              <StatusBadge status={app.status} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-slate-600 dark:text-slate-300">
              <p>
                <span className="font-semibold">Score:</span> {app.screeningScore}%
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

            {app.resume?.filePath && (
              <a
                href={`/uploads/${app.resume.filePath}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium underline"
              >
                View Resume PDF
              </a>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {app.status === "Applied" && (
                <button
                  type="button"
                  onClick={() => handleAction(app._id, "screen")}
                  disabled={actionLoading === `${app._id}-screen`}
                  className="btn-secondary text-sm"
                >
                  Mark Screened
                </button>
              )}

              {(app.status === "Applied" || app.status === "Screened") && (
                <button
                  type="button"
                  onClick={() => handleAction(app._id, "shortlist")}
                  disabled={actionLoading === `${app._id}-shortlist`}
                  className="btn-secondary text-sm"
                >
                  Shortlist
                </button>
              )}

              {(app.status === "Shortlisted" || app.status === "Screened") && (
                <Link to={`/recruiter/schedule/${app._id}`} className="btn-primary text-sm">
                  Schedule Interview
                </Link>
              )}

              {app.status === "Interview Scheduled" && (
                <Link to={`/recruiter/offer/${app._id}`} className="btn-primary text-sm">
                  Generate Offer
                </Link>
              )}

              {!["Rejected", "Offered"].includes(app.status) && (
                <button
                  type="button"
                  onClick={() => handleAction(app._id, "reject")}
                  disabled={actionLoading === `${app._id}-reject`}
                  className="btn-danger text-sm"
                >
                  Reject
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
