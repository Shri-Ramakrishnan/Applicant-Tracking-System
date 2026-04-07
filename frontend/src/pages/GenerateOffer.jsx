import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function GenerateOffer() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ salary: "", joiningDate: "" });
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
      await api.post("/offers/generate", { applicationId, ...form });
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <div className="card">
        <h1 className="mb-6 text-2xl font-bold">Generate Offer</h1>

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Salary (Annual, USD)</label>
            <input
              className="input"
              name="salary"
              type="number"
              min={1}
              value={form.salary}
              onChange={handleChange}
              required
              placeholder="85000"
            />
          </div>

          <div>
            <label className="label">Joining Date</label>
            <input
              className="input"
              name="joiningDate"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.joiningDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Generating..." : "Generate Offer"}
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
