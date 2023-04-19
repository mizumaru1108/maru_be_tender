import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateProjectBudgetDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clause: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  explanation: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999999999999999999.99)
  @IsNotEmpty()
  amount: number;
}
