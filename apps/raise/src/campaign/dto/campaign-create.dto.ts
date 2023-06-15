import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';
import { PayloadImage } from '../../commons/dtos/payload-image.dto';
import { PayloadContentLanguage } from '../../commons/dtos/payload-content-language.dto';
import { CampaignCreateEditBaseDto } from './campaign-create-edit-base.dto';

export class CampaignCreateDto extends CampaignCreateEditBaseDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PayloadImage)
  images: PayloadImage[];

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PayloadContentLanguage)
  contentLanguage: PayloadContentLanguage[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  purposeDonation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  quickDonateEnabled?: boolean;
}
