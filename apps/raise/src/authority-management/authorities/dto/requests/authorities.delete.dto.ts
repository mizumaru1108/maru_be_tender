import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthoritiesDeleteDto {
  @ApiProperty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  authority_id: string[];
}
