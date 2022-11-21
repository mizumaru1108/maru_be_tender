import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { cheque, payment, Prisma } from '@prisma/client';
import { rootLogger } from '../../logger';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';

@Injectable()
export class TenderProposalPaymentRepository {
  private logger = rootLogger.child({
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
      const prismaError = prismaErrorThrower(error, 'finding payment');
      throw prismaError;
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
      const prismaError = prismaErrorThrower(error, 'updating payment status!');
      throw prismaError;
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
      const prismaError = prismaErrorThrower(error, 'creating many payment!');
      throw prismaError;
    }
  }

  async updatePayment(
    paymentId: string,
    status: string | null,
    chequeData?: Prisma.chequeCreateInput | null,
  ): Promise<payment | [payment, cheque]> {
    this.logger.debug(`updating payment by id of ${paymentId}...`);
    if (chequeData) {
      try {
        const result = await this.prismaService.$transaction([
          this.prismaService.payment.update({
            where: {
              id: paymentId,
            },
            data: {
              status,
            },
          }),
          this.prismaService.cheque.create({
            data: chequeData,
          }),
        ]);
        return result;
      } catch (error) {
        const prismaError = prismaErrorThrower(
          error,
          'updating payment status!',
        );
        throw prismaError;
      }
    } else {
      try {
        const result = await this.prismaService.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            status,
          },
        });
        return result;
      } catch (error) {
        const prismaError = prismaErrorThrower(
          error,
          'updating payment status!',
        );
        throw prismaError;
      }
    }
  }
}
