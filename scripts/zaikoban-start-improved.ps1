# Zaikoban Project Launcher - Improved Version
# This script handles common issues with node_modules and dev server

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Zaikoban Development Environment Launcher" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

$appPath = "C:\Users\mskta\IdeaProjects\zaikoban"
Set-Location $appPath

# Function to kill processes on port
function Kill-Port {
    param($port)
    $connection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "Closing process on port $port..." -ForegroundColor Yellow
        Stop-Process -Id $connection.OwningProcess -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }
}

# Step 1: Clean up existing processes
Write-Host "`n[1/5] Cleaning up existing processes..." -ForegroundColor Cyan
Kill-Port 5173

# Kill any hanging node processes
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# Step 2: Check node_modules integrity
Write-Host "`n[2/5] Checking node_modules integrity..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules\.bin\vite.ps1") -and -not (Test-Path "node_modules\.bin\vite.cmd")) {
    Write-Host "Vite not found in node_modules. Installing dependencies..." -ForegroundColor Yellow
    
    # Clean install to avoid lock issues
    if (Test-Path "node_modules") {
        Write-Host "Removing existing node_modules..." -ForegroundColor Yellow
        Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    Write-Host "Running npm ci for clean install..." -ForegroundColor Yellow
    npm ci
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "npm ci failed, trying npm install..." -ForegroundColor Yellow
        npm install
    }
} else {
    Write-Host "node_modules appears intact." -ForegroundColor Green
}

# Step 3: Verify vite is available
Write-Host "`n[3/5] Verifying Vite installation..." -ForegroundColor Cyan
$viteCheck = npm ls vite --depth=0 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Vite not properly installed. Installing..." -ForegroundColor Yellow
    npm install vite --save-dev
}

# Step 4: Start the development server
Write-Host "`n[4/5] Starting development server..." -ForegroundColor Cyan
$serverProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$appPath'; npm run dev" -PassThru

# Wait for server to start
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
$maxAttempts = 20
$attempt = 0
$serverReady = $false

while ($attempt -lt $maxAttempts -and -not $serverReady) {
    Start-Sleep -Seconds 1
    $connection = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
    if ($connection) {
        $serverReady = $true
        Write-Host "Server is ready!" -ForegroundColor Green
    } else {
        $attempt++
        Write-Host "." -NoNewline
    }
}

if (-not $serverReady) {
    Write-Host "`nServer failed to start. Check the console for errors." -ForegroundColor Red
    exit 1
}

# Step 5: Open browser
Write-Host "`n[5/5] Opening browser..." -ForegroundColor Cyan
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$url = "http://localhost:5173"

if (Test-Path $chrome) {
    Start-Process $chrome $url
} else {
    Start-Process $url
}

Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "✅ Zaikoban is running!" -ForegroundColor Green
Write-Host "📍 URL: $url" -ForegroundColor Cyan
Write-Host "⚠️  Press Ctrl+C in the server window to stop" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan

# Keep this window open to show status
Write-Host "`nThis window will close in 10 seconds..." -ForegroundColor Gray
Start-Sleep -Seconds 10