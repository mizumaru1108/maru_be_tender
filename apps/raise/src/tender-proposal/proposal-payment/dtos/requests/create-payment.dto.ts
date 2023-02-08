import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ProposalPaymentCreateDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  payment_amount: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  payment_date: Date;
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
