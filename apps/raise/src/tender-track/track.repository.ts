import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { track, track_section, Prisma } from '@prisma/client';
import _ from 'lodash';
import { ROOT_LOGGER } from '../libs/root-logger';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenderTrackRepository {
  // private readonly logger = ROOT_LOGGER.child({
  //   'log.logger': TenderTrackRepository.name,
  // });
  // constructor(private readonly prismaService: PrismaService) {}
  // /* save trackSection and increment Parents budget */
  // async createTrackSection(createPayload: Prisma.track_sectionCreateArgs) {
  //   this.logger.debug('create new track record...');
  //   try {
  //     if (!createPayload.data.is_leaf && createPayload.data.budget > 0)
  //       throw new BadRequestException(
  //         'can not create section with budget unless it is leaf',
  //       );
  //     await this.incrementParentsBudget(
  //       createPayload,
  //       createPayload.data.budget as number,
  //     );
  //     return await this.prismaService.track_section.create(createPayload);
  //   } catch (error) {
  //     console.trace(error);
  //     throw new InternalServerErrorException(
  //       'Something went wrong when saving new track record!',
  //     );
  //   }
  // }
  // /** update a trackSection and update the parents budget */
  // async updateTrackSection(updatePayload: Prisma.track_sectionUpdateArgs) {
  //   this.logger.debug('update a track record...');
  //   try {
  //     const oldSection = await this.prismaService.track_section.findUnique({
  //       where: {
  //         id: updatePayload.data.id as string,
  //       },
  //     });
  //     if (!oldSection)
  //       throw new NotFoundException('there is no such recrod to update');
  //     if (!oldSection.is_leaf && (updatePayload.data.budget as number) > 0)
  //       throw new BadRequestException(
  //         'can not create section with budget unless it is leaf',
  //       );
  //     const newBudget: number = (updatePayload.data.budget as number) || 0;
  //     const budgetDiff = Math.abs(newBudget - oldSection.budget);
  //     if (newBudget > oldSection.budget)
  //       await this.incrementParentsBudget(updatePayload, budgetDiff);
  //     if (newBudget < oldSection.budget && newBudget !== 0) {
  //       await this.decrementParentsBudget(updatePayload, newBudget);
  //     }
  //     return await this.prismaService.track_section.update({
  //       where: {
  //         id: updatePayload.data.id as string,
  //       },
  //       data: {
  //         budget: updatePayload.data.budget,
  //         name: updatePayload.data.name,
  //       },
  //     });
  //   } catch (error) {
  //     console.trace(error);
  //     throw new InternalServerErrorException(
  //       'Something went wrong when updateing new track record!',
  //     );
  //   }
  // }
  // /** get all track sections */
  // async deleteTrackSection(id: string) {
  //   const isParent = await this.prismaService.track_section.findFirst({
  //     where: { section_id: id },
  //   });
  //   if (isParent)
  //     throw new BadRequestException('you can not delete a parent section');
  //   const section = await this.prismaService.track_section.findUnique({
  //     where: { id },
  //   });
  //   if (!section) throw new NotFoundException('no section with this id');
  //   await this.decrementParentsBudget(
  //     { data: section } as Prisma.track_sectionUpdateArgs,
  //     section.budget as number,
  //   );
  //   await this.prismaService.track_section.delete({
  //     where: {
  //       id,
  //     },
  //   });
  // }
  // async getAllTrackSections(track_id: string) {
  //   const sections = (await this.prismaService.track_section.findMany({
  //     where: { track_id },
  //   })) as any;
  //   for (let i = 0; i < sections.length; i++) {
  //     // add children to every item
  //     sections[i].children = [];
  //   }
  //   this.buildTree(sections, null);
  //   return sections;
  // }
  // async buildTree(sections: any, item: any) {
  //   if (item) {
  //     // if item then have parent
  //     for (let i = 0; i < sections.length; i++) {
  //       // parses the entire tree in order to find the parent
  //       if (String(sections[i].id) === String(item.section_id)) {
  //         // bingo!
  //         sections[i].children.push(item); // add the child to his parent
  //         break;
  //       } else this.buildTree(sections[i].children, item); // if item doesn't match but tree have children then parses children again to find item parent
  //     }
  //   } else {
  //     // if no item then is a root item, multiple root items are supported
  //     let idx = 0;
  //     while (idx < sections.length)
  //       if (sections[idx].section_id)
  //         this.buildTree(sections, sections.splice(idx, 1)[0]);
  //       // if have parent then remove it from the array to relocate it to the right place
  //       else idx++; // if doesn't have parent then is root and move it to the next object
  //   }
  // }
  // async incrementParentsBudget(
  //   section: Prisma.track_sectionCreateArgs | Prisma.track_sectionUpdateArgs,
  //   budget: number,
  // ) {
  //   if (!section.data?.section_id) {
  //     // await this.prismaService.track.update({
  //     //   where: {
  //     //     id: section.data.track_id as string,
  //     //   },
  //     //   data: {
  //     //     budget: { increment: budget },
  //     //   },
  //     // });
  //     return;
  //   }
  //   await this.prismaService.track_section.update({
  //     where: {
  //       id: section.data.section_id as string,
  //     },
  //     data: {
  //       budget: { increment: budget },
  //     },
  //   });
  //   const parentSection = await this.prismaService.track_section.findUnique({
  //     where: {
  //       id: section.data.section_id as string,
  //     },
  //   });
  //   await this.incrementParentsBudget(
  //     { data: parentSection } as Prisma.track_sectionCreateArgs,
  //     budget,
  //   );
  // }
  // async decrementParentsBudget(
  //   section: Prisma.track_sectionUpdateArgs,
  //   budget: number,
  // ) {
  //   if (!section.data.section_id) {
  //     await this.prismaService.track.update({
  //       where: {
  //         id: section.data.track_id as string,
  //       },
  //       data: {
  //         budget: { decrement: budget },
  //       },
  //     });
  //     return;
  //   }
  //   console.log(section.data.section_id);
  //   await this.prismaService.track_section.update({
  //     where: {
  //       id: section.data.section_id as string,
  //     },
  //     data: {
  //       budget: { decrement: budget },
  //     },
  //   });
  //   const parentSection = await this.prismaService.track_section.findUnique({
  //     where: {
  //       id: section.data.section_id as string,
  //     },
  //   });
  //   await this.decrementParentsBudget(
  //     { data: parentSection } as Prisma.track_sectionUpdateArgs,
  //     budget,
  //   );
  // }
}
