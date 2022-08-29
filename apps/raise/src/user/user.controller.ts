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

import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { ClusterRoles } from '../auth/cluster-roles.decorator';
import { ClusterRolesGuard } from '../auth/cluster-roles.guard';
import { CurrentUser } from '../commons/decorators/current-user.decorator';
import { RoleEnum } from './enums/role-enum';
import { ICurrentUser } from './interfaces/current-user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('test-superadmin')
  @ClusterRoles(RoleEnum.SUPERADMIN)
  @UseGuards(JwtAuthGuard, ClusterRolesGuard)
  async testSuperAdmin(@CurrentUser() user: ICurrentUser) {
    return {
      statusCode: 200,
      user,
      message: 'This endpoint is for super admin only',
    };
  }

  @Post('test-cluster-admin')
  @ClusterRoles(RoleEnum.CLUSTERADMIN)
  @UseGuards(JwtAuthGuard, ClusterRolesGuard)
  async testClusterAdmin(@CurrentUser() user: ICurrentUser) {
    return {
      statusCode: 200,
      user,
      message: 'This endpoint is for cluster admin only',
    };
  }

  @Post('test-vendor')
  @ClusterRoles(RoleEnum.VENDOR)
  @UseGuards(JwtAuthGuard, ClusterRolesGuard)
  async testVendor(@CurrentUser() user: ICurrentUser) {
    return {
      statusCode: 200,
      user,
      message: 'This endpoint is for vendor only',
    };
  }

  @Post('test-operator')
  @ClusterRoles(RoleEnum.OPERATOR)
  @UseGuards(JwtAuthGuard, ClusterRolesGuard)
  async testOperator(@CurrentUser() user: ICurrentUser) {
    return {
      statusCode: 200,
      user,
      message: 'This endpoint is for operator only',
    };
  }

  @Post('test-nonprofit')
  @ClusterRoles(RoleEnum.NONPROFIT)
  @UseGuards(JwtAuthGuard, ClusterRolesGuard)
  async testNonProfit(@CurrentUser() user: ICurrentUser) {
    return {
      statusCode: 200,
      user,
      message: 'This endpoint is for non-profit only',
    };
  }

  @Post('test-donor')
  @ClusterRoles(RoleEnum.DONOR)
  @UseGuards(JwtAuthGuard, ClusterRolesGuard)
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

  @Get(':id')
  @SetMetadata('permission', ['user/profile', 'read'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  getOneUser(@Param('id') userId: string) {
    return this.userService.getOneUser({ _id: userId });
  }

  @Patch(':id')
  @SetMetadata('permission', ['user/update', 'write'])
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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
  async verifyEmailAuthZed(@Param('userId') verfUserId:string){
    return await this.userService.verifyEmailAuthZed(verfUserId);
  }

}
