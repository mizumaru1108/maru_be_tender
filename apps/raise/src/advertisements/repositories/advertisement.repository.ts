import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AdvertisementEntity } from 'src/advertisements/entities/advertisement.entity';
import { AdvertisementTypeEnum } from 'src/advertisements/types/enums/advertisement.type.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadFilesJsonbDto } from 'src/tender-commons/dto/upload-files-jsonb.dto';
import { PrismaInvalidForeignKeyException } from 'src/tender-commons/exceptions/prisma-error/prisma.invalid.foreign.key.exception';

export class AdvertisementCreateProps {
  content: string;
  title: string;
  type: AdvertisementTypeEnum;
  logo?: UploadFilesJsonbDto;
  id?: string; // incase of predefined id,
  track_id?: string;
  date: Date;
  start_time: string;
}

export class AdvertisementUpdateProps {
  id: string;
  content?: string;
  title?: string;
  type?: AdvertisementTypeEnum;
  logo?: UploadFilesJsonbDto;
  track_id?: string;
  date?: Date;
  start_time?: string;
}

export class AdvertisementFindManyProps {
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

@Injectable()
export class AdvertisementRepository {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectPinoLogger(AdvertisementRepository.name)
    private logger: PinoLogger,
  ) {}

  advertisementRepoErrorMapper(error: any) {
    // console.trace(error);
    // this.logger.error(`error detail ${JSON.stringify(error)}`);
    this.logger.error({});

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return new PrismaInvalidForeignKeyException(
        error.code,
        error.clientVersion,
        error.meta,
      );
    }

    return new InternalServerErrorException(error);
  }

  async create(
    props: AdvertisementCreateProps,
    session?: PrismaService,
  ): Promise<AdvertisementEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.advertisements.create({
        data: {
          id: props.id || nanoid(),
          content: props.content,
          title: props.title,
          type: props.type as unknown as string,
          logo: props.logo as unknown as Prisma.InputJsonValue,
          track_id: props.track_id,
          date: props.date,
          start_time: props.start_time,
        },
      });

      const createdEntity = Builder<AdvertisementEntity>(AdvertisementEntity, {
        ...rawCreated,
      }).build();
      return createdEntity;
    } catch (error) {
      throw this.advertisementRepoErrorMapper(error);
    }
  }

  async update(
    props: AdvertisementUpdateProps,
    session?: PrismaService,
  ): Promise<AdvertisementEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawUpdated = await prisma.advertisements.update({
        where: {},
        data: {
          content: props.content,
          title: props.title,
          type: props.type as unknown as string,
          logo: props.logo as unknown as Prisma.InputJsonValue,
          track_id: props.track_id,
          date: props.date,
          start_time: props.start_time,
        },
      });

      const updatedEntity = Builder<AdvertisementEntity>(AdvertisementEntity, {
        ...rawUpdated,
      }).build();
      return updatedEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findById(
    id: string,
    session?: PrismaService,
  ): Promise<AdvertisementEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const result = await prisma.advertisements.findFirst({
        where: { id },
      });
      if (!result) return null;
      return Builder<AdvertisementEntity>(AdvertisementEntity, {
        ...result,
      }).build();
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findManyFilters(props: AdvertisementFindManyProps) {
    const queryOptions: Prisma.AdvertisementsFindManyArgs = {};
    return queryOptions;
  }

  async findMany(
    props: AdvertisementFindManyProps,
    session?: PrismaService,
  ): Promise<AdvertisementEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'created_at';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const options = await this.findManyFilters(props);
      let queryOptions: Prisma.AdvertisementsFindManyArgs = {
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

      const rawResults = await prisma.advertisements.findMany(queryOptions);
      const entities = rawResults.map((rawResults) => {
        return Builder<AdvertisementEntity>(AdvertisementEntity, {
          ...rawResults,
        }).build();
      });

      return entities;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async countMany(
    props: AdvertisementFindManyProps,
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const queryOptions = await this.findManyFilters(props);
      const result = await prisma.advertisements.count({
        where: queryOptions.where,
      });
      return result;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
