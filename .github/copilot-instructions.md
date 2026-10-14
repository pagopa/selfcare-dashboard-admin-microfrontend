# Copilot instructions

SelfCare dashboard admin microfrontend (PagoPA): React 18 + TypeScript, built with Vite and exposed via Module Federation (`@module-federation/vite`, remote `selfcareAdmin`, exposing `./RoutingAdmin`). MUI v5 and `@pagopa/mui-italia`. Node >= 24 (see `.node-version`), yarn 1 (classic).

## Commands

- `yarn start` – dev server; `yarn build:watch` – watch build
- `yarn build` – runs `generate`, then `tsc` and `vite build`
- `yarn typecheck` – `tsc --noEmit`
- `yarn generate` – regenerates API clients into `src/api/generated/{onboarding,party-registry-proxy,b4f-dashboard}` from `openApi/*.json` (do not edit generated files; adjust `openApi/scripts/*` fix scripts instead)
- `yarn test` – Vitest (jsdom); single file: `yarn vitest run src/path/to/file.test.tsx`
- `yarn test:coverage` – type-check plus coverage with thresholds (statements 60, branches 50, functions 53, lines 62)
- `yarn lint` / `yarn lint-autofix`, `yarn prettify`

## Architecture

- `src/remotes` – federated entry points (`RoutingAdmin.tsx`, `RemotePage.tsx`); `src/routes.tsx` – route config (`DASHBOARD_ADMIN_ROUTES`, built from `ENV.ROUTES`).
- `src/pages` – `adminPage`, `onboardingsPage`, `partyDetailPage`, `dashboardRequest`, `confirmPage`, `rejectedPage`; `src/components` – shared UI; `src/hooks`; `src/model`.
- `src/api` – Axios clients (`DashboardApiClient`, `OnboardingApiClient`, `PartyRegistryProxyApiClient`) wrapping generated io-ts clients; `src/services` – one module per domain call group.
- `src/microcomponents` – dashboard integration utils and `mock_dashboard` for local runs.
- `src/redux` – Redux Toolkit store; `src/utils` (constants, `env.ts`, helpers).
- `src/locale` – i18next translations; only Italian (`it.ts`) exists and is registered into the host i18n via `configureI18n` in `locale-utils.ts`. Every user-facing string must go through `t()`.
- Shared auth/session/error handling comes from `@pagopa/selfcare-common-frontend`.

## Environment and mocks

- Config comes from `.env`, `.env.development.local`, `.env.test.local` (template: `.env.local.example`), read via `import.meta.env` (typed in `src/vite-env.d.ts`) and exposed through `ENV` in `src/utils/env.ts`. Add new `VITE_*` variables to `vite-env.d.ts` and `.env`.
- `VITE_API_MOCK_REQUEST_DATA` and similar flags enable mock behavior; API/service mocks live in `src/api/__mocks__` and `src/services/__mocks__`.
- `yarn generate` must be run before type-check/tests; generated clients are gitignored.

## Conventions

- Prettier: 100 cols, semicolons, single quotes, trailing commas `es5`.
- ESLint (`.eslintrc.js`) includes sonarjs, functional and react-hooks rules; keep lint clean.
- Functional components with hooks; Formik for forms; fp-ts/io-ts for decoding API responses.
- Tests live in `__tests__` folders next to the code, using Vitest + React Testing Library; globals are enabled and setup is in `src/setupTests.ts` (+ `src/i18n-test-setup.ts`).
- Never commit secrets.
