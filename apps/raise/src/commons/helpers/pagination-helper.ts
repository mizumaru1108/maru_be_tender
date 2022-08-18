import { HttpStatus } from '@nestjs/common';
import { PaginatedResponse } from '../dtos/paginated-response.dto';

export function paginationHelper<T>(
  data: T,
  totalData: number = 1,
  limit: number = 10,
  page: number = 1,
  totalPages: number = 1,
  pagingCounter: number = 1,
  hasPrevPage: boolean = false,
  hasNextPage: boolean = false,
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
