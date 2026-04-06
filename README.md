# 💰 Finance Dashboard UI

A beautifully designed, responsive, role-based financial dashboard built with React 19, Redux Toolkit, and Tailwind CSS. Tracks financial activity with full **CRUD operations**, **Local Storage persistence**, **CSV/JSON export**, and rich **data-driven charts and insights**.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ and **npm** v9+

### Setup Steps

```bash
# 1. Navigate into the project directory
cd finance-dashboard-ui

# 2. Install all dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

> **Tip:** The app loads with an empty state on first visit. Switch to **Admin** role in the header to add your first transactions — they'll be saved automatically to Local Storage.

---

## 🏗 Project Structure

```text
src/
├── components/          # Reusable UI building blocks
│   ├── BalanceChart.tsx     # Area chart for cumulative balance over time
│   ├── ExpenseChart.tsx     # Pie chart for spending breakdown by category
│   ├── MetricCard.tsx       # KPI cards with trend indicators
│   ├── TransactionModal.tsx # Add/Edit transaction form modal
│   └── TransactionTable.tsx # Sortable, filterable transactions table
├── hooks/
│   └── useFinanceData.ts    # Custom hook: CRUD + Local Storage sync
├── layouts/
│   └── DashboardLayout.tsx  # Sidebar + Header shell; responsive mobile overlay
├── pages/
│   ├── Dashboard.tsx        # Overview page with charts and insights
│   └── Transactions.tsx     # Full transaction management page
├── store/
│   ├── slices/
│   │   ├── appSlice.ts          # UI state: sidebar, theme, role
│   │   └── transactionsSlice.ts # Transaction data + filter/sort state
│   ├── hooks.ts             # Typed useAppSelector / useAppDispatch
│   └── store.ts             # Root Redux store
├── utils/
│   └── exportUtils.ts       # CSV and JSON export logic
├── App.tsx                  # Root component with Router + Redux Provider
├── main.tsx                 # React DOM entry point
└── index.css                # Tailwind v4 + global styles + animations
```

---

## 🗺 Component Data Map

### 📊 `Dashboard.tsx` — Overview Page

| Section                      | Data Source                      | What it Shows                                         |
| ---------------------------- | -------------------------------- | ----------------------------------------------------- |
| **Total Balance** card       | `transactions` (Local Storage)   | Sum of all income minus all expenses                  |
| **Total Income** card        | `transactions` (Local Storage)   | Sum of all income entries + % change vs last 30 days  |
| **Total Expenses** card      | `transactions` (Local Storage)   | Sum of all expense entries + % change vs last 30 days |
| **Balance Chart** (Area)     | `transactions` — sorted by date  | Cumulative running balance plotted per day over time  |
| **Spending Breakdown** (Pie) | `transactions` — expenses only   | Per-category spending, grouped and color-coded        |
| **Highest Spending** insight | `transactions` — expenses only   | The single category with the largest total spend      |
| **Income Trend** insight     | Last 30 days vs previous 30 days | % income growth or decline with color-coded label     |
| **Expense Trend** insight    | Last 30 days vs previous 30 days | % expense growth or decline with color-coded label    |

> **Monthly Comparison Logic:** "Last 30 days" is compared against "days 31–60" to derive the growth percentages shown on both the metric cards and insight tiles.

---

### 🧾 `Transactions.tsx` — Transaction Management Page

| Section                        | Data Source                          | What it Shows / Does                                        |
| ------------------------------ | ------------------------------------ | ----------------------------------------------------------- |
| **Transaction Table**          | `transactions` (Local Storage)       | All transactions: date, description, category, amount, type |
| **Search Bar**                 | Local component state + filter       | Debounced search across description and category fields     |
| **Category Filter**            | `transactionsSlice.filterCategory`   | Dropdown to show only a selected category                   |
| **Type Filter**                | `transactionsSlice.filterType`       | Filter by `income`, `expense`, or show all                  |
| **Date / Amount Sort**         | `transactionsSlice.sortBy/sortOrder` | Click column headers to sort ascending or descending        |
| **Add Transaction** (Admin)    | `useFinanceData.add()`               | Opens modal; saves to Redux + Local Storage                 |
| **Edit Transaction** (Admin)   | `useFinanceData.update()`            | Pre-fills modal with existing data; saves changes           |
| **Delete Transaction** (Admin) | `useFinanceData.remove()`            | Removes from Redux + Local Storage immediately              |
| **Export CSV**                 | `exportUtils.exportToCSV()`          | Downloads all transactions as a `.csv` file                 |
| **Export JSON**                | `exportUtils.exportToJSON()`         | Downloads all transactions as a `.json` file                |

> **Role Guard:** Edit, Delete, and Add buttons are only active when the role switcher in the header is set to **Admin**. Viewers see the data but cannot mutate it.

---

### 🧩 Reusable Components

| Component          | Props / Inputs                           | What it Renders                                                            |
| ------------------ | ---------------------------------------- | -------------------------------------------------------------------------- |
| `MetricCard`       | `title`, `value`, `icon`, `trend`        | A KPI card with a label, formatted value, icon, and an up/down trend badge |
| `BalanceChart`     | `data: { date, balance }[]`              | A Recharts `AreaChart` with gradient fill and date-formatted X-axis        |
| `ExpenseChart`     | `data: { category, amount }[]`           | A Recharts `PieChart` with a legend and custom tooltip                     |
| `TransactionModal` | `isOpen`, `onClose`, `transactionToEdit` | A full form modal for creating or editing a transaction                    |
| `TransactionTable` | `onEdit`, `searchTerm`                   | The data table with inline sort, filter consumption, and action buttons    |

---

### 🏛 `DashboardLayout.tsx` — App Shell

| Feature               | Behavior                                                                          |
| --------------------- | --------------------------------------------------------------------------------- |
| **Sidebar (Desktop)** | Toggles between full (`w-64`) and mini icon-only (`w-20`) mode                    |
| **Sidebar (Mobile)**  | Completely hidden by default; slides in as a full overlay when opened             |
| **Backdrop (Mobile)** | Semi-transparent blur overlay behind sidebar; click to close                      |
| **Header**            | Contains Menu toggle, Role switcher (Viewer/Admin), Theme toggle, and User avatar |
| **Theme Toggle**      | Switches between Light and Dark mode; applies `.dark` class to `<html>`           |
| **Role Switcher**     | Switches between `Viewer` and `Admin`; controls access to CRUD actions            |

---

## ⚙️ State Management

The app uses **Redux Toolkit** for global state with two slices:

### `appSlice`

| State Key     | Type                  | Purpose                            |
| ------------- | --------------------- | ---------------------------------- |
| `sidebarOpen` | `boolean`             | Controls sidebar open/closed state |
| `theme`       | `'light' \| 'dark'`   | Current color theme                |
| `role`        | `'Viewer' \| 'Admin'` | Current user role for RBAC         |

### `transactionsSlice`

| State Key        | Type                 | Purpose                                                   |
| ---------------- | -------------------- | --------------------------------------------------------- |
| `items`          | `Transaction[]`      | The full list of transactions (loaded from Local Storage) |
| `filterCategory` | `string`             | Active category filter (`'all'` or a category name)       |
| `filterType`     | `string`             | Active type filter (`'all'`, `'income'`, `'expense'`)     |
| `sortBy`         | `'date' \| 'amount'` | The column currently sorted                               |
| `sortOrder`      | `'asc' \| 'desc'`    | The sort direction                                        |

---

## 💾 Data Persistence — `useFinanceData` Hook

The `useFinanceData` custom hook wraps all CRUD operations and **automatically syncs every change to `localStorage`** under the key `finDash_transactions`.

```typescript
const { transactions, add, update, remove } = useFinanceData();
```

| Method                | What it Does                                                 |
| --------------------- | ------------------------------------------------------------ |
| `add(transaction)`    | Dispatches to Redux + writes updated array to `localStorage` |
| `update(transaction)` | Finds by ID, updates in Redux + writes to `localStorage`     |
| `remove(id)`          | Filters out by ID in Redux + writes to `localStorage`        |

On **app startup**, `transactionsSlice` checks `localStorage` for existing data before falling back to an empty initial state.

---

## 📤 Export Utilities — `exportUtils.ts`

| Function                     | Output                                                            |
| ---------------------------- | ----------------------------------------------------------------- |
| `exportToCSV(transactions)`  | Converts to comma-separated values and triggers a `.csv` download |
| `exportToJSON(transactions)` | Stringifies to formatted JSON and triggers a `.json` download     |

Both functions generate a filename with today's date, e.g., `transactions_2026-04-06.csv`.

---

## 🎨 Theming — Tailwind CSS v4 + Dark Mode

This project uses **Tailwind CSS v4**, configured entirely through CSS:

```css
/* src/index.css */
@import "tailwindcss";
@custom-variant dark (&:is(.dark *));
```

Dark mode is applied by toggling a `.dark` class on `<html>` in response to the Redux `theme` state. Every component uses `dark:` prefixed utilities (e.g., `dark:bg-slate-900`) which activate instantly.

---

## 📦 Tech Stack

| Library              | Version | Role                                      |
| -------------------- | ------- | ----------------------------------------- |
| **React**            | 19      | UI component layer                        |
| **TypeScript**       | 5.x     | Static typing throughout                  |
| **Vite**             | 6       | Build tool with HMR                       |
| **Redux Toolkit**    | 2.x     | Global state management                   |
| **React Router DOM** | 6       | Client-side routing                       |
| **Tailwind CSS**     | 4.x     | Utility-first styling                     |
| **Recharts**         | 2.x     | `AreaChart` and `PieChart` visualizations |
| **DayJS**            | 1.x     | Date formatting and manipulation          |
| **Lucide React**     | latest  | Icon library (SVG via JSX)                |

---

## ✅ Implemented Features

- [x] **Local Storage Persistence** — All transactions survive page refreshes
- [x] **Full CRUD** — Add, Edit, Delete via modal form (Admin only)
- [x] **Role-Based Access Control** — Viewer vs Admin with UI guards
- [x] **Dark / Light Mode** — Full theme toggle with seamless transitions
- [x] **Responsive Sidebar** — Mobile overlay + desktop mini-sidebar
- [x] **Export to CSV & JSON** — One-click download with date-stamped filenames
- [x] **Cumulative Balance Chart** — Real data computed from transactions history
- [x] **Spending Breakdown Pie Chart** — Derived from expense transactions by category
- [x] **Monthly Income & Expense Comparison** — Last 30 days vs previous 30 days with % growth
- [x] **Quick Insights Section** — Highest spending, income trend, expense trend cards
- [x] **Search, Filter & Sort** — Combined search, category/type filter, and column sorting
- [x] **Metric Cards with Live Trend Badges** — Dynamically calculated from real data
