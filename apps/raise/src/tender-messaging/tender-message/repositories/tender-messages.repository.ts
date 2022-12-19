import { Injectable } from '@nestjs/common';
import { message, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { FindManyResult } from '../../../tender-commons/dto/find-many-result.dto';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { SearchMessageFilterRequest } from '../dtos/requests/search-message-filter-request.dto';
import _ from 'lodash';
import moment from 'moment';
import { MessageGroup } from '../interfaces/message-group';
import { SearchMessageResponseDto } from '../dtos/responses/search-message-response.dto';

@Injectable()
export class TenderMessagesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createMessage(payload: Prisma.messageCreateInput): Promise<message> {
    try {
      return await this.prismaService.message.create({
        data: payload,
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
}
