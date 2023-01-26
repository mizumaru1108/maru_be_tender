import { ApiProperty } from '@nestjs/swagger';
import { proposal_follow_up, proposal, user } from '@prisma/client';

export class RawCreateFollowUpDto {
  @ApiProperty()
  data: proposal_follow_up & {
    proposal: proposal & {
      user: user;
      supervisor: user | null;
      project_manager: user | null;
    };
    user: user;
  };
}
