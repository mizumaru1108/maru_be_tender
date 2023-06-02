import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { RegisterFileUpload } from './file-upload.dto';

export class RegisterOrganizationDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  state?: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  selectedIndustry?: string;

  @ApiPropertyOptional()
  organizationMission?: string;

  @ApiPropertyOptional()
  organizationName?: string;

  @ApiPropertyOptional()
  organizationWebsite?: string;

  @ApiPropertyOptional()
  locationOrganization?: string;

  @ApiPropertyOptional()
  imageLogo?: RegisterFileUpload;

  @ApiPropertyOptional()
  useCurrency?: string;

  @ApiPropertyOptional()
  paymentGateway?: string;

  @ApiPropertyOptional()
  timeZone?: string;

  @ApiPropertyOptional()
  domainUrl?: string;

  @ApiPropertyOptional()
  ownerUserId?: string;
}
