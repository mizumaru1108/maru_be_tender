import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
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
  BannerCreateCommand as BannerCreateCommand,
  BannerCreateCommandResult as BannerCreateCommandResult,
} from 'src/banners/commands/banner.create/banner.create.command';
import {
  BannerDeleteCommand,
  BannerDeleteCommandResult,
} from 'src/banners/commands/banner.delete/banner.delete.command';
import {
  BannerUpdateCommand,
  BannerUpdateCommandResult,
} from 'src/banners/commands/banner.update/banner.update.command';
import { AdvertisementFindManyQueryDto as BannerFindManyQueryDto } from 'src/banners/dtos/queries/advertisement.find.many.query.dto';
import { BannerCreateDto as BannerCreateDto } from 'src/banners/dtos/requests/banner.create.dto';
import { BannerUpdateDto } from 'src/banners/dtos/requests/banner.update.dto';
import { BannerEntity } from 'src/banners/entities/banner.entity';
import {
  BannerFindByIdQuery,
  BannerFindByIdQueryResult,
} from 'src/banners/queries/banner.find.by.id.query/banner.find.by.id.query';
import {
  BannerFindManyQuery,
  BannerFindManyQueryResult,
} from 'src/banners/queries/banner.find.many.query/banner.find.many.query';
import {
  BannerFindMyAdsQuery,
  BannerFindMyAdsQueryResult,
} from 'src/banners/queries/banner.find.my.ads.query/banner.find.my.ads.query';
import { BannerFindManyResponse as BannerFindManyResponse } from 'src/banners/repositories/banner.repository';
import { BannerTypeEnum } from 'src/banners/types/enums/banner.type.enum';
import { BaseApiOkResponse } from 'src/commons/decorators/base.api.ok.response.decorator';
import { BasePaginationApiOkResponse } from 'src/commons/decorators/base.pagination.api.ok.response.decorator';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
import { BaseResponse } from 'src/commons/dtos/base-response';
import { baseResponseHelper } from 'src/commons/helpers/base-response-helper';
import { TenderRoles } from 'src/tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from 'src/tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from 'src/tender-auth/guards/tender-roles.guard';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';
import { PayloadErrorException } from 'src/tender-commons/exceptions/payload-error.exception';
import { PrismaInvalidForeignKeyException } from 'src/tender-commons/exceptions/prisma-error/prisma.invalid.foreign.key.exception';
import { manualPaginationHelper } from 'src/tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from 'src/tender-user/user/interfaces/current-user.interface';

@ApiTags('BannerModule')
@Controller('banners')
export class BannerHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  errorMapper(error: any) {
    if (
      error instanceof PayloadErrorException ||
      error instanceof DataNotFoundException
    ) {
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
    summary: 'Creating Banner either for internal or external (admin only)',
  })
  @BaseApiOkResponse(BannerCreateCommandResult, 'array')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }]))
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('create')
  async create(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() dto: BannerCreateDto,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
    },
  ): Promise<BaseResponse<BannerCreateCommandResult>> {
    try {
      const command = Builder<BannerCreateCommand>(BannerCreateCommand, {
        ...dto,
        type: dto.type as unknown as BannerTypeEnum,
        expired_date: new Date(dto.expired_date),
        logos: files.logo,
        current_user: currentUser,
      }).build();

      const result = await this.commandBus.execute<
        BannerCreateCommand,
        BannerCreateCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.CREATED,
        'Advertisement Created Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }

  @ApiOperation({
    summary: 'Find banner either for internal or external (admin only)',
  })
  @BasePaginationApiOkResponse(BannerFindManyResponse)
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Get()
  async findMany(@Query() dto: BannerFindManyQueryDto) {
    const builder = Builder<BannerFindManyQuery>(BannerFindManyQuery, {
      ...dto,
    });

    const { result, total } = await this.queryBus.execute<
      BannerFindManyQuery,
      BannerFindManyQueryResult
    >(builder.build());

    return manualPaginationHelper(
      result,
      total,
      dto.page || 1,
      dto.limit || 10,
      HttpStatus.OK,
      'Banner List Fetched Successfully!',
    );
  }

  @ApiOperation({
    summary: 'find personalized banner for curtain user',
  })
  @BasePaginationApiOkResponse(BannerEntity)
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
  async findMyBanners(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() dto: BannerFindManyQueryDto,
  ) {
    console.log('masuk mine');
    const builder = Builder<BannerFindMyAdsQuery>(BannerFindMyAdsQuery, {
      ...dto,
      user: currentUser,
    });

    const { result, total } = await this.queryBus.execute<
      BannerFindMyAdsQuery,
      BannerFindMyAdsQueryResult
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
    summary:
      'find advertisement by id either for internal or external (admin only)',
  })
  @BaseApiOkResponse(BannerEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_admin',
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
  @Get('/:banner_id')
  async findById(@Param('banner_id') banner_id: string) {
    try {
      const queries = Builder<BannerFindByIdQuery>(BannerFindByIdQuery, {
        banner_id,
      }).build();

      const result = await this.queryBus.execute<
        BannerFindByIdQuery,
        BannerFindByIdQueryResult
      >(queries);

      return baseResponseHelper(
        result.banner,
        HttpStatus.OK,
        'Banner Fetched Successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @ApiOperation({
    summary: 'updating banner either for internal or external',
  })
  @BaseApiOkResponse(BannerUpdateCommandResult, 'object')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }]))
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('update')
  async update(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() dto: BannerUpdateDto,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
    },
  ): Promise<BaseResponse<BannerUpdateCommandResult>> {
    try {
      const command = Builder<BannerUpdateCommand>(BannerUpdateCommand, {
        ...dto,
        id: dto.banner_id,
        expired_date: dto.expired_date ? new Date(dto.expired_date) : undefined,
        logos: files.logo,
        current_user: currentUser,
      }).build();
      const result = await this.commandBus.execute<
        BannerUpdateCommand,
        BannerUpdateCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.OK,
        'Banner Updated Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }

  @ApiOperation({
    summary: 'Deleting banner either for internal or external',
  })
  @BaseApiOkResponse(BannerDeleteCommandResult, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Delete('/:banner_id')
  async delete(
    @Param('banner_id') banner_id: string,
  ): Promise<BaseResponse<BannerDeleteCommandResult>> {
    try {
      const command = Builder<BannerDeleteCommand>(BannerDeleteCommand, {
        id: banner_id,
      }).build();
      const result = await this.commandBus.execute<
        BannerDeleteCommand,
        BannerDeleteCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.OK,
        'Banner Deleted Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }
}
