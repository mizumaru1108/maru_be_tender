import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TrackRepository } from '../repositories/track.repository';
import {
  CreateTrackDto,
  FetchTrackFilterRequest,
  UpdateTrackDto,
} from '../dto/requests';
import { CreateTrackMapper, UpdateTrackMapper } from '../mappers';

@Injectable()
export class TrackService {
  constructor(private readonly trackRepo: TrackRepository) {}

  async create(request: CreateTrackDto) {
    const track = await this.trackRepo.findByName(request.name);
    if (track) {
      throw new BadRequestException(
        `Track with name of ${request.name} already exist!`,
      );
    }
    const createPayload = CreateTrackMapper(request);
    return await this.trackRepo.create(createPayload);
  }

  async update(request: UpdateTrackDto) {
    const track = await this.trackRepo.findById(request.id);
    if (!track) throw new NotFoundException('Track Not Found!');

    if (request.name && request.name !== track.name) {
      const track = await this.trackRepo.findByName(request.name, request.id);
      if (track) {
        throw new BadRequestException(
          `Track with name of ${request.name} already in use!`,
        );
      }
    }

    const updatePayload = UpdateTrackMapper(track, request);

    return await this.trackRepo.update(request.id, updatePayload);
  }

  async fetchAll(filter: FetchTrackFilterRequest) {
    return await this.trackRepo.fetchAll(filter);
  }

  // @UseGuards(JwtAuthGuard)
  // async createTrackSection(request: TracSectionkDto): Promise<track_section> {
  //   const { id, name, budget, track_id, section_id, is_leaf } = request;

  //   const trackRecordPayload: Prisma.track_sectionCreateArgs = {
  //     data: {
  //       id,
  //       name,
  //       budget,
  //       track_id,
  //       section_id,
  //       is_leaf,
  //     },
  //   };

  //   const createdRecord = await this.tenderTrackRepository.createTrackSection(
  //     trackRecordPayload,
  //   );
  //   return createdRecord;
  // }

  // @UseGuards(JwtAuthGuard)
  // async updateTrackSection(
  //   request: UpdateTrackSection,
  //   id: string,
  // ): Promise<track_section> {
  //   const { name, budget, track_id, section_id, is_leaf } = request;

  //   const updateTrackSectionRecordPayload: Prisma.track_sectionUpdateArgs = {
  //     data: {
  //       id,
  //       name,
  //       budget,
  //       track_id,
  //       section_id,
  //       is_leaf,
  //     },
  //     where: {},
  //   };

  //   const updatedRecord = await this.tenderTrackRepository.updateTrackSection(
  //     updateTrackSectionRecordPayload,
  //   );
  //   return updatedRecord;
  // }

  // @UseGuards(JwtAuthGuard)
  // async deleteTrackSection(id: string) {
  //   return await this.tenderTrackRepository.deleteTrackSection(id);
  // }

  // @UseGuards(JwtAuthGuard)
  // async getAllTrackSections(track_id: string) {
  //   return await this.tenderTrackRepository.getAllTrackSections(track_id);
  // }
}
