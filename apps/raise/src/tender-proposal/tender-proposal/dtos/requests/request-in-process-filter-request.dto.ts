import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';
import {
  IsIn,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RequestInProcessFilterRequest extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(['incoming', 'inprocess'], {
    message: 'type should be incoming / inprocess',
  })
  type?: 'incoming' | 'inprocess';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUUID(4, { message: 'invalid id!' })
  track_id?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    return undefined;
  })
  vat?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  project_name?: string;
}
