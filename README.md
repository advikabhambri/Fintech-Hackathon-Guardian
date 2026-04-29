# Guardian 

## 📖 ABOUT

### Project Overview
**Guardian** is a comprehensive financial wellness platform designed to empower users to take control of their financial health through intelligent portfolio management, goal tracking, and behavioral insights. The platform combines traditional investment tracking with modern wellness metrics, helping users make informed financial decisions while maintaining emotional balance during market volatility.

### Team
**Finance bros** - A dedicated team committed to making financial wellness accessible and actionable for everyone.

### Project Description
Project Description
Guardian is an intelligent Wealth Wellness Hub that transforms fragmented financial data into a unified, actionable view of an investor’s financial health. Today’s investors manage assets across multiple platforms — from bank accounts and traditional investment portfolios to cryptocurrencies and alternative assets. This fragmentation obscures their true financial position and makes holistic financial decision-making difficult.
Guardian addresses this challenge by creating a secure Wealth Wallet that aggregates traditional, digital, and alternative assets into a single platform. The system automatically calculates net worth, tracks asset allocation, and provides a comprehensive view of portfolio composition in real time.
Beyond aggregation, Guardian integrates financial wellness analytics to assess diversification, liquidity, resilience, risk exposure, and goal alignment. Through interactive dashboards and visual analytics, users can track wealth trends, evaluate portfolio health, and understand how their financial position evolves over time.
To move from insight to action, Guardian includes a Portfolio Intelligence engine that identifies risk concentration and provides explainable recommendations for portfolio rebalancing. A Monte Carlo forecasting module further enables scenario-based retirement planning by estimating success probability and sustainable withdrawal rates.
By combining wealth aggregation, financial health analytics, and predictive intelligence, Guardian empowers investors to make informed, resilient, and long-term wealth decisions.

## 🛠️ Technologies Used

### Frontend Stack
- **Framework**: React 18.2.0 with TypeScript 5.2.2
- **Build Tool**: Vite 7.3.1 (ultra-fast development and building)
- **Styling**: 
  - Tailwind CSS 3.4.1 (utility-first CSS framework)
  - PostCSS 8.4.35 (CSS processing)
  - Autoprefixer 10.4.17 (vendor prefixing)
- **State Management**: Zustand 4.5.0 (lightweight state management)
- **Routing**: React Router DOM 6.22.0
- **Form Handling**: 
  - React Hook Form 7.50.0 (performant forms)
  - Zod 3.22.4 (TypeScript-first schema validation)
  - @hookform/resolvers 3.3.4
- **Data Visualization**: Recharts 2.10.4 (composable charting library)
- **Animations**: Framer Motion 12.35.1 (production-ready animations)
- **Icons**: Lucide React 0.323.0 (beautiful icon library)
- **HTTP Client**: Axios 1.6.5
- **Linting**: ESLint 8.56.0 with TypeScript support

### Backend Stack
- **Framework**: FastAPI (high-performance async Python web framework)
- **Runtime**: Python 3.x with ASGI server (Uvicorn)
- **Database**: PostgreSQL 15-Alpine (robust relational database)
- **ORM**: SQLAlchemy (SQL toolkit and ORM)
- **Authentication**: 
  - JWT tokens via python-jose
  - HS256 algorithm for token signing
  - Configurable token expiration
- **Security**: 
  - Passlib with bcrypt (password hashing)
  - CORS middleware (cross-origin resource sharing)
  - Environment-based secret management
- **Validation**: Pydantic (data validation using Python type hints)
- **API Documentation**: 
  - OpenAPI/Swagger UI (auto-generated interactive docs)
  - ReDoc (alternative API documentation)

### Infrastructure & DevOps
- **Containerization**: 
  - Docker (application containerization)
  - Docker Compose 3.8 (multi-container orchestration)
- **Database Management**: 
  - PostgreSQL with persistent volumes
  - Health checks and automatic restart policies
- **Networking**: Bridge network for container communication
- **Development Tools**:
  - Hot module replacement (Vite HMR)
  - Auto-reload for backend (Uvicorn --reload)
  - Volume mounting for live code updates

### Development Tools & Libraries
- **Code Quality**:
  - TypeScript (static typing)
  - ESLint with React and TypeScript plugins
  - Prettier-compatible formatting
- **Package Management**:
  - npm (frontend dependencies)
  - pip (Python dependencies)
- **Version Control**: Git-friendly with .gitignore configurations
- **Environment Management**: .env files for configuration

### External Service Integrations (Mock)
- **Plaid API**: Traditional banking data synchronization
- **Cryptocurrency APIs**: Multi-exchange crypto portfolio aggregation
- **Financial Data APIs**: Real-time asset pricing and market data

## 🏗️ Architecture

### System Design
The application follows a modern three-tier architecture with clear separation of concerns:

1. **Presentation Layer (Frontend)**: React SPA with TypeScript
2. **Application Layer (Backend)**: FastAPI with RESTful endpoints
3. **Data Layer**: PostgreSQL with SQLAlchemy ORM

### Container Architecture
- **Frontend Container**: Nginx-served React build (port 3000)
- **Backend Container**: Uvicorn ASGI server (port 8000)
- **Database Container**: PostgreSQL 15-Alpine (port 5432)
- **Network**: Isolated Docker bridge network for secure communication

## 📁 Project Structure

```
Guardian/
├── backend/
│   ├── api/
│   │   └── routes/
│   │       ├── auth.py          # Authentication endpoints
│   │       ├── portfolio.py     # Portfolio management
│   │       ├── goals.py         # Financial goals
│   │       ├── insights.py      # Analytics & insights
│   │       └── health.py        # Health checks
│   ├── core/
│   │   ├── config.py           # Application settings
│   │   └── security.py         # JWT & password utilities
│   ├── db/
│   │   └── database.py         # Database connection
│   ├── models/
│   │   ├── user.py            # User model
│   │   ├── portfolio.py       # Portfolio model
│   │   └── goal.py            # Goal model
│   ├── schemas/
│   │   ├── user.py            # User schemas
│   │   ├── portfolio.py       # Portfolio schemas
│   │   └── goal.py            # Goal schemas
│   ├── main.py                # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Backend container
│   └── .env.example          # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx      # Main layout
│   │   │   ├── Navbar.tsx      # Navigation bar
│   │   │   └── Sidebar.tsx     # Sidebar navigation
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx   # Dashboard with insights
│   │   │   ├── Portfolio.tsx   # Portfolio management
│   │   │   ├── Goals.tsx       # Financial goals
│   │   │   ├── Login.tsx       # Login page
│   │   │   └── Register.tsx    # Registration page
│   │   ├── store/
│   │   │   └── authStore.ts    # Authentication state
│   │   ├── lib/
│   │   │   └── api.ts          # API client
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # NPM dependencies
│   ├── vite.config.ts        # Vite configuration
│   ├── tailwind.config.js    # Tailwind configuration
│   ├── Dockerfile            # Frontend container
│   └── .env.example          # Environment variables template
│
└── docker-compose.yml         # Docker Compose configuration
```

## 🚀 Getting Started

### Prerequisites
- Docker Desktop installed
- Docker Compose installed
- Git

### Quick Start

1. **Clone or navigate to the project directory**
   ```bash
   cd "Guardian"
   ```

2. **Set up environment variables**
   
   Backend:
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Frontend:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

3. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Database: localhost:5432

### Manual Setup (Without Docker)

#### Backend Setup

1. **Create virtual environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up PostgreSQL database**
   - Create a database named `wealth_wellness_db`
   - Update DATABASE_URL in `.env`

4. **Run the application**
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

## 🔑 Key Features

### Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing with bcrypt

### Portfolio Management
- Track multiple asset types (stocks, bonds, crypto, real estate, etc.)
- Real-time portfolio valuation
- Profit/loss calculations
- Asset distribution visualization

### Financial Goals
- Set and track financial goals
- Multiple goal types (retirement, emergency fund, house, education, etc.)
- Progress tracking with visual indicators
- Goal completion status

### Insights & Analytics
- Dashboard with comprehensive financial overview
- Portfolio performance metrics
- Asset distribution charts
- Goal progress visualization
- Best/worst performing assets

### 🆕 Asset Synchronization
- Aggregate data from traditional banking (mock Plaid API)
- Sync cryptocurrency portfolios (mock crypto exchanges)
- Unified view of all financial assets
- Real-time balance updates
- Support for multiple accounts and wallets

### 🆕 Financial Wellness Score
- Comprehensive health score (0-100) with letter grades (A+ to F)
- **Diversification analysis** (30%): Asset class distribution, concentration risk, HHI
- **Liquidity metrics** (25%): Emergency fund coverage, liquid asset ratio
- **Behavioral resilience** (25%): Portfolio stability, goal alignment, holding periods
- **Risk management** (20%): Debt ratios, volatility, risk-adjusted returns
- Personalized recommendations for financial improvement
- Detailed breakdown of strengths and weaknesses

### 🆕 Portfolio Intelligence Module
- Consolidated portfolio statement with total portfolio, allocation, monthly change, and net worth
- Asset class intelligence tabs for stocks, bonds, gold, FD, insurance, and crypto
- Holdings analytics per tab: daily/1M/1Y P&L, sector allocation, top gainers and losers
- Risk panel with overexposure detection (sector concentration) and weighted overall risk score
- Recommendation panel with rule-based advisor actions, confidence, expected risk impact, and explainability text
- Historical persistence:
   - Daily snapshots stored in `portfolio_snapshots`
   - Recommendation history stored in `recommendation_insights`
- Background automation:
   - Daily scheduled intelligence recalculation using APScheduler
- UI location:
   - Added on the **Portfolio page** as the **Portfolio Intelligence** section

### 🆕 Forecasting & Retirement Gap
- Connects current net worth to future retirement outcomes
- **Monte Carlo Simulations (1,000 runs):** Estimates probability of reaching target corpus by retirement age
   - Example output: “You have an 82% chance of reaching $2M by age 60”
   - Includes median, downside (P10), and upside (P90) projected corpus
- **Retirement Gap:** Calculates shortfall between projected median corpus and retirement target
- **Safe Withdrawal Rate (SWR) Calculator:** Estimates sustainable spending from current net worth
   - Monthly and annual spending estimates using configurable SWR (default 4%)
- Displayed in the **Portfolio Intelligence** section under a dedicated card titled
   **Forecasting & Retirement Gap**

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Portfolio
- `GET /api/portfolio/` - Get all portfolio items
- `POST /api/portfolio/` - Create portfolio item
- `GET /api/portfolio/{id}` - Get specific item
- `PUT /api/portfolio/{id}` - Update item
- `DELETE /api/portfolio/{id}` - Delete item

### Goals
- `GET /api/goals/` - Get all goals
- `POST /api/goals/` - Create goal
- `GET /api/goals/{id}` - Get specific goal
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal

### 🆕 Asset Sync
- `POST /api/sync/` - Sync traditional & crypto assets
- `POST /api/sync/demo` - Quick sync with demo data
- `GET /api/sync/summary` - Get aggregated asset summary

### 🆕 Wellness Score
- `GET /api/wellness-score/` - Calculate financial health score
- `GET /api/wellness-score/detailed` - Detailed score with sync data
- `GET /api/wellness-score/metrics/diversification` - Diversification only
- `GET /api/wellness-score/metrics/liquidity` - Liquidity metrics only
- `GET /api/wellness-score/recommendations` - Get personalized recommendations

### Insights
- `GET /api/insights/dashboard` - Get dashboard data
- `GET /api/insights/portfolio-summary` - Get portfolio summary

### 🆕 Portfolio Intelligence
- `GET /api/portfolio/consolidated` - Get consolidated statement (and persist daily snapshot)
- `GET /api/portfolio/allocation?period=1M` - Get allocation by asset class
- `GET /api/portfolio/asset-class/{type}/holdings` - Get holdings + P&L + sector breakdown for one asset class
- `GET /api/portfolio/asset/{symbol}/performance?range=1D|1M|1Y` - Get asset performance series
- `GET /api/portfolio/snapshots?days=30` - Get historical daily portfolio snapshots
- `GET /api/risk/score` - Get weighted portfolio risk score and component scores
- `GET /api/risk/exposure/sectors` - Get sector exposure and overexposure flags
- `GET /api/recommendations?risk_profile=moderate` - Generate and persist advisor recommendations
- `GET /api/recommendations/history?limit=20` - Get persisted recommendation history with explainability
- `GET /api/forecast/retirement?simulations=1000&retirement_age=60` - Run Monte Carlo retirement forecast
- `GET /api/forecast/swr?swr_rate=0.04` - Calculate safe withdrawal monthly/annual spending estimate
- `POST /api/sync/market-data` - Queue market data synchronization
- `POST /api/sync/accounts` - Queue account synchronization

> 📘 **For detailed API documentation with examples and request/response schemas, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)**
>
> 🧭 **For a complete explanation of what each feature means on each page, see [PAGE_FEATURES_GUIDE.md](PAGE_FEATURES_GUIDE.md)**

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build

# Stop and remove volumes (caution: deletes data)
docker-compose down -v
```

## 🔒 Security Notes

1. **Change default credentials** in production
2. **Generate a strong SECRET_KEY** for JWT:
   ```python
   import secrets
   print(secrets.token_urlsafe(32))
   ```
3. **Use HTTPS** in production
4. **Update CORS_ORIGINS** to match your domain
5. **Never commit .env files** to version control

## 📝 Database Models

### User
- Email, username, password (hashed)
- Full name, account status
- Relationships with portfolios and goals

### Portfolio
- Asset name, type, quantity
- Purchase and current prices
- Notes and timestamps
- User relationship

### Goal
- Title, type, amounts
- Target date, completion status
- Description and timestamps
- User relationship

## 🎨 UI Components

- Premium design with Tailwind CSS
- Responsive layout for all screen sizes
- Interactive charts and visualizations
- Modern icons from Lucide React
- Smooth transitions and animations

## 🧪 Testing

Visit the API documentation at http://localhost:8000/docs to test all endpoints interactively.

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Built with ❤️ using React, FastAPI, and PostgreSQL
