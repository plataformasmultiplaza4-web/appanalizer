# AppAnalizer — Agent Rules

## What This Is
A Next.js analytics dashboard for ecommerce/advertising data, styled to match the MasterMetrics design language. Uses Windsor.ai as the data source.

## Tech Stack
- **Framework:** Next.js 15 (App Router, React 19, TypeScript strict)
- **Styling:** Tailwind CSS v3, inline styles with CSS variables
- **Charts:** Recharts
- **Data:** Windsor.ai API (`WINDSOR_API_KEY` in `.env.local`)
- **AI:** Anthropic Claude via `@anthropic-ai/sdk`

## Commands
- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Production build
- `npm run lint` — ESLint check

## Design System
- Primary teal: `var(--brand)` = `#00BEC8`
- Dark blue for titles: `var(--brand-blue)` = `#1B2559`
- White sidebar with teal active state
- Global topbar with logo + CTA + user actions
- White surface cards with `var(--border)` = `#E5E7EB`

## Project Structure
```
src/
  app/
    (dashboard)/
      layout.tsx          # GlobalTopbar + Sidebar wrapper
      dashboard/page.tsx  # Main dashboard
      overview/page.tsx
      alerts/page.tsx
      chat/page.tsx
      sources/page.tsx
    api/
      ai-summary/route.ts
      chat/route.ts
      windsor/route.ts
  components/
    layout/
      GlobalTopbar.tsx    # Full-width top nav (logo + CTA + user)
      Sidebar.tsx         # Icon-only white sidebar
      Topbar.tsx          # Page-level header (title + tabs + date)
      DashboardShell.tsx
    dashboard/
      KPICard.tsx         # Individual KPI metric card
      KPIGrid.tsx         # Horizontal scrollable KPI strip
      DayBarChart.tsx     # Conversions combo chart (bar + lines)
      CreativesTable.tsx  # Campaign performance table
      AdsPanel.tsx
      AISummary.tsx
  lib/
    utils.ts
    windsor.ts
    mock-data.ts
  types/
    dashboard.ts
    metrics.ts
    windsor.ts
  hooks/
    useMetrics.ts
    useAISummary.ts
    useDashboard.ts
```

## Code Style
- TypeScript strict, no `any`
- Named exports, PascalCase components, camelCase utils
- Inline styles with CSS custom properties — no Tailwind in components
- 2-space indentation

## Important Notes
- Windsor API key required for real data; falls back to mock data automatically
- The `/clone-website` skill can clone external sites into this codebase
- After editing `AGENTS.md`, update platform-specific docs as needed
