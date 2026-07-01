import React from 'react';
import { getTaxonomyColor, getThreatTypeLabel, getThreatTypeBadgeColor, getThreatScoreColor, formatDate } from '../utils/helpers';

const ScoreBar = ({ score }) => {
  if (score === null || score === undefined) return null;
  const pct = Math.round(score * 100);
  return (
    <div className="mt-3">
      <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
        <span>Threat Score</span>
        <span className="font-semibold text-gray-600">{pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getThreatScoreColor(score)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const EmailListItem = ({ email, onClick }) => (
  <div
    onClick={() => onClick(email)}
    className="bg-white border border-gray-200 rounded-lg px-6 py-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
    role="button"
    tabIndex={0}
    onKeyPress={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onClick(email);
    }}
  >
    <div className="flex items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 mb-3 text-lg leading-snug">
          {email.subject || 'No Subject'}
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-gray-500">
            <span className="font-medium">Sender Domain:</span> {email.sender_domain || 'N/A'}
          </div>
          <div className="text-gray-500">
            <span className="font-medium">Message ID:</span> {email.internet_message_id || 'N/A'}
          </div>
          <div className="text-gray-500">
            <span className="font-medium">Threat ID:</span> {email.threat_id || 'N/A'}
          </div>
          <div className="text-gray-500">
            <span className="font-medium">Created:</span> {formatDate(email.created_on)}
          </div>
        </div>
        <ScoreBar score={email.score} />
      </div>

      <div className="flex flex-col items-end gap-2 min-w-[220px]">
        <div className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap border ${getThreatTypeBadgeColor(email.threat_type)}`}>
          {email.threat_type} · {getThreatTypeLabel(email.threat_type)}
        </div>
        <div className="px-3 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium whitespace-nowrap">
          {email.classifier || 'N/A'}
        </div>
        <div className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap border ${getTaxonomyColor(email.taxonomy)}`}>
          {email.taxonomy || 'N/A'}
        </div>
        <div className="text-sm text-gray-500 whitespace-nowrap mt-1">
          {formatDate(email.imported_at)}
        </div>
      </div>
    </div>
  </div>
);

export default EmailListItem;
