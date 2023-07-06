import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class DeleteTrackBudgetDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
