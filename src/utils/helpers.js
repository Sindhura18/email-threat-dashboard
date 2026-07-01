/**
 * Returns Tailwind CSS classes for color-coding based on email taxonomy
 * @param {string} taxonomy - The taxonomy type of the email threat
 * @returns {string} Tailwind CSS classes
 */
export const getTaxonomyColor = (taxonomy) => {
  const colors = {
    'businessEmailSpoofing': 'bg-red-50 text-red-700 border-red-300',
    'phishing': 'bg-red-50 text-red-700 border-red-300',
    'spam': 'bg-orange-50 text-orange-700 border-orange-300',
    'malware': 'bg-purple-50 text-purple-700 border-purple-300',
    'businessEmailImpersonation': 'bg-yellow-50 text-yellow-700 border-yellow-300',
    'legitimate': 'bg-green-50 text-green-700 border-green-300'
  };
  return colors[taxonomy] || 'bg-gray-50 text-gray-700 border-gray-300';
};

/**
 * Formats an ISO date string into a human-readable format
 * @param {string} dateString - ISO formatted date string
 * @returns {string} Formatted date string or 'N/A'
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};