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
  @Get('getListAll')
  async getAllTickets() {
    this.logger.debug(`Get all projects`);
    return await this.projectsService.getListAll();
  }
}
