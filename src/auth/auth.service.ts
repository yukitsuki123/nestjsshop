import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserType } from './interfaces/user';
import { UserLogin, UserRegister } from './dto/user';
import { DRIZZLE } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase,
    private readonly jwtService: JwtService,
  ) {}
  async createUser(user: UserRegister) {
    const existed_user = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, user.email));
    if (existed_user.length > 0) {
      throw new ConflictException('Email Already taken');
    }

    const hashpassword = await bcrypt.hash(user.password, 10);

    const [newUser] = await this.db
      .insert(schema.users)
      .values({
        username: user.username,
        password: hashpassword,
        email: user.email,
      })
      .returning();
    const tokens = this.generateTokens(newUser.id, newUser.email);
    return tokens;
  }
  async login(loginUser: UserLogin): Promise<any> {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, loginUser.email));
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const hashpass = await bcrypt.compare(loginUser.password, user.password);
    if (!hashpass) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = this.generateTokens(user.id, user.email);
    return token;
  }
  async getUser(userData: JwtPayload): Promise<any> {
    const [user] = await this.db
      .select({
        email: schema.users.email,
        username: schema.users.username,
      })
      .from(schema.users)
      .where(eq(schema.users.id, userData.sub));
    return user;
  }

  async getUsers(userId: any): Promise<any> {
    const users = this.db.select().from(schema.users);
    return users;
  }
  async refreshToken(refreshToken: string) {
    let payload: { sub: string; email: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, payload.sub));
    return this.generateTokens(user.id, user.email);
  }

  private async generateTokens(userId: string, username: string) {
    const payload = { sub: userId, username };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: (process.env.JWT_EXPIRES_IN ||
        '15m') as JwtSignOptions['expiresIn'],
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
        '7d') as JwtSignOptions['expiresIn'],
    });

    return { accessToken, refreshToken };
  }
}
