import { ApiProperty } from '@nestjs/swagger';

interface IBaseResponse<T> {
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, any>;
  // errors: [];
}

export class BaseResponse<T> implements IBaseResponse<T> {
  /**
   * http status code [HttpStatus.CREATED, HttpStatus.OK, HttpStatus.BAD_REQUEST, etc.].
   */
  @ApiProperty()
  public statusCode?: number = 200;

  /**
   * message to be returned in the response.
   */
  @ApiProperty()
  public message?: string = 'Success';

  /**
   * data to be returned in the response (generic type). Can be any type of data [Item, Campaign, Project, Comment, etc.]
   */
  @ApiProperty()
  public data?: T;

  /**
   * meta data
   */
  @ApiProperty()
  meta?: Record<string, any>;

  constructor(data?: T, code: number = 200, message: string = 'Success') {
    this.data = data;
    this.statusCode = code;
    this.message = message;
  }
}
