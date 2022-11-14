import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenderProposalRepository {
  constructor(private readonly prismaService: PrismaService) {}
}
