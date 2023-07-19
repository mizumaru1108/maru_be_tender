import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';

import { Types } from 'mongoose';
import { ZakatLogDto } from 'src/zakat/dto/zakat_log.dto';
import { PaytabsPaymentResultModel } from 'src/libs/paytabs/models/paytabs-payment-result.model';
import { PaytabsPaymentInfoModel } from 'src/libs/paytabs/models/paytabs-payment-info.model';
import { PaytabsCustomerDetailsModel } from 'src/libs/paytabs/models/paytabs-customer-details.model';
import { Type } from 'class-transformer';

export class PaymentPaytabsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  organizationId: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @ValidateObjectIdDecorator()
  campaignId?: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  donorId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  total_amount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  success_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cancel_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  price?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  quantity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isEmailChecklist?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  paymentMethodType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  extraAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  zakatLogs?: Array<ZakatLogDto>;

  @ApiPropertyOptional()
  @IsOptional()
  campaignTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataBasketDto)
  data_basket?: DataBasketDto[];
}

export class DataBasketDto {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  organizationId: Types.ObjectId;
  @ApiProperty()
  amount: number;
}
export class PaymentPaytabsCallbackDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tran_ref: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cart_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cart_description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cart_currency: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cart_amount: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tran_currency: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tran_total: string;

  @ApiPropertyOptional()
  @IsOptional()
  payment_result: PaytabsPaymentResultModel;

  @ApiPropertyOptional()
  @IsOptional()
  payment_info: PaytabsPaymentInfoModel;

  @ApiPropertyOptional()
  @IsOptional()
  customer_details?: PaytabsCustomerDetailsModel;

  @ApiPropertyOptional()
  @IsOptional()
  shipping_details?: PaytabsCustomerDetailsModel;
}
