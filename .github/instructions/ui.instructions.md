---
applyTo: "src/components/**,src/pages/**,src/hooks/**,src/microcomponents/**,src/remotes/**"
---

# Components, pages and hooks

- Functional components with typed props (`type Props`), no `any`; one component per PascalCase file named like the component.
- Use MUI v5 and `@pagopa/mui-italia` components first; style with `sx`/MUI theme, not ad-hoc CSS.
- All user-facing text through `useTranslation()`'s `t()`; add keys to `src/locale/it.ts`.
- API calls go through `src/services/*` (which use `src/api` clients), not directly in presentational components.
- Handle loading, error and empty states using the common-frontend error handling.
- Routing is React Router v5 (`useHistory`, `useLocation`); paths come from `ENV.ROUTES` / `src/routes.tsx`.
- Remember this is a federated remote: keep `src/remotes/RoutingAdmin.tsx` props backward compatible with the host.
- Extract reusable logic to hooks in `src/hooks`; avoid `useEffect` when a derived value or event handler suffices.
- Keep state as close as possible to where it is used; don't store values derivable from props or other state.
- Use semantic HTML and accessibility attributes; stable keys in lists, never the index when order can change.
- Don't add `useMemo`/`useCallback` without a concrete reason.
- If a component mixes unrelated responsibilities, propose splitting it.
- Add or update a test in the nearest `__tests__` folder for behavior changes.
