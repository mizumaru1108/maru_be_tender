import { ApiProperty } from '@nestjs/swagger';
import { IsDataURI, IsNotEmpty, IsString, Matches } from 'class-validator';

export class PayloadImage {
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
  @Matches(/^[.][^.]+/, {
    message: 'Must start with "."',
  })
  imageExtension: string;
}
