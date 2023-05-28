import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateBeneficiaryProps,
  UpdateBeneficiaryProps,
} from '../types/beneficiary.type';
import { BeneficiaryEntity } from '../entity/beneficiary.entity';
import { Builder } from 'builder-pattern';
import { Prisma } from '@prisma/client';
import { logUtil } from '../../../commons/utils/log-util';
import {
  InnerStatusEnum,
  ProposalAction,
} from '../../../tender-commons/types/proposal';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { PreviousProposalFilterRequest } from '../../tender-proposal/dtos/requests';
import { TenderProposalRepository } from '../../tender-proposal/repositories/tender-proposal.repository';

@Injectable()
export class TenderProposalBeneficiariesRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(
    id: string,
    session?: PrismaService,
  ): Promise<BeneficiaryEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    const result = await this.prismaService.beneficiaries.findFirst({
      where: { id },
    });

    if (!result) return null;

    const entity = Builder<BeneficiaryEntity>(BeneficiaryEntity, {
      id: result.id,
      name: result.name,
      is_deleted: result.is_deleted || false,
    }).build();

    return entity;
  }

  async create(
    payload: CreateBeneficiaryProps,
    session?: PrismaService,
  ): Promise<BeneficiaryEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    const result = await this.prismaService.beneficiaries.create({
      data: {
        id: payload.id || uuidv4(),
        name: payload.name,
      },
    });

    const entity = Builder<BeneficiaryEntity>(BeneficiaryEntity, {
      id: result.id,
      name: result.name,
      is_deleted: result.is_deleted || false,
    }).build();

    return entity;
  }

  async update(
    payload: UpdateBeneficiaryProps,
    session?: PrismaService,
  ): Promise<BeneficiaryEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    const result = await this.prismaService.beneficiaries.update({
      where: { id: payload.id },
      data: {
        name: payload.name,
        is_deleted: payload.is_deleted,
      },
    });

    const entity = Builder<BeneficiaryEntity>(BeneficiaryEntity, {
      id: result.id,
      name: result.name,
      is_deleted: result.is_deleted || false,
    }).build();

    return entity;
  }

  async find(
    id: string,
    session?: PrismaService,
  ): Promise<BeneficiaryEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const result = await this.prismaService.beneficiaries.findFirst({
        where: { id },
      });

      if (!result) return null;

      const entity = Builder<BeneficiaryEntity>(BeneficiaryEntity, {
        id: result.id,
        name: result.name,
        is_deleted: result.is_deleted || false,
      }).build();

      return entity;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalRepository.name,
        'find beneficiary error details: ',
        'finding beneficiary!',
      );
      throw theError;
    }
  }

  async findAll(
    filter: PreviousProposalFilterRequest,
    session?: PrismaService,
  ) {
    try {
      let prisma = this.prismaService;
      if (session) prisma = session;

      const { page = 1, limit = 10, sort = 'desc', sorting_field } = filter;

      const offset = (page - 1) * limit;

      let whereClause: Prisma.beneficiariesWhereInput = {};

      const order_by: Prisma.beneficiariesOrderByWithRelationInput = {};
      const field =
        sorting_field as keyof Prisma.beneficiariesOrderByWithRelationInput;
      if (sorting_field) {
        order_by[field] = sort;
      } else {
        order_by.name = sort;
      }

      let queryOptions: Prisma.beneficiariesFindManyArgs = {
        where: whereClause,
        skip: offset,
        orderBy: order_by,
      };

      if (limit > 0) {
        queryOptions = {
          ...queryOptions,
          take: limit,
        };
      }

      console.log(logUtil(whereClause));
      console.log(logUtil(queryOptions));
      const data = await prisma.beneficiaries.findMany(queryOptions);

      const total = await prisma.beneficiaries.count({
        where: whereClause,
      });

      if (data.length > 0) {
        const beneficiaries = data.map((beneficiary) => {
          return Builder<BeneficiaryEntity>(BeneficiaryEntity, {
            id: beneficiary.id,
            name: beneficiary.name,
            is_deleted: beneficiary.is_deleted || false,
          }).build();
        });

        return {
          data: beneficiaries,
          total,
        };
      }

      return {
        data: [],
        total,
      };
    } catch (err) {
      const theError = prismaErrorThrower(
        err,
        TenderProposalRepository.name,
        'find many beneficiary error details: ',
        'find many beneficiary!',
      );
      throw theError;
    }
  }
}
