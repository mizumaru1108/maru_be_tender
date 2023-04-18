import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { proposal } from '@prisma/client';
import { CommonNotificationMapperResponse } from '../../../../tender-commons/dto/common-notification-mapper-response.dto';

export class UpdateMyProposalResponseDto {
  @ApiProperty()
  proposal: proposal;

  @ApiPropertyOptional()
  notif?: CommonNotificationMapperResponse;
}
