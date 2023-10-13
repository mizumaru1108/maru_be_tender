import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class EditRequestChangeStatusDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  reject_reason?: string;
}
