# run_platform.ps1
$cur = Get-Location
$root = "$cur\ai_trading_system"

Write-Host "`n🚀 Starting AI Trading Platform..." -ForegroundColor Green

# Check requirements
if (-not (Test-Path "$root\requirements.txt")) {
    Write-Error "Could not find requirements.txt at $root"
    exit
}

# Install dependencies (if needed)
$p = Read-Host "Do you want to install dependencies? (y/n)"
if ($p -eq 'y') {
    Write-Host "Installing Python dependencies..."
    cd $root
    pip install -r requirements.txt

    Write-Host "Installing Frontend dependencies..."
    cd "$root\frontend_react"
    npm install
}

# Start Backend (New Process)
Write-Host "`n🖥️  Starting Backend API on port 8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "cd '$root'; uvicorn backend.main:app --reload --port 8000"

# Wait a moment for backend
Start-Sleep -Seconds 5

# Start Frontend (Current Process)
Write-Host "🎨 Starting React Frontend on port 5173..." -ForegroundColor Cyan
cd "$root\frontend_react"
npm run dev
