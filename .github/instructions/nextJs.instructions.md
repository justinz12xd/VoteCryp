---

description: 'Next.js-specific coding standards and best practices'
applyTo: '\*\*/*.ts, \*\*/*.tsx, \*\*/*.js, \*\*/*.jsx, \*\*/*.css, \*\*/*.scss'
--------------------------------------------------------------------------------

# Next.js Development Instructions

Instructions for generating high-quality Next.js applications with TypeScript, following React and Next.js best practices as outlined at [https://nextjs.org/docs](https://nextjs.org/docs).

## Project Context

* Latest Next.js version (App Router, React Server Components by default)
* TypeScript for type safety
* Next.js CLI (`create-next-app`) for project setup and scaffolding
* Follow React and Next.js Style Guide
* Use Tailwind CSS, CSS Modules, or SCSS for consistent styling (if specified)
* Use modern UI libraries (e.g., shadcn/ui, Radix UI, Material UI) for components if required

## Development Standards

### Architecture

* Use the **App Router** with server and client components appropriately
* Organize code by feature/domain (e.g., `app/feature`, `lib/feature`, `components/feature`)
* Implement **route groups** and **dynamic routes** for scalability
* Use server components by default; only opt into client components when state or effects are required
* Leverage Next.js built-in API routes or edge/serverless functions for backend needs

### TypeScript

* Enable strict mode in `tsconfig.json` for type safety
* Define clear interfaces and types for components, hooks, and models
* Use type guards, utility types, and discriminated unions for robust checks
* Ensure props and state are strictly typed
* Use `zod` or similar for runtime validation of API inputs/outputs

### Component Design

* Use **functional components** with hooks
* Keep components small, focused, and reusable
* Distinguish between **presentational (UI)** and **container (logic)** components
* Prefer **React Server Components (RSC)** for data fetching and rendering when possible
* Use **React hooks** (`useState`, `useReducer`, `useEffect`, `useMemo`, `useCallback`, `useRef`) responsibly
* Leverage **custom hooks** for reusable logic
* Use `async`/`await` in server components for data fetching

### Styling

* Use Tailwind CSS or CSS Modules for scoped styling
* SCSS is acceptable for large projects needing advanced styling
* Implement responsive design with CSS Grid, Flexbox, or utility-first frameworks (Tailwind)
* Follow accessibility best practices (ARIA roles, semantic HTML)
* Use dark mode theming if required (via Tailwind or CSS custom properties)

### State Management

* Prefer **React state** (`useState`, `useReducer`) for local state
* Use **React Context** or libraries like **Zustand**, **Jotai**, or **Redux Toolkit** for global state
* Use **React Query / TanStack Query** for async server state management (caching, revalidation)
* For derived state, prefer memoization (`useMemo`) or selector functions
* Ensure loading and error states are consistently handled in UI

### Data Fetching

* Use **Next.js `fetch` with caching options** (`force-cache`, `no-store`, `revalidate`) in server components
* Implement **SWR** or **React Query** for client-side fetching and caching
* Co-locate data fetching with the components/pages that need it
* Use **environment variables** via Next.js conventions (`process.env.NEXT_PUBLIC_*`)
* Handle API errors gracefully with error boundaries and fallback UI
* Use **incremental static regeneration (ISR)** for performance where applicable

### Security

* Sanitize user inputs on both client and server
* Use Next.js middleware for authentication/authorization and route protection
* Store secrets only in server environment variables
* Use libraries like **next-auth** or custom JWT handling for authentication
* Avoid direct DOM manipulation; use React state and refs instead
* Follow React security best practices (e.g., `dangerouslySetInnerHTML` only when absolutely necessary with sanitization)

### Performance

* Use Next.js **Image component** for optimized image loading
* Use Next.js **Script component** for optimized third-party script loading
* Implement **dynamic imports** (`next/dynamic`) for code splitting
* Optimize rendering with memoization (`React.memo`, `useMemo`, `useCallback`)
* Leverage **server-side rendering (SSR)**, **static site generation (SSG)**, and **ISR** depending on the use case
* Use **Edge Functions** for low-latency responses when needed

### Testing

* Write unit tests for components, hooks, and utilities using **Jest + React Testing Library**
* Use **Playwright** or **Cypress** for end-to-end testing
* Mock API requests with **MSW (Mock Service Worker)**
* Test accessibility with tools like **axe-core**
* Ensure high test coverage for core functionality

## Implementation Process

1. Plan project structure and routing with App Router
2. Define TypeScript interfaces and models
3. Scaffold components and utilities using Next.js CLI
4. Implement server-side data fetching with React Server Components
5. Build reusable UI components with clear props and minimal coupling
6. Add client-side interactivity with hooks or client components
7. Apply styling with Tailwind or CSS Modules
8. Secure routes and API endpoints with middleware and authentication
9. Handle errors and loading states consistently
10. Write unit and e2e tests
11. Optimize performance (images, code splitting, caching, ISR)

## Additional Guidelines

* Follow React and Next.js naming conventions (e.g., `page.tsx`, `layout.tsx`, `feature.component.tsx`)
* Use Next.js CLI for scaffolding where possible
* Document components, hooks, and utilities with JSDoc or TSDoc
* Ensure accessibility compliance (WCAG 2.1)
* Use Next.js i18n for internationalization when required
* Keep code DRY with reusable utilities, hooks, and shared components
* Use React Query/SWR consistently for async state management
