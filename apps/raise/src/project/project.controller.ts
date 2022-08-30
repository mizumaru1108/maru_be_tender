import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClusterRoles } from '../auth/cluster-roles.decorator';
import { ClusterRolesGuard } from '../auth/cluster-roles.guard';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../commons/decorators/current-user.decorator';
import { BaseResponse } from '../commons/dtos/base-response';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';
import { rootLogger } from '../logger';
import { RoleEnum } from '../user/enums/role-enum';
import { ICurrentUser } from '../user/interfaces/current-user.interface';
import { CreateProjectDto } from './dto';
import { ProjectFilterRequest } from './dto/project-filter.request';
import { ProjectSetDeletedFlagDto } from './dto/project-set-flag-deleted';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.schema';
import { ProjectService } from './project.service';

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

  @ApiOperation({ summary: 'Get All Projects viewed by donor' })
  @Get('donor/organization/:organizationId/getAllPublished')
  async getAllProjectsForDonors(
    @Param('organizationId') organizationId: string,
  ) {
    this.logger.debug(`Get all projects`);
    return await this.projectService.getAllProjectPublished(organizationId);
  }

  @ApiOperation({ summary: 'Get All Projects viewed by manager' })
  @UseGuards(JwtAuthGuard)
  @Get('manager/getProjectList')
  async getProjectList(@Query() projectFilter: ProjectFilterRequest) {
    this.logger.debug(`Get all projects`);
    return await this.projectService.getProjectList(projectFilter);
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
  // @ClusterRoles(RoleEnum.OPERATOR)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    this.logger.debug('create new project ', JSON.stringify(createProjectDto));
    return await this.projectService.create(createProjectDto, currentUser.id);
  }

  @ApiOperation({ summary: 'set flag to delete campaign' })
  @ApiResponse({
    status: 200,
  })
  @Post('setDeletedFlagBatch')
  async setDeletedFlag(
    @Body() request: ProjectSetDeletedFlagDto,
  ): Promise<BaseResponse<string>> {
    const affectedDeleteStatus = await this.projectService.setDeletedFlag(
      request.projectIds,
    );
    const response = baseResponseHelper(
      affectedDeleteStatus,
      HttpStatus.OK,
      'Projects has successfully changed to the deleted state',
    );
    return response;
  }

  @ApiOperation({ summary: 'update project' })
  @ClusterRoles(RoleEnum.SUPERADMIN)
  @UseGuards(JwtAuthGuard, ClusterRolesGuard)
  @Patch('update/:projectId')
  async updateProject(
    @Param('projectId') projectId: string,
    @Body() updateRequest: UpdateProjectDto,
  ): Promise<BaseResponse<Project>> {
    this.logger.debug('payload', JSON.stringify(updateRequest));
    this.logger.debug(`update project ${projectId}`);
    const updatedProject = await this.projectService.updateProject(
      projectId,
      updateRequest,
    );
    const response = baseResponseHelper(
      updatedProject,
      HttpStatus.OK,
      'Project updated successfully',
    );
    return response;
  }
}
