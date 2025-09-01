# Kill process on port 5173 (Vite default port)
Clear-Host
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "      Zaikoban Port 5173 Process Killer      " -ForegroundColor Red
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking port 5173..." -ForegroundColor Yellow

try {
    $connection = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction Stop
    $processId = $connection.OwningProcess
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    if ($process) {
        Write-Host ""
        Write-Host "Found process:" -ForegroundColor Yellow
        Write-Host "  Process Name: $($process.ProcessName)" -ForegroundColor White
        Write-Host "  PID: $processId" -ForegroundColor White
        Write-Host "  Memory: $([math]::Round($process.WorkingSet64 / 1MB, 2)) MB" -ForegroundColor White
        Write-Host "  CPU Time: $($process.TotalProcessorTime)" -ForegroundColor White
        
        Write-Host ""
        Write-Host "Killing process..." -ForegroundColor Red
        Stop-Process -Id $processId -Force -ErrorAction Stop
        
        Start-Sleep -Seconds 1
        
        Write-Host "✓ Process killed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Port 5173 is now free." -ForegroundColor Green
    }
} catch [Microsoft.PowerShell.Cmdletization.Cim.CimJobException] {
    Write-Host "✓ No process running on port 5173" -ForegroundColor Green
    Write-Host "Port is already free." -ForegroundColor Gray
} catch {
    if ($_.Exception.Message -like "*Cannot find a process*") {
        Write-Host "✓ No process running on port 5173" -ForegroundColor Green
        Write-Host "Port is already free." -ForegroundColor Gray
    } else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Press Enter to exit..."
Read-Host