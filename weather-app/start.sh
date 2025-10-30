#!/bin/bash

echo "=========================================="
echo "  Weather Forecast Application"
echo "=========================================="
echo ""
echo "Installing dependencies..."
pip3 install -r requirements.txt

echo ""
echo "Starting Flask server..."
echo "Access the application at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 app.py
