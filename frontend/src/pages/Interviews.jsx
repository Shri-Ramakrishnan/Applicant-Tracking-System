import React, { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const { data } = await api.get("/interviews/my");
        setInterviews(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load interviews");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const updateStatus = async (interviewId, status) => {
    try {
      await api.patch(`/interviews/${interviewId}/status`, { status });
      setInterviews((prev) => prev.map((item) => (item._id === interviewId ? { ...item, status } : item)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update interview status");
    }
  };

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Loading interviews...</div>;
  }

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Scheduled Interviews</h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      {interviews.length === 0 && <div className="card text-center text-slate-500">No interviews scheduled.</div>}

      <div className="grid gap-4">
        {interviews.map((interview) => (
          <article key={interview._id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {interview.application?.applicant?.user?.name || "Applicant"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {interview.application?.applicant?.user?.email || "N/A"}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Job: {interview.application?.job?.title || "N/A"}
                </p>
              </div>
              <StatusBadge status={interview.status} />
            </div>

            <div className="mt-3 flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-300">
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(interview.interviewDate).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Mode:</span> {interview.mode}
              </p>
            </div>

            {interview.status === "Scheduled" && (
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => updateStatus(interview._id, "Completed")}
                  className="btn-primary text-sm"
                >
                  Mark Completed
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(interview._id, "Cancelled")}
                  className="btn-danger text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
