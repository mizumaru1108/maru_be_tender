import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsEmail,
  IsIn,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employee_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsBoolean()
  activate_user: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employee_path: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user_roles: string;

  // @ApiProperty()
  // @IsString()
  // @IsIn(
  //   [
  //     'ACCOUNTS_MANAGER',
  //     'ADMIN',
  //     'CEO',
  //     'CASHIER',
  //     'CLIENT',
  //     'CONSULTANT',
  //     'FINANCE',
  //     'MODERATOR',
  //     'PROJECT_MANAGER',
  //     'PROJECT_SUPERVISOR',
  //   ],
  //   {
  //     message:
  //       'Roles should be or ACCOUNTS_MANAGER or ADMIN or CEO or CASHIER or CLIENT or CONSULTANT or FINANCE or MODERATOR or PROJECT_MANAGER or PROJECT_SUPERVISOR',
  //   },
  // )
  // user_roles:
  //   | 'ACCOUNTS_MANAGER'
  //   | 'ADMIN'
  //   | 'CEO'
  //   | 'CASHIER'
  //   | 'CLIENT'
  //   | 'CONSULTANT'
  //   | 'FINANCE'
  //   | 'MODERATOR'
  //   | 'PROJECT_MANAGER'
  //   | 'PROJECT_SUPERVISOR';
}
