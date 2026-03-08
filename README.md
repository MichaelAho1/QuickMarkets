# QuickMarkets

**A full-stack stock market simulator that teaches investing through accelerated, realistic trading.**

Users register an account, receive a starting cash balance, and trade stocks in a simulated market where each simulated day lasts just 5 real-world minutes. Stock prices evolve using **Geometric Brownian Motion (GBM)** — the same mathematical model used in the Black-Scholes options pricing formula — with sector-level correlations, drift, volatility, and mean-reversion all factored in.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 6, React Router v7, Chart.js, Axios |
| Backend | Django 5.2, Django REST Framework, Python 3 |
| Auth | JWT (djangorestframework-simplejwt) |
| Database | PostgreSQL (production) · SQLite (development) |
| Deployment | Docker, Docker Compose, Nginx, Gunicorn |
| SSL | Let's Encrypt |

---

## Features

- **Accelerated trading** — 1 simulated day = 5 real minutes, so users can experience months of market activity in a short session.
- **Realistic price generation** — GBM drives every stock. Each tick factors in market-wide movement, sector influence, individual volatility, and long-term drift.
- **Portfolio management** — Buy and sell shares, track average cost basis, view unrealised gains/losses, and see a full transaction history.
- **Watchlist** — Monitor up to 5 stocks with a single click.
- **Leaderboard** — Top 3 users ranked by total net worth (cash + holdings).
- **Interactive charts** — Price history (1 w / 1 m / 3 m / 6 m / 1 y / all) and portfolio-value-over-time charts powered by Chart.js.
- **Sector-level ETFs** — TECH, FIN, HEALTH, ENRG, and CONS ETFs aggregate individual stocks and drive correlated moves across their sectors.
- **Separate timer service** — A dedicated Docker container (deployable to its own EC2 instance) runs the end-of-day and intra-day price generation on a fixed schedule, completely decoupled from the API server.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (React)                      │
│  Landing · Login · Signup · Dashboard · Explore · Portfolio │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST / JSON  (JWT auth)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               Django REST Framework  (Gunicorn)             │
│  Authentication · Portfolio · Trades · Charts · Leaderboard │
└──────────┬──────────────────────────────┬───────────────────┘
           │                              │
           ▼                              ▼
┌──────────────────┐          ┌───────────────────────────────┐
│  PostgreSQL DB   │          │   Timer Service (Docker)      │
│  Users · Stocks  │◄─────────│  GBM end-of-day + intra-day  │
│  Transactions    │          │  Runs independently on EC2    │
│  History         │          └───────────────────────────────┘
└──────────────────┘
```

### Price Generation Hierarchy

```
Market Index ("ALL")  ──75%──►  ETF / Sector  ──75%──►  Individual Stock
                                                ──25%──►  (random component)
                                                          + mean reversion
```

---

## Project Structure

```
QuickMarkets/
├── client/                          # React + Vite frontend
│   └── src/
│       ├── pages/
│       │   ├── PublicPages/         # Landing, Login, Signup
│       │   └── PrivatePages/        # Dashboard, Portfolio, ExploreStocks, Settings
│       ├── components/              # Reusable UI components
│       ├── contexts/                # StockContext (global state)
│       ├── api/                     # Axios configuration & API calls
│       └── services/                # Business logic helpers
│
├── server/                          # Django backend
│   ├── api/                         # REST endpoints, serializers, validators
│   └── simulator/
│       ├── models.py                # All database models
│       ├── timer_service.py         # Simulation timer singleton
│       └── stockGeneration/         # GBM price generation algorithms
│           ├── startOfDayGenerator.py
│           ├── duringDayGenerator.py
│           └── endOfDayGenerator.py
│
├── docker-compose.simple.yml        # Full-stack deployment (frontend + backend)
├── docker-compose.timer.yml         # Timer service deployment
├── timer-start.sh                   # Start timer service
└── timer-control.sh                 # Manage timer (start/stop/status/logs)
```

---

## Local Development Setup

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- (Optional) Docker & Docker Compose

### Frontend

```bash
cd client
npm install
```

Create `client/.env`:
```
VITE_API_URL="http://127.0.0.1:8000"
```

```bash
npm run dev        # http://localhost:5173
npm run build      # production build
npm run lint       # ESLint
```

### Backend

```bash
cd server
python -m venv env
source env/bin/activate          # Linux / macOS
# ./env/Scripts/activate         # Windows PowerShell

pip install -r requirements.txt
```

Create `server/.env` (minimum for development):
```
SECRET_KEY=replace-with-a-real-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

```bash
python manage.py migrate
python manage.py init_simulation   # seed stocks & ETFs
python manage.py runserver         # http://localhost:8000
```

---

## Docker Deployment

### Full Stack (frontend + backend)

```bash
docker-compose -f docker-compose.simple.yml up -d
```

Frontend is served by Nginx on ports 80/443; the API runs on port 8000 via Gunicorn.

### Timer Service (optional — separate EC2 instance)

```bash
./timer-start.sh              # build & start
./timer-control.sh start      # start simulation
./timer-control.sh stop       # stop simulation
./timer-control.sh status     # check timer state
./timer-control.sh logs       # tail logs
```

---

## API Reference

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/user/register/` | POST | — | Register a new user |
| `/api/token/` | POST | — | Obtain JWT access + refresh tokens |
| `/api/token/refresh/` | POST | — | Refresh access token |
| `/api/current-user/` | GET | JWT | Authenticated user info |
| `/api/view-stock-prices/` | GET | — | All stocks with current prices |
| `/api/view-simulator-user/` | GET | JWT | Portfolio holdings & cash balance |
| `/api/view-price-history/` | GET | — | Historical OHLC for a ticker |
| `/api/buy-stock/` | POST | JWT | Buy shares |
| `/api/sell-stock/` | POST | JWT | Sell shares |
| `/api/transaction-history/` | GET | JWT | Last 5 transactions |
| `/api/leaderboard/` | GET | — | Top 3 users by net worth |
| `/api/watchlist/` | GET/POST/DELETE | JWT | Manage watchlist |
| `/api/stock-chart-data/` | GET | — | Price history for charting |
| `/api/stock-returns/` | GET | — | Period returns (1 w, 1 m, etc.) |
| `/api/portfolio-chart-data/` | GET | JWT | Portfolio value over time |
| `/api/timer/` | GET/POST/DELETE | — | Start / stop / query timer |
| `/api/simulation-time/` | GET | — | Current day & seconds to next day |

Rate limits: 50 req/hour (anonymous) · 500 req/hour (authenticated)

---

## Database Models

| Model | Key Fields |
|---|---|
| `User` | `username` (PK), `cashBalance` |
| `Stock` | `ticker` (PK), `stockName`, `currPrice`, `prevPrice`, `sectorType` (FK→ETF), `volatility`, `avgReturn` |
| `ETF` | `ticker` (PK), `name`, `price`, `volatility`, `avgReturn` |
| `UserStock` | `user`, `stock`, `sharesAmount`, `averageCost` |
| `StockPriceHistory` | `stockTicker`, `day`, `openingPrice`, `closingPrice`, `dayChange` |
| `Transaction` | `user`, `stockTicker`, `shares`, `transactionType` (BUY/SELL), `priceAtTransaction`, `timestamp` |
| `PortfolioHistory` | `user`, `day`, `portfolioValue`, `cashBalance`, `stockValue` |
| `Watchlist` | `user`, `ticker` |
| `SimulationTimer` | `is_running`, `current_day`, `start_time`, `time_until_next_day` |

---

## Testing

Unit tests cover the GBM price-generation algorithms:

```bash
cd server
python manage.py test
```

Tests are located in `server/simulator/stockGeneration/`.

---

## Security

- JWT authentication with token refresh rotation
- Input validation and sanitisation on all endpoints (regex + type checks)
- SQL injection prevention via Django ORM
- API rate limiting (DRF throttling)
- CORS configured via `django-cors-headers`
- Atomic database transactions for buy/sell operations
- Secrets managed via environment variables — never committed to source control
- Docker containers run with read-only filesystems and dropped Linux capabilities
