import { Injectable } from '@nestjs/common';
import {
  Prisma,
  cheque,
  payment,
  proposal_log,
  track,
  track_section,
} from '@prisma/client';
import { Builder } from 'builder-pattern';
import { ChequeEntity } from '../../../proposal-management/payment/entities/cheque.entity';
import { ProposalPaymentEntity } from '../../../proposal-management/payment/entities/proposal-payment.entity';
import { PaymentStatusEnum } from '../../../proposal-management/payment/types/enums/payment.status.enum';
import { ProposalLogEntity } from '../../../proposal-management/proposal-log/entities/proposal-log.entity';
import { ProposalLogActionEnum } from '../../../proposal-management/proposal-log/types/enums/proposal.log.action.enum';
import { ProposalEntity } from '../../../proposal-management/proposal/entities/proposal.entity';
import { TenderAppRoleEnum } from '../../../tender-commons/types';
import { TrackSectionEntity } from '../../track-section/entities/track.section.entity';
import { TrackEntity } from '../entities/track.entity';

export type TrackModel = track & {
  proposal?: {
    id: string;
    project_name: string;
    track_id: string;
    fsupport_by_supervisor: Prisma.Decimal | null;
    payments: (payment & {
      cheques: cheque[];
    })[];
    proposal_logs: proposal_log[];
  }[];
  track_section?: (track_section & {
    child_track_section: (track_section & {
      child_track_section: (track_section & {
        child_track_section: (track_section & {
          child_track_section: track_section[];
        })[];
      })[];
    })[];
  })[];
};

@Injectable()
export class TrackMapper {
  async toDomain(type: TrackModel): Promise<TrackEntity> {
    const { proposal, track_section, ...rest } = type;

    const trackBuilder = Builder<TrackEntity>(TrackEntity, {
      ...rest,
    });

    if (proposal) {
      let proposals: ProposalEntity[] = [];

      let sum_spending_budget = 0;
      let sum_reserved_budget = 0;
      let sum_spending_budget_by_ceo = 0;
      if (proposal.length > 0) {
        for (const p of proposal) {
          let payments: ProposalPaymentEntity[] = [];
          let logs: ProposalLogEntity[] = [];

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

          if (p.proposal_logs.length > 0) {
            for (const log of p.proposal_logs) {
              if (
                log.action === ProposalLogActionEnum.ACCEPT &&
                log.state === TenderAppRoleEnum.CEO &&
                log.user_role === TenderAppRoleEnum.CEO
              ) {
                sum_spending_budget_by_ceo += fSupport;
              }

              logs.push(
                Builder<ProposalLogEntity>(ProposalLogEntity, {
                  ...log,
                }).build(),
              );
            }
          }

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
              proposal_logs: logs,
            }).build(),
          );
        }
      }

      trackBuilder.proposals(proposals);
      trackBuilder.total_spending_budget(sum_spending_budget);
      trackBuilder.total_reserved_budget(sum_reserved_budget);
    }

    if (track_section) {
      const tSections: TrackSectionEntity[] = [];

      let budget = 0;
      if (track_section.length > 0) {
        for (const s of track_section) {
          if (s.is_deleted === false) {
            budget += s.budget;

            tSections.push(
              Builder<TrackSectionEntity>(TrackSectionEntity, {
                ...s,
                child_track_section: s.child_track_section
                  .filter((v) => !v.is_deleted)
                  .map((c) => {
                    return Builder<TrackSectionEntity>(TrackSectionEntity, {
                      ...c,
                      child_track_section: c.child_track_section
                        .filter((vv) => !vv.is_deleted)
                        .map((cc) => {
                          return Builder<TrackSectionEntity>(
                            TrackSectionEntity,
                            {
                              ...cc,
                              child_track_section: cc.child_track_section
                                .filter((vvv) => !vvv.is_deleted)
                                .map((ccc) => {
                                  return Builder<TrackSectionEntity>(
                                    TrackSectionEntity,
                                    {
                                      ...ccc,
                                      child_track_section:
                                        ccc.child_track_section
                                          .filter((vvvv) => !vvvv.is_deleted)
                                          .map((cccc) => {
                                            return Builder<TrackSectionEntity>(
                                              TrackSectionEntity,
                                              {
                                                ...cccc,
                                              },
                                            ).build();
                                          }),
                                    },
                                  ).build();
                                }),
                            },
                          ).build();
                        }),
                    }).build();
                  }),
              }).build(),
            );
          }
        }
      }

      trackBuilder.sections(tSections);
      trackBuilder.total_budget(budget);
    }

    const buildedTrack = trackBuilder.build();

    return buildedTrack;
  }

  async toDomainList(model: TrackModel[]): Promise<TrackEntity[]> {
    const list = model.map(async (item) => {
      const entity = await this.toDomain(item);
      return entity;
    });

    return Promise.all(list);
  }
}
