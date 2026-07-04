// Database Layer

import { prisma } from "../lib/prisma";

export class AuthService {
  static async registerUser(
    email: string,
    password: string,
    name: string,
    role: string,
  ) {
    const user = await prisma.user.create({
      data: {
        email,
        password,
        profile: {
          create: {
            name,
            role,
          },
        },
      },
      include: {
        profile: true,
      },
    });
    return user;
  }

  static async findUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
    return user;
  }

  static async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
    return user;
  }
}
