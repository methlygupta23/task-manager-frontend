# Quick Start Guide

## Getting Both Servers Running

To fix the "Failed to fetch tasks" and "Unable to add task" errors, you need to run both the backend and frontend servers.

### Step 1: Start the Backend Server

**Open Terminal 1:**

```bash
# Navigate to backend directory
cd "D:\task manager\task-manager-backend"

# Install dependencies (if not already done)
npm install

# Start the backend server
npm start
```

**You should see:**
```
Database connection established successfully
Server running on port 5000
```

**If you see database errors:**
1. Make sure PostgreSQL is installed and running
2. Create a `.env` file in `task-manager-backend` with:
   ```
   DB_NAME=task_manager
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_HOST=127.0.0.1
   DB_PORT=5432
   ```
3. Create the database:
   ```bash
   psql -U postgres
   CREATE DATABASE task_manager;
   \q
   ```

### Step 2: Start the Frontend Server

**Open Terminal 2** (keep Terminal 1 running):

```bash
# Navigate to frontend directory
cd "D:\task manager\task-manager-frontend"

# Install dependencies (if not already done)
npm install

# Start the frontend development server
npm run dev
```

**You should see:**
```
  ▲ Next.js 16.0.3
  - Local:        http://localhost:3000
```

### Step 3: Open the Application

1. Open your browser
2. Navigate to: **http://localhost:3000**
3. The application should now work!

### Verify Everything is Working

1. **Check backend health:**
   - Open: http://localhost:5000/health
   - Should show: `{"status":"ok"}`

2. **Check frontend:**
   - Should load the Task Manager page
   - Connection status should show as connected (or no warning)

3. **Test adding a task:**
   - Enter a task title
   - Click "Add Task"
   - Task should appear in the list

### Still Having Issues?

Check the **TROUBLESHOOTING.md** file for detailed debugging steps.

### Common Issues

**Issue:** "Failed to connect to backend API"
- **Solution:** Make sure backend is running in Terminal 1

**Issue:** "Port 5000 already in use"
- **Solution:** Change `PORT=4001` in backend `.env` and update frontend `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:4001/api`

**Issue:** "Database connection failed"
- **Solution:** Verify PostgreSQL is running and credentials are correct in backend `.env`

**Issue:** "Network error"
- **Solution:** Check both servers are running and URLs match


