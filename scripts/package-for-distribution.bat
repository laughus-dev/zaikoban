@echo off
echo 配布用パッケージを作成中...

:: ビルド実行
call npm run build

:: 配布用フォルダ作成
if not exist "zaikoban-demo" mkdir zaikoban-demo
xcopy /E /Y dist zaikoban-demo\app\

:: 起動スクリプト作成
echo @echo off > zaikoban-demo\start.bat
echo echo 在庫番デモを起動します... >> zaikoban-demo\start.bat
echo echo ブラウザが自動で開きます。 >> zaikoban-demo\start.bat
echo cd app >> zaikoban-demo\start.bat
echo npx serve -s . -l 5000 >> zaikoban-demo\start.bat

:: READMEファイル作成
echo # 在庫番デモアプリ > zaikoban-demo\README.txt
echo. >> zaikoban-demo\README.txt
echo ## 起動方法 >> zaikoban-demo\README.txt
echo 1. start.batをダブルクリック >> zaikoban-demo\README.txt
echo 2. ブラウザで http://localhost:5000 が開きます >> zaikoban-demo\README.txt
echo. >> zaikoban-demo\README.txt
echo ## 必要環境 >> zaikoban-demo\README.txt
echo - Node.js (https://nodejs.org/) >> zaikoban-demo\README.txt
echo. >> zaikoban-demo\README.txt
echo ## 終了方法 >> zaikoban-demo\README.txt
echo コマンドプロンプトでCtrl+Cを押してください >> zaikoban-demo\README.txt

echo.
echo 配布用パッケージを作成しました: zaikoban-demo フォルダ
echo このフォルダをZIP化して配布できます。
pause