export interface PaginationModel {
  page: number;
  limit: number;
}

export interface PaginatedModel<T> {
  totalCount: number;
  items: T[];
}
