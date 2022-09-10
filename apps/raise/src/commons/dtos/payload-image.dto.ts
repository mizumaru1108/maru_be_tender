import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, IsOptional } from 'class-validator';

export class PayloadImage {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  base64Data: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  imageName: string;

  /**
   * ![Deprecated] NOT REASONABLE TO USE THIS
   */
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  imagePrefix?: string;

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

  /**
   * ![Deprecated] NOT REASONABLE TO USE THIS
   */
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  currentPhoto?: string;
}
