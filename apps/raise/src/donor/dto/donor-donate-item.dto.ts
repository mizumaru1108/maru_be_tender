import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ValidateObjectId } from '../../commons/decorators/validate-object-id.decorator';
import { PaytabsCurrencyEnum } from '../../libs/payment-paytabs/enums/paytabs-currency-enum';

export class DonorDonateItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  organizationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  itemId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  qty: number;
}
