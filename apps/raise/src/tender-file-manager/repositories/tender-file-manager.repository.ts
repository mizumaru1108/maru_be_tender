import { Injectable } from '@nestjs/common';
import { file_manager, Prisma } from '@prisma/client';
import { logUtil } from '../../commons/utils/log-util';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';

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
      this.logger.log('log', 'File manager created successfully');
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
      this.logger.log('log', 'File manager created successfully');
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
}
