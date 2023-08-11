import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import moment from 'moment';
import { nanoid } from 'nanoid';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { BannerEntity } from 'src/banners/entities/banner.entity';
import { BannerTypeEnum } from 'src/banners/types/enums/banner.type.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadFilesJsonbDto } from 'src/tender-commons/dto/upload-files-jsonb.dto';
import { PrismaInvalidForeignKeyException } from 'src/tender-commons/exceptions/prisma-error/prisma.invalid.foreign.key.exception';
import { TrackEntity } from 'src/tender-track/track/entities/track.entity';
import { logUtil } from '../../commons/utils/log-util';

export class BannerCreateProps {
  content: string;
  title: string;
  type: BannerTypeEnum;
  logo?: UploadFilesJsonbDto[];
  id?: string; // incase of predefined id,
  track_id?: string;
  expired_date: Date;
  expired_time: string;
  expired_at: number;
}

export class BannerUpdateProps {
  id: string;
  content?: string;
  title?: string;
  type?: BannerTypeEnum;
  logo?: UploadFilesJsonbDto[];
  track_id?: string;
  expired_date?: Date;
  expired_time?: string;
  expired_at?: number;
}

export class BannerFindManyProps {
  track_id?: string[];
  type?: BannerTypeEnum[];
  only_active?: boolean;
  expired_at?: number;
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: string[];
  specific_date?: Date;
  expired_at_lte?: number;
  expired_at_gte?: number;
}

export class BannerFindManyResponse extends BannerEntity {
  @ApiProperty()
  is_expired?: boolean;
}

@Injectable()
export class BannerRepository {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectPinoLogger(BannerRepository.name)
    private logger: PinoLogger,
  ) {}

  errorMapper(error: any) {
    // console.trace(error);
    // this.logger.error(`Error Details = %o`, error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      throw new PrismaInvalidForeignKeyException(
        error.code,
        error.clientVersion,
        error.meta,
      );
    }
    throw new InternalServerErrorException(error);
  }

  async create(
    props: BannerCreateProps,
    session?: PrismaService,
  ): Promise<BannerEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.banner.create({
        data: {
          id: props.id || nanoid(),
          content: props.content,
          title: props.title,
          type: props.type as unknown as string,
          logo: props.logo as unknown as Prisma.InputJsonArray,
          track_id: props.track_id,
          expired_date: props.expired_date,
          expired_time: props.expired_time,
          expired_at: props.expired_at,
        },
      });

      const createdEntity = Builder<BannerEntity>(BannerEntity, {
        ...rawCreated,
        expired_at: Number(rawCreated.expired_at),
      }).build();
      return createdEntity;
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  async update(
    props: BannerUpdateProps,
    session?: PrismaService,
  ): Promise<BannerEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawUpdated = await prisma.banner.update({
        where: { id: props.id },
        data: {
          content: props.content,
          title: props.title,
          type: props.type as unknown as string,
          logo: props.logo as unknown as Prisma.InputJsonArray,
          track_id: props.track_id,
          expired_date: props.expired_date,
          expired_time: props.expired_time,
          expired_at: props.expired_at,
        },
      });

      const updatedEntity = Builder<BannerEntity>(BannerEntity, {
        ...rawUpdated,
        expired_at: Number(rawUpdated.expired_at),
      }).build();
      return updatedEntity;
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  async findById(
    id: string,
    session?: PrismaService,
  ): Promise<BannerEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const result = await prisma.banner.findFirst({
        where: { id },
        include: { track: true },
      });

      if (!result) return null;

      let newTrack: TrackEntity | undefined = undefined;
      if (result.track) {
        newTrack = Builder<TrackEntity>(TrackEntity, {
          ...result.track,
        }).build();
      }

      const entity = Builder<BannerEntity>(BannerEntity, {
        ...result,
        expired_at: Number(result.expired_at),
        track: newTrack,
      }).build();

      return entity;
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  async findManyFilters(props: BannerFindManyProps) {
    const {
      track_id,
      type,
      expired_at,
      include_relations,
      specific_date,
      expired_at_gte,
      expired_at_lte,
    } = props;
    let queryOptions: Prisma.BannerFindManyArgs = {};
    let findManyWhereClause: Prisma.BannerWhereInput = {};

    if (track_id !== undefined) {
      findManyWhereClause = {
        ...findManyWhereClause,
        track_id: {
          in: track_id,
        },
      };
    }

    if (type !== undefined) {
      findManyWhereClause = {
        ...findManyWhereClause,
        type: {
          in: type,
        },
      };
    }

    if (expired_at_gte !== undefined) {
      findManyWhereClause = {
        ...findManyWhereClause,
        expired_at: {
          gte: expired_at_gte,
        },
      };
    }

    if (expired_at_lte !== undefined) {
      findManyWhereClause = {
        ...findManyWhereClause,
        expired_at: {
          lte: expired_at_lte,
        },
      };
    }

    if (specific_date !== undefined) {
      findManyWhereClause = {
        ...findManyWhereClause,
        expired_date: specific_date,
      };
    }

    if (expired_at_gte && expired_at_lte) {
      findManyWhereClause = {
        ...findManyWhereClause,
        expired_at: {
          gte: expired_at_gte,
          lte: expired_at_lte,
        },
      };
    }

    if (include_relations && include_relations.length > 0) {
      let include: Prisma.BannerInclude = {};

      for (const relation of include_relations) {
        if (relation === 'track') {
          include = {
            ...include,
            track: true,
          };
        }
      }

      queryOptions.include = include;
    }

    queryOptions.where = findManyWhereClause;
    return queryOptions;
  }

  async findMany(
    props: BannerFindManyProps,
    session?: PrismaService,
  ): Promise<BannerFindManyResponse[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const {
        limit = 0,
        page = 0,
        sort_by,
        sort_direction,
        expired_at,
      } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'created_at';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const options = await this.findManyFilters(props);
      // console.log(logUtil(options));
      let queryOptions: Prisma.BannerFindManyArgs = {
        where: options.where,

        orderBy: {
          [getSortBy]: getSortDirection,
        },

        include: options.include,
      };

      if (limit > 0) {
        queryOptions = {
          ...queryOptions,
          skip: offset,
          take: limit,
        };
      }

      // console.log(logUtil(queryOptions));
      const rawResults = await prisma.banner.findMany(queryOptions);
      const entities = rawResults.map((rawResult) => {
        if (expired_at) {
          return Builder<BannerFindManyResponse>(BannerFindManyResponse, {
            ...rawResult,
            expired_at: Number(rawResult.expired_at),
            is_expired:
              Math.floor(Date.now() / 1000) >= Number(rawResult.expired_at),
          }).build();
        } else {
          return Builder<BannerFindManyResponse>(BannerFindManyResponse, {
            ...rawResult,
            expired_at: Number(rawResult.expired_at),
            is_expired: undefined,
          }).build();
        }
      });

      // console.log(expired_field);
      // console.log(entities);

      return entities;
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  async countMany(
    props: BannerFindManyProps,
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const queryOptions = await this.findManyFilters(props);
      const result = await prisma.banner.count({
        where: queryOptions.where,
      });
      return result;
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  async delete(id: string, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const result = await prisma.banner.delete({
        where: { id },
      });
      return Builder<BannerEntity>(BannerEntity, {
        ...result,
        expired_at: Number(result.expired_at),
      }).build();
    } catch (error) {
      throw this.errorMapper(error);
    }
  }
}
