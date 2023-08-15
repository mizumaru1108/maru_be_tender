import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthoritiesEntity } from '../entities/authorities.entity';
import { nanoid } from 'nanoid';
import { Prisma } from '@prisma/client';

export class AuthoritiesCreateProps {
  authority_id?: string;
  name: string;
  client_field_id: string;
}
export class AuthoritiesUpdateProps {}

export class AuthoritiesFindManyProps {
  name?: string;
  client_field_id?: string;
  include_relations?: string[];
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

@Injectable()
export class AuthoritiesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: AuthoritiesCreateProps,
    session?: PrismaService,
  ): Promise<AuthoritiesEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.authorities.create({
        data: {
          authority_id: props.authority_id || nanoid(),
          name: props.name,
          client_field_id: props.client_field_id,
        },
      });

      const createdEntity = Builder<AuthoritiesEntity>(AuthoritiesEntity, {
        ...rawCreated,
      }).build();
      return createdEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  // async update(
  //   props: AuthoritiesUpdateProps,
  //   session?: PrismaService,
  // ): Promise<AuthoritiesEntity> {
  //   let prisma = this.prismaService;
  //   if (session) prisma = session;
  //   try {
  //     const rawUpdated = await prisma.authorities.update({
  //       where: {},
  //       data: {},
  //     });

  //     const updatedEntity = Builder<AuthoritiesEntity>(AuthoritiesEntity, {
  //       ...rawUpdated,
  //     }).build();
  //     return updatedEntity;
  //   } catch (error) {
  //     console.trace(error);
  //     throw error;
  //   }
  // }

  async findById(
    authority_id: string,
    session?: PrismaService,
  ): Promise<AuthoritiesEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const result = await prisma.authorities.findFirst({
        where: { authority_id: authority_id },
      });
      if (!result) return null;
      return Builder<AuthoritiesEntity>(AuthoritiesEntity, {
        ...result,
      }).build();
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findManyFilter(props: AuthoritiesFindManyProps) {
    const { name, client_field_id, include_relations } = props;
    let args: Prisma.AuthoritiesFindManyArgs = {};
    let whereClause: Prisma.AuthoritiesWhereInput = {};

    if (name) {
      whereClause = {
        ...whereClause,
        name: {
          contains: name,
          mode: 'insensitive',
        },
      };
    }

    if (client_field_id) {
      whereClause = {
        ...whereClause,
        client_field_id: client_field_id,
      };
    }

    if (include_relations && include_relations.length > 0) {
      let include: Prisma.AuthoritiesInclude = {};

      for (const relation of include_relations) {
        if (relation === 'client_field_details') {
          include = {
            ...include,
            client_field_details: true,
          };
        }
      }

      args.include = include;
    }

    args.where = whereClause;
    return args;
  }

  async findMany(
    props: AuthoritiesFindManyProps,
    session?: PrismaService,
  ): Promise<AuthoritiesEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'name';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const args = await this.findManyFilter(props);
      let queryOptions: Prisma.AuthoritiesFindManyArgs = {
        where: args.where,
        include: args.include,
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

      const rawResult = await prisma.authorities.findMany(queryOptions);
      const entities = rawResult.map((rawResult) => {
        return Builder<AuthoritiesEntity>(AuthoritiesEntity, {
          ...rawResult,
        }).build();
      });

      return entities;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async countMany(
    props: AuthoritiesFindManyProps,
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const args = await this.findManyFilter(props);
      return await prisma.clientFields.count({
        where: args.where,
      });
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
