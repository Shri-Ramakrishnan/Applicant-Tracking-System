import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        setError(err.response?.data?.message || "Job not found");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!resumeFile) {
      setError("Please upload a PDF resume");
      return;
    }

    setApplying(true);
    setError("");

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      await api.post(`/applications/apply/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowSuccessModal(true);
      setTimeout(() => navigate("/jobs"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Application failed");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Loading job...</div>;
  }

  if (!job) {
    return <div className="py-10 text-center text-red-500">{error || "Job not found"}</div>;
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="card">
        <div className="mb-5 flex items-start justify-between gap-3">
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <StatusBadge status={job.status} />
        </div>

        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
          {job.recruiter?.user?.name || "Recruiter"} - {job.recruiter?.organization || "Organization"} -{" "}
          {job.location}
        </p>
        <p className="mb-6 text-xs text-slate-500">Posted {new Date(job.createdAt).toLocaleDateString()}</p>

        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">Description</h2>
          <p className="whitespace-pre-line text-sm text-slate-600 dark:text-slate-300">{job.description}</p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">Requirements</h2>
          <p className="whitespace-pre-line text-sm text-slate-600 dark:text-slate-300">{job.requirements}</p>
        </div>

        {user?.role === "applicant" && job.status === "active" && (
          <form onSubmit={handleApply} className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
            <h3 className="mb-4 text-xl font-semibold">Apply for this Position</h3>

            {error && (
              <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="label">Upload Resume (PDF only)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="input file:mr-4 file:rounded-md file:border-0 file:bg-slate-200 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 dark:file:bg-slate-700 dark:file:text-slate-200"
              />
            </div>

            <button type="submit" disabled={applying} className="btn-primary">
              {applying ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="rounded-xl bg-white p-6 text-center shadow-xl dark:bg-slate-900">
            <h2 className="mb-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">
              Applied Successfully
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Redirecting to job listings...</p>
          </div>
        </div>
      )}
    </section>
  );
}
