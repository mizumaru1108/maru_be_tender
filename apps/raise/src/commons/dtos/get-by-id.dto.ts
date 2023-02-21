import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetByIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
