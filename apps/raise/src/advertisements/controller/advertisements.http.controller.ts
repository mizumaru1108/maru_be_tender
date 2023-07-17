import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import {
  AdvertisementCreateCommand,
  AdvertisementCreateCommandResult,
} from 'src/advertisements/commands/advertisement.create/advertisement.create.command';
import {
  AdvertisementUpdateCommand,
  AdvertisementUpdateCommandResult,
} from 'src/advertisements/commands/advertisement.update/advertisement.update.command';
import { AdvertisementCreateDto } from 'src/advertisements/dtos/requests/advertisement.create.dto';
import { AdvertisementUpdateDto } from 'src/advertisements/dtos/requests/advertisement.update.dto';
import { baseResponseHelper } from 'src/commons/helpers/base-response-helper';
import { TenderJwtGuard } from 'src/tender-auth/guards/tender-jwt.guard';

@ApiTags('advertisements')
@Controller('advertisements')
export class AdvertisementHttpController {
  constructor(
    private readonly commandBus: CommandBus, // private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({
    summary: 'creating advertisement either for internal or external',
  })
  @ApiBody({
    type: AdvertisementCreateDto,
  })
  @UseGuards(TenderJwtGuard)
  @Post('create')
  async create(@Body() dto: AdvertisementCreateDto) {
    try {
      const command = Builder<AdvertisementCreateCommand>(
        AdvertisementCreateCommand,
        {
          ...dto,
          date: new Date(dto.date),
        },
      ).build();

      const result = await this.commandBus.execute<
        AdvertisementCreateCommand,
        AdvertisementCreateCommandResult
      >(command);

      return baseResponseHelper({
        data: result,
        message: 'Advertisement Created Successfully!',
        statusCode: HttpStatus.CREATED,
      });
    } catch (e) {
      throw e;
    }
  }

  // @Get()
  // async findMany(
  //   @Query() dto: AdvertisementFindManyQueryDto,
  // ) {
  //   const { page, limit } = dto;

  //   const responseBuilder = Builder<
  //     BaseHttpPaginatedResponseDto<AdvertisementEntity[], any>
  //   >(BaseHttpPaginatedResponseDto);
  //   responseBuilder.statusCode(200);
  //   responseBuilder.message('Advertisement List Fetched Successfully!');

  //   const builder = Builder<AdvertisementFindManyQuery>(
  //     AdvertisementFindManyQuery,
  //     {
  //       ...dto,
  //     },
  //   );

  //   const { result, total } = await this.queryBus.execute<
  //     AdvertisementFindManyQuery,
  //     AdvertisementFindManyQueryResult
  //   >(builder.build());

  //   responseBuilder.data(result);
  //   responseBuilder.page(page);
  //   responseBuilder.per_page(limit);
  //   responseBuilder.total(total);

  //   return paginationHelper(responseBuilder.build());
  // }

  @UseGuards(TenderJwtGuard)
  @Post('update')
  async update(@Body() dto: AdvertisementUpdateDto) {
    try {
      const command = Builder<AdvertisementUpdateCommand>(
        AdvertisementUpdateCommand,
        {
          ...dto,
          date: dto.date ? new Date(dto.date) : undefined,
        },
      ).build();

      const result = await this.commandBus.execute<
        AdvertisementUpdateCommand,
        AdvertisementUpdateCommandResult
      >(command);

      return baseResponseHelper({
        data: result,
        message: 'Advertisement Updated Successfully!',
        statusCode: HttpStatus.OK,
      });
    } catch (e) {
      throw e;
    }
  }
}
