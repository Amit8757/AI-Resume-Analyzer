@echo off
echo ========================================
echo AI Resume Analyzer - Quick Start Guide
echo ========================================
echo.
echo This script will help you start both the backend and frontend servers.
echo.
echo STEP 1: Start Backend Server
echo ----------------------------
echo Open a NEW terminal and run:
echo    cd d:\AI_Resume
echo    start-server.bat
echo.
echo OR manually:
echo    cd d:\AI_Resume\server
echo    npm run dev
echo.
echo Wait for "Server is running on port 5000" message
echo.
echo.
echo STEP 2: Start Frontend
echo ----------------------
echo Open ANOTHER terminal and run:
echo    cd d:\AI_Resume\Client
echo    npm run dev
echo.
echo Wait for "Local: http://localhost:5173" message
echo.
echo.
echo STEP 3: Test the Application
echo ----------------------------
echo 1. Open browser: http://localhost:5173
echo 2. Login or register
echo 3. Upload a PDF resume
echo 4. Paste a job description
echo 5. Click "Analyze Resume"
echo 6. Check browser console (F12) for any errors
echo.
echo.
echo TROUBLESHOOTING:
echo ===============
echo.
echo If "Analyze Resume" button doesn't work:
echo.
echo 1. CHECK BACKEND IS RUNNING
echo    - Look for "Server is running on port 5000" in terminal
echo    - Look for "MongoDB Connected" message
echo.
echo 2. CHECK MONGODB IS RUNNING
echo    - Open Services (services.msc)
echo    - Find "MongoDB" service
echo    - Make sure it's "Running"
echo    - If not, click "Start"
echo.
echo 3. CHECK BROWSER CONSOLE
echo    - Press F12 in browser
echo    - Go to Console tab
echo    - Look for red error messages
echo    - Share these errors with me
echo.
echo 4. CHECK NETWORK TAB
echo    - Press F12 in browser
echo    - Go to Network tab
echo    - Click "Analyze Resume"
echo    - Look for failed requests (red)
echo    - Check the status code and response
echo.
echo 5. COMMON ISSUES:
echo    - "Network Error" = Backend not running
echo    - "401 Unauthorized" = Login expired, login again
echo    - "404 Not Found" = Wrong API URL
echo    - No response = Check if resume uploaded successfully
echo.
echo.
pause
