import { Injectable } from '@nestjs/common';
import { message, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { FindManyResult } from '../../../tender-commons/dto/find-many-result.dto';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { SearchMessageFilterRequest } from '../dtos/requests/search-message-filter-request.dto';

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
  ): Promise<FindManyResult<message[]>> {
    const {
      room_id,
      content,
      content_title,
      sender_id,
      page = 1,
      limit = 10,
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

    try {
      const messages = await this.prismaService.message.findMany({
        where: {
          ...query,
        },
        skip: offset,
        take: limit,
      });

      const count = await this.prismaService.message.count({
        where: {
          ...query,
        },
      });

      return {
        data: messages,
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
