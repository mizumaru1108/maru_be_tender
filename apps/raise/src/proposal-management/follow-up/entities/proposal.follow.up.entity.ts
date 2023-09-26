import { AggregateRoot } from '@nestjs/cqrs';
import { UserEntity } from '../../../tender-user/user/entities/user.entity';
import {
  ISendNotificaitonEvent,
  ProposalEntity,
} from '../../proposal/entities/proposal.entity';
import { Builder } from 'builder-pattern';
import { CreateNotificationEvent } from 'src/notification-management/notification/event/create.notification.event';

export class ProposalFollowUpEntity extends AggregateRoot {
  id: string;
  proposal_id: string;
  created_at: Date | null;
  updated_at?: Date | null;
  attachments?: any; // json
  content?: string | null;
  user_id: string;
  submitter_role: string;
  employee_only: boolean;
  user: UserEntity;
  proposal?: ProposalEntity;

  sendNotificaitonEvent(props: ISendNotificaitonEvent) {
    const eventBuilder = Builder<CreateNotificationEvent>(
      CreateNotificationEvent,
      {
        type: props.notif_type,
        user_id: props.user_id,
        content: props.content,
        subject: props.subject,
        email: props.user_email,
        email_sender: 'no-reply@hcharity.org',
        phone_number: props.user_phone,
        email_type: props.email_type,
        emailTemplateContext: props.emailTemplateContext,
        emailTemplatePath: props.emailTemplatePath,
      },
    );
    this.apply(eventBuilder.build());
  }
}
