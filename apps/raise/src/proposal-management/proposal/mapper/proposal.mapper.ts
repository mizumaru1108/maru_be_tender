import { Injectable } from '@nestjs/common';
import {
  ClosingReportBeneficiaries,
  ClosingReportExecutionPlaces,
  ClosingReportGenders,
  Governorate,
  ProposalGovernorate,
  ProposalRegion,
  Region,
  bank_information,
  beneficiaries,
  cheque,
  payment,
  project_timeline,
  proposal,
  proposal_closing_report,
  proposal_follow_up,
  proposal_item_budget,
  proposal_log,
  track,
  user,
  user_role,
} from '@prisma/client';
import { Builder } from 'builder-pattern';
import { ProposalItemBudgetEntity } from '../../item-budget/entities/proposal.item.budget.entity';
import { ProposalEntity } from '../entities/proposal.entity';
import { BeneficiaryEntity } from '../../../beneficiary/entity/beneficiary.entity';
import { ProposalFollowUpEntity } from '../../follow-up/entities/proposal.follow.up.entity';
import { UserEntity } from '../../../tender-user/user/entities/user.entity';
import { TrackEntity } from '../../../track-management/track/entities/track.entity';
import { ProposalLogEntity } from '../../proposal-log/entities/proposal-log.entity';
import { ProposalPaymentEntity } from '../../payment/entities/proposal-payment.entity';
import { ChequeEntity } from '../../payment/entities/cheque.entity';
import { BankInformationEntity } from '../../../bank/entities/bank-information.entity';
import { ProposalProjectTimelineEntity } from '../../poject-timelines/entities/proposal.project.timeline.entity';
import { ClosingReportGendersEntity } from '../../closing-report/entity/closing.report.genders.entity';
import { ProposalCloseReportEntity } from '../../closing-report/entity/proposal.close.report.entity';
import { ClosingReportBeneficiariesEntity } from '../../closing-report/entity/closing.report.beneficiaries.entity';
import { ClosingReportExecutionPlacesEntity } from '../../closing-report/entity/closing.report.execution.places.entity';
import { ProposalGovernorateEntity } from '../../proposal-regions/governorate/entities/proposal.governorate.entity';
import { GovernorateEntity } from '../../../region-management/governorate/entities/governorate.entity';
import { ProposalRegionEntity } from '../../proposal-regions/region/entities/proposal.region.entity';
import { RegionEntity } from '../../../region-management/region/entities/region.entity';

export type ProposalModel = proposal & {
  user?: user;
  beneficiary_details?: beneficiaries | null;
  follow_ups?: (proposal_follow_up & {
    user: user & {
      roles: user_role[];
    };
  })[];
  track?: track;
  proposal_item_budgets?: proposal_item_budget[];
  supervisor?: user;
  proposal_logs?: (proposal_log & {
    reviewer: user | null;
  })[];
  payments?: (payment & {
    cheques: cheque[];
  })[];
  bank_information?: bank_information;
  project_timeline?: project_timeline[];
  proposal_closing_report?: (proposal_closing_report & {
    beneficiaries: ClosingReportBeneficiaries[];
    execution_places: ClosingReportExecutionPlaces[];
    genders: ClosingReportGenders[];
  })[];
  proposal_governorates?: (ProposalGovernorate & {
    governorate: Governorate;
  })[];
  proposal_regions?: (ProposalRegion & {
    region: Region;
  })[];
};

@Injectable()
export class ProposalMapper {
  async toDomain(type: ProposalModel): Promise<ProposalEntity> {
    const {
      user,
      beneficiary_details,
      follow_ups,
      track,
      proposal_item_budgets,
      supervisor,
      proposal_logs,
      payments,
      bank_information,
      project_timeline,
      proposal_closing_report,
      proposal_governorates,
      proposal_regions,
      ...rest
    } = type;

    const proposalBuilder = Builder<ProposalEntity>(ProposalEntity, {
      ...rest,
      amount_required_fsupport:
        rest.amount_required_fsupport !== null
          ? parseFloat(rest.amount_required_fsupport.toString())
          : null,
      whole_budget:
        rest.whole_budget !== null
          ? parseFloat(rest.whole_budget.toString())
          : null,
      number_of_payments:
        rest.number_of_payments !== null
          ? parseFloat(rest.number_of_payments.toString())
          : null,
      partial_support_amount:
        rest.partial_support_amount !== null
          ? parseFloat(rest.partial_support_amount.toString())
          : null,
      fsupport_by_supervisor:
        rest.fsupport_by_supervisor !== null
          ? parseFloat(rest.fsupport_by_supervisor.toString())
          : null,
      number_of_payments_by_supervisor:
        rest.number_of_payments_by_supervisor !== null
          ? parseFloat(rest.number_of_payments_by_supervisor.toString())
          : null,
      execution_time:
        rest.execution_time !== null
          ? parseFloat(rest.execution_time.toString())
          : null,
      follow_ups: undefined,
    });

    if (user) {
      const userBuilder = Builder<UserEntity>(UserEntity, {
        ...user,
      }).build();

      proposalBuilder.user(userBuilder);
    }

    if (beneficiary_details) {
      const beneficiary = Builder<BeneficiaryEntity>(
        BeneficiaryEntity,
        beneficiary_details,
      ).build();
      proposalBuilder.beneficiary_detail(beneficiary);
    }

    if (follow_ups) {
      proposalBuilder.follow_ups(
        follow_ups.map((item) => {
          const userBuilder = Builder<UserEntity>(UserEntity, {
            ...item.user,
          }).build();

          return Builder<ProposalFollowUpEntity>(ProposalFollowUpEntity, {
            ...item,
            user: userBuilder,
          }).build();
        }),
      );
    }

    if (track) {
      const trackBuilder = Builder<TrackEntity>(TrackEntity, track).build();
      proposalBuilder.track(trackBuilder);
    }

    if (proposal_item_budgets && proposal_item_budgets.length > 0) {
      const itemBudgets: ProposalItemBudgetEntity[] = [];
      for (const rawItemBudget of proposal_item_budgets) {
        itemBudgets.push(
          Builder<ProposalItemBudgetEntity>(ProposalItemBudgetEntity, {
            ...rawItemBudget,
            amount: parseFloat(rawItemBudget.amount.toString()),
          }).build(),
        );
      }
      proposalBuilder.proposal_item_budgets(itemBudgets);
    }

    if (supervisor) {
      const buildSupervisor = (
        payload: user | null,
      ): UserEntity | undefined => {
        if (!payload) return undefined;
        return Builder<UserEntity>(UserEntity, payload).build();
      };

      const supervisorBuilderResult = buildSupervisor(supervisor);

      proposalBuilder.supervisor(supervisorBuilderResult);
    }

    if (proposal_logs) {
      const logs: ProposalLogEntity[] = [];

      for (const log of proposal_logs) {
        const buildReviewer = (
          payload: user | null,
        ): UserEntity | undefined => {
          if (!payload) return undefined;
          return Builder<UserEntity>(UserEntity, payload).build();
        };

        logs.push(
          Builder<ProposalLogEntity>(ProposalLogEntity, {
            ...log,
            reviewer: buildReviewer(log.reviewer),
          }).build(),
        );
      }

      proposalBuilder.proposal_logs(logs);
    }

    if (payments) {
      const paymentEntities: ProposalPaymentEntity[] = [];
      for (const payment of payments) {
        paymentEntities.push(
          Builder<ProposalPaymentEntity>(ProposalPaymentEntity, {
            ...payment,
            payment_amount: payment.payment_amount
              ? parseFloat(payment.payment_amount.toString())
              : null,
            order: payment.order ? parseInt(payment.order.toString()) : null,
            number_of_payments: payment.number_of_payments
              ? parseInt(payment.number_of_payments.toString())
              : null,
            cheques: payment.cheques
              ? payment.cheques.map((item) => {
                  return Builder<ChequeEntity>(ChequeEntity, item).build();
                })
              : [],
          }).build(),
        );
      }
      proposalBuilder.payments(paymentEntities);
    }

    if (bank_information) {
      const bankInfoBuilder = Builder<BankInformationEntity>(
        BankInformationEntity,
        bank_information,
      ).build();

      proposalBuilder.bank_information(bankInfoBuilder);
    }

    if (project_timeline) {
      const timelines: ProposalProjectTimelineEntity[] = [];
      for (const timeline of project_timeline) {
        timelines.push(
          Builder<ProposalProjectTimelineEntity>(
            ProposalProjectTimelineEntity,
            {
              ...timeline,
            },
          ).build(),
        );
      }
      proposalBuilder.project_timeline(timelines);
    }

    if (proposal_closing_report) {
      const closingReports: ProposalCloseReportEntity[] = [];
      for (const closingReport of proposal_closing_report) {
        const closingBeneficiaries: ClosingReportBeneficiariesEntity[] = [];
        for (const beneficiary of closingReport.beneficiaries) {
          closingBeneficiaries.push(
            Builder<ClosingReportBeneficiariesEntity>(
              ClosingReportBeneficiariesEntity,
              beneficiary,
            ).build(),
          );
        }

        const closingExecutionPlaces: ClosingReportExecutionPlacesEntity[] = [];
        for (const executionPlace of closingReport.execution_places) {
          closingExecutionPlaces.push(
            Builder<ClosingReportExecutionPlacesEntity>(
              ClosingReportExecutionPlacesEntity,
              executionPlace,
            ).build(),
          );
        }

        const closingGenders: ClosingReportGendersEntity[] = [];
        for (const gender of closingReport.genders) {
          closingGenders.push(
            Builder<ClosingReportGendersEntity>(ClosingReportGendersEntity, {
              ...gender,
            }).build(),
          );
        }

        closingReports.push(
          Builder<ProposalCloseReportEntity>(ProposalCloseReportEntity, {
            ...closingReport,
            beneficiaries: closingBeneficiaries,
            execution_places: closingExecutionPlaces,
            genders: closingGenders,
          }).build(),
        );
      }

      proposalBuilder.proposal_closing_report(closingReports);
    }

    if (proposal_governorates) {
      const pGovernorates: ProposalGovernorateEntity[] = [];

      for (const g of proposal_governorates) {
        const gEntity: GovernorateEntity = Builder<GovernorateEntity>(
          g.governorate,
        ).build();

        pGovernorates.push(
          Builder<ProposalGovernorateEntity>(ProposalGovernorateEntity, {
            ...g,
            governorate: gEntity,
          }).build(),
        );
      }

      proposalBuilder.proposal_governorates(pGovernorates);
    }

    if (proposal_regions) {
      const pRegions: ProposalRegionEntity[] = [];

      for (const r of proposal_regions) {
        const rEntity: RegionEntity = Builder<RegionEntity>(r.region).build();

        pRegions.push(
          Builder<ProposalRegionEntity>(ProposalRegionEntity, {
            ...r,
            region: rEntity,
          }).build(),
        );
      }

      proposalBuilder.proposal_regions(pRegions);
    }

    return proposalBuilder.build();
  }

  async toDomainList(model: ProposalModel[]): Promise<ProposalEntity[]> {
    const list = model.map(async (item) => {
      const entity = await this.toDomain(item);
      return entity;
    });

    return Promise.all(list);
  }
}
