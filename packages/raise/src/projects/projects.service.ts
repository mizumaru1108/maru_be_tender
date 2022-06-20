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
    this.logger.debug('Get ticket list ...');
    const dataCampaign = await this.projectsModel.aggregate([
      {$lookup: {from: 'campaign',localField: '_id',foreignField: 'projectId', as: 'cp'}},
      {$unwind: {path: '$cp',preserveNullAndEmptyArrays: true}},
      {$lookup: {from: 'item',localField: 'projectId',foreignField: '_id',as: 'item'}},
      {$unwind: {path: '$item',preserveNullAndEmptyArrays: true}},
      {$group: {_id:"$_id",projectName:{$first:'$name'},createdAt:{$first: '$createdAt' },count:{$sum:1}}},
      {$project: {_id: 1, projectName: 1,createdAt: 1,campaignCount: "$count"}},
      {$sort: {name: 1}}
    ]);

    const dataItem = await this.projectsModel.aggregate([
      {$lookup: {from: 'item',localField: '_id',foreignField: 'projectId', as: 'cp'}},
      {$unwind: {path: '$cp',preserveNullAndEmptyArrays: true}},
      {$lookup: {from: 'item',localField: 'projectId',foreignField: '_id',as: 'item'}},
      {$unwind: {path: '$item',preserveNullAndEmptyArrays: true}},
      {$group: {_id:"$_id",projectName:{$first:'$name'},createdAt:{$first: '$createdAt' },count:{$sum:1}}},
      {$project: {_id: 1,itemCount: "$count"}},
      {$sort: {name: 1}}
    ]);

    const data = dataCampaign.map((item, i) => Object.assign({}, item, dataItem[i]));
    console.log(data);
    return data;
  }
}
