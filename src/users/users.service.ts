import { CreateUser } from '@/shared/types/user';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export interface User extends CreateUser {
  id: string;
}

const users: User[] = [];

@Injectable()
export class UsersService {
  async save(user: CreateUser) {
    const newUser: User = { ...user, id: Date.now().toString() };

    users.push(newUser);

    return newUser;
  }

  async update(id: string, data: Partial<User>) {
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) throw new Error('User not found');

    const user = { ...users[index], ...data };

    users.splice(index, 1);
    users.push(user);

    return user;
  }

  async findByEmail(email: string) {
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  getPublicUserData(user: User) {
    return {
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  verifyPassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
