// clause: Yup.string().required('Procedures is required!'),
// clasification_field: Yup.string().required('Procedures is required!'),
// support_type: Yup.boolean().required('Procedures is required!'),
// closing_report: Yup.boolean().required('Procedures is required!'),
// need_picture: Yup.boolean().required('Procedures is required!'),
// does_an_agreement: Yup.boolean().required('Procedures is required!'),
// support_amount: Yup.number().required('Procedures is required!'),
// number_of_payments: Yup.number().required('Procedures is required!'),
// procedures: Yup.string().required('Procedures is required!'),
// notes: Yup.string().required('Procedures is required!'),
// support_outputs: Yup.string().required('Procedures is required!'),

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class SetupPaymentPayloadDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clause: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clasification_field: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  support_type: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  closing_report: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  need_picture: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  does_an_agreement: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  support_amount: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  number_of_payments: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  procedures: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  notes: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  support_outputs: string;

  @ApiProperty()
  @IsBoolean()
  vat: boolean;

  @ApiProperty()
  @IsNumber()
  vat_percentage: number;

  @ApiProperty()
  @IsBoolean()
  inclu_or_exclu: boolean;
}
