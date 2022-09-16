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
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { CurrentUser } from '../commons/decorators/current-user.decorator';
import { BaseResponse } from '../commons/dtos/base-response';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';
import { Permission } from '../libs/authzed/enums/permission.enum';
import { rootLogger } from '../logger';
import { ICurrentUser } from '../user/interfaces/current-user.interface';
import { CreateProjectDto } from './dto';
import { ProjectCreateDto } from './dto/project-create.dto';
import { ProjectFilterRequest } from './dto/project-filter.request';
import { ProjectSetDeletedFlagDto } from './dto/project-set-flag-deleted';
import { ProjectStatusUpdateDto } from './dto/project-status-update.dto';
import { ProjectUpdateDto } from './dto/project-update.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';
import { Project } from './schema/project.schema';

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

  @ApiOperation({ summary: 'Get a project detail by projectId' })
  @ApiResponse({
    status: 200,
    description: 'Project `projectId` details retrieved successfully!',
  })
  @Get('detail/:projectId')
  async getProjectDetailById(
    @Param('projectId') projectId: string,
  ): Promise<BaseResponse<Project>> {
    this.logger.debug(`getting details of project ${projectId}`);
    const projectDetails = await this.projectService.getProjectDetailById(
      projectId,
    );
    return baseResponseHelper(
      projectDetails,
      HttpStatus.OK,
      `Project ${projectId} details retrieved successfully!`,
    );
  }

  @ApiOperation({ summary: 'Create project' })
  @ApiResponse({
    status: 201,
    description: 'The Project has been successfully created.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    this.logger.debug('create new project ', JSON.stringify(createProjectDto));
    return await this.projectService.create(createProjectDto, currentUser.id);
  }

  @ApiOperation({ summary: 'Create Project' })
  @ApiResponse({
    status: 201,
    description: 'The Project has been successfully created!',
  })
  @Permissions(Permission.OE) // only admin and operator
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('createProject')
  async createProject(
    @CurrentUser() user: ICurrentUser,
    @Body() request: ProjectCreateDto,
  ): Promise<BaseResponse<Project>> {
    this.logger.debug('create new campaign ', JSON.stringify(request));
    const response = await this.projectService.projectCreate(user.id, request);
    return baseResponseHelper(
      response,
      HttpStatus.CREATED,
      'The Campaign has been successfully created.',
    );
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

  @ApiOperation({ summary: 'Approve project' })
  @Permissions(Permission.MO)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch('approve')
  async approveProject(
    @CurrentUser() user: ICurrentUser,
    @Body() request: ProjectStatusUpdateDto,
  ): Promise<BaseResponse<Project>> {
    this.logger.debug(`${user.id} try approve project ${request.projectId}`);
    const updatedProject = await this.projectService.projectStatusUpdate(
      user.id,
      request,
    );
    const response = baseResponseHelper(
      updatedProject,
      HttpStatus.OK,
      'Project updated successfully',
    );
    return response;
  }

  @ApiOperation({ summary: 'Approve project' })
  @Permissions(Permission.MO)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch('reject')
  async rejectProject(
    @CurrentUser() user: ICurrentUser,
    @Body() request: ProjectStatusUpdateDto,
  ): Promise<BaseResponse<Project>> {
    this.logger.debug(`${user.id} try approve project ${request.projectId}`);
    const updatedProject = await this.projectService.projectStatusUpdate(
      user.id,
      request,
    );
    const response = baseResponseHelper(
      updatedProject,
      HttpStatus.OK,
      'Project updated successfully',
    );
    return response;
  }

  @ApiOperation({ summary: 'update project' })
  @UseGuards(JwtAuthGuard)
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

  @ApiOperation({ summary: 'update project' })
  @Permissions(Permission.OE) // only admin and operator
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch('projectUpdate/:projectId')
  async projectUpdate(
    @CurrentUser() user: ICurrentUser,
    @Param('projectId') projectId: string,
    @Body() updateRequest: ProjectUpdateDto,
  ): Promise<BaseResponse<Project>> {
    this.logger.debug('payload', JSON.stringify(updateRequest));
    this.logger.debug(`update project ${projectId}`);
    const updatedProject = await this.projectService.projectUpdate(
      user.id,
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
