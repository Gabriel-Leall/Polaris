/**
 * Unit tests for integrations server actions:
 * - disconnectIntegration
 * - getActiveIntegrations
 * - fetchGitHubIssues
 */

import "../setup";
import { vi, describe, test, expect, beforeEach } from "vitest";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockFrom = vi.fn();

vi.mock("@/lib/supabase-server", () => ({
  __esModule: true,
  createSupabaseServerClient: vi.fn(async () => ({ from: mockFrom })),
  getServerUser: vi.fn(async () => ({
    id: "test-user-id",
    email: "test@example.com",
  })),
}));

// Crypto mock – default happy path returns a predictable value
vi.mock("@/lib/integrations/crypto", () => ({
  decryptToken: vi.fn((enc: string) => `decrypted:${enc}`),
}));

// Global fetch mock
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Import after mocks are set up
import {
  disconnectIntegration,
  getActiveIntegrations,
  fetchGitHubIssues,
} from "@/app/actions/integrations";
import { getServerUser } from "@/lib/supabase-server";
import { decryptToken } from "@/lib/integrations/crypto";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Creates a Supabase query chain mock where every method returns the chain
 * itself for chaining, and the chain is also a Promise (thenable) that
 * resolves to `finalResult` – mirroring how Supabase JS v2 builders work.
 */
function makeChainedMock(finalResult: any) {
  const promise = Promise.resolve(finalResult);
  const chain: any = {
    // Make the chain awaitable so `await supabase.from(…).select(…).eq(…)` works.
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
    finally: promise.finally.bind(promise),
  };
  // Chainable methods all return the same chain object.
  chain.select = vi.fn(() => chain);
  chain.insert = vi.fn(() => chain);
  chain.update = vi.fn(() => chain);
  chain.delete = vi.fn(() => chain);
  chain.eq = vi.fn(() => chain);
  chain.single = vi.fn(async () => finalResult);
  chain.maybeSingle = vi.fn(async () => finalResult);
  chain.order = vi.fn(async () => finalResult);
  return chain;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("disconnectIntegration", () => {
  beforeEach(() => vi.clearAllMocks());

  test("returns success when deletion succeeds", async () => {
    const chain = makeChainedMock({ data: null, error: null });
    mockFrom.mockReturnValue(chain);

    const result = await disconnectIntegration("github");

    expect(result).toEqual({ success: true });
    expect(mockFrom).toHaveBeenCalledWith("integration_connections");
  });

  test("returns error when user is not authenticated", async () => {
    (getServerUser as any).mockResolvedValueOnce(null);

    const result = await disconnectIntegration("github");

    expect(result).toEqual({ success: false, error: "Unauthorized" });
  });

  test("returns error when database deletion fails", async () => {
    const chain = makeChainedMock({ data: null, error: { message: "DB error" } });
    mockFrom.mockReturnValue(chain);

    const result = await disconnectIntegration("slack");

    expect(result).toEqual({ success: false, error: "Failed to disconnect integration" });
  });
});

describe("getActiveIntegrations", () => {
  beforeEach(() => vi.clearAllMocks());

  test("returns connected integrations for authenticated user", async () => {
    const mockRows = [
      { id: "1", provider: "github", created_at: "2024-01-01", updated_at: "2024-01-01", token_expires_at: null },
      { id: "2", provider: "slack", created_at: "2024-01-01", updated_at: "2024-01-01", token_expires_at: null },
    ];
    const chain = makeChainedMock({ data: mockRows, error: null });
    mockFrom.mockReturnValue(chain);

    const result = await getActiveIntegrations();

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockRows);
  });

  test("returns error when user is not authenticated", async () => {
    (getServerUser as any).mockResolvedValueOnce(null);

    const result = await getActiveIntegrations();

    expect(result).toEqual({ success: false, error: "Unauthorized", data: [] });
  });

  test("returns error when database query fails", async () => {
    const chain = makeChainedMock({ data: null, error: { message: "DB error" } });
    mockFrom.mockReturnValue(chain);

    const result = await getActiveIntegrations();

    expect(result).toEqual({ success: false, error: "Failed to fetch integrations", data: [] });
  });
});

describe("fetchGitHubIssues", () => {
  beforeEach(() => vi.clearAllMocks());

  test("returns issues successfully when integration is connected", async () => {
    const mockIssues = [
      {
        id: 1,
        title: "Issue 1",
        html_url: "https://github.com/owner/repo/issues/1",
        repository: { full_name: "owner/repo" },
        number: 1,
        created_at: "2024-01-01T00:00:00Z",
        state: "open",
      },
    ];

    // single() resolves with token data
    const chain = makeChainedMock(null);
    chain.single = vi.fn(async () => ({
      data: { encrypted_access_token: "encrypted_token" },
      error: null,
    }));
    mockFrom.mockReturnValue(chain);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockIssues,
    });

    const result = await fetchGitHubIssues();

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data![0].title).toBe("Issue 1");
    expect(decryptToken).toHaveBeenCalledWith("encrypted_token");
  });

  test("returns error when user is not authenticated", async () => {
    (getServerUser as any).mockResolvedValueOnce(null);

    const result = await fetchGitHubIssues();

    expect(result).toEqual({ success: false, error: "Unauthorized" });
  });

  test("returns error when GitHub integration is not connected", async () => {
    const chain = makeChainedMock(null);
    chain.single = vi.fn(async () => ({ data: null, error: { message: "No rows" } }));
    mockFrom.mockReturnValue(chain);

    const result = await fetchGitHubIssues();

    expect(result).toEqual({ success: false, error: "GitHub integration not connected" });
  });

  test("returns error and disconnects integration on 401 from GitHub", async () => {
    const chain = makeChainedMock({ data: null, error: null });
    chain.single = vi.fn(async () => ({
      data: { encrypted_access_token: "enc_token" },
      error: null,
    }));
    mockFrom.mockReturnValue(chain);

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({}),
    });

    const result = await fetchGitHubIssues();

    expect(result.success).toBe(false);
    expect(result.error).toContain("Token expired");
    // disconnectIntegration triggers a second DB call
    expect(mockFrom).toHaveBeenCalledWith("integration_connections");
  });

  test("returns error when token decryption fails", async () => {
    const chain = makeChainedMock(null);
    chain.single = vi.fn(async () => ({
      data: { encrypted_access_token: "bad_token" },
      error: null,
    }));
    mockFrom.mockReturnValue(chain);

    (decryptToken as any).mockImplementationOnce(() => {
      throw new Error("Decryption failed");
    });

    const result = await fetchGitHubIssues();

    expect(result).toEqual({ success: false, error: "Failed to decrypt integration token" });
  });

  test("returns error when GitHub API call throws a network error", async () => {
    const chain = makeChainedMock(null);
    chain.single = vi.fn(async () => ({
      data: { encrypted_access_token: "enc_token" },
      error: null,
    }));
    mockFrom.mockReturnValue(chain);

    mockFetch.mockRejectedValueOnce(new Error("Network failure"));

    const result = await fetchGitHubIssues();

    expect(result).toEqual({ success: false, error: "Network error fetching GitHub data" });
  });
});

