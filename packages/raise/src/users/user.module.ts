import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema } from './schemas/user.schema';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';

import { AuthzedModule } from 'src/authzed/authzed.module';
@Module({
  imports: [
    AuthzedModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }
    ])
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}