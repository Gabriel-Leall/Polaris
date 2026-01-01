// Test setup file to configure environment variables and mocks
import "@testing-library/jest-dom";
import { beforeAll, afterAll, beforeEach, vi } from "vitest";

// Set up environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

// Mock localStorage for testing
const storage: Record<string, string> = {};

const localStorageMock = {
  getItem: vi.fn((key: string) => (key in storage ? storage[key] : null)),
  setItem: vi.fn((key: string, value: string) => {
    storage[key] = String(value);
  }),
  removeItem: vi.fn((key: string) => {
    delete storage[key];
  }),
  clear: vi.fn(() => {
    Object.keys(storage).forEach((key) => delete storage[key]);
  }),
  key: vi.fn((index: number) => Object.keys(storage)[index] ?? null),
  get length() {
    return Object.keys(storage).length;
  },
};

// Only define localStorage on window if window exists (browser environment)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });
}

// Make localStorage available globally
Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// Provide a Jest-compatible global for tests that still reference jest.* APIs
Object.defineProperty(globalThis, "jest", {
  value: {
    ...vi,
    fn: vi.fn,
    mock: vi.mock,
    spyOn: vi.spyOn,
    clearAllMocks: vi.clearAllMocks,
    resetAllMocks: vi.resetAllMocks,
    restoreAllMocks: vi.restoreAllMocks,
  },
  writable: true,
  configurable: true,
});

beforeEach(() => {
  localStorageMock.clear();
});

// Mock console methods to reduce noise in tests and silence Zustand persist warnings
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.log = vi.fn();
  console.error = vi.fn();
  console.warn = vi.fn((message: string) => {
    // Silence Zustand persist middleware warnings in tests
    if (message.includes('[zustand persist middleware]')) {
      return;
    }
    originalConsoleWarn(message);
  });
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
