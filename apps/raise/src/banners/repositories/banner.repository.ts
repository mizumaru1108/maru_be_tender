import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { BannerEntity } from 'src/banners/entities/banner.entity';
import { BannerTypeEnum } from 'src/banners/types/enums/banner.type.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadFilesJsonbDto } from 'src/tender-commons/dto/upload-files-jsonb.dto';
import { PrismaInvalidForeignKeyException } from 'src/tender-commons/exceptions/prisma-error/prisma.invalid.foreign.key.exception';
import moment from 'moment';

export class BannerCreateProps {
  content: string;
  title: string;
  type: BannerTypeEnum;
  logo?: UploadFilesJsonbDto[];
  id?: string; // incase of predefined id,
  track_id?: string;
  expired_date: Date;
  expired_time: string;
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
}

export class BannerFindManyProps {
  track_id?: string[];
  type?: BannerTypeEnum[];
  only_active?: boolean;
  expired_field?: boolean;
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

export class BannerFindManyResponse extends BannerEntity {
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
        },
      });

      const createdEntity = Builder<BannerEntity>(BannerEntity, {
        ...rawCreated,
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
        },
      });

      const updatedEntity = Builder<BannerEntity>(BannerEntity, {
        ...rawUpdated,
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
      });
      if (!result) return null;
      return Builder<BannerEntity>(BannerEntity, {
        ...result,
      }).build();
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  async findManyFilters(props: BannerFindManyProps) {
    const { track_id, type, only_active } = props;
    const queryOptions: Prisma.BannerFindManyArgs = {};
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

    if (only_active !== undefined) {
      // find where expired_date + expired_time (xx:xx am/pm) < now
      const currentDate = new Date();
      findManyWhereClause = {
        ...findManyWhereClause,
        OR: [
          {
            // greater than this day
            expired_date: {
              gt: currentDate,
            },
          },
          {
            // same day
            expired_date: {
              equals: currentDate,
            },
            // expired time greater than now
            expired_time: {
              gte: moment(currentDate).format('hh:mm A'),
            },
          },
        ],
      };
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
        expired_field,
      } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'created_at';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const options = await this.findManyFilters(props);
      let queryOptions: Prisma.BannerFindManyArgs = {
        where: options.where,

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

      // console.log({ queryOptions });
      const rawResults = await prisma.banner.findMany(queryOptions);
      const currentDate = moment();
      const entities = rawResults.map((rawResult) => {
        if (expired_field) {
          // Parse expired_date in ISO 8601 format (YYYY-MM-DD)
          const expiredDate = moment(rawResult.expired_date, 'YYYY-MM-DD');

          // Parse expired_time in 12-hour format with AM/PM
          const expiredTime = moment(rawResult.expired_time, 'hh:mm A');

          // Combine the date and time for comparison
          const expiredDateTime = moment(expiredDate).set({
            hour: expiredTime.get('hour'),
            minute: expiredTime.get('minute'),
            second: expiredTime.get('second'),
          });

          const isExpired =
            expiredDateTime.isBefore(currentDate) ||
            (expiredDateTime.isSame(currentDate, 'day') &&
              expiredDateTime.isSameOrBefore(currentDate, 'minute'));

          return Builder<BannerFindManyResponse>(BannerFindManyResponse, {
            ...rawResult,
            is_expired: isExpired, // Set the correct is_expired value directly
          }).build();
        } else {
          return Builder<BannerFindManyResponse>(BannerFindManyResponse, {
            ...rawResult,
            is_expired: undefined,
          }).build();
        }
      });

      console.log(expired_field);
      console.log(entities);

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
      }).build();
    } catch (error) {
      throw this.errorMapper(error);
    }
  }
}
