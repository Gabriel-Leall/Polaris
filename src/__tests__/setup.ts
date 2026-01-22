// Test setup file to configure environment variables and mocks
import "@testing-library/jest-dom";
import { beforeAll, afterAll, beforeEach, vi } from "vitest";

// Set up environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

// Polyfill JSDOM for Bun test runner if environment is not set up
import { JSDOM } from "jsdom";
if (typeof window === "undefined") {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost",
  });
  const globalAny = global as any;
  globalAny.window = dom.window;
  globalAny.document = dom.window.document;
  globalAny.navigator = dom.window.navigator;
}

// Mock Supabase globally (browser client)
// NOTE: Many tests validate that operations call `supabase.from(<table>)` and
// then chain query methods. We provide a chainable mock and override it per-test
// when needed.
const createSupabaseQueryMock = () => {
  const q: any = {};
  q.select = vi.fn(() => q);
  q.insert = vi.fn(() => q);
  q.update = vi.fn(() => q);
  q.delete = vi.fn(() => q);
  q.eq = vi.fn(() => q);
  q.single = vi.fn(async () => ({ data: { id: "test-id" }, error: null }));
  q.maybeSingle = vi.fn(async () => ({ data: null, error: null }));
  q.limit = vi.fn(() => q);
  q.order = vi.fn(() => q);
  q.range = vi.fn(() => q);
  return q;
};

const supabaseQueryMock = createSupabaseQueryMock();

// Provide a small but structurally valid row for user_preferences so that
// server actions that map DB rows (and tests asserting specific fields) work
// even when a test does not override the Supabase mock.
const defaultUserPreferencesRow = {
  id: "prefs-id",
  user_id: "test-user-id",
  theme: "dark",
  focus_duration: 25,
  break_duration: 5,
  zen_mode_enabled: false,
  sidebar_collapsed: false,
  notion_api_key: null,
  notion_database_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const __supabaseMock = {
  query: supabaseQueryMock,
  reset() {
    // Reset call history for all known fns
    for (const v of Object.values(this.query)) {
      if (typeof v === "function" && "mockClear" in v) (v as any).mockClear();
    }
    this.from.mockClear();
    for (const v of Object.values(this.auth)) {
      if (typeof v === "function" && "mockClear" in v) (v as any).mockClear();
    }
  },
  auth: {
    getSession: vi.fn(async () => ({ data: { session: null }, error: null })),
    getUser: vi.fn(async () => ({
      data: { user: { id: "test-user-id", email: "test@example.com" } },
      error: null,
    })),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
    signInWithPassword: vi.fn(async () => ({
      data: { user: {} },
      error: null,
    })),
    signUp: vi.fn(async () => ({ data: { user: {} }, error: null })),
    signOut: vi.fn(async () => ({ error: null })),
  },
  from: vi.fn((table?: string) => {
    // Ensure `.single()` returns something useful for user_preferences paths by default.
    if (table === "user_preferences") {
      (supabaseQueryMock.single as any).mockResolvedValue({
        data: defaultUserPreferencesRow,
        error: null,
      });
    }
    return supabaseQueryMock;
  }),
};

vi.mock("@/lib/supabase", () => {
  return {
    __esModule: true,
    supabase: __supabaseMock,
  };
});

// Mock Supabase server client factory used by Server Actions
vi.mock("@/lib/supabase-server", () => {
  return {
    __esModule: true,
    createSupabaseServerClient: vi.fn(async () => __supabaseMock),
    getServerUser: vi.fn(async () => ({
      id: "test-user-id",
      email: "test@example.com",
    })),
  };
});

// Mock Next.js request-scoped APIs used by server actions (cookies/headers)
vi.mock("next/headers", () => {
  const store = new Map<string, { name: string; value: string }>();
  return {
    cookies: () => ({
      get: (name: string) => store.get(name),
      set: ({ name, value }: { name: string; value: string }) => {
        store.set(name, { name, value });
      },
      delete: (name: string) => {
        store.delete(name);
      },
    }),
    headers: () => new Map<string, string>(),
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
        type: "div",
        props: { ...rest, children },
      };
    },
    aside: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, ...rest } = props;
      return {
        type: "aside",
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
if (typeof window !== "undefined") {
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
  __supabaseMock.reset();
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
    if (message.includes("[zustand persist middleware]")) {
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
