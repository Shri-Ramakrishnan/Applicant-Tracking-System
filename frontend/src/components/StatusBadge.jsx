import React from 'react';

const STATUS_COLORS = {
  Applied: 'bg-gray-100 text-gray-700',
  Screened: 'bg-blue-100 text-blue-700',
  Shortlisted: 'bg-yellow-100 text-yellow-800',
  'Interview Scheduled': 'bg-purple-100 text-purple-700',
  Offered: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  active: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
  Scheduled: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-600',
  Pending: 'bg-yellow-100 text-yellow-700',
  Accepted: 'bg-green-100 text-green-700'
};

export default function StatusBadge({ status }) {
  const classes = STATUS_COLORS[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${classes}`}>
      {status}
    </span>
  );
}
