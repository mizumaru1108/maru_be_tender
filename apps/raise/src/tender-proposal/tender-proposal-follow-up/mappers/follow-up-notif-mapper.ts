import moment from 'moment';
import { CommonNotificationMapperResponse } from '../../../tender-commons/dto/common-notification-mapper-response.dto';
import { CreateManyNotificationDto } from '../../../tender-notification/dtos/requests/create-many-notification.dto';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { createManyNotificationMapper } from '../../../tender-notification/mappers/create-many-notification.mapper';
import { RawCreateFollowUpDto } from '../dtos/responses/raw-create-follow-up.dto';

export const FollowUpNotifMapper = (
  createdFolllowUp: RawCreateFollowUpDto['data'],
  employee_only: boolean,
  selected_lang?: 'ar' | 'en',
): CommonNotificationMapperResponse => {
  const { proposal, user } = createdFolllowUp;
  const logTime = moment(new Date()).format('llll');
  const subject = `Proposal Follow Up Nocontenttification`;
  const content = `There's a New Follow Up on Project ${proposal.project_name} from ${user.employee_name}`;
  let clientEmailTemplatePath: string | undefined = undefined;
  let clientEmailTemplateContext: Record<string, any>[] | undefined = undefined;
  let reviewerId: string[] = [];
  let reviewerEmail: string[] = [];
  let reviewerEmailTemplatePath: string | undefined = undefined;
  let reviewerEmailTemplateContext: Record<string, any>[] | undefined =
    undefined;

  const baseWebNotif: Omit<CreateNotificationDto, 'user_id'> = {
    type: 'PROPOSAL',
    specific_type: 'NEW_FOLLOW_UP',
    subject,
    content,
    proposal_id: proposal.id,
  };
  const createWebNotifPayload: CreateManyNotificationDto['payloads'] = [];

  if (!employee_only) {
    createWebNotifPayload.push({
      ...baseWebNotif,
      user_id: user.id,
    });

    clientEmailTemplatePath = `tender/${
      selected_lang || 'ar'
    }/proposal/project_followup`;

    clientEmailTemplateContext = [
      {
        projectName: proposal.project_name,
        receiverName: proposal.user.employee_name,
        followUpSender: user.employee_name,
      },
    ];
  }

  // if (employee_only) {
  //   if (proposal.supervisor) {
  //     createWebNotifPayload.push({
  //       ...baseWebNotif,
  //       user_id: proposal.supervisor.id,
  //     });

  //     reviewerId.push(proposal.supervisor.id);
  //     reviewerEmail.push(proposal.supervisor.email);

  //     reviewerEmailTemplatePath = `tender/${
  //       selected_lang || 'ar'
  //     }/proposal/project_followup`;

  //     reviewerEmailTemplateContext = [
  //       {
  //         projectName: proposal.project_name,
  //         receiverName: proposal.supervisor.employee_name,
  //         followUpSender: user.employee_name,
  //       },
  //     ];
  //   }

  //   if (proposal.project_manager) {
  //     createWebNotifPayload.push({
  //       ...baseWebNotif,
  //       user_id: proposal.project_manager.id,
  //     });

  //     reviewerId.push(proposal.project_manager.id);
  //     reviewerEmail.push(proposal.project_manager.email);

  //     reviewerEmailTemplatePath = `tender/${
  //       selected_lang || 'ar'
  //     }/proposal/project_followup`;

  //     reviewerEmailTemplateContext = [
  //       {
  //         projectName: proposal.project_name,
  //         receiverName: proposal.project_manager.employee_name,
  //         followUpSender: user.employee_name,
  //       },
  //     ];
  //   }
  // }

  const createManyWebNotifPayload = createManyNotificationMapper({
    payloads: createWebNotifPayload,
  });

  return {
    logTime,
    clientSubject: subject,
    clientId: employee_only ? [] : [proposal.user.id],
    clientEmail: employee_only ? [] : [proposal.user.email],
    clientMobileNumber: employee_only
      ? []
      : [proposal.user.mobile_number || ''],
    clientContent: content,
    clientEmailTemplatePath,
    clientEmailTemplateContext,
    createManyWebNotifPayload,
    reviewerId,
    reviewerEmail,
    reviewerEmailTemplateContext,
    reviewerEmailTemplatePath,
  };
};
