import { FIND_QUERY_PAGINATION_CONSTANTS } from '../constants/find-query.constant';
import { LIST_QUERY_PAGINATION_CONSTANTS } from '../constants/list-query.constant';
import { IQueryPagination } from '../interfaces/query.interface';

export function getLimitAndOffsetFromFindQuery(query): {
  limit: number;
  offset: number;
} {
  const limit = query.page_size
    ? parseInt(query.page_size)
    : FIND_QUERY_PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE;
  const offset = query.page_no
    ? (parseInt(query.page_no) - 1) * limit
    : (FIND_QUERY_PAGINATION_CONSTANTS.DEFAULT_PAGE_NO - 1) * limit;
  return { limit, offset };
}

export function getLimitAndOffsetFromListQuery(query): {
  limit: number;
  offset: number;
} {
  const limit = query.page_size
    ? parseInt(query.page_size)
    : LIST_QUERY_PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE;
  const offset = query.page_no
    ? (parseInt(query.page_no) - 1) * limit
    : (LIST_QUERY_PAGINATION_CONSTANTS.DEFAULT_PAGE_NO - 1) * limit;
  return { limit, offset };
}

export function getPaginationObject(limit, offset, total): IQueryPagination {
  const page = offset / limit + 1;
  const page_size = limit;
  const page_count = Math.ceil(total / limit);
  return { page, page_size, page_count, total };
}
