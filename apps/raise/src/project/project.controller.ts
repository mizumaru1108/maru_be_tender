import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CurrentUser } from '../commons/decorators/current-user.decorator';
import { BaseResponse } from '../commons/dtos/base-response';
import { PaginatedResponse } from '../commons/dtos/paginated-response.dto';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';
import { paginationHelper } from '../commons/helpers/pagination-helper';
import { Permission } from '../libs/authzed/enums/permission.enum';
import { ROOT_LOGGER } from '../libs/root-logger';
import { ICurrentUser } from '../user/interfaces/current-user.interface';
import { ProjectCreateDto } from './dto/project-create.dto';
import { ProjectDeleteParamsDto } from './dto/project-delete-params.dto';
import { ProjectFilterRequest } from './dto/project-filter.request';
import { ProjectSetDeletedFlagDto } from './dto/project-set-flag-deleted';
import { ProjectStatusUpdateDto } from './dto/project-status-update.dto';
import { ProjectUpdateDto } from './dto/project-update.dto';
import { ProjectService } from './project.service';
import { Project, ProjectDocument } from './schema/project.schema';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': ProjectController.name,
  });
  constructor(private projectService: ProjectService) {}

  @ApiOperation({ summary: 'Get list of my projects' })
  @Permissions(Permission.OE) // only admin and operator
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('getMyProjects')
  async getMyProjects(
    @CurrentUser() user: ICurrentUser,
    @Query() projectFilter: ProjectFilterRequest,
  ): Promise<PaginatedResponse<ProjectDocument[]>> {
    this.logger.debug(`Getting all of projects on user ${user.id}!`);
    const myProjects = await this.projectService.getMyProjects(
      user.id,
      projectFilter,
    );
    const response = paginationHelper(
      myProjects.docs,
      myProjects.totalDocs,
      myProjects.limit,
      myProjects.page,
      myProjects.totalPages,
      myProjects.pagingCounter,
      myProjects.hasPrevPage,
      myProjects.hasNextPage,
      myProjects.prevPage,
      myProjects.nextPage,
      HttpStatus.OK,
      `Successfully fetch all of my project (User: '${user.id}')`,
    );
    return response;
  }

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
  @Permissions(Permission.OE) // only admin and operator
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch('updateProject/:projectId')
  async updateProject(
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

  @ApiOperation({ summary: 'permanent delete project!' })
  @Permissions(Permission.OE) // only admin and operator
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Delete('deleteProject/:organizationId/:projectId')
  async deleteProject(
    @CurrentUser() user: ICurrentUser,
    @Param() request: ProjectDeleteParamsDto,
  ): Promise<BaseResponse<Project>> {
    this.logger.debug(`delete project ${request.projectId}`);
    const deletedProject = await this.projectService.deleteProject(
      user.id,
      request,
    );
    const response = baseResponseHelper(
      deletedProject,
      HttpStatus.OK,
      'Project deleted successfully',
    );
    return response;
  }
}
