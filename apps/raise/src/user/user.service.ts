import { Model } from 'mongoose';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FusionAuthClient } from '@fusionauth/typescript-client';
import { ConfigService } from '@nestjs/config';

import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  async createUser(name: string, email: string, password: string) {
    const newUser = new this.userModel({ name, email, password });
    const result = await newUser.save();
    return result;
  }

  async getAllUser() {
    const user = await this.userModel.find().exec();

    return user.map((user: UserDocument) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
    }));
  }

  async getOneUser(identifier: { email?: string; _id?: string }) {
    console.log('id', identifier);
    let user: {
      _id?: string;
      name?: string;
      email?: string;
      password?: string;
    } | null = {} as any;

    try {
      const document: UserDocument | null = await this.userModel.findOne(
        identifier,
      );
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

  async updateUser(userId: string, name: string, email: string) {
    const updates: { name?: string; email?: string } = {};

    if (name) updates.name = name;
    if (email) updates.email = email;

    const user = await this.userModel.findOneAndUpdate(
      { _id: userId },
      updates,
    );
    return user;
  }

  async updateAvatar(userId: string, imageUrl: string) {
    console.log(imageUrl);
    const fusionauth = new FusionAuthClient(
      this.configService.get('FUSIONAUTH_ADMIN_KEY', ''),
      this.configService.get('FUSIONAUTH_URL', ''),
      this.configService.get('FUSIONAUTH_TENANT_ID', ''),
    );
    console.log(this.configService.get('FUSIONAUTH_URL', ''));
    try {
      const patchUser = await fusionauth.patchUser(userId, {
        user: {
          imageUrl: imageUrl,
        },
      });
      console.log(patchUser);
      return {
        statusCode: 200,
        body: {
          message: 'Successfully changed profile',
        },
      };
    } catch (err) {
      return {
        statusCode: err.statusCode,
        body: {
          message: err.exception
            ? err.exception
            : `Sorry, we couldn't update your profile picture`,
        },
      };
    }
  }

  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ) {
    console.log(email);
    const fusionauth = new FusionAuthClient(
      this.configService.get('FUSIONAUTH_ADMIN_KEY', ''),
      this.configService.get('FUSIONAUTH_URL', ''),
      this.configService.get('FUSIONAUTH_TENANT_ID', ''),
    );
    console.log(this.configService.get('FUSIONAUTH_URL', ''));
    try {
      const changePassword = await fusionauth.changePasswordByIdentity({
        applicationId: 'b5ee66f1-cc1c-4185-97a9-e562ce8e98f6',
        loginId: email,
        currentPassword: currentPassword,
        password: newPassword,
      });
      console.log(changePassword);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Successfully changed password',
        }),
      };
    } catch (err) {
      return {
        statusCode: err.statusCode,
        body: {
          message: err.exception
            ? err.exception
            : `Sorry. The request contains an invalid or expired passwordId. You may need to request another one to be sent.`,
        },
      };
    }
  }
}
