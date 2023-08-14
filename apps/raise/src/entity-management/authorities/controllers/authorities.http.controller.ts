import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
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

@Controller('entity-management/authorities')
export class AuthoritiesHttpController {
  constructor(private readonly commandBus: CommandBus) {}

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

  // @Get()
  // async findMany(
  //   @Res() res: Response,
  //   @Query() dto: AuthoritiesFindManyQueryDto,
  // ) {
  //   const { page, limit } = dto;

  //   const responseBuilder = Builder<
  //     BaseHttpPaginatedResponseDto<AuthoritiesEntity[], any>
  //   >(BaseHttpPaginatedResponseDto);
  //   responseBuilder.statusCode(200);
  //   responseBuilder.message('Authority List Fetched Successfully!');

  //   const builder = Builder<AuthoritiesFindManyQuery>(
  //     AuthoritiesFindManyQuery,
  //     {
  //       ...dto,
  //     },
  //   );

  //   const { result, total } = await this.queryBus.execute<
  //     AuthoritiesFindManyQuery,
  //     AuthoritiesFindManyQueryResult
  //   >(builder.build());

  //   responseBuilder.data(result);
  //   responseBuilder.page(page);
  //   responseBuilder.per_page(limit);
  //   responseBuilder.total(total);

  //   return basePaginatedResponseHelper(res, responseBuilder.build());
  // }

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
