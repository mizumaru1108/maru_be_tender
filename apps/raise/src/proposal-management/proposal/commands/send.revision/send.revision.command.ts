import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import moment from 'moment';
import { ITenderAppConfig } from 'src/commons/configs/tender-app-config';
import { FileMimeTypeEnum } from 'src/commons/enums/file-mimetype.enum';
import { isExistAndValidPhone } from 'src/commons/utils/is-exist-and-valid-phone';
import { removeUndefinedKeys } from 'src/commons/utils/remove.undefined.value';
import { BunnyService } from 'src/libs/bunny/services/bunny.service';
import { EmailService } from 'src/libs/email/email.service';
import { MsegatService } from 'src/libs/msegat/services/msegat.service';
import { TenderNotificationRepository } from 'src/notification-management/notification/repository/tender-notification.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProposalEditRequestRepository } from 'src/proposal-management/edit-requests/repositories/proposal.edit.request.repository';
import { ProposalItemBudgetRepository } from 'src/proposal-management/item-budget/repositories/proposal.item.budget.repository';
import { ProposalTimelinePostgresRepository } from 'src/proposal-management/poject-timelines/repositories/proposal.project.timeline.repository';
import { SendRevisionDto } from 'src/proposal-management/proposal/dtos/requests';
import { ISendNotificaitonEvent } from 'src/proposal-management/proposal/entities/proposal.entity';
import { ProposalRepository } from 'src/proposal-management/proposal/repositories/proposal.repository';
import { ProposalUpdateProps } from 'src/proposal-management/proposal/types';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';
import { ForbiddenPermissionException } from 'src/tender-commons/exceptions/forbidden-permission-exception';
import { RequestErrorException } from 'src/tender-commons/exceptions/request-error.exception';
import { OutterStatusEnum } from 'src/tender-commons/types/proposal';
import { isUploadFileJsonb } from 'src/tender-commons/utils/is-upload-file-jsonb';
import {
  CreateFileManagerProps,
  TenderFileManagerRepository,
} from 'src/tender-file-manager/repositories/tender-file-manager.repository';
import { v4 as uuidv4 } from 'uuid';

export class SendRevisionCommand {
  userId: string;
  request: SendRevisionDto;
  letter_ofsupport_req?: any; //Express.Multer.File[];
  project_attachments?: any; //Express.Multer.File[];
}

export class SendRevisionCommandResult {}

@CommandHandler(SendRevisionCommand)
export class SendRevisionCommandHandler
  implements ICommandHandler<SendRevisionCommand, SendRevisionCommandResult>
{
  constructor(
    private readonly configService: ConfigService,
    private readonly bunnyService: BunnyService,
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly msegatService: MsegatService,
    private readonly proposalRepo: ProposalRepository,
    private readonly editRequestRepo: ProposalEditRequestRepository,
    private readonly itemBudgetRepo: ProposalItemBudgetRepository,
    private readonly timelineRepo: ProposalTimelinePostgresRepository,
    private readonly fileManagerRepo: TenderFileManagerRepository,
    private readonly notifRepo: TenderNotificationRepository,
  ) {}

  async execute(
    command: SendRevisionCommand,
  ): Promise<SendRevisionCommandResult> {
    const { userId, request, project_attachments, letter_ofsupport_req } =
      command;
    let fileManagerPayload: CreateFileManagerProps[] = [];
    const deletedFileManagerUrls: string[] = []; // id of file manager that we want to mark as soft delete.
    try {
      const tenderAppConfig =
        this.configService.get<ITenderAppConfig>('tenderAppConfig');

      const proposalId = request.proposal_id;

      // find proposal by id
      const proposal = await this.proposalRepo.fetchById({
        id: proposalId,
        includes_relation: ['user', 'supervisor'],
      });

      if (!proposal) throw new DataNotFoundException(`Proposal not found`);
      if (proposal.submitter_user_id !== userId) {
        throw new ForbiddenPermissionException(
          `You are not allowed to edit this proposal`,
        );
      }
      if (!proposal.supervisor) {
        throw new RequestErrorException(`Unable to fetch supervisor data!`);
      }
      if (!proposal.user) {
        throw new RequestErrorException(
          `Unable to proposal submitter user data!`,
        );
      }

      const proposalUpdateProps = Builder<ProposalUpdateProps>(
        ProposalUpdateProps,
        {
          // form 1
          project_idea: request.project_idea,
          project_location: request.project_location,
          project_implement_date: request.project_implement_date,
          beneficiary_id: request.beneficiary_id,
          // form 2
          num_ofproject_binicficiaries: request.num_ofproject_binicficiaries,
          project_goals: request.project_goals,
          project_outputs: request.project_outputs,
          project_strengths: request.project_strengths,
          project_risks: request.project_risks,
          //form 4
          amount_required_fsupport: request.amount_required_fsupport,
          proposal_bank_id: request.proposal_bank_id,
        },
      ).build();

      // validate the length of props
      if (Object.keys(proposalUpdateProps).length === 0) {
        throw new BadRequestException(
          'You must change at least one value that defined by supervisor',
        );
      }

      // get detail from edit requests
      const editRequest = await this.editRequestRepo.findOne({
        proposal_id: proposalId,
      });
      if (!editRequest) {
        throw new RequestErrorException(
          `Unable to fetch edit request from proposal ${proposalId}`,
        );
      }
      if (!editRequest.detail) {
        throw new RequestErrorException(
          `Unable to fetch edit request detail from proposal ${proposalId}`,
        );
      }

      const rawAllowedKeys = JSON.parse(editRequest.detail);
      const allowedKeys = Object.keys(rawAllowedKeys);
      const keySet = new Set(allowedKeys);
      const currentKeys = removeUndefinedKeys(proposalUpdateProps);
      // console.log({ allowedKeys });
      // console.log('update proposal key', Object.keys(currentKeys));
      // console.log('update proposal value', currentKeys);
      for (const key of Object.keys(currentKeys)) {
        if (!keySet.has(key)) {
          throw new ForbiddenPermissionException(
            'You are just allowed to change what defined by the supervisor!',
          );
        }
      }

      if (project_attachments !== undefined && project_attachments.length > 0) {
        const uploadResult = await this.bunnyService.uploadFileMulter(
          project_attachments[0],
          `tmra/${tenderAppConfig?.env}/organization/tender-management/proposal/${proposalId}/${userId}/project-attachments`,
          [FileMimeTypeEnum.PDF],
          1024 * 1024 * 200,
        );

        proposalUpdateProps.project_attachments = {
          url: uploadResult.url,
          type: uploadResult.type,
          size: uploadResult.size,
        };

        fileManagerPayload.push({
          id: uuidv4(),
          user_id: userId,
          name: uploadResult.name,
          url: uploadResult.url,
          mimetype: uploadResult.type,
          size: uploadResult.size,
          column_name: 'project-attachments',
          table_name: 'proposal',
          proposal_id: proposalId,
        });

        if (isUploadFileJsonb(proposal.project_attachments)) {
          const oldFile = proposal.project_attachments as {
            url: string;
            type: string;
            size: number;
          };
          if (!!oldFile.url) {
            deletedFileManagerUrls.push(oldFile.url);
          }
        }
      }

      if (
        letter_ofsupport_req !== undefined &&
        letter_ofsupport_req.length > 0
      ) {
        const uploadResult = await this.bunnyService.uploadFileMulter(
          letter_ofsupport_req[0],
          `tmra/${tenderAppConfig?.env}/organization/tender-management/proposal/${proposalId}/${userId}/letter-of-support-req`,
          [FileMimeTypeEnum.PDF],
          1024 * 1024 * 200,
        );

        proposalUpdateProps.letter_ofsupport_req = {
          url: uploadResult.url,
          type: uploadResult.type,
          size: uploadResult.size,
        };

        fileManagerPayload.push({
          id: uuidv4(),
          user_id: userId,
          name: uploadResult.name,
          url: uploadResult.url,
          mimetype: uploadResult.type,
          size: uploadResult.size,
          column_name: 'letter-of-support-req',
          table_name: 'proposal',
          proposal_id: proposalId,
        });

        if (isUploadFileJsonb(proposal.letter_ofsupport_req)) {
          const oldFile = proposal.letter_ofsupport_req as {
            url: string;
            type: string;
            size: number;
          };
          if (!!oldFile.url) {
            deletedFileManagerUrls.push(oldFile.url);
          }
        }
      }

      proposalUpdateProps.id = request.proposal_id;
      proposalUpdateProps.outter_status = OutterStatusEnum.ONGOING;
      proposalUpdateProps.state = 'PROJECT_SUPERVISOR';

      const dbRes = await this.prismaService.$transaction(
        async (prismaSession) => {
          const session =
            prismaSession instanceof PrismaService
              ? prismaSession
              : this.prismaService;

          await this.proposalRepo.update(proposalUpdateProps, session);

          if (fileManagerPayload.length > 0) {
            for (const file of fileManagerPayload) {
              await this.fileManagerRepo.create(file, session);
            }
          }

          if (request.detail_project_budgets !== undefined) {
            // delete the old item budget
            await this.itemBudgetRepo.deleteMany(
              {
                proposal_id: request.proposal_id,
              },
              session,
            );

            // create new
            for (const deletePayload of request.detail_project_budgets) {
              await this.itemBudgetRepo.create(
                {
                  ...deletePayload,
                  proposal_id: request.proposal_id,
                },
                session,
              );
            }
          }

          // timeline
          if (request.project_timeline !== undefined) {
            // delete the old item budget
            await this.timelineRepo.deleteMany(
              {
                proposal_id: request.proposal_id,
              },
              session,
            );

            // create new
            for (const deletePayload of request.project_timeline) {
              await this.timelineRepo.create(
                {
                  ...deletePayload,
                  proposal_id: request.proposal_id,
                },
                session,
              );
            }
          }

          // web notif
          await this.notifRepo.create(
            {
              user_id: proposal.supervisor_id!,
              content: `تمت تعديل بيانات المشروع ${proposal.project_name} من قبل العميل \n\n${proposal.user?.employee_name} يرجى الدخول على المنصة لمراجعة التعديلات`,
              subject: '',
              type: 'PROPOSAL',
              specific_type: 'NEW_FOLLOW_UP',
              proposal_id: proposal.id,
            },
            session,
          );
        },
        {
          timeout: 50000,
        },
      );

      // send notif sms and email to notify the supervisor about revbised version of the proposal has been sent by the user.
      const notifPayloads: ISendNotificaitonEvent[] = [];

      notifPayloads.push({
        notif_type: 'EMAIL',
        email_type: 'template',
        emailTemplateContext: {
          project_name: proposal.project_name,
          name: proposal.supervisor.employee_name,
          client_name: proposal.user.employee_name,
          date: moment(new Date()).locale('ar-sa').format('llll'),
          redirect_url: `${tenderAppConfig?.baseUrl}project-supervisor/dashboard/requests-in-process/${proposal.id}/show-details`,
        },
        emailTemplatePath: `tender/ar/proposal/submit_amandement_by_client_ar`,
        user_id: proposal.supervisor.id,
        user_email: proposal.supervisor.email,
        subject: 'تم إرسال تعديل جديد من العميل',
        content: `السلام عليكم ورحمة الله ${proposal.user.employee_name} 
          تم تعديل المشروع ${
            proposal.project_name
          } من قبل العميل في تاريخ ${moment(new Date())
            .locale('ar-sa')
            .format('llll')}
          يرجى زيارة منصة المنح لمراجعة المعلومات`,
      });

      notifPayloads.push({
        notif_type: 'SMS',
        user_id: proposal.supervisor.id,
        subject: 'تم إرسال تعديل جديد من العميل',
        content: `السلام عليكم ورحمة الله ${proposal.user.employee_name} 
          تم تعديل المشروع ${
            proposal.project_name
          } من قبل العميل في تاريخ ${moment(new Date())
            .locale('ar-sa')
            .format('llll')}
          يرجى زيارة منصة المنح لمراجعة المعلومات`,
        user_phone:
          proposal.supervisor.mobile_number !== null
            ? proposal.supervisor.mobile_number
            : undefined,
      });

      if (notifPayloads && notifPayloads.length > 0) {
        for (const notifPayload of notifPayloads) {
          if (notifPayload.notif_type === 'SMS' && notifPayload.user_phone) {
            const clientPhone = isExistAndValidPhone(notifPayload.user_phone);

            // sms notif for follow up
            if (clientPhone) {
              await this.msegatService.sendSMSAsync({
                numbers: clientPhone.includes('+')
                  ? clientPhone.substring(1)
                  : clientPhone,
                msg: notifPayload.subject + notifPayload.content,
              });
            }
          }

          // email notif for follow up
          if (
            notifPayload.notif_type === 'EMAIL' &&
            notifPayload.user_email &&
            notifPayload.email_type
          ) {
            this.emailService.sendMail({
              mailType: notifPayload.email_type,
              to: notifPayload.user_email,
              subject: notifPayload.subject,
              content: notifPayload.content,
              templateContext: notifPayload.emailTemplateContext,
              templatePath: notifPayload.emailTemplatePath,
            });
          }
        }
      }

      return new SendRevisionCommandResult();
    } catch (error) {
      if (fileManagerPayload && fileManagerPayload.length > 0) {
        for (const file of fileManagerPayload) {
          await this.bunnyService.deleteMedia(file.url, true);
        }
      }
      throw error;
    }
  }
}
