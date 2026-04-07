import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CreateJob() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/jobs", form);
      navigate("/recruiter/jobs");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Failed to create job",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl">
      <div className="card">
        <h1 className="mb-6 text-3xl font-bold">Post a New Job</h1>

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Job Title</label>
            <input
              className="input"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Senior React Developer"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Describe responsibilities..."
            />
          </div>

          <div>
            <label className="label">Requirements</label>
            <textarea
              className="input"
              name="requirements"
              rows={3}
              value={form.requirements}
              onChange={handleChange}
              required
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div>
            <label className="label">Location</label>
            <input
              className="input"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="Remote / New York"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Posting..." : "Post Job"}
            </button>
            <button type="button" onClick={() => navigate("/recruiter/jobs")} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
