import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { PrismaService } from '../../../prisma/prisma.service';
import { SectionSupervisorEntity } from '../entities/section.supervisor.entity';
import { nanoid } from 'nanoid';

export type SectionSupervisorIncludeTypes = 'supervisor' | 'track_section';

export class SectionSupervisorCreateProps {
  section_supervisor_id?: string;
  section_id: string;
  supervisor_user_id: string;
}

export class SectionSupervisorUpdateProps {
  section_supervisor_id: string;
  section_id?: string;
  supervisor_user_id?: string;
}

export class SectionSupervisorSaveProps {
  section_id: string;
  supervisor_user_id: string[];
}

export class SectionSupervisorFindFirstProps {
  section_supervisor_id?: string;
  section_id?: string;
  supervisor_user_id?: string;
  include_relations?: SectionSupervisorIncludeTypes[];
}

export class SectionSupervisorFindManyProps {
  section_supervisor_id?: string;
  section_id?: string;
  supervisor_user_id?: string;
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: SectionSupervisorIncludeTypes[];
}

@Injectable()
export class SectionSupervisorRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: SectionSupervisorCreateProps,
    session?: PrismaService,
  ): Promise<SectionSupervisorEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.sectionSupervisor.create({
        data: {
          section_supervisor_id: props.section_supervisor_id || nanoid(),
          supervisor_user_id: props.supervisor_user_id,
          section_id: props.section_id,
        },
      });

      const createdEntity = Builder<SectionSupervisorEntity>(
        SectionSupervisorEntity,
        rawCreated,
      ).build();

      return createdEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async update(
    props: SectionSupervisorUpdateProps,
    session?: PrismaService,
  ): Promise<SectionSupervisorEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawUpdated = await prisma.sectionSupervisor.update({
        where: { section_supervisor_id: props.section_supervisor_id },
        data: {
          supervisor_user_id: props.supervisor_user_id,
          section_id: props.section_id,
        },
      });

      const updatedEntity = Builder<SectionSupervisorEntity>(
        SectionSupervisorEntity,
        rawUpdated,
      ).build();

      return updatedEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async deleteBySectionAndSupervisorId(
    section_id: string,
    supervisor_id: string,
    session: PrismaService,
  ) {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const res = await prisma.sectionSupervisor.deleteMany({
        where: {
          section_id: section_id,
          supervisor_user_id: supervisor_id,
        },
      });

      return res.count;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  applyInclude(include_relations: SectionSupervisorIncludeTypes[]) {
    let include: Prisma.SectionSupervisorInclude = {};
    for (const relation of include_relations) {
      if (relation === 'track_section') {
        include = {
          ...include,
          track_section: true,
        };
      }
      if (relation === 'supervisor') {
        include = {
          ...include,
          supervisor: true,
        };
      }
    }
    return include;
  }

  findManyFilter(props: SectionSupervisorFindManyProps) {
    const { include_relations } = props;
    let args: Prisma.SectionSupervisorFindManyArgs = {};
    let whereClause: Prisma.SectionSupervisorWhereInput = {};

    // if (props.track_id) whereClause.track_id = props.track_id;
    if (props.section_supervisor_id) {
      whereClause.section_supervisor_id = props.section_supervisor_id;
    }
    if (props.section_id) whereClause.section_id = props.section_id;
    if (props.supervisor_user_id) {
      whereClause.supervisor_user_id = props.supervisor_user_id;
    }

    if (include_relations && include_relations.length > 0) {
      args.include = this.applyInclude(include_relations);
    }

    args.where = whereClause;
    return args;
  }

  async findFirstFilter(
    props: SectionSupervisorFindFirstProps,
  ): Promise<Prisma.SectionSupervisorFindFirstArgs> {
    const { include_relations } = props;

    const args: Prisma.SectionSupervisorFindFirstArgs = {};
    let whereClause: Prisma.SectionSupervisorWhereInput = {};

    if (props.section_supervisor_id) {
      whereClause.section_supervisor_id = props.section_supervisor_id;
    }
    if (props.section_id) whereClause.section_id = props.section_id;
    if (props.supervisor_user_id) {
      whereClause.supervisor_user_id = props.supervisor_user_id;
    }

    args.where = whereClause;

    if (include_relations && include_relations.length > 0) {
      args.include = this.applyInclude(include_relations);
    }

    return args;
  }

  async findMany(
    props: SectionSupervisorFindManyProps,
    session?: PrismaService,
  ): Promise<SectionSupervisorEntity[]> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'section_supervisor_id';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      const args = this.findManyFilter(props);
      let queryOptions: Prisma.SectionSupervisorFindManyArgs = {
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

      const rawResult = await prisma.sectionSupervisor.findMany(queryOptions);
      const entities = rawResult.map((entity) =>
        Builder<SectionSupervisorEntity>(
          SectionSupervisorEntity,
          entity,
        ).build(),
      );

      return entities;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async arraySave(
    sectionSupervisorPayloads: SectionSupervisorSaveProps[],
    session?: PrismaService,
  ): Promise<void> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      for (const section of sectionSupervisorPayloads) {
        // Find exsisting section supervisor
        const existingSectionSupervisor = await this.findMany(
          {
            section_id: section.section_id,
          },
          prisma,
        );

        // get the supervisorid from current existing record
        const existingSupervisorIds = existingSectionSupervisor.map(
          (es) => es.supervisor_user_id,
        );

        // loop supervisor id from given payload and create if it doesnt exist on existingSupervisorIds
        for (const supervisorId of section.supervisor_user_id) {
          if (!existingSupervisorIds.includes(supervisorId)) {
            const cPayload = Builder<SectionSupervisorCreateProps>(
              SectionSupervisorCreateProps,
              {
                section_id: section.section_id,
                supervisor_user_id: supervisorId,
              },
            ).build();
            await this.create(cPayload, prisma);
          }

          // if it exist
          // if (existingSupervisorIds.includes(supervisorId)) {
          //   const uPayload = Builder<SectionSupervisorUpdateProps>(
          //     SectionSupervisorUpdateProps,
          //     {
          //       section_id: section.section_id,
          //       supervisor_user_id: supervisorId,
          //     },
          //   ).build();
          //   await this.update(uPayload, prisma);
          // }
        }

        // loop supervisor id from existingSupervisorIds and delete if it doesnt exist in given payload
        for (const existingSupervisorId of existingSupervisorIds) {
          if (!section.supervisor_user_id.includes(existingSupervisorId)) {
            this.deleteBySectionAndSupervisorId(
              section.section_id,
              existingSupervisorId,
              prisma,
            );
          }
        }
      }
    } catch (error) {
      console.error(`Error during arraySave: ${error.message}`);
      throw error;
    }
  }
}
