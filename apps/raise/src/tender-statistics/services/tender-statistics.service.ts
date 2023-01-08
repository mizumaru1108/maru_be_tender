import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseStatisticFilter } from '../dtos/requests/base-statistic-filter.dto';
import { GetBudgetInfoDto } from '../dtos/requests/get-budget-info.dto';
import {
  GetBeneficiariesReportDto,
  IGetBeneficiariesByTrackDto,
  IGetBeneficiariesByTypeDto,
} from '../dtos/responses/get-beneficiaries-report.dto';
import { GetPartnersStatisticResponseDto } from '../dtos/responses/get-partner-statistic.dto';
import { TenderStatisticsRepository } from '../repositories/tender-statistic.repository';

@Injectable()
export class TenderStatisticsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tenderStatisticRepository: TenderStatisticsRepository,
  ) {}

  async getAllStatistics(from: any, to: any) {
    const tarcksStatistics = await this.getAllTrackStatistics(from, to);
    return tarcksStatistics;
  }

  async getAllTrackStatistics(from: any, to: any) {
    const response = {} as any;
    const governorates = await this.prismaService.proposal.findMany({
      where: {
        AND: [
          {
            created_at: {
              gte: from,
            },
          },
          {
            created_at: {
              lte: to,
            },
          },
        ],
      },
      select: {
        governorate: true,
        outter_status: true,
        project_track: true,
      },
    });
    const governorateObj = {} as any;
    const nestedGovernorateObj = {} as any;
    const trackGovernorateObj = {} as any;
    governorates.map((governorate) => {
      if (
        !governorate.governorate ||
        !governorate.outter_status ||
        !governorate.project_track
      )
        return;
      if (!governorateObj[governorate.governorate]) {
        nestedGovernorateObj[governorate.outter_status] = 1;
        trackGovernorateObj[governorate.project_track] = Object.assign(
          {},
          nestedGovernorateObj,
        );
        governorateObj[governorate.governorate] = Object.assign(
          {},
          trackGovernorateObj,
        );
        delete nestedGovernorateObj[governorate.outter_status];
        delete trackGovernorateObj[governorate.project_track];
      } else {
        if (
          !governorateObj[governorate.governorate][governorate.project_track]
        ) {
          nestedGovernorateObj[governorate.outter_status] = 1;
          trackGovernorateObj[governorate.project_track] = Object.assign(
            {},
            nestedGovernorateObj,
          );
          governorateObj[governorate.governorate] = Object.assign(
            governorateObj[governorate.governorate],
            trackGovernorateObj,
          );
          delete nestedGovernorateObj[governorate.outter_status];
          delete trackGovernorateObj[governorate.project_track];
        } else {
          if (
            !governorateObj[governorate.governorate][governorate.project_track][
              governorate.outter_status
            ]
          ) {
            nestedGovernorateObj[governorate.outter_status] = 1;
            governorateObj[governorate.governorate][governorate.project_track] =
              Object.assign(
                governorateObj[governorate.governorate][
                  governorate.project_track
                ],
                nestedGovernorateObj,
              );
            delete nestedGovernorateObj[governorate.outter_status];
          } else {
            governorateObj[governorate.governorate][governorate.project_track][
              governorate.outter_status
            ] =
              governorateObj[governorate.governorate][
                governorate.project_track
              ][governorate.outter_status] + 1;
          }
        }
      }
    });
    response.governorates = governorateObj;
    const regions = await this.prismaService.proposal.findMany({
      where: {
        AND: [
          {
            created_at: {
              gte: from,
            },
          },
          {
            created_at: {
              lte: to,
            },
          },
        ],
      },
      select: {
        region: true,
        outter_status: true,
        project_track: true,
      },
    });
    const regionObj = {} as any;
    const nestedRegionObj = {} as any;
    const trackRegionObj = {} as any;
    regions.map((region) => {
      if (!region.region || !region.outter_status || !region.project_track)
        return;
      if (!regionObj[region.region]) {
        nestedRegionObj[region.outter_status] = 1;
        trackRegionObj[region.project_track] = Object.assign(
          {},
          nestedRegionObj,
        );
        regionObj[region.region] = Object.assign({}, trackRegionObj);
        delete nestedRegionObj[region.outter_status];
        delete trackRegionObj[region.project_track];
      } else {
        if (!regionObj[region.region][region.project_track]) {
          nestedRegionObj[region.outter_status] = 1;
          trackRegionObj[region.project_track] = Object.assign(
            {},
            nestedRegionObj,
          );
          regionObj[region.region] = Object.assign(
            regionObj[region.region],
            trackRegionObj,
          );
          delete nestedRegionObj[region.outter_status];
          delete trackRegionObj[region.project_track];
        } else {
          if (
            !regionObj[region.region][region.project_track][
              region.outter_status
            ]
          ) {
            nestedRegionObj[region.outter_status] = 1;
            regionObj[region.region][region.project_track] = Object.assign(
              regionObj[region.region][region.project_track],
              nestedRegionObj,
            );
            delete nestedRegionObj[region.outter_status];
          } else {
            regionObj[region.region][region.project_track][
              region.outter_status
            ] =
              regionObj[region.region][region.project_track][
                region.outter_status
              ] + 1;
          }
        }
      }
    });
    response.regions = regionObj;
    const authorities = await this.prismaService.client_data.groupBy({
      where: {
        AND: [
          {
            created_at: {
              gte: from,
            },
          },
          {
            created_at: {
              lte: to,
            },
          },
        ],
      },
      by: ['authority', 'user_id'],
    });
    const obj = {} as any;
    authorities.map((auth) => {
      if (!auth.authority) return;
      if (!obj[auth.authority]) obj[auth.authority] = [auth.user_id];
      else obj[auth.authority].push(auth.user_id);
    });
    const authorityObj = {} as any;
    const nestedAuthorityObj = {} as any;
    for (const [authority, userIds] of Object.entries(obj)) {
      const authorities = await this.prismaService.proposal.findMany({
        where: {
          AND: [
            {
              created_at: {
                gte: from,
              },
            },
            {
              created_at: {
                lte: to,
              },
            },
            {
              submitter_user_id: { in: userIds as any },
            },
          ],
        },
        select: {
          outter_status: true,
          project_track: true,
        },
      });
      authorities.map((authority) => {
        if (!authority.outter_status || !authority.project_track) return;
        if (!authorityObj[authority.project_track]) {
          nestedAuthorityObj[authority.outter_status] = 1;
          authorityObj[authority.project_track] = Object.assign(
            {},
            nestedAuthorityObj,
          );
          delete nestedAuthorityObj[authority.outter_status];
        } else {
          if (!authorityObj[authority.project_track][authority.outter_status]) {
            nestedAuthorityObj[authority.outter_status] = 1;
            authorityObj[authority.project_track] = Object.assign(
              authorityObj[authority.project_track],
              nestedAuthorityObj,
            );
            delete nestedAuthorityObj[authority.outter_status];
          } else {
            authorityObj[authority.project_track][authority.outter_status] =
              authorityObj[authority.project_track][authority.outter_status] +
              1;
          }
        }
      });
    }
    response.authorities = authorityObj;

    const tracksObj = {} as any;
    const tracks = await this.prismaService.proposal.findMany({
      where: {
        AND: [
          {
            created_at: {
              gte: from,
            },
          },
          {
            created_at: {
              lte: to,
            },
          },
        ],
      },
      select: {
        outter_status: true,
        project_track: true,
      },
    });
    const nestedTrackObj = {} as any;
    tracks.map((track) => {
      if (!track.project_track || !track.outter_status) return;
      if (!tracksObj[track.project_track]) {
        nestedTrackObj[track.outter_status] = 1;
        tracksObj[track.project_track] = Object.assign({}, nestedTrackObj);
        delete nestedTrackObj[track.outter_status];
      } else {
        if (!tracksObj[track.project_track][track.outter_status]) {
          nestedTrackObj[track.outter_status] = 1;
          tracksObj[track.project_track] = Object.assign(
            tracksObj[track.project_track],
            nestedTrackObj,
          );
          delete nestedTrackObj[track.outter_status];
        } else {
          tracksObj[track.project_track][track.outter_status] =
            tracksObj[track.project_track][track.outter_status] + 1;
        }
      }
    });
    response.tracks = tracksObj;
    return response;
  }

  async getAllParntersStatistics(from: any, to: any) {
    const response = {} as any;
    const userStatus = await this.prismaService.user_status.findMany();
    const partnersStatus = {} as any;
    const partnersRegion = {} as any;
    const nestedPartnersRegion = {} as any;
    const partnersGovernorate = {} as any;
    const nestedPartnersGovernorate = {} as any;

    for (const US of userStatus) {
      const pendingUsers = await this.prismaService.client_data.findMany({
        where: {
          AND: [
            {
              created_at: {
                gte: from,
              },
            },
            {
              created_at: {
                lte: to,
              },
            },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              status_id: true,
            },
          },
        },
      });

      for (const PU of pendingUsers) {
        if (!partnersStatus[US.title]) partnersStatus[US.title] = 0;
        if (PU.user.status_id === US.id) {
          partnersStatus[US.title] = partnersStatus[US.title] + 1;
        }

        if (!PU.region) return;
        if (!partnersRegion[PU.region]) {
          nestedPartnersRegion[US.title] = 1;
          partnersRegion[PU.region] = Object.assign({}, nestedPartnersRegion);
          delete nestedPartnersRegion[US.title];
        } else {
          if (!partnersRegion[PU.region][US.title]) {
            nestedPartnersRegion[US.title] = 1;
            partnersRegion[PU.region] = Object.assign({}, nestedPartnersRegion);
            delete nestedPartnersRegion[US.title];
          } else {
            partnersRegion[PU.region][US.title] =
              partnersRegion[PU.region][US.title] + 1;
          }
        }

        if (!PU.governorate) return;
        if (!partnersGovernorate[PU.governorate]) {
          nestedPartnersGovernorate[US.title] = 1;
          partnersGovernorate[PU.governorate] = Object.assign(
            {},
            nestedPartnersGovernorate,
          );
          delete nestedPartnersGovernorate[US.title];
        } else {
          if (!partnersGovernorate[PU.governorate][US.title]) {
            nestedPartnersGovernorate[US.title] = 1;
            partnersGovernorate[PU.governorate] = Object.assign(
              {},
              nestedPartnersGovernorate,
            );
            delete nestedPartnersGovernorate[US.title];
          } else {
            partnersGovernorate[PU.governorate][US.title] =
              partnersGovernorate[PU.governorate][US.title] + 1;
          }
        }
      }
    }
    response.partnersStatus = partnersStatus;
    response.partnersRegion = partnersRegion;
    response.partnersGovernorate = partnersGovernorate;

    return response;
  }

  async getPartnersStatistic(
    filter: BaseStatisticFilter,
  ): Promise<GetPartnersStatisticResponseDto> {
    const partners = await this.tenderStatisticRepository.getRawPartnersData(
      filter,
    );

    const latestPartnerCreatedDate = partners[0].created_at!;

    const partnerStatus =
      await this.tenderStatisticRepository.getRawUserStatus();

    const byStatus = partnerStatus.map((status) => {
      return {
        label: status.id,
        data_count: partners.filter(
          (partner) => partner.status.id === status.id,
        ).length,
      };
    });

    const byRegion = Array.from(
      new Set(partners.map((partner) => partner.client_data?.region)),
    ).map((region) => {
      const data = partners.filter(
        (partner) => partner.client_data?.region === region,
      );
      return {
        label: region || 'Region Not Set',
        data_count: partnerStatus.map((status) => {
          return {
            label: status.id,
            data_count: data.filter(
              (partner) => partner.status.id === status.id,
            ).length,
          };
        }),
        total: data.length,
      };
    });

    const byGovernorate = Array.from(
      new Set(partners.map((partner) => partner.client_data?.governorate)),
    ).map((governorate) => {
      const data = partners.filter(
        (partner) => partner.client_data?.governorate === governorate,
      );
      return {
        label: governorate || 'Governorate Not Set',
        data_count: partnerStatus.map((status) => {
          return {
            label: status.id,
            data_count: data.filter(
              (partner) => partner.status.id === status.id,
            ).length,
          };
        }),
        total: data.length,
      };
    });

    const monthlyData = {
      this_month: partnerStatus.map((status) => {
        return {
          label: status.id,
          data_count: partners.filter(
            (partner) =>
              partner.status.id === status.id &&
              partner.created_at!.getMonth() ===
                latestPartnerCreatedDate.getMonth(),
          ).length,
        };
      }),
      last_month: partnerStatus.map((status) => {
        return {
          label: status.id,
          data_count: partners.filter(
            (partner) =>
              partner.status.id === status.id &&
              partner.created_at!.getMonth() ===
                latestPartnerCreatedDate.getMonth() - 1,
          ).length,
        };
      }),
    };

    return {
      by_status: byStatus,
      by_region: byRegion,
      by_governorate: byGovernorate,
      monthlyData: monthlyData,
    };
  }

  async getBeneficiariesReport(
    filter: BaseStatisticFilter,
  ): Promise<GetBeneficiariesReportDto> {
    // Get raw data from repository (filtering will be done in the repository)
    const proposals =
      await this.tenderStatisticRepository.getRawBeneficiariesData(filter);

    // Initialize empty objects for by_track and by_type data
    const byTrack: { [key: string]: IGetBeneficiariesByTrackDto } = {};
    const byType: { [key: string]: IGetBeneficiariesByTypeDto } = {};

    // Loop through raw data
    for (let i = 0; i < proposals.length; i++) {
      const proposal = proposals[i];
      // If project_track and num_ofproject_binicficiaries are not null, add data to byTrack object
      if (
        proposal.project_track != null &&
        proposal.num_ofproject_binicficiaries != null
      ) {
        // Check if project_track exists in byTrack object
        if (!byTrack[proposal.project_track]) {
          // If project_track does not exist in byTrack object, initialize it with track and total_project_beneficiaries values
          byTrack[proposal.project_track] = {
            track: proposal.project_track,
            total_project_beneficiaries: 0, // if project_track does not exist, initialize total_project_beneficiaries with 0
          };
        }
        // Add num_ofproject_binicficiaries value to total_project_beneficiaries for the current project_track
        byTrack[proposal.project_track].total_project_beneficiaries +=
          proposal.num_ofproject_binicficiaries;
      }

      // basicly same logic as above
      if (
        proposal.project_beneficiaries != null &&
        proposal.num_ofproject_binicficiaries != null
      ) {
        if (!byType[proposal.project_beneficiaries]) {
          byType[proposal.project_beneficiaries] = {
            type: proposal.project_beneficiaries,
            total_project_beneficiaries: 0,
          };
        }
        byType[proposal.project_beneficiaries].total_project_beneficiaries +=
          proposal.num_ofproject_binicficiaries;
      }
    }

    // Return response with byTrack and byType data
    return {
      by_track: Object.values(byTrack),
      by_type: Object.values(byType),
    };
  }

  async getBudgetInfo(request: GetBudgetInfoDto) {
    const proposals = await this.tenderStatisticRepository.getBudgetInfo(
      request,
    );

    type GroupedProposal = {
      project_track: string | null;
      total_budget: number;
      spended_budget: number;
      spended_budget_last_week: number;
      reserved_budget: number;
      reserved_budget_last_week: number;
    };

    const groupedData: GroupedProposal[] = proposals.reduce(
      (previousData, proposal) => {
        const existingGroup = previousData.find(
          (group) => group.project_track === proposal.project_track,
        );
        if (existingGroup) {
          existingGroup.total_budget += Number(
            proposal.amount_required_fsupport,
          );
          existingGroup.spended_budget += proposal.proposal_item_budget.reduce(
            (sum, item) => sum + Number(item.amount),
            0,
          );
          // get last week spended budget if proposal.proposal_item_budget.created_at is in last week
          // then add it to existingGroup.spended_budget_last_week if not then add 0
          existingGroup.spended_budget_last_week +=
            proposal.proposal_item_budget.reduce((sum, item) => {
              // get the last week from the request.end_date if exist,
              // if not get from request.start,
              // if both not exist, get from date now
              let lastWeek: Date;
              if (request.end_date && request.start_date) {
                lastWeek = new Date(request.end_date);
              } else if (request.start_date && !request.end_date) {
                lastWeek = new Date(request.start_date);
              } else {
                lastWeek = new Date();
              }
              lastWeek.setDate(lastWeek.getDate() - 7);
              const date = new Date(item.created_at!);
              if (date > lastWeek) {
                return sum + Number(item.amount);
              }
              return sum;
            }, 0) || 0;
          existingGroup.reserved_budget =
            existingGroup.total_budget - existingGroup.spended_budget;
          existingGroup.reserved_budget_last_week =
            existingGroup.total_budget - existingGroup.spended_budget_last_week;
          return previousData;
        } else {
          previousData.push({
            project_track: proposal.project_track,
            total_budget: Number(proposal.amount_required_fsupport),
            spended_budget: proposal.proposal_item_budget.reduce(
              (sum, item) => sum + Number(item.amount),
              0,
            ),
            spended_budget_last_week: proposal.proposal_item_budget.reduce(
              (sum, item) => {
                //   const date = new Date(item.created_at!);
                //   const lastWeek = new Date();
                //   lastWeek.setDate(lastWeek.getDate() - 7);
                //   if (date > lastWeek) {
                //     return sum + Number(item.amount);
                //   }
                //   return sum;
                // },
                // 0,

                // get the last week from the request.end_date if exist,
                // if not get from request.start,
                // if both not exist, get from date now
                let lastWeek: Date;
                if (request.end_date && request.start_date) {
                  lastWeek = new Date(request.end_date);
                } else if (request.start_date && !request.end_date) {
                  lastWeek = new Date(request.start_date);
                } else {
                  lastWeek = new Date();
                }
                lastWeek.setDate(lastWeek.getDate() - 7);
                const date = new Date(item.created_at!);
                if (date > lastWeek) {
                  return sum + Number(item.amount);
                }
                return sum;
              },
              0,
            ),
            reserved_budget:
              0 -
              proposal.proposal_item_budget.reduce(
                (sum, item) => sum + Number(item.amount),
                0,
              ),
            reserved_budget_last_week:
              0 -
              proposal.proposal_item_budget.reduce((sum, item) => {
                // const date = new Date(item.created_at!);
                // const lastWeek = new Date();
                // lastWeek.setDate(lastWeek.getDate() - 7);
                // if (date > lastWeek) {
                //   return sum + Number(item.amount);
                // }
                // return sum;

                // get the last week from the request.end_date if exist,
                // if not get from request.start,
                // if both not exist, get from date now
                let lastWeek: Date;
                if (request.end_date && request.start_date) {
                  lastWeek = new Date(request.end_date);
                } else if (request.start_date && !request.end_date) {
                  lastWeek = new Date(request.start_date);
                } else {
                  lastWeek = new Date();
                }
                lastWeek.setDate(lastWeek.getDate() - 7);
                const date = new Date(item.created_at!);
                if (date > lastWeek) {
                  return sum + Number(item.amount);
                }
                return sum;
              }, 0),
          });
        }
        return previousData;
      },
      [] as GroupedProposal[],
    );

    return groupedData;
  }
}
