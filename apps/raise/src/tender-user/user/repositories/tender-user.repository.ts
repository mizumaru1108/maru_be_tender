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
      const theEror = prismaErrorThrower(error, `deleting user!`);
      throw theEror;
    }
  }

  async validateRoles(role: string): Promise<user_type | null> {
    try {
      return await this.prismaService.user_type.findUnique({
        where: { id: role },
      });
    } catch (error) {
      const theEror = prismaErrorThrower(error, `deleting user!`);
      throw theEror;
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
  //     const theEror = prismaErrorThrower(error, `deleting user!`);
  //     throw theEror;
  //   }
  // }

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
      const theEror = prismaErrorThrower(error, `deleting user!`);
      throw theEror;
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
      const theEror = prismaErrorThrower(error, `creating user!`);
      throw theEror;
    }
  }

  async deleteUser(userId: string) {
    this.logger.debug(`Deleting user with id: ${userId}`);
    try {
      return await this.prismaService.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          this.logger.log('warn', `User with id: ${userId} not found`);
          return false; // gonna be still works if the user is not found.
        }
      } else {
        this.logger.error('Something went wrong when deleting user', error);
        const theEror = prismaErrorThrower(error, `deleting user!`);
        throw theEror;
      }
    }
  }

  async deleteUserWFusionAuth(userId: string) {
    this.logger.log('log', `Deleting user with id: ${userId}`);
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
      this.logger.error('Something went wrong when deleting user', error);
      const theEror = prismaErrorThrower(error, `deleting user!`);
      throw theEror;
    }
  }
}
