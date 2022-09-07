import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PayloadImage {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  base64Data: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imageName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imagePrefix: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imageExtension: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentPhoto: string;
}
