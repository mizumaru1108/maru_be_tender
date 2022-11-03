import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { schedule } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { EditScheduleRequestDto } from '../dtos/requests/edit-schedule-request.dto';
import { EditScheduleResponse } from '../dtos/responses/edit-schedule-response.dto';

@Injectable()
export class TenderScheduleService {
  constructor(private readonly prismaService: PrismaService) {}

  async edit(
    userId: string,
    editRequest: EditScheduleRequestDto,
  ): Promise<EditScheduleResponse> {
    let updatedSchedule: schedule[] = [];

    if (editRequest.scheduleUpdateRequests.length > 0) {
      for (let i = 0; i < editRequest.scheduleUpdateRequests.length; i++) {
        try {
          const schedule = await this.prismaService.schedule.findUnique({
            where: {
              id: editRequest.scheduleUpdateRequests[i].id,
            },
          });
          if (!schedule) {
            throw new BadRequestException(
              `Schedule ${editRequest.scheduleUpdateRequests[i].id} (number ${
                i + 1
              }) not found, but all the previous schedule should be updated`,
            );
          }
          if (schedule.user_id !== userId) {
            throw new ForbiddenException(
              "You are not allowed to edit this schedule, this schedule isn't yours'",
            );
          }
          const updatedData = await this.prismaService.schedule.update({
            where: {
              id: editRequest.scheduleUpdateRequests[i].id,
            },
            data: {
              start_time: editRequest.scheduleUpdateRequests[i].start_time,
              end_time: editRequest.scheduleUpdateRequests[i].end_time,
            },
          });
          updatedSchedule.push(updatedData);
        } catch (error) {
          console.log(error);
          if (
            error instanceof BadRequestException ||
            error instanceof ForbiddenException
          ) {
            throw error;
          }
          throw new InternalServerErrorException('Something went wrong');
        }
      }
    }

    return {
      editedSchedule: updatedSchedule,
    };
  }
}
