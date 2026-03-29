@echo off
echo.
echo  Starting You Inspire Now website...
echo.
echo  When you see "Server running" open your browser and go to:
echo.
echo  http://localhost:3000/index.html
echo.
echo  Keep this window open while using the site.
echo  Press Ctrl+C to stop the server.
echo.
cd /d "%~dp0"
node serve.mjs
pause
