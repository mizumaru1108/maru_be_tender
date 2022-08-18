import { ApiProperty } from '@nestjs/swagger';

interface IBaseResponse<T> {
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, any>;
  // errors: [];
}

export class BaseResponse<T> implements IBaseResponse<T> {
  @ApiProperty()
  public message?: string = 'Success';
  @ApiProperty()
  public statusCode?: number = 200;
  @ApiProperty()
  public data?: T;
  @ApiProperty()
  meta?: Record<string, any>;

  constructor(data?: T, code: number = 200, message: string = 'Success') {
    this.statusCode = code;
    this.data = data;
    this.message = message;
  }
}
