/**
 * Generic domain-independent utility types and structural contracts.
 */

/**
 * Represents a value that can be null.
 */
export type Nullable<T> = T | null;

/**
 * Represents a value that can be undefined.
 */
export type Optional<T> = T | undefined;

/**
 * Generic string identifier type.
 */
export type EntityId = string;

/**
 * ISO-8601 formatted date-time string (e.g. "2026-03-30T12:00:00.000Z").
 */
export type ISODateString = string;

/**
 * Structural contract for timestamped entities.
 */
export interface Timestamped {
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
