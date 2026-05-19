@echo off
title Go Inspire Now — Local Server
echo.
echo  ============================================
echo   Go Inspire Now — Starting Local Server
echo  ============================================
echo.
echo  Opening: http://localhost:3000/go-inspire-now/
echo  Press Ctrl+C to stop the server.
echo.

cd /d "%~dp0.."
start "" "http://localhost:3000/go-inspire-now/"
node serve.mjs
pause
