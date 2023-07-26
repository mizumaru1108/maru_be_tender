import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AdvertisementDeleteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  advertisement_id: string;
}
