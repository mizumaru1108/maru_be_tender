import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999999999999999999.99)
  amount: number;
}
