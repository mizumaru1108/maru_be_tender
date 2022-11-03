import { BaseResponse } from '../../../commons/dtos/base-response';

export class ManualPaginatedResponse<T> extends BaseResponse<T> {
  public total?: number;
  public currentPage?: number;
  public limit?: number;
  public nextPage?: number;
  public hasNextPage?: boolean;
  public prevPage?: number;
  public hasPrevPage?: boolean;
  public lastPage?: number;
  public statusCode?: number = 200;

  constructor(
    data: T,
    total: number,
    currentPage: number,
    limit: number,
    nextPage?: number,
    hasNextPage?: boolean,
    prevPage?: number,
    hasPrevPage?: boolean,
    lastPage?: number,
  ) {
    super(data);
    this.total = total;
    this.currentPage = currentPage;
    this.limit = limit;
    this.nextPage = nextPage;
    this.hasNextPage = hasNextPage;
    this.prevPage = prevPage;
    this.hasPrevPage = hasPrevPage;
    this.lastPage = lastPage;
  }
}
