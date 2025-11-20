'use client';

import { useState, useEffect } from 'react';
import { getAPIUrl } from '../services/api';

export default function ConnectionStatus() {
  const [status, setStatus] = useState('checking'); // 'checking' | 'connected' | 'disconnected'
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(getAPIUrl().replace('/api', '/health'));
        if (response.ok) {
          setStatus('connected');
        } else {
          setStatus('disconnected');
        }
      } catch (error) {
        setStatus('disconnected');
      }
    };

    checkConnection();
    // Check every 5 seconds
    const interval = setInterval(checkConnection, 5000);

    return () => clearInterval(interval);
  }, []);

  if (status === 'connected') {
    return null; // Don't show anything when connected
  }

  return (
    <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
            Backend Connection Issue
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
            Unable to connect to the backend server. Please ensure the backend is running.
          </p>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 underline"
          >
            {showDetails ? 'Hide' : 'Show'} troubleshooting steps
          </button>
          {showDetails && (
            <div className="mt-3 text-xs text-yellow-700 dark:text-yellow-300 space-y-2">
              <div>
                <p className="font-medium mb-1">Backend URL:</p>
                <code className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded block break-all">
                  {getAPIUrl().replace('/api', '')}
                </code>
              </div>
              <div>
                <p className="font-medium mb-1">Steps to fix:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Open a terminal and navigate to <code className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">task-manager-backend</code></li>
                  <li>Run <code className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">npm start</code></li>
                  <li>Verify you see "Server running on port 5000"</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

