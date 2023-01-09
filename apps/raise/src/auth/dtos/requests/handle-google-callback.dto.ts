import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class HandleGoogleCallbackDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}
