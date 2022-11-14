import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { FindManyResult } from '../../../tender-commons/dto/find-many-result.dto';
import { SearchClientFilterRequest } from '../dtos/requests/search-client-filter-request.dto';
import { SearchClientAppointmentResponseDto } from '../dtos/responses/search-client-appointment-response.dto';

@Injectable()
export class TenderAppointmentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async searchClientByName(
    searchParams: SearchClientFilterRequest,
  ): Promise<FindManyResult<SearchClientAppointmentResponseDto[]>> {
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
            id: true,
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

    const count = await this.prismaService.user.count({
      where: {
        ...query,
      },
    });

    return {
      data: result,
      total: count,
    };
  }
}
