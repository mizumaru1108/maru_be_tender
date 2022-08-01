import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateHrDto } from './dto/create-hr.dto';
import { UpdateHrDto } from './dto/update-hr.dto';
import { Hr, HrDocument } from './schema/hr.schema';

@Injectable()
export class HrService {
  constructor(
    @InjectModel(Hr.name)
    private hrModel: Model<HrDocument>,
  ) {}

  async create(createRequest: CreateHrDto) {
    const createdHR = new this.hrModel(createRequest);
    return createdHR.save();
  }

  async getListAll() {
    return await this.hrModel.find();
  }

  async getById(hrId: string) {
    return await this.hrModel.findById(new Types.ObjectId(hrId));
  }

  async update(hrId: string, updateRequest: UpdateHrDto) {
    await this.hrModel.findByIdAndUpdate(
      new Types.ObjectId(hrId),
      updateRequest,
      { new: true },
    );
  }

  async delete(hrId: string) {
    return await this.hrModel.findByIdAndDelete(new Types.ObjectId(hrId));
  }
}
