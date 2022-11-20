import { Injectable, UseGuards } from '@nestjs/common';
import { track, track_section, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { TracSectionkDto } from './dto/track.dto';
import { TenderTrackRepository } from './track.repository';
import { UpdateTrackSection } from './dto/updateTrackSection.dto';

@Injectable()
export class TenderTrackService {
  constructor(private readonly tenderTrackRepository: TenderTrackRepository) {}

  @UseGuards(JwtAuthGuard)
  async createTrackSection(request: TracSectionkDto): Promise<track_section> {
    const { id, name, budget, track_id, section_id } = request;

    const trackRecordPayload: Prisma.track_sectionCreateArgs = {
      data: {
        id,
        name,
        budget,
        track_id,
        section_id,
      },
    };

    const createdRecord = await this.tenderTrackRepository.createTrackSection(
      trackRecordPayload,
    );
    return createdRecord;
  }

  @UseGuards(JwtAuthGuard)
  async updateTrackSection(
    request: UpdateTrackSection,
    id: string,
  ): Promise<track_section> {
    const { name, budget, track_id, section_id } = request;

    const updateTrackSectionRecordPayload: Prisma.track_sectionUpdateArgs = {
      data: {
        id,
        name,
        budget,
        track_id,
        section_id,
      },
      where: {},
    };

    const updatedRecord = await this.tenderTrackRepository.updateTrackSection(
      updateTrackSectionRecordPayload,
    );
    return updatedRecord;
  }

  @UseGuards(JwtAuthGuard)
  async deleteTrackSection(id: string) {
    return await this.tenderTrackRepository.deleteTrackSection(id);
  }

  @UseGuards(JwtAuthGuard)
  async getAllTrackSections(track_id: string) {
    return await this.tenderTrackRepository.getAllTrackSections(track_id);
  }
}
