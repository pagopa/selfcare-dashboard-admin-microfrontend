import 'vitest';
import '@testing-library/jest-dom';
import './i18n-test-setup';
import { vi, beforeEach } from 'vitest';

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
