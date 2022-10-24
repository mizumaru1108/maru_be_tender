import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';

export class UpdateProjectBudgetDto {
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
  @IsNumber()
  @Min(1)
  amount: number | Decimal;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_id: string;
}
