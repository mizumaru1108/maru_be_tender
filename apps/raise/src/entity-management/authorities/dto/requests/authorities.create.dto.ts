import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthoritiesCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
