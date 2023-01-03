import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, schedule } from '@prisma/client';
import { getTimeGap } from '../../../tender-commons/utils/get-time-gap';
import { CreateSchedulePayload } from '../dtos/requests/create-schedule-request.dto';
import { CreateScheduleResponseDto } from '../dtos/responses/create-schedule-response.dto';
import {
  GetMyScheduleResponse,
  IScheduleWithGap,
} from '../dtos/responses/get-my-schedule-response.dto';
import { createScheduleMapper } from '../mappers/create-schedule.mapper';
import { TenderScheduleRepository } from '../repositories/tender-schedule.repository';

@Injectable()
export class TenderScheduleService {
  constructor(
    private readonly tenderScheduleRepository: TenderScheduleRepository,
  ) {}

  async upsertSchedules(
    userId: string,
    createRequest: CreateSchedulePayload[],
  ): Promise<CreateScheduleResponseDto> {
    if (createRequest.length > 7) {
      throw new BadRequestException(
        'Schedule payload cannot contain more than 7 days!',
      );
    }

    const createSchedulePayload: Prisma.scheduleCreateManyInput[] =
      createScheduleMapper(userId, createRequest);

    return await this.tenderScheduleRepository.upsertSchedules(
      userId,
      createSchedulePayload,
    );
  }

  async getMySchedules(
    userId: string,
  ): Promise<GetMyScheduleResponse['schedule']> {
    const schedules = await this.tenderScheduleRepository.getMySchedules(
      userId,
    );

    const result: GetMyScheduleResponse['schedule'] = schedules.map(
      (schedule: schedule) => {
        const scheduleWithTimeGap: IScheduleWithGap = {
          id: schedule.id,
          day: schedule.day,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          time_gap:
            !!schedule.start_time && !!schedule.end_time
              ? getTimeGap(schedule.start_time, schedule.end_time, 15)
              : [],
        };
        return scheduleWithTimeGap;
      },
    );

    return result;
  }
}
