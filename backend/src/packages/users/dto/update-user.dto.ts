import { PartialType } from '@nestjs/mapped-types';
import { CreateUserWithEmailDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserWithEmailDto) {}
