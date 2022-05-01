import { Model } from 'mongoose';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(name: string, email: string, password: string) {
    const newUser = new this.userModel({ name, email, password });
    const result = await newUser.save();
    return result;
  }

  async getAllUsers() {
    const users = await this.userModel.find().exec();

    return users.map((user: UserDocument) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
    }));
  }

  async getOneUser(identifier: { email?: string, _id?: string }) {
    console.log('id', identifier);
    let user: {
      _id?: string,
      name?: string,
      email?: string,
      password?: string
    } | null = {} as any;

    try {
      const document: UserDocument | null = await this.userModel.findOne(identifier);
      user = document;
    } catch (error) {
      throw new HttpException('Failure while fetching user', 500);
    }

    if (!user) {
      throw new HttpException('User does not exist', 404);
    }

    return {
      id: user?._id,
      name: user?.name,
      email: user?.email,
      password: user?.password,
    };
  }

  async updateUser(
    userId: string,
    name: string,
    email: string,
  ) {
    const updates: { name?: string, email?:string } = {};

    if (name) updates.name = name;
    if (email) updates.email = email;

    const user = await this.userModel.findOneAndUpdate({_id: userId }, updates);
    return user;
  }
}