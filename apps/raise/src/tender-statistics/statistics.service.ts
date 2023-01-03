import { Injectable, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';
import _ from 'lodash';

@Injectable()
export class TenderStatisticsService {
  constructor(private readonly prismaService: PrismaService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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
}
