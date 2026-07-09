import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    server: {
      deps: {
        inline: ['@pagopa/mui-italia'],
      },
    },
    setupFiles: ['./src/setupTests.ts'],
    exclude: ['**/node_modules/**', 'src/api/**', 'src/locale/**', 'src/services/__mocks__/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.d.ts', 'src/vite-env.d.ts', 'src/api/**', 'src/locale/**', 'src/services/__mocks__/**', 'src/microcomponents/mock_dashboard/**'],
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 53,
        lines: 62,
      },
    },
  },
});
