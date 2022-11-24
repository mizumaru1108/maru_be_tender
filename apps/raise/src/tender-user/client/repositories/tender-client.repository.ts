import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { client_data, user_status, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class TenderClientRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async validateStatus(status: string): Promise<user_status | null> {
    try {
      return await this.prismaService.user_status.findUnique({
        where: { id: status },
      });
    } catch (error) {
      console.trace(error);
      throw new InternalServerErrorException(
        'Something when wrong when fetching client status!',
      );
    }
  }

  async findClient(
    passedQuery?: Prisma.client_dataWhereInput,
    selectQuery?: Prisma.client_dataSelect | null | undefined,
  ): Promise<client_data | null> {
    const findFirstArg: Prisma.client_dataFindFirstArgs = {};
    if (passedQuery) findFirstArg.where = passedQuery;
    if (selectQuery) findFirstArg.select = selectQuery;
    try {
      return await this.prismaService.client_data.findFirst(findFirstArg);
    } catch (error) {
      console.trace(error);
      throw new InternalServerErrorException(
        'Something when wrong when fetching client data!',
      );
    }
  }
}
