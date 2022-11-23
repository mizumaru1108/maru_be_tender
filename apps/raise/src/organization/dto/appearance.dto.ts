import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';

export class AppearancenDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownerUserId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @ValidateObjectIdDecorator()
  ownerRealmId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  primaryColor: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  secondaryColor: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  logo: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  themesColor: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  usePallete: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  headerAndFooter: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  whyShouldWe: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  accent: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lButton: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lText: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ourStory: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  peopleSay: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mainImageUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secondaryImage: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  eventImagesUrl1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  eventImagesUrl2: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  eventImagesUrl3: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  detailStory1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  detailStory2: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  detailStory3: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  whySupportUs1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  whySupportUs2: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  whySupportUs3: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  favIcon: string;
}