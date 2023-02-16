import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { proposal } from '@prisma/client';
import { CommonNotifMapperResponse } from '../../../../tender-commons/dto/common-notif-mapper-response.dto';

export class UpdateMyProposalResponseDto {
  @ApiProperty()
  proposal: proposal;

  @ApiPropertyOptional()
  notif?: CommonNotifMapperResponse;
}
