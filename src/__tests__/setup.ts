// Test setup file to configure environment variables and mocks
import "@testing-library/jest-dom";
import { beforeAll, afterAll, beforeEach, vi } from "vitest";

// Set up environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

// Mock Supabase globally
vi.mock("@/lib/supabase", () => {
  return {
    __esModule: true,
    supabase: {
      auth: {
        getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
        getUser: vi.fn(() => Promise.resolve({ data: { user: { id: "test-user-id", email: "test@example.com" } }, error: null })),
        onAuthStateChange: vi.fn(() => ({
          data: { subscription: { unsubscribe: vi.fn() } },
        })),
        signInWithPassword: vi.fn(() => Promise.resolve({ data: { user: {} }, error: null })),
        signUp: vi.fn(() => Promise.resolve({ data: { user: {} }, error: null })),
        signOut: vi.fn(() => Promise.resolve({ error: null })),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
      })),
    },
  };
});

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock motion/react to avoid issues in JS DOM
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, ...rest } = props;
      return {
        type: 'div',
        props: { ...rest, children },
      };
    },
    aside: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, ...rest } = props;
      return {
        type: 'aside',
        props: { ...rest, children },
      };
    },
  },
  AnimatePresence: ({ children }: any) => children,
}));

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
