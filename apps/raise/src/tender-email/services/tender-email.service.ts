import { Injectable, UseGuards } from '@nestjs/common';
import { email_record, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { SendEmailDto } from '../../libs/email/dtos/requests/send-email.dto';
import { EmailService } from '../../libs/email/email.service';
import { FindManyResult } from '../../tender-commons/dto/find-many-result.dto';
import { EmailFilterRequest } from '../dtos/requests/email-filter-request.dto';
import { SendNewEmailDto } from '../dtos/requests/send-new-email.dto';
import { TenderEmailRepository } from '../repositories/tender-email.repository';

@Injectable()
export class TenderEmailService {
  constructor(
    private readonly emailService: EmailService,
    private readonly tenderEmailRepository: TenderEmailRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  async send(userId: string, request: SendNewEmailDto): Promise<email_record> {
    const { title, email, content, receiver_id } = request;
    const emailPayload: SendEmailDto = {
      to: email,
      subject: title,
      mailType: 'plain',
      content,
    };

    // LATER ON
    // !TODO: use REDIS to queue (use consumer to add the task of sending email, if queue fail, retry) -> (use bull module)
    // const emailResponse = await this.emailService.sendMail(emailPayload);
    // console.log('emailResponse', emailResponse.messageId);
    const emailRecordPayload: Prisma.email_recordCreateArgs = {
      data: {
        title,
        content,
        sender: {
          connect: {
            id: userId,
          },
        },
        receiver: {
          connect: {
            id: receiver_id,
          },
        },
      },
    };

    const createdRecord = await this.tenderEmailRepository.createNewEmailRecord(
      emailRecordPayload,
    );

    this.emailService.sendMail(emailPayload);

    return createdRecord;
  }

  async getMyInbox(
    userId: string,
    searchParams: EmailFilterRequest,
  ): Promise<FindManyResult<email_record[]>> {
    searchParams.receiver_id = userId;
    const result = await this.tenderEmailRepository.findMany(searchParams);
    return result;
  }

  async getMyOutbox(
    userId: string,
    searchParams: EmailFilterRequest,
  ): Promise<FindManyResult<email_record[]>> {
    searchParams.sender_id = userId;
    const result = await this.tenderEmailRepository.findMany(searchParams);
    return result;
  }
}
