import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { PayloadErrorException } from '../../../tender-commons/exceptions/payload-error.exception';
import { ContactUsEntity } from '../../entities/contact.us.entity';
import { ContactUsInquiryEnum } from '../../types/contact.us.type';
import {
  ContactUsCreateProps,
  ContactUsRepository,
} from '../../repositories/contact.us.repository';
export class ContactUsCreateCommand {
  inquiry_type: ContactUsInquiryEnum;
  submitter_user_id: string;
  title?: string;
  message?: string;
  date_of_visit?: number;
  reason_visit?: string;
  proposal_id?: string;
}

export class ContactUsCreateCommandResult {
  created_entity: ContactUsEntity;
}

@CommandHandler(ContactUsCreateCommand)
export class ContactUsCreateCommandHandler
  implements
    ICommandHandler<ContactUsCreateCommand, ContactUsCreateCommandResult>
{
  constructor(private readonly contactUsRepo: ContactUsRepository) {}

  async execute(
    command: ContactUsCreateCommand,
  ): Promise<ContactUsCreateCommandResult> {
    const {
      inquiry_type,
      title,
      message,
      date_of_visit,
      reason_visit,
      submitter_user_id,
      proposal_id,
    } = command;
    try {
      if (
        inquiry_type === ContactUsInquiryEnum.PROJECT_INQUIRIES &&
        proposal_id === undefined
      ) {
        throw new PayloadErrorException(
          `Proposal Id is Required when type is PROJECT_INQUIRIES!`,
        );
      }

      if (
        [
          ContactUsInquiryEnum.PROJECT_INQUIRIES,
          ContactUsInquiryEnum.GENERAL,
        ].indexOf(inquiry_type) > 0
      )
        if (title === undefined) {
          throw new PayloadErrorException(
            `Proposal Id is Required when type is PROJECT_INQUIRIES/GENERAL!`,
          );
        }
      if (message === undefined) {
        throw new PayloadErrorException(
          `Proposal Id is Required when type is PROJECT_INQUIRIES/GENERAL!`,
        );
      }

      if (inquiry_type === ContactUsInquiryEnum.VISITATION) {
        if (date_of_visit === undefined) {
          throw new PayloadErrorException(
            `Date of visit is Required when type is VISITATION!`,
          );
        }
        if (reason_visit === undefined) {
          throw new PayloadErrorException(
            `Reason is Required when type is VISITATION!`,
          );
        }
      }

      const createPayload = Builder<ContactUsCreateProps>(
        ContactUsCreateProps,
        {
          inquiry_type,
          submitter_user_id,
          proposal_id,
          title,
          message,
          date_of_visit,
          reason_visit,
        },
      ).build();

      const res = await this.contactUsRepo.create(createPayload);
      return {
        created_entity: res,
      };
    } catch (error) {
      throw error;
    }
  }
}
