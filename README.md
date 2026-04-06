<div align="center">

# ⚡ NexusQuant AI

### Institutional-Grade, AI-Powered Trading Terminal & Execution Engine

[![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Tauri](https://img.shields.io/badge/Tauri-FFC131?style=for-the-badge&logo=tauri&logoColor=black)](https://tauri.app/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Seed Stage](https://img.shields.io/badge/Stage-Seed-blueviolet?style=flat-square)]()

> **Founders:** [Anas Lahraoui](https://github.com/anabkl) & Othman Karam  
> *"We don't just trade the market — we engineer the edge."*

</div>

---

## 🎯 Vision

NexusQuant AI is building the **Bloomberg Terminal for the AI era** — an ultra-low latency, institutional-grade desktop trading application powered by a Rust execution core and a deep learning signal engine. Designed for professional traders, quantitative hedge funds, and proprietary trading desks who demand sub-millisecond execution, real-time multi-asset analytics, and autonomous AI-driven strategy deployment.

Our MVP is targeted for showcase at **major technology and FinTech events** in 2025.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     NexusQuant AI — Monorepo                    │
│                                                                 │
│  ┌──────────────────────────────┐                               │
│  │   /frontend  (Desktop App)   │                               │
│  │   React + TypeScript +       │◄──── Tauri IPC Bridge ────┐  │
│  │   TailwindCSS + lightweight- │                            │  │
│  │   charts (Bloomberg-style    │                            │  │
│  │   dark-mode terminal UI)     │                            │  │
│  └──────────────────────────────┘                            │  │
│                                                               │  │
│  ┌──────────────────────────────┐                            │  │
│  │   /core-rust (Execution      │◄───────────────────────────┘  │
│  │   Engine + Tauri Backend)    │                               │
│  │   Rust · Async WebSocket     │                               │
│  │   Live Tick Streams · Order  │◄─── REST/WS ───┐             │
│  │   Routing · Risk Engine      │                │             │
│  └──────────────────────────────┘                │             │
│                                                  │             │
│  ┌──────────────────────────────┐                │             │
│  │   /ai-engine  (ML Brain)     │────────────────┘             │
│  │   Python · FastAPI           │                               │
│  │   LSTM / Transformer Models  │◄──── PostgreSQL ────┐        │
│  │   Signal Generation          │                     │        │
│  └──────────────────────────────┘                     │        │
│                                                       │        │
│  ┌──────────────────────────────────────────────────┐ │        │
│  │   docker-compose.yml  (Local Dev Orchestration)  │─┘        │
│  │   PostgreSQL (backtesting data) + AI Engine      │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Desktop Shell** | [Tauri 2.x](https://tauri.app/) | Native OS wrapper, IPC bridge, system tray |
| **Frontend UI** | React 18 + TypeScript | Component-driven Bloomberg-style dashboard |
| **Styling** | TailwindCSS + CSS Variables | Dark-mode, pixel-perfect terminal aesthetics |
| **Charting** | [lightweight-charts](https://tradingview.github.io/lightweight-charts/) | GPU-accelerated OHLCV candlestick rendering |
| **Execution Core** | Rust (async/await + Tokio) | Sub-millisecond order routing, tick ingestion |
| **WebSocket Engine** | Rust + tokio-tungstenite | Live market data streams, bypass HTTP overhead |
| **AI / ML** | Python 3.11 + FastAPI | LSTM/Transformer signal generation API |
| **Database** | PostgreSQL 15 | Backtesting data warehouse, trade history |
| **Orchestration** | Docker Compose | Local dev environment management |

---

## 📁 Monorepo Structure

```
nexusquant-ai/
├── README.md
├── docker-compose.yml
├── .gitignore
│
├── frontend/                   # Desktop Terminal (Tauri + React + TS)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── components/
│   │       ├── Dashboard.tsx
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── CandlestickChart.tsx
│   └── src-tauri/              # Tauri Rust backend
│       ├── Cargo.toml
│       ├── tauri.conf.json
│       ├── build.rs
│       └── src/
│           └── main.rs         # Async WS commands + Tauri IPC
│
├── core-rust/                  # Core Execution Engine
│   ├── Cargo.toml
│   └── src/
│       ├── main.rs
│       └── lib.rs
│
└── ai-engine/                  # AI/ML Signal Engine
    ├── requirements.txt
    └── main.py                 # FastAPI application
```

---

## ⚡ Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Rust](https://rustup.rs/) >= 1.75 (stable)
- [Python](https://www.python.org/) >= 3.11
- [Docker & Docker Compose](https://www.docker.com/)

### 1. Start Infrastructure

```bash
# Spin up PostgreSQL + AI Engine
docker-compose up -d
```

### 2. Run the AI Engine (standalone)

```bash
cd ai-engine
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Launch the Desktop Terminal

```bash
cd frontend
npm install
npm run tauri dev
```

---

## 🧠 AI Engine Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1/signals/{symbol}` | Get AI trading signals for a symbol |
| `POST` | `/api/v1/predict` | Run model inference on OHLCV data |

---

## 🔒 Architecture Principles

- **Zero-copy data paths** — Rust's ownership model eliminates heap allocations in the hot path
- **Actor model concurrency** — Tokio async runtime handles thousands of simultaneous instrument streams
- **Model isolation** — AI engine is a separate process, failures never impact order execution
- **Offline-first** — Core terminal functions without cloud connectivity

---

## 📈 Roadmap

- [x] Monorepo foundation & architecture
- [x] Tauri desktop shell with React UI scaffold
- [x] Bloomberg-style dark-mode dashboard
- [x] Rust async WebSocket tick engine
- [x] FastAPI AI engine placeholder
- [ ] Live order book visualization (L2/L3)
- [ ] LSTM signal model — first alpha
- [ ] Backtesting engine with PostgreSQL warehouse
- [ ] Paper trading mode
- [ ] Multi-asset portfolio dashboard (FX, Crypto, Equities)
- [ ] Live brokerage integrations (Interactive Brokers, Alpaca)

---

## 👥 Founders

| | |
|---|---|
| **Anas Lahraoui** | Co-Founder & CTO — Systems architecture, Rust execution core |
| **Othman Karam** | Co-Founder & CEO — Product strategy, institutional relationships |

---

## 📄 License

MIT © 2025 NexusQuant AI — Anas Lahraoui & Othman Karam
