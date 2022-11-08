import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';
import { SearchClientFilterRequest } from '../dtos/requests/search-client-filter-request.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TenderAppointmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async countClient(searchParams: SearchClientFilterRequest): Promise<number> {
    const { clientName } = searchParams;
    let query = {};
    if (clientName) {
      query = {
        ...query,
        entity: {
          startsWith: clientName,
          mode: 'insensitive',
        },
      };
    }
    const result = await this.prismaService.client_data.count({
      where: {
        ...query,
      },
    });
    return result;
  }

  async searchClient(searchParams: SearchClientFilterRequest): Promise<any> {
    const { clientName, page = 1, limit = 10 } = searchParams;
    const offset = (page - 1) * limit;

    let query: Prisma.userWhereInput = {};

    if (clientName) {
      query = {
        ...query,
        client_data: {
          entity: {
            startsWith: clientName,
            mode: 'insensitive',
          },
        },
      };
    }

    const result = await this.prismaService.user.findMany({
      where: {
        ...query,
      },
      select: {
        id: true,
        email: true,
        client_data: {
          select: {
            entity: true,
          },
        },
        schedule: {
          select: {
            day: true,
            start_time: true,
            end_time: true,
          },
        },
      },
      skip: offset,
      take: limit,
    });

    return result;
  }
  create() {
    return 'This action adds a new tenderAppointment';
  }

  findAll() {
    return `This action returns all tenderAppointment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tenderAppointment`;
  }

  update() {}

  remove(id: number) {
    return `This action removes a #${id} tenderAppointment`;
  }
}
