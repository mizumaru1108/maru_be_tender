import moment from 'moment';
import { CreateManyNotificationDto } from '../../../tender-notification/dtos/requests/create-many-notification.dto';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { createManyNotificationMapper } from '../../../tender-notification/mappers/create-many-notification.mapper';
import { InsertPaymentLogResponse } from '../dtos/responses/insert-payment-log-response.dto';
import { InsertPaymentNotifMapperResponse } from '../dtos/responses/insert-payment-notif-mapper-response.dto';

export const InsertPaymentNotifMapper = (
  logs: InsertPaymentLogResponse['data'],
): InsertPaymentNotifMapperResponse => {
  const { proposal, reviewer, created_at } = logs;

  const logTime = moment(created_at).format('llll');

  const subject = `Payment Request Approved`;

  const clientContent = `Your Payment Request has been approved by ${
    reviewer ? 'Supervisor (' + reviewer.employee_name + ')' : 'Supervisor'
  } at ${logTime}`;

  const supervisorContent = `You have successfully approve payment of ${proposal.user.employee_name}`;

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
      content: supervisorContent,
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
    supervisorId: reviewer ? reviewer.id : '',
    supervisorEmail: reviewer ? reviewer.email : '',
    supervisorMobileNumber:
      reviewer && reviewer.mobile_number ? reviewer.mobile_number : '',
    supervisorContent,
  };
};
