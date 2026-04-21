# Invoice Management App

A fully responsive invoice management application built with React, TypeScript, and Tailwind CSS.

[View live](https://invoice-management-six-sand.vercel.app/)

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Architecture

```
src/
├── components/
│   ├── DeleteModal.tsx     # Confirmation modal with focus trap
│   ├── InvoiceForm.tsx     # Create / edit form with validation
│   ├── InvoiceHeader.tsx   # Title, invoice count, filter, new button
│   ├── Sidebar.tsx         # Navigation bar (top on mobile, left on desktop)
│   ├── SplashScreen.tsx    # Animated loading screen
│   └── StatusBadge.tsx     # Coloured status pill
├── context/
│   ├── InvoiceContext.tsx  # CRUD state + localStorage persistence
│   └── ThemeContext.tsx    # Light/dark mode + localStorage persistence
├── pages/
│   ├── InvoiceDetail.tsx   # Single invoice view
│   └── InvoiceList.tsx     # Filterable invoice list
├── storage.ts              # localStorage read/write + seed data
├── types.ts                # Shared TypeScript types
└── App.tsx                 # Root: splash → main shell
```

State is managed entirely with React Context + `useState`. No external state library is used. Data is persisted to `localStorage` on every change via a `useEffect` in `InvoiceContext`.

## Features

- **CRUD** — create, view, edit, and delete invoices
- **Draft / Pending / Paid** flow — save drafts, send as pending, mark as paid; paid invoices cannot be edited
- **Filter by status** — checkbox filter updates the list immediately; empty state shown when no results
- **Light / dark mode** — toggled from the sidebar, preference persisted across reloads
- **Form validation** — all required fields, email format, at least one item, positive quantities and prices; invalid fields show inline error messages and block submission
- **Responsive** — mobile-first layout, adapts at 768 px (tablet) and 1024 px (desktop)
- **Animated splash screen** — staggered entrance, progress bar, smooth fade-out transition into the main app

## Trade-offs

- **localStorage only** — simple and zero-dependency, but limited to ~5 MB and a single browser/device. An IndexedDB or backend approach would be needed for larger datasets or multi-device sync.
- **No router** — view state is managed with a plain `useState` union type (`{ page: 'list' } | { page: 'detail'; id: string }`). This keeps the bundle small but means the URL never changes, so deep-linking and browser back/forward don't work. Adding `react-router-dom` would fix this.
- **No optimistic updates** — all mutations are synchronous in-memory, so there is no loading state to manage.

## Accessibility

- Semantic HTML throughout: `<main>`, `<aside>`, `<section>`, `<ul>/<li>`, `<button>`, `<label>`, `<input>`, `<select>`
- Every form field has an associated `<label>` (via `htmlFor` / `id`)
- Delete modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the heading, auto-focuses Cancel on open, full Tab/Shift+Tab focus trap, closes on Escape
- Invoice form closes on Escape
- Filter checkboxes use native `<input type="checkbox">` with visible labels
- Colour contrast meets WCAG AA in both light and dark modes
- All icon-only buttons have `aria-label`
- Images have descriptive `alt` text or `aria-hidden` where decorative
