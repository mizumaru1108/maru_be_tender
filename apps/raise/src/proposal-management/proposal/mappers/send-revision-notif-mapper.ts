import moment from 'moment';
import { CommonProposalLogNotifResponse } from '../../../tender-commons/dto/common-proposal-log-notif-response.dto';
import { CommonNotificationMapperResponse } from '../../../tender-commons/dto/common-notification-mapper-response.dto';
import { CreateManyNotificationDto } from '../../../notification-management/notification/dtos/requests/create-many-notification.dto';
import { CreateNotificationDto } from '../../../notification-management/notification/dtos/requests/create-notification.dto';
import { createManyNotificationMapper } from '../../../notification-management/notification/mappers/create-many-notification.mapper';

export const SendRevisionNotifMapper = (
  proposal_id: string,
  logs: CommonProposalLogNotifResponse['data'],
  redirectLink: string,
): CommonNotificationMapperResponse => {
  const { proposal, reviewer, created_at } = logs;

  const logTime = moment(created_at).format('llll');

  const subject = `Proposal Revision`;

  // const clientContent = `Your proposal ${proposal.project_name} has been revised and successfully back to track to be reviewed (at ${logTime})`;

  let reviewerContent = `Proposal ${proposal.project_name} has been revised by ${proposal.user.employee_name} at ${logTime}`;
  // const clientWebNotifPayload: CreateNotificationDto = {
  //   user_id: proposal.user.id,
  //   type: 'PROPOSAL',
  //   subject: subject + 'Successfully Sent!',
  //   content: clientContent,
  // };

  const createWebNotifPayload: CreateManyNotificationDto['payloads'] = [];

  if (reviewer) {
    const supervisorWebNotifPayload: CreateNotificationDto = {
      user_id: reviewer.id,
      type: 'PROPOSAL',
      specific_type: 'REVISED_VERSION_SENT_BY_CLIENT',
      proposal_id,
      subject: subject + 'Sended By Client',
      content: reviewerContent,
    };
    createWebNotifPayload.push(supervisorWebNotifPayload);

    reviewerContent += `, click <a href='${redirectLink}/project-supervisor/dashboard/requests-in-process/${proposal_id}/show-project'>here</a> to view the proposal`;
  }

  const createManyWebNotifPayload = createManyNotificationMapper({
    payloads: createWebNotifPayload,
  });

  return {
    logTime,
    clientSubject: subject,
    clientId: [],
    clientEmail: [],
    clientMobileNumber: [],
    clientContent: '',
    createManyWebNotifPayload,
    reviewerId: reviewer ? [reviewer.id] : [],
    reviewerEmail: reviewer ? [reviewer.email] : [],
    reviewerMobileNumber:
      reviewer && reviewer.mobile_number ? [reviewer.mobile_number] : [],
    reviewerContent,
  };
};
