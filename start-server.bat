@echo off
echo ========================================
echo AI Resume Analyzer - Server Startup
echo ========================================
echo.

echo [1/3] Checking MongoDB...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MongoDB not found! Please install MongoDB.
    echo Download from: https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)
echo [OK] MongoDB is installed

echo.
echo [2/3] Starting MongoDB (if not running)...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MongoDB started
) else (
    echo [INFO] MongoDB already running or needs manual start
)

echo.
echo [3/3] Starting Backend Server...
cd server
npm run dev

pause
