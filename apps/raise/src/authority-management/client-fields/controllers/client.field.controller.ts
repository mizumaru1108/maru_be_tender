import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { BaseApiOkResponse } from '../../../commons/decorators/base.api.ok.response.decorator';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { ClientFieldEntity } from '../entities/client.field.entity';
import {
  ClientFieldCreateCommand,
  ClientFieldCreateCommandResult,
} from '../commands/client.field.create.command/client.field.create.command';
import { ClientFieldCreateDto } from '../dto/requests/client.field.create.dto';
import { ClientFieldFindManyQueryDto } from '../dto/queries/client.field.find.many.query.dto';
import {
  ClientFieldFindManyQuery,
  ClientFieldFindManyQueryResult,
} from '../queries/client.field.find.many.query.ts/client.field.find.many.query';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { BasePaginationApiOkResponse } from '../../../commons/decorators/base.pagination.api.ok.response.decorator';

@Controller('authority-management/client-fields')
export class ClientFieldHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  errorMapper(error: any) {
    return new InternalServerErrorException(error);
  }

  @ApiOperation({
    summary: 'Creating client field (admin only)',
  })
  @BaseApiOkResponse(ClientFieldEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('create')
  async create(@Body() dto: ClientFieldCreateDto) {
    try {
      const command = Builder<ClientFieldCreateCommand>(
        ClientFieldCreateCommand,
        {
          ...dto,
        },
      ).build();

      const result = await this.commandBus.execute<
        ClientFieldCreateCommand,
        ClientFieldCreateCommandResult
      >(command);

      return baseResponseHelper(
        result.created_entities,
        HttpStatus.CREATED,
        'Entities Created Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }

  @ApiOperation({
    summary: 'Find Client Fields',
  })
  @BasePaginationApiOkResponse(ClientFieldEntity)
  @Get()
  async findMany(@Query() query: ClientFieldFindManyQueryDto) {
    try {
      const builder = Builder<ClientFieldFindManyQuery>(
        ClientFieldFindManyQuery,
        {
          ...query,
        },
      );

      const { result, total } = await this.queryBus.execute<
        ClientFieldFindManyQuery,
        ClientFieldFindManyQueryResult
      >(builder.build());

      return manualPaginationHelper(
        result,
        total,
        query.page || 1,
        query.limit || 10,
        HttpStatus.OK,
        'Client Field List Fetched Successfully!',
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
