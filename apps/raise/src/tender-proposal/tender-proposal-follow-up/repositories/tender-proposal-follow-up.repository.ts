import { Injectable } from '@nestjs/common';
import { Prisma, proposal_follow_up } from '@prisma/client';
import { logUtil } from '../../../commons/utils/log-util';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { FollowUpNotifMapper } from '../mappers/follow-up-notif-mapper';

@Injectable()
export class TenderProposalFollowUpRepository {
  private readonly logger = ROOT_LOGGER.child({
    logger: TenderProposalFollowUpRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    followUpCreatePayload: Prisma.proposal_follow_upUncheckedCreateInput,
    fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[],
    employee_only: boolean,
    selected_lang?: 'ar' | 'en',
  ) {
    this.logger.log(
      'log',
      `Createing new follow up with payload of ${logUtil(
        followUpCreatePayload,
      )}`,
    );
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const followUps = await prisma.proposal_follow_up.create({
          data: {
            ...followUpCreatePayload,
          },
          include: {
            proposal: {
              include: {
                user: true,
                supervisor: true,
                project_manager: true,
              },
            },
            user: true,
          },
        });

        if (fileManagerCreateManyPayload) {
          await prisma.file_manager.createMany({
            data: fileManagerCreateManyPayload,
          });
        }

        const followupNotif = FollowUpNotifMapper(
          followUps,
          employee_only,
          selected_lang,
        );

        if (
          followupNotif.createManyWebNotifPayload &&
          followupNotif.createManyWebNotifPayload.length > 0
        ) {
          this.logger.log(
            'info',
            `Creating new notification with payload of \n${logUtil(
              followupNotif.createManyWebNotifPayload,
            )}`,
          );
          prisma.notification.createMany({
            data: followupNotif.createManyWebNotifPayload,
          });
        }

        return {
          followUps,
          followupNotif,
        };
      });
    } catch (error) {
      console.log('error', error);
      const theError = prismaErrorThrower(
        error,
        TenderProposalFollowUpRepository.name,
        'Creating Follow Up Error:',
        `Creating Follow Up!`,
      );
      throw theError;
    }
  }

  async fetchProposalById(id: string): Promise<proposal_follow_up | null> {
    try {
      return await this.prismaService.proposal_follow_up.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalFollowUpRepository.name,
        'finding follow up error details: ',
        'finding follow up!',
      );
      throw theError;
    }
  }

  async deleteFollowUps(
    id: string[],
    attachmentIds: string[],
  ): Promise<number> {
    this.logger.log('info', `deleting followup with id of ${id}`);
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        if (attachmentIds && attachmentIds.length > 0) {
          await prisma.file_manager.updateMany({
            where: {
              id: {
                in: [...attachmentIds],
              },
            },
            data: {
              is_deleted: true,
            },
          });
        }

        let deletedData = 0;
        if (id && id.length > 0) {
          const deletedFollowUp = await prisma.proposal_follow_up.deleteMany({
            where: {
              id: {
                in: [...id],
              },
            },
          });
          deletedData = deletedFollowUp.count;
        }

        return deletedData;
      });
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        TenderProposalFollowUpRepository.name,
        'deleting error details: ',
        'deleting follow up!',
      );
      throw theError;
    }
  }
}
