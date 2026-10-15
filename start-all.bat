@echo off
title KeyShield Platform Launcher
echo ========================================================
echo   KeyShield ^| OpenRouter AI Gateway Launcher
echo   Java 21 + Spring Boot 3 + MySQL 8 + React 18
echo ========================================================
echo.

:: Ensure Java and Maven paths if not in system PATH
if exist "C:\Users\Aditya Asthana\.jdks\openjdk-26.0.1\bin" (
    set "JAVA_HOME=C:\Users\Aditya Asthana\.jdks\openjdk-26.0.1"
    set "PATH=C:\Users\Aditya Asthana\.jdks\openjdk-26.0.1\bin;C:\apache-maven-3.9.16\bin;%PATH%"
)

set "DB_USER=root"
set "DB_PASSWORD=adimsd"
set "DB_NAME=api_platform_db"

echo [1/2] Starting Spring Boot Backend on http://localhost:8080...
start "KeyShield Backend (Spring Boot)" cmd /k "cd backend && java -jar target\api-platform-1.0.0.jar"

echo [2/2] Starting React + Vite Frontend on http://localhost:5173...
start "KeyShield Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo   Services are starting up!
echo   - Public Landing:    http://localhost:5173/
echo   - Login Page:        http://localhost:5173/login
echo   - Backend API:       http://localhost:8080/
echo   - Swagger Docs:      http://localhost:8080/swagger-ui/index.html
echo ========================================================
pause
