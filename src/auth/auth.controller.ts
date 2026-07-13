import { Body, Controller, Get, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import * as user from 'src/auth/dto/user';
import { AuthService } from './auth.service';
import { AuthInterceptor } from './auth.interceptor';

@Controller('auth')
@UseInterceptors(new AuthInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  getUser(): any {
    return this.authService.getUsers();
  }
  @Post('/signin')
  getSignin(@Body() loginUser: user.UserLogin) {
    return this.authService.getUser(loginUser);
  }
  @Post('/signup')
  async register(@Body() newUser: user.UserRegister) {
    return this.authService.createUser(newUser);
  }
}
