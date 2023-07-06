import moment from 'moment';
import { CommonNotificationMapperResponse } from '../../../tender-commons/dto/common-notification-mapper-response.dto';
import { CreateManyNotificationDto } from '../../../tender-notification/dtos/requests/create-many-notification.dto';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { createManyNotificationMapper } from '../../../tender-notification/mappers/create-many-notification.mapper';
import { RawCreateFollowUpDto } from '../dtos/responses/raw-create-follow-up.dto';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';

export const FollowUpNotifMapper = (
  createdFolllowUp: RawCreateFollowUpDto['data'],
  currentUser: TenderCurrentUser,
  employee_only: boolean,
  redirectLink: string,
  selected_lang?: 'ar' | 'en',
): CommonNotificationMapperResponse => {
  const { proposal, user } = createdFolllowUp;
  const logTime = moment(new Date()).format('llll');
  const subject = `إشعار متابعة الاقتراح`;
  const content = `مرحباً أوليفيا، نود إخبارك أن "${proposal.project_name}" يتلقى متابعة من ${user.employee_name}. يرجى التحقق من حسابك الشخصي للحصول على مزيد من المعلومات، أو انقر هنا.`;
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

  if (currentUser.choosenRole !== 'tender_client' && !employee_only) {
    createWebNotifPayload.push({
      ...baseWebNotif,
      user_id: proposal.user.id,
    });

    clientEmailTemplatePath = `tender/${
      selected_lang || 'ar'
    }/proposal/project_followup`;

    clientEmailTemplateContext = [
      {
        projectName: proposal.project_name,
        receiverName: proposal.user.employee_name,
        followUpSender: user.employee_name,
        projectPageLink: `${redirectLink}/client/dashboard/current-project/${proposal.id}/show-details`,
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
    clientId:
      currentUser.choosenRole !== 'tender_client' && !employee_only
        ? [proposal.user.id]
        : [],
    clientEmail:
      currentUser.choosenRole !== 'tender_client' && !employee_only
        ? [proposal.user.email]
        : [],
    clientMobileNumber:
      currentUser.choosenRole !== 'tender_client' && !employee_only
        ? [proposal.user.mobile_number || '']
        : [],
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
