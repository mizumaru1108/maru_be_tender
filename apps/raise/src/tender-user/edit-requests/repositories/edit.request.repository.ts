import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../../prisma/prisma.service';
import { PrismaInvalidForeignKeyException } from '../../../tender-commons/exceptions/prisma-error/prisma.invalid.foreign.key.exception';
import { EditRequestEntity } from '../entities/edit.request.entity';
import { v4 as uuidv4 } from 'uuid';

export class EditRequestCreateProps {
  id?: string;
  new_value: string;
  old_value: string;
  user_id: string;
  reviewer_id: string;
  status_id: string;
  reject_reason: string;
}

export class EditRequestUpdateProps {
  id: string;
  new_value?: string;
  old_value?: string;
  user_id?: string;
  reviewer_id?: string;
  status_id?: string;
  reject_reason?: string | null;
  rejected_at?: Date | null;
  accepted_at?: Date | null;
}

export class EditRequestFindFirstProps {
  id?: string;
  include_relations?: EditRequestIncludeRelationsTypes[];
}

export type EditRequestIncludeRelationsTypes = 'reviewer' | 'user';
export class EditRequestDeleteManyProps {
  user_id: string;
  status_id: Array<'APPROVED' | 'REJECTED'>;
}

@Injectable()
export class EditRequestRepository {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectPinoLogger(EditRequestRepository.name) private logger: PinoLogger,
  ) {}

  errorMapper(error: any) {
    this.logger.error(`Error Details = %j`, error);

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

  applyInclude(include_relations: EditRequestIncludeRelationsTypes[]) {
    let include: Prisma.edit_requestsInclude = {};

    for (const relation of include_relations) {
      if (relation === 'reviewer') {
        include = {
          ...include,
          reviewer: true,
        };
      }

      if (relation === 'user') {
        include = {
          ...include,
          user: true,
        };
      }
    }
    return include;
  }

  findFirstFilter(props: EditRequestFindFirstProps) {
    const args: Prisma.edit_requestsFindFirstArgs = {};
    let whereClause: Prisma.edit_requestsWhereInput = {};

    if (props.id) {
      whereClause.id = props.id;
    }

    args.where = whereClause;

    if (props.include_relations && props.include_relations.length > 0) {
      args.include = this.applyInclude(props.include_relations);
    }

    return args;
  }

  async findFirst(
    props: EditRequestFindFirstProps,
    tx?: PrismaService,
  ): Promise<EditRequestEntity | null> {
    let prisma = this.prismaService;
    if (tx) prisma = tx;
    try {
      const args = this.findFirstFilter(props);
      const rawMailing = await prisma.edit_requests.findFirst({
        where: args.where,
        include: args.include,
      });

      if (!rawMailing) return null;

      const entity = Builder<EditRequestEntity>(
        EditRequestEntity,
        rawMailing,
      ).build();

      return entity;
    } catch (err) {
      this.logger.error(`error when finding edit_requests by id ${err}`);
      throw err;
    }
  }

  async create(
    props: EditRequestCreateProps,
    session?: PrismaService,
  ): Promise<EditRequestEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.edit_requests.create({
        data: {
          id: props.id || uuidv4(),
          new_value: props.new_value,
          old_value: props.old_value,
          user_id: props.user_id,
          reviewer_id: props.reviewer_id,
          status_id: props.status_id,
          reject_reason: props.reject_reason,
        },
      });

      const createdEntity = Builder<EditRequestEntity>(EditRequestEntity, {
        ...rawCreated,
      }).build();
      return createdEntity;
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  async update(
    props: EditRequestUpdateProps,
    session?: PrismaService,
  ): Promise<EditRequestEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    console.log({ props });
    try {
      const rawUpdated = await prisma.edit_requests.update({
        where: { id: props.id },
        data: {
          new_value: props.new_value,
          old_value: props.old_value,
          user_id: props.user_id,
          reviewer_id: props.reviewer_id,
          status_id: props.status_id,
          reject_reason: props.reject_reason,
          rejected_at: props.rejected_at,
          accepted_at: props.accepted_at,
        },
      });

      const updatedEntity = Builder<EditRequestEntity>(EditRequestEntity, {
        ...rawUpdated,
      }).build();
      return updatedEntity;
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  async deleteMany(
    props: EditRequestDeleteManyProps,
    session?: PrismaService,
  ): Promise<number> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const whereClause: Prisma.edit_requestsWhereInput = {};
      if (props.user_id) {
        whereClause.user_id = props.user_id;
      }

      if (props.status_id) {
        whereClause.status_id = { in: props.status_id };
      }

      const res = await prisma.edit_requests.deleteMany({
        where: whereClause,
      });

      return res.count;
    } catch (error) {
      throw this.errorMapper(error);
    }
  }
}
