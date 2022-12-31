import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { message, Prisma, user } from '@prisma/client';
import moment from 'moment';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { FindManyResult } from '../../../tender-commons/dto/find-many-result.dto';
import { TenderFilePayload } from '../../../tender-commons/dto/tender-file-payload.dto';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { SearchMessageFilterRequest } from '../dtos/requests/search-message-filter-request.dto';
import { SearchMessageResponseDto } from '../dtos/responses/search-message-response.dto';
import { MessageGroup } from '../interfaces/message-group';

@Injectable()
export class TenderMessagesRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderMessagesRepository.name,
  });

  constructor(
    private readonly prismaService: PrismaService,
    private readonly bunnyService: BunnyService,
  ) {}

  async createMessage(payload: Prisma.messageCreateInput): Promise<
    message & {
      sender: user | null;
      receiver: user | null;
    }
  > {
    try {
      return await this.prismaService.message.create({
        data: payload,
        include: {
          sender: true,
          receiver: true,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderMessagesRepository.name,
        'createMessage Error:',
        `creating new message!`,
      );
      throw theError;
    }
  }

  async createMessageWithAttachment(
    payload: Prisma.messageCreateInput,
    attachment: TenderFilePayload,
    buffer: Buffer,
    path: string,
  ): Promise<
    message & {
      sender: user | null;
      receiver: user | null;
    }
  > {
    let uploadedFileUrl: string = ''; // temporary variable to store the uploaded file url (for revert if transaction failed)

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const imageUrl = await this.bunnyService.uploadFileBase64(
          attachment.fullName,
          buffer,
          path,
          'Tender send message with attachment',
        );
        if (imageUrl) {
          uploadedFileUrl = imageUrl;
          payload.attachment = {
            url: imageUrl,
            type: attachment.fileExtension,
            size: buffer.length,
          };
        }

        if (!imageUrl) {
          throw new BadRequestException(
            `Failed to uploading file (${attachment.fullName}) to our server!`,
          );
        }

        const message = await prisma.message.create({
          data: payload,
          include: {
            sender: true,
            receiver: true,
          },
        });

        return message;
      });
    } catch (error) {
      // deleting the uploaded file if the message data was failed to store to the prisma, but the file was uploaded
      if (
        error instanceof Prisma.PrismaClientValidationError ||
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientRustPanicError ||
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientUnknownRequestError ||
        (error instanceof Prisma.NotFoundError && uploadedFileUrl !== '')
      ) {
        this.logger.log(
          'info',
          `Data was failed to store to the prisma!, but the file was uploaded, deleting the uploaded file!`,
        );
        await this.bunnyService.deleteMedia(uploadedFileUrl, true);
      }
      const theError = prismaErrorThrower(
        error,
        TenderMessagesRepository.name,
        'createMessageWithAttachment Error:',
        `creating new message with attachment!`,
      );
      throw theError;
    }
  }

  async findMessages(
    userId: string,
    filter: SearchMessageFilterRequest,
  ): Promise<FindManyResult<SearchMessageResponseDto>> {
    const {
      room_id,
      content,
      content_title,
      sender_id,
      page = 1,
      limit = 10,
      sort = 'desc',
      sorting_field,
      group_message = '0',
    } = filter;

    const offset = (page - 1) * limit;

    let query: Prisma.messageWhereInput = {};

    if (room_id) {
      query = {
        ...query,
        room_id: {
          equals: room_id,
        },
      };
    }

    if (content) {
      query = {
        ...query,
        content: {
          contains: content,
          mode: 'insensitive',
        },
      };
    }

    if (content_title) {
      query = {
        ...query,
        content_title: {
          contains: content_title,
          mode: 'insensitive',
        },
      };
    }

    if (sender_id) {
      query = {
        ...query,
        owner_id: {
          equals: sender_id,
        },
      };
    }

    /* to find only the user chat */
    query = {
      ...query,
      room_chat: {
        OR: [
          {
            participant1_user_id: {
              equals: userId,
            },
          },
          {
            participant2_user_id: {
              equals: userId,
            },
          },
        ],
      },
    };

    const order_by: Prisma.messageOrderByWithRelationInput = {};
    const field = sorting_field as keyof Prisma.messageOrderByWithRelationInput;
    if (sorting_field) {
      order_by[field] = sort;
    } else {
      order_by.updated_at = sort;
    }

    try {
      const messages = await this.prismaService.message.findMany({
        where: {
          ...query,
        },
        include: {
          sender: true,
          receiver: true,
        },
        skip: offset,
        take: limit,
      });

      const grouped: MessageGroup[] = [];

      if (group_message === '1') {
        for (const message of messages) {
          // if date is today or yesterday, human readable format, else day DD/MM/YYYY
          const date = moment(message.created_at).isSame(moment(), 'day')
            ? 'Today'
            : moment(message.created_at).isSame(
                moment().subtract(1, 'days'),
                'day',
              )
            ? 'Yesterday'
            : moment(message.created_at).format('dddd DD/MM/YYYY');

          const group = grouped.find((g) => g.created_at === date);
          if (group) {
            group.messages.push(message);
          } else {
            grouped.push({
              created_at: date,
              messages: [message],
            });
          }
        }
      }

      const count = await this.prismaService.message.count({
        where: {
          ...query,
        },
      });

      let logs: string = '';
      if (messages.length && grouped.length === 0) {
        logs = `${messages.length} Messages fetched`;
      }
      if (messages.length > 0 && grouped.length > 0) {
        logs = `${messages.length} Messages fetched, grouped by date to ${grouped.length} groups`;
      }

      return {
        data: {
          logs,
          messages: messages,
          grouped: grouped,
        },
        total: count,
      };
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderMessagesRepository.name,
        'findMessagesByRoomId Error:',
        `finding messages by room id!`,
      );
      throw theError;
    }
  }

  async readAllMessagesByRoomId(
    userId: string,
    roomId: string,
  ): Promise<number> {
    try {
      const result = await this.prismaService.message.updateMany({
        where: {
          room_id: {
            equals: roomId,
          },
          room_chat: {
            OR: [
              {
                participant1_user_id: {
                  equals: userId,
                },
              },
              {
                participant2_user_id: {
                  equals: userId,
                },
              },
            ],
          },
        },
        data: {
          read_status: true,
        },
      });
      // return true;
      return result.count;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderMessagesRepository.name,
        'readAllMessagesByRoomId Error:',
        `reading all messages by room id!`,
      );
      throw theError;
    }
  }
}
