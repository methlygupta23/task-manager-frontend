# Troubleshooting Guide

## Issue: "Failed to fetch tasks" or "Unable to add task"

This guide will help you diagnose and fix connection issues between the frontend and backend.

### Quick Checklist

1. ✅ **Backend server is running**
   ```bash
   cd task-manager-backend
   npm start
   # Should see: "Server running on port 5000"
   ```

2. ✅ **Backend is accessible**
   ```bash
   # In browser or terminal:
   curl http://localhost:5000/health
   # Should return: {"status":"ok"}
   ```

3. ✅ **Frontend is using correct API URL**
   - Check browser console for API URL
   - Default: `http://localhost:5000/api`
   - Verify in `.env.local` file if custom URL is set

4. ✅ **Database is set up and running**
   ```bash
   # Check PostgreSQL is running
   # Verify database exists and backend can connect
   ```

### Step-by-Step Debugging

#### Step 1: Verify Backend is Running

Open a terminal and navigate to the backend directory:

```bash
cd task-manager-backend
npm start
```

You should see:
```
Database connection established successfully
Server running on port 5000
```

**If you see database errors:**
- Ensure PostgreSQL is installed and running
- Check database credentials in `.env` file
- Verify database `task_manager` exists

#### Step 2: Test Backend API Directly

Open a new terminal and test the backend:

```bash
# Health check
curl http://localhost:5000/health

# Get all tasks
curl http://localhost:5000/api/tasks

# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Testing"}'
```

If these commands fail, the backend is not working correctly.

#### Step 3: Check Frontend Configuration

1. **Verify environment variable** (optional):
   
   Create `.env.local` in `task-manager-frontend/`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

2. **Restart the frontend server** after creating/modifying `.env.local`:
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

3. **Check browser console**:
   - Open DevTools (F12)
   - Go to Console tab
   - Look for error messages
   - Check Network tab for failed requests

#### Step 4: Check CORS Configuration

The backend has CORS enabled by default. If you're still getting CORS errors:

1. Verify backend `src/app.js` has:
   ```javascript
   app.use(cors());
   ```

2. If using a custom backend URL, ensure CORS allows that origin.

#### Step 5: Verify Port Configuration

**Default ports:**
- Backend: `5000`
- Frontend: `3000`

**If port 5000 is already in use:**

1. Change backend port:
   ```env
   # In task-manager-backend/.env
   PORT=5001
   ```

2. Update frontend API URL:
   ```env
   # In task-manager-frontend/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

3. Restart both servers.

### Common Error Messages and Solutions

#### "Failed to connect to backend API"
- **Cause**: Backend server is not running
- **Solution**: Start the backend server in a separate terminal

#### "Network error: Unable to reach http://localhost:5000/api"
- **Cause**: Backend is not accessible or wrong URL
- **Solution**: 
  1. Verify backend is running
  2. Check the URL in browser console
  3. Test with curl command

#### "CORS policy: No 'Access-Control-Allow-Origin' header"
- **Cause**: CORS not configured correctly
- **Solution**: Ensure `cors()` middleware is in backend `app.js`

#### "Title is required" (when trying to add task)
- **Cause**: Form validation working, but backend connection may have failed
- **Solution**: Check browser console for actual error after clearing form validation

#### "Database connection failed"
- **Cause**: PostgreSQL not running or wrong credentials
- **Solution**:
  1. Start PostgreSQL service
  2. Verify `.env` file has correct database credentials
  3. Ensure database `task_manager` exists

### Testing the Connection

Run this in your browser console (on the frontend page):

```javascript
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(data => console.log('Backend is accessible:', data))
  .catch(err => console.error('Backend not accessible:', err));
```

If this fails, the backend is not reachable from the browser.

### Still Having Issues?

1. **Check both terminal windows**:
   - One for backend (should show server running)
   - One for frontend (should show Next.js dev server)

2. **Clear browser cache**:
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

3. **Check firewall/antivirus**:
   - May be blocking localhost connections

4. **Verify Node.js version**:
   ```bash
   node --version  # Should be v14+ for backend, v18+ for frontend
   ```

5. **Reinstall dependencies**:
   ```bash
   # In both directories:
   rm -rf node_modules package-lock.json
   npm install
   ```

### Getting More Details

Enable detailed logging:

1. **Backend**: Already logs to console
2. **Frontend**: Check browser DevTools → Network tab
   - Filter by "Fetch/XHR"
   - Look for requests to `/api/tasks`
   - Check response status and body

### Quick Start Scripts

**Terminal 1 - Backend:**
```bash
cd task-manager-backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd task-manager-frontend
npm run dev
```

Then open: http://localhost:3000


