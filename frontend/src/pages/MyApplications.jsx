import React, { useEffect, useState } from 'react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my')
      .then(({ data }) => setApplications(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading applications...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text white mb-6">My Applications</h1>
      {applications.length === 0 && (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center text-gray-500">
          <p>You haven't applied to any jobs yet.</p>
          <a href="/jobs" className="text-blue-600 hover:underline mt-2 inline-block">Browse Jobs</a>
        </div>
      )}
      <div className="grid gap-4">
        {applications.map(app => (
          <div key={app._id} className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{app.job?.title}</h2>
                <p className="text-sm text-gray-500">{app.job?.location}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <div className="mt-3 flex items-center gap-6 text-sm text-gray-600">
              <span>
                <strong>Screening Score:</strong>{' '}
                <span className={`font-bold ${app.screeningScore >= 60 ? 'text-green-600' : app.screeningScore >= 30 ? 'text-yellow-600' : 'text-red-500'}`}>
                  {app.screeningScore}%
                </span>
              </span>
              <span>
                <strong>Applied:</strong> {new Date(app.appliedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${app.screeningScore >= 60 ? 'bg-green-500' : app.screeningScore >= 30 ? 'bg-yellow-500' : 'bg-red-400'}`}
                  style={{ width: `${app.screeningScore}%` }}
                />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Status Flow: Applied → Screened → Shortlisted → Interview Scheduled → Offered
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
