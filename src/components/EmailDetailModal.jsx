import React from 'react';
import { RefreshCw, X, ArrowLeft } from 'lucide-react';
import { getTaxonomyColor, getThreatTypeLabel, getThreatTypeBadgeColor, getThreatScoreColor, formatDate } from '../utils/helpers';

const ScoreBar = ({ score }) => {
  if (score === null || score === undefined) return null;
  const pct = Math.round(score * 100);
  return (
    <div>
      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Threat Score</label>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${getThreatScoreColor(score)}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 w-10 text-right">{pct}%</span>
      </div>
    </div>
  );
};

const EmailDetailModal = ({ email, onClose, loading }) => {
  const DetailField = ({ label, value, breakAll = false }) => (
    <div>
      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <div className={`mt-1 text-gray-900 dark:text-gray-200 ${breakAll ? 'break-all' : ''}`}>
        {value || 'N/A'}
      </div>
    </div>
  );

  if (!email && !loading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Email Data Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Unable to load email details. Please try again.</p>
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-600 dark:text-gray-300" aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Email Details</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-600 dark:text-gray-300" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw size={32} className="text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading email details...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Subject */}
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</label>
                <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {email.subject || 'No Subject'}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <div className={`px-3 py-1.5 rounded text-sm font-semibold border ${getThreatTypeBadgeColor(email.threat_type)}`}>
                  {email.threat_type} · {getThreatTypeLabel(email.threat_type)}
                </div>
                <div className="px-3 py-1.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60 text-sm font-medium">
                  {email.classifier || 'N/A'}
                </div>
                <div className={`px-3 py-1.5 rounded text-sm font-medium border ${getTaxonomyColor(email.taxonomy)}`}>
                  {email.taxonomy || 'N/A'}
                </div>
              </div>

              {/* Email Body */}
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Body</label>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 max-h-64 overflow-y-auto">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {email.body || 'No content available'}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Threat ID" value={email.threat_id} />
                <DetailField label="Threat Type" value={email.threat_type} />
                <DetailField label="Sender Domain" value={email.sender_domain} />
                <DetailField label="Message ID" value={email.internet_message_id} breakAll />
                <DetailField label="Classifier" value={email.classifier} />
                <DetailField label="Taxonomy" value={email.taxonomy} />
                <ScoreBar score={email.score} />
                <DetailField label="Created On" value={formatDate(email.created_on)} />
                <DetailField label="Imported At" value={formatDate(email.imported_at)} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailDetailModal;
