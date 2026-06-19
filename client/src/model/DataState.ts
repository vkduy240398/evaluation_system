export interface DataState<T> {
  dataSource?: T;
  dataTable?: T;
  current?: number;
  offset?: number;
  limit?: number;
  total?: number;
  sortBy?: string;
  sortType?: string;
  searchOption?: any;
}
