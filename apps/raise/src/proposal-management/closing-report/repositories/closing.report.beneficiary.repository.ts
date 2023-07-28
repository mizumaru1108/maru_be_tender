import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClosingReportBeneficiariesEntity } from 'src/proposal-management/closing-report/entity/closing.report.beneficiaries.entity';

export class ClosingReportBeneficiaryCreateProps {
  id?: string;
  closing_report_id: string;
  selected_values: string;
  selected_numbers: number;
}

export class ClosingReportBeneficiaryUpdateProps {}

export class ClosingReportBeneficiaryFindManyProps {
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

@Injectable()
export class ClosingReportBeneficiaryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: ClosingReportBeneficiaryCreateProps,
    session?: PrismaService,
  ): Promise<ClosingReportBeneficiariesEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.closingReportBeneficiaries.create({
        data: {
          id: props.id || nanoid(),
          closing_report_id: props.closing_report_id,
          selected_values: props.selected_values,
          selected_numbers: props.selected_numbers,
        },
      });

      const createdEntity = Builder<ClosingReportBeneficiariesEntity>(
        ClosingReportBeneficiariesEntity,
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
}
