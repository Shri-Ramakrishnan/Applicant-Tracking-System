import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

export default function JobList() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs', {
          headers: user
            ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
            : {}
        });

        setJobs(data);
      } catch (err) {
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  if (loading)
    return <div className="text-center py-10 text-gray-500">Loading jobs...</div>;

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

return (
  <div>
    <h1 className="text-3xl font-bold mb-8 text-slate-100">
      Available Positions
    </h1>

    {jobs.length === 0 && (
      <p className="text-slate-400">No active jobs found.</p>
    )}

    <div className="grid gap-6">
      {jobs.map(job => (
        <div key={job._id} className="card p-6 hover:border-indigo-500 transition">

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {job.title}
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                {job.recruiter?.user?.name} · {job.location}
              </p>
            </div>

            <span className="text-xs bg-slate-700 px-3 py-1 rounded-full text-slate-300">
              {job.status}
            </span>
          </div>

          <p className="text-slate-300 text-sm mt-4 line-clamp-2">
            {job.description}
          </p>

          <div className="flex justify-between items-center mt-6">
            <p className="text-xs text-slate-500">
              {new Date(job.createdAt).toLocaleDateString()}
            </p>

            <Link
              to={`/jobs/${job._id}`}
              className="btn-primary"
            >
              View Details
            </Link>
          </div>

        </div>
      ))}
    </div>
  </div>
);
}