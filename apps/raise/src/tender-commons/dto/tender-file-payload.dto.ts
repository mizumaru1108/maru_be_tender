import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsDataURI,
  IsMimeType,
} from 'class-validator';

export class TenderFilePayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDataURI({
    message: 'Must be a valid base64',
  })
  base64Data: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsMimeType()
  fileExtension: string;
}
