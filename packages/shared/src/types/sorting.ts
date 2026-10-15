/**
 * Generic sorting types and contracts.
 */

/**
 * Standard sorting direction options.
 */
export type SortDirection = "asc" | "desc";

/**
 * Standard sorting parameters for queries and tables.
 */
export interface SortParams<TField extends string = string> {
  sortBy: TField;
  sortOrder: SortDirection;
}
