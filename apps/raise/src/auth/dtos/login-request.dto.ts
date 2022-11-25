import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  loginId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
