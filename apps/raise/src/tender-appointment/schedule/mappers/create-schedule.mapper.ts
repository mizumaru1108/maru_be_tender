import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { compareTime } from '../../../tender-commons/utils/time-compare';
import { CreateSchedulePayload } from '../dtos/requests/create-schedule-request.dto';

export const createScheduleMapper = (
  userId: string,
  createRequest: CreateSchedulePayload[],
): Prisma.scheduleCreateManyInput[] => {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // looping through the days array
  return days.reduce((schedules, day) => {
    // check if the day is in the createRequest
    const existingSchedule = createRequest.find(
      (schedule) => schedule.day === day,
    );

    // if the day is in the createRequest, push the day, start_time, and end_time to the schedules array
    if (existingSchedule) {
      // check if the day is already in the schedules array throw an error
      if (schedules.length > 0 && schedules[schedules.length - 1].day === day) {
        throw new BadRequestException(
          `Duplicate day (${day}) detected in schedule payload!`,
        );
      }

      // validate that the start_time is less than the end_time
      const result = compareTime(
        existingSchedule.start_time,
        existingSchedule.end_time,
      );
      if (!result) {
        throw new BadRequestException(
          `Start time on ${existingSchedule.day} (${existingSchedule.start_time}) cannot be greater than end time (${existingSchedule.end_time})`,
        );
      }

      schedules.push({
        id: uuidv4(),
        user_id: userId,
        day,
        start_time: existingSchedule.start_time,
        end_time: existingSchedule.end_time,
      });
    } else {
      // if the day is not exist then create a schedule with undefined start_time and end_time
      schedules.push({
        id: uuidv4(),
        user_id: userId,
        day,
        start_time: undefined,
        end_time: undefined,
      });
    }

    return schedules;
  }, [] as Prisma.scheduleCreateManyInput[]);
};
