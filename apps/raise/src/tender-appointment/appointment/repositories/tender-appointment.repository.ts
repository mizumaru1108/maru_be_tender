import { Injectable } from '@nestjs/common';
import { appointment, Prisma } from '@prisma/client';
import { BaseFilterRequest } from '../../../commons/dtos/base-filter-request.dto';
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
}
