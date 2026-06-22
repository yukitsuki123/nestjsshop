import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import * as user from 'src/auth/dto/user';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  getUser(): string {
    return 'username';
  }
  @Post('/signin')
  getSignin(@Body() loginUser: user.UserLogin) {
    return loginUser;
  }
  @Post('/signup')
  async register(@Body() newUser: user.UserRegister) {
    this.authService.createUser(newUser);
    return 'signup';
  }
}
