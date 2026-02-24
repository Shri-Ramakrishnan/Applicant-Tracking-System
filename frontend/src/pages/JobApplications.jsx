import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function JobApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    api.get(`/jobs/${jobId}`).then(({ data }) => setJobTitle(data.title));
    api.get(`/applications/job/${jobId}`)
      .then(({ data }) => setApplications(data))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleAction = async (applicationId, action) => {
    setActionLoading(applicationId + action);
    try {
      const { data } = await api.patch(`/applications/${applicationId}/${action}`);
      setApplications(apps => apps.map(a => a._id === applicationId ? { ...a, status: data.status } : a));
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading applications...</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/recruiter/jobs')} className="text-blue-600 hover:underline text-sm">← Back</button>
        <h1 className="text-2xl font-bold text-gray-800">Applications for: {jobTitle}</h1>
      </div>
      {applications.length === 0 && (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center text-gray-500">No applications yet.</div>
      )}
      <div className="grid gap-4">
        {applications.map(app => (
          <div key={app._id} className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {app.applicant?.user?.name || 'Unknown Applicant'}
                </h2>
                <p className="text-sm text-gray-500">{app.applicant?.user?.email}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
              <span>
                <strong>Score:</strong>{' '}
                <span className={`font-bold ${app.screeningScore >= 60 ? 'text-green-600' : app.screeningScore >= 30 ? 'text-yellow-600' : 'text-red-500'}`}>
                  {app.screeningScore}%
                </span>
              </span>
              <span><strong>Applied:</strong> {new Date(app.appliedAt).toLocaleDateString()}</span>
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${app.screeningScore >= 60 ? 'bg-green-500' : app.screeningScore >= 30 ? 'bg-yellow-500' : 'bg-red-400'}`}
                style={{ width: `${app.screeningScore}%` }}
              />
            </div>
            {app.resume?.filePath && (
              <a href={`/uploads/${app.resume.filePath}`} target="_blank" rel="noreferrer"
                className="text-xs text-blue-500 hover:underline mt-2 inline-block">
                View Resume PDF
              </a>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {app.status === 'Applied' && (
                <button
                  onClick={() => handleAction(app._id, 'screen')}
                  disabled={actionLoading === app._id + 'screen'}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200 disabled:opacity-50">
                  Mark as Screened
                </button>
              )}
              {(app.status === 'Applied' || app.status === 'Screened') && (
                <button
                  onClick={() => handleAction(app._id, 'shortlist')}
                  disabled={actionLoading === app._id + 'shortlist'}
                  className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded hover:bg-yellow-200 disabled:opacity-50">
                  Shortlist
                </button>
              )}
              {(app.status === 'Shortlisted' || app.status === 'Screened') && (
                <Link to={`/recruiter/schedule/${app._id}`}
                  className="text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded hover:bg-purple-200">
                  Schedule Interview
                </Link>
              )}
              {app.status === 'Interview Scheduled' && (
                <Link to={`/recruiter/offer/${app._id}`}
                  className="text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded hover:bg-green-200">
                  Generate Offer
                </Link>
              )}
              {!['Rejected', 'Offered'].includes(app.status) && (
                <button
                  onClick={() => handleAction(app._id, 'reject')}
                  disabled={actionLoading === app._id + 'reject'}
                  className="text-sm bg-red-100 text-red-600 px-3 py-1.5 rounded hover:bg-red-200 disabled:opacity-50">
                  Reject
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
