import { AppError, ErrorCode } from "@stockpilot/shared";

export interface HttpErrorOptions {
  message?: string;
  code?: string;
  clientMessage?: string;
  details?: Record<string, unknown>;
  cause?: unknown;
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends AppError {
  constructor(options?: HttpErrorOptions | string) {
    const opts = typeof options === "string" ? { message: options } : options;
    const msg = opts?.message ?? "Bad Request";
    super({
      message: msg,
      code: opts?.code ?? ErrorCode.BAD_REQUEST,
      statusCode: 400,
      clientMessage: opts?.clientMessage ?? msg,
      isOperational: true,
      details: opts?.details,
      cause: opts?.cause,
    });
    this.name = "BadRequestError";
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends AppError {
  constructor(options?: HttpErrorOptions | string) {
    const opts = typeof options === "string" ? { message: options } : options;
    const msg = opts?.message ?? "Unauthorized";
    super({
      message: msg,
      code: opts?.code ?? ErrorCode.UNAUTHORIZED,
      statusCode: 401,
      clientMessage: opts?.clientMessage ?? msg,
      isOperational: true,
      details: opts?.details,
      cause: opts?.cause,
    });
    this.name = "UnauthorizedError";
  }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends AppError {
  constructor(options?: HttpErrorOptions | string) {
    const opts = typeof options === "string" ? { message: options } : options;
    const msg = opts?.message ?? "Forbidden";
    super({
      message: msg,
      code: opts?.code ?? ErrorCode.FORBIDDEN,
      statusCode: 403,
      clientMessage: opts?.clientMessage ?? msg,
      isOperational: true,
      details: opts?.details,
      cause: opts?.cause,
    });
    this.name = "ForbiddenError";
  }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends AppError {
  constructor(options?: HttpErrorOptions | string) {
    const opts = typeof options === "string" ? { message: options } : options;
    const msg = opts?.message ?? "Not Found";
    super({
      message: msg,
      code: opts?.code ?? ErrorCode.NOT_FOUND,
      statusCode: 404,
      clientMessage: opts?.clientMessage ?? msg,
      isOperational: true,
      details: opts?.details,
      cause: opts?.cause,
    });
    this.name = "NotFoundError";
  }
}

/**
 * 409 Conflict
 */
export class ConflictError extends AppError {
  constructor(options?: HttpErrorOptions | string) {
    const opts = typeof options === "string" ? { message: options } : options;
    const msg = opts?.message ?? "Conflict";
    super({
      message: msg,
      code: opts?.code ?? ErrorCode.CONFLICT,
      statusCode: 409,
      clientMessage: opts?.clientMessage ?? msg,
      isOperational: true,
      details: opts?.details,
      cause: opts?.cause,
    });
    this.name = "ConflictError";
  }
}

/**
 * 422 Unprocessable Entity
 */
export class UnprocessableEntityError extends AppError {
  constructor(options?: HttpErrorOptions | string) {
    const opts = typeof options === "string" ? { message: options } : options;
    const msg = opts?.message ?? "Unprocessable Entity";
    super({
      message: msg,
      code: opts?.code ?? ErrorCode.UNPROCESSABLE_ENTITY,
      statusCode: 422,
      clientMessage: opts?.clientMessage ?? msg,
      isOperational: true,
      details: opts?.details,
      cause: opts?.cause,
    });
    this.name = "UnprocessableEntityError";
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends AppError {
  constructor(options?: HttpErrorOptions | string) {
    const opts = typeof options === "string" ? { message: options } : options;
    const msg = opts?.message ?? "Internal Server Error";
    super({
      message: msg,
      code: opts?.code ?? ErrorCode.INTERNAL_ERROR,
      statusCode: 500,
      clientMessage: opts?.clientMessage ?? "Internal Server Error",
      isOperational: false,
      details: opts?.details,
      cause: opts?.cause,
    });
    this.name = "InternalServerError";
  }
}

/**
 * 503 Service Unavailable
 */
export class ServiceUnavailableError extends AppError {
  constructor(options?: HttpErrorOptions | string) {
    const opts = typeof options === "string" ? { message: options } : options;
    const msg = opts?.message ?? "Service Unavailable";
    super({
      message: msg,
      code: opts?.code ?? ErrorCode.SERVICE_UNAVAILABLE,
      statusCode: 503,
      clientMessage: opts?.clientMessage ?? "Service Unavailable",
      isOperational: false,
      details: opts?.details,
      cause: opts?.cause,
    });
    this.name = "ServiceUnavailableError";
  }
}
