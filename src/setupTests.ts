import 'vitest';
import '@testing-library/jest-dom';
import './i18n-test-setup';

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
