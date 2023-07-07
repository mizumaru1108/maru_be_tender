import moment from 'moment';
import { CommonNotifMapperResponse } from '../../../tender-commons/dto/common-notif-mapper-response.dto';
import { CommonProposalLogNotifResponse } from '../../../tender-commons/dto/common-proposal-log-notif-response.dto';
import { CreateManyNotificationDto } from '../../../notification-management/notification/dtos/requests/create-many-notification.dto';
import { CreateNotificationDto } from '../../../notification-management/notification/dtos/requests/create-notification.dto';
import { createManyNotificationMapper } from '../../../notification-management/notification/mappers/create-many-notification.mapper';

export const InsertPaymentNotifMapper = (
  logs: CommonProposalLogNotifResponse['data'],
): CommonNotifMapperResponse => {
  const { proposal, reviewer, created_at } = logs;

  const logTime = moment(created_at).format('llll');

  const subject = `Payment Request Approved`;

  const clientContent = `Your Payment Request has been approved by ${
    reviewer ? 'Supervisor (' + reviewer.employee_name + ')' : 'Supervisor'
  } at ${logTime}`;

  const reviewerContent = `You have successfully approve payment of ${proposal.user.employee_name}`;

  const clientWebNotifPayload: CreateNotificationDto = {
    user_id: proposal.user.id,
    type: 'PROPOSAL',
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
      subject: subject,
      content: reviewerContent,
    };
    createWebNotifPayload.push(supervisorWebNotifPayload);
  }

  const createManyWebNotifPayload = createManyNotificationMapper({
    payloads: createWebNotifPayload,
  });

  return {
    logTime,
    subject,
    clientId: proposal.user.id,
    clientEmail: proposal.user.email,
    clientMobileNumber: proposal.user.mobile_number || '',
    clientContent,
    createManyWebNotifPayload,
    reviewerId: reviewer ? reviewer.id : '',
    reviewerEmail: reviewer ? reviewer.email : '',
    reviewerMobileNumber:
      reviewer && reviewer.mobile_number ? reviewer.mobile_number : '',
    reviewerContent,
  };
};
