import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, IsOptional } from 'class-validator';

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
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[.][^.]+/, {
    message: 'Must start with "."',
  })
  imageExtension: string;
}
