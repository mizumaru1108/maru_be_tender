import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { UserSchema } from './schema/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { AuthzedModule } from 'src/authzed/authzed.module';
@Module({
  imports: [
    AuthzedModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ConfigModule,
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
