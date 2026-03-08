# API Endpoints Documentation

## New Features: Asset Sync & Wellness Score

### Overview
Guardian now includes advanced features for aggregating financial data and calculating comprehensive financial health scores.

---

## 🔄 Asset Synchronization API

### POST `/api/sync`

Aggregates financial data from multiple sources including traditional banking (mock Plaid API) and digital assets (mock crypto exchanges).

#### Request Body

```json
{
  "user_id": 1,
  "sync_traditional": true,
  "sync_crypto": true,
  "plaid_access_token": "access-sandbox-12345678-1234-1234-1234-123456789012",
  "crypto_api_key": "crypto-api-demo-key-12345"
}
```

**Fields:**
- `sync_traditional` (boolean): Enable traditional banking/investment sync
- `sync_crypto` (boolean): Enable cryptocurrency sync
- `plaid_access_token` (string, optional): Mock Plaid API token. Default provided for testing.
- `crypto_api_key` (string, optional): Mock crypto exchange API key. Default provided for testing.

#### Response

```json
{
  "success": true,
  "message": "Data synchronized successfully",
  "synced_data": {
    "traditional_accounts": [
      {
        "account_id": "acc_checking_001",
        "account_name": "Primary Checking",
        "account_type": "checking",
        "balance": 5420.50,
        "available": 5200.00,
        "currency": "USD",
        "institution_name": "Chase Bank"
      }
    ],
    "traditional_assets": [
      {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "quantity": 25.5,
        "price": 175.20,
        "value": 4467.60,
        "cost_basis": 4200.00,
        "account_id": "acc_investment_100"
      }
    ],
    "crypto_assets": [
      {
        "symbol": "BTC",
        "name": "Bitcoin",
        "quantity": 0.5,
        "price_usd": 45000.00,
        "value_usd": 22500.00,
        "cost_basis": 20000.00,
        "wallet_address": "0x1234...5678",
        "network": "bitcoin"
      }
    ],
    "total_traditional_value": 125340.50,
    "total_crypto_value": 45230.00,
    "total_net_worth": 170570.50,
    "sync_timestamp": "2026-03-08T10:30:00",
    "source_type": "traditional"
  },
  "accounts_synced": 5,
  "assets_synced": 12,
  "errors": []
}
```

#### HTTP Status Codes
- `200 OK`: Sync completed successfully
- `401 Unauthorized`: Invalid or missing authentication token
- `500 Internal Server Error`: Server error during sync

---

### POST `/api/sync/demo`

Quick sync with demo data using default mock credentials. Perfect for testing.

#### Response
Same as `/api/sync` but uses pre-configured demo credentials.

---

### GET `/api/sync/summary`

Returns aggregated summary of all synced assets.

#### Response

```json
{
  "traditional_total": 125340.50,
  "crypto_total": 45230.00,
  "total_net_worth": 170570.50,
  "accounts_count": 5,
  "assets_count": 12,
  "last_sync": "2026-03-08T10:30:00"
}
```

---

## 🏥 Financial Wellness Score API

### GET `/api/wellness-score`

Calculates a comprehensive Financial Health Score (0-100) based on multiple metrics.

#### Scoring Components

**1. Diversification (30% weight)**
- Number of asset classes
- Distribution across asset types
- Concentration risk (Herfindahl-Hirschman Index)
- Optimal: 7+ different asset classes with balanced distribution

**2. Liquidity (25% weight)**
- Emergency fund coverage (months of expenses)
- Liquid vs illiquid asset ratio
- Quick access to capital
- Optimal: 6 months emergency fund + 10-20% liquid assets

**3. Behavioral Resilience (25% weight)**
- Portfolio stability and volatility
- Average holding periods
- Goal alignment
- Emotional trading indicators
- Optimal: Long-term holdings aligned with goals

**4. Risk Management (20% weight)**
- Debt-to-asset ratio
- Portfolio volatility
- Risk-adjusted returns
- Optimal: Low debt, balanced risk exposure

#### Response

```json
{
  "success": true,
  "financial_health": {
    "overall_score": 82.5,
    "grade": "B+",
    "diversification": {
      "asset_class_count": 6,
      "asset_type_distribution": {
        "stocks": 45.2,
        "bonds": 15.0,
        "crypto": 10.5,
        "real_estate": 20.0,
        "cash": 9.3
      },
      "concentration_risk": 45.2,
      "herfindahl_index": 0.2854,
      "diversification_score": 78.5
    },
    "liquidity": {
      "liquid_assets": 15000.00,
      "semi_liquid_assets": 85000.00,
      "illiquid_assets": 50000.00,
      "liquidity_ratio": 0.10,
      "emergency_fund_coverage": 6.5,
      "liquidity_score": 92.0
    },
    "behavioral_resilience": {
      "portfolio_volatility": 12.5,
      "average_holding_period": 245.0,
      "rebalancing_frequency": 3,
      "panic_sell_indicators": 0,
      "goal_alignment_score": 85.0,
      "resilience_score": 88.5
    },
    "risk_metrics": {
      "overall_risk_level": "moderate",
      "volatility_score": 50.0,
      "debt_to_asset_ratio": 0.15,
      "risk_adjusted_return": 1.5
    },
    "recommendations": [
      "Consider increasing crypto allocation moderately for better diversification",
      "Excellent emergency fund coverage - maintain this level"
    ],
    "strengths": [
      "Well-diversified portfolio across multiple asset classes",
      "Strong liquidity position with adequate emergency fund",
      "Disciplined investment approach with strong goal alignment"
    ],
    "weaknesses": [
      "Slight concentration in stocks - consider rebalancing"
    ],
    "calculated_at": "2026-03-08T10:35:00"
  },
  "message": "Financial Health Score: 82.5/100 (Grade: B+)",
  "data_quality": {
    "has_portfolio": true,
    "has_goals": true,
    "has_traditional_sync": false,
    "has_crypto_sync": false
  }
}
```

#### Grade Scale
- **A+ (97-100)**: Excellent financial health
- **A (93-96)**: Very strong financial position
- **A- (90-92)**: Strong financial health
- **B+ (87-89)**: Good financial health
- **B (83-86)**: Above average
- **B- (80-82)**: Solid foundation
- **C+ (77-79)**: Average with room for improvement
- **C (73-76)**: Needs attention
- **C- (70-72)**: Concerning areas
- **D (60-69)**: Significant improvements needed
- **F (<60)**: Critical financial health issues

---

### GET `/api/wellness-score/detailed`

Returns detailed wellness score with optional synced data integration.

#### Query Parameters
- `include_sync_data` (boolean): Include synced traditional & crypto data in calculation

#### Response
Enhanced version of standard wellness score with more detailed breakdowns.

---

### GET `/api/wellness-score/metrics/diversification`

Returns only diversification metrics.

#### Response

```json
{
  "asset_class_count": 6,
  "asset_type_distribution": {
    "stocks": 45.2,
    "bonds": 15.0,
    "crypto": 10.5,
    "real_estate": 20.0,
    "cash": 9.3
  },
  "concentration_risk": 45.2,
  "herfindahl_index": 0.2854,
  "diversification_score": 78.5
}
```

---

### GET `/api/wellness-score/metrics/liquidity`

Returns only liquidity metrics.

#### Response

```json
{
  "liquid_assets": 15000.00,
  "semi_liquid_assets": 85000.00,
  "illiquid_assets": 50000.00,
  "liquidity_ratio": 0.10,
  "emergency_fund_coverage": 6.5,
  "liquidity_score": 92.0
}
```

---

### GET `/api/wellness-score/recommendations`

Returns only personalized recommendations.

#### Response

```json
{
  "recommendations": [
    "Increase diversification by adding more asset classes (currently 4)",
    "Build emergency fund to cover at least 6 months of expenses (currently 3.2 months)"
  ],
  "strengths": [
    "Strong liquidity position with adequate emergency fund",
    "Low debt burden with healthy debt-to-asset ratio"
  ],
  "weaknesses": [
    "Portfolio lacks diversification",
    "High concentration risk in single asset class"
  ]
}
```

---

## 🔐 Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🧪 Testing with Mock Services

### Mock Plaid API
The system includes a mock Plaid service that simulates:
- Bank accounts (checking, savings, credit cards)
- Investment accounts
- Stock holdings
- Real-time balances

**Default Mock Token**: `access-sandbox-12345678-1234-1234-1234-123456789012`

### Mock Crypto API
The system includes a mock cryptocurrency service that simulates:
- Crypto portfolio holdings
- Current market prices
- Wallet addresses
- Multiple blockchain networks

**Default Mock API Key**: `crypto-api-demo-key-12345`

---

## 📊 Example Workflow

1. **Sync Assets**
   ```bash
   curl -X POST "http://localhost:8000/api/sync" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "sync_traditional": true,
       "sync_crypto": true
     }'
   ```

2. **Calculate Wellness Score**
   ```bash
   curl -X GET "http://localhost:8000/api/wellness-score" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. **Get Specific Metrics**
   ```bash
   curl -X GET "http://localhost:8000/api/wellness-score/metrics/diversification" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

4. **Get Recommendations**
   ```bash
   curl -X GET "http://localhost:8000/api/wellness-score/recommendations" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

## 🔍 Data Models

### TraditionalAccount
- `account_id`: Unique identifier
- `account_name`: Display name
- `account_type`: checking | savings | investment | credit_card
- `balance`: Current balance
- `institution_name`: Bank/broker name

### CryptoAsset
- `symbol`: Crypto ticker (BTC, ETH, etc.)
- `quantity`: Amount held
- `price_usd`: Current USD price
- `value_usd`: Total value
- `wallet_address`: Blockchain address
- `network`: Blockchain network

### FinancialHealthScore
- `overall_score`: 0-100 composite score
- `grade`: Letter grade (A+ to F)
- `diversification`: Diversification metrics object
- `liquidity`: Liquidity metrics object
- `behavioral_resilience`: Behavioral metrics object
- `risk_metrics`: Risk metrics object
- `recommendations`: Array of suggestions
- `strengths`: Array of positive factors
- `weaknesses`: Array of areas to improve

---

## 🎯 Best Practices

1. **Regular Syncing**: Sync data daily for accurate wellness scores
2. **Set Financial Goals**: Goals improve behavioral resilience scoring
3. **Diversify**: Aim for 7+ asset classes for optimal diversification
4. **Emergency Fund**: Maintain 6 months of liquid expenses
5. **Long-term Holding**: Longer holding periods improve resilience scores
6. **Monitor Debt**: Keep debt-to-asset ratio below 30%

---

## 🚀 Interactive API Documentation

Visit **http://localhost:8000/docs** for interactive Swagger UI documentation where you can test all endpoints directly.

---

## 📞 Support

For questions or issues with the new endpoints, refer to the main README or API documentation at `/docs`.
