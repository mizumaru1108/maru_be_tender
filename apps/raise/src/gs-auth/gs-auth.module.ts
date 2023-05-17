import { Module } from '@nestjs/common';
import { GsUserModule } from '../gs-user/gs-user.module';
import { GsAuthController } from './controllers/gs-auth.controller';
import { GsAuthService } from './services/gs-auth.service';
import {
  Organization,
  OrganizationSchema,
} from 'src/organization/schema/organization.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [GsAuthController],
  providers: [GsAuthService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
    ]),
    GsUserModule,
  ],
})
export class GsAuthModule {}
