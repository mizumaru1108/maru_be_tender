import { Controller } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { rootLogger } from '../logger';
import { ProjectDto } from './dto';
import { ProjectService } from './project.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  @ApiOperation({ summary: 'Get All Projects viewed by manager' })
  @Get('getListAll')
  async getAllTickets() {
    this.logger.debug(`Get all projects`);
    return await this.projectService.getListAll();
  }
}
