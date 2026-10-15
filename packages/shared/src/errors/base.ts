import { ErrorCode } from "./codes.js";
import type {
  AppErrorOptions,
  DomainErrorOptions,
  InfrastructureErrorOptions,
} from "./types.js";

/**
 * Base Application Error class for StockPilot.
 * Establishes typed error classification, operational distinction, and safe client messaging.
 */
export class AppError extends Error {
  readonly code: string;
  readonly clientMessage: string;
  readonly statusCode: number;
  readonly isOperational: boolean;
  readonly details?: Record<string, unknown> | undefined;
  override readonly cause?: unknown;

  constructor(options: AppErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = this.constructor.name;
    this.code = options.code ?? ErrorCode.INTERNAL_ERROR;
    this.statusCode = options.statusCode ?? 500;
    this.isOperational = options.isOperational ?? true;
    this.clientMessage =
      options.clientMessage ??
      (this.statusCode >= 500 ? "Internal Server Error" : options.message);
    this.details = options.details;
    this.cause = options.cause;

    // Maintain accurate prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Domain Error represents violations of business rules or domain invariants.
 * Strictly decoupled from Express, HTTP transports, and databases.
 */
export class DomainError extends AppError {
  constructor(options: DomainErrorOptions | string) {
    const opts = typeof options === "string" ? { message: options } : options;
    super({
      message: opts.message,
      code: opts.code ?? ErrorCode.DOMAIN_RULE_VIOLATION,
      statusCode: 422,
      clientMessage: opts.clientMessage ?? opts.message,
      isOperational: true,
      details: opts.details,
      cause: opts.cause,
    });
    this.name = "DomainError";
  }
}

/**
 * Infrastructure Error represents technical dependency or third-party service failures.
 * Preserves internal diagnostic information while protecting clients from sensitive infrastructure leaks.
 */
export class InfrastructureError extends AppError {
  constructor(options: InfrastructureErrorOptions | string) {
    const opts = typeof options === "string" ? { message: options } : options;
    super({
      message: opts.message,
      code: opts.code ?? ErrorCode.INFRASTRUCTURE_ERROR,
      statusCode: 503,
      clientMessage:
        opts.clientMessage ?? "A service dependency failure occurred",
      isOperational: opts.isOperational ?? false,
      details: opts.details,
      cause: opts.cause,
    });
    this.name = "InfrastructureError";
  }
}
