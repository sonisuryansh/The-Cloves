# Production Project Control & Monitoring Platform via AI (The Cloves)

An AI-powered SaaS platform for monitoring production and project activities, tracking progress in real time, detecting anomalies and potential bottlenecks, and driving faster, evidence-backed decision making.

---

## Overview

The **Production Project Control & Monitoring Platform via AI (The Cloves)** provides a centralized, modern interface combining three core capabilities:

1. **Project Management & Tracking** – Full task lifecycle, milestone tracking, and an interactive Kanban board.
2. **Production Control & Monitoring** – Isolated shopfloor operations module tracking equipment sensor telemetry (temperature, vibration, uptime, efficiency) and multi-stage batch production orders.
3. **AI Intelligence & Risk Analysis** – Real-time anomaly detection, deterministic telemetry evidence, predictive delay modeling, and actionable recommendations.

---

## System Architecture

```text
Core/
├── Frontend/               # The Cloves Web Client (React + TypeScript + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── app/            # Application router & route definitions
│   │   ├── components/     # Reusable design system, layouts, dialogs, drawers
│   │   ├── features/       # Modular features:
│   │   │   ├── dashboard/  # Central overview, KPI summary, active tasks, project health
│   │   │   ├── tasks/      # Deliverables list, filters, task details drawer
│   │   │   ├── kanban/     # dnd-kit drag-and-drop workflow board
│   │   │   ├── projects/   # Program portfolio & project detail breakdown
│   │   │   ├── production/ # Equipment telemetry, sensor thresholds, batch orders
│   │   │   ├── ai-insights/# Deterministic evidence vs. predicted risk trajectories
│   │   │   ├── calendar/   # Month, Week, and Gantt timeline with dependencies
│   │   │   ├── reports/    # Recharts deliverable burnup & workload distribution
│   │   │   ├── team/       # Team directory & workspace permissions matrix
│   │   │   └── settings/   # Profile, workspace, API config & security audit
│   │   ├── lib/            # Utilities & date formatting
│   │   ├── mocks/          # Centralized typed mock datasets
│   │   ├── services/       # Typed service contracts & centralized API client
│   │   ├── stores/         # Reactive Zustand state store
│   │   ├── test/           # Vitest automated unit & integration test suites
│   │   └── types/          # Domain TypeScript type definitions
│   └── package.json
└── README.md
```

---

## Key Features

- 📊 **Centralized Overview Dashboard** – 5 live KPIs, project progress calculated dynamically from tasks, smart due-date alerts, and an activity audit trail.
- 📋 **Project & Task Management** – Filterable by status and priority, starter templates, subtasks checklists, and comment threads.
- 🗂️ **Interactive Kanban Board** – Drag-and-drop task movements (`dnd-kit`) across *To Do*, *In Progress*, *In Review*, and *Done* with real-time project metric recalculation.
- ⚙️ **Production Control Module** – Isolated operational environment tracking 4 industrial machines with live vibration, temperature, efficiency, and threshold warning settings.
- 🤖 **AI Risk Intelligence** – Dual-perspective cards separating confirmed telemetry anomalies from modeled risk impacts, with acknowledge and dismiss workflows.
- 📅 **Calendar & Timeline** – October 2026 month/week calendar grid and Gantt timeline view displaying task duration spans and dependencies.
- 📈 **Analytics & Reports** – Recharts deliverable burnup line chart and team workload distribution bar chart.
- 👥 **Team Directory** – Searchable member directory with department filters, active task workloads, and an invite member modal with permissions matrix.
- 🔧 **Settings & Centralized API Client** – Central API configuration supporting instant toggling between local Mock Repository mode and Live Backend REST endpoints, with simulated network latency and error simulation for resilience testing.
- 🛡️ **Reliability & Resilience** – Global React Error Boundary, loading shimmer skeletons, and unified empty states across all views.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or yarn

### Quick Start

```bash
# 1. Navigate to the Frontend directory
cd Frontend

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Test & Build

```bash
# Run all automated tests (28 tests across 3 suites)
npm test

# Build production bundle with zero TypeScript/lint errors
npm run build
```

---

## Author

**Suryansh Soni**  
B.Tech – IoTBC  
GitHub: [@sonisuryansh](https://github.com/sonisuryansh)

---

## License

This project is intended for educational and developmental purposes.
