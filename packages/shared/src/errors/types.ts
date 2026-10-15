import type { ErrorCode } from "./codes.js";

/**
 * Options used to initialize a base AppError instance.
 */
export interface AppErrorOptions {
  message: string;
  code?: ErrorCode | string | undefined;
  clientMessage?: string | undefined;
  statusCode?: number | undefined;
  isOperational?: boolean | undefined;
  details?: Record<string, unknown> | undefined;
  cause?: unknown;
}

/**
 * Options used to initialize a DomainError instance.
 */
export interface DomainErrorOptions {
  message: string;
  code?: ErrorCode | string | undefined;
  clientMessage?: string | undefined;
  details?: Record<string, unknown> | undefined;
  cause?: unknown;
}

/**
 * Options used to initialize an InfrastructureError instance.
 */
export interface InfrastructureErrorOptions {
  message: string;
  code?: ErrorCode | string | undefined;
  clientMessage?: string | undefined;
  isOperational?: boolean | undefined;
  details?: Record<string, unknown> | undefined;
  cause?: unknown;
}

/**
 * Canonical JSON payload structure returned to API consumers on error.
 */
export interface ErrorResponseEnvelope {
  error: {
    code: string;
    message: string;
    correlationId?: string | undefined;
    details?: Record<string, unknown> | undefined;
    stack?: string | undefined;
  };
}
