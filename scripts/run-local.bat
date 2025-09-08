@echo off
echo 在庫番を起動しています...
cd /d "%~dp0\..\dist"
npx serve -s . -l 3000
pause