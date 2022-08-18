import { BaseResponse } from '../dtos/base-response';

export function baseResponseHelper<T>(
  statusCode = 200,
  message = 'Success',
  data?: T,
): BaseResponse<T> {
  const baseResponse = new BaseResponse<T>();
  baseResponse.statusCode = statusCode;
  baseResponse.data = data;
  baseResponse.message = message;

  return {
    statusCode: baseResponse.statusCode,
    message: baseResponse.message,
    data: baseResponse.data,
  };
}
