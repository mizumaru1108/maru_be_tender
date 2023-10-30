import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class ProposalPaymentCreateDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999999999999999999.99)
  payment_amount: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  payment_date: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateProposalPaymentDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => ProposalPaymentCreateDto)
  payments: ProposalPaymentCreateDto[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_id: string;
}
