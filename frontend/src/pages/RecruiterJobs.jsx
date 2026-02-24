import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/my-jobs')
      .then(({ data }) => setJobs(data))
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (job) => {
    const newStatus = job.status === 'active' ? 'closed' : 'active';
    await api.patch(`/jobs/${job._id}/status`, { status: newStatus });
    setJobs(jobs.map(j => j._id === job._id ? { ...j, status: newStatus } : j));
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text- white">My Job Postings</h1>
        <Link to="/recruiter/jobs/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium">
          + Post New Job
        </Link>
      </div>
      {jobs.length === 0 && (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center text-gray-500">
          <p>No jobs posted yet.</p>
          <Link to="/recruiter/jobs/create" className="text-blue-600 hover:underline mt-2 inline-block">Post your first job</Link>
        </div>
      )}
      <div className="grid gap-4">
        {jobs.map(job => (
          <div key={job._id} className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{job.title}</h2>
                <p className="text-sm text-gray-500">{job.location} · {new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
              <StatusBadge status={job.status} />
            </div>
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{job.description}</p>
            <div className="mt-4 flex gap-3">
              <Link to={`/recruiter/jobs/${job._id}/applications`}
                className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700">
                View Applications
              </Link>
              <button onClick={() => toggleStatus(job)}
                className={`text-sm px-4 py-1.5 rounded border font-medium ${job.status === 'active' ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-green-400 text-green-700 hover:bg-green-50'}`}>
                {job.status === 'active' ? 'Close Job' : 'Reopen Job'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
