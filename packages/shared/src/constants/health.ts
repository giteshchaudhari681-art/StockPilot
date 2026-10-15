/**
 * Health check status constants representing service operational status.
 */
export const HEALTH_STATUS = {
  OK: "ok",
  DEGRADED: "degraded",
  DOWN: "down",
} as const;

export type HealthStatusValue =
  (typeof HEALTH_STATUS)[keyof typeof HEALTH_STATUS];
