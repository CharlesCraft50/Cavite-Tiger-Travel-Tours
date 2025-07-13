export type PaginationLinks = {
  url: string | null;
  label: string;
  active: boolean;
};

export type Paginated<T> = {
  data: T[];
  current_page: number;
  from: number | null;
  last_page: number;
  links: PaginationLinks[];
  per_page: number;
  to: number | null;
  total: number;
};