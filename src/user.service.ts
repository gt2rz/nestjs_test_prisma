import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  async user(id: number): Promise<User | null> {
    return this.db.user.findUnique({
      where: { id },
    });
  }

  async users(): Promise<User[]> {
    return this.db.user.findMany();
  }

  async createUser(data: { name: string; email: string }): Promise<User> {
    return this.db.user.create({
      data,
    });
  }

  async updateUser(
    id: number,
    data: { name: string; email: string },
  ): Promise<User> {
    return this.db.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.db.user.delete({
      where: { id },
    });
  }
}
