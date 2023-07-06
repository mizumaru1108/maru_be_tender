import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';
import { PreviousProposalFilterRequest } from '../../proposal-management/proposal/dtos/requests';
import { BeneficiaryEntity } from '../entity/beneficiary.entity';
import {
  CreateBeneficiaryProps,
  UpdateBeneficiaryProps,
} from '../types/beneficiary.type';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BeneficiariesRepository {
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
        BeneficiariesRepository.name,
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

      // console.log(logUtil(whereClause));
      // console.log(logUtil(queryOptions));
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
        BeneficiariesRepository.name,
        'find many beneficiary error details: ',
        'find many beneficiary!',
      );
      throw theError;
    }
  }
}
