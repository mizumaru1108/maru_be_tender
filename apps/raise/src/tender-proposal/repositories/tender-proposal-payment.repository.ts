import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { payment, Prisma, proposal_log } from '@prisma/client';
import { rootLogger } from '../../logger';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenderProposalPaymentRepository {
  private logger = rootLogger.child({
    logger: TenderProposalPaymentRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async findPaymentById(id: string) {
    try {
      return await this.prismaService.payment.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updatePaymentStatus(
    paymentId: string,
    paymentStatus: string | null,
  ): Promise<payment | null> {
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
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

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

  async updatePayment(
    paymentId: string,
    status: string | null,
    chequeData?: Prisma.chequeCreateInput | null,
  ) {
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
        console.log(error);
        this.logger.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new InternalServerErrorException(
            `Something went wrong, when updating payment's status, (Prisma: ${error.code})`,
          );
        } else {
          throw new InternalServerErrorException(
            "Something went wrong, when updating payment's status",
          );
        }
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
        this.logger.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new InternalServerErrorException(
            'Prisma Eror Code: ' + error.code,
            error.message,
          );
        } else {
          throw new InternalServerErrorException(
            "Something went wrong, when updating payment's status",
          );
        }
      }
    }
  }
}
