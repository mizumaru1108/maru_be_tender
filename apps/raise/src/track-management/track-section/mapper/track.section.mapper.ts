import { Injectable } from '@nestjs/common';
import { Prisma, cheque, payment, track_section } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { ChequeEntity } from '../../../proposal-management/payment/entities/cheque.entity';
import { ProposalPaymentEntity } from '../../../proposal-management/payment/entities/proposal-payment.entity';
import { PaymentStatusEnum } from '../../../proposal-management/payment/types/enums/payment.status.enum';
import { ProposalEntity } from '../../../proposal-management/proposal/entities/proposal.entity';
import { TrackSectionEntity } from '../entities/track.section.entity';

export type SectionModel = track_section & {
  proposal?: {
    fsupport_by_supervisor: Prisma.Decimal | null;
    payments: (payment & {
      cheques: cheque[];
    })[];
  }[];
  child_track_section?: (track_section & {
    child_track_section: (track_section & {
      child_track_section: (track_section & {
        child_track_section: track_section[];
      })[];
    })[];
  })[];
};

@Injectable()
export class TrackSectionMapper {
  async toDomain(type: SectionModel): Promise<TrackSectionEntity> {
    const { proposal, child_track_section, ...rest } = type;

    const sectionBuilder = Builder<TrackSectionEntity>(TrackSectionEntity, {
      ...rest,
    });

    if (proposal) {
      let proposals: ProposalEntity[] = [];

      let sum_spending_budget = 0;
      let sum_reserved_budget = 0;
      if (proposal.length > 0) {
        for (const p of proposal) {
          let payments: ProposalPaymentEntity[] = [];
          if (p.payments.length > 0) {
            for (const payment of p.payments) {
              if (payment.status === PaymentStatusEnum.DONE) {
                let tmp = payment.payment_amount
                  ? parseFloat(payment.payment_amount.toString())
                  : 0;

                sum_reserved_budget += tmp;
              }

              payments.push(
                Builder<ProposalPaymentEntity>(ProposalPaymentEntity, {
                  ...payment,
                  payment_amount: payment.payment_amount
                    ? parseFloat(payment.payment_amount.toString())
                    : null,
                  order: payment.order
                    ? parseInt(payment.order.toString())
                    : null,
                  number_of_payments: payment.number_of_payments
                    ? parseInt(payment.number_of_payments.toString())
                    : null,
                  cheques: payment.cheques
                    ? payment.cheques.map((item) => {
                        return Builder<ChequeEntity>(
                          ChequeEntity,
                          item,
                        ).build();
                      })
                    : [],
                }).build(),
              );
            }
          }

          let fSupport =
            p.fsupport_by_supervisor !== null
              ? parseFloat(p.fsupport_by_supervisor.toString())
              : 0;

          sum_spending_budget += fSupport;

          proposals.push(
            Builder<ProposalEntity>(ProposalEntity, {
              ...p,
              amount_required_fsupport: undefined,
              whole_budget: undefined,
              number_of_payments: undefined,
              partial_support_amount: undefined,
              fsupport_by_supervisor: fSupport,
              number_of_payments_by_supervisor: undefined,
              execution_time: undefined,
              follow_ups: undefined,
              payments,
            }).build(),
          );
        }
      }

      sectionBuilder.proposal(proposals);
      sectionBuilder.section_spending_budget(sum_spending_budget);
      sectionBuilder.section_reserved_budget(sum_reserved_budget);
    }

    if (child_track_section) {
      const tSections: TrackSectionEntity[] = [];

      let budget = 0;
      if (child_track_section.length > 0) {
        for (const s of child_track_section) {
          if (s.is_deleted === false) {
            budget += s.budget;
          }
          tSections.push(
            Builder<TrackSectionEntity>(TrackSectionEntity, {
              ...s,
              child_track_section: s.child_track_section.map((c) => {
                return Builder<TrackSectionEntity>(TrackSectionEntity, {
                  ...c,
                  child_track_section: c.child_track_section.map((cc) => {
                    return Builder<TrackSectionEntity>(TrackSectionEntity, {
                      ...cc,
                      child_track_section: cc.child_track_section.map((ccc) => {
                        return Builder<TrackSectionEntity>(TrackSectionEntity, {
                          ...ccc,
                        }).build();
                      }),
                    }).build();
                  }),
                }).build();
              }),
            }).build(),
          );
        }
      }

      sectionBuilder.child_track_section(tSections);
      sectionBuilder.section_budget(budget);
    }

    const buildedSection = sectionBuilder.build();

    return buildedSection;
  }

  async toDomainList(model: SectionModel[]): Promise<TrackSectionEntity[]> {
    const list = model.map(async (item) => {
      const entity = await this.toDomain(item);
      return entity;
    });

    return Promise.all(list);
  }
}
