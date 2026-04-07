import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function ScheduleInterview() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ interviewDate: "", mode: "Online" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/interviews/schedule", { applicationId, ...form });
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule interview");
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().slice(0, 16);

  return (
    <section className="mx-auto max-w-md">
      <div className="card">
        <h1 className="mb-6 text-2xl font-bold">Schedule Interview</h1>

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Interview Date & Time</label>
            <input
              type="datetime-local"
              name="interviewDate"
              value={form.interviewDate}
              onChange={handleChange}
              min={minDate}
              required
              className="input"
            />
          </div>

          <div>
            <label className="label">Interview Mode</label>
            <select name="mode" value={form.mode} onChange={handleChange} className="input">
              <option value="Online">Online</option>
              <option value="In-person">In-person</option>
              <option value="Phone">Phone</option>
            </select>
          </div>

          <p className="text-xs text-slate-500">
            Scheduling conflicts within 1 hour are prevented automatically.
          </p>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Scheduling..." : "Schedule Interview"}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
