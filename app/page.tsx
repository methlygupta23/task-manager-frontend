'use client';

import { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ConnectionStatus from './components/ConnectionStatus';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskAdded = () => {
    // Trigger refresh of TaskList
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Task Manager
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Organize and manage your tasks efficiently
          </p>
        </header>

        <div className="space-y-6 sm:space-y-8">
          <ConnectionStatus />
          <TaskForm onTaskAdded={handleTaskAdded} />
          <div key={refreshKey}>
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
}
