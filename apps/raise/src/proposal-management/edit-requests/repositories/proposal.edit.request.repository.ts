import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProposalEditRequestRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(props: any, session?: PrismaService): Promise<any> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async update(props: any, session?: PrismaService): Promise<any> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findById(id: string, session?: PrismaService): Promise<any> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findMany(props: any, session?: PrismaService): Promise<any> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async countMany(props: any, session?: PrismaService): Promise<any> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
