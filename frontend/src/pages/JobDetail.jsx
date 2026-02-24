import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => setJob(data))
      .catch(() => setError('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (!resumeFile) {
      setError('Please upload a PDF resume');
      return;
    }

    setApplying(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      await api.post(`/applications/apply/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setShowSuccessModal(true);

      setTimeout(() => {
        navigate('/jobs');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading)
    return <div className="text-center py-10 text-slate-400">Loading...</div>;

  if (error && !job)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-8">

        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-white">
            {job.title}
          </h1>
          <StatusBadge status={job.status} />
        </div>

        <p className="text-slate-400 text-sm mb-2">
          {job.recruiter?.user?.name} · {job.recruiter?.organization} · {job.location}
        </p>

        <p className="text-xs text-slate-500 mb-8">
          Posted on {new Date(job.createdAt).toLocaleDateString()}
        </p>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
          <p className="text-slate-300 text-sm whitespace-pre-line">
            {job.description}
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">Requirements</h3>
          <p className="text-slate-300 text-sm whitespace-pre-line">
            {job.requirements}
          </p>
        </div>

        {user?.role === 'applicant' && job.status === 'active' && (
          <form onSubmit={handleApply} className="border-t border-slate-700 pt-8 mt-6">

            <h3 className="text-xl font-semibold text-white mb-6">
              Apply for this Position
            </h3>

            {error && (
              <div className="bg-red-900/40 border border-red-600 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm text-slate-400 mb-2">
                Upload Resume (PDF only)
              </label>

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="input-dark"
              />
            </div>

            <button
              type="submit"
              disabled={applying}
              className="btn-primary"
            >
              {applying ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-xl text-center">
            <h2 className="text-xl font-bold text-green-400 mb-2">
              Applied Successfully!
            </h2>
            <p className="text-slate-400 text-sm">
              Redirecting to job listings...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}