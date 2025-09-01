# Create desktop shortcuts for zaikoban scripts
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ProjectPath = "C:\Users\mskta\IdeaProjects\zaikoban"

# Create zaikoban folder on desktop if it doesn't exist
$ZaikobanDesktopPath = Join-Path $DesktopPath "zaikoban"
if (!(Test-Path $ZaikobanDesktopPath)) {
    New-Item -ItemType Directory -Path $ZaikobanDesktopPath
}

# Create shortcut for zaikoban-start
$WshShell = New-Object -comObject WScript.Shell
$StartShortcut = $WshShell.CreateShortcut("$ZaikobanDesktopPath\Zaikoban-Start.lnk")
$StartShortcut.TargetPath = "powershell.exe"
$StartShortcut.Arguments = "-ExecutionPolicy Bypass -File `"$ProjectPath\scripts\zaikoban-start.ps1`""
$StartShortcut.WorkingDirectory = $ProjectPath
$StartShortcut.IconLocation = "powershell.exe"
$StartShortcut.Description = "Start Zaikoban"
$StartShortcut.Save()

# Create shortcut for zaikoban-kill-port
$KillShortcut = $WshShell.CreateShortcut("$ZaikobanDesktopPath\Kill-Port-3306.lnk")
$KillShortcut.TargetPath = "powershell.exe"
$KillShortcut.Arguments = "-ExecutionPolicy Bypass -File `"$ProjectPath\scripts\zaikoban-kill-port.ps1`""
$KillShortcut.WorkingDirectory = $ProjectPath
$KillShortcut.IconLocation = "powershell.exe"
$KillShortcut.Description = "Kill process using port 3306"
$KillShortcut.Save()

Write-Host "Shortcuts created successfully:"
Write-Host "  - $ZaikobanDesktopPath\Zaikoban-Start.lnk"
Write-Host "  - $ZaikobanDesktopPath\Kill-Port-3306.lnk"
Write-Host ""
Write-Host "You can double-click these shortcuts to run the scripts."