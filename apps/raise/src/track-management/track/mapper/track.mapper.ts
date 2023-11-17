import { Injectable } from '@nestjs/common';
import {
  Prisma,
  cheque,
  payment,
  track,
  track_section,
  SectionSupervisor,
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
import { SectionSupervisorEntity } from '../../section-supervisor/entities/section.supervisor.entity';

export type TrackModel = track & {
  proposal?: {
    fsupport_by_supervisor: Prisma.Decimal | null;
    payments: (payment & {
      cheques: cheque[];
    })[];
    proposal_logs: {
      action: string | null;
      state: string;
      user_role: string | null;
    }[];
  }[];
  track_section?: (track_section & {
    child_track_section?: (track_section & {
      child_track_section?: (track_section & {
        child_track_section?: (track_section & {
          child_track_section?: track_section[];
          proposal?: {
            fsupport_by_supervisor: Prisma.Decimal | null;
            payments: (payment & {
              cheques: cheque[];
            })[];
            proposal_logs: {
              action: string | null;
              state: string;
              user_role: string | null;
            }[];
          }[];
          section_supervisor?: SectionSupervisor[];
        })[];
        proposal?: {
          fsupport_by_supervisor: Prisma.Decimal | null;
          payments: (payment & {
            cheques: cheque[];
          })[];
          proposal_logs: {
            action: string | null;
            state: string;
            user_role: string | null;
          }[];
        }[];
        section_supervisor?: SectionSupervisor[];
      })[];
      proposal?: {
        fsupport_by_supervisor: Prisma.Decimal | null;
        payments: (payment & {
          cheques: cheque[];
        })[];
        proposal_logs: {
          action: string | null;
          state: string;
          user_role: string | null;
        }[];
      }[];
      section_supervisor?: SectionSupervisor[];
    })[];
    proposal?: {
      fsupport_by_supervisor: Prisma.Decimal | null;
      payments: (payment & {
        cheques: cheque[];
      })[];
      proposal_logs: {
        action: string | null;
        state: string;
        user_role: string | null;
      }[];
    }[];
    section_supervisor?: SectionSupervisor[];
  })[];
};

@Injectable()
export class TrackMapper {
  mapProposal = (
    props:
      | {
          fsupport_by_supervisor: Prisma.Decimal | null;
          payments: (payment & {
            cheques: cheque[];
          })[];
          proposal_logs: {
            action: string | null;
            state: string;
            user_role: string | null;
          }[];
        }[]
      | undefined,
  ) => {
    let proposals: ProposalEntity[] = [];
    let logs: ProposalLogEntity[] = [];

    let sum_spending_budget = 0;
    let sum_reserved_budget = 0;
    let sum_spending_budget_by_ceo = 0;

    if (props && props.length > 0) {
      for (const p of props) {
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
                      return Builder<ChequeEntity>(ChequeEntity, item).build();
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

    return {
      proposals,
      sum_spending_budget,
      sum_reserved_budget,
      sum_spending_budget_by_ceo,
    };
  };

  mapSupervisor = (
    section_supervisor?: SectionSupervisor[],
  ): SectionSupervisorEntity[] => {
    if (section_supervisor && section_supervisor.length > 0) {
      return section_supervisor.map((supervisor) => {
        return Builder<SectionSupervisorEntity>(SectionSupervisorEntity, {
          ...supervisor,
        }).build();
      });
    }
    return [];
  };

  async toDomain(type: TrackModel): Promise<TrackEntity> {
    const { proposal, track_section, ...rest } = type;

    let buildedTrack = Builder<TrackEntity>(TrackEntity, {
      ...rest,
    }).build();

    if (proposal) {
      const res = this.mapProposal(proposal);
      // buildedTrack.proposals(res.proposals);
      buildedTrack.total_spending_budget = res.sum_spending_budget;
      buildedTrack.total_reserved_budget = res.sum_reserved_budget;
      buildedTrack.total_spending_budget_by_ceo =
        res.sum_spending_budget_by_ceo;
    }

    if (track_section) {
      const tSections: TrackSectionEntity[] = [];

      let budget = 0;
      if (track_section.length > 0) {
        // console.log('first child of the track', logUtil(track_section));
        for (const s of track_section) {
          if (s.is_deleted === false) {
            budget += s.budget;

            const {
              proposal,
              child_track_section,
              section_supervisor,
              ...rest
            } = s;
            const section: TrackSectionEntity = Builder<TrackSectionEntity>(
              TrackSectionEntity,
              {
                ...rest,
                section_supervisor: this.mapSupervisor(section_supervisor),
              },
            ).build();

            if (s.proposal) {
              const res = this.mapProposal(s.proposal);
              section.section_reserved_budget = res.sum_reserved_budget;
              section.section_spending_budget = res.sum_spending_budget;
              section.section_spending_budget_by_ceo =
                res.sum_spending_budget_by_ceo;
            }

            section.child_track_section = [];

            // if the track section has child track section
            if (s.child_track_section && s.child_track_section.length > 0) {
              for (const sChild of s.child_track_section) {
                if (sChild.is_deleted === false) {
                  const {
                    proposal,
                    child_track_section,
                    section_supervisor,
                    ...rest
                  } = sChild;

                  const sSection: TrackSectionEntity =
                    Builder<TrackSectionEntity>(TrackSectionEntity, {
                      ...rest,
                      section_supervisor:
                        this.mapSupervisor(section_supervisor),
                    }).build();

                  if (sChild.proposal) {
                    const res = this.mapProposal(sChild.proposal);
                    // sSesction.proposal = res.proposals;
                    sSection.section_reserved_budget = res.sum_reserved_budget;
                    sSection.section_spending_budget = res.sum_spending_budget;
                    sSection.section_spending_budget_by_ceo =
                      res.sum_spending_budget_by_ceo;

                    // sum the parent too
                    section.section_reserved_budget += res.sum_reserved_budget;
                    section.section_spending_budget += res.sum_spending_budget;
                    section.section_spending_budget_by_ceo +=
                      res.sum_spending_budget_by_ceo;
                  }

                  sSection.child_track_section = [];

                  // if first child has child then loop second child
                  if (
                    sChild.child_track_section &&
                    sChild.child_track_section.length > 0
                  ) {
                    for (const ssChild of sChild.child_track_section) {
                      if (ssChild.is_deleted === false) {
                        const {
                          proposal,
                          child_track_section,
                          section_supervisor,
                          ...rest
                        } = ssChild;

                        const ssSection: TrackSectionEntity =
                          Builder<TrackSectionEntity>(TrackSectionEntity, {
                            ...rest,
                            section_supervisor:
                              this.mapSupervisor(section_supervisor),
                          }).build();

                        if (ssChild.proposal) {
                          const res = this.mapProposal(ssChild.proposal);
                          // ssSection.proposal = res.proposals;
                          ssSection.section_reserved_budget =
                            res.sum_reserved_budget;
                          ssSection.section_spending_budget =
                            res.sum_spending_budget;
                          ssSection.section_spending_budget_by_ceo =
                            res.sum_spending_budget_by_ceo;

                          // sum the parrent too
                          sSection.section_reserved_budget +=
                            res.sum_reserved_budget;
                          section.section_reserved_budget +=
                            res.sum_reserved_budget;

                          // sum the parrent too
                          sSection.section_spending_budget +=
                            res.sum_spending_budget;
                          section.section_spending_budget +=
                            res.sum_spending_budget;

                          // sum the parent too
                          sSection.section_spending_budget_by_ceo +=
                            res.sum_spending_budget_by_ceo;
                          section.section_spending_budget_by_ceo +=
                            res.sum_spending_budget_by_ceo;
                        }

                        // if second child has child then loop third child
                        ssSection.child_track_section = [];

                        if (
                          ssChild.child_track_section &&
                          ssChild.child_track_section.length > 0
                        ) {
                          for (const sssChild of ssChild.child_track_section) {
                            if (sssChild.is_deleted === false) {
                              const {
                                proposal,
                                child_track_section,
                                section_supervisor,
                                ...rest
                              } = sssChild;

                              const sssSection: TrackSectionEntity =
                                Builder<TrackSectionEntity>(
                                  TrackSectionEntity,
                                  {
                                    ...rest,
                                    section_supervisor:
                                      this.mapSupervisor(section_supervisor),
                                  },
                                ).build();

                              if (sssChild.proposal) {
                                const res = this.mapProposal(sssChild.proposal);
                                // sssSesction.proposal = res.proposals;
                                sssSection.section_reserved_budget =
                                  res.sum_reserved_budget;
                                sssSection.section_spending_budget =
                                  res.sum_spending_budget;
                                sssSection.section_spending_budget_by_ceo =
                                  res.sum_spending_budget_by_ceo;

                                // sum the parrent too
                                ssSection.section_reserved_budget +=
                                  res.sum_reserved_budget;
                                sSection.section_reserved_budget +=
                                  res.sum_reserved_budget;
                                section.section_reserved_budget +=
                                  res.sum_reserved_budget;

                                // sum the parrent too
                                ssSection.section_spending_budget +=
                                  res.sum_spending_budget;
                                sSection.section_spending_budget +=
                                  res.sum_spending_budget;
                                section.section_spending_budget +=
                                  res.sum_spending_budget;

                                // sum the parent too
                                ssSection.section_spending_budget_by_ceo +=
                                  res.sum_spending_budget_by_ceo;
                                sSection.section_spending_budget_by_ceo +=
                                  res.sum_spending_budget_by_ceo;
                                section.section_spending_budget_by_ceo +=
                                  res.sum_spending_budget_by_ceo;
                              }

                              ssSection.child_track_section.push(sssSection);
                            }
                          }
                        }

                        sSection.child_track_section.push(ssSection);
                      }
                    }
                  }

                  section.child_track_section.push(sSection);
                }
              }
            }

            tSections.push(section);

            // tSections.push(
            //   Builder<TrackSectionEntity>(TrackSectionEntity, {
            //     ...s,
            //     child_track_section: s.child_track_section
            //       .filter((v) => !v.is_deleted)
            //       .map((c) => {
            //         return Builder<TrackSectionEntity>(TrackSectionEntity, {
            //           ...c,
            //           child_track_section: c.child_track_section
            //             .filter((vv) => !vv.is_deleted)
            //             .map((cc) => {
            //               return Builder<TrackSectionEntity>(
            //                 TrackSectionEntity,
            //                 {
            //                   ...cc,
            //                   child_track_section: cc.child_track_section
            //                     .filter((vvv) => !vvv.is_deleted)
            //                     .map((ccc) => {
            //                       return Builder<TrackSectionEntity>(
            //                         TrackSectionEntity,
            //                         {
            //                           ...ccc,
            //                           child_track_section:
            //                             ccc.child_track_section
            //                               .filter((vvvv) => !vvvv.is_deleted)
            //                               .map((cccc) => {
            //                                 return Builder<TrackSectionEntity>(
            //                                   TrackSectionEntity,
            //                                   {
            //                                     ...cccc,
            //                                   },
            //                                 ).build();
            //                               }),
            //                         },
            //                       ).build();
            //                     }),
            //                 },
            //               ).build();
            //             }),
            //         }).build();
            //       }),
            //   }).build(),
            // );
          }
        }
      }

      buildedTrack.sections = tSections;
      buildedTrack.total_budget = budget;
    }

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
