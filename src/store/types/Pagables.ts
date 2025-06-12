// Generic paged API response, reusable for all paginated data
export interface PagableResponse<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: SortInfo;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// Represents pagination sort information
export interface SortInfo {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

// Represents pageable information for the API response
export interface Pageable {
  sort: SortInfo;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}
