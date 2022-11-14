import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, project_tracks, user, user_type } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class TenderUserRepository {
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
      console.trace(error);
      throw new InternalServerErrorException(
        'Something when wrong when fetching track!',
      );
    }
  }

  async validateRoles(role: string): Promise<user_type | null> {
    try {
      return await this.prismaService.user_type.findUnique({
        where: { id: role },
      });
    } catch (error) {
      console.trace(error);
      throw new InternalServerErrorException(
        'Something when wrong when fetching track!',
      );
    }
  }

  async countExistingRoles(role: string): Promise<number> {
    try {
      return await this.prismaService.user.count({
        where: { user_type_id: role },
      });
    } catch (error) {
      console.trace(error);
      throw new InternalServerErrorException(
        'Something when wrong when counting user!',
      );
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
      console.trace(error);
      throw new InternalServerErrorException(
        'Something when wrong when fetching user data!',
      );
    }
  }

  async createUser(data: Prisma.userCreateInput): Promise<user> {
    try {
      return await this.prismaService.user.create({
        data,
      });
    } catch (error) {
      console.trace(error);
      throw new InternalServerErrorException(
        'Something when wrong when creating user data!',
      );
    }
  }

  async deleteUser(userId: string) {
    try {
      return await this.prismaService.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      console.trace(error);
      throw new InternalServerErrorException(
        'Something when wrong when deleting user data!',
      );
    }
  }
}
