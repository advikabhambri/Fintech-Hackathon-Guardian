# Guardian — Page Features Guide

This guide explains what each page does and what each major feature signifies so users and advisers can interpret the UI correctly.

## Global Navigation

The top navigation currently routes to:
- **Dashboard** (`/`)
- **Portfolio** (`/portfolio`)
- **Analytics** (`/analytics`)
- **Goals** (`/goals`)

Authentication pages (`/login`, `/register`) exist in code and are described at the end.

---

## 1) Dashboard (`/`)

Purpose: **Daily command center** for a quick financial health read, risk checks, and next actions.

### Total Portfolio Value (Horizontal hero card)
- Shows your current **total portfolio value** across connected accounts.
- Breaks value into **Traditional**, **Digital**, and **Alternative** buckets.
- Percentage under each bucket signifies its **allocation share** of total net worth.

### Financial Wellness Analyzer (full module)
The analyzer is your primary health score engine:
- **Overall Score + Grade**: one composite wellness score from 0–100.
- **Diversification**: indicates concentration vs spread across asset classes.
- **Liquidity**: indicates ability to access cash quickly (emergency readiness).
- **Behavioral Resilience**: indicates stability of investment behavior and goal alignment.

Why it matters:
- Higher score = stronger financial posture.
- Lower score = more fragility under market stress.

### Top Priority Actions (Action Preview)
- Shows up to **3 highest-priority actions** based on your current metrics.
- Each action includes **category**, **impact level**, and **timeframe**.
- Signifies the fastest path to improve wellness score.
- “View All” sends users to the full action plan in Goals.

### Recent Transactions
- Compact activity feed of latest buy/sell events.
- Signifies short-term behavior and portfolio activity trend.

### Asset Allocation (Pie)
- Pie chart and legend showing share by asset type.
- Signifies current diversification balance at a glance.

### Scenario Analysis (Stress slider)
- Simulates market drawdown impact (via adjustable drop %).
- Shows projected:
  - **Net Worth**
  - **Wellness Score**
- Signifies potential downside sensitivity before real events happen.

### Proactive Insights
- Surfaces urgent alerts (for example, low liquidity) and top recommendations.
- Signifies preventative opportunities before issues worsen.

### Wealth Composition (Health cards)
- Displays major asset sleeves with health labels like **Strong / Healthy / Watch / Risk**.
- Signifies where portfolio quality is robust vs vulnerable.

### Trust & Security Panel
- Highlights security posture claims (encryption/compliance architecture).
- Signifies user trust controls and data protection posture.

---

## 2) Portfolio (`/portfolio`)

Purpose: **Position-level portfolio management** + unified wealth wallet experience.

### Wealth Wallet (Apple Wallet style)
- Card stack for:
  - Traditional Portfolio
  - Digital Assets
  - Alternative Assets
  - Cash & Equivalents
- Tap/click cards to expand holdings.
- Signifies a **unified, account-aggregated wealth view** across asset families.

### Portfolio Summary Cards
- **Total Portfolio Value**: total current position value.
- **Total Items**: number of tracked assets.
- **Total Gain/Loss**: mark-to-market result.

### Portfolio Table
- Position-level details: quantity, purchase price, current price, value, gain/loss.
- Signifies exact source of portfolio performance.

### Add Asset Modal
- Adds a new position with type, quantity, pricing, notes.
- Signifies manual portfolio onboarding/editing workflow.

### Delete Asset Action
- Removes positions from portfolio.
- Signifies direct portfolio hygiene and cleanup controls.

---

## 3) Analytics (`/analytics`)

Purpose: **Deep analysis + trend tracking** over time.

### Header Controls
- **Refresh**: intended data refresh action.
- **Export**: intended analytics export action.
- Signifies operational tools for reporting workflows.

### View Modes

#### A) Composition
- **Wealth Composition Pie**: current portfolio mix by asset family.
- **Asset Type Distribution bars**: category allocation percentages.
- **Financial Health Radar**: compares diversification, liquidity, resilience, risk management, and goal alignment on one radial view.

What it signifies:
- Structural shape of portfolio and health balance at one point in time.

#### B) Trends
- **Net Worth Over Time** (area chart)
- **Health Indicator Trends** (line chart)
- **Asset Allocation Trends** (stacked area)

What it signifies:
- Direction and momentum of wealth + wellness, not just static snapshots.

#### C) Comparison
- **Asset Class Performance** (bar chart)
- **Health Metrics Comparison** (horizontal bars)

What it signifies:
- Relative strengths/weaknesses across asset buckets and health pillars.

### Time Range Selector
- `7d`, `1m`, `3m`, `6m`, `1y`, `all`
- Signifies analysis window sensitivity (short-term noise vs long-term trend).

### Growth Summary Cards
- Total Growth
- Current Net Worth
- Wellness Score
- Asset Classes Count

What it signifies:
- Top-level KPI strip for quick executive summary.

### Embedded Personalized Insights
- Full recommendations module shown below charts.
- Signifies decision support in context of visual analytics.

---

## 4) Goals (`/goals`)

Purpose: **Goal tracking + main personalized action planning hub**.

### Goals Summary
- Total goals, active goals, completed goals.
- Signifies progress throughput and completion status.

### Active Goals Cards
- Show title, type, description, progress %, amount tracking, and target date.
- Actions include:
  - Mark complete
  - Delete goal
- Signifies execution progress toward specific objectives.

### Completed Goals
- Archived success cards for finished goals.
- Signifies achieved milestones and momentum.

### Add Goal Modal
- Create new goals with type, amount, current progress, date, description.
- Signifies forward planning and objective creation.

### Personalized Insights & Action Plan (Main)
This is the primary strategic module for recommendations:

#### Client vs Adviser View Toggle
- **Client View**: user-centric actions to improve personal financial wellness.
- **Adviser View**: portfolio-management and relationship actions for advisers.

#### Category Tabs
- **Immediate Actions**
- **Short-Term (1–3 months)**
- **Long-Term Strategy**
- **What-If Scenarios**

Significance:
- Converts data into prioritized, time-phased plans.

#### Action Cards
Each action includes:
- Impact level (high/medium/low)
- Effort level (easy/moderate/complex)
- Category
- Timeframe
- Expected outcome
- Step-by-step implementation checklist

Significance:
- Bridges analytics to concrete execution.

#### Scenario Planning
Includes modeled scenarios such as:
- Market Downturn
- Aggressive Growth
- Retirement Transition
- High Inflation
- Windfall

Each scenario shows:
- Projected net worth
- Wellness score impact
- Risk profile
- Recommended responses

Significance:
- Preparedness planning for uncertainty and life events.

---

## 5) Authentication Pages (Implemented in code)

> Note: `Login` and `Register` pages are implemented but are not in the current main route tree in `App.tsx`.

### Login (`/login`)
- Email/password sign-in, loading state, and error feedback.
- Signifies secure session access workflow.

### Register (`/register`)
- Account creation with validation (including password confirmation).
- Signifies first-time onboarding workflow.

---

## Metric Interpretation Quick Guide

### Diversification
- Higher score means portfolio is less concentrated and generally more resilient.
- Concentration risk >30% typically indicates overexposure.

### Liquidity
- Emergency fund coverage near/above 6 months is generally healthier.
- Low liquidity ratio can reduce flexibility during stress periods.

### Behavioral Resilience
- Higher goal alignment and lower panic indicators suggest stronger decision discipline.
- Lower resilience can weaken long-term outcomes despite good asset selection.

### Overall Wellness Score
- Composite health indicator across core pillars.
- Use together with action plan, not as a standalone number.

---

## Data Note

Several visualizations and transaction examples in the current frontend are demo-oriented (mock/fallback) when backend data is unavailable. Feature behavior still reflects intended product meaning and workflow.