import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenderProposalLogService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProposalLog() {
    console.log('createProposalLog');
  }
}
