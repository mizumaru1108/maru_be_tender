import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class TenderDeleteUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;
}
