import { BadRequestException, Injectable } from '@nestjs/common';
import { room_chat } from '@prisma/client';
import { TenderFusionAuthRoles } from '../../../tender-commons/types';

import { TenderUserRepository } from '../../../tender-user/user/repositories/tender-user.repository';
import { TenderRoomChatRepository } from '../../tender-room-chat/repositories/tender-room-chat.repository';
import { CreateMessageDto } from '../dtos/requests/create-message.dto';
import { SearchMessageFilterRequest } from '../dtos/requests/search-message-filter-request.dto';
import { IIncomingMessageSummary } from '../interfaces/incomming-message';
import { createMessageMapper } from '../mappers/create-message.mapper';
import { TenderMessagesRepository } from '../repositories/tender-messages.repository';

@Injectable()
export class TenderMessagesService {
  constructor(
    private readonly tenderMessagesRepository: TenderMessagesRepository,
    private readonly tenderRoomChatRepository: TenderRoomChatRepository,
    private readonly tenderUserRepository: TenderUserRepository,
  ) {}

  async send(
    senderId: string,
    userRole: TenderFusionAuthRoles,
    request: CreateMessageDto,
  ): Promise<IIncomingMessageSummary> {
    const {
      partner_id,
      correspondence_type_id: correspondanceType,
      content_type_id: contentType,
      content,
      attachment,
      partner_selected_role: partnerSelectedRole,
    } = request;

    if (contentType === 'TEXT' && !content) {
      throw new BadRequestException('Content is required!');
    }

    if (contentType !== 'TEXT' && !attachment) {
      throw new BadRequestException('Attachment is required!');
    }

    const sender = await this.tenderUserRepository.findUserById(senderId);
    if (!sender) throw new BadRequestException('Sender not found!');

    const partner = await this.tenderUserRepository.findUserById(partner_id);
    if (!partner) throw new BadRequestException('Partner not found!');

    const partnerRole: string[] = partner.roles.map(
      (role) => role.user_type_id,
    );

    if (
      (correspondanceType === 'INTERNAL' &&
        partnerRole.indexOf('CLIENT') > -1) ||
      (correspondanceType === 'INTERNAL' &&
        partnerSelectedRole === 'tender_client') ||
      (correspondanceType === 'EXTERNAL' &&
        partnerRole.indexOf('CLIENT') === -1) ||
      (correspondanceType === 'EXTERNAL' &&
        partnerSelectedRole !== 'tender_client')
    ) {
      throw new BadRequestException(
        `Your partner is not ${
          correspondanceType === 'INTERNAL'
            ? 'an administrative account!'
            : 'a client!'
        }`,
      );
    }

    if (
      [
        'tender_project_manager',
        'tender_consultant',
        'tender_ceo',
        'tender_finance',
      ].indexOf(userRole) > -1 &&
      correspondanceType === 'EXTERNAL'
    ) {
      throw new BadRequestException(
        'You can only send message to Internal Correspondance (other administrative account)!',
      );
    }

    let roomChat: room_chat;

    const existingRoomChat =
      await this.tenderRoomChatRepository.findOurRoomChat(senderId, partner_id);

    if (!existingRoomChat) {
      if (userRole === 'tender_client') {
        throw new BadRequestException("You can't start a new message!");
      }
      const newRoomChat = await this.tenderRoomChatRepository.createRoomChat(
        senderId,
        partner_id,
        correspondanceType,
      );
      roomChat = newRoomChat;
    } else {
      roomChat = existingRoomChat;
    }

    const createMessagePaylaod = createMessageMapper(
      senderId,
      roomChat.id,
      request,
    );

    const message = await this.tenderMessagesRepository.createMessage(
      createMessagePaylaod,
    );

    const summary: IIncomingMessageSummary = {
      senderId: sender.id,
      senderRoles: sender.roles.map((role) => role.user_type_id),
      senderRolesAs: userRole,
      senderEmployeeName: sender.employee_name || null,
      receiverId: partner.id,
      receiverRoles: partner.roles.map((role) => role.user_type_id),
      receiverRolesAs: partnerSelectedRole,
      receiverEmployeeName: partner.employee_name || null,
      roomChatId: roomChat.id,
      correspondenceType: correspondanceType,
      meesageType: contentType,
      content: content || null,
      attachment: null,
    };

    /* emit event on socket */
    // await this.eventGateway.emitIncomingMessage(summary); // emit to sender

    return summary;
  }

  async findMessages(userId: string, filter: SearchMessageFilterRequest) {
    const { sorting_field } = filter;
    if (
      sorting_field &&
      ['created_at', 'updated_at'].indexOf(sorting_field) === -1
    ) {
      throw new BadRequestException(
        `Sorting field by ${sorting_field} is not allowed!`,
      );
    }
    const response = await this.tenderMessagesRepository.findMessages(
      userId,
      filter,
    );
    return response;
  }
}
