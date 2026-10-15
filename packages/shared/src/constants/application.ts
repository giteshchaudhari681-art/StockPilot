/**
 * StockPilot application-level metadata constants.
 * Neutral, domain-independent application descriptors.
 */
export const APP_METADATA = {
  NAME: "StockPilot",
  VERSION: "0.1.0",
} as const;

export type AppMetadata = typeof APP_METADATA;
