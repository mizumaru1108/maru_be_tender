import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../user/schema/user.schema';
import { Donor } from 'src/donor/schema/donor.schema';
import { GsUserRepository } from '../repositories/gs-user.repositories';
import {
  RegisterFromFusionAuthDto,
} from '../../user/dtos/register-from-fusion-auth.dto';
import { RoleEnum } from '../../user/enums/role-enum';

@Injectable()
export class GsUserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Donor') private readonly donorModel: Model<Donor>,
    private readonly gsUserRepository: GsUserRepository,
  ) {}

  async findUserById(id: string): Promise<User> {
    const user = await this.gsUserRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  async registerUser() {
    const createduser = await this.gsUserRepository.createUser();
    return createduser;
  }

  async registerFromFusion(request: RegisterFromFusionAuthDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: request.email
    })

    if (existingUser) {
      throw new ConflictException('A user account with that email already exists')
    }
    
    const newUser = new this.userModel({
      _id: request._id,
      firstname: request.firstname,
      email: request.email,
      lastname: request.lastname,
      type: RoleEnum.DONOR,
      organizationId: request.organizationId,
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
}
