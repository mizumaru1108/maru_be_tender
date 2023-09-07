import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TenderDeleteUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
