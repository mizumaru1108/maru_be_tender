import { Injectable } from '@nestjs/common';
import { Prisma, schedule } from '@prisma/client';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { CreateScheduleResponseDto } from '../dtos/responses/create-schedule-response.dto';

@Injectable()
export class TenderScheduleRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderScheduleRepository.name,
  });

  constructor(private readonly prismaService: PrismaService) {}

  async upsertSchedules(
    userId: string,
    createManyPayload: Prisma.scheduleCreateManyInput[],
  ): Promise<CreateScheduleResponseDto> {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        // delete all schedules where the user_id is the same as the current user
        await prisma.schedule.deleteMany({
          where: {
            user_id: userId,
          },
        });

        // create new schedules
        await prisma.schedule.createMany({
          data: createManyPayload,
        });

        const schedules = await prisma.schedule.findMany({
          where: {
            user_id: userId,
          },
          select: {
            day: true,
            start_time: true,
            end_time: true,
          },
        });

        return {
          createdSchedule: schedules,
          createdCount: schedules.length,
        };
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderScheduleRepository.name,
        'createSchedules error:',
        `creating schedule!`,
      );
      throw theError;
    }
  }

  async getMySchedules(userId: string): Promise<schedule[]> {
    try {
      return await this.prismaService.schedule.findMany({
        where: {
          user_id: userId,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderScheduleRepository.name,
        'getMySchedules error:',
        `getting schedules!`,
      );
      throw theError;
    }
  }
}
