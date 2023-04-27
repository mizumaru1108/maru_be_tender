import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { TenderJwtGuard } from '../../tender-auth/guards/tender-jwt.guard';
import { manualPaginationHelper } from '../../tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';
import { FetchFileManagerFilter } from '../dtos/requests';
import { TenderFileManagerService } from '../services/tender-file-manager.service';

@Controller('tender/file-manager')
export class TenderFileManagerController {
  constructor(private readonly fileManagerService: TenderFileManagerService) {}

  @UseGuards(TenderJwtGuard)
  @Get('fetch-all')
  async fetchAll(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() filter: FetchFileManagerFilter,
  ) {
    const result = await this.fileManagerService.fetchAll(currentUser, filter);

    return manualPaginationHelper(
      result.data,
      result.total,
      filter.page || 1,
      filter.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }
}
