import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { LoginRequestDto, RegisterRequestDto } from '../../auth/dtos';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { GSRegisterRequestDto } from '../dtos/requests/gs-register-request.dto';
import { GsAuthService } from '../services/gs-auth.service';

@Controller('gs/auth')
export class GsAuthController {
  constructor(private readonly gsAuthService: GsAuthService) {}

  @Post('login')
  async login(@Body() loginRequest: LoginRequestDto) {
    const submitLogin = await this.gsAuthService.login(loginRequest);
    return baseResponseHelper<any>(
      submitLogin,
      HttpStatus.CREATED,
      'Login Success!',
    );
  }

  @Post('register')
  async register(@Body() registerRequest: GSRegisterRequestDto) {
    const registeredUser = await this.gsAuthService.register(registerRequest);
  }
}
