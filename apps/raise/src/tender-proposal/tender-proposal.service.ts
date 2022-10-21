import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICurrentUser } from '../user/interfaces/current-user.interface';
import { ChangeProposalStateDto } from './dtos/requests/change-proposal-state.dto';

@Injectable()
export class TenderProposalService {
  constructor(private readonly prismaService: PrismaService) {}
  async changeProposalState(
    currentUser: ICurrentUser,
    request: ChangeProposalStateDto,
  ) {
    console.log('currentUser', currentUser);
    console.log('request', request);
    const result = await this.prismaService.project_tracks.findMany();
    console.log('result', result);
    return result;
  }
}
