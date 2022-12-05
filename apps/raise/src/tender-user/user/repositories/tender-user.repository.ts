import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  prisma,
  Prisma,
  project_tracks,
  user,
  user_type,
} from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { UserStatus } from '../types/user_status';
import { UpdateUserPayload } from '../interfaces/update-user-payload.interface';

@Injectable()
export class TenderUserRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderUserRepository.name,
  });
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fusionAuthService: FusionAuthService,
  ) {}

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
        TenderUserRepository.name,
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
        TenderUserRepository.name,
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
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderUserRepository.name,
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
        TenderUserRepository.name,
        'findUser Error:',
        `finding user!`,
      );
      throw theError;
    }
  }

  async changeUserStatus(
    userId: string,
    status: any,
    prismaSession?: Prisma.TransactionClient,
  ) {
    this.logger.log('info', `Changing user ${userId} status to ${status}`);
    try {
      if (prismaSession) {
        return await prismaSession.user.update({
          where: { id: userId },
          data: {
            status_id: status,
          },
        });
      } else {
        return await this.prismaService.user.update({
          where: { id: userId },
          data: {
            status_id: status,
          },
        });
      }
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderUserRepository.name,
        'changeUserStatus Error:',
        `changing user status!`,
      );
      throw theError;
    }
  }

  async createUser(
    userData: Prisma.userCreateInput | Prisma.userUncheckedCreateInput,
    rolesData?: Prisma.user_roleUncheckedCreateInput[],
  ) {
    this.logger.debug(
      `Invoke create user with payload: ${JSON.stringify(userData)}`,
    );
    try {
      if (rolesData) {
        return await this.prismaService.$transaction([
          this.prismaService.user.create({
            data: userData,
          }),
          this.prismaService.user_role.createMany({
            data: rolesData,
          }),
        ]);
      } else {
        return await this.prismaService.user.create({
          data: userData,
        });
      }
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderUserRepository.name,
        'createUser error:',
        `creating user!`,
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
          TenderUserRepository.name,
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
        TenderUserRepository.name,
        'deleteUserWFusionAuth Error:',
        `deleting user!`,
      );
      throw theError;
    }
  }

  async updateUser(userId: string, request: UpdateUserPayload) {
    this.logger.debug(`Updating user with id: ${userId}`);
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const prismaResult = await prisma.user.update({
          where: { id: userId },
          data: {
            employee_name: request.employee_name,
            email: request.email,
            address: request.address,
            mobile_number: request.mobile_number,
          },
        });

        const fusionResult = await this.fusionAuthService.fusionAuthUpdateUser(
          userId,
          request,
        );
        return { prismaResult, fusionResult };
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderUserRepository.name,
        'updateUser Error:',
        `updating user!`,
      );
      throw theError;
    }
  }
}
