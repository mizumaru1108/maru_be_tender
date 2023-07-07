import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProposalEditRequestEntity } from '../entities/proposal.edit.request.entity';
import { v4 as uuidv4 } from 'uuid';
import { Builder } from 'builder-pattern';
import { PayloadErrorException } from '../../../tender-commons/exceptions/payload-error.exception';
import { Prisma } from '@prisma/client';

export class CreateProposalEditRequestProps {
  id?: string;
  detail: string;
  proposal_id: string;
  reviewer_id: string;
  user_id: string;
}

export class ProposalEditRequestFindOneProps {
  id?: string;
  proposal_id?: string;
}
@Injectable()
export class ProposalEditRequestRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: CreateProposalEditRequestProps,
    session?: PrismaService,
  ): Promise<ProposalEditRequestEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.proposal_edit_request.create({
        data: {
          id: props.id || uuidv4(),
          detail: props.detail,
          proposal_id: props.proposal_id,
          reviewer_id: props.reviewer_id,
          user_id: props.user_id,
        },
      });

      const createdEntity = Builder<ProposalEditRequestEntity>(
        ProposalEditRequestEntity,
        {
          ...rawCreated,
        },
      ).build();

      return createdEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async update(props: any, session?: PrismaService): Promise<any> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findById(id: string, session?: PrismaService): Promise<any> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findOneFilter(props: ProposalEditRequestFindOneProps) {
    const { id, proposal_id } = props;
    if (!props.id && !props.proposal_id) {
      throw new PayloadErrorException(
        `You should define either id or proposal_id`,
      );
    }

    let queryOptions: Prisma.proposal_edit_requestFindFirstArgs = {};
    if (id) queryOptions.where = { ...queryOptions.where, id };
    if (proposal_id) {
      queryOptions.where = { ...queryOptions.where, proposal_id };
    }

    return queryOptions;
  }

  async findOne(
    props: ProposalEditRequestFindOneProps,
    session?: PrismaService,
  ): Promise<ProposalEditRequestEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const queryOptions = await this.findOneFilter(props);
      const rawRes = await prisma.proposal_edit_request.findFirst(queryOptions);

      if (!rawRes) return null;

      const entities = Builder<ProposalEditRequestEntity>(
        ProposalEditRequestEntity,
        {
          ...rawRes,
        },
      ).build();

      return entities;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findMany(props: any, session?: PrismaService): Promise<any> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async countMany(props: any, session?: PrismaService): Promise<any> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async deleteById(id: string, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawRes = await prisma.proposal_edit_request.delete({
        where: { id },
      });

      return Builder<ProposalEditRequestEntity>(ProposalEditRequestEntity, {
        ...rawRes,
      }).build();
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
