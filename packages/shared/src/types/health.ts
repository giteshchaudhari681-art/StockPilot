/**
 * Health check types and contracts representing service health across applications.
 */

/**
 * Valid service health states.
 */
export type HealthStatus = "ok" | "degraded" | "down";

/**
 * Standard contract for health check responses.
 */
export interface HealthCheckResponse {
  status: HealthStatus;
  timestamp?: string;
  version?: string;
}
