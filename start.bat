@echo off
echo Starting Aashiyana Homes Society Management System...
echo.

REM Start Backend
echo Starting FastAPI backend on port 8000...
start "Aashiyana Backend" cmd /k "cd backend && python main.py"

timeout /t 3 /nobreak

REM Start Frontend
echo Starting React frontend on port 5173...
start "Aashiyana Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Backend: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Frontend: http://localhost:5173
echo.
echo Close these windows to stop the servers
