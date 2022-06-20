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
    // const data = await this.projectsModel.aggregate([
    //   {
    //     $lookup: {
    //       from: 'ticketLog',
    //       localField: 'ticketId',
    //       foreignField: 'ticketId',
    //       as: 'ticketLog'
    //     }
    //   },
    //   {
    //     $unwind: {
    //       path: '$ticketLog',
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: '$_id',
    //       title: { $first: '$title' },
    //       department: { $first: '$department' },
    //       updatedAt: { $first: '$ticketLog.updatedAt' },
    //       status: { $first: '$ticketLog.status' },
    //     },
    //   }
    // ]);
    const data = [
      {
        "id" : 1,
        "name" : "project 1",
        "updatedAt" : "2022-06-01 01:00:00",
        "campaignCount" : 5,
        "itemCount" : 2
      },
      {
        "id" : 2,
        "name" : "project 2",
        "updatedAt" : "2022-06-01 01:00:00",
        "campaignCount" : 5,
        "itemCount" : 4
      },
      {
        "id" : 3,
        "name" : "project 3",
        "updatedAt" : "2022-06-01 01:00:00",
        "campaignCount" : 5,
        "itemCount" : 6
      },
      {
        "id" : 4,
        "name" : "project 4",
        "updatedAt" : "2022-06-01 01:00:00",
        "campaignCount" : 5,
        "itemCount" : 8
      },
      {
        "id" : 5,
        "name" : "project 5",
        "updatedAt" : "2022-06-01 01:00:00",
        "campaignCount" : 5,
        "itemCount" : 10
      }
  ];
    return data;
  }
}
