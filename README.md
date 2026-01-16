# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# OmniLife Web - Enterprise Fintech & Commerce Dashboard

OmniLife Web is the client-side interface for the OmniLife Super App. It is a modern, type-safe React application designed to demonstrate **Real-Time Financial Data Visualization** and **E-Commerce Operations**.

It connects to the OmniLife Java Backend to perform ACID-compliant financial transfers and Event-Driven commerce transactions.

---

## 🚀 Key Technical Features

### 1. Modern State Management (Server State)
Instead of traditional Redux/Context for API data, this app uses **TanStack Query (React Query)**.
* **Benefits:** Automatic caching, background re-fetching, and "Optimistic UI" updates (Balance updates instantly after a transfer without a page reload).

### 2. Type-Safety First
Built with **TypeScript** to ensure strict contract adherence with the backend APIs. Interfaces for `Wallet`, `Transaction`, and `Order` prevent runtime errors.

### 3. Enterprise-Grade Forms
Forms (Money Transfer, Purchase) are built using **React Hook Form** combined with **Zod Schema Validation**.
* **Validation:** Prevents negative transfers, ensures required fields, and handles error states gracefully before sending data to the server.

### 4. UI/UX
* **Tailwind CSS:** Fully responsive, utility-first styling.
* **Feedback Loops:** Uses **React Hot Toast** for immediate success/error notifications.
* **Visual Data:** Color-coded transaction history (Green for Credit, Red for Debit) and dynamic stock indicators.

---

## 🛠 Tech Stack

* **Core:** React 18, Vite, TypeScript
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **State/Data:** TanStack Query (@tanstack/react-query), Axios
* **Forms:** React Hook Form, Zod
* **Utilities:** Date-fns, clsx

---

## 📦 Feature Modules

### 💰 Finance Dashboard
* **Real-time Balance:** Fetches wallet balance on mount and invalidates cache on transactions.
* **Transaction History:** A clean, paginated table showing chronological financial activity.
* **Money Transfer:** A secure form to send funds to other users (UUID-based).

### 🛍️ Commerce Marketplace
* **Product Catalog:** Grid view of products with live inventory tracking.
* **Stock Logic:** "Buy Now" button disables automatically when stock hits 0.
* **Order History:** Tracks the status of purchases (`PENDING` -> `COMPLETED`) processed by the backend Saga pattern.

---

## 🏃‍♂️ How to Run

1.  **Prerequisites:**
    * Node.js (v18+)
    * The [OmniLife Backend](https://github.com/your-backend-repo) running on port `8080`.

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Start Development Server:**
    ```bash
    npm run dev
    ```

4.  **Access the App:**
    Open `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```text
src/
├── api/             # Axios client & Service layers (Separation of concerns)
│   ├── axiosClient.ts
│   ├── financeService.ts
│   └── commerceService.ts
├── components/      # Reusable UI components
│   ├── finance/     # Specific widgets (TransferCard, TransactionList)
│   ├── commerce/    # Specific widgets (ProductCard)
│   └── ui/          # Generic atoms (Buttons, Inputs)
├── pages/           # Route views (Dashboard, Marketplace, History)
├── types/           # TypeScript Interfaces (mirroring Backend DTOs)
└── App.tsx          # Main Router & QueryClient Provider
