/**
 * Generic pagination types and contracts.
 */

/**
 * Standard parameters accepted by paginated endpoints or queries.
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * Metadata describing pagination state in responses.
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages?: number;
}

/**
 * Generic contract for paginated collections.
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}
