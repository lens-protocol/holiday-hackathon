import { IsNotEmpty } from 'class-validator';

export class CreateUserWithEmailDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;

  @IsNotEmpty()
  timezone: string;
}

export class CreateUserWithPhoneDto {
  first_name: string;
  last_name: string;
  phone: string;
  password: string;

  @IsNotEmpty()
  timezone: string;
}
