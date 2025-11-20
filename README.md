# Task Manager Frontend

A modern, responsive task management web application built with Next.js, React, and Tailwind CSS.

## Project Description

This is the frontend application for a task management system. It provides an intuitive interface for creating, viewing, updating, and deleting tasks. The application features real-time updates, optimistic UI updates, and a responsive design that works seamlessly on desktop and mobile devices.

### Features

- ✅ Create, read, update, and delete tasks
- 🎨 Modern, responsive UI with Tailwind CSS
- 🌙 Dark mode support
- ⚡ Optimistic updates for instant feedback
- 🔄 Real-time data synchronization with SWR
- 📱 Mobile-friendly responsive design
- 🚦 Comprehensive error handling and loading states
- ♿ Accessible UI components

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Data Fetching**: SWR (React Hooks for Data Fetching)
- **Language**: JavaScript (JSX)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

### Verify Installation

```bash
node --version
npm --version
```

**Note**: The backend API must be running for the frontend to function properly. See the [Backend Repository](../task-manager-backend) for setup instructions.

## Installation Steps

1. **Clone the repository** (if not already cloned)
   ```bash
   git clone <repository-url>
   cd task-manager-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory (see Environment Variables section below).

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

Create a `.env.local` file in the root directory with the following variable:

### Required Variables

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Optional Variables

If `NEXT_PUBLIC_API_URL` is not set, the application defaults to `http://localhost:5000/api`.

**Note**: 
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- `.env.local` is git-ignored by default for security
- For production, configure these variables in your hosting platform's environment settings

## How to Run the Application

### Development Mode

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

Features:
- Hot module replacement (HMR) for instant updates
- Error overlay in the browser
- Fast refresh for React components

### Production Build

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

The production server will run on `http://localhost:3000` (or your configured PORT).

### Build for Static Export (Optional)

To export as a static site:

1. Configure `next.config.ts` for static export
2. Run:
   ```bash
   npm run build
   ```

## How to Run Tests

Currently, the project doesn't include automated tests. However, you can add testing frameworks:

### Suggested Testing Setup

**Jest + React Testing Library:**

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

**Vitest (Alternative):**

```bash
npm install --save-dev vitest @vitejs/plugin-react
```

## Connecting to Backend

The frontend communicates with the backend API through the centralized API service layer located in `app/services/api.js`.

### API Configuration

The API base URL is configured via the `NEXT_PUBLIC_API_URL` environment variable:

```javascript
// Default: http://localhost:5000/api
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
```

### API Service Functions

The application uses the following API functions:

- `getAllTasks()` - Fetch all tasks
- `createTask(taskData)` - Create a new task
- `updateTaskStatus(id, status)` - Update task status
- `deleteTask(id)` - Delete a task

### Ensure Backend is Running

Before starting the frontend:

1. Start the backend server (see [Backend README](../task-manager-backend/README.md))
2. Verify backend is accessible:
   ```bash
   curl http://localhost:5000/health
   ```
3. Start the frontend development server

## Running with Docker

You can run the entire stack (frontend, backend, PostgreSQL) with Docker using the root-level `docker-compose.yml`:

```bash
# From the repository root
docker compose build
docker compose up
```

- Frontend: http://localhost:3000  
- Backend: http://localhost:4000/api (inside compose it is `http://backend:4000/api`)

Stop the containers with:

```bash
docker compose down
```

## Project Structure

```
task-manager-frontend/
├── app/
│   ├── components/
│   │   ├── TaskForm.jsx      # Form for creating tasks
│   │   ├── TaskItem.jsx      # Individual task component
│   │   └── TaskList.jsx      # List of tasks with SWR
│   ├── services/
│   │   └── api.js            # API service layer
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── public/                   # Static assets
├── .env.local                # Environment variables (create this)
├── next.config.ts            # Next.js configuration
├── package.json
├── package-lock.json
└── README.md
```

## Key Components

### TaskForm

Form component for creating new tasks with:
- Title input (required)
- Description textarea (optional)
- Form validation
- Error handling
- Loading states

### TaskList

Component that displays all tasks with:
- SWR for data fetching and caching
- Loading and error states
- Empty state handling
- Optimistic updates
- Real-time synchronization

### TaskItem

Individual task item component with:
- Toggle completion status
- Delete functionality
- Visual status indicators
- Loading states for operations
- Responsive design

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features in Detail

### Optimistic Updates

The application implements optimistic updates for better user experience:

- **Toggle Status**: UI updates immediately, syncs with backend in background
- **Delete Task**: Task disappears immediately, deletion happens in background
- **Error Handling**: Automatic rollback on failure with error messages

### Error Handling

Comprehensive error handling throughout the application:

- Network error detection
- API error messages
- User-friendly error displays
- Retry functionality
- Dismissible error notifications

### Loading States

Visual feedback for all async operations:

- Initial data loading spinner
- Button loading states
- Individual task operation indicators
- Background refresh indicators

### Responsive Design

Fully responsive layout:

- **Mobile**: Optimized for small screens (< 640px)
- **Tablet**: Medium breakpoints (640px - 1024px)
- **Desktop**: Full-featured layout (> 1024px)

## Troubleshooting

### Backend Connection Issues

**Error: "Failed to fetch tasks" or network errors**

1. Verify backend server is running:
   ```bash
   curl http://localhost:5000/health
   ```

2. Check `NEXT_PUBLIC_API_URL` in `.env.local` matches backend URL

3. Verify CORS is enabled on backend (should be configured)

4. Check browser console for detailed error messages

### Port Already in Use

If port 3000 is already in use:

1. Kill the process:
   ```bash
   # Find process
   lsof -i :3000
   # Kill process (replace PID)
   kill -9 <PID>
   ```

2. Or run on a different port:
   ```bash
   PORT=3001 npm run dev
   ```

### Build Errors

If you encounter build errors:

1. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run build
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC
