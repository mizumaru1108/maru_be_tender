import { Injectable } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';
import { CorrespondanceType } from '../../tender-message/types';
import { Prisma } from '@prisma/client';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';

@Injectable()
export class TenderRoomChatRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderRoomChatRepository.name,
  });

  constructor(private prismaService: PrismaService) {}

  async findOurRoomChat(userId: string, partnerId: string) {
    this.logger.info(
      'info',
      `finding room chat between you (${userId}) and your partner (${partnerId})!`,
    );
    try {
      return await this.prismaService.room_chat.findFirst({
        where: {
          AND: [
            {
              OR: [
                { participant1_user_id: userId },
                { participant2_user_id: userId },
              ],
            },
            {
              OR: [
                { participant1_user_id: partnerId },
                { participant2_user_id: partnerId },
              ],
            },
          ],
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderRoomChatRepository.name,
        'findOurRoomChat Error:',
        `finding room chat between you and your partner!`,
      );
      throw theError;
    }
  }

  async createRoomChat(
    userId: string,
    partnerId: string,
    correspondanceType: CorrespondanceType,
  ) {
    this.logger.info(
      'info',
      `creating room chat between you (${userId}) and your partner (${partnerId})!`,
    );
    try {
      return await this.prismaService.room_chat.create({
        data: {
          id: uuidv4(),
          correspondance_category_id: correspondanceType as string,
          participant1_user_id: userId,
          participant2_user_id: partnerId,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderRoomChatRepository.name,
        'createRoomChat Error:',
        `creating room chat between you and your partner!`,
      );
      throw theError;
    }
  }

  async fetchLastChat(userId: string, limit: number, page: number) {
    const offset = (page - 1) * limit;
    let query: Prisma.room_chatWhereInput = {};

    query = {
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
    };

    try {
      const messages = await this.prismaService.room_chat.findMany({
        where: {
          ...query,
        },
        select: {
          message: {
            orderBy: {
              created_at: 'desc',
            },
            take: 1,
          },
        },
        take: limit,
        skip: offset,
      });

      const count = await this.prismaService.room_chat.count({
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
        TenderRoomChatRepository.name,
        'fetchLastChat Error:',
        `finding the last message on your room chat!`,
      );
      throw theError;
    }
  }
}
