import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { BaseApiOkResponse } from 'src/commons/decorators/base.api.ok.response.decorator';
import { BaseResponse } from 'src/commons/dtos/base-response';
import { baseResponseHelper } from 'src/commons/helpers/base-response-helper';
import { TenderRoles } from 'src/tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from 'src/tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from 'src/tender-auth/guards/tender-roles.guard';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';
import { PayloadErrorException } from 'src/tender-commons/exceptions/payload-error.exception';
import { PrismaInvalidForeignKeyException } from 'src/tender-commons/exceptions/prisma-error/prisma.invalid.foreign.key.exception';
import {
  TrackSectionSaveCommand,
  TrackSectionSaveCommandResult,
} from '../commands/track.section.save/track.section.save.command';
import { TrackSectionEntity } from '../entities/track.section.entity';
import {
  TrackSectionFindByIdQuery,
  TrackSectionFindByIdQueryResult,
} from '../queries/track.section.find.by.id.query';
import { TrackSectionFindByIdQueryDto } from '../dtos/queries/track.section.find.by.id.query.dto';
import {
  TrackSectionSaveDto,
  TrackSectionsSaveDto,
} from '../dtos/requests/track.sections.save.dto';

@ApiTags('TrackModule/TrackSection')
@Controller('tender/track-sections')
export class TrackSectionHttpController {
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
    summary: 'Creating track section (admin only)',
  })
  @BaseApiOkResponse(TrackSectionSaveDto, 'array')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('save')
  async save(
    @Body() dto: TrackSectionsSaveDto,
  ): Promise<BaseResponse<TrackSectionSaveDto[]>> {
    try {
      const command = Builder<TrackSectionSaveCommand>(
        TrackSectionSaveCommand,
        { sections: dto.sections },
      ).build();

      const { data } = await this.commandBus.execute<
        TrackSectionSaveCommand,
        TrackSectionSaveCommandResult
      >(command);

      return baseResponseHelper(
        data.created_sections,
        HttpStatus.CREATED,
        'Section Saved Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }

  // @ApiOperation({
  //   summary: 'Find banner either for internal or external (admin only)',
  // })
  // @BasePaginationApiOkResponse(BannerFindManyResponse)
  // @UseGuards(TenderJwtGuard, TenderRolesGuard)
  // @TenderRoles('tender_admin')
  // @Get()
  // async findMany(@Query() query: BannerFindManyQueryDto) {
  //   const builder = Builder<BannerFindManyQuery>(BannerFindManyQuery, {
  //     ...query,
  //     expired_at: query.current_time,
  //   });

  //   const { result, total } = await this.queryBus.execute<
  //     BannerFindManyQuery,
  //     BannerFindManyQueryResult
  //   >(builder.build());

  //   return manualPaginationHelper(
  //     result,
  //     total,
  //     query.page || 1,
  //     query.limit || 10,
  //     HttpStatus.OK,
  //     'Banner List Fetched Successfully!',
  //   );
  // }

  // @ApiOperation({
  //   summary: 'find personalized banner for curtain user',
  // })
  // @BasePaginationApiOkResponse(BannerEntity)
  // @UseGuards(TenderJwtGuard, TenderRolesGuard)
  // @TenderRoles(
  //   'tender_client',
  //   'tender_finance',
  //   'tender_moderator',
  //   'tender_project_manager',
  //   'tender_project_supervisor',
  //   'tender_accounts_manager',
  //   'tender_cashier',
  //   'tender_ceo',
  //   'tender_consultant',
  // )
  // @Get('mine')
  // async findMyBanners(
  //   @CurrentUser() currentUser: TenderCurrentUser,
  //   @Query() query: BannerFindMineQueryDto,
  // ) {
  //   const builder = Builder<BannerFindMyAdsQuery>(BannerFindMyAdsQuery, {
  //     ...query,
  //     user: currentUser,
  //     expired_at: query.current_time,
  //   });

  //   const { result, total } = await this.queryBus.execute<
  //     BannerFindMyAdsQuery,
  //     BannerFindMyAdsQueryResult
  //   >(builder.build());

  //   return manualPaginationHelper(
  //     result,
  //     total,
  //     query.page || 1,
  //     query.limit || 10,
  //     HttpStatus.OK,
  //     'Banner List Fetched Successfully!',
  //   );
  // }

  @ApiOperation({ summary: 'find track sections' })
  @BaseApiOkResponse(TrackSectionEntity, 'object')
  @Get('/:section_id')
  async findById(
    @Param('section_id') section_id: string,
    @Query() queries: TrackSectionFindByIdQueryDto,
  ) {
    try {
      const query = Builder<TrackSectionFindByIdQuery>(
        TrackSectionFindByIdQuery,
        {
          id: section_id,
          ...queries,
        },
      ).build();

      const { data } = await this.queryBus.execute<
        TrackSectionFindByIdQuery,
        TrackSectionFindByIdQueryResult
      >(query);

      return baseResponseHelper(
        data,
        HttpStatus.OK,
        'Sections Fetched Successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  // @ApiOperation({
  //   summary: 'updating banner either for internal or external',
  // })
  // @BaseApiOkResponse(BannerUpdateCommandResult, 'object')
  // @UseInterceptors(FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }]))
  // @UseGuards(TenderJwtGuard, TenderRolesGuard)
  // @TenderRoles('tender_admin')
  // @Patch('update')
  // async update(
  //   @CurrentUser() currentUser: TenderCurrentUser,
  //   @Body() dto: BannerUpdateDto,
  //   @UploadedFiles()
  //   files: {
  //     logo?: Express.Multer.File[];
  //   },
  // ): Promise<BaseResponse<BannerUpdateCommandResult>> {
  //   try {
  //     const command = Builder<BannerUpdateCommand>(BannerUpdateCommand, {
  //       ...dto,
  //       id: dto.banner_id,
  //       expired_date: dto.expired_date ? new Date(dto.expired_date) : undefined,
  //       logos: files.logo,
  //       current_user: currentUser,
  //     }).build();
  //     const result = await this.commandBus.execute<
  //       BannerUpdateCommand,
  //       BannerUpdateCommandResult
  //     >(command);

  //     return baseResponseHelper(
  //       result,
  //       HttpStatus.OK,
  //       'Banner Updated Successfully!',
  //     );
  //   } catch (e) {
  //     throw this.errorMapper(e);
  //   }
  // }

  // @ApiOperation({
  //   summary: 'Deleting banner either for internal or external',
  // })
  // @BaseApiOkResponse(BannerDeleteCommandResult, 'object')
  // @UseGuards(TenderJwtGuard, TenderRolesGuard)
  // @TenderRoles('tender_admin')
  // @Delete('/:banner_id')
  // async delete(
  //   @Param('banner_id') banner_id: string,
  // ): Promise<BaseResponse<BannerDeleteCommandResult>> {
  //   try {
  //     const command = Builder<BannerDeleteCommand>(BannerDeleteCommand, {
  //       id: banner_id,
  //     }).build();
  //     const result = await this.commandBus.execute<
  //       BannerDeleteCommand,
  //       BannerDeleteCommandResult
  //     >(command);

  //     return baseResponseHelper(
  //       result,
  //       HttpStatus.OK,
  //       'Banner Deleted Successfully!',
  //     );
  //   } catch (e) {
  //     throw this.errorMapper(e);
  //   }
  // }
}
