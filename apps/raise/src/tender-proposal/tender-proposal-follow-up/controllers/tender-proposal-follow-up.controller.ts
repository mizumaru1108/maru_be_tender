import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { proposal_follow_up } from '@prisma/client';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { CreateProposalFollowUpDto } from '../dtos/requests/create-follow-up.dto';
import { DeleteProposalFollowUpDto } from '../dtos/requests/delete-follow-up.dto';

import { TenderProposalFollowUpService } from '../services/tender-proposal-follow-up.service';

@Controller('tender-proposal/follow-up')
export class TenderProposalFollowUpController {
  constructor(
    private readonly followUpService: TenderProposalFollowUpService,
  ) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_accounts_manager',
    'tender_admin',
    'tender_cashier',
    'tender_ceo',
    'tender_consultant',
    'tender_finance',
    'tender_moderator',
    'tender_project_manager',
    'tender_project_supervisor',
  ) // only internal users
  @Post('create')
  async create(
    @CurrentUser() user: TenderCurrentUser,
    @Body() request: CreateProposalFollowUpDto,
  ): Promise<BaseResponse<proposal_follow_up>> {
    const response = await this.followUpService.create(user, request);

    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Follow Up Successfully Added!',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_ceo')
  @Patch('delete')
  async delete(
    @Body() request: DeleteProposalFollowUpDto,
  ): Promise<BaseResponse<string>> {
    const response = await this.followUpService.delete(request);

    return baseResponseHelper(
      `${response} Follow Up Deleted!`,
      HttpStatus.OK,
      'Follow Up Deleted Successfully!',
    );
  }
}
