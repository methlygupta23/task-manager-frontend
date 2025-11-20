'use client';

import { useState } from 'react';
import TaskItem from './TaskItem';
import useSWR from 'swr';
import { getAllTasks, updateTaskStatus, deleteTask, getAPIUrl } from '../services/api';

const fetcher = async () => {
  return getAllTasks();
};

export default function TaskList() {
  const [optimisticTasks, setOptimisticTasks] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const { data: tasks = [], error, isLoading, mutate } = useSWR(
    `${getAPIUrl()}/tasks`,
    fetcher,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      onError: (err) => {
        setErrorMessage(err.message);
      },
      onSuccess: () => {
        setErrorMessage(null);
        setOptimisticTasks(null);
      },
    }
  );

  // Use optimistic tasks if available, otherwise use fetched tasks
  const displayTasks = optimisticTasks !== null ? optimisticTasks : tasks;

  const handleToggle = async (id, newStatus) => {
    const taskToUpdate = displayTasks.find(t => t.id === id);
    if (!taskToUpdate) return;

    // Optimistic update: update UI immediately
    const optimisticUpdate = displayTasks.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    );
    setOptimisticTasks(optimisticUpdate);
    setErrorMessage(null);

    try {
      // Update on server
      await updateTaskStatus(id, newStatus);
      
      // Revalidate to get the latest data from server
      await mutate();
    } catch (error) {
      // Rollback on error
      setOptimisticTasks(null);
      setErrorMessage(error.message || 'Failed to update task. Please try again.');
      
      // Revalidate to restore correct state
      mutate();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    const taskToDelete = displayTasks.find(t => t.id === id);
    if (!taskToDelete) return;

    // Optimistic update: remove from UI immediately
    const optimisticUpdate = displayTasks.filter(task => task.id !== id);
    setOptimisticTasks(optimisticUpdate);
    setErrorMessage(null);

    try {
      // Delete on server
      await deleteTask(id);
      
      // Revalidate to get the latest data from server
      await mutate();
    } catch (error) {
      // Rollback on error
      setOptimisticTasks(null);
      setErrorMessage(error.message || 'Failed to delete task. Please try again.');
      
      // Revalidate to restore correct state
      mutate();
    }
  };

  // Display error state
  if (error && !displayTasks.length) {
    const isConnectionError = error.message?.includes('connect') || error.message?.includes('Network');
    
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
              Error loading tasks
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-2 break-words">
              {error.message || 'Failed to load tasks. Please try again later.'}
            </p>
            {isConnectionError && (
              <div className="text-xs text-red-600 dark:text-red-400 mb-3 space-y-1">
                <p className="font-medium">Troubleshooting steps:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Ensure the backend server is running on port 5000</li>
                  <li>Check if the backend API URL is correct: <code className="bg-red-100 dark:bg-red-900/30 px-1 rounded">{getAPIUrl()}</code></li>
                  <li>Verify the backend is accessible by visiting <code className="bg-red-100 dark:bg-red-900/30 px-1 rounded">http://localhost:5000/health</code></li>
                  <li>Check browser console for detailed error messages</li>
                </ul>
              </div>
            )}
            <button
              onClick={() => mutate()}
              className="text-sm font-medium text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100 underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Display loading state (only on initial load)
  if (isLoading && !displayTasks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-3"></div>
        <span className="text-gray-600 dark:text-gray-400">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error message banner (for operation errors) */}
      {errorMessage && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4">
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
              <p className="text-sm text-yellow-800 dark:text-yellow-200 break-words">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 flex-shrink-0"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Loading indicator for refresh */}
      {isLoading && displayTasks.length > 0 && (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Updating...</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
          Tasks {displayTasks.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({displayTasks.length})
            </span>
          )}
        </h2>
      </div>

      {displayTasks.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 px-4">
          <svg
            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-3 text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
            No tasks
          </h3>
          <p className="mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Get started by creating a new task.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
