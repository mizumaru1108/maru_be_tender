import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class BannerDeleteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  banner_id: string;
}
