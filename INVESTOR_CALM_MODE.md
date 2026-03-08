# Investor Calm Mode Feature Documentation

## Overview

The **Investor Calm Mode** is a comprehensive behavioral guard system designed to protect investors from emotional and impulsive trading decisions. It monitors trading behavior, analyzes portfolio risk, and provides real-time interventions to promote rational investing.

## Features

### 1. Impulse Alert System
- **Purpose**: Detects rapid, impulsive trading patterns
- **Monitoring**: Tracks trading frequency within configurable time windows
- **Alerts**: Shows warning notifications when rapid trading is detected
- **Threshold**: Default 5-minute cooldown between trades (configurable)

### 2. Volatility Shield Indicator
- **Purpose**: Provides real-time market volatility awareness
- **Display**: Visual meter showing current market conditions (Calm, Normal, Volatile, Extreme)
- **Integration**: Uses portfolio wellness data to calculate volatility
- **Guidance**: Contextual messages based on market conditions

### 3. Dynamic Risk Meter
- **Purpose**: Real-time portfolio risk assessment
- **Visualization**: Gauge display showing risk level (0-100)
- **Metrics**:
  - Overall portfolio risk
  - Volatility level
  - Diversification score
  - Emotional trading indicator
- **Recommendations**: Actionable advice based on risk levels

### 4. Smart Timing Reality Check
- **Purpose**: Behavioral intervention before trading
- **Analysis**:
  - Emotional state detection (Calm, Cautious, Emotional, Panicked)
  - Trading timing analysis (off-hours, weekends)
  - Recent activity monitoring
- **Interventions**: Reality check questions to pause and reflect

## Architecture

### Frontend Components

```
frontend/src/
├── store/
│   └── calmModeStore.ts           # Zustand store for calm mode state
├── hooks/
│   └── useCalmMode.ts             # Main calm mode logic hook
├── components/
│   ├── ImpulseAlertSystem.tsx     # Impulse alerts notification system
│   ├── VolatilityShieldIndicator.tsx  # Market volatility display
│   ├── DynamicRiskMeter.tsx       # Portfolio risk gauge
│   ├── SmartTimingRealityCheck.tsx    # Timing & behavior checks
│   └── CalmModeWidget.tsx         # Orchestrator component
└── pages/
    └── Settings.tsx               # Settings page with calm mode toggle
```

### Backend API

```
backend/
├── models/
│   └── calm_mode.py              # Database models
├── schemas/
│   └── calm_mode.py              # Pydantic schemas
└── api/routes/
    └── calm_mode.py              # API endpoints
```

## API Endpoints

### Settings Management

**GET /api/calm-mode/settings**
- Get user's calm mode settings
- Auto-creates default settings if none exist

**PUT /api/calm-mode/settings**
- Update calm mode settings
- Body: `CalmModeSettingsUpdate`

### Trading Actions

**POST /api/calm-mode/actions**
- Record a trading action
- Body: `TradingActionCreate`
  ```json
  {
    "action_type": "buy|sell|trade",
    "asset_name": "string",
    "amount": 0.0,
    "emotional_score": 0.0  // optional, 0-100
  }
  ```

**GET /api/calm-mode/actions**
- Get recent trading actions
- Query params: `limit` (default: 20), `hours` (default: 24)

### Analysis

**GET /api/calm-mode/analysis**
- Analyze trading behavior for emotional state
- Returns:
  - Recent trade count
  - Emotional state
  - Whether action should be blocked
  - Warning messages

**GET /api/calm-mode/risk-metrics**
- Get current portfolio risk metrics
- Returns comprehensive risk analysis

## Usage

### Enable/Disable Calm Mode

1. Navigate to Settings page
2. Toggle the "Investor Calm Mode" switch
3. Configure thresholds and preferences
4. Click "Save Settings"

### Integration in Pages

#### Dashboard
```tsx
import CalmModeWidget from '../components/CalmModeWidget'

// Compact view - shows volatility shield only
<CalmModeWidget variant="compact" showRiskMeter={false} showTimingCheck={false} />
```

#### Portfolio
```tsx
import { useCalmMode } from '../hooks/useCalmMode'

const { executeTrade } = useCalmMode()

// Wrap trade execution with calm mode checks
const result = await executeTrade(
  {
    type: 'buy',
    asset: 'AAPL',
    amount: 5000,
  },
  async () => {
    // Your actual trade logic
    await api.post('/api/portfolio/', tradeData)
  }
)

if (result.blocked) {
  // Trade was blocked by calm mode
  console.log(result.reason)
}
```

#### Full View
```tsx
// Shows all 4 systems
<CalmModeWidget variant="full" />
```

#### Alerts Only
```tsx
// Just shows floating alerts
<CalmModeWidget variant="alerts-only" />
```

## Configuration Options

### Impulse Threshold
- **Range**: 1-30 minutes
- **Default**: 5 minutes
- **Purpose**: Minimum time between trades before alert

### Volatility Alert Level
- **Range**: 0-100%
- **Default**: 60%
- **Purpose**: Market volatility threshold for warnings

### Risk Tolerance Level
- **Range**: 0-100%
- **Default**: 70%
- **Purpose**: Maximum acceptable portfolio risk

### Show Reality Checks
- **Type**: Boolean
- **Default**: Enabled
- **Purpose**: Display timing warnings and behavioral prompts

## Behavioral Finance Principles

The Calm Mode system is designed around established behavioral finance concepts:

1. **Loss Aversion**: Prevents panic selling during downturns
2. **Recency Bias**: Warns against overreacting to recent market events
3. **Herding Behavior**: Encourages independent analysis
4. **Overconfidence**: Reality checks to promote humility
5. **Anchoring**: Helps avoid fixation on purchase prices

## Data Persistence

Settings are persisted using Zustand's persist middleware:
- **Storage**: Browser localStorage
- **Key**: `calm-mode-storage`
- **Persisted**: Settings only (not alerts or temporary state)

## Future Enhancements

Potential improvements:
- Machine learning for emotional pattern detection
- Integration with market news sentiment
- Custom alert rules and triggers
- Historical analysis and reports
- Social trading comparison metrics
- Coaching and educational content

## Testing

### Frontend Testing
```bash
cd frontend
npm run dev
```

Navigate to:
- `/settings` - Configure calm mode
- `/` - Dashboard with compact view
- `/portfolio` - Portfolio with trade blocking

### Backend Testing
```bash
cd backend
uvicorn main:app --reload
```

Access API docs at: `http://localhost:8000/docs`

Test endpoints:
1. GET `/api/calm-mode/settings` - View settings
2. PUT `/api/calm-mode/settings` - Update settings
3. POST `/api/calm-mode/actions` - Record action
4. GET `/api/calm-mode/analysis` - Get behavioral analysis

## Troubleshooting

### Calm Mode not appearing
- Check that it's enabled in Settings
- Verify `isEnabled` state in store
- Check browser console for errors

### Alerts not showing
- Ensure recent trading activity exists
- Check impulse threshold settings
- Verify alert severity configuration

### Backend connection issues
- Confirm backend is running
- Check CORS configuration
- Verify API endpoint URLs

## Security Considerations

- All settings are user-specific and private
- Trading actions are authenticated
- No sensitive financial data in alerts
- Client-side state management for performance

## Performance

- **Bundle Size**: ~15KB (gzipped)
- **Render Performance**: Optimized with React.memo and useMemo
- **API Calls**: Batched and debounced
- **State Updates**: Throttled to prevent excessive re-renders

## License

Part of Wealth Wellness Hub platform.
