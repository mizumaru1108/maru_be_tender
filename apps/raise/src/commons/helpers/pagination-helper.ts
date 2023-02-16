import { HttpStatus } from '@nestjs/common';
import { PaginatedResponse } from '../dtos/paginated-response.dto';

export function paginationHelper<T>(
  data: T,
  totalData = 1,
  limit = 10,
  page = 1,
  totalPages = 1,
  pagingCounter = 1,
  hasPrevPage = false,
  hasNextPage = false,
  prevPage: number | null | undefined = null,
  nextPage: number | null | undefined = null,
  statusCode: number = HttpStatus.OK,
  message = 'Success',
  offset?: number | boolean | T | undefined,
): PaginatedResponse<T> {
  const paginatedResponse = new PaginatedResponse<T>(
    data,
    totalData,
    limit,
    page,
    totalPages,
    pagingCounter,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    offset,
  );
  paginatedResponse.message = message;
  paginatedResponse.statusCode = statusCode;

  return {
    statusCode: statusCode,
    message: message,
    data: data,
    totalData: totalData,
    limit: limit,
    page: page,
    totalPages: totalPages,
    pagingCounter: pagingCounter,
    hasPrevPage: hasPrevPage,
    hasNextPage: hasNextPage,
    prevPage: prevPage,
    nextPage: nextPage,
    offset: offset,
  };
}
