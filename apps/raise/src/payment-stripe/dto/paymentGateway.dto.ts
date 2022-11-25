import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';

import { Types } from 'mongoose';

export class PaymentGateWayDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  organizationId: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  defaultCurrency: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  createdAt: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  updatedAt: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  payementMethod: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  profileName: string

  @ApiProperty()
  @IsString()
  apiKey: string

  @ApiProperty()
  @IsString()
  clientKey: string

  @ApiProperty()
  @IsString()
  serverKey: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  isActive: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  isDeleted: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  isLiveMode: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  isTestMode: string
}
