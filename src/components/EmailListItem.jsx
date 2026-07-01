import React from 'react';
import { getTaxonomyColor, formatDate } from '../utils/helpers';

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
      {/* Email Content */}
      <div className="flex-1 min-w-0">
        {/* Subject */}
        <div className="font-semibold text-gray-900 mb-3 text-lg">
          {email.subject || 'No Subject'}
        </div>

        {/* Email Metadata */}
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
      </div>

      {/* Badges and Time */}
      <div className="flex flex-col items-end gap-2 min-w-[220px]">
        {/* Classifier Badge */}
        <div className="px-3 py-1 rounded bg-blue-50 text-blue-700 border border-blue-300 text-xs font-medium whitespace-nowrap">
          {email.classifier || 'N/A'}
        </div>

        {/* Taxonomy Badge */}
        <div className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap border ${getTaxonomyColor(email.taxonomy)}`}>
          {email.taxonomy || 'N/A'}
        </div>

        {/* Imported At */}
        <div className="text-sm text-gray-600 whitespace-nowrap mt-1">
          {formatDate(email.imported_at)}
        </div>
      </div>
    </div>
  </div>
);

export default EmailListItem;