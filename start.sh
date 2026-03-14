#!/bin/bash

echo "Starting Aashiyana Homes Society Management System..."

# Start Backend
echo "Starting FastAPI backend on port 8000..."
cd backend
python main.py &
BACKEND_PID=$!

# Start Frontend
echo "Starting React frontend on port 5173..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Backend running with PID: $BACKEND_PID"
echo "Frontend running with PID: $FRONTEND_PID"
echo ""
echo "Backend: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait
