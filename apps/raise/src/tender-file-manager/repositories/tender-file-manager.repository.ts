import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, file_manager } from '@prisma/client';
import { logUtil } from '../../commons/utils/log-util';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';
import { FetchFileManagerFilter } from '../dtos/requests';
import { Builder } from 'builder-pattern';
import { FileManagerEntity } from '../entities/file-manager.entity';
import { PayloadErrorException } from '../../tender-commons/exceptions/payload-error.exception';
export class FileManagerFetchByUrlProps {
  url: string;
}

export interface FindManyFileManagerProps {
  proposal_id?: string;
  includes_relation?: string[];
  page?: number;
  limit?: number;
  filter?: string;
  sort_direction?: string;
  sort_by?: string;
}
export class DeleteFileManagerProps {
  id?: string;
  url?: string;
}
@Injectable()
export class TenderFileManagerRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderFileManagerRepository.name,
  });

  constructor(private readonly prismaService: PrismaService) {}

  /* refactored with pass session */
  async findManyItemBudgetFilter(props: FindManyFileManagerProps) {
    const { proposal_id } = props;
    let args: Prisma.file_managerFindManyArgs = {};
    let whereClause: Prisma.file_managerWhereInput = {};

    if (proposal_id) {
      whereClause = {
        ...whereClause,
        proposal_id,
      };
    }
    args.where = whereClause;

    return args;
  }

  /* refactored with pass session */
  async findMany(
    props: FindManyFileManagerProps,
    session?: PrismaService,
  ): Promise<FileManagerEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const args = await this.findManyItemBudgetFilter(props);
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'created_at';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      let queryOptions: Prisma.file_managerFindManyArgs = {
        ...args,
        orderBy: {
          [getSortBy]: getSortDirection,
        },
      };

      if (limit > 0) {
        queryOptions = {
          ...queryOptions,
          skip: offset,
          take: limit,
        };
      }

      // console.log(logUtil(queryOptions));
      const rawFiles = await prisma.file_manager.findMany(queryOptions);

      return rawFiles.map((rawFile) => {
        return Builder<FileManagerEntity>(FileManagerEntity, {
          ...rawFile,
          size:
            rawFile.size !== null
              ? parseFloat(rawFile.size.toString())
              : undefined,
        }).build();
      });
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  /* refactored with pass session */
  async fetchByUrl(
    url: string,
    session?: PrismaService,
  ): Promise<FileManagerEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawRes = await this.prismaService.file_manager.findUnique({
        where: {
          url,
        },
      });
      if (!rawRes) return null;

      const entity = Builder<FileManagerEntity>(FileManagerEntity, {
        ...rawRes,
        size:
          rawRes.size !== null ? parseFloat(rawRes.size.toString()) : undefined,
      }).build();

      return entity;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderFileManagerRepository.name,
        'fetchByUrl error details: ',
        'finding file!',
      );
      throw theError;
    }
  }

  async delete(props: DeleteFileManagerProps, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;

    if (!props.id && !props.url) {
      throw new PayloadErrorException(`You must define atleast id or url`);
    }

    let whereArgs: Prisma.file_managerWhereUniqueInput = {};

    if (props.id) {
      whereArgs = {
        ...whereArgs,
        id: props.id,
      };
    }

    if (props.url) {
      whereArgs = {
        ...whereArgs,
        url: props.url,
      };
    }

    try {
      const res = await prisma.file_manager.delete({
        where: whereArgs,
      });

      return res;
    } catch (error) {
      throw error;
    }
  }

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
