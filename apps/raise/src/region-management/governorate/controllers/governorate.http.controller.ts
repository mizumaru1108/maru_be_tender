import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { BaseApiOkResponse } from '../../../commons/decorators/base.api.ok.response.decorator';
import { BasePaginationApiOkResponse } from '../../../commons/decorators/base.pagination.api.ok.response.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';

import {
  GovernorateCreateCommand,
  GovernorateCreateCommandResult,
} from '../commands/governorate.create.command/governorate.create.command';
import {
  GovernorateDeleteCommand,
  GovernorateDeleteCommandResult,
} from '../commands/governorate.delete.command/governorate.delete.command';
import {
  GovernorateUpdateCommand,
  GovernorateUpdateCommandResult,
} from '../commands/governorate.update.command/governorate.update.command';
import { GovernorateFindManyQueryDto } from '../dto/queries/governorate.find.many.query.dto';
import { GovernorateCreateDto } from '../dto/requests/governorate.create.dto';
import { GovernorateDeleteDto } from '../dto/requests/governorate.delete.dto';
import { GovernorateUpdateDto } from '../dto/requests/governorate.update.dto';
import { GovernorateEntity } from '../entities/governorate.entity';
import {
  GovernorateFindManyQuery,
  GovernorateFindManyQueryResult,
} from '../queries/governorate.find.many.query/governorate.find.many.query';

@ApiTags('GovernorateModule')
@Controller('region-management/governorates')
export class GovernorateHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  errorMapper(error: any) {
    return new InternalServerErrorException(error);
  }

  @ApiOperation({
    summary: 'Creating Governorate (admin only)',
  })
  @BaseApiOkResponse(GovernorateEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('create')
  async create(@Body() dto: GovernorateCreateDto) {
    try {
      const command = Builder<GovernorateCreateCommand>(
        GovernorateCreateCommand,
        {
          ...dto,
        },
      ).build();

      const result = await this.commandBus.execute<
        GovernorateCreateCommand,
        GovernorateCreateCommandResult
      >(command);

      return baseResponseHelper(
        result.data,
        HttpStatus.CREATED,
        'Governorate Created Successfully!',
      );
    } catch (e) {
      throw e;
    }
  }

  @ApiOperation({
    summary: 'Find Many Governorate',
  })
  @BasePaginationApiOkResponse(GovernorateEntity)
  @Get()
  async findMany(@Query() query: GovernorateFindManyQueryDto) {
    try {
      const builder = Builder<GovernorateFindManyQuery>(
        GovernorateFindManyQuery,
        {
          ...query,
        },
      );

      const { data, total } = await this.queryBus.execute<
        GovernorateFindManyQuery,
        GovernorateFindManyQueryResult
      >(builder.build());

      return manualPaginationHelper(
        data,
        total,
        query.page || 1,
        query.limit || 10,
        HttpStatus.OK,
        'Governorate List Fetched Successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @ApiOperation({
    summary: 'Updating Governorate data (admin only)',
  })
  @BaseApiOkResponse(GovernorateEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('update')
  async update(
    @Body() dto: GovernorateUpdateDto,
  ): Promise<BaseResponse<GovernorateEntity>> {
    try {
      const command = Builder<GovernorateUpdateCommand>(
        GovernorateUpdateCommand,
        {
          ...dto,
        },
      ).build();

      const result = await this.commandBus.execute<
        GovernorateUpdateCommand,
        GovernorateUpdateCommandResult
      >(command);

      return baseResponseHelper(
        result.data,
        HttpStatus.OK,
        'Governorate Updated Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }

  @ApiOperation({
    summary: 'deleting governorate data (admin only)',
  })
  @BaseApiOkResponse(GovernorateDeleteCommandResult, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('delete')
  async delete(
    @Body() dto: GovernorateDeleteDto,
  ): Promise<BaseResponse<GovernorateDeleteCommandResult>> {
    try {
      const command = Builder<GovernorateDeleteCommand>(
        GovernorateDeleteCommand,
        {
          ...dto,
        },
      ).build();
      const result = await this.commandBus.execute<
        GovernorateDeleteCommand,
        GovernorateDeleteCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.OK,
        'Governorate Deleted Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }
  // @Get(':id')
  // async findById(@Res() res: Response, @Param('id') id: string) {
  //   const responseBuilder =
  //     Builder<BaseHttpResponseDto<GovernorateEntity, any>>(
  //       BaseHttpResponseDto,
  //     );
  //   responseBuilder.statusCode(200);
  //   responseBuilder.message('Authority Fetched Successfully');

  //   const query = Builder<AuthoritiesFindByIdQuery>(
  //     AuthoritiesFindByIdQuery,
  //     {
  //       id,
  //     },
  //   ).build();

  //   const result = await this.queryBus.execute(query);

  //   responseBuilder.data(result);

  //   return baseHttpResponseHelper(res, responseBuilder.build());
  // }
}
