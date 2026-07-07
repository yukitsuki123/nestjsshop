import { Inject, Injectable } from '@nestjs/common';
import { UserType } from './interfaces/user';
import { UserRegister } from './dto/user';
import { DRIZZLE } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}
  async createUser(user: UserRegister) {
    const [newUser] = await this.db
      .insert(schema.users)
      .values({
        username: user.username,
        password: user.password,
      })
      .returning();
    return newUser;
  }
  async getUser(): Promise<any> {
    const users = this.db.select().from(schema.users);
    return users;
  }
}
