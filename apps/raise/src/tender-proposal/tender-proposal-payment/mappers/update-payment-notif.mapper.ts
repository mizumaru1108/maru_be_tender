import { cheque, payment } from '@prisma/client';
import moment from 'moment';
import { CommonNotificationMapperResponse } from '../../../tender-commons/dto/common-notification-mapper-response.dto';
import { CommonProposalLogNotifResponse } from '../../../tender-commons/dto/common-proposal-log-notif-response.dto';
import {
  TenderAppRole,
  appRoleToReadable,
} from '../../../tender-commons/types';
import { CreateManyNotificationDto } from '../../../tender-notification/dtos/requests/create-many-notification.dto';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { createManyNotificationMapper } from '../../../tender-notification/mappers/create-many-notification.mapper';

export const UpdatePaymentNotifMapper = (
  payment: payment,
  logs: CommonProposalLogNotifResponse['data'],
  action: 'accept' | 'reject' | 'edit' | 'upload_receipt' | 'issue',
  choosenRole: TenderAppRole,
  cheque: cheque | null,
  selectLang?: 'ar' | 'en',
): CommonNotificationMapperResponse => {
  const { proposal, reviewer, created_at } = logs;

  const logTime = moment(created_at).format('llll');

  let subject = '';
  let clientContent = '';
  let clientEmailTemplatePath: string | undefined = undefined;
  let clientEmailTemplateContext: Record<string, any>[] | undefined = undefined;
  let reviewerContent: string | undefined = undefined;
  let reviewerEmailTemplatePath: string | undefined = undefined;
  let reviewerEmailTemplateContext: Record<string, any>[] | undefined =
    undefined;

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
  if (
    choosenRole === 'CASHIER' &&
    action === 'upload_receipt' &&
    cheque !== null
  ) {
    subject = 'New Payment Release';
    clientContent = `Your payment receipt has been uploaded by ${
      reviewer
        ? appRoleToReadable[choosenRole] + ' (' + reviewer.employee_name + ')'
        : appRoleToReadable[choosenRole]
    } at ${logTime}`;

    const clientWebNotifPayload: CreateNotificationDto = {
      user_id: proposal.user.id,
      type: 'PROPOSAL',
      specific_type: 'PAYMENT_RELEASE',
      subject: subject,
      content: clientContent,
    };

    if (clientEmailTemplatePath === undefined) {
      clientEmailTemplatePath = `tender/${
        selectLang || 'ar'
      }/proposal/new_upload_receipt`;
    }

    let chequeLink: string = '#';

    if (cheque.transfer_receipt !== undefined && cheque.transfer_receipt) {
      const tmp: any = cheque.transfer_receipt;
      if (tmp['url'] !== undefined) chequeLink = tmp['url'];
    }

    if (clientEmailTemplateContext === undefined) {
      clientEmailTemplateContext = [
        {
          projectName: proposal.project_name,
          clientName: proposal.user.employee_name,
          paymentPageLink: chequeLink,
        },
      ];
    }

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
    clientSubject: subject,
    clientId: [proposal.user.id],
    clientEmail: [proposal.user.email],
    clientMobileNumber: [proposal.user.mobile_number || ''],
    clientContent,
    createManyWebNotifPayload,
    clientEmailTemplatePath,
    clientEmailTemplateContext,
    reviewerId: [reviewer ? reviewer.id : ''],
    reviewerEmail: [reviewer ? reviewer.email : ''],
    reviewerMobileNumber: [
      reviewer && reviewer.mobile_number ? reviewer.mobile_number : '',
    ],
    reviewerContent,
    reviewerEmailTemplateContext,
    reviewerEmailTemplatePath,
  };
};
