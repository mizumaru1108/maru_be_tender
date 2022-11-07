import { Injectable } from '@nestjs/common';
import { client_data } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { SearchClientFilterRequest } from '../dtos/requests/search-client-filter-request.dto';

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
    // prisma run query on client_data table where like clientName%
    //me: why this query return null value at the user copilot ?
    //copilot:
    const result = await this.prismaService.client_data.findMany({
      where: {
        ...query,
      },
      select: {
        id: true,
        email: true,
        entity: true,
        // alias user_client_data_user_idTouser to user
        user_client_data_user_idTouser: {
          select: {
            id: true,
            schedule: {
              select: {
                id: true,
                day: true,
                start_time: true,
                end_time: true,
              },
            },
          },
        },
      },
      skip: offset,
      take: limit,
    });
    // const result = await this.prismaService.user.findMany({
    //   where: {
    //     client_data: {
    //       ...query,
    //     },
    //   },
    //   select: {
    //     id: true,
    //     client_data: {
    //       select: {
    //         entity: true,
    //       },
    //     },
    //     schedule: {
    //       select: {
    //         day: true,
    //         start_time: true,
    //         end_time: true,
    //       },
    //     },
    //   },
    //   skip: offset,
    //   take: limit,
    // });

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
