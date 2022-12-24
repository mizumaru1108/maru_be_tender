import { Injectable, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';
import _ from 'lodash'

@Injectable()
export class TenderStatisticsService {
  constructor(private readonly prismaService: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  async getAllStatistics() {
    const tarcksStatistics = await this.getAllTrackStatistics();
    return tarcksStatistics
  }

  async getAllTrackStatistics(){
    const response = {} as any;
    const governorates = await this.prismaService.proposal.findMany({
      select: {
        governorate: true,
        outter_status: true
      }
    })
    const governorateObj = {} as any;
    const nestedGovernorateObj = {} as any;
    governorates.map(governorate=>{  
      if(!governorate.governorate || !governorate.outter_status) return;
      if(!governorateObj[governorate.governorate]){
        nestedGovernorateObj[governorate.outter_status] = 1
        governorateObj[governorate.governorate] = Object.assign({}, nestedGovernorateObj);
        delete nestedGovernorateObj[governorate.outter_status]
      }else{
        if(!governorateObj[governorate.governorate][governorate.outter_status]){
          nestedGovernorateObj[governorate.outter_status] = 1
          governorateObj[governorate.governorate] = Object.assign(governorateObj[governorate.governorate], nestedGovernorateObj);;
          delete nestedGovernorateObj[governorate.outter_status]
      }
        else {
          governorateObj[governorate.governorate][governorate.outter_status] = governorateObj[governorate.governorate][governorate.outter_status] +1
        }
      }
    })
    response.governorates = governorateObj
    const regions = await this.prismaService.proposal.findMany({
      select: {
        region: true,
        outter_status: true
      }
    })
    const regionObj = {} as any;
    const nestedRegionObj = {} as any;
    regions.map(region=>{  
      if(!region.region || !region.outter_status) return;
      if(!regionObj[region.region]){
        nestedRegionObj[region.outter_status] = 1
        regionObj[region.region] = Object.assign({}, nestedRegionObj);
        delete nestedRegionObj[region.outter_status]
      }else{
        if(!regionObj[region.region][region.outter_status]){
          nestedRegionObj[region.outter_status] = 1
          regionObj[region.region] = Object.assign(regionObj[region.region], nestedRegionObj);;
          delete nestedRegionObj[region.outter_status]
      }
        else {
          regionObj[region.region][region.outter_status] = regionObj[region.region][region.outter_status] +1
        }
      }
    })
    response.regions = regionObj
    const authorities = await this.prismaService.client_data.groupBy({
      by: ['authority', 'user_id'],
      
    })
    const obj = {} as any
    const authoritiesObj = {} as any;
    authorities.map(auth=>{
      if(!auth.authority) return
      if(!obj[auth.authority]) obj[auth.authority] = [auth.user_id]
      else obj[auth.authority].push(auth.user_id)
    })
    for (const [authority, userIds] of Object.entries(obj)) {
      const authorityOngoingProposals = await this.prismaService.proposal.count({
        where: {    
          submitter_user_id: {in: userIds as any},
          outter_status: 'ONGOING'
        }
      });
      authoritiesObj[authority] = Object.assign({}, {ONGOING: authorityOngoingProposals })
      // response[`ONGOING${authority}`] = authorityOngoingProposals;
      const authorityCancledProposals = await this.prismaService.proposal.count({
        where: {    
          submitter_user_id: {in: userIds as any},
          outter_status: 'CANCELED'
        }
      })
       Object.assign(authoritiesObj[authority], {CANCELED: authorityCancledProposals })
      // response[`CANCELED${authority}`] = authorityCancledProposals;
      const authorityPendingProposals = await this.prismaService.proposal.count({
        where: {    
          submitter_user_id: {in: userIds as any},
          outter_status: 'PENDING'
        }
      })
      Object.assign(authoritiesObj[authority], {PENDING: authorityPendingProposals })
      // response[`Pending${authority}`] = authorityPendingProposals;
      const authorityRejectedProposals = await this.prismaService.proposal.count({
        where: {    
          submitter_user_id: {in: userIds as any},
          outter_status: 'REJECTED'
        }
      })
      Object.assign(authoritiesObj[authority], {REJECTED: authorityRejectedProposals })
      // response[`REJECTED${authority}`] = authorityRejectedProposals;
    }
    response.authorities = authoritiesObj

    const tracksObj = { } as any
    const tracks = await this.prismaService.track.findMany();
    for(const track of tracks){
    const ongoingProposals = await this.prismaService.proposal.count({
        where: {    
          track_id: track.id,
          outter_status: 'ONGOING'
        }
      })
      tracksObj[track.name] = Object.assign({}, {ONGOING: ongoingProposals })
      const cancledProposals = await this.prismaService.proposal.count({
        where: {    
          track_id: track.id,
          outter_status: 'CANCELED'
        }
      })
      Object.assign(tracksObj[track.name], {CANCELED: cancledProposals })
      const pendingProposals = await this.prismaService.proposal.count({
        where: {    
          track_id: track.id,
          outter_status: 'PENDING'
        }
      })
      Object.assign(tracksObj[track.name], {PENDING: pendingProposals })
      const rejectedProposals = await this.prismaService.proposal.count({
        where: {    
          track_id: track.id,
          outter_status: 'REJECTED'
        }
      })
      Object.assign(tracksObj[track.name], {REJECTED: rejectedProposals })
    }
    response.tracks= tracksObj
     return response
  }

}
