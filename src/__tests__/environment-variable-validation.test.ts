/**
 * **Feature: polaris-tech-migration, Property 14: Environment variable validation**
 * **Validates: Requirements 8.5**
 *
 * Property-based test to verify that environment variables are validated before use.
 * This ensures the application handles missing or invalid environment variables gracefully.
 */

import * as fc from "fast-check";
import { vi } from "vitest";

// Mock process.env for testing
const originalEnv = process.env;

// Helper function to validate Supabase URL format
function isValidSupabaseUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname.includes("supabase") &&
      parsedUrl.hostname.endsWith(".co")
    );
  } catch {
    return false;
  }
}

// Helper function to validate Supabase anon key format
function isValidSupabaseAnonKey(key: string): boolean {
  // Supabase anon keys are JWT tokens, should be base64-like strings with dots
  return (
    typeof key === "string" &&
    key.length > 100 &&
    key.includes(".") &&
    key.split(".").length === 3
  );
}

// Helper function to validate Gemini API key format
function isValidGeminiApiKey(key: string): boolean {
  // Gemini API keys typically start with specific prefixes and have specific length
  return (
    typeof key === "string" && key.length > 20 && /^[A-Za-z0-9_-]+$/.test(key)
  );
}

// Helper function to create Supabase client with validation
function createSupabaseClientWithValidation(url?: string, key?: string) {
  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }

  if (!isValidSupabaseUrl(url)) {
    throw new Error("Invalid Supabase URL format");
  }

  if (!isValidSupabaseAnonKey(key)) {
    throw new Error("Invalid Supabase anon key format");
  }

  return { url, key, valid: true };
}

// Helper function to validate environment configuration
function validateEnvironmentConfig(env: Record<string, string | undefined>) {
  const errors: string[] = [];

  // Check required Supabase variables
  if (!env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL is required");
  } else if (!isValidSupabaseUrl(env.NEXT_PUBLIC_SUPABASE_URL)) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL has invalid format");
  }

  if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is required");
  } else if (!isValidSupabaseAnonKey(env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY has invalid format");
  }

  // Check optional Gemini API key
  if (env.GEMINI_API_KEY && !isValidGeminiApiKey(env.GEMINI_API_KEY)) {
    errors.push("GEMINI_API_KEY has invalid format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Generators for environment variables
const validSupabaseUrlGenerator = fc.constantFrom(
  "https://abcdefghijklmnop.supabase.co",
  "https://test-project-123.supabase.co",
  "https://my-app-456.supabase.co"
);

const invalidSupabaseUrlGenerator = fc.oneof(
  fc.constant(""),
  fc.constant("http://invalid.com"),
  fc.constant("not-a-url"),
  fc.constant("https://example.com"),
  fc.string({ minLength: 1, maxLength: 20 })
);

const validSupabaseAnonKeyGenerator = fc.constantFrom(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NjA2ODQwMCwiZXhwIjoxOTYxNjQ0NDAwfQ.test-signature-here-with-more-characters-to-make-it-realistic",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFub3RoZXIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NjA2ODQwMCwiZXhwIjoxOTYxNjQ0NDAwfQ.another-test-signature-with-sufficient-length"
);

const invalidSupabaseAnonKeyGenerator = fc.oneof(
  fc.constant(""),
  fc.constant("invalid-key"),
  fc.string({ minLength: 1, maxLength: 50 }),
  fc.constant("short.key")
);

const validGeminiApiKeyGenerator = fc.oneof(
  fc
    .string({ minLength: 25, maxLength: 100 })
    .map((s) => s.replace(/[^A-Za-z0-9_-]/g, "A")),
  fc.constantFrom(
    "AIzaSyDummyKeyForTesting123456789",
    "test-api-key-with-sufficient-length-123"
  )
);

const invalidGeminiApiKeyGenerator = fc.oneof(
  fc.constant(""),
  fc.string({ minLength: 1, maxLength: 15 }),
  fc.constant("invalid key with spaces")
);

describe("Environment Variable Validation", () => {
  beforeEach(() => {
    // Reset process.env before each test
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  test("Property 14: Environment variable validation - valid Supabase URLs are accepted", () => {
    fc.assert(
      fc.property(validSupabaseUrlGenerator, (url: string) => {
        const isValid = isValidSupabaseUrl(url);

        if (!isValid) {
          console.log(`Valid URL rejected: ${url}`);
        }

        return isValid;
      }),
      { numRuns: 100 }
    );
  });

  test("Property 14: Environment variable validation - invalid Supabase URLs are rejected", () => {
    fc.assert(
      fc.property(invalidSupabaseUrlGenerator, (url: string) => {
        const isValid = isValidSupabaseUrl(url);

        if (isValid) {
          console.log(`Invalid URL accepted: ${url}`);
        }

        return !isValid;
      }),
      { numRuns: 100 }
    );
  });

  test("Property 14: Environment variable validation - valid Supabase anon keys are accepted", () => {
    fc.assert(
      fc.property(validSupabaseAnonKeyGenerator, (key: string) => {
        const isValid = isValidSupabaseAnonKey(key);

        if (!isValid) {
          console.log(`Valid key rejected: ${key.substring(0, 50)}...`);
        }

        return isValid;
      }),
      { numRuns: 100 }
    );
  });

  test("Property 14: Environment variable validation - invalid Supabase anon keys are rejected", () => {
    fc.assert(
      fc.property(invalidSupabaseAnonKeyGenerator, (key: string) => {
        const isValid = isValidSupabaseAnonKey(key);

        if (isValid) {
          console.log(`Invalid key accepted: ${key}`);
        }

        return !isValid;
      }),
      { numRuns: 100 }
    );
  });

  test("Property 14: Environment variable validation - valid Gemini API keys are accepted", () => {
    fc.assert(
      fc.property(validGeminiApiKeyGenerator, (key: string) => {
        const isValid = isValidGeminiApiKey(key);

        if (!isValid) {
          console.log(`Valid Gemini key rejected: ${key}`);
        }

        return isValid;
      }),
      { numRuns: 100 }
    );
  });

  test("Property 14: Environment variable validation - invalid Gemini API keys are rejected", () => {
    fc.assert(
      fc.property(invalidGeminiApiKeyGenerator, (key: string) => {
        const isValid = isValidGeminiApiKey(key);

        if (isValid) {
          console.log(`Invalid Gemini key accepted: ${key}`);
        }

        return !isValid;
      }),
      { numRuns: 100 }
    );
  });

  test("Property 14: Environment variable validation - Supabase client creation validates inputs", () => {
    fc.assert(
      fc.property(
        fc.oneof(validSupabaseUrlGenerator, invalidSupabaseUrlGenerator),
        fc.oneof(
          validSupabaseAnonKeyGenerator,
          invalidSupabaseAnonKeyGenerator
        ),
        (url: string, key: string) => {
          const urlValid = isValidSupabaseUrl(url);
          const keyValid = isValidSupabaseAnonKey(key);
          const shouldSucceed = urlValid && keyValid;

          try {
            const client = createSupabaseClientWithValidation(url, key);

            if (!shouldSucceed) {
              console.log(
                `Expected validation to fail for URL: ${url.substring(
                  0,
                  30
                )}..., Key: ${key.substring(0, 30)}...`
              );
              return false;
            }

            return client.valid === true;
          } catch (error) {
            if (shouldSucceed) {
              console.log(
                `Unexpected validation failure for valid inputs: ${error}`
              );
              return false;
            }

            return true; // Expected to fail
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test("Property 14: Environment variable validation - missing required variables are detected", () => {
    fc.assert(
      fc.property(
        fc.record({
          NEXT_PUBLIC_SUPABASE_URL: fc.option(validSupabaseUrlGenerator, {
            nil: undefined,
          }),
          NEXT_PUBLIC_SUPABASE_ANON_KEY: fc.option(
            validSupabaseAnonKeyGenerator,
            { nil: undefined }
          ),
          GEMINI_API_KEY: fc.option(validGeminiApiKeyGenerator, {
            nil: undefined,
          }),
        }),
        (env: Record<string, string | undefined>) => {
          const validation = validateEnvironmentConfig(env);

          const hasRequiredVars = Boolean(
            env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          );
          const shouldBeValid =
            hasRequiredVars &&
            isValidSupabaseUrl(env.NEXT_PUBLIC_SUPABASE_URL!) &&
            isValidSupabaseAnonKey(env.NEXT_PUBLIC_SUPABASE_ANON_KEY!) &&
            (!env.GEMINI_API_KEY || isValidGeminiApiKey(env.GEMINI_API_KEY));

          if (validation.isValid !== shouldBeValid) {
            console.log("Validation mismatch:");
            console.log("Environment:", env);
            console.log("Expected valid:", shouldBeValid);
            console.log("Actual valid:", validation.isValid);
            console.log("Errors:", validation.errors);
          }

          return validation.isValid === shouldBeValid;
        }
      ),
      { numRuns: 100 }
    );
  });

  test("Property 14: Environment variable validation - complete valid configuration passes", () => {
    fc.assert(
      fc.property(
        validSupabaseUrlGenerator,
        validSupabaseAnonKeyGenerator,
        validGeminiApiKeyGenerator,
        (url: string, key: string, geminiKey: string) => {
          const env = {
            NEXT_PUBLIC_SUPABASE_URL: url,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: key,
            GEMINI_API_KEY: geminiKey,
          };

          const validation = validateEnvironmentConfig(env);

          if (!validation.isValid) {
            console.log("Valid configuration rejected:");
            console.log("Errors:", validation.errors);
          }

          return validation.isValid;
        }
      ),
      { numRuns: 100 }
    );
  });

  test("Property 14: Environment variable validation - actual Supabase client import works with valid env", async () => {
    // Test that the actual Supabase client module handles environment validation
    const validUrl = "https://test-project.supabase.co";
    const validKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NjA2ODQwMCwiZXhwIjoxOTYxNjQ0NDAwfQ.test-signature-here-with-more-characters-to-make-it-realistic";

    // Set valid environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = validUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = validKey;

    vi.resetModules();
    await expect(import("@/lib/supabase")).resolves.toBeDefined();
  });

  test("Property 14: Environment variable validation - Supabase client throws on missing env vars", async () => {
    // Test that the actual Supabase client module throws on missing variables
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    vi.resetModules();
    await expect(import("@/lib/supabase")).rejects.toThrow(
      "Missing Supabase environment variables"
    );
  });
});
