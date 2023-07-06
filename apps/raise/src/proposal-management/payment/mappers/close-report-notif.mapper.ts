import moment from 'moment';
import { CommonNotificationMapperResponse } from '../../../tender-commons/dto/common-notification-mapper-response.dto';
import { CommonProposalLogNotifResponse } from '../../../tender-commons/dto/common-proposal-log-notif-response.dto';
import { CreateManyNotificationDto } from '../../../tender-notification/dtos/requests/create-many-notification.dto';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { createManyNotificationMapper } from '../../../tender-notification/mappers/create-many-notification.mapper';

export const CloseReportNotifMapper = (
  logs: CommonProposalLogNotifResponse['data'],
  proposal_id: string,
  baseAppUrl: string | undefined,
  selectLang?: 'ar' | 'en',
): CommonNotificationMapperResponse => {
  const { proposal, created_at } = logs;

  const logTime = moment(created_at).format('llll');

  // const subject = `Project Close Report`;
  const subject = `تقرير إغلاق المشروع`;

  // const clientContent = `Your proposal ${proposal.project_name} is almost complete, one more step to getting close report!, you just need to submit project close report form \n${logTime}`;
  const clientContent = `اقتراحك ${proposal.project_name} قريب من الاكتمال، خطوة واحدة فقط للحصول على تقرير الإغلاق! عليك فقط تقديم نموذج تقرير إغلاق المشروع \n${logTime}`;
  let clientEmailTemplatePath: string | undefined = undefined;
  let clientEmailTemplateContext: Record<string, any>[] | undefined = undefined;

  const clientWebNotifPayload: CreateNotificationDto = {
    user_id: proposal.user.id,
    type: 'PROPOSAL',
    specific_type: 'SEND_TO_CLIENT_FOR_FILLING_CLOSE_REPORT_FORM',
    proposal_id,
    subject: subject,
    content: clientContent,
  };

  const createWebNotifPayload: CreateManyNotificationDto['payloads'] = [
    clientWebNotifPayload,
  ];

  if (clientEmailTemplatePath === undefined) {
    clientEmailTemplatePath = `tender/${
      selectLang || 'ar'
    }/proposal/payment_finish`;
  }

  if (clientEmailTemplateContext === undefined) {
    clientEmailTemplateContext = [
      {
        projectName: proposal.project_name,
        clientUsername: proposal.user.employee_name,
        paymentPageLink: baseAppUrl
          ? baseAppUrl +
            `/client/dashboard/project-report/${proposal_id}/show-details/finished`
          : '#',
      },
    ];
  }

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
    clientEmailTemplatePath,
    clientEmailTemplateContext,
  };
};
