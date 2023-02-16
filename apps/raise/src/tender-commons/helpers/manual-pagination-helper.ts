import { HttpStatus } from '@nestjs/common';
import { ManualPaginatedResponse } from './manual-paginated-response.dto';

export function manualPaginationHelper<T>(
  data: T,
  total = 1,
  page = 1,
  limit = 10,
  statusCode: number = HttpStatus.OK,
  message = 'Success',
): ManualPaginatedResponse<T> {
  const lastPage = Math.ceil(total / limit);
  const nextPage = page + 1;
  const hasNextPage = page < lastPage;
  const prevPage = page - 1;
  const hasPrevPage = page > 1;

  const paginatedResponse = new ManualPaginatedResponse<T>(
    data,
    total,
    page,
    limit,
    nextPage,
    hasNextPage,
    prevPage,
    hasPrevPage,
  );
  paginatedResponse.message = message;
  paginatedResponse.statusCode = statusCode;

  return {
    statusCode: statusCode,
    message: message,
    data: data,
    total: total,
    currentPage: page,
    limit: limit,
    nextPage: nextPage,
    hasNextPage: hasNextPage,
    prevPage: prevPage,
    hasPrevPage: hasPrevPage,
  };
}
