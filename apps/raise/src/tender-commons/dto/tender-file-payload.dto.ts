import { ApiProperty } from '@nestjs/swagger';
import {
  IsDataURI,
  IsMimeType,
  IsNotEmpty,
  IsNumber,
  IsString,
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

  /* in bytes */
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  size: number;
}
