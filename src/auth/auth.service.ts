import { Inject, Injectable } from '@nestjs/common';
import { UserType } from './interfaces/user';
import { UserLogin, UserRegister } from './dto/user';
import { DRIZZLE } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase,
  ) {}
  async createUser(user: UserRegister) {
    const [newUser] = await this.db
      .insert(schema.users)
      .values({
        username: user.username,
        password: user.password,
        email: user.email,
      })
      .returning();
    return newUser;
  }
  async getUsers(): Promise<any> {
    const users = this.db.select().from(schema.users);
    return users;
  }
  async getUser(loginUser: UserLogin):Promise<any>{
    const user = this.db.select().from(schema.users).where(eq(schema.users.username,loginUser.username))
    return user
  }
}
