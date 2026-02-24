import React, { useEffect, useState } from 'react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/interviews/my')
      .then(({ data }) => setInterviews(data))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (interviewId, status) => {
    await api.patch(`/interviews/${interviewId}/status`, { status });
    setInterviews(interviews.map(i => i._id === interviewId ? { ...i, status } : i));
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading interviews...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Scheduled Interviews</h1>
      {interviews.length === 0 && (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center text-gray-500">No interviews scheduled.</div>
      )}
      <div className="grid gap-4">
        {interviews.map(interview => (
          <div key={interview._id} className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {interview.application?.applicant?.user?.name || 'Applicant'}
                </h2>
                <p className="text-sm text-gray-500">{interview.application?.applicant?.user?.email}</p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Job:</strong> {interview.application?.job?.title}
                </p>
              </div>
              <StatusBadge status={interview.status} />
            </div>
            <div className="mt-3 text-sm text-gray-600 flex gap-6">
              <span><strong>Date:</strong> {new Date(interview.interviewDate).toLocaleString()}</span>
              <span><strong>Mode:</strong> {interview.mode}</span>
            </div>
            {interview.status === 'Scheduled' && (
              <div className="mt-4 flex gap-2">
                <button onClick={() => updateStatus(interview._id, 'Completed')}
                  className="text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded hover:bg-green-200">
                  Mark Completed
                </button>
                <button onClick={() => updateStatus(interview._id, 'Cancelled')}
                  className="text-sm bg-red-100 text-red-600 px-3 py-1.5 rounded hover:bg-red-200">
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
