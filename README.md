# HSoA Agent Dashboard

A responsive internal dashboard for real estate agents to manage their profile data as the **single source of truth** for agent and organizational data.

## Features

- **Relational data model**: Organizations → Offices → Agents, with linked photos, client quotes, sold properties, and metrics
- **Agent profile editing**: Photos (headshot, banner), bio, client quotes, recently sold properties, sales metrics, and office association
- **Responsive layout**: Collapsible sidebar on mobile, fixed sidebar on desktop (breakpoints: `sm` 640px, `md` 768px, `lg` 1024px)
- **Mock data**: Pre-populated agents, offices, and related entities so you can refine the model and UI

## Tech stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** (v4) for layout and styling
- **React Router** for navigation
- In-memory store (context) for the roster; ready to swap for an API

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Use **Dashboard** and **Agents** in the sidebar; click an agent to edit their profile.

## Data model (refinable)

- **Organization** – top-level org (e.g. HSoA Realty)
- **Office** – branch (address, phone, email)
- **Agent** – name, contact, title, bio, license, office
- **AgentPhoto** – headshot, banner, or gallery; caption and sort order
- **ClientQuote** – testimonial with optional client name/initials and sale type
- **SoldProperty** – address, sale price/date, optional image
- **AgentMetrics** – per-year transactions, volume, rank in office/org

Types live in `src/types/model.ts`; mock data in `src/data/mockData.ts`. Update these as you add or change fields and APIs.

## Project structure

```
src/
  components/     Layout (sidebar, cards)
  data/           Mock data
  pages/          Dashboard, Agent list, Agent profile
  store/          AgentRosterContext (single source of truth)
  types/          Relational model types
```

Build: `npm run build`. Preview: `npm run preview`.
