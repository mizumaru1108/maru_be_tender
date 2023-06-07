import moment from 'moment';
import { CommonNotificationMapperResponse } from '../../../tender-commons/dto/common-notification-mapper-response.dto';
import { CommonProposalLogNotifResponse } from '../../../tender-commons/dto/common-proposal-log-notif-response.dto';
import { CreateManyNotificationDto } from '../../../tender-notification/dtos/requests/create-many-notification.dto';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { createManyNotificationMapper } from '../../../tender-notification/mappers/create-many-notification.mapper';

export const NewAmandementNotifMapper = (
  proposal_id: string,
  logs: CommonProposalLogNotifResponse['data'],
  notifLink: string,
  selectLang?: 'ar' | 'en',
): CommonNotificationMapperResponse => {
  const { proposal, reviewer, created_at } = logs;

  const logTime = moment(created_at).format('llll');

  const subject = `New Amandement Request`;

  const clientContent = `"مرحبًا ${proposal.user.employee_name}، نود إبلاغك بأنه تم طلب تعديل معلومات مشروعك '${proposal.project_name}'.
  يرجى التحقق من حسابك الشخصي للحصول على مزيد من المعلومات، أو انقر هنا."`;

  // const reviewerContent = `Successfully send amandement request for project ${proposal.project_name} to ${proposal.user.employee_name} at ${logTime}`;

  const clientWebNotifPayload: CreateNotificationDto = {
    user_id: proposal.user.id,
    type: 'PROPOSAL',
    specific_type: 'NEW_AMANDEMENT_REQUEST_FROM_SUPERVISOR',
    proposal_id: proposal_id,
    subject: subject,
    // content: `Your proposal ${
    //   proposal.project_name
    // } has been asked for revision by ${
    //   reviewer ? 'Supervisor (' + reviewer.employee_name + ')' : 'Supervisor'
    // } at ${logTime}`,
    content: clientContent,
  };

  const createWebNotifPayload: CreateManyNotificationDto['payloads'] = [
    clientWebNotifPayload,
  ];

  // if (reviewer) {
  //   const supervisorWebNotifPayload: CreateNotificationDto = {
  //     user_id: reviewer.id,
  //     type: 'PROPOSAL',
  //     subject: subject + 'Sended',
  //     content: reviewerContent,
  //   };
  //   createWebNotifPayload.push(supervisorWebNotifPayload);
  // }

  const createManyWebNotifPayload = createManyNotificationMapper({
    payloads: createWebNotifPayload,
  });

  return {
    logTime,
    clientSubject: subject,
    clientId: [proposal.user.id],
    clientEmail: [proposal.user.email],
    clientMobileNumber: [proposal.user.mobile_number || ''],
    clientContent,
    createManyWebNotifPayload,
    clientEmailTemplatePath: `tender/${
      selectLang || 'ar'
    }/proposal/project_new_amandement_request`,
    clientEmailTemplateContext: [
      {
        clientUsername: `${proposal.user.employee_name}`,
        projectPageLink: `${notifLink}/client/dashboard/previous-funding-requests/${proposal_id}/show-project`,
      },
    ],
  };
};
