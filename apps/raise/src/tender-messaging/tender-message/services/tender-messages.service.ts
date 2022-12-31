import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { message, Prisma, room_chat, user } from '@prisma/client';
import { AllowedFileType } from '../../../commons/enums/allowed-filetype.enum';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import { validateAllowedExtension } from '../../../commons/utils/validate-allowed-extension';
import { validateFileSize } from '../../../commons/utils/validate-file-size';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import {
  appRoleMappers,
  appRoleToFusionAuthRoles,
  TenderAppRole,
  TenderFusionAuthRoles,
} from '../../../tender-commons/types';

import { TenderUserRepository } from '../../../tender-user/user/repositories/tender-user.repository';
import { TenderRoomChatRepository } from '../../tender-room-chat/repositories/tender-room-chat.repository';
import { CreateMessageDto } from '../dtos/requests/create-message.dto';
import { SearchMessageFilterRequest } from '../dtos/requests/search-message-filter-request.dto';
import { IIncomingMessageSummary } from '../interfaces/incomming-message';
import { createMessageMapper } from '../mappers/create-message.mapper';
import { TenderMessagesRepository } from '../repositories/tender-messages.repository';

@Injectable()
export class TenderMessagesService {
  private readonly appEnv: string;
  constructor(
    private readonly tenderMessagesRepository: TenderMessagesRepository,
    private readonly tenderRoomChatRepository: TenderRoomChatRepository,
    private readonly tenderUserRepository: TenderUserRepository,
    private readonly configService: ConfigService,
  ) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;
  }

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
    let validUserRole = appRoleMappers[userRole as TenderFusionAuthRoles];
    if (!validUserRole) {
      throw new BadRequestException('You do not have this role!');
    }
    if (
      sender.roles.map((role) => role.user_type_id).indexOf(validUserRole) ===
      -1
    ) {
      throw new BadRequestException('You do not have this role!');
    }

    const partner = await this.tenderUserRepository.findUserById(partner_id);
    if (!partner) throw new BadRequestException('Partner not found!');

    const partnerRole: string[] = partner.roles.map(
      (role) => role.user_type_id,
    );
    let validPartnerRole =
      appRoleMappers[partnerSelectedRole as TenderFusionAuthRoles];
    if (!validPartnerRole) {
      throw new BadRequestException('Partner does not have this role!');
    }
    if (partnerRole.indexOf(validPartnerRole) === -1) {
      throw new BadRequestException('Your partner does not have this role!');
    }

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

    const createMessagePayload = createMessageMapper(
      senderId,
      roomChat.id,
      request,
    );

    let createdMessage:
      | (message & {
          sender: user | null;
          receiver: user | null;
        })
      | null = null;

    if (contentType === 'TEXT') {
      const message = await this.tenderMessagesRepository.createMessage(
        createMessagePayload,
      );
      createdMessage = message;
    }

    if (attachment && contentType !== 'TEXT') {
      const maxSize: number = 1024 * 1024 * 512; // 512MB
      const allowedType: AllowedFileType[] = [];

      // 'TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE'
      if (contentType === 'IMAGE') {
        allowedType.push(AllowedFileType.JPG);
        allowedType.push(AllowedFileType.JPEG);
        allowedType.push(AllowedFileType.PNG);
      } else if (contentType === 'VIDEO') {
        allowedType.push(AllowedFileType.MP4);
        allowedType.push(AllowedFileType.MOV);
      } else if (contentType === 'AUDIO') {
        allowedType.push(AllowedFileType.MP3);
        allowedType.push(AllowedFileType.WAV);
      } else if (contentType === 'FILE') {
        allowedType.push(AllowedFileType.JPG);
        allowedType.push(AllowedFileType.JPEG);
        allowedType.push(AllowedFileType.PNG);
        allowedType.push(AllowedFileType.MP4);
        allowedType.push(AllowedFileType.MOV);
        allowedType.push(AllowedFileType.MP3);
        allowedType.push(AllowedFileType.WAV);
        allowedType.push(AllowedFileType.PDF);
        allowedType.push(AllowedFileType.DOC);
        allowedType.push(AllowedFileType.DOCX);
        allowedType.push(AllowedFileType.XLS);
        allowedType.push(AllowedFileType.XLSX);
        allowedType.push(AllowedFileType.PPT);
        allowedType.push(AllowedFileType.PPTX);
      }

      let fileName =
        attachment.fullName +
        new Date().getTime() +
        '.' +
        attachment.fileExtension.split('/')[1];

      let path = `tmra/${this.appEnv}/organization/tender-management/room-chat-attachment/${roomChat.id}/${fileName}`;

      validateAllowedExtension(attachment.fileExtension, allowedType);
      validateFileSize(attachment.base64Data.length, maxSize);

      const buffer = Buffer.from(
        attachment.base64Data.replace(/^data:.*;base64,/, ''),
        'base64',
      );

      const message =
        await this.tenderMessagesRepository.createMessageWithAttachment(
          createMessagePayload,
          attachment,
          buffer,
          path,
        );
      createdMessage = message;
    }

    const summary: IIncomingMessageSummary = {
      messageId: createdMessage ? createdMessage.id : '', // it shouldnt be "", but if the request fail it wont get here, so it will be exist for sure
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
      content:
        createdMessage && createdMessage.content
          ? createdMessage.content
          : null,
      attachment:
        createdMessage && createdMessage.attachment
          ? (createdMessage.attachment as {
              url: string;
              size: number;
              type: string;
            })
          : null,
    };

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

  async readAllMessageByRoomId(
    userId: string,
    roomId: string,
  ): Promise<number> {
    return await this.tenderMessagesRepository.readAllMessagesByRoomId(
      userId,
      roomId,
    );
  }
}
