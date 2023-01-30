import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class UploadFilesJsonbDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;
}
