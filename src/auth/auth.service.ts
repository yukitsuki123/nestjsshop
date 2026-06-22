import { Injectable } from '@nestjs/common';
import { UserType } from './interfaces/user';
import { UserRegister } from './dto/user';
@Injectable()
export class AuthService {
  private readonly users: UserType[] = [
    { id: 1, username: 'yuki', password: '123456' },
    { id: 2, username: 'hajime', password: '123456' },
    { id: 3, username: 'suzuni', password: '123456' },
    { id: 4, username: 'makoto', password: '123456' },
    { id: 5, username: 'subaru', password: '123456' },
  ];
  createUser(user: UserRegister) {
    const newUser = {
      id: Math.floor(Math.random() * 100000),
      username: user.username,
      password: user.password,
    };
    this.users.push(newUser);
  }
}
