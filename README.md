# ClassReady — Classroom Readiness & AV Facilities Operations System

> A modern, production-grade web application designed for universities, colleges, and enterprise training facilities to track room-by-room equipment readiness, report in-class failures instantly, and triage repairs through an active dispatch workflow.

---

## 🏛️ System Overview

ClassReady bridges the gap between instructors facing non-working projectors, dead lapel mics, frozen smartboards, or leaking AC units and on-duty AV/facilities technicians who need rapid, location-precise triage.

### Core Problems Solved:
1. **Zero-Delay Incident Reporting**: Lecturers can report an equipment failure in under 10 seconds via lectern QR codes or a streamlined reporting wizard without complex logins or endless ticket forms.
2. **Room-Wise Readiness Health Scoring**: Live 0–100% composite health scores computed from equipment criticalities (e.g. laser projectors and microphones carry higher weight than auxiliary ports).
3. **Dispatch & Kanban Work Order Workflow**: Facility technicians manage triage across 5 progressive lanes (*New Reports*, *Dispatched*, *In Progress*, *Awaiting Parts*, *Resolved*), with live SLA countdowns and audit trails.
4. **Hardware Diagnostic Self-Tests**: On-demand simulated hardware telemetry pings to verify signal routes, laser diode hours, and RF microphone battery levels.
5. **Classroom Placards & QR Simulator**: Scannable, printable high-resolution classroom placards for lecterns and podiums with an interactive mobile simulator.

---

## 🚀 Key Features

### 1. Classroom Readiness Hub
- **Card & Table Views**: High-density or visual card view with real-time health badges (`100% Ready`, `Partially Degraded`, `Action Required`).
- **Schedule Sync**: Displays ongoing and upcoming lectures (e.g. *"ME-402 Autonomous Robotics with Dr. Aris Thorne"*) and highlights when a failure directly blocks an active class.
- **Multifaceted Filtering**: Filter instantly by Building (*Engineering Hall*, *Science & Biotech*, *Business School*, *Humanities*), Floor (1st–4th), Readiness Status, and Equipment Category.

### 2. Comprehensive Room Inspection & Diagnostic Modal
- Full inventory of all room equipment with serial numbers, model details, and technical specifications.
- **Interactive Self-Test**: Test hardware telemetry directly from the UI with instant pass/warn/fail feedback.
- Schedule alert box indicating minutes until the next lecture session begins.
- Room maintenance audit log detailing past resolved incidents.

### 3. Rapid Issue Reporting System
- **Touch-Friendly Category Selector**: Projector, Microphone, Smartboard, AC/Fan, Lectern PC, Speakers, HDMI/USB-C, Wi-Fi.
- **Pre-cataloged Common Symptoms**: Click-to-fill symptoms (e.g. *"Overheat warning & thermal shutdown"*, *"Audio dropouts & squealing"*, *"Touch sensor dead zone"*).
- **Severity Levels**: *Critical (Class Blocked)*, *High*, *Medium*, *Low*.
- Automatically updates room health score and marks the specific hardware unit offline.

### 4. Technician Dispatch & Work Order Kanban
- 5-lane Kanban triage board.
- Specialist assignment with specialist avatars, phone extensions, and active workload tracking.
- Status transition actions (*In Progress*, *Awaiting Parts*, *Certify & Resolve*).
- Timestamped activity audit log with technician notes.

### 5. Campus Analytics & Reliability Insights
- **SLA Response Compliance Metric**: Tracks target response times (&gt;95% target, 6.2m avg dispatch).
- **MTTR (Mean Time to Resolution)**: Detailed metrics by priority tier.
- **Equipment Vulnerability Distribution**: Visual breakdown of failure-prone categories (e.g. projectors vs microphones vs HDMI cables).
- **Classroom Hotspot Leaderboard**: Highlights rooms requiring preventive maintenance sweeps.

### 6. Podium Mobile QR Simulator
- High-fidelity interactive smartphone simulator showcasing the zero-friction experience an instructor sees after scanning the podium QR placard.

---

## 📐 Architecture & Tech Stack

```
src/
├── types/                     # Strong TypeScript data contracts & schemas
├── data/                      # Realistic campus mock data (4 buildings, 24 rooms, 120+ devices, technicians)
├── context/                   # ClassReadyContext (state management, local storage, toast notifications)
├── utils/                     # Formatting, badge styles, date utilities, classnames
├── components/
│   ├── ui/                    # Reusable design primitives (Badge, Button, Card, Modal, Input, Select, Toast)
│   ├── common/                # Navbar, EquipmentIcon, QrPlacardModal
│   ├── readiness/             # SubHeader, RoomCard, RoomTableView
│   ├── rooms/                 # RoomDetailModal (equipment checklist, self-test diagnostics)
│   ├── reports/               # ReportIssueModal (symptom picker, severity, reporter metadata)
│   ├── dispatch/              # WorkOrdersKanban, TicketDetailDrawer
│   ├── analytics/             # AnalyticsView (SLA compliance, MTTR, failure distribution)
│   └── kiosk/                 # PodiumKioskSimulator (lectern QR phone scan portal)
├── App.tsx                    # Main layout and tab orchestrator
├── main.tsx                   # React 18 bootstrap with context provider
└── index.css                  # Tailwind styles and custom scrollbars
```

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v25)
- npm or pnpm

### Installation & Development
```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production (Strict TypeScript verification + Vite bundle)
npm run build
```

---

## 🎨 Design Philosophy & UX Highlights

- **Professional B2B SaaS Aesthetics**: Clean slate backgrounds, high-contrast dark accents, purposeful semantic colors (Emerald `#10b981`, Amber `#f59e0b`, Rose `#ef4444`).
- **No Decorative Gimmicks**: Avoids tacky neon glow, exaggerated glassmorphism, or cartoonish borders. Emphasizes clean typography, tabular numerals, and high information hierarchy.
- **Immediate Feedback**: Every user action (reporting an issue, self-testing a device, assigning a technician, certifying a fix) gives clear, immediate UI feedback and toast confirmation.
- **Data Persistence**: State changes automatically sync to `localStorage` with a 1-click **Reset Sample Data** button in the top navigation bar.

