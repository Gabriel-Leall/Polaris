/**
 * Error Testing Utilities
 * Provides tools for testing error scenarios and boundary behavior
 */

import { ErrorType, PolarisError } from "./error-handling";
import { errorMonitoring } from "./error-monitoring";

export interface ErrorScenario {
  name: string;
  description: string;
  error: Error;
  shouldRetry: boolean;
  expectedBehavior: string;
}

/**
 * Predefined error scenarios for testing
 */
export const errorScenarios: ErrorScenario[] = [
  {
    name: "Network Timeout",
    description: "Simulates a network request timeout",
    error: new Error("Request timeout exceeded"),
    shouldRetry: true,
    expectedBehavior: "Should show retry button and allow user to retry",
  },
  {
    name: "Database Connection",
    description: "Simulates database connection failure",
    error: new PolarisError(
      ErrorType.DATABASE,
      "Failed to connect to database",
      "DB_CONNECTION_FAILED",
      { host: "localhost", port: 5432 },
      true
    ),
    shouldRetry: true,
    expectedBehavior: "Should show data error fallback with retry option",
  },
  {
    name: "Validation Error",
    description: "Simulates input validation failure",
    error: new PolarisError(
      ErrorType.VALIDATION,
      "Invalid email format",
      "VALIDATION_FAILED",
      { field: "email", value: "invalid-email" },
      false
    ),
    shouldRetry: false,
    expectedBehavior: "Should show validation error without retry option",
  },
  {
    name: "Authentication Required",
    description: "Simulates authentication failure",
    error: new PolarisError(
      ErrorType.AUTHENTICATION,
      "Authentication token expired",
      "AUTH_TOKEN_EXPIRED",
      { tokenAge: 3600 },
      false
    ),
    shouldRetry: false,
    expectedBehavior: "Should redirect to login or show auth error",
  },
  {
    name: "Permission Denied",
    description: "Simulates authorization failure",
    error: new PolarisError(
      ErrorType.AUTHORIZATION,
      "Insufficient permissions to access resource",
      "PERMISSION_DENIED",
      { resource: "admin-panel", requiredRole: "admin" },
      false
    ),
    shouldRetry: false,
    expectedBehavior: "Should show access denied message",
  },
  {
    name: "Component Render Error",
    description: "Simulates React component rendering error",
    error: new Error("Cannot read property of undefined"),
    shouldRetry: true,
    expectedBehavior: "Should show widget error fallback with retry",
  },
  {
    name: "Memory Limit",
    description: "Simulates out of memory error",
    error: new Error("JavaScript heap out of memory"),
    shouldRetry: false,
    expectedBehavior: "Should show critical error and suggest page reload",
  },
  {
    name: "API Rate Limit",
    description: "Simulates API rate limiting",
    error: new PolarisError(
      ErrorType.RATE_LIMIT,
      "Too many requests, please try again later",
      "RATE_LIMIT_EXCEEDED",
      { retryAfter: 60 },
      true
    ),
    shouldRetry: true,
    expectedBehavior: "Should show rate limit message with retry after delay",
  },
];

/**
 * Error testing component for development
 */
export class ErrorTester {
  private static instance: ErrorTester | null = null;

  static getInstance(): ErrorTester {
    if (!ErrorTester.instance) {
      ErrorTester.instance = new ErrorTester();
    }
    return ErrorTester.instance;
  }

  /**
   * Trigger a specific error scenario
   */
  triggerError(scenarioName: string): void {
    const scenario = errorScenarios.find((s) => s.name === scenarioName);
    if (!scenario) {
      throw new Error(`Unknown error scenario: ${scenarioName}`);
    }

    console.warn(`🧪 Triggering test error: ${scenario.name}`);
    console.warn(`📝 Expected behavior: ${scenario.expectedBehavior}`);

    // Add breadcrumb for testing
    errorMonitoring.addBreadcrumb(
      `Triggered test error: ${scenario.name}`,
      "testing",
      "warning",
      { scenario: scenario.name }
    );

    throw scenario.error;
  }

  /**
   * Trigger a random error for chaos testing
   */
  triggerRandomError(): void {
    const randomScenario =
      errorScenarios[Math.floor(Math.random() * errorScenarios.length)];
    this.triggerError(randomScenario.name);
  }

  /**
   * Test error boundary recovery
   */
  testErrorRecovery(
    component: string,
    errorType: string = "Component Render Error"
  ): void {
    console.warn(`🔄 Testing error recovery for ${component}`);

    errorMonitoring.addBreadcrumb(
      `Testing error recovery for ${component}`,
      "testing",
      "info",
      { component, errorType }
    );

    this.triggerError(errorType);
  }

  /**
   * Simulate network-related errors
   */
  simulateNetworkError(type: "timeout" | "offline" | "slow" = "timeout"): void {
    const networkErrors = {
      timeout: new Error("Network request timed out"),
      offline: new Error("Network connection unavailable"),
      slow: new Error("Network request too slow"),
    };

    console.warn(`🌐 Simulating network error: ${type}`);
    throw networkErrors[type];
  }

  /**
   * Simulate database-related errors
   */
  simulateDatabaseError(
    type: "connection" | "query" | "constraint" = "connection"
  ): void {
    const dbErrors = {
      connection: new PolarisError(
        ErrorType.DATABASE,
        "Database connection failed",
        "DB_CONNECTION_ERROR",
        undefined,
        true
      ),
      query: new PolarisError(
        ErrorType.DATABASE,
        "SQL query execution failed",
        "DB_QUERY_ERROR",
        { query: "SELECT * FROM users" },
        false
      ),
      constraint: new PolarisError(
        ErrorType.DATABASE,
        "Database constraint violation",
        "DB_CONSTRAINT_ERROR",
        { constraint: "unique_email" },
        false
      ),
    };

    console.warn(`🗄️ Simulating database error: ${type}`);
    throw dbErrors[type];
  }

  /**
   * Get all available error scenarios
   */
  getAvailableScenarios(): ErrorScenario[] {
    return [...errorScenarios];
  }

  /**
   * Test error monitoring integration
   */
  testErrorMonitoring(): void {
    console.warn("📊 Testing error monitoring integration");

    // Test breadcrumb
    errorMonitoring.addBreadcrumb("Test breadcrumb", "testing", "info");

    // Test event reporting
    errorMonitoring.reportEvent("test_event", {
      testType: "error_monitoring",
      timestamp: new Date().toISOString(),
    });

    // Test error reporting
    const testError = new Error("Test error for monitoring");
    errorMonitoring.reportError(
      testError,
      { componentStack: "TestComponent" },
      {
        component: "ErrorTester",
        action: "testErrorMonitoring",
      }
    );

    console.log("✅ Error monitoring test completed");
  }
}

/**
 * Development-only error testing hooks
 */
export const useErrorTesting = () => {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const tester = ErrorTester.getInstance();

  return {
    triggerError: tester.triggerError.bind(tester),
    triggerRandomError: tester.triggerRandomError.bind(tester),
    testErrorRecovery: tester.testErrorRecovery.bind(tester),
    simulateNetworkError: tester.simulateNetworkError.bind(tester),
    simulateDatabaseError: tester.simulateDatabaseError.bind(tester),
    testErrorMonitoring: tester.testErrorMonitoring.bind(tester),
    getAvailableScenarios: tester.getAvailableScenarios.bind(tester),
  };
};

/**
 * Global error testing utilities (development only)
 */
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  (window as Window & { __errorTester?: ErrorTester }).__errorTester =
    ErrorTester.getInstance();
  console.log("🧪 Error testing utilities available at window.__errorTester");
}
