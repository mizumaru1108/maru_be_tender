import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
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
import { ApiOperation } from '@nestjs/swagger';
import { AuthoritiesEntity } from '../entities/authorities.entity';
import { BasePaginationApiOkResponse } from '../../../commons/decorators/base.pagination.api.ok.response.decorator';
import { AuthoritiesFindManyQueryDto } from '../dto/queries/authorities.find.many.query.dto';
import {
  AuthoritiesFindManyQuery,
  AuthoritiesFindManyQueryResult,
} from '../queries/authorities.find.many.query/authorities.find.many.query';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';

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

  //   @UseGuards(TenderJwtGuard)
  //   @Post('update')
  //   async update(@Res() res: Response, @Body() dto: AuthoritiesUpdateDto) {
  //     try {
  //          const command = Builder<AuthoritiesCommand>(
  //              AuthoritiesUpdateCommand,
  //          {
  //               ...dto,
  //          },
  //          ).build();

  //      const result = await this.commandBus.execute<
  //          AuthoritiesUpdateCommand,
  //          AuthoritiesUpdateCommandResult
  //      >(command);

  //      return baseHttpResponseHelper(res, {
  //          data: result,
  //          message: 'Authority Updated Successfully!',
  //          statusCode: HttpStatus.OK,
  //      });
  //        } catch (e) {
  //          throw e;
  //        }
  //  }
}
