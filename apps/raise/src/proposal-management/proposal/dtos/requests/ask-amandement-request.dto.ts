import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AskAmandementRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  notes: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_id: string;
}
