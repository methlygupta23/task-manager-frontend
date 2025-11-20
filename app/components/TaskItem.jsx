'use client';

import { useState } from 'react';

export default function TaskItem({ task, onToggle, onDelete }) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    if (isToggling || isDeleting) return;
    
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    setIsToggling(true);
    
    try {
      await onToggle(task.id, newStatus);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting || isToggling) return;
    
    setIsDeleting(true);
    
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = isToggling || isDeleting;

  return (
    <div
      className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-colors ${
        task.status === 'completed'
          ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      } ${isLoading ? 'opacity-75 pointer-events-none' : ''}`}
    >
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`mt-1 flex-shrink-0 w-6 h-6 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all active:scale-95 ${
          task.status === 'completed'
            ? 'bg-green-500 border-green-500 hover:bg-green-600'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
        } ${isToggling ? 'opacity-50 cursor-wait' : ''}`}
        aria-label={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
      >
        {isToggling ? (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
        ) : task.status === 'completed' ? (
          <svg className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : null}
      </button>
      
      <div 
        className={`flex-1 min-w-0 ${isToggling ? 'cursor-wait' : 'cursor-pointer'}`}
        onClick={isToggling ? undefined : handleToggle}
      >
        <h3
          className={`text-base sm:text-lg font-semibold mb-1 break-words ${
            task.status === 'completed'
              ? 'text-gray-500 dark:text-gray-400 line-through'
              : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p
            className={`text-sm sm:text-base mb-2 break-words ${
              task.status === 'completed'
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            {task.description}
          </p>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {new Date(task.createdAt).toLocaleDateString()}
        </p>
      </div>

      <button
        onClick={handleDelete}
        disabled={isLoading}
        className={`flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center ${
          isDeleting ? 'opacity-50 cursor-wait' : ''
        }`}
        aria-label="Delete task"
      >
        {isDeleting ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
