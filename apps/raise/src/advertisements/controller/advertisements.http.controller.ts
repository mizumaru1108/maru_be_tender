import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
import { AdvertisementFindManyQueryDto } from 'src/advertisements/dtos/queries/advertisement.find.many.query.dto';
import { AdvertisementCreateDto } from 'src/advertisements/dtos/requests/advertisement.create.dto';
import { AdvertisementUpdateDto } from 'src/advertisements/dtos/requests/advertisement.update.dto';
import { AdvertisementEntity } from 'src/advertisements/entities/advertisement.entity';
import {
  AdvertisementFindManyQuery,
  AdvertisementFindManyQueryResult,
} from 'src/advertisements/queries/advertisement.find.many.query/advertisement.find.many.query';
import { AdvertisementTypeEnum } from 'src/advertisements/types/enums/advertisement.type.enum';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
import { BaseResponse } from 'src/commons/dtos/base-response';
import { baseResponseHelper } from 'src/commons/helpers/base-response-helper';
import { TenderRoles } from 'src/tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from 'src/tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from 'src/tender-auth/guards/tender-roles.guard';
import { PayloadErrorException } from 'src/tender-commons/exceptions/payload-error.exception';
import { PrismaInvalidForeignKeyException } from 'src/tender-commons/exceptions/prisma-error/prisma.invalid.foreign.key.exception';
import { manualPaginationHelper } from 'src/tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from 'src/tender-user/user/interfaces/current-user.interface';

@ApiTags('advertisements')
@Controller('advertisements')
export class AdvertisementHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  advertisementControllerErrorMapper(error: any) {
    if (error instanceof PayloadErrorException) {
      throw new BadRequestException(error.message);
    }
    if (error instanceof PrismaInvalidForeignKeyException) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: error.message,
          error: error.stack ? JSON.parse(error.stack) : error.message,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    throw new InternalServerErrorException(error);
  }

  @ApiOperation({
    summary: 'creating advertisement either for internal or external',
  })
  @ApiBody({
    type: AdvertisementCreateDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Promise<BaseResponse<AdvertisementEntity>>,
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo', maxCount: 4 }]))
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('create')
  async create(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() dto: AdvertisementCreateDto,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
    },
  ): Promise<BaseResponse<AdvertisementEntity>> {
    try {
      const command = Builder<AdvertisementCreateCommand>(
        AdvertisementCreateCommand,
        {
          ...dto,
          type: dto.type as unknown as AdvertisementTypeEnum,
          date: new Date(dto.date),
          logos: files.logo,
          current_user: currentUser,
        },
      ).build();

      const result = await this.commandBus.execute<
        AdvertisementCreateCommand,
        AdvertisementCreateCommandResult
      >(command);

      return baseResponseHelper(
        result.advertisement,
        HttpStatus.CREATED,
        'Advertisement Created Successfully!',
      );
    } catch (e) {
      throw this.advertisementControllerErrorMapper(e);
    }
  }

  @Get()
  async findMany(@Query() dto: AdvertisementFindManyQueryDto) {
    const builder = Builder<AdvertisementFindManyQuery>(
      AdvertisementFindManyQuery,
      {
        ...dto,
      },
    );

    const { result, total } = await this.queryBus.execute<
      AdvertisementFindManyQuery,
      AdvertisementFindManyQueryResult
    >(builder.build());

    return manualPaginationHelper(
      result,
      total,
      dto.page || 1,
      dto.limit || 10,
      HttpStatus.OK,
      'Advertisement List Fetched Successfully!',
    );
  }

  @ApiOperation({
    summary: 'updating advertisement either for internal or external',
  })
  @ApiBody({
    type: AdvertisementCreateDto,
  })
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
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
