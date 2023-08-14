import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthoritiesEntity } from '../entities/authorities.entity';
import { nanoid } from 'nanoid';

export class AuthoritiesCreateProps {
  authority_id?: string;
  name: string;
}
export class AuthoritiesUpdateProps {}
export class AuthoritiesFindManyProps {
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

  // async findMany(
  //   props: AuthoritiesFindManyProps,
  //   session?: PrismaService,
  // ): Promise<AuthoritiesEntity[]> {
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

  //     const rawProducts = await prisma.authorities.findMany(queryOptions);
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
  //   props: AuthoritiesFindManyProps,
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
