import { Injectable, NotFoundException } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBeneficiariesDto } from '../dtos/requests/create-beneficiaries.dto';
import { FindBeneficiariesFilterRequest } from '../dtos/requests/find-beneficiaries.dto';
import { UpdateBeneficiaryDto } from '../dtos/requests/update-beneficiaries.dto';
import { BeneficiariesRepository } from '../repositories/beneficiaries.repository';
import { UpdateBeneficiaryProps } from '../types/beneficiary.type';

@Injectable()
export class BeneficiaresService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly beneficiaryRepo: BeneficiariesRepository,
  ) {}

  async create(request: CreateBeneficiariesDto) {
    try {
      return await this.beneficiaryRepo.create({
        name: request.name,
      });
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async update(request: UpdateBeneficiaryDto) {
    try {
      return await this.prismaService.$transaction(async (session) => {
        const prismaSession =
          session instanceof PrismaService ? session : this.prismaService;

        const beneficiary = await this.beneficiaryRepo.findById(
          request.id,
          prismaSession,
        );
        if (!beneficiary) throw new NotFoundException('Beneficiary not found!');

        const payload = Builder<UpdateBeneficiaryProps>(
          UpdateBeneficiaryProps,
          {
            id: beneficiary.id,
            name:
              request.name === beneficiary.name
                ? beneficiary.name
                : request.name,
            is_deleted:
              request.is_deleted === beneficiary.is_deleted
                ? beneficiary.is_deleted
                : request.is_deleted,
          },
        ).build();

        return await this.beneficiaryRepo.update(payload, prismaSession);
      });
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async find(id: string) {
    return await this.beneficiaryRepo.find(id);
  }

  async findAll(filter: FindBeneficiariesFilterRequest) {
    return await this.beneficiaryRepo.findAll(filter);
  }
}
