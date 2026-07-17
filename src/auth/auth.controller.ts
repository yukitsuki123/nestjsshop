import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import * as user from 'src/auth/dto/user';
import { AuthService } from './auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard, Public } from './auth.guard';

@Controller('auth')
@UseInterceptors(new AuthInterceptor())
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AuthGuard)
  @Get()
  getUser(@Req() req: Request) {
    const userData = (req as any).user;
    return this.authService.getUser(userData);
  }
  @Public()
  @Post('/refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
  @Public()
  @Post('/signin')
  Signin(@Body() loginUser: user.UserLogin) {
    return this.authService.login(loginUser);
  }
  @Public()
  @Post('/signup')
  async register(@Body() newUser: user.UserRegister) {
    return this.authService.createUser(newUser);
  }
}
