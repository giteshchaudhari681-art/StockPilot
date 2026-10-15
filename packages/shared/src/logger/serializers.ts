/**
 * Safe serializers for error and request objects to prevent secret leakage
 * and circular reference serialization errors.
 */

export interface SafeSerializedError {
  type: string;
  message: string;
  stack?: string;
  code?: string | number;
  [key: string]: unknown;
}

/**
 * Serializes Error instances into a safe, structured representation.
 */
export function serializeError(
  err: unknown,
  includeStack = true,
): SafeSerializedError | unknown {
  if (!(err instanceof Error)) {
    return err;
  }

  const serialized: SafeSerializedError = {
    type: err.name || "Error",
    message: err.message,
  };

  if (
    "code" in err &&
    (typeof err.code === "string" || typeof err.code === "number")
  ) {
    serialized.code = err.code;
  }

  if (includeStack && err.stack) {
    serialized.stack = err.stack;
  }

  return serialized;
}
