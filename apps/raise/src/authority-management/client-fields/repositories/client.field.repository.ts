import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { PrismaService } from '../../../prisma/prisma.service';
import { ClientFieldEntity } from '../entities/client.field.entity';
import { Prisma } from '@prisma/client';

export class ClientFieldCreateProps {
  client_field_id?: string;
  name: string;
}
export class ClientFieldUpdateProps {}

export class ClientFieldFindManyProps {
  include_relations?: string[];
  name?: string;
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

@Injectable()
export class ClientFieldRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: ClientFieldCreateProps,
    session?: PrismaService,
  ): Promise<ClientFieldEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.clientFields.create({
        data: {
          client_field_id: props.client_field_id || nanoid(),
          name: props.name,
        },
      });

      const createdEntity = Builder<ClientFieldEntity>(ClientFieldEntity, {
        ...rawCreated,
      }).build();
      return createdEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  // async update(
  //   props: EntitiesUpdateProps,
  //   session?: PrismaService,
  // ): Promise<EntitiesEntity> {
  //   let prisma = this.prismaService;
  //   if (session) prisma = session;
  //   try {
  //     const rawUpdated = await prisma.entities.update({
  //       where: {},
  //       data: {},
  //     });

  //     const updatedEntity = Builder<EntitiesEntity>(EntitiesEntity, {
  //       ...rawUpdated,
  //     }).build();
  //     return updatedEntity;
  //   } catch (error) {
  //     console.trace(error);
  //     throw error;
  //   }
  // }

  async findById(
    client_field_id: string,
    session?: PrismaService,
  ): Promise<ClientFieldEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const result = await prisma.clientFields.findFirst({
        where: { client_field_id: client_field_id },
      });
      if (!result) return null;
      return Builder<ClientFieldEntity>(ClientFieldEntity, {
        ...result,
      }).build();
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findManyFilter(props: ClientFieldFindManyProps) {
    const { include_relations, name } = props;
    let args: Prisma.ClientFieldsFindManyArgs = {};
    let whereClause: Prisma.ClientFieldsWhereInput = {};

    if (name) {
      whereClause = {
        ...whereClause,
        name: {
          contains: name,
          mode: 'insensitive',
        },
      };
    }
    if (include_relations && include_relations.length > 0) {
      let include: Prisma.ClientFieldsInclude = {};

      for (const relation of include_relations) {
        if (relation === 'authorities') {
          include = {
            ...include,
            authorities: {
              orderBy: {
                name: 'asc',
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

  async findMany(
    props: ClientFieldFindManyProps,
    session?: PrismaService,
  ): Promise<ClientFieldEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'name';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const args = await this.findManyFilter(props);
      let queryOptions: Prisma.ClientFieldsFindManyArgs = {
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

      const rawResult = await prisma.clientFields.findMany(queryOptions);
      const entities = rawResult.map((rawResult) => {
        return Builder<ClientFieldEntity>(ClientFieldEntity, {
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
    props: ClientFieldFindManyProps,
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
