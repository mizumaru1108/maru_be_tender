import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsBoolean,
  IsString,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { UpdateImagePayload } from '../../commons/dtos/update-image-payload.dto';
import { PayloadContentLanguage } from '../../commons/dtos/payload-content-language.dto';
import { CampaignCreateEditBaseDto } from './campaign-create-edit-base.dto';

export class CampaignUpdateDto extends CampaignCreateEditBaseDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateImagePayload)
  updatedImage: UpdateImagePayload[];

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
