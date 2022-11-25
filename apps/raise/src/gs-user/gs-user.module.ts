import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/schema/user.schema';
import { GsUserController } from './controllers/gs-user.controller';
import { GsUserRepository } from './repositories/gs-user.repositories';
import { GsUserService } from './services/gs-user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [GsUserController],
  providers: [GsUserService, GsUserRepository],
  exports: [GsUserService, GsUserRepository],
})
export class GsUserModule {}
