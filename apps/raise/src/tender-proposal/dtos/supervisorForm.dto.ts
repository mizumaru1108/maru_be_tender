import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SupervisorForm{

  @ApiProperty({type: String})
  clause: string;
  
  @ApiProperty({type: String})
  classification_field: string;

  @ApiProperty({enum: ['whole',  'partial' ]})
  support_type: ['whole', 'partial' ];

  @ApiProperty({type: Boolean})
  closing_report: boolean;

  @ApiProperty({type: Boolean})
  need_pictures: boolean;

  @ApiProperty({type: Boolean})
  need_an_agreement: boolean;

  @ApiProperty({type: Number})
  support_amount: number;

  @ApiProperty({type: Number})
  num_of_payments: number;

  @ApiProperty({type: String})
  support_outputs: string;

  @ApiProperty({type: Boolean})
  need_vat: boolean;

  @ApiProperty({type: Number})
  @IsOptional()
  percentage_of_vat: number;

  @ApiProperty({type: Boolean})
  @IsOptional()
  inclusive_or_exclusive_of_vat: boolean;
  }