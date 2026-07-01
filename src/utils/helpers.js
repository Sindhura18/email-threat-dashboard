export const THREAT_TYPE_CONFIG = {
  SP: {
    label: 'Spam',
    bg:     'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800/60',
    text:   'text-orange-700 dark:text-orange-300',
    bar:    'bg-orange-400',
    badge:  'bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-700/60',
  },
  PH: {
    label: 'Phishing',
    bg:     'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800/60',
    text:   'text-red-700 dark:text-red-300',
    bar:    'bg-red-400',
    badge:  'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-700/60',
  },
  MA: {
    label: 'Malware',
    bg:     'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-800/60',
    text:   'text-purple-700 dark:text-purple-300',
    bar:    'bg-purple-400',
    badge:  'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-700/60',
  },
  IM: {
    label: 'Impersonation',
    bg:     'bg-yellow-50 dark:bg-yellow-950/30',
    border: 'border-yellow-200 dark:border-yellow-800/60',
    text:   'text-yellow-700 dark:text-yellow-300',
    bar:    'bg-yellow-400',
    badge:  'bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-700/60',
  },
  CL: {
    label: 'Clean',
    bg:     'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-800/60',
    text:   'text-green-700 dark:text-green-300',
    bar:    'bg-green-400',
    badge:  'bg-green-50 text-green-700 border-green-300 dark:bg-green-950/40 dark:text-green-300 dark:border-green-700/60',
  },
};

export const getThreatTypeLabel = (code) =>
  THREAT_TYPE_CONFIG[code]?.label || code || 'Unknown';

export const getThreatTypeBadgeColor = (code) =>
  THREAT_TYPE_CONFIG[code]?.badge || 'bg-gray-50 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';

export const getThreatScoreColor = (score) => {
  if (score >= 0.9) return 'bg-red-500';
  if (score >= 0.75) return 'bg-orange-500';
  return 'bg-yellow-400';
};

export const getTaxonomyColor = (taxonomy) => {
  const colors = {
    businessEmailSpoofing:      'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-700/60',
    phishing:                   'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-700/60',
    spam:                       'bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-700/60',
    malware:                    'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-700/60',
    businessEmailImpersonation: 'bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-700/60',
    legitimate:                 'bg-green-50 text-green-700 border-green-300 dark:bg-green-950/40 dark:text-green-300 dark:border-green-700/60',
  };
  return colors[taxonomy] || 'bg-gray-50 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return 'Invalid Date';
  }
};
