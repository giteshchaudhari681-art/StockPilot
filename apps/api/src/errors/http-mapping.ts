import {
  AppError,
  ErrorCode,
  type ErrorResponseEnvelope,
} from "@stockpilot/shared";

export interface MappedErrorResult {
  statusCode: number;
  responseBody: ErrorResponseEnvelope;
  logLevel: "error" | "warn" | "info";
}

/**
 * Maps any error (application, domain, infrastructure, or unexpected runtime error)
 * to an appropriate HTTP status code, standardized JSON response envelope, and logging level.
 *
 * Enforces production security by ensuring internal error messages, stack traces,
 * credentials, and infrastructure specifics are never exposed to API consumers.
 */
export function mapErrorToHttpResponse(
  err: unknown,
  correlationId?: string,
  nodeEnv: string = "production",
): MappedErrorResult {
  // 1. Known AppError instances (including DomainError, InfrastructureError, HttpErrors)
  if (err instanceof AppError) {
    const isClientError = err.statusCode >= 400 && err.statusCode < 500;
    const logLevel = err.isOperational && isClientError ? "warn" : "error";

    const responseBody: ErrorResponseEnvelope = {
      error: {
        code: err.code,
        message: err.clientMessage,
        ...(correlationId ? { correlationId } : {}),
        ...(err.details ? { details: err.details } : {}),
        ...(nodeEnv === "development" && err.stack ? { stack: err.stack } : {}),
      },
    };

    return {
      statusCode: err.statusCode,
      responseBody,
      logLevel,
    };
  }

  // 2. Express JSON parse error (SyntaxError with status 400)
  if (
    err instanceof SyntaxError &&
    "status" in err &&
    typeof (err as { status: unknown }).status === "number" &&
    (err as { status: number }).status === 400
  ) {
    const responseBody: ErrorResponseEnvelope = {
      error: {
        code: ErrorCode.BAD_REQUEST,
        message: "Malformed JSON payload in request body",
        ...(correlationId ? { correlationId } : {}),
        ...(nodeEnv === "development" && err.stack ? { stack: err.stack } : {}),
      },
    };

    return {
      statusCode: 400,
      responseBody,
      logLevel: "warn",
    };
  }

  // 3. Unexpected, unclassified runtime exceptions (fallback 500)
  const isDev = nodeEnv === "development";
  const errObj = err instanceof Error ? err : new Error(String(err));

  const responseBody: ErrorResponseEnvelope = {
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message: "Internal Server Error",
      ...(correlationId ? { correlationId } : {}),
      ...(isDev && errObj.stack ? { stack: errObj.stack } : {}),
    },
  };

  return {
    statusCode: 500,
    responseBody,
    logLevel: "error",
  };
}
