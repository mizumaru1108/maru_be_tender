import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { RegisterFileUpload } from 'src/auth/dtos';

// ========================================================

export class OrganizationDto {
  organizationEmail: string;
  name: string;
  address: string;
  contactPhone: string;
  aboutHeading: string;
  aboutBody: string;
  aboutPicture: string;
  isoPhoneCode: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  instagram: string;
  facebook: string;
  twitter: string;
  contactWhatsapp: string;
  latitude: string;
  longitude: string;
  currencyOptions: object;
  defaultLanguage: string;
  campaignLanguage: string;
  selectedLanguage: string[] | [];
  zakatTransaction: boolean;
  zakatCalculator: boolean;
  ownerUserId?: string;
  ownerRealmId?: Types.ObjectId;
  favicon?: string;
}

export class CreateNewOrganization {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ownerUserId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @ApiPropertyOptional()
  @IsOptional()
  selectedIndustry?: string;

  @ApiPropertyOptional()
  @IsOptional()
  organizationMission?: string;

  @ApiPropertyOptional()
  @IsOptional()
  organizationWebsite?: string;

  @ApiPropertyOptional()
  @IsOptional()
  locationOrganization?: string;

  @ApiPropertyOptional()
  @IsOptional()
  useCurrency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  imageLogo?: RegisterFileUpload;
}
