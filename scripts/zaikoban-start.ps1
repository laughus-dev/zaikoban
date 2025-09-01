# Zaikoban Project Launcher
Write-Host "Starting Zaikoban..." -ForegroundColor Green

# Kill port 5173 (Vite default port)
$port = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
if ($port) {
    Write-Host "Closing existing process on port 5173..." -ForegroundColor Yellow
    Stop-Process -Id $port.OwningProcess -Force
    Start-Sleep -Seconds 1
}

# Start Vite dev server
$appPath = "C:\Users\mskta\IdeaProjects\zaikoban"
Write-Host "Starting development server..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/k cd /d `"$appPath`" && npm run dev"

# Wait for server to start
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

# Open Chrome or default browser
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$url = "http://localhost:5173"

if (Test-Path $chrome) {
    Write-Host "Opening Chrome..." -ForegroundColor Green
    Start-Process $chrome $url
} else {
    Write-Host "Opening default browser..." -ForegroundColor Green
    Start-Process $url
}

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Zaikoban is running!" -ForegroundColor Green
Write-Host "URL: $url" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan