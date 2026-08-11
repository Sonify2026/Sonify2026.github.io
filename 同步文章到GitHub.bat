@echo off
setlocal
cd /d "%~dp0"

echo.
echo ========================================
echo   Brainy Bell - Sync articles to GitHub
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 goto missing_node
where git >nul 2>&1
if errorlevel 1 goto missing_git

echo [1/4] Reading Obsidian articles and attachments...
call npm run generate:posts
if errorlevel 1 goto failed

echo.
echo [2/4] Checking website content...
call npm run lint
if errorlevel 1 goto failed

echo.
echo [3/4] Building the website...
call npm run build:github
if errorlevel 1 goto failed

if /i "%~1"=="--check" goto check_done

echo.
echo [4/4] Committing and pushing to GitHub...
git add -- content/articles content/generated-posts.ts
git diff --cached --quiet -- content/articles content/generated-posts.ts
if not errorlevel 1 goto push_only

git commit -m "Publish article updates"
if errorlevel 1 goto failed

:push_only
git push origin main
if errorlevel 1 goto failed

echo.
echo ========================================
echo   Sync complete. The website will update automatically.
echo ========================================
echo.
pause
exit /b 0

:check_done
echo.
echo Check complete. Articles and website build successfully.
exit /b 0

:missing_node
echo.
echo Node.js was not found. Install Node.js 22.13 or later.
goto failed_pause

:missing_git
echo.
echo Git was not found. Install Git for Windows.
goto failed_pause

:failed
echo.
echo Sync did not complete. Review the error message above.

:failed_pause
echo.
pause
exit /b 1
