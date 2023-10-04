import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { BaseApiOkResponse } from '../../../commons/decorators/base.api.ok.response.decorator';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import {
  TrackCreateCommandCommand,
  TrackCreateCommandCommandResult,
} from '../commands/track.create.command/track.create.command';

import { BasePaginationApiOkResponse } from '../../../commons/decorators/base.pagination.api.ok.response.decorator';
import {
  TrackUpdateCommand,
  TrackUpdateCommandResult,
} from '../commands/track.update.command/track.update.command';
import { TrackFindManyQueryDto } from '../dto/queries/track.find.many.query.dto';
import { CreateTrackDto, UpdateTrackDto } from '../dto/requests';
import { TrackEntity } from '../entities/track.entity';
import {
  TrackFindManyQuery,
  TrackFindManyQueryResult,
} from '../queries/track.find.many/track.find.many.query';
import { TrackFindByIdQueryDto } from '../dto/queries/track.find.by.id.query.dto';
import {
  TrackFindByIdQuery,
  TrackFindByIdQueryResult,
} from '../queries/track.find.by.id/track.find.by.id.query';

@ApiTags('TrackModule/Track')
@Controller('tender/track')
export class TrackController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  errorMapper(e: any) {
    console.trace(e);
    if (
      e instanceof BadRequestException ||
      e instanceof NotFoundException ||
      e instanceof ConflictException ||
      e instanceof InternalServerErrorException
    ) {
      return e;
    }

    return new InternalServerErrorException(e);
  }

  @ApiOperation({
    summary: 'Creating track (admin only)',
  })
  @BaseApiOkResponse(TrackEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('create')
  async create(@Body() request: CreateTrackDto) {
    try {
      const command = Builder<TrackCreateCommandCommand>(
        TrackCreateCommandCommand,
        { ...request },
      ).build();

      const result = await this.commandBus.execute<
        TrackCreateCommandCommand,
        TrackCreateCommandCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.CREATED,
        'Track Created Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }

  @ApiOperation({
    summary: 'Updating track (admin only)',
  })
  @BaseApiOkResponse(TrackEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('update')
  async update(@Body() request: UpdateTrackDto) {
    try {
      const command = Builder<TrackUpdateCommand>(TrackUpdateCommand, {
        ...request,
      }).build();

      const result = await this.commandBus.execute<
        TrackUpdateCommand,
        TrackUpdateCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.CREATED,
        'Track Updated Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }

  @ApiOperation({
    summary: 'Find many track',
  })
  @BasePaginationApiOkResponse(TrackEntity)
  @UseGuards(TenderJwtGuard)
  @Get()
  async findMany(@Query() query: TrackFindManyQueryDto) {
    const builder = Builder<TrackFindManyQuery>(TrackFindManyQuery, {
      ...query,
    });

    const { data, total } = await this.queryBus.execute<
      TrackFindManyQuery,
      TrackFindManyQueryResult
    >(builder.build());

    return manualPaginationHelper(
      data,
      total,
      query.page || 1,
      query.limit || 10,
      HttpStatus.OK,
      'Track List Fetched Successfully!',
    );
  }

  @ApiOperation({
    summary: 'find track by id',
  })
  @BaseApiOkResponse(TrackEntity, 'object')
  @UseGuards(TenderJwtGuard)
  @Get('/:track_id')
  async findById(
    @Param('track_id') track_id: string,
    @Query() queryParam: TrackFindByIdQueryDto,
  ) {
    try {
      const queries = Builder<TrackFindByIdQuery>(TrackFindByIdQuery, {
        track_id,
        ...queryParam,
      }).build();

      const { data } = await this.queryBus.execute<
        TrackFindByIdQuery,
        TrackFindByIdQueryResult
      >(queries);

      return baseResponseHelper(
        data,
        HttpStatus.OK,
        'Banner Fetched Successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }
}
