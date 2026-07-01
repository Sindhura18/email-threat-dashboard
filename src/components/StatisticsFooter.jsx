import React from 'react';

const StatisticsFooter = ({ emails, totalEmails }) => {
  const threatCount = emails.filter(e => e.threat_type && e.threat_type !== 'CL').length;
  const cleanCount = emails.filter(e => e.threat_type === 'CL').length;

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg px-6 py-4">
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">
          Showing {emails.length} of {totalEmails} emails
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Threats: {threatCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Clean: {cleanCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsFooter;