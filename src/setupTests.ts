import 'vitest';
import '@testing-library/jest-dom';
import './i18n-test-setup';
import { vi, beforeEach } from 'vitest';

const createStorageMock = (): Storage => {
  const storage = new Map<string, string>();

  return {
    get length() {
      return storage.size;
    },
    clear: () => storage.clear(),
    getItem: (key: string) => storage.get(key) ?? null,
    key: (index: number) => Array.from(storage.keys())[index] ?? null,
    removeItem: (key: string) => storage.delete(key),
    setItem: (key: string, value: string) => storage.set(key, value),
  };
};

if (!window.localStorage) {
  Object.defineProperty(window, 'localStorage', {
    value: createStorageMock(),
  });
}

if (!window.sessionStorage) {
  Object.defineProperty(window, 'sessionStorage', {
    value: createStorageMock(),
  });
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
