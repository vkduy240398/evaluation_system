export interface ConditionSearchPaging {
  offset: number;
  limit: number;
  sortBy: string;
  sortType: string;
  current: number;
  search?: boolean;
}
