import moment from 'moment';
import { CommonNotifMapperResponse } from '../../../tender-commons/dto/common-notif-mapper-response.dto';
import { CommonProposalLogNotifResponse } from '../../../tender-commons/dto/common-proposal-log-notif-response.dto';
import { CreateManyNotificationDto } from '../../../tender-notification/dtos/requests/create-many-notification.dto';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { createManyNotificationMapper } from '../../../tender-notification/mappers/create-many-notification.mapper';

export const NewAmandementNotifMapper = (
  logs: CommonProposalLogNotifResponse['data'],
): CommonNotifMapperResponse => {
  const { proposal, reviewer, created_at } = logs;

  const logTime = moment(created_at).format('llll');

  const subject = `New Amandement Request`;

  const clientContent = `Your proposal ${
    proposal.project_name
  } has been asked for revision by ${
    reviewer ? 'Supervisor (' + reviewer.employee_name + ')' : 'Supervisor'
  } at ${logTime}`;

  const reviewerContent = `Successfully send amandement request for project ${proposal.project_name} to ${proposal.user.employee_name} at ${logTime}`;

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
