import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { BannerTypeEnum } from '../../../banners/types/enums/banner.type.enum';
import { BaseFilterRequest } from '../../../commons/dtos/base-filter-request.dto';
import { ContactUsInquiryEnum } from '../../types/contact.us.type';

export class ContactUsFindmanyQueryDto extends BaseFilterRequest {
  @ApiPropertyOptional({
    examples: ['GENERAL', 'VISITATION', 'PROJECT_INQUIRIES'],
  })
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsEnum(ContactUsInquiryEnum, {
    message: `Type must be one of ${Object.values(ContactUsInquiryEnum).join(
      ', ',
    )}`,
    each: true,
  })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.toUpperCase().split(',');
    }
    return value;
  })
  inquiry_type: ContactUsInquiryEnum[];
}
