import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { PrismaService } from '../../../prisma/prisma.service';
import { EntitiesEntity } from '../entities/entities.entity';
import { nanoid } from 'nanoid';

export class EntitiesCreateProps {
  entity_id?: string;
  name: string;
  authority_id: string;
}
export class EntitiesUpdateProps {}
export class EntitiesFindManyProps {
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

@Injectable()
export class EntitiesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: EntitiesCreateProps,
    session?: PrismaService,
  ): Promise<EntitiesEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.entities.create({
        data: {
          entity_id: props.entity_id || nanoid(),
          name: props.name,
          authority_id: props.authority_id,
        },
      });

      const createdEntity = Builder<EntitiesEntity>(EntitiesEntity, {
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
    authority_id: string,
    session?: PrismaService,
  ): Promise<EntitiesEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const result = await prisma.entities.findFirst({
        where: { authority_id: authority_id },
      });
      if (!result) return null;
      return Builder<EntitiesEntity>(EntitiesEntity, {
        ...result,
      }).build();
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  // async findMany(
  //   props: EntitiesFindManyProps,
  //   session?: PrismaService,
  // ): Promise<EntitiesEntity[]> {
  //   let prisma = this.prismaService;
  //   if (session) prisma = session;
  //   try {
  //     const { limit = 0, page = 0, sort_by, sort_direction } = props;
  //     const offset = (page - 1) * limit;
  //     const getSortBy = sort_by ? sort_by : 'created_at';
  //     const getSortDirection = sort_direction ? sort_direction : 'desc';

  //     let queryOptions: Prisma.ProductFindManyArgs = {
  //       where: clause,

  //       orderBy: {
  //         [getSortBy]: getSortDirection,
  //       },
  //     };

  //     if (limit > 0) {
  //       queryOptions = {
  //         ...queryOptions,
  //         skip: offset,
  //         take: limit,
  //       };
  //     }

  //     const rawProducts = await prisma.entities.findMany(queryOptions);
  //     const productEntities = rawProducts.map((rawProducts) => {
  //       return Builder<CatalogProductEntity>(CatalogProductEntity, {
  //         ...rawProducts,
  //       }).build();
  //     });
  //   } catch (error) {
  //     console.trace(error);
  //     throw error;
  //   }
  // }

  // async countMany(
  //   props: EntitiesFindManyProps,
  //   session?: PrismaService,
  // ): Promise<number> {
  //   let prisma = this.prismaService;
  //   if (session) prisma = session;
  //   try {
  //   } catch (error) {
  //     console.trace(error);
  //     throw error;
  //   }
  // }
}
