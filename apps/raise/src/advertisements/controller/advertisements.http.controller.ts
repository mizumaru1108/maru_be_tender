import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import {
  AdvertisementCreateCommand,
  AdvertisementCreateCommandResult,
} from 'src/advertisements/commands/advertisement.create/advertisement.create.command';
import {
  AdvertisementDeleteCommandResult,
  AdvertisementDeleteCommand,
} from 'src/advertisements/commands/advertisement.delete/advertisement.delete.command';
import {
  AdvertisementUpdateCommand,
  AdvertisementUpdateCommandResult,
} from 'src/advertisements/commands/advertisement.update/advertisement.update.command';
import { AdvertisementFindManyQueryDto } from 'src/advertisements/dtos/queries/advertisement.find.many.query.dto';
import { AdvertisementCreateDto } from 'src/advertisements/dtos/requests/advertisement.create.dto';
import { AdvertisementDeleteDto } from 'src/advertisements/dtos/requests/advertisement.delete.dto';
import { AdvertisementUpdateDto } from 'src/advertisements/dtos/requests/advertisement.update.dto';
import { AdvertisementEntity } from 'src/advertisements/entities/advertisement.entity';
import {
  AdvertisementFindManyQuery,
  AdvertisementFindManyQueryResult,
} from 'src/advertisements/queries/advertisement.find.many.query/advertisement.find.many.query';
import {
  AdvertisementFindMyAdsQuery,
  AdvertisementFindMyAdsQueryResult,
} from 'src/advertisements/queries/advertisement.find.my.ads.query/advertisement.find.my.ads.query';
import { AdvertisementTypeEnum } from 'src/advertisements/types/enums/advertisement.type.enum';
import { BaseApiOkResponse } from 'src/commons/decorators/base.api.ok.response.decorator';
import { BasePaginationApiOkResponse } from 'src/commons/decorators/base.pagination.api.ok.response.decorator';
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

@ApiTags('AdvertisementModule')
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
    summary:
      'creating advertisement either for internal or external (admin only)',
  })
  @BaseApiOkResponse(AdvertisementCreateCommandResult, 'array')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }]))
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
  ): Promise<BaseResponse<AdvertisementCreateCommandResult>> {
    try {
      const command = Builder<AdvertisementCreateCommand>(
        AdvertisementCreateCommand,
        {
          ...dto,
          type: dto.type as unknown as AdvertisementTypeEnum,
          expired_date: new Date(dto.expired_date),
          logos: files.logo,
          current_user: currentUser,
        },
      ).build();

      const result = await this.commandBus.execute<
        AdvertisementCreateCommand,
        AdvertisementCreateCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.CREATED,
        'Advertisement Created Successfully!',
      );
    } catch (e) {
      throw this.advertisementControllerErrorMapper(e);
    }
  }

  @ApiOperation({
    summary: 'find advertisement either for internal or external (admin only)',
  })
  @BasePaginationApiOkResponse(AdvertisementEntity)
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
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
    summary: 'find personalized ads for curtain user',
  })
  @BasePaginationApiOkResponse(AdvertisementEntity)
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_client',
    'tender_finance',
    'tender_moderator',
    'tender_project_manager',
    'tender_project_supervisor',
    'tender_accounts_manager',
    'tender_cashier',
    'tender_ceo',
    'tender_consultant',
  )
  @Get('mine')
  async findMyAdvertisement(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() dto: AdvertisementFindManyQueryDto,
  ) {
    const builder = Builder<AdvertisementFindMyAdsQuery>(
      AdvertisementFindMyAdsQuery,
      {
        ...dto,
        user: currentUser,
      },
    );

    const { result, total } = await this.queryBus.execute<
      AdvertisementFindMyAdsQuery,
      AdvertisementFindMyAdsQueryResult
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
  @BaseApiOkResponse(AdvertisementUpdateCommandResult, 'object')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }]))
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('update')
  async update(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() dto: AdvertisementUpdateDto,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
    },
  ): Promise<BaseResponse<AdvertisementUpdateCommandResult>> {
    try {
      const command = Builder<AdvertisementUpdateCommand>(
        AdvertisementUpdateCommand,
        {
          ...dto,
          id: dto.advertisement_id,
          date: dto.date ? new Date(dto.date) : undefined,
          logos: files.logo,
          current_user: currentUser,
        },
      ).build();
      const result = await this.commandBus.execute<
        AdvertisementUpdateCommand,
        AdvertisementUpdateCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.OK,
        'Advertisement Updated Successfully!',
      );
    } catch (e) {
      throw this.advertisementControllerErrorMapper(e);
    }
  }

  @ApiOperation({
    summary: 'Deleting advertisement either for internal or external',
  })
  @BaseApiOkResponse(AdvertisementDeleteCommandResult, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Delete('delete')
  async delete(
    @Body() dto: AdvertisementDeleteDto,
  ): Promise<BaseResponse<AdvertisementDeleteCommandResult>> {
    try {
      const command = Builder<AdvertisementDeleteCommand>(
        AdvertisementDeleteCommand,
        { id: dto.advertisement_id },
      ).build();
      const result = await this.commandBus.execute<
        AdvertisementDeleteCommand,
        AdvertisementDeleteCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.OK,
        'Advertisement Deleted Successfully!',
      );
    } catch (e) {
      throw this.advertisementControllerErrorMapper(e);
    }
  }
}
