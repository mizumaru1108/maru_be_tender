import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Projects, ProjectsDocument } from './projects.schema';
import { rootLogger } from '../logger';


@Injectable()
export class ProjectsService {
  private logger = rootLogger.child({ logger: ProjectsService.name });

  constructor(
    @InjectModel(Projects.name)
    private projectsModel: Model<ProjectsDocument>,
  ) {}

  async getListAll(){
    this.logger.debug('Get project list ...');
    const dataCampaign = await this.projectsModel.aggregate([
      {$lookup: {from: 'campaign',localField: '_id',foreignField: 'projectId', as: 'cp'}},
      {$unwind: {path: '$cp',preserveNullAndEmptyArrays: true}},
      {$lookup: {from: 'item',localField: 'projectId',foreignField: '_id',as: 'item'}},
      {$unwind: {path: '$item',preserveNullAndEmptyArrays: true}},
      {$group: {_id:"$_id",projectName:{$first:'$name'},createdAt:{$first: '$createdAt' },count:{$sum:1}}},
      {$project: {_id: 1, projectName: 1,createdAt: 1,campaignCount: "$count"}},
      {$sort: {_id: 1}}
    ]);

    const dataItem = await this.projectsModel.aggregate([
      {$lookup: {from: 'item',localField: '_id',foreignField: 'projectId', as: 'cp'}},
      {$unwind: {path: '$cp',preserveNullAndEmptyArrays: true}},
      {$lookup: {from: 'item',localField: 'projectId',foreignField: '_id',as: 'item'}},
      {$unwind: {path: '$item',preserveNullAndEmptyArrays: true}},
      {$group: {_id:"$_id",projectName:{$first:'$name'},createdAt:{$first: '$createdAt' },count:{$sum:1}}},
      {$project: {_id: 1,itemCount: "$count"}},
      {$sort: {_id: 1}}
    ]);

    const data = dataCampaign.map((item, i) => Object.assign({}, item, dataItem[i]));
    return data;
  }

  
  async getListAllByOperatorId(operatorId: string){
    const ObjectId = require('mongoose').Types.ObjectId;

    this.logger.debug('Get project list ...');
    const dataCampaign = await this.projectsModel.aggregate([
      {$lookup: {from: 'campaign',localField: '_id',foreignField: 'projectId', as: 'cp'}},
      {$unwind: {path: '$cp',preserveNullAndEmptyArrays: true}},
      {$lookup: {from: 'item',localField: 'projectId',foreignField: '_id',as: 'item'}},
      {$unwind: {path: '$item',preserveNullAndEmptyArrays: true}},
       {$lookup: {from: 'projectOperatorMap',localField: '_id',foreignField: 'projectId',as: 'pom'}},
      {$unwind: {path: '$pom',preserveNullAndEmptyArrays: true}},
      {$group: {_id:"$_id",projectName:{$first:'$name'},createdAt:{$first: '$createdAt' },operatorId:{$first: '$pom.operatorId'},count:{$sum:1}}},
      {$project: {_id: 1, projectName: 1,createdAt: 1,operatorId:1,campaignCount: "$count"}},
      {$match: {operatorId: ObjectId(operatorId)}},
      {$sort: {_id: 1}}
    ]);

    const dataItem = await this.projectsModel.aggregate([
      {$lookup: {from: 'item',localField: '_id',foreignField: 'projectId', as: 'cp'}},
      {$unwind: {path: '$cp',preserveNullAndEmptyArrays: true}},
      {$lookup: {from: 'item',localField: 'projectId',foreignField: '_id',as: 'item'}},
      {$unwind: {path: '$item',preserveNullAndEmptyArrays: true}},
       {$lookup: {from: 'projectOperatorMap',localField: '_id',foreignField: 'projectId',as: 'pom'}},
      {$unwind: {path: '$pom',preserveNullAndEmptyArrays: true}},
      {$group: {_id:"$_id",projectName:{$first:'$name'},createdAt:{$first: '$createdAt' },operatorId:{$first: '$pom.operatorId'},count:{$sum:1}}},
      {$project: {_id: 1,operatorId:1,itemCount: "$count"}},
      {$match: {operatorId: ObjectId(operatorId)}},
      {$sort: {_id: 1}}
    ]);

    const data = dataCampaign.map((item, i) => Object.assign({}, item, dataItem[i]));
    return data;
  }
}
