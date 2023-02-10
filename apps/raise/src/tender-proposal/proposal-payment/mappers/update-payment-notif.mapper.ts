import { payment } from '@prisma/client';
import moment from 'moment';
import {
  appRoleToReadable,
  TenderAppRole,
} from '../../../tender-commons/types';
import { CreateManyNotificationDto } from '../../../tender-notification/dtos/requests/create-many-notification.dto';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { createManyNotificationMapper } from '../../../tender-notification/mappers/create-many-notification.mapper';
import { InsertPaymentLogResponse } from '../dtos/responses/insert-payment-log-response.dto';
import { UpdatePaymentNotifMapperResponse } from '../dtos/responses/update-payment-notif-mapper-response.dto';

export const UpdatePaymentNotifMapper = (
  payment: payment,
  logs: InsertPaymentLogResponse['data'],
  action: 'accept' | 'reject' | 'edit' | 'upload_receipt' | 'issue',
  choosenRole: TenderAppRole,
): UpdatePaymentNotifMapperResponse => {
  const { proposal, reviewer, created_at } = logs;

  const logTime = moment(created_at).format('llll');

  let subject = '';
  let clientContent = '';
  let reviewerContent = '';

  if (choosenRole === 'PROJECT_MANAGER') {
    if (action === 'accept') subject = 'Payment Accepted By Project Manager';
    if (action === 'reject') subject = 'Payment Rejected By Project Manager';
  }

  if (choosenRole === 'FINANCE') {
    if (action === 'accept') subject = 'Payment Accepted Finance';
  }

  if (choosenRole === 'PROJECT_SUPERVISOR') {
    if (action === 'issue') subject = 'Payment Issued By Supervisor';
  }

  if (choosenRole === 'CASHIER') {
    if (action === 'upload_receipt') subject = 'Payment Complete';
  }

  clientContent = `Your Payment Request has been ${
    action !== 'upload_receipt' ? action + 'ed' : 'Finished / Receipt uploaded'
  } by ${
    reviewer
      ? appRoleToReadable[choosenRole] + ' (' + reviewer.employee_name + ')'
      : appRoleToReadable[choosenRole]
  } at ${logTime}`;

  reviewerContent = `Your have changed ${proposal.user.employee_name} payment ${payment.order} to ${action} at ${logTime}`;

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
    const reviewerWebNotifPayload: CreateNotificationDto = {
      user_id: reviewer.id,
      type: 'PROPOSAL',
      subject: subject,
      content: reviewerContent,
    };
    createWebNotifPayload.push(reviewerWebNotifPayload);
  }

  const createManyWebNotifPayload = createManyNotificationMapper({
    payloads: createWebNotifPayload,
  });

  return {
    logTime,
    subject,
    clientId: proposal.user.id,
    clientEmail: proposal.user.id,
    clientMobileNumber: proposal.user.id,
    clientContent,
    createManyWebNotifPayload,
    reviewerId: reviewer ? reviewer.id : '',
    reviewerEmail: reviewer ? reviewer.email : '',
    reviewerMobileNumber:
      reviewer && reviewer.mobile_number ? reviewer.mobile_number : '',
    reviewerContent,
  };
};
