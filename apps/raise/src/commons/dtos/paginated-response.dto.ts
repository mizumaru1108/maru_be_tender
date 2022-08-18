import { BaseResponse } from './base-response';

export class PaginatedResponse<T> extends BaseResponse<T> {
  /**
   * Total number of documents in collection that match a query {Number}
   */
  public totalData?: number = 0;

  /**
   * Limit that was used {Number}
   */
  public limit?: number = 10;

  /**
   * Current page number {Number}
   */
  public page?: number | undefined = 1;

  /**
   * Total number of pages. {Number}
   */
  public totalPages?: number = 1;

  /**
   * The starting index/serial/chronological number of first document in current page. {Number}
   * (Eg: if page=2 and limit=10, then pagingCounter will be 11)
   */
  public pagingCounter?: number = 1;

  /**
   * Availability of prev page. {Boolean}
   */
  public hasPrevPage?: boolean = false;

  /**
   * Availability of next page. {Boolean}
   */
  public hasNextPage?: boolean = false;

  /**
   * Previous page number if available or NULL. {Number}
   */
  public prevPage?: number | null | undefined = null;

  /**
   * Next page number if available or NULL. {Number}
   */
  public nextPage?: number | null | undefined = null;

  /**
   * Only if specified or default page/offset values were used {Number}
   */
  public offset?: number | boolean | T | undefined;

  constructor(
    data: T,
    totalData: number,
    limit: number,
    page: number,
    totalPages?: number,
    pagingCounter?: number,
    hasPrevPage?: boolean,
    hasNextPage?: boolean,
    prevPage?: number | null,
    nextPage?: number | null,
    offset?: number | boolean | T | undefined,
  ) {
    super(data);
    this.totalData = totalData;
    this.limit = limit;
    this.page = page;
    this.totalPages = totalPages;
    this.pagingCounter = pagingCounter;
    this.hasPrevPage = hasPrevPage;
    this.hasNextPage = hasNextPage;
    this.prevPage = prevPage;
    this.nextPage = nextPage;
    this.offset = offset;
  }
}
