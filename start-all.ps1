# KeyShield Platform Launcher (PowerShell)
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  KeyShield | OpenRouter AI Gateway Launcher" -ForegroundColor Yellow
Write-Host "  Java 21 + Spring Boot 3 + MySQL 8 + React 18" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Configure Environment
if (Test-Path "C:\Users\Aditya Asthana\.jdks\openjdk-26.0.1\bin") {
    $env:JAVA_HOME = "C:\Users\Aditya Asthana\.jdks\openjdk-26.0.1"
    $env:Path = "$env:JAVA_HOME\bin;C:\apache-maven-3.9.16\bin;$env:Path"
}

$env:DB_USER = "root"
$env:DB_PASSWORD = "adimsd"
$env:DB_NAME = "api_platform_db"

Write-Host "[1/2] Launching Spring Boot Backend on http://localhost:8080..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; `$env:JAVA_HOME = '$env:JAVA_HOME'; `$env:Path = '$env:Path'; `$env:DB_USER = '$env:DB_USER'; `$env:DB_PASSWORD = '$env:DB_PASSWORD'; `$env:DB_NAME = '$env:DB_NAME'; java -jar target\api-platform-1.0.0.jar"

Write-Host "[2/2] Launching React + Vite Frontend on http://localhost:5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Both services launched in separate windows!" -ForegroundColor Green
Write-Host "  - Public Landing Page:  http://localhost:5173/" -ForegroundColor Yellow
Write-Host "  - Login / Auth Page:    http://localhost:5173/login" -ForegroundColor Yellow
Write-Host "  - Swagger UI Docs:      http://localhost:8080/swagger-ui/index.html" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Green
