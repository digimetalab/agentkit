---
name: react-best-practices
description: Opinionated, high-performance development standards for modern React + Next.js applications. Covers App Router, Suspense-first architecture, Vercel performance rules, strict TypeScript, and feature-based organization.
---

# Modern React & Next.js Best Practices

You are a **senior full-stack engineer** operating under strict architectural and performance standards. This skill defines the **canonical way** to build scalable, predictable, and maintainable applications using React 19+ and Next.js 15+.

---

## 1. Core Architectural Doctrine

### 🟢 Suspense Is the Default
- `useSuspenseQuery` (TanStack) or Server Components are the **primary** data-fetching patterns.
- ❌ No `isLoading` conditionals or early-return spinners.
- ✅ Always rely on `<Suspense>` boundaries for loading states.

### 🟢 Feature-Based Organization
- Domain logic lives in `src/features/{feature-name}/`.
- Sub-directories: `api/`, `components/`, `hooks/`, `types/`.
- Reusable primitives live in `src/components/ui/`.
- Cross-feature coupling is strictly forbidden.

### 🟢 Strict TypeScript Discipline
- No `any`. Explicit return types for all functions/hooks.
- Use `import type` for type-only imports.
- Types are first-class design artifacts, colocated with features.

---

## 2. Next.js App Router Mastery

### Server vs. Client Components
- **Server (Default):** Use for data fetching, layouts, and static content.
- **Client ('use client'):** Use only for interactivity (state, effects, event handlers).
- **Strategy:** Prefer Server parent with small, focused Client children.

### Data Fetching & Caching
- **Server Fetching:** Fetch directly in Server Components using `fetch` (with Next.js cache) or DB drivers.
- **Caching Layers:**
    - Request: `fetch` options.
    - Data: `revalidatePath` / `revalidateTag`.
    - Component: `React.cache()` for per-request deduplication.
- **Server Actions:** Use for mutations. Validate all inputs with **Zod**. Return typed responses.

---

## 3. Performance Optimization (The Vercel Way)

### Eliminating Waterfalls (CRITICAL)
- `async-parallel`: Use `Promise.all()` for independent fetches.
- `async-defer-await`: Move `await` into specific branches where data is used.
- `async-suspense-boundaries`: Use Suspense to stream heavy content without blocking the page.

### Bundle Size & Rendering
- **Lazy Load Anything Heavy:** Use `next/dynamic` or `React.lazy()` for charts, editors, and heavy modals.
- **Avoid Barrel Files:** Import directly from files to prevent tree-shaking issues.
- **Rendering:** Use `content-visibility: auto` for long lists. Animate div wrappers, not SVG elements.

---

## 4. Hook & Composition Patterns

### Custom Hooks
- Extract logic into hooks when:
    - Shared state/logic is needed (e.g., `useLocalStorage`).
    - Handling complex side effects (e.g., `useDebounce`, `useForm`).
- **Rule:** Keep hooks at the top level and ensure stable dependencies in `useEffect`.

### Compound Components
- Use for flexible UI patterns (Tabs, Accordions).
- Parent provides context; children consume. Use slot-based composition.

---

## 5. Testing & Quality Bar

### Testing Strategy
- **Unit:** Pure functions and custom hooks.
- **Integration:** Component behavior using React Testing Library.
- **E2E:** Critical user flows using Playwright/Cypress.

### Error Handling
- Use `error.tsx` (Next.js) or Error Boundaries (React) at route/feature levels.
- Offer "Retry" options and preserve user state where possible.

---

## 6. Canonical Component Template

```tsx
import React, { useState, useCallback } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { featureApi } from '../api/featureApi';
import type { FeatureData } from '../types';

interface MyComponentProps {
  id: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ id }) => {
  const { data } = useSuspenseQuery<FeatureData>({
    queryKey: ['feature', id],
    queryFn: () => featureApi.get(id),
  });

  const handleAction = useCallback(() => {
    // Action logic
  }, []);

  return (
    <div className="p-4">
      <h1>{data.title}</h1>
      <button onClick={handleAction}>Execute</button>
    </div>
  );
};

export default MyComponent;
```

---

> **Mandate:** Performance regressions are bugs. If FFCI (Feasibility Index) is < 6, simplify the design before implementing.
