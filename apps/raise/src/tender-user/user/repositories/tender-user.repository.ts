import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, project_tracks, user, user_type } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { ROOT_LOGGER } from '../../../libs/root-logger';

@Injectable()
export class TenderUserRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderUserRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

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
    userData: Prisma.userCreateInput,
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
      const theEror = prismaErrorThrower(error, `deleting user!`);
      throw theEror;
    }
  }

  async test(userId: string) {
    this.logger.debug(`Deleting user with id: ${userId}`);
    try {
      return await this.prismaService.user.findFirst({
        where: { id: userId },
      });
    } catch (error) {
      const theEror = prismaErrorThrower(error, `deleting user!`);
      throw theEror;
    }
  }
}
