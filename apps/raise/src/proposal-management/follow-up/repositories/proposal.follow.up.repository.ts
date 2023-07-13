import { Injectable } from '@nestjs/common';
import { Prisma, proposal_follow_up } from '@prisma/client';
import { logUtil } from '../../../commons/utils/log-util';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { FollowUpNotifMapper } from '../mappers/follow-up-notif-mapper';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { ProposalFollowUpEntity } from 'src/proposal-management/follow-up/entities/proposal.follow.up.entity';
import { UploadFilesJsonbDto } from 'src/tender-commons/dto/upload-files-jsonb.dto';
import { InvalidIdentifierException } from 'src/tender-commons/exceptions/invalid.identifier.exception';

export class ProposalFollowUpFindOneProps {
  id?: string;
  user_id?: string;
  proposal_id?: string;
  method?: 'AND' | 'OR';
  include_relations?: string[];
}
export class ProposalFollowUpCreateProps {
  id?: string;
  employee_only: boolean;
  submitter_role: string;
  proposal_id: string;
  user_id: string;
  content: string;
  attachments: UploadFilesJsonbDto[];
}

@Injectable()
export class ProposalFollowUpRepository {
  private readonly logger = ROOT_LOGGER.child({
    logger: ProposalFollowUpRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: ProposalFollowUpCreateProps,
    session?: PrismaService,
  ): Promise<ProposalFollowUpEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const rawCreated = await prisma.proposal_follow_up.create({
        data: {
          id: props.id || nanoid(),
          employee_only: props.employee_only,
          content: props.content,
          attachments: props.attachments as unknown as Prisma.InputJsonValue,
          submitter_role: props.submitter_role,
          proposal_id: props.proposal_id,
          user_id: props.user_id,
        },
      });

      const createdEntity = Builder(ProposalFollowUpEntity, {
        ...rawCreated,
      }).build();

      return createdEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findOneFilter(props: ProposalFollowUpFindOneProps) {
    try {
      const { id, proposal_id, user_id, include_relations, method } = props;

      let args: Prisma.proposal_follow_upFindFirstArgs = {};
      let whereClause: Prisma.proposal_follow_upWhereInput = {};

      if (!id && !proposal_id && !user_id) {
        throw new InvalidIdentifierException(
          `You must include at lease one identifier!`,
        );
      }
      let clause: Prisma.proposal_follow_upWhereInput[] = [];
      if (id) clause.push({ id });
      if (proposal_id) clause.push({ proposal_id });
      if (user_id) clause.push({ user_id });
      if (method === 'AND') whereClause.AND = clause;
      if (method === 'OR') whereClause.OR = clause;

      if (include_relations && include_relations.length > 0) {
        let include: Prisma.proposal_follow_upInclude = {};

        for (const relation of include_relations) {
          if (relation === 'sender') {
            include = {
              ...include,
              user: true,
            };
          }
          if (relation === 'proposal') {
            include = {
              ...include,
              proposal: true,
            };
          }
        }

        args.include = include;
      }

      return args;
    } catch (error) {
      throw error;
    }
  }

  async findOne(
    props: ProposalFollowUpFindOneProps,
    session?: PrismaService,
  ): Promise<ProposalFollowUpEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const args = await this.findOneFilter(props);
      const rawCreated = await prisma.proposal_follow_up.findFirst(args);

      if (!rawCreated) return null;

      const createdEntity = Builder(ProposalFollowUpEntity, {
        ...rawCreated,
      }).build();

      return createdEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async createFollowUp(
    followUpCreatePayload: Prisma.proposal_follow_upUncheckedCreateInput,
    fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[],
    currentUser: TenderCurrentUser,
    employee_only: boolean,
    redirectLink: string,
    selected_lang?: 'ar' | 'en',
  ) {
    this.logger.log(
      'info',
      `Createing new follow up with payload of \n${logUtil(
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
          currentUser,
          employee_only,
          redirectLink,
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

          await prisma.notification.createMany({
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
        ProposalFollowUpRepository.name,
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
        ProposalFollowUpRepository.name,
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
        ProposalFollowUpRepository.name,
        'deleting error details: ',
        'deleting follow up!',
      );
      throw theError;
    }
  }
}
