import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  // Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @SetMetadata('permission', ['user/list', 'read'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users;
  }

  @Get(':id')
  @SetMetadata('permission', ['user/profile', 'read'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  getOneUser(@Param('id') userId: string) {
    return this.usersService.getOneUser({ _id: userId });
  }

  @Patch(':id')
  @SetMetadata('permission', ['user/update', 'write'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async updateUser(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('email') email: string,
  ) {
    const user = await this.usersService.updateUser(id, name, email);
    return user;
  }

  @Patch('/updateUserProfile')
  async updateUserProfile(
    @Body('userId') userId: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    return await this.usersService.updateAvatar(userId, imageUrl);
  }

  // @Post('/changePassword')
  // async request(
  //   @Body('email') email: string,
  //   @Body('currentPassword') currentPassword: string,
  //   @Body('newPassword') newPassword: string,
  // ) {
  //   return await this.usersService.changePassword(
  //     email,
  //     currentPassword,
  //     newPassword,
  //   );
  // }
}
