import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthzedModule } from 'src/libs/authzed/authzed.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '10000s' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
