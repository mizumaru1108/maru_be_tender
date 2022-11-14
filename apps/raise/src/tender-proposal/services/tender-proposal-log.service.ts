import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, proposal_log } from '@prisma/client';
import { nanoid } from 'nanoid';
import { PrismaService } from '../../prisma/prisma.service';
import { InnerStatus, OutterStatus } from '../../tender-commons/types/proposal';
import { TenderProposalLogRepository } from '../repositories/tender-proposal-log.repository';

@Injectable()
export class TenderProposalLogService {
  constructor(
    private readonly tenderProposalLogRepository: TenderProposalLogRepository,
  ) {}

  async createLog(
    proposal_id: string,
    reviewer_id: string,
    client_user_id: string,
    state: string,
    project_kind: string,
    inner_status: InnerStatus | null,
    outter_status: OutterStatus | null,
    notes?: string | undefined,
    procedures?: string | undefined,
  ): Promise<proposal_log> {
    const createLogPayload: Prisma.proposal_logCreateArgs = {
      data: {
        id: nanoid(),
        proposal: proposal_id,
        reviewer: reviewer_id,
        client_user_data: client_user_id,
        user_type: state,
        project_kind,
        inner_status: inner_status || null,
        outter_status: outter_status || null,
        procedures: procedures || null,
        notes: notes || null,
      } as Prisma.proposal_logCreateInput,
    };
    const createdLogs = await this.tenderProposalLogRepository.createLog(
      createLogPayload,
    );
    return createdLogs;
  }
}
