import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ClientFieldCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
