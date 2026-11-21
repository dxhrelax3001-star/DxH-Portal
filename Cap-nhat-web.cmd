@echo off
chcp 65001 >nul
rem Gom trang cong + PDF Editor + Load Planner vao dist\ roi mo GitHub Desktop de Push len dxh3001.pages.dev
cd /d "%~dp0"
node build.js || (pause & exit /b 1)
echo.
echo Da gom xong. Mo GitHub Desktop -^> repo DxH-Portal -^> Commit -^> Push origin.
start "" github "%~dp0"
pause
