import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContactUsInquiryEnum } from '../../types/contact.us.type';

export class ContactUsCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(ContactUsInquiryEnum, {
    message: `Type must be one of ${Object.values(ContactUsInquiryEnum).join(
      ', ',
    )}`,
    each: true,
  })
  inquiry_type: ContactUsInquiryEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  message?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  date_of_visit: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  visit_reason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  proposal_id?: string;
}
