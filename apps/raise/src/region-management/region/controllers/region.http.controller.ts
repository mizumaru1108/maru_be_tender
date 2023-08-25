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
  RegionCreateCommand,
  RegionCreateCommandResult,
} from '../commands/region.create.command/region.create.command';
import {
  RegionDeleteCommand,
  RegionDeleteCommandResult,
} from '../commands/region.delete.command/region.delete.command';
import {
  RegionUpdateCommand,
  RegionUpdateCommandResult,
} from '../commands/region.update.command/region.update.command';
import { RegionFindManyQueryDto } from '../dto/queries/region.find.many.query.dto';
import { RegionCreateDto } from '../dto/requests/region.create.dto';
import { RegionDeleteDto } from '../dto/requests/region.delete.dto';
import { RegionUpdateDto } from '../dto/requests/region.update.dto';
import { RegionEntity } from '../entities/region.entity';
import {
  RegionFindManyQuery,
  RegionFindManyQueryResult,
} from '../queries/region.find.many.query/region.find.many.query';

@ApiTags('RegionModule')
@Controller('region-management/regions')
export class RegionHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  errorMapper(error: any) {
    return new InternalServerErrorException(error);
  }

  @ApiOperation({
    summary: 'Creating Region (admin only)',
  })
  @BaseApiOkResponse(RegionEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('create')
  async create(@Body() dto: RegionCreateDto) {
    try {
      const command = Builder<RegionCreateCommand>(RegionCreateCommand, {
        ...dto,
      }).build();

      const result = await this.commandBus.execute<
        RegionCreateCommand,
        RegionCreateCommandResult
      >(command);

      return baseResponseHelper(
        result.data,
        HttpStatus.CREATED,
        'Region Created Successfully!',
      );
    } catch (e) {
      throw e;
    }
  }

  @ApiOperation({
    summary: 'Find Many Region',
  })
  @BasePaginationApiOkResponse(RegionEntity)
  @Get()
  async findMany(@Query() query: RegionFindManyQueryDto) {
    try {
      const builder = Builder<RegionFindManyQuery>(RegionFindManyQuery, {
        ...query,
      });

      const { data, total } = await this.queryBus.execute<
        RegionFindManyQuery,
        RegionFindManyQueryResult
      >(builder.build());

      return manualPaginationHelper(
        data,
        total,
        query.page || 1,
        query.limit || 10,
        HttpStatus.OK,
        'Region List Fetched Successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @ApiOperation({
    summary: 'Updating Region data (admin only)',
  })
  @BaseApiOkResponse(RegionEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('update')
  async update(
    @Body() dto: RegionUpdateDto,
  ): Promise<BaseResponse<RegionEntity>> {
    try {
      const command = Builder<RegionUpdateCommand>(RegionUpdateCommand, {
        ...dto,
      }).build();

      const result = await this.commandBus.execute<
        RegionUpdateCommand,
        RegionUpdateCommandResult
      >(command);

      return baseResponseHelper(
        result.data,
        HttpStatus.OK,
        'Region Updated Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }

  @ApiOperation({
    summary: 'deleting region data (admin only)',
  })
  @BaseApiOkResponse(RegionDeleteCommandResult, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('delete')
  async delete(
    @Body() dto: RegionDeleteDto,
  ): Promise<BaseResponse<RegionDeleteCommandResult>> {
    try {
      const command = Builder<RegionDeleteCommand>(RegionDeleteCommand, {
        ...dto,
      }).build();
      const result = await this.commandBus.execute<
        RegionDeleteCommand,
        RegionDeleteCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.OK,
        'Region Deleted Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }
  // @Get(':id')
  // async findById(@Res() res: Response, @Param('id') id: string) {
  //   const responseBuilder =
  //     Builder<BaseHttpResponseDto<RegionEntity, any>>(
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
