import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
