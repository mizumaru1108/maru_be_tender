import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SmsConfigCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  api_key: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user_sender: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;
}
