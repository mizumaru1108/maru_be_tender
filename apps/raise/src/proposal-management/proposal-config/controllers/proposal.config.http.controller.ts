import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { BaseApiOkResponse } from 'src/commons/decorators/base.api.ok.response.decorator';
import { BaseResponse } from 'src/commons/dtos/base-response';
import { baseResponseHelper } from 'src/commons/helpers/base-response-helper';
import { TenderRoles } from 'src/tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from 'src/tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from 'src/tender-auth/guards/tender-roles.guard';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';
import { PayloadErrorException } from 'src/tender-commons/exceptions/payload-error.exception';
import { PrismaInvalidForeignKeyException } from 'src/tender-commons/exceptions/prisma-error/prisma.invalid.foreign.key.exception';
import {
  ProposalConfigUpdateCommand,
  ProposalConfigUpdateCommandResult,
} from '../commands/config.update.command/config.update.command';
import { ProposalConfigUpdateDto } from '../dtos/requests/proposal.config.update.dto';
import { ProposalConfigEntity } from '../entities/proposal.config.entity';
import {
  ProposalConfigFindFirstQuery,
  ProposalConfigFindFirstQueryResult,
} from '../queries/proposal.config.find.first.query';

@ApiTags('ProposalConfigModule')
@Controller('tender/proposal/configs')
export class ProposalConfigHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  errorMapper(error: any) {
    if (
      error instanceof PayloadErrorException ||
      error instanceof DataNotFoundException
    ) {
      throw new BadRequestException(error.message);
    }
    if (error instanceof PrismaInvalidForeignKeyException) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: error.message,
          error: error.stack ? JSON.parse(error.stack) : error.message,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    throw new InternalServerErrorException(error);
  }

  @ApiOperation({
    summary: 'find personalized banner for curtain user',
  })
  @BaseApiOkResponse(ProposalConfigEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @Get('fetch')
  async findMyBanners() {
    try {
      const builder = Builder<ProposalConfigFindFirstQuery>(
        ProposalConfigFindFirstQuery,
        {},
      );

      const { data } = await this.queryBus.execute<
        ProposalConfigFindFirstQuery,
        ProposalConfigFindFirstQueryResult
      >(builder.build());

      return baseResponseHelper(
        data,
        HttpStatus.OK,
        'Authority Created Successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @ApiOperation({ summary: 'Updating config for proposal' })
  @BaseApiOkResponse(ProposalConfigEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('update')
  async update(
    @Body() dto: ProposalConfigUpdateDto,
  ): Promise<BaseResponse<ProposalConfigEntity>> {
    try {
      const command = Builder<ProposalConfigUpdateCommand>(
        ProposalConfigUpdateCommand,
        {
          ...dto,
        },
      ).build();

      const { data } = await this.commandBus.execute<
        ProposalConfigUpdateCommand,
        ProposalConfigUpdateCommandResult
      >(command);

      return baseResponseHelper(
        data,
        HttpStatus.OK,
        'Config Updated Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }
}
