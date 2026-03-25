# 🚀 Multi-Crypto AI Signal Engine & Trading Platform

![Project Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Python Version](https://img.shields.io/badge/python-3.9%2B-green.svg)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![Frontend](https://img.shields.io/badge/frontend-React%20+%20Vite-61DAFB)
![Styling](https://img.shields.io/badge/styling-TailwindCSS-38BDF8)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📖 Overview

The **Multi-Crypto AI Signal Engine** is a production-ready machine learning system for real-time cryptocurrency market trend prediction and risk management.

Instead of relying on static, pre-trained models that quickly become outdated due to market volatility, this system utilizes **Online Learning** (Mini-batch incremental training via `SGDClassifier`). It continuously ingests fresh market data, recalculates technical indicators on the fly, and updates its weights in real-time — guaranteeing adaptation to recent market shifts, drift, and structural changes.

The platform features a modular architecture with a **FastAPI** backend serving REST APIs and a **React (Vite + TailwindCSS)** frontend for a premium, interactive dashboard experience.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Online Learning** | Continuous `SGDClassifier` training without full retraining — adapts to market shifts in real-time |
| **Feature Engineering** | Dynamic technical indicators: `SMA_7`, `SMA_21`, `EMA`, `RSI`, `Volatility`, `Returns` |
| **Risk Engine** | Value at Risk (VaR), dynamic position sizing, and circuit breaker protection |
| **Crypto Intelligence** | Funding rates, open interest, and liquidation level analysis |
| **React Dashboard** | Premium dark-mode UI with interactive Recharts, auto-refresh every 30s |
| **Microservices** | FastAPI backend + Redis Feature Store + TimescaleDB for time-series data |

---

## 🏗️ Architecture

```
┌─────────────────────────┐     ┌──────────────────────────┐
│  React Frontend (Vite)  │────▶│  FastAPI Backend (:8000)  │
│  Port 5173              │◀────│  /api/v1/crypto/*         │
└─────────────────────────┘     └───────────┬──────────────┘
                                            │
                           ┌────────────────┼────────────────┐
                           ▼                ▼                ▼
                    ┌─────────────┐  ┌────────────┐  ┌──────────────┐
                    │ CoinGecko   │  │   Redis     │  │ TimescaleDB  │
                    │ API         │  │ Feature     │  │ Historical   │
                    │ (Data)      │  │ Store       │  │ Data         │
                    └─────────────┘  └────────────┘  └──────────────┘
```

---

## 📂 Project Structure

```text
📦 project_root/
 ┣ 📜 app.py                           # Legacy Streamlit App (standalone mode)
 ┣ 📜 run_platform.ps1                 # One-click launch script (Backend + Frontend)
 ┣ 📜 README.md
 ┗ 📂 ai_trading_system/
    ┣ 📜 docker-compose.yml            # Redis + TimescaleDB containers
    ┣ 📜 requirements.txt              # Python dependencies
    ┣ 📂 backend/                      # FastAPI Backend
    ┃  ┣ 📜 main.py                    # App entrypoint + CORS + router registration
    ┃  ┣ 📂 api/routes/
    ┃  ┃  ┗ 📜 crypto.py               # REST endpoints: /top, /live, /predict, /global
    ┃  ┣ 📂 core/
    ┃  ┃  ┗ 📜 config.py               # Environment settings (Redis, DB, API keys)
    ┃  ┣ 📂 engine/
    ┃  ┃  ┗ 📜 risk_engine.py          # VaR, position sizing, circuit breakers
    ┃  ┣ 📂 models/
    ┃  ┃  ┣ 📜 adaptive_model.py       # SGD/Incremental learning wrapper
    ┃  ┃  ┣ 📜 feature_store.py        # Redis-backed feature push/pull
    ┃  ┃  ┗ 📜 online_loop.py          # Async background retraining loop
    ┃  ┗ 📂 services/
    ┃     ┣ 📜 crypto_intelligence.py   # Funding rates, open interest, liquidations
    ┃     ┗ 📜 data_ingestion.py        # Data provider connections
    ┗ 📂 frontend_react/               # React + Vite + TailwindCSS Frontend
       ┣ 📜 package.json
       ┣ 📜 vite.config.js
       ┣ 📜 tailwind.config.js
       ┣ 📜 index.html
       ┗ 📂 src/
          ┣ 📜 main.jsx                # React entry point
          ┣ 📜 App.jsx                 # Main dashboard (coin selector, metrics, charts, global analytics)
          ┣ 📜 index.css               # Tailwind directives + dark theme
          ┣ 📂 services/
          ┃  ┗ 📜 api.js               # Axios client for /api/v1/crypto/*
          ┗ 📂 components/
             ┣ 📜 MetricCard.jsx       # Reusable stat card widget
             ┗ 📜 PriceChart.jsx       # Recharts interactive price/indicator chart
```

---

## 🔬 Component Deep-Dive

### Online Learning Loop (`online_loop.py`)
Runs an async background process that fetches mini-batches, checks for drift, and triggers `model.update(X, y)` to dynamically adapt weights to market regime shifts.

### Risk Engine (`risk_engine.py`)
Calculates **VaR** at 95% confidence via historical simulation. Assigns position sizes based on capital and stop-loss distances. Monitors a hard `circuit_breaker` to prevent catastrophic drawdown.

### Feature Store (`feature_store.py`)
Pushes calculated indicators (SMA, EMA, RSI) to **Redis** as JSON. The inference engine reads pre-calculated features directly from memory for near-instantaneous prediction.

### API Routes (`crypto.py`)
| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/crypto/top` | GET | Top 20 coins by market cap |
| `/api/v1/crypto/live/{coin_id}` | GET | Current price, 24h change, market cap |
| `/api/v1/crypto/predict/{coin_id}` | GET | Warmup + predict + retrain inline. Returns signal, confidence, accuracy, chart data |
| `/api/v1/crypto/global` | GET | Cross-coin correlation matrix and volatility |

---

## 🛠 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+ and npm
- Docker & Docker Compose *(optional, for Redis/TimescaleDB)*

### 1. Clone & Install Backend
```bash
cd ai_trading_system
pip install -r requirements.txt
```

### 2. Install Frontend
```bash
cd ai_trading_system/frontend_react
npm install
```

### 3. Start Infrastructure *(optional)*
```bash
cd ai_trading_system
docker-compose up -d
```

---

## 🚀 How to Run

### Option A: One-Click Launch (Windows PowerShell)
```powershell
.\run_platform.ps1
```
This starts both the backend (port 8000) and frontend (port 5173) automatically.

### Option B: Manual (Two Terminals)

**Terminal 1 — Backend:**
```bash
cd ai_trading_system
uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd ai_trading_system/frontend_react
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 🌐 API Documentation

When the backend is running, access the interactive Swagger docs at:
**http://localhost:8000/docs**

---


## 🔮 Future Roadmap

- **Live Exchange Integration** — Binance/Bybit for automated execution
- **Deep Learning Fusion** — LSTM/Transformer for longer time horizons
- **Advanced Drift Detection** — ADWIN algorithms via `river`
- **Portfolio Optimization** — Markowitz Mean-Variance strategies

---

*Disclaimer: This software is for educational and research purposes. Cryptocurrency trading involves significant risk. Use at your own risk.*
