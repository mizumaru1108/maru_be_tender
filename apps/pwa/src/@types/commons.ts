export interface BasePaginateQuery {
  page?: number;
  limit?: number;
}

export interface BasePaginateResponse {
  data?: any[];
  total?: number;
  page?: number;
  limit?: number;
}
