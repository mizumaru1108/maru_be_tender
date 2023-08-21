import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { Response } from 'express';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import {
  AuthoritiesCreateCommand,
  AuthoritiesCreateCommandResult,
} from '../commands/authorities.create.command/authorities.create.command';
import { AuthoritiesCreateDto } from '../dto/requests/authorities.create.dto';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { BaseApiOkResponse } from '../../../commons/decorators/base.api.ok.response.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthoritiesEntity } from '../entities/authorities.entity';
import { BasePaginationApiOkResponse } from '../../../commons/decorators/base.pagination.api.ok.response.decorator';
import { AuthoritiesFindManyQueryDto } from '../dto/queries/authorities.find.many.query.dto';
import {
  AuthoritiesFindManyQuery,
  AuthoritiesFindManyQueryResult,
} from '../queries/authorities.find.many.query/authorities.find.many.query';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { AuthoritiesUpdateDto } from '../dto/requests/authorities.update.dto';
import { BaseResponse } from '../../../commons/dtos/base-response';
import {
  AuthoritiesUpdateCommandResult,
  AuthoritiesUpdateCommand,
} from '../commands/authorities.update.command/authorities.update.command';
import { AuthoritiesDeleteDto } from '../dto/requests/authorities.delete.dto';
import {
  AuthoritiesDeleteCommandResult,
  AuthoritiesDeleteCommand,
} from '../commands/authorities.delete.command/authorities.delete.command';
@ApiTags('AuthorityModule')
@Controller('authority-management/authorities')
export class AuthoritiesHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  errorMapper(error: any) {
    return new InternalServerErrorException(error);
  }

  @ApiOperation({
    summary: 'Creating authorities (admin only)',
  })
  @BaseApiOkResponse(AuthoritiesEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('create')
  async create(@Body() dto: AuthoritiesCreateDto) {
    try {
      const command = Builder<AuthoritiesCreateCommand>(
        AuthoritiesCreateCommand,
        {
          ...dto,
        },
      ).build();

      const result = await this.commandBus.execute<
        AuthoritiesCreateCommand,
        AuthoritiesCreateCommandResult
      >(command);

      return baseResponseHelper(
        result.created_authorities,
        HttpStatus.CREATED,
        'Authority Created Successfully!',
      );
    } catch (e) {
      throw e;
    }
  }

  @ApiOperation({
    summary: 'Find Client Fields',
  })
  @BasePaginationApiOkResponse(AuthoritiesEntity)
  @Get()
  async findMany(@Query() query: AuthoritiesFindManyQueryDto) {
    try {
      // console.log({ query });
      // console.log(typeof query.is_deleted);
      const builder = Builder<AuthoritiesFindManyQuery>(
        AuthoritiesFindManyQuery,
        {
          ...query,
        },
      );

      const { result, total } = await this.queryBus.execute<
        AuthoritiesFindManyQuery,
        AuthoritiesFindManyQueryResult
      >(builder.build());

      return manualPaginationHelper(
        result,
        total,
        query.page || 1,
        query.limit || 10,
        HttpStatus.OK,
        'Authorities List Fetched Successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @ApiOperation({
    summary: 'updating authority data (admin only)',
  })
  @BaseApiOkResponse(AuthoritiesEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('update')
  async update(
    @Body() dto: AuthoritiesUpdateDto,
  ): Promise<BaseResponse<AuthoritiesEntity>> {
    try {
      const command = Builder<AuthoritiesUpdateCommand>(
        AuthoritiesUpdateCommand,
        {
          ...dto,
        },
      ).build();
      const result = await this.commandBus.execute<
        AuthoritiesUpdateCommand,
        AuthoritiesUpdateCommandResult
      >(command);

      return baseResponseHelper(
        result.updated_authorities,
        HttpStatus.OK,
        'Authority Updated Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }

  @ApiOperation({
    summary: 'updating authority data (admin only)',
  })
  @BaseApiOkResponse(AuthoritiesDeleteCommandResult, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('delete')
  async delete(
    @Body() dto: AuthoritiesDeleteDto,
  ): Promise<BaseResponse<AuthoritiesDeleteCommandResult>> {
    try {
      const command = Builder<AuthoritiesDeleteCommand>(
        AuthoritiesDeleteCommand,
        {
          ...dto,
        },
      ).build();
      const result = await this.commandBus.execute<
        AuthoritiesDeleteCommand,
        AuthoritiesDeleteCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.OK,
        'Authority Deleted Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }
  // @Get(':id')
  // async findById(@Res() res: Response, @Param('id') id: string) {
  //   const responseBuilder =
  //     Builder<BaseHttpResponseDto<AuthoritiesEntity, any>>(
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
