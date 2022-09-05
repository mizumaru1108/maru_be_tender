import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ValidateObjectId } from '../../commons/decorators/validate-object-id.decorator';
import { ICurrentUser } from '../../user/interfaces/current-user.interface';
import { DonorDonationDetailsDto } from './donor-donation-details.dto';

export class DonorDonateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  organizationId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  stripeSuccessUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  stripeCancelUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  user?: ICurrentUser;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  donationDetails: DonorDonationDetailsDto[];
}
