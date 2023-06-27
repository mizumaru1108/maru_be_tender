import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { TrackEntity } from '../../tender-track/track/entities/track.entity';
import { Builder } from 'builder-pattern';
import { UserStatusEntity } from '../entity/user-status.entity';

@Injectable()
export class TenderAuthRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderAuthRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Check Existance
   */
  async checkExistance(
    phone: string = '',
    email: string = '',
    license_number: string = '',
    session?: PrismaService,
  ) {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const clause: Prisma.userWhereInput = {};
      const orClause: Prisma.userWhereInput[] = [];

      if (phone && phone !== '') {
        orClause.push({
          mobile_number: phone,
        });
      }

      if (email && email !== '') {
        orClause.push({
          email: {
            contains: email,
            mode: 'insensitive',
          },
        });
      }

      if (license_number && license_number !== '') {
        orClause.push({
          client_data: {
            license_number: {
              contains: license_number,
              mode: 'insensitive',
            },
          },
        });
      }

      clause.OR = orClause;

      // console.log(logUtil(clause));
      const result = await prisma.user.findFirst({
        where: clause,
      });
      // console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async validateTrack(track_id: string): Promise<TrackEntity | null> {
    try {
      const rawRes = await this.prismaService.track.findFirst({
        where: {
          id: track_id,
          name: { notIn: ['GENERAL'] },
        },
      });

      const trackEntity = Builder<TrackEntity>(TrackEntity, {
        ...rawRes,
      }).build();

      return trackEntity;
    } catch (error) {
      console.trace(error);
      this.logger.log('info', error);
      throw error;
    }
  }

  async validateStatus(status: string): Promise<UserStatusEntity | null> {
    try {
      const rawRes = await this.prismaService.user_status.findUnique({
        where: { id: status },
      });

      const userStatusEntity = Builder<UserStatusEntity>(UserStatusEntity, {
        ...rawRes,
      }).build();

      return userStatusEntity;
    } catch (error) {
      console.trace(error);
      this.logger.log('info', error);
      throw error;
    }
  }
}
