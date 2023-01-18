import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { cheque, payment, Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { TenderAppRole } from '../../tender-commons/types';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';

@Injectable()
export class TenderProposalPaymentRepository {
  private readonly logger = ROOT_LOGGER.child({
    logger: TenderProposalPaymentRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async findPaymentById(id: string): Promise<payment | null> {
    this.logger.debug(`finding payment by id of ${id}... `);
    try {
      return await this.prismaService.payment.findUnique({
        where: { id },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalPaymentRepository.name,
        'findPaymentById error details: ',
        'finding payment!',
      );
      throw theError;
    }
  }

  async updatePaymentStatus(
    paymentId: string,
    paymentStatus: string | null,
  ): Promise<payment | null> {
    this.logger.debug(`updating payment by id of ${paymentId}...`);
    try {
      return await this.prismaService.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: paymentStatus,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalPaymentRepository.name,
        'updatePaymentStatus error details: ',
        'updating payment status!',
      );
      throw theError;
    }
  }

  async createManyPayment(createManyPayload: Prisma.paymentCreateManyArgs) {
    this.logger.debug(`creating many payment...`);
    try {
      const result = await this.prismaService.payment.createMany(
        createManyPayload,
      );
      return result;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalPaymentRepository.name,
        'createManyPayment error details: ',
        'creating payment!',
      );
      throw theError;
    }
  }

  async updatePayment(
    paymentId: string,
    status: string | null,
    reviewerId: string,
    choosenRole: TenderAppRole,
    chequeData?: Prisma.chequeCreateInput | null,
  ) {
    this.logger.debug(`updating payment by id of ${paymentId}...`);
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          const payment = await prisma.payment.update({
            where: {
              id: paymentId,
            },
            data: {
              status,
            },
          });

          let cheque: cheque | null = null;
          if (chequeData) {
            cheque = await prisma.cheque.create({
              data: chequeData,
            });
          }

          const logs = await prisma.proposal_log.create({
            data: {
              id: nanoid(),
              proposal_id: payment.proposal_id,
              action: status,
              reviewer_id: reviewerId,
              state: choosenRole,
            },
          });

          return {
            payment,
            cheque,
            logs,
          };
        },
        { maxWait: 50000, timeout: 150000 },
      );
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalPaymentRepository.name,
        'createManyPayment error details: ',
        'updating payment status!',
      );
      throw theError;
    }
  }
}
