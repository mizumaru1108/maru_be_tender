import { Controller, Body, Get, Param, Post, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { rootLogger } from '../logger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto';
import { ProjectSetDeletedFlagDto } from './dto/project-set-flag-deleted';
import { UpdateProjectDto } from './dto/update-project.dto';

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
    status: 200,
  })
  @Post('setDeletedFlagBatch')
  async setDeletedFlag(@Body() request: ProjectSetDeletedFlagDto) {
    return await this.projectService.setDeletedFlag(request.projectIds);
  }

  @ApiOperation({ summary: 'update project' })
  @Patch('update/:projectId')
  async updateProject(
    @Param('projectId') projectId: string,
    @Body() updateRequest: UpdateProjectDto,
  ) {
    console.log('a');
    this.logger.debug('payload', JSON.stringify(updateRequest));
    this.logger.debug(`update project ${projectId}`);
    return await this.projectService.updateProject(projectId, updateRequest);
  }
}
