import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ValidateObjectId } from '../../commons/decorators/validate-object-id.decorator';
import { User } from '../../user/schema/user.schema';
import { DonorDonationDetailsDto } from './donor-donation-details.dto';

export class DonorDonateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  organizationId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  stripeSuccessUrl: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  stripeCancelUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  user?: User;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  donationDetails: DonorDonationDetailsDto[];
}
