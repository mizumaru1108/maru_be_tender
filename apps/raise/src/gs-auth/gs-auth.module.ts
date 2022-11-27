import { Module } from '@nestjs/common';
import { GsUserModule } from '../gs-user/gs-user.module';
import { GsAuthController } from './controllers/gs-auth.controller';
import { GsAuthService } from './services/gs-auth.service';

@Module({
  controllers: [GsAuthController],
  providers: [GsAuthService],
  imports: [GsUserModule],
})
export class GsAuthModule {}
