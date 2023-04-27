import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, file_manager } from '@prisma/client';
import { logUtil } from '../../commons/utils/log-util';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';
import { FetchFileManagerFilter } from '../dtos/requests';

@Injectable()
export class TenderFileManagerRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderFileManagerRepository.name,
  });

  constructor(private readonly prismaService: PrismaService) {}

  async create(
    payload: Prisma.file_managerUncheckedCreateInput,
  ): Promise<file_manager> {
    this.logger.log(
      'log',
      `Creating new file manager for user ${
        payload.user_id
      } with payload: ${logUtil(payload)}`,
    );
    try {
      const createdFile = await this.prismaService.file_manager.create({
        data: {
          ...payload,
        },
      });
      this.logger.log('info', 'File manager created successfully');
      return createdFile;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderFileManagerRepository.name,
        'Creating new file manager Error:',
        `validating roles!`,
      );
      throw theError;
    }
  }

  async createMany(
    payload: Prisma.file_managerCreateManyInput[],
  ): Promise<any> {
    this.logger.log(
      'log',
      `Creating new file manager for user ${
        payload[0].user_id
      } with payload: ${logUtil(payload)}`,
    );
    try {
      const createdFiles = await this.prismaService.file_manager.createMany({
        data: payload,
      });
      this.logger.log('info', 'File manager created successfully');
      return createdFiles;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderFileManagerRepository.name,
        'Creating new file manager Error:',
        `validating roles!`,
      );
      throw theError;
    }
  }

  async findByUrl(url: string): Promise<file_manager | null> {
    try {
      return await this.prismaService.file_manager.findUnique({
        where: {
          url,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderFileManagerRepository.name,
        'find file by url error details: ',
        'finding file!',
      );
      throw theError;
    }
  }

  async fetchAll(
    currentUser: TenderCurrentUser,
    filter: FetchFileManagerFilter,
  ) {
    try {
      const {
        file_name,
        page = 1,
        limit = 10,
        sort = 'desc',
        sorting_field,
      } = filter;
      const offset = (page - 1) * limit;

      let whereClause: Prisma.file_managerWhereInput = {};

      if (currentUser.choosenRole === 'tender_client') {
        whereClause = {
          ...whereClause,
          user_id: currentUser.id,
        };
      }

      if (file_name) {
        whereClause = {
          ...whereClause,
          name: {
            contains: file_name,
            mode: 'insensitive',
          },
        };
      }

      const order_by: Prisma.file_managerOrderByWithRelationInput = {};
      const field =
        sorting_field as keyof Prisma.file_managerOrderByWithRelationInput;
      if (sorting_field) {
        order_by[field] = sort;
      } else {
        order_by.created_at = sort;
      }

      const data = await this.prismaService.file_manager.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: order_by,
      });

      const total = await this.prismaService.file_manager.count({
        where: whereClause,
      });

      return {
        data,
        total,
      };
    } catch (err) {
      console.trace(err);
      throw new InternalServerErrorException(
        'Something went wrong when fetching file manager!',
      );
    }
  }
}
