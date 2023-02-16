import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray } from 'class-validator';
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

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  selectedLanguage: string[];
}
