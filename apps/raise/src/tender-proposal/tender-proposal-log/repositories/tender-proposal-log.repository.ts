import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, proposal_log } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../../prisma/prisma.service';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { ProposalLogEntity } from '../entities/proposal-log.entity';
import { FindOneProposalIdentifierError } from '../exceptions/find-one-proposal-identifier-error.exceptions';
export interface FindOneProposalLogProps {
  id?: string;
  proposal_id?: string;
  includes_relation?: string[];
}
export interface FindManyLogProps {
  proposal_id?: string;
  includes_relation?: string[];
  page?: number;
  limit?: number;
  filter?: string;
  sort_direction?: string;
  sort_by?: string;
}

export interface CreateProposalLogProps {
  proposal_id: string;
  state: string;
  id?: string; // in case that it is predefined, otherwise we can use the default nanoid();
  user_role?: string;
  action?: string;
  reject_reason?: string;
}

@Injectable()
export class TenderProposalLogRepository {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectPinoLogger(TenderProposalLogRepository.name)
    private logger: PinoLogger,
  ) {}

  async findOneProposalFilter(props: FindOneProposalLogProps) {
    const { id, proposal_id, includes_relation } = props;
    if (!id && !proposal_id) throw new FindOneProposalIdentifierError();

    let args: Prisma.proposal_logFindFirstArgs = {};
    let whereClause: Prisma.proposal_logWhereInput = {};
    if (id) {
      whereClause = {
        ...whereClause,
        id,
      };
    }

    if (proposal_id) {
      whereClause = {
        ...whereClause,
        proposal_id,
      };
    }

    if (includes_relation && includes_relation.length > 0) {
      let include: Prisma.proposal_logInclude = {};

      for (const relation of includes_relation) {
        if (relation === 'proposal') {
          include = {
            ...include,
            proposal: {
              select: {
                id: true,
                project_name: true,
                submitter_user_id: true,
                user: {
                  select: {
                    employee_name: true,
                    email: true,
                    mobile_number: true,
                  },
                },
              },
            },
          };
        }

        if (relation === 'reviewer') {
          include = {
            ...include,
            reviewer: {
              select: {
                employee_name: true,
                email: true,
                mobile_number: true,
              },
            },
          };
        }
      }

      args.include = include;
    }

    args.where = whereClause;

    return args;
  }

  async findManyProposalFilter(props: FindManyLogProps) {
    const { proposal_id, includes_relation } = props;
    let args: Prisma.proposal_logFindManyArgs = {};
    let whereClause: Prisma.proposal_logWhereInput = {};

    if (proposal_id) {
      whereClause = {
        ...whereClause,
        proposal_id,
      };
    }

    if (includes_relation && includes_relation.length > 0) {
      let include: Prisma.proposal_logInclude = {};

      for (const relation of includes_relation) {
        if (relation === 'proposal') {
          include = {
            ...include,
            proposal: {
              select: {
                id: true,
                project_name: true,
                submitter_user_id: true,
                user: {
                  select: {
                    employee_name: true,
                    email: true,
                    mobile_number: true,
                  },
                },
              },
            },
          };
        }

        if (relation === 'reviewer') {
          include = {
            ...include,
            reviewer: {
              select: {
                employee_name: true,
                email: true,
                mobile_number: true,
              },
            },
          };
        }
      }

      args.include = include;
    }

    args.where = whereClause;

    return args;
  }

  async create(
    props: CreateProposalLogProps,
    session?: PrismaService,
  ): Promise<ProposalLogEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawResult = await prisma.proposal_log.create({
        data: {
          id: props.id || nanoid(),
          proposal_id: props.proposal_id,
          action: props.action,
          state: props.state,
          user_role: props.user_role,
          reject_reason: props.reject_reason,
        },
      });

      return Builder<ProposalLogEntity>(ProposalLogEntity, rawResult).build();
    } catch (error) {
      this.logger.info(`error on creating proposal logs ${error}`);
      throw error;
    }
  }

  async createLog(
    createPayload: Prisma.proposal_logCreateArgs,
  ): Promise<proposal_log> {
    this.logger.info('creating log');
    try {
      return await this.prismaService.proposal_log.create(createPayload);
    } catch (error) {
      console.trace(error);
      throw new InternalServerErrorException(
        'Something went wrong when creating proposal logs!',
      );
    }
  }

  async findProposalLogByid(proposal_log_id: string): Promise<
    | (proposal_log & {
        proposal: {
          id: string;
          project_name: string;
          submitter_user_id: string;
          user: {
            employee_name: string | null;
            email: string;
            mobile_number: string | null;
          };
        };
        reviewer: {
          employee_name: string | null;
          email: string;
          mobile_number: string | null;
        } | null;
      })
    | null
  > {
    this.logger.info('finding proposal log');
    try {
      const response = await this.prismaService.proposal_log.findFirst({
        where: {
          id: proposal_log_id,
        },
        include: {
          proposal: {
            select: {
              id: true,
              project_name: true,
              submitter_user_id: true,
              user: {
                select: {
                  employee_name: true,
                  email: true,
                  mobile_number: true,
                },
              },
            },
          },
          reviewer: {
            select: {
              employee_name: true,
              email: true,
              mobile_number: true,
            },
          },
        },
      });
      return response;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalLogRepository.name,
        'fetchProposalLogById error details: ',
        'finding proposal log!',
      );
      throw theError;
    }
  }

  async findLastLogCreateAtByProposalId(proposal_id: string) {
    try {
      return await this.prismaService.proposal_log.findFirst({
        where: {
          proposal_id,
        },
        orderBy: {
          created_at: 'desc',
        },
        select: {
          created_at: true,
        },
        take: 1,
      });
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        TenderProposalLogRepository.name,
        'findLastLogCreateAtByProposalId error details: ',
        'finding last log create at by proposal id!',
      );
      throw theError;
    }
  }

  async findOne(
    props: FindOneProposalLogProps,
    session?: PrismaService,
  ): Promise<ProposalLogEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const query = await this.findOneProposalFilter(props);
      const rawLogResponse = await prisma.proposal_log.findFirst(query);

      if (!rawLogResponse) return null;

      const logEntity = Builder<ProposalLogEntity>(ProposalLogEntity, {
        ...rawLogResponse,
      }).build();

      return logEntity;
    } catch (error) {
      this.logger.error(
        `Find one proposal log error: %j`,
        JSON.stringify(error),
      );
      throw error;
    }
  }

  async findMany(
    props: FindManyLogProps,
    session?: PrismaService,
  ): Promise<ProposalLogEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const args = await this.findManyProposalFilter(props);
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'created_at';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      let queryOptions: Prisma.proposal_logFindManyArgs = {
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
      const rawLogs = await prisma.proposal_log.findMany(queryOptions);

      const logsEntities = rawLogs.map((rawLog) => {
        return Builder<ProposalLogEntity>(ProposalLogEntity, {
          ...rawLog,
        }).build();
      });

      return logsEntities;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
