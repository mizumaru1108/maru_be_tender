import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, proposal_log } from '@prisma/client';
import { rootLogger } from '../../logger';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenderProposalPaymentRepository {
  private logger = rootLogger.child({
    logger: TenderProposalPaymentRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async createManyPayment(createManyPayload: Prisma.paymentCreateManyArgs) {
    try {
      const result = await this.prismaService.payment.createMany(
        createManyPayload,
      );
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
