# Clean Start Script for Odd/Even Multiplayer Game
# Run this script to cleanly start both servers

Write-Host "🧹 Cleaning up old processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "🎮 Starting WebSocket Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run server"

Start-Sleep -Seconds 3

Write-Host "🌐 Starting Next.js Client..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Instructions:" -ForegroundColor Yellow
Write-Host "  1. Wait for both servers to fully start (check the PowerShell windows)"
Write-Host "  2. Open http://localhost:3000 in ONE browser window"
Write-Host "  3. Open http://localhost:3000 in ANOTHER browser window (incognito mode)"
Write-Host "  4. Start playing!"
Write-Host ""
Write-Host "⚠️  Important:" -ForegroundColor Red
Write-Host "  - CLOSE ALL existing localhost:3000 tabs BEFORE opening new ones"
Write-Host "  - If you see connection loops, close ALL tabs and refresh"
Write-Host ""
