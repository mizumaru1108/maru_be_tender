import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedResponse } from 'src/commons/dtos/paginated-response.dto';

export const BasePaginationApiOkResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  total?: number,
  options?: ApiResponseOptions,
) =>
  applyDecorators(
    ApiExtraModels(PaginatedResponse, dataDto),
    ApiOkResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponse) },
          {
            properties: {
              data: { type: 'array', items: { $ref: getSchemaPath(dataDto) } },
              // total,
            },
          },
        ],
        // anyOf: { $ref: getSchemaPath(dataDto) },
      },
    }),
  );
