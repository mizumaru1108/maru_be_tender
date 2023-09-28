import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { error } from 'winston';
import { AuthoritiesFindManyQueryDto } from '../../authority-management/authorities/dto/queries/authorities.find.many.query.dto';
import { AuthoritiesEntity } from '../../authority-management/authorities/entities/authorities.entity';
import { BaseApiOkResponse } from '../../commons/decorators/base.api.ok.response.decorator';
import { BasePaginationApiOkResponse } from '../../commons/decorators/base.pagination.api.ok.response.decorator';
import { BaseResponse } from '../../commons/dtos/base-response';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../tender-auth/guards/tender-roles.guard';
import { DataNotFoundException } from '../../tender-commons/exceptions/data-not-found.exception';
import { ForbiddenPermissionException } from '../../tender-commons/exceptions/forbidden-permission-exception';
import { PayloadErrorException } from '../../tender-commons/exceptions/payload-error.exception';
import { BasePrismaErrorException } from '../../tender-commons/exceptions/prisma-error/base.prisma.error.exception';
import { RequestErrorException } from '../../tender-commons/exceptions/request-error.exception';
import { manualPaginationHelper } from '../../tender-commons/helpers/manual-pagination-helper';
import { InvalidTrackIdException } from '../../track-management/track/exceptions/invalid-track-id.excception';
import {
  SmsConfigCreateCommand,
  SmsConfigCreateCommandResult,
} from '../commands/sms.config.create.command/sms.config.create.command';
import {
  SmsConfigDeleteCommand,
  SmsConfigDeleteCommandResult,
} from '../commands/sms.config.delete.command/sms.config.delete.command';
import {
  SmsConfigUpdateCommand,
  SmsConfigUpdateCommandResult,
} from '../commands/sms.config.update.command/sms.config.update.command';
import { SmsConfigCreateDto } from '../dtos/requests/sms.config.create.dto';
import { SmsConfigDeleteDto } from '../dtos/requests/sms.config.delete.dto';
import { SmsConfigUpdateDto } from '../dtos/requests/sms.config.update.dto';
import { SmsGatewayEntity } from '../entities/sms.gateway.entity';
import {
  SmsConfigFindManyQuery,
  SmsConfigFindManyQueryResult,
} from '../queries/sms.config.find.many.query/sms.config.find.many.query';

@ApiTags('SmsConfigModule')
@Controller('sms-config')
export class SmsConfigHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  errorMapper(e: any) {
    if (e instanceof DataNotFoundException) {
      return new NotFoundException(e.message);
    }
    if (
      e instanceof PayloadErrorException ||
      e instanceof InvalidTrackIdException
    ) {
      return new BadRequestException(e.message);
    }
    if (e instanceof ForbiddenPermissionException) {
      return new ForbiddenException(e.message);
    }
    if (e instanceof RequestErrorException) {
      return new UnprocessableEntityException(e.message);
    }

    if (e instanceof BasePrismaErrorException) {
      return new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: e.message,
          error: e.stack ? JSON.parse(e.stack) : e.message,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return new InternalServerErrorException(error);
  }

  @ApiOperation({
    summary: 'Creating sms config (env) for sms gateway (admin only)',
  })
  @BaseApiOkResponse(SmsGatewayEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @UseGuards(TenderJwtGuard)
  @Post('create')
  async create(@Body() dto: SmsConfigCreateDto) {
    try {
      const command = Builder<SmsConfigCreateCommand>(SmsConfigCreateCommand, {
        ...dto,
      }).build();

      const result = await this.commandBus.execute<
        SmsConfigCreateCommand,
        SmsConfigCreateCommandResult
      >(command);

      return baseResponseHelper({
        data: result.created_entity,
        message: 'Sms Config Created Successfully!',
        statusCode: HttpStatus.CREATED,
      });
    } catch (e) {
      throw this.errorMapper(e);
    }
  }

  @ApiOperation({
    summary: 'Find config for sms gateway (admin only)',
  })
  @BasePaginationApiOkResponse(AuthoritiesEntity)
  @Get()
  async findMany(@Query() query: AuthoritiesFindManyQueryDto) {
    try {
      const builder = Builder<SmsConfigFindManyQuery>(SmsConfigFindManyQuery, {
        ...query,
      });

      const { result, total } = await this.queryBus.execute<
        SmsConfigFindManyQuery,
        SmsConfigFindManyQueryResult
      >(builder.build());

      return manualPaginationHelper(
        result,
        total,
        query.page || 1,
        query.limit || 10,
        HttpStatus.OK,
        'Sms Config List Fetched Successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @ApiOperation({
    summary: 'updating sms config data for sms gateway (admin only)',
  })
  @BaseApiOkResponse(SmsGatewayEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('update')
  async update(
    @Body() dto: SmsConfigUpdateDto,
  ): Promise<BaseResponse<SmsGatewayEntity>> {
    try {
      const command = Builder<SmsConfigUpdateCommand>(SmsConfigUpdateCommand, {
        ...dto,
      }).build();
      const result = await this.commandBus.execute<
        SmsConfigUpdateCommand,
        SmsConfigUpdateCommandResult
      >(command);

      return baseResponseHelper(
        result.updated_entity,
        HttpStatus.OK,
        'Sms Config Updated Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }

  @ApiOperation({
    summary: 'Deleting Sms Config data (admin only)',
  })
  @BaseApiOkResponse(SmsConfigDeleteCommandResult, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('delete')
  async delete(
    @Body() dto: SmsConfigDeleteDto,
  ): Promise<BaseResponse<SmsConfigDeleteCommandResult>> {
    try {
      const command = Builder<SmsConfigDeleteCommand>(SmsConfigDeleteCommand, {
        ...dto,
      }).build();
      const result = await this.commandBus.execute<
        SmsConfigDeleteCommand,
        SmsConfigDeleteCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.OK,
        'Sms Config Deleted Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }
}
