export const THREAT_TYPE_CONFIG = {
  SP: { label: 'Spam',          bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', bar: 'bg-orange-400', badge: 'bg-orange-50 text-orange-700 border-orange-300' },
  PH: { label: 'Phishing',      bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    bar: 'bg-red-400',    badge: 'bg-red-50 text-red-700 border-red-300'           },
  MA: { label: 'Malware',       bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', bar: 'bg-purple-400', badge: 'bg-purple-50 text-purple-700 border-purple-300'  },
  IM: { label: 'Impersonation', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', bar: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-700 border-yellow-300'  },
  CL: { label: 'Clean',         bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  bar: 'bg-green-400',  badge: 'bg-green-50 text-green-700 border-green-300'     },
};

export const getThreatTypeLabel = (code) =>
  THREAT_TYPE_CONFIG[code]?.label || code || 'Unknown';

export const getThreatTypeBadgeColor = (code) =>
  THREAT_TYPE_CONFIG[code]?.badge || 'bg-gray-50 text-gray-700 border-gray-300';

export const getThreatScoreColor = (score) => {
  if (score >= 0.9) return 'bg-red-500';
  if (score >= 0.75) return 'bg-orange-500';
  return 'bg-yellow-400';
};

export const getTaxonomyColor = (taxonomy) => {
  const colors = {
    businessEmailSpoofing: "bg-red-50 text-red-700 border-red-300",
    phishing: "bg-red-50 text-red-700 border-red-300",
    spam: "bg-orange-50 text-orange-700 border-orange-300",
    malware: "bg-purple-50 text-purple-700 border-purple-300",
    businessEmailImpersonation:
      "bg-yellow-50 text-yellow-700 border-yellow-300",
    legitimate: "bg-green-50 text-green-700 border-green-300",
  };
  return colors[taxonomy] || "bg-gray-50 text-gray-700 border-gray-300";
};

/**
 * Formats an ISO date string into a human-readable format
 * @param {string} dateString - ISO formatted date string
 * @returns {string} Formatted date string or 'N/A'
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};
