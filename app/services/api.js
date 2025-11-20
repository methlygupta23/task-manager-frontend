/**
 * API Service Layer
 * Centralized functions for all backend API calls
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle different response statuses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content (like DELETE requests)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    // Re-throw with more context if it's already our custom error
    if (error instanceof Error) {
      // Check for specific network errors
      if (error.message.includes('fetch') || error.message.includes('Network')) {
        throw new Error(
          `Failed to connect to backend API at ${API_URL}. Please ensure the backend server is running.`
        );
      }
      throw error;
    }
    // Handle network errors
    throw new Error(
      `Network error: Unable to reach ${API_URL}. Please ensure the backend server is running (default http://localhost:5000/api).`
    );
  }
}

/**
 * Task API Functions
 */

/**
 * Fetch all tasks
 * @returns {Promise<Array>} Array of tasks
 */
export async function getAllTasks() {
  return fetchAPI('/tasks');
}

/**
 * Create a new task
 * @param {Object} taskData - Task data (title, description, status)
 * @returns {Promise<Object>} Created task
 */
export async function createTask(taskData) {
  if (!taskData.title || typeof taskData.title !== 'string') {
    throw new Error('Title is required');
  }

  return fetchAPI('/tasks', {
    method: 'POST',
    body: JSON.stringify({
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      status: taskData.status || 'pending',
    }),
  });
}

/**
 * Update task status
 * @param {string|number} id - Task ID
 * @param {string} status - New status ('pending' or 'completed')
 * @returns {Promise<Object>} Updated task
 */
export async function updateTaskStatus(id, status) {
  if (!status || !['pending', 'completed'].includes(status)) {
    throw new Error('Valid status is required (pending or completed)');
  }

  return fetchAPI(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

/**
 * Delete a task
 * @param {string|number} id - Task ID
 * @returns {Promise<void>}
 */
export async function deleteTask(id) {
  return fetchAPI(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Get API URL for SWR and other uses
 */
export function getAPIUrl() {
  return API_URL;
}

