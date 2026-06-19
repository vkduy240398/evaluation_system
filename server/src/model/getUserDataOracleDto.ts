import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsString, IsEmail } from 'class-validator';

export class GetUserDataOracleDto {
  @ApiProperty()
  @IsNumberString()
  offset: number;

  @ApiProperty()
  @IsNumberString()
  next: number;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  departmentId: string;

  @ApiProperty()
  company: string;
}
export class AddUser {
  @ApiProperty()
  @IsNumber()
  employeeNumber: number;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  departmentId: string;

  @ApiProperty()
  @IsString()
  department: string;

  @ApiProperty()
  @IsString()
  companyId: string;

  @ApiProperty()
  @IsString()
  company: string;
  @ApiProperty()
  @IsString()
  username: string;
}
