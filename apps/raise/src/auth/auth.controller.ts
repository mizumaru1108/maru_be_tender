import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('fusion/login')
  async login(@Body() loginRequest: LoginRequestDto) {
    return await this.authService.loginUser(loginRequest);
  }

  // @Post('login')
  // async login(
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   return await this.authService.loginUser(email, password);
  // }

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.authService.registerUser(name, email, password);
  }
}
