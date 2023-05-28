import { ApiPropertyOptional } from '@nestjs/swagger';
import { GetByUUIDQueryParamDto } from '../../../../commons/dtos/get-by-uuid-query-param.dto';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateBeneficiaryDto extends GetByUUIDQueryParamDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;
}
