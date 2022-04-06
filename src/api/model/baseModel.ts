export interface BasicPageParams {
  page?: number;
  pageSize?: number;
}

export interface BasicFetchResult<T> {
  items: T[];
  total: number;
  current: number;
  pages: number;
  pageSize: number;
}
