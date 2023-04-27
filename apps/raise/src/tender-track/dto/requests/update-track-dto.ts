import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTrackDto } from './create-track.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;
}
