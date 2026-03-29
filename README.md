# NGX Intel

**Nigerian Stock Market Intelligence Platform**

NGX Intel is a comprehensive platform for understanding and tracking the Nigerian Exchange (NGX). It combines live market data, AI-powered analysis, and educational content — built for everyone from first-time investors to active retail traders.

## Features

- **Market Dashboard** — Real-time ASI, sector heatmap, top movers, upcoming dividends
- **Stock Screener** — Filter and sort 150+ NGX-listed companies by sector, price, P/E, yield
- **Stock Detail Pages** — Price charts, 52-week range, dividend history, key stats
- **Dividend Tracker** — All dividends, calendar view, and dividend champions ranking
- **Sector Analysis** — Deep dive into all 11 NGX sectors with drivers and risks
- **Knowledge Hub** — 40+ glossary terms explaining stock market concepts in plain English with Nigerian examples
- **Year-by-Year History** — Visual narrative of NGX performance from 2010 to present
- **AI Chat** — Claude-powered assistant focused exclusively on Nigerian stocks (BYOK)
- **Personal Watchlist** — Track favourite stocks with notes, persisted to localStorage
- **Analysis Articles** — Long-form editorial analysis in MDX

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, RSC) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth | NextAuth v5 (Google OAuth) |
| Data | EODHD API (free tier) + seed JSON |
| Charts | Recharts |
| State | Zustand (chat, watchlist) |
| Client Data | TanStack Query v5 |
| Content | MDX (next-mdx-remote + gray-matter) |
| AI | Anthropic Claude API (client-side, BYOK) |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- Google OAuth credentials (from Google Cloud Console)
- EODHD API key (free at [eodhistoricaldata.com](https://eodhistoricaldata.com))

### Setup

```bash
# Clone and install
cd ngx-intel
npm install

# Configure environment
cp .env.local.example .env.local
# Fill in AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, EODHD_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
AUTH_SECRET=<openssl rand -base64 32>
AUTH_GOOGLE_ID=<Google OAuth Client ID>
AUTH_GOOGLE_SECRET=<Google OAuth Client Secret>
EODHD_API_KEY=<your EODHD API token>
```

## Project Structure

```
ngx-intel/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing page (public)
│   ├── api/                # Route handlers (BFF)
│   └── dashboard/          # Protected dashboard pages
│       ├── stocks/         # Screener + [ticker] detail
│       ├── dividends/      # Dividend tracker
│       ├── sectors/        # Sector overview + [sector] deep dive
│       ├── learn/          # Knowledge hub + [slug] terms
│       ├── history/        # Year-by-year NGX history
│       ├── analysis/       # Articles + [slug] detail
│       ├── chat/           # AI assistant
│       └── watchlist/      # Personal watchlist
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Sidebar, TopBar, MobileNav
│   ├── landing/            # Landing page sections
│   ├── market/             # MarketStatusBadge, ASIChart, SectorHeatmap, MoverCard
│   ├── stocks/             # StockCard, StockTable, PriceChart, DividendTable
│   ├── chat/               # ChatWindow, ChatMessage, ChatInput, ApiKeySetup
│   ├── learn/              # GlossaryCard, FormulaDisplay, NigerianExample
│   └── mdx/                # Callout, StockPrice, DividendHistory
├── content/                # MDX content
│   ├── glossary/           # 40+ stock market terms
│   ├── sectors/            # 11 sector profiles
│   └── analysis/           # Editorial articles
├── hooks/                  # TanStack Query hooks
├── lib/                    # Utilities, data sources, AI
├── stores/                 # Zustand stores
├── types/                  # TypeScript interfaces
└── data/                   # Seed JSON (151 NGX stocks)
```

## Data Architecture

NGX Intel uses a layered data strategy:

1. **EODHD API** (primary) — Historical prices, dividends, stock list. Free tier with daily OHLCV data for all NGX stocks.
2. **Seed JSON** (fallback) — Curated snapshot of 151 NGX stocks with sectors, boards, and recent prices. Acts as the stable baseline.
3. **NGX Official API** (future) — Upgrade path for real-time, authoritative data ($1K+/yr).

All data access is abstracted behind the `NGXDataSource` interface — swap sources by changing one environment variable.

## AI Chat

The AI chat uses the Anthropic Claude API with direct browser-to-API calls. Users provide their own API key (BYOK), which is:

- Stored in React state only (never persisted)
- Never sent to the NGX Intel server
- Cleared when the tab is closed

A hardcoded master system prompt constrains the AI to Nigerian stock market topics only.

## License

Private — All rights reserved.
