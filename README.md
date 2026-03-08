# Guardian

A comprehensive financial wellness platform built with React, FastAPI, and PostgreSQL.

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand
- **Charts**: Recharts
- **Build Tool**: Vite

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy
- **Authentication**: JWT (python-jose)
- **Password Hashing**: Passlib with bcrypt

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL with persistent volumes

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
