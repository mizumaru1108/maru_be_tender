import { Injectable } from '@nestjs/common';
import { message, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';
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

  async findMessages(userId: string, filter: SearchMessageFilterRequest) {
    const { room_id, page = 1, limit = 10 } = filter;
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

      const count = await this.prismaService.user.count({
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

  // async fetchLastChat(userId: string, limit: number, page: number) {
  //   const offset = (page - 1) * limit;
  //   let query: Prisma.messageWhereInput = {};

  //   /* to find only the user chat */
  //   query = {
  //     room_chat: {
  //       OR: [
  //         {
  //           participant1_user_id: {
  //             equals: userId,
  //           },
  //         },
  //         {
  //           participant2_user_id: {
  //             equals: userId,
  //           },
  //         },
  //       ],
  //     },
  //   };

  //   try {
  //     const messages = await this.prismaService.message.findMany({
  //       where: {
  //         ...query,
  //       },
  //       skip: offset,
  //       take: limit,
  //       orderBy: {
  //         created_at: 'desc',
  //       },
  //       select: {

  //       },
  //     });

  //     const count = await this.prismaService.user.count({
  //       where: {
  //         ...query,
  //       },
  //     });

  //     return {
  //       data: messages,
  //       total: count,
  //     };
  //   } catch (error) {
  //     const theError = prismaErrorThrower(
  //       error,
  //       TenderMessagesRepository.name,
  //       'findMessagesByRoomId Error:',
  //       `finding messages by room id!`,
  //     );
  //     throw theError;
  //   }
  // }

  async fetchLastChat(userId: string, limit: number, page: number) {
    const offset = (page - 1) * limit;
    let query: Prisma.messageWhereInput = {};

    try {
      const messages = await this.prismaService.room_chat.findMany({
        where: {
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
        select: {
          message: true,
        },
      });

      const count = await this.prismaService.user.count({
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
