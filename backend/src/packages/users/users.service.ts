import { Injectable } from '@nestjs/common';
import { CreateUserWithEmailDto, CreateUserWithPhoneDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  async createUser(createUserDto: CreateUserWithEmailDto | CreateUserWithPhoneDto) {
    return this.prismaService.user.create({
      data: createUserDto,
    });
  }

  findVerifiedUsersByEmailArray(emails: string[], selectQuery?: Prisma.UserSelect) {
    return this.prismaService.user.findMany({
      where: { email: { in: emails }, is_email_verified: true },
      select: {
        id: true,
        email: true,
        ...selectQuery,
      },
    });
  }

  findVerifiedUsersByMobileNumberArray(mobileNumbers: string[], selectQuery?: Prisma.UserSelect) {
    return this.prismaService.user.findMany({
      where: { phone: { in: mobileNumbers }, is_phone_verified: true },
      select: {
        id: true,
        phone: true,
        ...selectQuery,
      },
    });
  }

  async checkVerifiedUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email, is_email_verified: true },
    });
    if (!user) {
      return false;
    }
    return true;
  }

  async checkVerifiedUserByMobileNumber(mobileNumber: string) {
    const user = await this.prismaService.user.findUnique({
      where: { phone: mobileNumber, is_phone_verified: true },
    });
    if (!user) {
      return false;
    }
    return true;
  }

  findUserById(userId: string, selectQuery?: Prisma.UserSelect) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
      select: selectQuery,
    });
  }

  async findUser(query: any) {
    return this.prismaService.user.findUnique({ where: query });
  }

  async findUserByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async findUserByKey(key: string, value: any) {
    const filterQuery = {};
    filterQuery[key] = value;
    return await this.prismaService.user.findFirst({ where: filterQuery });
  }

  async findUserByPhone(phone: string) {
    return this.prismaService.user.findUnique({ where: { phone } });
  }

  async updateUserById(id: string, updateUser: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUser,
    });
  }

  removeUserById(id: number) {
    return `This action removes a #${id} user`;
  }
}
