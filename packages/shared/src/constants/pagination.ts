/**
 * Generic pagination constants for API queries and tabular displays.
 */
export const PAGINATION_DEFAULTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
} as const;

export type PaginationDefaults = typeof PAGINATION_DEFAULTS;
