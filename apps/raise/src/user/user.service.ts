import { Model } from 'mongoose';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FusionAuthClient } from '@fusionauth/typescript-client';
import { ConfigService } from '@nestjs/config';

import { User, UserDocument } from './schema/user.schema';
import {
  RegFromFusionAuthTenderDto,
  RegisterFromFusionAuthDto,
  RegisterFromFusionAuthTenderDto,
} from './dtos/register-from-fusion-auth.dto';
import { RoleEnum } from './enums/role-enum';
import { Donor } from 'src/donor/schema/donor.schema';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterTendersDto } from 'src/auth/dtos';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private configService: ConfigService,
    @InjectModel('Donor') private readonly donorModel: Model<Donor>,
    private prisma: PrismaService,
  ) {}

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
    const emailData = await this.prisma.user.findUnique({
      where: { email: request.email },
    });

    if (emailData && emailData.email) {
      throw new HttpException('Email already exist', 400);
    }

    const dataEmployees = JSON.stringify(request.employees_permissions);
    const dataEmp = JSON.parse(dataEmployees);
    try {
      const result = await this.prisma.user.create({
        data: {
          id: request.id,
          employee_name: request.employee_name,
          email: request.email,
          mobile_number: request.mobile_number,
          user_type_id: request.user_type_id,
          is_active: request.is_active,
          employees_permissions_employees_permissionsTouser: {
            create: dataEmp[0],
          },
        },
      });
      return result;
    } catch (error) {
      throw new HttpException('Data not recorded in database', 400);
    }
  }

  /** Create user and client for tender completed data */
  async registerFromFusionTender(request: RegisterFromFusionAuthTenderDto) {
    try {
      const result = await this.prisma.user.create({
        data: {
          id: request.id_,
          employee_name: request.employee_name,
          email: request.email,
          mobile_number: request.phone,
          client_data_client_data_user_idTouser: {
            create: {
              id: request.id!,
              license_number: request.license_number!,
              authority: request.authority,
              board_ofdec_file: request.board_ofdec_file,
              center_administration: request.center_administration,
              ceo_mobile: request.ceo_mobile,
              data_entry_mail: request.data_entry_mail,
              data_entry_name: request.data_entry_name,
              data_entry_mobile: request.data_entry_mobile,
              ceo_name: request.ceo_name,
              entity_mobile: request.entity_mobile,
              governorate: request.governorate,
              region: request.region,
              headquarters: request.headquarters,
              entity: request.entity,
              date_of_esthablistmen: request.date_of_esthablistmen,
              license_file: request.license_file,
              license_expired: request.license_expired,
              license_issue_date: request.license_issue_date,
              num_of_beneficiaries: request.num_of_beneficiaries,
              website: request.website,
              twitter_acount: request.twitter_acount,
              num_of_employed_facility: request.num_of_employed_facility,
              phone: request.phone,
              client_field: request.client_field,
              vat: request.vat,
            },
          },
          bank_information: {
            create: request.bank_informations,
          },
        },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new Error('something went wrong!');
    }
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

  async verifyEmailAuthZed(verfUserId: string) {}
}
