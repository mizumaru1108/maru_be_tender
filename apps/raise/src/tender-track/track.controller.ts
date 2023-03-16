import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { TracSectionkDto } from './dto/track.dto';
import { BaseResponse } from '../commons/dtos/base-response';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';
import { TenderTrackService } from './track.service';
import { track, track_section } from '@prisma/client';
import { UpdateTrackSection } from './dto/updateTrackSection.dto';

@Controller('track')
export class TenderTrackController {
  constructor(private readonly tenderTrackService: TenderTrackService) {}

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
