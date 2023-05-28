import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateBeneficiaryProps,
  UpdateBeneficiaryProps,
} from '../types/beneficiary.type';
import { BeneficiaryEntity } from '../entity/beneficiary.entity';
import { Builder } from 'builder-pattern';

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
}
