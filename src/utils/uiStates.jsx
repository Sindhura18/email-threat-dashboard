import React from 'react';
import { RefreshCw } from 'lucide-react';

export const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <RefreshCw size={32} className="text-blue-600 animate-spin mb-3" />
    <div className="text-gray-500">Loading emails...</div>
  </div>
);

export const ErrorState = ({ error, apiUrl }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
    <strong>Error:</strong> {error}
    <div className="text-sm mt-2">
      Make sure your backend server is running at:
      <code className="block mt-1 bg-red-100 px-2 py-1 rounded text-xs">
        {apiUrl}
      </code>
    </div>
  </div>
);

export const EmptyState = ({ searchQuery, emailCount }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="text-6xl mb-4">📭</div>
    <div className="text-xl text-gray-500 mb-2">No emails found</div>
    {searchQuery && (
      <div className="text-sm text-gray-400">Try adjusting your search</div>
    )}
    {!searchQuery && emailCount === 0 && (
      <div className="text-sm text-gray-400 mt-2">
        No data available from the API
      </div>
    )}
  </div>
);