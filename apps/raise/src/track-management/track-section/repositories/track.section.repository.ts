import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../../prisma/prisma.service';
import { TrackSectionEntity } from '../entities/track.section.entity';
import { TrackSectionCreateDto } from '../dtos/requests/track.sections.create.dto';

export type TrackSectionIncludeTypes = 'parent_section' | 'child_track_section';

export class TrackSectionCreateProps {
  id?: string;
  name: string;
  budget: number;
  track_id: string;
  parent_section_id?: string;
}

export class TrackSectionUpdateProps {
  id: string;
  name?: string;
  budget?: number;
  track_id?: string;
  parent_section_id?: string;
  is_deleted?: boolean;
}

export class TrackSectionFindFirstProps {
  id?: string;
  include_relations?: TrackSectionIncludeTypes[];
}

export class TrackSectionFindManyProps {
  proposal_id?: string;
  track_id?: string;
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: TrackSectionIncludeTypes[];
}

@Injectable()
export class TrackSectionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: TrackSectionCreateProps,
    session?: PrismaService,
  ): Promise<TrackSectionEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.track_section.create({
        data: {
          id: props.id || uuidv4(),
          name: props.name,
          budget: props.budget,
          parent_section_id: props.parent_section_id,
          track_id: props.track_id,
        },
      });

      const createdEntity = Builder<TrackSectionEntity>(TrackSectionEntity, {
        ...rawCreated,
      }).build();
      return createdEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async update(
    props: TrackSectionUpdateProps,
    session?: PrismaService,
  ): Promise<TrackSectionEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawUpdated = await prisma.track_section.update({
        where: { id: props.id },
        data: {
          id: props.id || uuidv4(),
          name: props.name,
          budget: props.budget,
          parent_section_id: props.parent_section_id,
          track_id: props.track_id,
          is_deleted: props.is_deleted,
        },
      });

      const updatedEntity = Builder<TrackSectionEntity>(TrackSectionEntity, {
        ...rawUpdated,
      }).build();

      return updatedEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  applyInclude(include_relations: TrackSectionIncludeTypes[]) {
    let include: Prisma.track_sectionInclude = {};
    for (const relation of include_relations) {
      if (relation === 'parent_section') {
        include = {
          ...include,
          parent_section: true,
        };
      }
      if (relation === 'child_track_section') {
        include = {
          ...include,
          child_track_section: true,
        };
      }
    }
    return include;
  }

  findManyFilter(props: TrackSectionFindManyProps) {
    const { include_relations } = props;
    let args: Prisma.track_sectionFindManyArgs = {};
    let whereClause: Prisma.track_sectionWhereInput = {};

    if (props.track_id) whereClause.track_id = props.track_id;

    if (include_relations && include_relations.length > 0) {
      args.include = this.applyInclude(include_relations);
    }

    args.where = whereClause;
    return args;
  }

  async findFirstFilter(
    props: TrackSectionFindFirstProps,
  ): Promise<Prisma.track_sectionFindFirstArgs> {
    const { include_relations } = props;

    const args: Prisma.track_sectionFindFirstArgs = {};
    let whereClause: Prisma.track_sectionWhereInput = {};

    if (props.id) whereClause.id = props.id;

    args.where = whereClause;

    if (include_relations && include_relations.length > 0) {
      args.include = this.applyInclude(include_relations);
    }

    return args;
  }

  async findFirst(
    props: TrackSectionFindFirstProps,
    session?: PrismaService,
  ): Promise<TrackSectionEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const args = await this.findFirstFilter(props);
      const rawRes = await prisma.track_section.findFirst({
        where: args.where,
        include: args.include,
      });

      // console.log({ args });
      // console.log({ rawRes });
      const foundedEntity = Builder<TrackSectionEntity>(TrackSectionEntity, {
        ...rawRes,
      }).build();

      return foundedEntity;
    } catch (error) {
      throw error;
    }
  }

  async findMany(
    props: TrackSectionFindManyProps,
    session?: PrismaService,
  ): Promise<TrackSectionEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'created_at';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const args = this.findManyFilter(props);
      let queryOptions: Prisma.track_sectionFindManyArgs = {
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

      const rawResult = await prisma.track_section.findMany(queryOptions);
      const entities = rawResult.map((rawResult) => {
        return Builder<TrackSectionEntity>(TrackSectionEntity, {
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
    props: TrackSectionFindManyProps,
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const args = this.findManyFilter(props);
      return await prisma.track_section.count({
        where: args.where,
      });
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async delete(
    id: string,
    session?: PrismaService,
  ): Promise<TrackSectionEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawDeleted = await prisma.track_section.delete({
        where: { id },
      });

      const createdEntity = Builder<TrackSectionEntity>(TrackSectionEntity, {
        ...rawDeleted,
      }).build();
      return createdEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async deleteByTrackId(
    track_id: string,
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawDeleted = await prisma.track_section.deleteMany({
        where: { track_id },
      });

      return rawDeleted.count;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async arraySave(
    track_id: string,
    sectionPayloads: TrackSectionCreateDto[],
    session?: PrismaService,
  ): Promise<void> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      // Find track sections
      const existingTrackSection = await this.findMany(
        {
          track_id,
        },
        prisma,
      );

      // get track id
      const existingTrackIds = existingTrackSection.map((track) => track.id);

      for (const section of sectionPayloads) {
        //  if it doesnt exist
        if (!existingTrackIds.includes(section.id)) {
          this.create(section, prisma);
        }

        // if it exist
        if (existingTrackIds.includes(section.id)) {
          this.update(
            {
              id: section.id,
              name: section.name,
              budget: section.budget,
              parent_section_id: section.parent_section_id,
              track_id: section.track_id,
              is_deleted: section.is_deleted,
            },
            prisma,
          );
        }
      }
    } catch (error) {
      console.error(`Error during arraySave: ${error.message}`);
      throw error;
    }
  }
}
