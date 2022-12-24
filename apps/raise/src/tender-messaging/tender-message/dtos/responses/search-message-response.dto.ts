import { ApiProperty } from '@nestjs/swagger';
import { message } from '@prisma/client';
import { MessageGroup } from '../../interfaces/message-group';

export class SearchMessageResponseDto {
  @ApiProperty()
  logs: string;

  @ApiProperty()
  messages: message[] | [];

  @ApiProperty()
  grouped: MessageGroup[] | [];
}
