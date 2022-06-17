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
    const data = await this.projectsModel.aggregate([
      {
        $lookup: {
          from: 'ticketLog',
          localField: 'ticketId',
          foreignField: 'ticketId',
          as: 'ticketLog'
        }
      },
      {
        $unwind: {
          path: '$ticketLog',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          department: { $first: '$department' },
          updatedAt: { $first: '$ticketLog.updatedAt' },
          status: { $first: '$ticketLog.status' },
        },
      }
    ]);

    return data;
  }
}
