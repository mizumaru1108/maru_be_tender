import { Controller, Body, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { rootLogger } from '../logger';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  private logger = rootLogger.child({ logger: ProjectsController.name });
  constructor(private projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Get All Projects viewed by manager' })
  @Get('manager/getListAll')
  async getAllProjects() {
    this.logger.debug(`Get all projects`);
    return await this.projectsService.getListAll();
  }


  @ApiOperation({ summary: 'Get All Projects viewed by operator' })
  @Get('manager/operator/:operatorId/getListAll')
  async getAllProjectsByOperatorId(@Param('operatorId') operatorId: string) {
    this.logger.debug(`Get all projects`);
    return await this.projectsService.getListAllByOperatorId(operatorId);
  }
}
