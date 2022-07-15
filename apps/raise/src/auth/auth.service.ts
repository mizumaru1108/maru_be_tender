import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async loginUser(email: string, password: string) {
    let isValid = false;

    const user = await this.usersService.getOneUser({ email });

    if (user && user.password === password) isValid = true;

    if (!isValid) {
      throw new HttpException('Invalid login details', 401);
    }

    return {
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
      },
      accessToken: this.generateToken(user)
    }
  }

  async registerUser(name: string, email: string, password: string) {
    const user = await this.usersService.getOneUser({ email });

    if (user) {
      throw new HttpException('A user account with that email already exists', 409);
    }

    try {
      const newUser = await this.usersService.createUser(name, email, password);

      return {
        user: {
          id: newUser._id,
          name: newUser?.name,
          email: newUser?.email,
        },
        accessToken: this.generateToken(newUser)
      }
    } catch (error) {
      throw new HttpException('An error occured while registering user', 500)
    }
  }

  generateToken(user: any) {
    return {
      accessToken: this.jwtService.sign({
        sub: user.id
      })
    }
  }
}