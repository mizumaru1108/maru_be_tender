import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  SetMetadata,
  // Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { CurrentUser } from '../commons/decorators/current-user.decorator';
import { AuthzedService } from '../libs/authzed/authzed.service';
import { Permission } from '../libs/authzed/enums/permission.enum';

import { ICurrentUser } from './interfaces/current-user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authzedService: AuthzedService,
  ) {}

  @Post('test-superadmin')
  @UseGuards(JwtAuthGuard)
  async testSuperAdmin(@CurrentUser() user: ICurrentUser) {
    return {
      statusCode: 200,
      user,
      message: 'This endpoint is for super admin only',
    };
  }

  @Post('test-cluster-admin')
  @UseGuards(JwtAuthGuard)
  async testClusterAdmin(@CurrentUser() user: ICurrentUser) {
    return {
      statusCode: 200,
      user,
      message: 'This endpoint is for cluster admin only',
    };
  }

  @Post('test-vendor')
  @UseGuards(JwtAuthGuard)
  async testVendor(@CurrentUser() user: ICurrentUser) {
    return {
      statusCode: 200,
      user,
      message: 'This endpoint is for vendor only',
    };
  }

  @Post('test-operator')
  @UseGuards(JwtAuthGuard)
  async testOperator(@CurrentUser() user: ICurrentUser) {
    return {
      statusCode: 200,
      user,
      message: 'This endpoint is for operator only',
    };
  }

  @Post('test-nonprofit')
  @UseGuards(JwtAuthGuard)
  async testNonProfit(@CurrentUser() user: ICurrentUser) {
    return {
      statusCode: 200,
      user,
      message: 'This endpoint is for non-profit only',
    };
  }

  @Post('test-donor')
  @UseGuards(JwtAuthGuard)
  async testDonor(@CurrentUser() user: ICurrentUser) {
    return {
      statusCode: 200,
      user,
      message: 'This endpoint is for donors only',
    };
  }

  @Get()
  @SetMetadata('permission', ['user/list', 'read'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async getAllUser() {
    const user = await this.userService.getAllUser();
    return user;
  }

  @Permissions(Permission.PM)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('authzed-tests')
  async authzedTesting(@CurrentUser() user: ICurrentUser, @Body() body: any) {
    console.log('body', body);
    console.log('user', user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOneUser(@Param('id') userId: string) {
    return this.userService.getOneUser({ _id: userId });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('email') email: string,
  ) {
    const user = await this.userService.updateUser(id, name, email);
    return user;
  }

  @Patch('/updateUserProfile')
  async updateUserProfile(
    @Body('userId') userId: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    return await this.userService.updateAvatar(userId, imageUrl);
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

  // @Post('/resetPassword')
  // async resetPassword(@Body('email') email: string) {
  //   return this.userService.resetPassword(email);
  // }

  @Post('/verifyEmailAuthZed/:verfUserId')
  async verifyEmailAuthZed(@Param('userId') verfUserId: string) {
    return await this.userService.verifyEmailAuthZed(verfUserId);
  }
}
