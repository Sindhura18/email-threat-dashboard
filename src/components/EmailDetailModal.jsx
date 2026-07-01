import React from "react";
import { RefreshCw, X, ArrowLeft } from "lucide-react";
import { getTaxonomyColor, formatDate } from "../utils/helpers";

const EmailDetailModal = ({ email, onClose, loading }) => {
  const DetailField = ({ label, value, breakAll = false }) => (
    <div>
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <div className={`mt-1 text-gray-900 ${breakAll ? "break-all" : ""}`}>
        {value || "N/A"}
      </div>
    </div>
  );

  if (!email && !loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Email Data Found
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load email details. Please try again.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold">Email Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw size={32} className="text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">
                Loading email details...
              </span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Subject */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Subject
                </label>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {email.subject || "No Subject"}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1.5 rounded bg-blue-50 text-blue-700 border border-blue-300 text-sm font-medium">
                  {email.classifier || "N/A"}
                </div>
                <div
                  className={`px-3 py-1.5 rounded text-sm font-medium border ${getTaxonomyColor(email.taxonomy)}`}
                >
                  {email.taxonomy || "N/A"}
                </div>
              </div>

              {/* Email Body */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email Body
                </label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {email.body || "No content available"}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Threat ID" value={email.threat_id} />
                <DetailField label="Threat Type" value={email.threat_type} />
                <DetailField
                  label="Sender Domain"
                  value={email.sender_domain}
                />
                <DetailField
                  label="Message ID"
                  value={email.internet_message_id}
                  breakAll
                />
                <DetailField label="Classifier" value={email.classifier} />
                <DetailField label="Taxonomy" value={email.taxonomy} />
                <DetailField
                  label="Score"
                  value={email.score !== null ? email.score : "N/A"}
                />
                <DetailField
                  label="Created On"
                  value={formatDate(email.created_on)}
                />
                <DetailField
                  label="Imported At"
                  value={formatDate(email.imported_at)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailDetailModal;
