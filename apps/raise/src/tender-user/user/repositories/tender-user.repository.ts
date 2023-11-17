import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenderAppRole } from '../../../tender-commons/types';
import { OutterStatusEnum } from '../../../tender-commons/types/proposal';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { SearchUserFilterRequest } from '../dtos/requests';
import { FindUserResponse } from '../dtos/responses/find-user-response.dto';
import { UserEntity } from '../entities/user.entity';
import { logUtil } from '../../../commons/utils/log-util';
export class CreateUserProps {
  id?: string;
  employee_name: string;
  mobile_number: string;
  email: string;
  status_id: string;
  track_id?: string;
  address?: string;
}
export class UpdateUserProps {
  id: string;
  employee_name?: string;
  mobile_number?: string;
  email?: string;
  status_id?: string;
  address?: string;
  track_id?: string;
  // is_deleted?: boolean;
  deleted_at?: Date | null;
}

export class UserFindFirstProps {
  id?: string;
  email?: string;
  mobile_number?: string;
  includes_relation?: string[];
}
@Injectable()
export class TenderUserRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bunnyService: BunnyService,
    private readonly fusionAuthService: FusionAuthService,
    @InjectPinoLogger(TenderUserRepository.name) private logger: PinoLogger,
  ) {}

  /**
   * Check Existance
   */
  async checkExistance(
    phone: string = '',
    email: string = '',
    license_number: string = '',
    exclude_id?: string,
  ) {
    try {
      const clause: Prisma.userWhereInput = {};
      const orClause: Prisma.userWhereInput[] = [];

      if (phone && phone !== '') {
        orClause.push({
          mobile_number: phone,
        });
      }

      if (email && email !== '') {
        orClause.push({ email });
      }

      if (license_number && license_number !== '') {
        orClause.push({
          client_data: { license_number },
        });
      }

      clause.OR = orClause;

      if (exclude_id && exclude_id !== '') {
        clause.id = { notIn: [exclude_id] };
      }

      // console.log(logUtil(clause));
      const result = await this.prismaService.user.findMany({
        where: {
          ...clause,
          deleted_at: null,
        },
        include: {
          client_data: true,
        },
      });
      // console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(props: CreateUserProps, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreatedUser = await prisma.user.create({
        data: {
          id: props.id || uuidv4(),
          employee_name: props.employee_name,
          mobile_number: props.mobile_number,
          email: props.email,
          status_id: props.status_id,
          address: props.address,
          track_id: props.track_id,
        },
      });

      const createdUserEntity = Builder<UserEntity>(UserEntity, {
        ...rawCreatedUser,
      }).build();

      return createdUserEntity;
    } catch (error) {
      throw error;
    }
  }

  async update(props: UpdateUserProps, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawUpdatedUser = await prisma.user.update({
        where: { id: props.id },
        data: {
          employee_name: props.employee_name,
          mobile_number: props.mobile_number,
          email: props.email,
          status_id: props.status_id,
          address: props.address,
          track_id: props.track_id,
          deleted_at: props.deleted_at,
        },
      });

      const entity = Builder<UserEntity>(UserEntity, {
        ...rawUpdatedUser,
      }).build();

      return entity;
    } catch (error) {
      throw error;
    }
  }

  async findFirstFilter(
    props: UserFindFirstProps,
  ): Promise<Prisma.userFindFirstArgs> {
    const { includes_relation } = props;

    const args: Prisma.userFindFirstArgs = {};
    let whereClause: Prisma.userWhereInput = {};
    let include: Prisma.userInclude = {
      roles: true,
    };

    if (props.id) whereClause.id = props.id;
    if (props.email) whereClause.email = props.email;
    if (props.mobile_number) whereClause.mobile_number = props.mobile_number;

    args.where = whereClause;

    if (includes_relation && includes_relation.length > 0) {
      for (const relation of includes_relation) {
        if (relation === 'client_data') {
          include = { ...include, client_data: true };
        }
        if (relation === 'track') {
          include = {
            ...include,
            track: true,
          };
        }
      }
    }
    args.include = include;

    return args;
  }

  async findFirst(
    props: UserFindFirstProps,
    session?: PrismaService,
  ): Promise<UserEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const args = await this.findFirstFilter(props);
      const rawRes = await prisma.user.findFirst({
        where: args.where,
        include: args.include,
      });

      if (!rawRes) return null;
      // console.log({ args });
      // console.log({ rawRes });
      const foundedEntity = Builder<UserEntity>(UserEntity, {
        ...rawRes,
      }).build();

      return foundedEntity;
    } catch (error) {
      throw error;
    }
  }

  async findUserOnGoingProposal(userId: string) {
    try {
      return await this.prismaService.proposal.findMany({
        where: {
          AND: [
            {
              outter_status: {
                in: [
                  OutterStatusEnum.ONGOING,
                  OutterStatusEnum.ON_REVISION,
                  OutterStatusEnum.ASKED_FOR_AMANDEMENT,
                  OutterStatusEnum.ASKED_FOR_AMANDEMENT_PAYMENT,
                  OutterStatusEnum.PENDING,
                  OutterStatusEnum.PENDING_CANCELED,
                ],
              },
            },
            {
              OR: [
                { submitter_user_id: userId },
                { finance_id: userId },
                { cashier_id: userId },
                { project_manager_id: userId },
                { supervisor_id: userId },
              ],
            },
          ],
        },
      });
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        TenderUserRepository.name,
        'Finding ongoing proposal on user Error:',
        `Finding ongoing proposal on this user!`,
      );
      throw theError;
    }
  }

  async findByRole(role: TenderAppRole) {
    try {
      return await this.prismaService.user.findMany({
        where: {
          roles: {
            some: {
              user_type_id: {
                contains: role,
                mode: 'insensitive',
              },
            },
          },
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderUserRepository.name,
        'validateRoles Error:',
        `validating roles!`,
      );
      throw theError;
    }
  }

  async findUsers(
    filter: SearchUserFilterRequest,
    findOnlyActive: boolean,
  ): Promise<FindUserResponse> {
    const {
      employee_name,
      track_id,
      email,
      page = 1,
      limit = 10,
      sort = 'desc',
      user_type_id,
      sorting_field,
      association_name,
      client_field,
      account_status,
      license_number,
      entity_mobile,
      include_schedule = '0',
      hide_external = '0',
      hide_internal = '0',
    } = filter;

    const offset = (page - 1) * limit;

    let query: Prisma.userWhereInput = {};
    let orQuery: Prisma.userWhereInput[] = [];

    if (employee_name) {
      orQuery.push({
        employee_name: {
          contains: employee_name,
          mode: 'insensitive',
        },
      });

      orQuery.push({
        client_data: {
          entity: {
            contains: employee_name,
            mode: 'insensitive',
          },
        },
      });
    }

    if (account_status) {
      const status = decodeURIComponent(account_status);
      if (status && status.includes('بانتظار التفعيل')) {
        query = {
          ...query,
          status_id: { in: ['REVISED_ACCOUNT', 'WAITING_FOR_ACTIVATION'] },
        };
      }
      if (status && status.includes('الحساب موقوف')) {
        query = {
          ...query,
          status_id: {
            in: ['SUSPENDED_ACCOUNT'],
          },
        };
      }
      if (status && status.includes('حساب ملغى')) {
        query = {
          ...query,
          status_id: {
            in: ['CANCELED_ACCOUNT'],
          },
        };
      }
      if (status && status.includes('حساب مفعل')) {
        query = {
          ...query,
          status_id: {
            in: ['ACTIVE_ACCOUNT'],
          },
        };
      }
      if (status && status.includes('الحساب المحذوف')) {
        query = {
          ...query,
          status_id: {
            in: ['DELETED'],
          },
        };
      }

      query = {
        ...query,
        status_id: {
          contains: status,
          mode: 'insensitive',
        },
      };
    }

    if (track_id) {
      query = {
        ...query,
        // why ? because GENERAL will show, on what ever the path is
        track_id: {
          in: [track_id],
        },
      };
    }

    if (email) {
      orQuery.push({
        email: {
          contains: email,
          mode: 'insensitive',
        },
      });
    }

    if (hide_external && hide_external === '1') {
      query = {
        ...query,
        // only show roles.user_type_id[] should be not contain "tender_client"
        roles: {
          every: {
            user_type_id: {
              not: 'CLIENT',
            },
          },
        },
      };
    }

    if (user_type_id) {
      orQuery.push({
        roles: {
          some: {
            user_type_id: {
              in: user_type_id,
            },
          },
        },
      });
    }

    if (user_type_id && user_type_id.length > 0) {
      orQuery.push({
        // only show roles.user_type_id[] should be not contain "tender_client"
        roles: {
          some: {
            user_type_id: {
              in: [...user_type_id],
            },
          },
        },
      });
    }

    if (association_name) {
      orQuery.push({
        client_data: {
          entity: {
            contains: association_name,
            mode: 'insensitive',
          },
        },
      });
    }

    if (client_field) {
      query = {
        ...query,
        client_data: {
          client_field: {
            contains: client_field,
            mode: 'insensitive',
          },
        },
      };
    }

    // revers of hide_external, if hide_internal is true, then only show roles.user_type_id[] should be contain "tender_client"
    if (hide_internal && hide_internal === '1') {
      query = {
        ...query,
        roles: {
          some: {
            user_type_id: {
              equals: 'CLIENT',
            },
          },
        },
      };
    }

    if (findOnlyActive) {
      query = {
        ...query,
        status_id: {
          equals: 'ACTIVE_ACCOUNT',
        },
      };
    }

    if (entity_mobile) {
      orQuery.push({
        client_data: {
          entity_mobile: {
            contains: entity_mobile,
            mode: 'insensitive',
          },
        },
      });
      orQuery.push({
        client_data: {
          phone: {
            contains: entity_mobile,
            mode: 'insensitive',
          },
        },
      });
      orQuery.push({
        mobile_number: {
          contains: entity_mobile,
          mode: 'insensitive',
        },
      });
    }

    if (license_number) {
      orQuery.push({
        client_data: {
          license_number: {
            contains: license_number,
            mode: 'insensitive',
          },
        },
      });
    }
    let include: Prisma.userInclude = {};

    if (hide_internal === '1') {
      include = {
        ...include,
        client_data: {
          select: {
            id: true,
            client_field: true,
            entity: true,
          },
        },
      };
    }

    if (include_schedule === '1') {
      include = {
        ...include,
        schedule: {
          select: {
            id: true,
            start_time: true,
            end_time: true,
          },
        },
      };
    }

    const order_by: Prisma.userOrderByWithRelationInput = {};
    const field = sorting_field as keyof Prisma.userOrderByWithRelationInput;
    if (sorting_field) {
      order_by[field] = sort;
    } else {
      order_by.updated_at = sort;
    }

    query.OR = orQuery;

    try {
      // console.log(logUtil(filter));
      // console.log(logUtil(query));
      // console.log(`applied filter: ${logUtil(query)}`);
      const users: FindUserResponse['data'] =
        await this.prismaService.user.findMany({
          where: {
            ...query,
          },
          include: {
            roles: {
              select: {
                user_type_id: true,
              },
            },
            ...include,
          },
          skip: offset,
          take: limit,
          orderBy: order_by,
        });

      // console.log({ users });
      // const mappedUserSingleRole: FindUserResponse['data'] = [];

      // console.log({ mappedUserSingleRole });

      // if (single_role) {
      //   for (const user of users) {
      //     for (const role of user.roles) {
      //       const data = {
      //         ...user,
      //         roles: [role],
      //       };
      //       mappedUserSingleRole.push(data);
      //     }
      //   }
      // }

      const count = await this.prismaService.user.count({
        where: {
          ...query,
        },
      });

      return {
        // data: single_role ? mappedUserSingleRole : users,
        data: users,
        total: count,
      };
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderUserRepository.name,
        'findUsers Error:',
        `finding users!`,
      );
      throw theError;
    }
  }
}
