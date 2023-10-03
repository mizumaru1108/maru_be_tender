import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
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
  TrackSectionCreateCommand,
  TrackSectionCreateCommandResult,
} from '../commands/track.section.create/track.section.create.command';
import { TrackSectionsCreateDto } from '../dtos/requests/track.sections.create.dto';
import { TrackSectionEntity } from '../entities/track.section.entity';

@ApiTags('TrackModule/TrackSection')
@Controller('tender/track-sections')
export class TrackSectionHttpController {
  constructor(private readonly commandBus: CommandBus) {}

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
  @BaseApiOkResponse(TrackSectionEntity, 'array')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('save')
  async save(
    @Body() dto: TrackSectionsCreateDto,
  ): Promise<BaseResponse<TrackSectionEntity[]>> {
    try {
      const command = Builder<TrackSectionCreateCommand>(
        TrackSectionCreateCommand,
        { sections: dto.sections },
      ).build();

      const { data } = await this.commandBus.execute<
        TrackSectionCreateCommand,
        TrackSectionCreateCommandResult
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

  // @ApiOperation({
  //   summary:
  //     'find advertisement by id either for internal or external (admin only)',
  // })
  // @BaseApiOkResponse(BannerEntity, 'object')
  // @UseGuards(TenderJwtGuard, TenderRolesGuard)
  // @TenderRoles(
  //   'tender_admin',
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
  // @Get('/:banner_id')
  // async findById(@Param('banner_id') banner_id: string) {
  //   try {
  //     const queries = Builder<BannerFindByIdQuery>(BannerFindByIdQuery, {
  //       banner_id,
  //     }).build();

  //     const result = await this.queryBus.execute<
  //       BannerFindByIdQuery,
  //       BannerFindByIdQueryResult
  //     >(queries);

  //     return baseResponseHelper(
  //       result.banner,
  //       HttpStatus.OK,
  //       'Banner Fetched Successfully!',
  //     );
  //   } catch (error) {
  //     throw this.errorMapper(error);
  //   }
  // }

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
