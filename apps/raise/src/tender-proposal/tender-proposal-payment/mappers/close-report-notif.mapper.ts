import moment from 'moment';
import { CommonNotificationMapperResponse } from '../../../tender-commons/dto/common-notification-mapper-response.dto';
import { CommonProposalLogNotifResponse } from '../../../tender-commons/dto/common-proposal-log-notif-response.dto';
import { CreateManyNotificationDto } from '../../../tender-notification/dtos/requests/create-many-notification.dto';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { createManyNotificationMapper } from '../../../tender-notification/mappers/create-many-notification.mapper';

export const CloseReportNotifMapper = (
  logs: CommonProposalLogNotifResponse['data'],
): CommonNotificationMapperResponse => {
  const { proposal, reviewer, created_at } = logs;

  const logTime = moment(created_at).format('llll');

  const subject = `Project Close Report`;

  const clientContent = `Your proposal ${proposal.project_name} is almost complete, one more step to getting close report!, you just need to submit project close report form \n${logTime}`;

  const reviewerContent = `Your have asked ${proposal.user.employee_name} to fill close report form at ${logTime}`;

  const clientWebNotifPayload: CreateNotificationDto = {
    user_id: proposal.user.id,
    type: 'PROPOSAL',
    specific_type: 'CLOSE_REPORT_SEND_TO_CLIENT',
    subject: subject,
    content: clientContent,
  };

  const createWebNotifPayload: CreateManyNotificationDto['payloads'] = [
    clientWebNotifPayload,
  ];

  if (reviewer) {
    const supervisorWebNotifPayload: CreateNotificationDto = {
      user_id: reviewer.id,
      type: 'PROPOSAL',
      specific_type: 'CLOSE_REPORT_SEND_TO_CLIENT',
      subject: subject + 'Sended',
      content: reviewerContent,
    };
    createWebNotifPayload.push(supervisorWebNotifPayload);
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
    reviewerId: [reviewer ? reviewer.id : ''],
    reviewerEmail: [reviewer ? reviewer.email : ''],
    reviewerMobileNumber: [
      reviewer && reviewer.mobile_number ? reviewer.mobile_number : '',
    ],
    reviewerContent,
  };
};
