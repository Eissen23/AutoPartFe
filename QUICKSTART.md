# QUICKSTART — AutoPartFe

This quickstart explains the project structure, application layers, and how to add a new page + use a new backend endpoint. It assumes TypeScript, Tailwind CSS and the `#src` import alias are used across the project.

---

## Quick facts
- Framework: React (v19) + TypeScript + Vite
- Styling: Tailwind CSS
- UI: Ant Design
- Router: React Router v7 (createBrowserRouter + lazy routes)
- Server state: @tanstack/react-query
- HTTP client / OpenAPI: axios + generated OpenAPI client in `src/openapi`
- Local state: Redux Toolkit (small `user` slice for auth)
- Dev scripts:
  - `pnpm run dev` — start dev server
  - `pnpm run build` — build (runs `tsc -b && vite build`)
  - `pnpm run gen:api` — regenerate OpenAPI client (openapi-generator-cli)

---

## 1) Project folder structure (key files)

Top-level layout:

- `public/` — static assets (images, icons)
- `src/` — application source
  - `src/main.tsx` — app entry, mounts React
  - `src/App.tsx` — root app wiring (Redux Provider, ApiProvider, MessageProvider, Router)
  - `src/routes/` — route configuration
    - `src/routes/index.ts` — root router; imports `coreRoutes`
    - `src/routes/core/` — logical route groups: `auth.ts`, `dashboard.ts`, `index.ts`
  - `src/pages/` — pages (top-level and feature pages)
    - `src/pages/auths/` — login/signup pages
    - `src/pages/admin/` — admin pages (products, warehouses)
    - `src/pages/HomePage.tsx`, `src/pages/NotFoundPage.tsx`
  - `src/components/` — small reusable UI and layout components
    - `src/components/layouts/` — `RootLayout`, `DashboardLayout`, `ProtectedDashboardLayout`
  - `src/apis/` — thin API wrappers that call the generated OpenAPI client (do not edit `src/openapi` manually)
    - e.g. `src/apis/products/index.ts`, `src/apis/warehouses/index.ts`
  - `src/openapi/` — generated OpenAPI client (auto-generated, don't edit by hand)
  - `src/hooks/` — domain hooks that encapsulate data fetching and mutations (use react-query hooks)
    - `src/hooks/product`, `src/hooks/warehouses`, `src/hooks/categories`, `src/hooks/auth` etc.
  - `src/store/` — Redux Toolkit store and slices (currently `userSlice`)
  - `src/utils/` — shared helpers
    - `src/utils/api/` — axios instance, token manager, `useFetch` and `useApiMutation`, React Query `queryClient`, `ApiProvider`
    - `src/utils/message/` — centralized message utilities
  - `src/styles/` — Tailwind entry and some global classes

Files at repo root you will likely use:
- `vite.config.ts` — resolves `#src` alias
- `openapitools.json` — config for `openapi-generator-cli` used by `pnpm run gen:api`

---

## 2) Application structure & layers (conceptual)

The code follows a common layered approach:

- Presentation (UI)
  - `src/pages/*` and `src/components/*` contain the UI. Keep components small and presentational.
  - Layouts (RootLayout, DashboardLayout) wrap pages and create consistent navigation.

- Routing
  - `src/routes` configures routes with lazy-loaded components. Protect routes with `ProtectedDashboardLayout` / auth guard.

- Domain/hooks
  - `src/hooks/*` implement domain-specific data fetching and mutation logic (wrap `useFetch` / `useApiMutation`). They handle query invalidation and user-facing messages.

- API layer
  - `src/apis/*` are thin wrappers around the generated client in `src/openapi`. They expose typed functions (createProduct, searchProducts, etc.) returning `data`.
  - `src/openapi` is regenerated from the backend's OpenAPI/Swagger spec — do not hand-edit.
  - `src/utils/api` creates a shared Axios instance (with interceptors) and a token manager.

- State management
  - Server state / caching: React Query (`queryClient`) is used for caching, refetching and mutation orchestration.
  - Client auth state: Redux Toolkit (`src/store/userSlice.ts`) stores token and isAuthenticated flag.

- Cross-cutting utilities
  - Notifications via `src/utils/message` (Ant Design message wrapper)
  - Token handling via `src/utils/api/tokenManager` and axios interceptors (automatic refresh logic)

---

## 3) How to add a new page + use a new backend endpoint (step-by-step)

Below is a minimal, reproducible workflow. Keep to the project conventions:
- Use TypeScript for all new files.
- Use the `#src` alias for imports (never relative backtracks like `../../../`).
- Use `useFetch` and `useApiMutation` from `#src/utils/api` for queries and mutations.
- Keep API shape types from `#src/openapi` and thin wrappers in `src/apis`.

Example feature: "Widgets" (list + create). Steps:

1) Add or expose endpoint on backend + update OpenAPI spec
   - Update backend OpenAPI (Swagger) to add `/api/v1/widgets` endpoints.
   - Confirm backend swagger URL is correct (default in `openapitools.json` is `http://localhost:5026/swagger/v1/swagger.json`).

2) Regenerate OpenAPI client

   ```bash
   pnpm install         # if dependencies not installed
   pnpm run gen:api     # runs openapi-generator-cli generate
   ```

   - This overwrites `src/openapi` with new typed clients. If the generator fails, check that your backend swagger URL is reachable and adjust `openapitools.json`.

3) Add a thin API wrapper in `src/apis/widgets/index.ts`

   - Create `src/apis/widgets/index.ts` with the same pattern used by `src/apis/products` and `src/apis/warehouses`.

   Example (template):

   ```ts
   // src/apis/widgets/index.ts
   import type {
     WidgetDto,
     WidgetsApiApiV1WidgetsSearchPostRequest,
   } from '#src/openapi';
   import { apiClients } from '#src/utils/api';

   export type WidgetSearchRequest = WidgetsApiApiV1WidgetsSearchPostRequest['searchWidgetRequest'];
   export type WidgetResponse = WidgetDto;

   export const searchWidgets = async (request?: WidgetSearchRequest) => {
     const result = await apiClients.widgets.apiV1WidgetsSearchPost({
       searchWidgetRequest: request,
     });
     return result.data; // keep consistent with other wrappers
   };

   export const getWidget = async (id: string) => {
     const result = await apiClients.widgets.apiV1WidgetsIdGet({ id });
     return result.data;
   };

   export const createWidget = async (request?: any) => {
     const result = await apiClients.widgets.apiV1WidgetsPost({ createWidgetRequest: request });
     return result.data;
   };
   ```

   - Replace `any` with the correct `CreateWidgetRequest` type exported from `#src/openapi`.

4) Add domain hooks in `src/hooks/widgets/index.ts`

   - Hooks should wrap `useFetch` and `useApiMutation` and manage query invalidation and messages.

   Example:

   ```ts
   // src/hooks/widgets/index.ts
   import { useFetch, useApiMutation } from '#src/utils/api';
   import { useQueryClient } from '@tanstack/react-query';
   import { useMessage } from '#src/utils/message';
   import { searchWidgets, createWidget, getWidget } from '#src/apis/widgets';

   export function useWidgetsQuery(payload?: any) {
     return useFetch({
       queryKey: ['widgets', payload],
       queryFn: async () => {
         const result = await searchWidgets(payload);
         return result.data || result; // match other hooks
       },
       staleTime: 1000 * 60,
     });
   }

   export function useCreateWidget() {
     const qc = useQueryClient();
     const message = useMessage();
     return useApiMutation({
       mutationFn: async (payload: any) => {
         const resp = await createWidget(payload);
         return resp;
       },
       onSuccess: () => {
         message.success('Widget created');
         qc.invalidateQueries({ queryKey: ['widgets'] });
       },
       onError: () => message.error('Failed to create widget'),
     });
   }
   ```

   - Replace `any` types with proper types from `#src/openapi`.

5) Create the page component `src/pages/admin/widgets/index.tsx`

   - Use pattern from `src/pages/admin/products/index.tsx` or `warehouses/index.tsx`.
   - Use Ant Design components and Tailwind classes for layout.
   - Use hooks created earlier to fetch and mutate data.

   Minimal example:

   ```tsx
   // src/pages/admin/widgets/index.tsx
   import { useState } from 'react';
   import { Card, Button } from 'antd';
   import { useWidgetsQuery, useCreateWidget } from '#src/hooks/widgets';

   export default function WidgetsPage() {
     const [params, setParams] = useState({ pageNumber: 1, pageSize: 10 });
     const { data, isLoading, refetch } = useWidgetsQuery(params);
     const createMutation = useCreateWidget();

     return (
       <div className="p-6 bg-gray-50 min-h-screen">
         <Card className="mb-4">
           <div className="flex justify-between">
             <h3>Widgets</h3>
             <Button onClick={() => createMutation.mutate({ /* payload */ })}>Create</Button>
           </div>
         </Card>

         {/* Render table or list using data */}
         <pre>{JSON.stringify(data, null, 2)}</pre>
       </div>
     );
   }
   ```

6) Add a route so the page is reachable

   - If the page belongs to the dashboard area, add it to `src/routes/core/dashboard.ts` children array.
   - The `DashboardLayout` builds its sidebar from the `dashboardRoutes` children metadata so adding a `handle.label` will show the nav automatically.

   Example edit (append a child):

   ```ts
   // src/routes/core/dashboard.ts (partial)
   import { lazy } from 'react';
   const WidgetsPage = lazy(() => import('#src/pages/admin/widgets'));

   export const dashboardRoutes: RouteObject[] = [
     {
       path: '/dashboard',
       Component: ProtectedDashboardLayout,
       children: [
         // ...existing children
         {
           path: '/dashboard/widgets',
           Component: WidgetsPage,
           handle: { label: 'Widgets' },
         },
       ],
     },
   ];
   ```

   - Alternatively, create a new `src/routes/core/widgets.ts` and export a `RouteObject[]` then include it in `src/routes/core/index.ts` (preferred if the feature is large).

7) Wire up auth / tokens (if needed)

   - Login is handled by `src/hooks/auth` and `src/apis/auth`.
   - `useLogin` stores tokens via `tokenManager.setToken` and updates `api.updateConfiguration()`.
   - Axios interceptors automatically refresh tokens and redirect to `/login` on permanent auth failure.
   - If your new page needs to call protected APIs, put it under `/dashboard` (protected by `ProtectedDashboardLayout`) or use `ProtectedRoute`.

8) Run and test

   ```bash
   pnpm install
   pnpm run dev
   # open http://localhost:5173
   # navigate to /dashboard/widgets (or the route you registered)
   ```

---

## 4) Conventions & tips (do's and don'ts)
- Use `#src` alias for imports: `import { useMessage } from '#src/utils/message'`.
- Use TypeScript with explicit types (avoid `any`). Use types from `#src/openapi` whenever talking to backend APIs.
- For data fetching prefer `useFetch` (wraps React Query) and `useApiMutation` (for create/update/delete).
- Keep `src/openapi` generated. Add wrapper functions to `src/apis/*` and never call `src/openapi` directly from UI components — always use the `src/apis` wrappers and domain hooks.
- For UI use Ant Design components and Tailwind utility classes (no CSS files besides `src/styles/*`).
- For global notifications use `useMessage()` from `#src/utils/message`.
- For protected pages place them under `/dashboard` and/or wrap with `ProtectedRoute`.

---

If you want, I can:
- Add a minimal `widgets` feature implementation as a real code change (API wrapper + hook + page + route) to use as a concrete example.
- Run `pnpm run gen:api` for you (requires backend to be reachable) and update `src/openapi`.

Files changed: `./QUICKSTART.md` (this file).
