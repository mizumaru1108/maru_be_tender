import { Injectable } from '@nestjs/common';
import { Prisma, track, track_section } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { ProposalEntity } from '../../../proposal-management/proposal/entities/proposal.entity';
import { TrackSectionEntity } from '../../track-section/entities/track.section.entity';
import { TrackEntity } from '../entities/track.entity';

export type TrackModel = track & {
  proposal?: {
    id: string;
    project_name: string;
    track_id: string;
    fsupport_by_supervisor: Prisma.Decimal | null;
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

      let sum_total_budget = 0;
      if (proposal.length > 0) {
        for (const p of proposal) {
          let fSupport =
            p.fsupport_by_supervisor !== null
              ? parseFloat(p.fsupport_by_supervisor.toString())
              : 0;

          sum_total_budget += fSupport;

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
            }).build(),
          );
        }
      }

      trackBuilder.proposals(proposals);
      trackBuilder.total_budget_used(sum_total_budget);
    }

    if (track_section) {
      const tSections: TrackSectionEntity[] = [];

      let budget = 0;
      if (track_section.length > 0) {
        for (const s of track_section) {
          budget += s.budget;
          tSections.push(
            Builder<TrackSectionEntity>(TrackSectionEntity, {
              ...s,
              child_track_section: s.child_track_section.map((c) => {
                budget += c.budget;
                return Builder<TrackSectionEntity>(TrackSectionEntity, {
                  ...c,
                  child_track_section: c.child_track_section.map((cc) => {
                    return Builder<TrackSectionEntity>(TrackSectionEntity, {
                      ...cc,
                      child_track_section: cc.child_track_section.map((ccc) => {
                        return Builder<TrackSectionEntity>(TrackSectionEntity, {
                          ...ccc,
                          child_track_section: ccc.child_track_section.map(
                            (cccc) => {
                              return Builder<TrackSectionEntity>(
                                TrackSectionEntity,
                                {
                                  ...cccc,
                                },
                              ).build();
                            },
                          ),
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

      trackBuilder.sections(tSections);
      trackBuilder.budget(budget);
    }

    const buildedTrack = trackBuilder.build();

    if (buildedTrack.budget && buildedTrack.total_budget_used) {
      buildedTrack.remaining_budget =
        buildedTrack.budget - buildedTrack.total_budget_used;
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
