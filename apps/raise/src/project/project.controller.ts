import { Controller, Body, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { rootLogger } from '../logger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto';
import { ProjectSetDeletedFlagDto } from './dto/project-set-flag-deleted';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  private logger = rootLogger.child({ logger: ProjectController.name });
  constructor(private projectService: ProjectService) {}

  @ApiOperation({ summary: 'Get All Projects viewed by manager' })
  @Get('manager/getListAll')
  async getAllProjects() {
    this.logger.debug(`Get all projects`);
    return await this.projectService.getListAll();
  }

  @ApiOperation({ summary: 'Get All Projects viewed by operator' })
  @Get('manager/operator/:operatorId/getListAll')
  async getAllProjectsByOperatorId(@Param('operatorId') operatorId: string) {
    this.logger.debug(`Get all projects`);
    return await this.projectService.getListAllByOperatorId(operatorId);
  }

  @ApiOperation({ summary: 'Create project' })
  @ApiResponse({
    status: 201,
    description: 'The Project has been successfully created.',
  })
  @Post('create')
  async create(@Body() createProjectDto: CreateProjectDto) {
    this.logger.debug('create new project ', JSON.stringify(createProjectDto));
    return await this.projectService.create(createProjectDto);
  }

  @ApiOperation({ summary: 'set flag to delete campaign' })
  @ApiResponse({
    status: 201,
    description: 'The New Campaign has been successfully flagged as deleted.',
  })
  @Post('setDeletedFlagBatch')
  async setDeletedFlag(@Body() request: ProjectSetDeletedFlagDto) {
    await this.projectService.setDeletedFlag(request.projectIds);
  }
}
