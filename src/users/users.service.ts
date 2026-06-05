import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(user: User) {
    this.users.push(user);
    return user;
  }

  findByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  findAll() {
    return this.users;
  }
}
