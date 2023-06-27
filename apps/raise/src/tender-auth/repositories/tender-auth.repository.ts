import { Injectable } from '@nestjs/common';
import { Prisma, project_tracks, track, user_type, user } from '@prisma/client';
import { logUtil } from '../../commons/utils/log-util';
import { BunnyService } from '../../libs/bunny/services/bunny.service';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { TenderAppRole } from '../../tender-commons/types';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';
import { SearchUserFilterRequest } from '../../tender-user/user/dtos/requests';
import { FindUserResponse } from '../../tender-user/user/dtos/responses/find-user-response.dto';
import { UpdateUserPayload } from '../../tender-user/user/interfaces/update-user-payload.interface';
import { UserStatus } from '../../tender-user/user/types/user_status';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TenderAuthRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderAuthRepository.name,
  });
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bunnyService: BunnyService,
    private readonly fusionAuthService: FusionAuthService,
  ) {}

  /**
   * Check Existance
   */
  async checkExistance(
    phone: string = '',
    email: string = '',
    license_number: string = '',
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
      const result = await this.prismaService.user.findFirst({
        where: clause,
      });
      // console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * validate if the track exist on the database
   */
  async validateTrack(trackName: string): Promise<project_tracks | null> {
    try {
      return await this.prismaService.project_tracks.findUnique({
        where: { id: trackName },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'validateTrack Error:',
        `validating track!`,
      );
      throw theError;
    }
  }

  async validateTracks(track_id: string): Promise<track | null> {
    try {
      return await this.prismaService.track.findFirst({
        where: {
          id: track_id,
          name: { notIn: ['GENERAL'] },
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'validateTrack Error:',
        `validating track!`,
      );
      throw theError;
    }
  }

  async validateRoles(role: string): Promise<user_type | null> {
    try {
      return await this.prismaService.user_type.findUnique({
        where: { id: role },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'validateRoles Error:',
        `validating roles!`,
      );
      throw theError;
    }
  }

  async findByEmail(email: string): Promise<user | null> {
    try {
      return await this.prismaService.user.findFirst({
        where: { email },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'Finding User by Email Error:',
        `Finding User by Email!`,
      );
      throw theError;
    }
  }

  async isUserHasProposal(userId: string) {
    try {
      return await this.prismaService.proposal.findMany({
        where: {
          AND: [
            {
              outter_status: {
                in: ['ONGOING', 'ON_REVISION', 'PENDING'],
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
        TenderAuthRepository.name,
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
        TenderAuthRepository.name,
        'validateRoles Error:',
        `validating roles!`,
      );
      throw theError;
    }
  }

  // async countExistingRoles(roles: string[]): Promise<number> {
  //   try {
  //     return await this.prismaService.user_role.count({
  //       where: {
  //         user_type_id: role,
  //       },
  //     });
  //   } catch (error) {
  //     const theError = prismaErrorThrower(error, `deleting user!`);
  //     throw theError;
  //   }
  // }

  async findUserById(userId: string) {
    this.logger.debug(`Finding user with id: ${userId}`);
    try {
      return await this.prismaService.user.findUnique({
        where: { id: userId },
        include: {
          roles: true,
          client_data: true,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'findUserById Error:',
        `finding user!`,
      );
      throw theError;
    }
  }

  async findUser(
    passedQuery?: Prisma.userWhereInput,
    passedSelect?: Prisma.userSelect | null | undefined,
  ): Promise<user | null> {
    const findFirstArg: Prisma.userFindFirstArgs = {};
    if (passedQuery) findFirstArg.where = passedQuery;
    if (passedSelect) findFirstArg.select = passedSelect;
    try {
      return await this.prismaService.user.findFirst(findFirstArg);
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'findUser Error:',
        `finding user!`,
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
      employee_path,
      email,
      page = 1,
      limit = 10,
      sort = 'desc',
      sorting_field,
      association_name,
      client_field,
      single_role,
      account_status,
      include_schedule = '0',
      hide_external = '0',
      hide_internal = '0',
    } = filter;

    const offset = (page - 1) * limit;

    let query: Prisma.userWhereInput = {};

    if (employee_name) {
      query = {
        ...query,
        employee_name: {
          contains: employee_name,
          mode: 'insensitive',
        },
      };
    }

    if (account_status) {
      query = {
        ...query,
        status_id: {
          contains: account_status,
          mode: 'insensitive',
        },
      };
    }

    if (employee_path) {
      query = {
        ...query,
        // why ? because GENERAL will show, on what ever the path is
        employee_path: {
          in: [employee_path, 'GENERAL'],
        },
      };
    }

    if (email) {
      query = {
        ...query,
        email: {
          contains: email,
          mode: 'insensitive',
        },
      };
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

    let include: Prisma.userInclude = {};
    if (include_schedule === '1' && hide_internal === '1') {
      include = {
        ...include,
        schedule: {
          select: {
            id: true,
            start_time: true,
            end_time: true,
          },
        },
        client_data: {
          select: {
            id: true,
            client_field: true,
            entity: true,
          },
        },
      };
    }

    if (hide_internal === '1' && association_name) {
      query = {
        ...query,
        client_data: {
          entity: {
            contains: association_name,
            mode: 'insensitive',
          },
        },
      };
    }

    if (hide_internal === '1' && client_field) {
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

    const order_by: Prisma.userOrderByWithRelationInput = {};
    const field = sorting_field as keyof Prisma.userOrderByWithRelationInput;
    if (sorting_field) {
      order_by[field] = sort;
    } else {
      order_by.updated_at = sort;
    }

    if (findOnlyActive === false) {
      if (employee_name) {
        query = {
          employee_name: {
            contains: employee_name,
            mode: 'insensitive',
          },
        };
      }

      if (account_status) {
        query = {
          status_id: {
            contains: account_status,
            mode: 'insensitive',
          },
        };
      }

      if (employee_name && account_status) {
        query = {
          OR: [
            {
              status_id: {
                contains: account_status,
                mode: 'insensitive',
              },
            },
            {
              employee_name: {
                contains: employee_name,
                mode: 'insensitive',
              },
            },
          ],
        };
      }
    }

    try {
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

      const mappedUserSingleRole: FindUserResponse['data'] = [];

      if (single_role) {
        for (const user of users) {
          for (const role of user.roles) {
            const data = {
              ...user,
              roles: [role],
            };
            mappedUserSingleRole.push(data);
          }
        }
      }

      const count = await this.prismaService.user.count({
        where: {
          ...query,
        },
      });

      return {
        data: single_role ? mappedUserSingleRole : users,
        total: count,
      };
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'findUsers Error:',
        `finding users!`,
      );
      throw theError;
    }
  }

  async findUserByTrack(track: string) {
    try {
      return await this.prismaService.user.findMany({
        where: {
          employee_path: track,
        },
        include: {
          roles: {
            select: {
              user_type_id: true,
            },
          },
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'findUserByTrack Error:',
        `finding user by track!`,
      );
      throw theError;
    }
  }

  async changeUserStatus(
    userId: string,
    status: UserStatus,
    reviewer_id?: string,
  ) {
    this.logger.log('info', `Changing user ${userId} status to ${status}`);
    try {
      return await this.prismaService.$transaction(async (prismaSession) => {
        const user = await prismaSession.user.update({
          where: { id: userId },
          data: {
            status_id: status,
          },
        });
        const user_status_log = await prismaSession.user_status_log.create({
          data: {
            id: uuidv4(),
            user_id: userId,
            status_id: status,
            account_manager_id: reviewer_id,
          },
          select: {
            user_status: {
              select: {
                id: true,
              },
            },
            user_detail: {
              select: {
                id: true,
                employee_name: true,
                email: true,
                mobile_number: true,
              },
            },
            account_manager_detail: {
              select: {
                id: true,
                employee_name: true,
                email: true,
                mobile_number: true,
              },
            },
          },
        });

        return {
          user,
          user_status_log,
        };
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'changeUserStatus Error:',
        `changing user status!`,
      );
      throw theError;
    }
  }

  async createUser(
    userData: Prisma.userCreateInput | Prisma.userUncheckedCreateInput,
    userStatusLogData: Prisma.user_status_logUncheckedCreateInput[],
    rolesData?: Prisma.user_roleUncheckedCreateInput[],
    bankInfoData?: Prisma.bank_informationUncheckedCreateInput,
    fileManagerCreateManyPayload?: Prisma.file_managerCreateManyInput[],
    uploadedFilesPath?: string[],
  ) {
    try {
      return await this.prismaService.$transaction(
        async (prismaSession) => {
          this.logger.log(
            'info',
            `creating user with payload of \n${logUtil(userData)}`,
          );
          const user = await prismaSession.user.create({
            data: userData,
          });

          this.logger.log(
            'info',
            `creating user status with payload of \n${logUtil(
              userStatusLogData,
            )}`,
          );
          await prismaSession.user_status_log.createMany({
            data: userStatusLogData,
          });

          if (rolesData) {
            this.logger.log(
              'info',
              `creating user_role with payload of \n${logUtil(rolesData)}`,
            );
            await prismaSession.user_role.createMany({
              data: rolesData,
            });
          }

          if (bankInfoData) {
            this.logger.log(
              'info',
              `creating bank information with payload of \n ${logUtil(
                bankInfoData,
              )}`,
            );
            await prismaSession.bank_information.create({
              data: bankInfoData,
            });
          }

          if (
            fileManagerCreateManyPayload &&
            fileManagerCreateManyPayload.length > 0
          ) {
            this.logger.log(
              'info',
              `file manager with payload of \n ${logUtil(
                fileManagerCreateManyPayload,
              )}`,
            );
            await prismaSession.file_manager.createMany({
              data: fileManagerCreateManyPayload,
            });
          }

          return user;
        },
        { maxWait: 50000, timeout: 150000 },
      );
    } catch (error) {
      // delete the fusion auth user if the user creation failed
      this.logger.log(
        'info',
        `Falied to store user data on db, deleting the user ${userData.id} from fusion auth`,
      );
      await this.fusionAuthService.fusionAuthDeleteUser(userData.id);
      this.logger.log(
        'info',
        `deleting all uploaded files related for user ${userData.id}`,
      );
      if (uploadedFilesPath && uploadedFilesPath.length > 0) {
        uploadedFilesPath.forEach(async (path) => {
          await this.bunnyService.deleteMedia(path, true);
        });
      }
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'createUser error:',
        `creating user!`,
      );
      throw theError;
    }
  }

  async updateUser(
    userId: string,
    userData: Prisma.userUpdateInput,
    prismaSession?: Prisma.TransactionClient,
  ): Promise<user> {
    this.logger.debug(
      `Invoke
      update user with payload: ${JSON.stringify(userData)}`,
    );
    try {
      if (prismaSession) {
        return await prismaSession.user.update({
          where: { id: userId },
          data: userData,
        });
      } else {
        return await this.prismaService.user.update({
          where: { id: userId },
          data: userData,
        });
      }
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'updateUser error:',
        `updating user!`,
      );
      throw theError;
    }
  }

  async deleteUser(userId: string): Promise<user | null> {
    this.logger.debug(`Deleting user with id: ${userId}`);
    try {
      return await this.prismaService.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        this.logger.log('warn', `User with id: ${userId} not found`);
        return null; // gonna be still works if the user is not found.
      } else {
        const theError = prismaErrorThrower(
          error,
          TenderAuthRepository.name,
          'deleteUser Error:',
          `deleting user!`,
        );
        throw theError;
      }
    }
  }

  async deleteUserWFusionAuth(userId: string) {
    this.logger.log('info', `Deleting user with id: ${userId}`);
    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        const prismaResult = await this.deleteUser(userId);
        const fusionResult = await this.fusionAuthService.fusionAuthDeleteUser(
          userId,
        );
        return { fusionResult, prismaResult };
      });
      return result;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'deleteUserWFusionAuth Error:',
        `deleting user!`,
      );
      throw theError;
    }
  }

  async updateUserFieldByKeyValuePair(
    userId: string,
    updatePayload: Record<string, any>,
    prismaSession?: Prisma.TransactionClient,
  ) {
    // log the key and the value
    Object.keys(updatePayload).forEach((key) => {
      this.logger.log(
        'info',
        `updating client field ${key} with value ${updatePayload[key]}`,
      );
    });

    try {
      if (prismaSession) {
        return await prismaSession.user.update({
          where: {
            id: userId,
          },
          data: {
            ...updatePayload,
          },
        });
      } else {
        return await this.prismaService.user.update({
          where: {
            id: userId,
          },
          data: {
            ...updatePayload,
          },
        });
      }
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'updateUserFieldByKeyValuePair error details: ',
        'updating client field!',
      );
      throw theError;
    }
  }

  async updateUserWFusionAuth(
    userId: string,
    request: UpdateUserPayload,
    createRolesData?: Prisma.user_roleUncheckedCreateInput[],
  ) {
    this.logger.debug(`Updating user with id: ${userId}`);
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          if (createRolesData && createRolesData.length > 0) {
            this.logger.log(
              'info',
              `Deleteing all previous roles on user ${userId}`,
            );
            await prisma.user_role.deleteMany({
              where: { user_id: userId },
            });

            this.logger.log(
              'info',
              `Creating new roles for ${userId}, with payload of \n ${logUtil(
                createRolesData,
              )}`,
            );
            await prisma.user_role.createMany({
              data: createRolesData,
            });
          }

          const exclude = ['password'];
          const updateUserPayload: Prisma.userUncheckedUpdateInput =
            Object.fromEntries(
              Object.entries(request).filter(([k]) => !exclude.includes(k)),
            );

          const prismaResult = await prisma.user.update({
            where: { id: userId },
            data: updateUserPayload,
          });

          const fusionResult =
            await this.fusionAuthService.fusionAuthUpdateUserRegistration(
              userId,
              {
                firstName:
                  request.employee_name && !!request.employee_name
                    ? (request.employee_name as string)
                    : undefined,
                email:
                  request.email && !!request.email
                    ? (request.email as string)
                    : undefined,
                mobilePhone:
                  request.mobile_number && !!request.mobile_number
                    ? (request.mobile_number as string)
                    : undefined,
                address:
                  request.address && !!request.address
                    ? (request.address as string)
                    : undefined,
                password: request.password,
                roles: createRolesData
                  ? createRolesData.map((role) => role.user_type_id)
                  : [],
              },
            );
          return { prismaResult, fusionResult };
        },
        { maxWait: 500000, timeout: 1500000 },
      );
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'updateUserWFusionAuth Error:',
        `updating user!`,
      );
      throw theError;
    }
  }

  async createUserBankAccount(
    userId: string,
    bankAccounts: Prisma.bank_informationCreateInput,
    prismaSession?: Prisma.TransactionClient,
  ) {
    this.logger.log(
      'info',
      `Creating bank account for user with id: ${userId}, with payload: ${JSON.stringify(
        bankAccounts,
      )}`,
    );
    try {
      if (prismaSession) {
        return await prismaSession.bank_information.create({
          data: {
            ...bankAccounts,
          },
        });
      } else {
        return await this.prismaService.bank_information.create({
          data: {
            ...bankAccounts,
          },
        });
      }
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'createManyUserBankAccounts Error:',
        `creating many bank accounts for user!`,
      );
      throw theError;
    }
  }

  async updateBankAccount(
    bankAccountId: string,
    updatePayload: Record<string, any>,
    prismaSession?: Prisma.TransactionClient,
  ) {
    // log the key and the value
    Object.keys(updatePayload).forEach((key) => {
      this.logger.log(
        'info',
        `updating bank account field ${key} with value ${updatePayload[key]}`,
      );
    });

    try {
      if (prismaSession) {
        return await prismaSession.bank_information.update({
          where: {
            id: bankAccountId,
          },
          data: {
            ...updatePayload,
          },
        });
      } else {
        return await this.prismaService.bank_information.update({
          where: {
            id: bankAccountId,
          },
          data: {
            ...updatePayload,
          },
        });
      }
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderAuthRepository.name,
        'updateBankAccount error details: ',
        'updating bank account field!',
      );
      throw theError;
    }
  }
}