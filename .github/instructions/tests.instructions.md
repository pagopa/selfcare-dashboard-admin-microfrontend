---
applyTo: "**/*.test.ts,**/*.test.tsx,src/setupTests.ts,src/i18n-test-setup.ts,src/utils/test-utils.tsx,src/**/__mocks__/**"
---

# Unit test conventions

- Vitest (globals enabled) + React Testing Library; environment is jsdom.
- Tests sit in a `__tests__` folder next to the code under test, named `<Subject>.test.ts(x)`.
- `src/setupTests.ts` loads jest-dom and `src/i18n-test-setup.ts`, which initializes i18n with the real Italian locale. Assert on visible Italian text or roles/labels; prefer `getByRole`/`getByLabelText` over test ids.
- Reuse `src/utils/test-utils.tsx` helpers for rendering with providers.
- API clients and services are mocked via `src/api/__mocks__` and `src/services/__mocks__`; extend them instead of re-mocking.
- Keep tests deterministic: no real timers/network, use `vi.useFakeTimers()` when needed and restore mocks.
- Coverage thresholds are enforced by `yarn test:coverage`; cover new logic.
- Run a single file with `yarn vitest run <path>`.
