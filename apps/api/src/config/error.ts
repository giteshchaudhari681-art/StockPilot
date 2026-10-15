import { AppError, ErrorCode } from "@stockpilot/shared";

export interface ConfigurationIssue {
  variable: string;
  reason: string;
  received?: unknown;
  isSensitive?: boolean;
}

/**
 * Dedicated error thrown when application configuration validation fails at startup.
 * Aggregates all detected configuration issues into a formatted, actionable diagnostic error.
 */
export class ConfigurationError extends AppError {
  readonly issues: readonly ConfigurationIssue[];

  constructor(issues: ConfigurationIssue[]) {
    const formattedIssues = issues
      .map((issue) => {
        const receivedStr = issue.isSensitive
          ? "[REDACTED]"
          : issue.received === undefined
            ? "undefined"
            : JSON.stringify(issue.received);
        return `  - ${issue.variable}: ${issue.reason} (received: ${receivedStr})`;
      })
      .join("\n");

    const message = `Application configuration validation failed with ${issues.length} issue(s):\n${formattedIssues}`;

    super({
      message,
      code: ErrorCode.INTERNAL_ERROR,
      statusCode: 500,
      clientMessage: "Internal Configuration Error",
      isOperational: false,
      details: {
        issueCount: issues.length,
        variables: issues.map((i) => i.variable),
      },
    });

    this.name = "ConfigurationError";
    this.issues = Object.freeze([...issues]);
  }
}
