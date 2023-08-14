import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { BaseApiOkResponse } from '../../../commons/decorators/base.api.ok.response.decorator';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { EntitiesEntity } from '../entities/entities.entity';
import {
  EntitiesCreateCommand,
  EntitiesCreateCommandResult,
} from '../commands/entities.create.command/entities.create.command';
import { EntitiesCreateDto } from '../dto/requests/entities.create.dto';

@Controller('entity-management/entities')
export class EntitiesHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({
    summary: 'Creating entities (admin only)',
  })
  @BaseApiOkResponse(EntitiesEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('create')
  async create(@Body() dto: EntitiesCreateDto) {
    try {
      const command = Builder<EntitiesCreateCommand>(EntitiesCreateCommand, {
        ...dto,
      }).build();

      const result = await this.commandBus.execute<
        EntitiesCreateCommand,
        EntitiesCreateCommandResult
      >(command);

      return baseResponseHelper(
        result.created_entities,
        HttpStatus.CREATED,
        'Entities Created Successfully!',
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
