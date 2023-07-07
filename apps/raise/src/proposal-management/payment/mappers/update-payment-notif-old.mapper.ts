import { payment } from '@prisma/client';
import moment from 'moment';
import { CommonNotifMapperResponse } from '../../../tender-commons/dto/common-notif-mapper-response.dto';
import { CommonProposalLogNotifResponse } from '../../../tender-commons/dto/common-proposal-log-notif-response.dto';
import {
  appRoleToReadable,
  TenderAppRole,
} from '../../../tender-commons/types';
import { CreateManyNotificationDto } from '../../../notification-management/notification/dtos/requests/create-many-notification.dto';
import { CreateNotificationDto } from '../../../notification-management/notification/dtos/requests/create-notification.dto';
import { createManyNotificationMapper } from '../../../notification-management/notification/mappers/create-many-notification.mapper';

export const UpdatePaymentNotifMapperOld = (
  payment: payment,
  logs: CommonProposalLogNotifResponse['data'],
  action: 'accept' | 'reject' | 'edit' | 'upload_receipt' | 'issue',
  choosenRole: TenderAppRole,
): CommonNotifMapperResponse => {
  const { proposal, reviewer, created_at } = logs;

  const logTime = moment(created_at).format('llll');

  let subject = '';
  let clientContent = '';
  let reviewerContent = '';

  const createWebNotifPayload: CreateManyNotificationDto['payloads'] = [];

  /* disabled for pm finance and supervisor, only for cashier (payment released) */
  // if (choosenRole === 'PROJECT_MANAGER') {
  //   if (action === 'accept') subject = 'Payment Accepted By Project Manager';
  //   if (action === 'reject') subject = 'Payment Rejected By Project Manager';
  // }

  // if (choosenRole === 'FINANCE') {
  //   if (action === 'accept') subject = 'Payment Accepted Finance';
  // }

  // if (choosenRole === 'PROJECT_SUPERVISOR') {
  //   if (action === 'issue') subject = 'Payment Issued By Supervisor';
  // }

  /* client notif for payment release (payment receipt uploaded by cashier) */
  if (choosenRole === 'CASHIER' && action === 'upload_receipt') {
    // clientContent = `Your payment receipt has been uploaded by ${
    //   reviewer
    //     ? appRoleToReadable[choosenRole] + ' (' + reviewer.employee_name + ')'
    //     : appRoleToReadable[choosenRole]
    // } at ${logTime}`;
    clientContent = `مرحبًا ${proposal.user.employee_name}، نود إخبارك أن المشروع "${proposal.project_name}" تم استلام دفعة.
    يرجى التحقق من حسابك الشخصي للحصول على مزيد من المعلومات، أو انقر هنا.`;

    const clientWebNotifPayload: CreateNotificationDto = {
      user_id: proposal.user.id,
      type: 'PROPOSAL',
      specific_type: 'PAYMENT_RELEASE',
      subject: subject,
      content: clientContent,
    };

    createWebNotifPayload.push(clientWebNotifPayload);
  }

  // reviewerContent = `Your have changed ${proposal.user.employee_name} payment ${payment.order} to ${action} at ${logTime}`;

  /* disable reviewer web notif */
  // if (reviewer) {
  //   const reviewerWebNotifPayload: CreateNotificationDto = {
  //     user_id: reviewer.id,
  //     type: 'PROPOSAL',
  //     subject: subject,
  //     content: reviewerContent,
  //   };
  //   createWebNotifPayload.push(reviewerWebNotifPayload);
  // }

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
