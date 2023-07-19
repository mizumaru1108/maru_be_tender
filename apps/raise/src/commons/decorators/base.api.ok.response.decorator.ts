import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseResponse } from 'src/commons/dtos/base-response';

export const BaseApiOkResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  type: 'object' | 'array' = 'object',
  options?: ApiResponseOptions,
) =>
  applyDecorators(
    ApiExtraModels(BaseResponse, dataDto),
    ApiOkResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponse) },
          {
            properties: {
              data:
                type === 'array'
                  ? { type: type, items: { $ref: getSchemaPath(dataDto) } }
                  : { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
        // anyOf: { $ref: getSchemaPath(dataDto) },
      },
    }),
  );
