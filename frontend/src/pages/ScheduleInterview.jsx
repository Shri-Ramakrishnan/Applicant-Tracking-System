import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ScheduleInterview() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ interviewDate: '', mode: 'Online' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/interviews/schedule', { applicationId, ...form });
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (now)
  const minDate = new Date().toISOString().slice(0, 16);

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Schedule Interview</h1>
        {error && <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date & Time</label>
            <input
              type="datetime-local"
              name="interviewDate"
              value={form.interviewDate}
              onChange={handleChange}
              min={minDate}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interview Mode</label>
            <select name="mode" value={form.mode} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Online">Online</option>
              <option value="In-person">In-person</option>
              <option value="Phone">Phone</option>
            </select>
          </div>
          <p className="text-xs text-gray-400">Note: Scheduling conflicts within 1 hour are automatically prevented.</p>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50 font-medium">
              {loading ? 'Scheduling...' : 'Schedule Interview'}
            </button>
            <button type="button" onClick={() => navigate(-1)}
              className="border border-gray-300 px-6 py-2 rounded text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
