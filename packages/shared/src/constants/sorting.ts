/**
 * Standard sorting direction constants.
 */
export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type SortOrderValue = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];
