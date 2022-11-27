import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { BaseErrorThrower } from '../../commons/helpers/base-error-thrower';
import { User, UserDocument } from '../../user/schema/user.schema';

@Injectable()
export class GsUserRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findUserById(id: string): Promise<User | null> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      const theError = BaseErrorThrower(error, 'find user by id');
      throw theError;
    }
  }

  async findOne(
    filterQuery?: FilterQuery<UserDocument>,
    projection?: ProjectionType<UserDocument>,
  ): Promise<User | null> {
    try {
      return await this.userModel.findOne(filterQuery, projection).exec();
    } catch (error) {
      const theError = BaseErrorThrower(error, 'find user by id');
      throw theError;
    }
  }

  async createUser() {
    try {
    } catch (error) {
      const theError = BaseErrorThrower(error, 'creating user');
      throw theError;
    }
  }
}
