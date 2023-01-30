import { Controller } from '@nestjs/common';
import { TenderFileManagerService } from '../services/tender-file-manager.service';

@Controller('tender-file-manager')
export class TenderFileManagerController {
  constructor(
    private readonly tenderFileManagerService: TenderFileManagerService,
  ) {}

  // @UseGuards(TenderJwtGuard)
  // @Post('create')
  // async create(
  //   @CurrentUser() user: TenderCurrentUser,
  //   @Body() request: CreateNewFileHistoryDto,
  // ): Promise<BaseResponse<any>> {
  //   const response = await this.tenderFileManagerService.create(
  //     user.id,
  //     request,
  //   );

  //   return baseResponseHelper(
  //     response,
  //     HttpStatus.OK,
  //     'Follow Up Successfully Added!',
  //   );
  // }
}
