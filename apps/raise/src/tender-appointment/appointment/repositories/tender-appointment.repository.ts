import { Injectable } from '@nestjs/common';
import { appointment, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { FindManyResult } from '../../../tender-commons/dto/find-many-result.dto';
import { TenderFusionAuthRoles } from '../../../tender-commons/types';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { AppointmentFilterRequest } from '../dtos/requests/appointment-filter-request.dto';

@Injectable()
export class TenderAppointmentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createAppointment(payload: Prisma.appointmentCreateInput) {
    try {
      return await this.prismaService.appointment.create({
        data: payload,
      });
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        TenderAppointmentRepository.name,
        'createAppointment Error:',
        `Creating Appointment!`,
      );
      throw theError;
    }
  }

  async findAppointmentById(
    userId: string,
    userRole: TenderFusionAuthRoles,
    appointmentId: string,
  ) {
    let query: Prisma.appointmentWhereInput = {};
    if (userRole === 'tender_client') {
      query = {
        ...query,
        user_id: userId,
      };
    } else {
      query = {
        ...query,
        employee_id: userId,
      };
    }

    query = {
      ...query,
      id: appointmentId,
    };

    try {
      return await this.prismaService.appointment.findFirst({
        where: {
          ...query,
        },
      });
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        TenderAppointmentRepository.name,
        'findAppointmentById Error:',
        `Finding Appointment by id: ${appointmentId}`,
      );
      throw theError;
    }
  }

  async findAppointments(
    userId: string,
    userRole: TenderFusionAuthRoles,
    filter: AppointmentFilterRequest,
  ): Promise<FindManyResult<appointment[]>> {
    const {
      page = 1,
      limit = 10,
      sort = 'desc',
      sorting_field,
      status,
    } = filter;
    const offset = (page - 1) * limit;

    let query: Prisma.appointmentWhereInput = {};

    // in this case only client and supervisor can access this endpoint
    if (userRole === 'tender_client') {
      query = {
        ...query,
        user_id: userId,
      };
    } else {
      query = {
        ...query,
        employee_id: userId,
      };
    }

    if (status) {
      query = {
        ...query,
        status: {
          equals: status,
          mode: 'insensitive',
        },
      };
    }

    const order_by: Prisma.appointmentOrderByWithRelationInput = {};
    const field =
      sorting_field as keyof Prisma.appointmentOrderByWithRelationInput;
    if (sorting_field) {
      order_by[field] = sort;
    } else {
      order_by.updated_at = sort;
    }

    try {
      const appointments = await this.prismaService.appointment.findMany({
        where: {
          ...query,
        },
        skip: offset,
        take: limit,
        orderBy: order_by,
      });

      const count = await this.prismaService.appointment.count({
        where: {
          ...query,
        },
      });

      return {
        data: appointments,
        total: count,
      };
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAppointmentRepository.name,
        'findUsers Error:',
        `finding users!`,
      );
      throw theError;
    }
  }

  async updateAppointment(
    appointmentId: string,
    updateAppointmentPayload: Prisma.appointmentUpdateInput,
  ) {
    try {
      const response = await this.prismaService.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          ...updateAppointmentPayload,
        },
      });
      return response;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAppointmentRepository.name,
        'updateAppointment Error:',
        `updating appointment status!`,
      );
      throw theError;
    }
  }

  async findPendingOrApprovedAppointment(
    userId: string,
    userRole: TenderFusionAuthRoles,
    date: Date,
    startTime: string,
    endTime: string,
  ): Promise<
    | (appointment & {
        client: {
          employee_name: string | null;
          email: string;
          client_data: {
            entity: string | null;
          } | null;
        };
      })
    | null
  > {
    let query: Prisma.appointmentWhereInput = {};

    // in this case only client and supervisor can access this endpoint
    if (userRole === 'tender_client') {
      query = {
        ...query,
        user_id: userId,
      };
    } else {
      query = {
        ...query,
        employee_id: userId,
      };
    }

    query = {
      ...query,
      status: {
        in: ['tentative', 'confirmed'],
      },
      date: {
        equals: date,
      },
      start_time: {
        gte: startTime,
      },
      end_time: {
        lte: endTime,
      },
    };

    try {
      const result = await this.prismaService.appointment.findFirst({
        where: {
          ...query,
        },
        include: {
          client: {
            select: {
              employee_name: true,
              email: true,
              client_data: {
                select: {
                  entity: true,
                },
              },
            },
          },
        },
      });
      // console.log(result);
      return result;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAppointmentRepository.name,
        'findAppointments Error:',
        `finding appointment!`,
      );
      throw theError;
    }
  }
}
