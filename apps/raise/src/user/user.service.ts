import { Model } from 'mongoose';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FusionAuthClient } from '@fusionauth/typescript-client';
import { ConfigService } from '@nestjs/config';

import { User, UserDocument } from './schema/user.schema';
import { RegFromFusionAuthTenderDto, RegisterFromFusionAuthDto } from './dtos/register-from-fusion-auth.dto';
import { RoleEnum } from './enums/role-enum';
import { Donor } from 'src/donor/schema/donor.schema';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private configService: ConfigService,
    @InjectModel('Donor') private readonly donorModel: Model<Donor>,
    private prisma: PrismaService,
  ) { }

  async registerFromFusion(request: RegisterFromFusionAuthDto): Promise<User> {
    const newUser = new this.userModel({
      _id: request._id,
      firstname: request.firstname,
      email: request.email,
      lastname: request.lastname,
      type: RoleEnum.DONOR,
    });

    const donor = new this.donorModel({
      ownerUserId: request._id,
      firstname: request.firstname,
      email: request.email,
      lastname: request.lastname,
      mobile: request.mobile,
      country: request.country,
      state: request.state,
      address: request.address,
    });

    await donor.save();
    const result = await newUser.save();

    return result;
  }
  /** Create user and client for tender */
  async regFromFusionTender(request: RegFromFusionAuthTenderDto) {
    const result = await this.prisma.user.create({
      data: {
        id: request.id,
        employee_name: request.employee_name,
        email: request.email,
        mobile_number: request.mobile_number,
        user_type_id: request.user_type_id!
      }
    });

    return result;
  }

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
    // console.log('id', identifier);
    let user: {
      _id?: string;
      name?: string;
      email?: string;
      password?: string;
      type?: string;
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
      type: user?.type,
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

  async verifyEmailAuthZed(verfUserId: string) {

  }
}
