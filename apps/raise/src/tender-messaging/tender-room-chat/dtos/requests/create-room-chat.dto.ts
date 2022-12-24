import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsUUID } from 'class-validator';

export class CreateRoomChatDto {
  @ApiProperty()
  @IsIn(['INTERNAL', 'EXTERNAL'], {
    message: 'Correspondance type must be INTERNAL or EXTERNAL',
  })
  @IsString()
  correspondance_type: 'INTERNAL' | 'EXTERNAL';

  @ApiProperty()
  @IsString()
  @IsUUID()
  partner_id: string;
}
