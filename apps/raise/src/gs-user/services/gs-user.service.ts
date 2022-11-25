import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../user/schema/user.schema';
import { GsUserRepository } from '../repositories/gs-user.repositories';

@Injectable()
export class GsUserService {
  constructor(private readonly gsUserRepository: GsUserRepository) {}

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
  // async createUser() {
  //   const createduser = await this.gsUserRepository.createUser();
  //   return createduser;
  // }
}
