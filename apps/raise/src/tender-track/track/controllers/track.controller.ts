import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import {
  CreateTrackDto,
  FetchTrackFilterRequest,
  UpdateTrackDto,
} from '../dto/requests';
import { TrackService } from '../services/track.service';

@Controller('tender/track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('create')
  async create(@Body() request: CreateTrackDto) {
    const createdTrack = await this.trackService.create(request);
    return baseResponseHelper(
      createdTrack,
      HttpStatus.CREATED,
      'Track Created Successfully!',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('update')
  async update(@Body() request: UpdateTrackDto) {
    const updatedTrack = await this.trackService.update(request);
    return baseResponseHelper(
      updatedTrack,
      HttpStatus.CREATED,
      'Track Created Successfully!',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Get('fetch-all')
  async fetchAll(@Query() payload: FetchTrackFilterRequest) {
    const result = await this.trackService.fetchAll(payload);

    return manualPaginationHelper(
      result.data,
      result.total,
      payload.page || 1,
      payload.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }

  // @Post('track-section')
  // async createTrackSection(
  //   @Body() request: TracSectionkDto,
  // ): Promise<BaseResponse<track_section>> {
  //   const createdRecord = await this.tenderTrackService.createTrackSection(
  //     request,
  //   );
  //   return baseResponseHelper(
  //     createdRecord,
  //     HttpStatus.CREATED,
  //     'Tender Track Section created successfully',
  //   );
  // }

  // @Patch('track-section')
  // async udateTrackSection(
  //   @Body() request: UpdateTrackSection,
  //   @Query() id: string,
  // ): Promise<BaseResponse<track_section>> {
  //   const updatedRecord = await this.tenderTrackService.updateTrackSection(
  //     request,
  //     id,
  //   );
  //   return baseResponseHelper(
  //     updatedRecord,
  //     HttpStatus.OK,
  //     'Tender Track Section updated successfully',
  //   );
  // }

  // @Delete('track-section/:id')
  // async deleteTrackSection(@Param('id') id: string) {
  //   const deletedTrack = await this.tenderTrackService.deleteTrackSection(id);
  //   return baseResponseHelper(
  //     deletedTrack,
  //     HttpStatus.OK,
  //     'Tender Track Section deleted successfully',
  //   );
  // }

  // @Get('track-section')
  // async getAllTrackSections(@Query('track_id') track_id: string) {
  //   const trackSections = await this.tenderTrackService.getAllTrackSections(
  //     track_id,
  //   );
  //   return baseResponseHelper(
  //     trackSections,
  //     HttpStatus.OK,
  //     'Tender Track Sections',
  //   );
  // }
}
