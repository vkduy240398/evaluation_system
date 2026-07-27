import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class UserSearchRequestDto {
  @ApiProperty()
  @IsNumberString()
  offset: any;

  @ApiProperty()
  @IsNumberString()
  limit: any;

  @ApiProperty()
  @IsString()
  sortBy: any;

  @ApiProperty()
  @IsString()
  sortType: any;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty()
  @IsString()
  department: string;

  @ApiProperty()
  @IsString()
  division: string;

  @ApiProperty()
  @IsString()
  company: string;

  @ApiProperty()
  @IsString()
  nameAndEmail: string;

  @ApiProperty()
  @IsString()
  skill: string;

  @ApiProperty()
  @IsString()
  level: string;
}

export class DataAddUserOralce {
  @ApiProperty()
  company: string;
  @ApiProperty()
  companyId: string;
  @ApiProperty()
  department: string;
  @ApiProperty()
  departmentId: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  employeeNumber: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  key: string;
  @ApiProperty()
  username: string;
}
export class DataAddUserOracleDb {
  @ApiProperty()
  data: DataAddUserOralce;
}

export class FindUser {
  @ApiProperty()
  offset: string;
  @ApiProperty()
  limit: string;
  @ApiProperty()
  sortBy: string;
  @ApiProperty()
  sortType: string;
  @ApiProperty()
  nameAndEmail: string;
  @ApiProperty()
  department: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  division: string;
  @ApiProperty()
  current: string;
  @ApiProperty()
  search: string;
}

export class RequestDeleteUser {
  @ApiProperty({
    isArray: true,
    example: [2, 3, 4, 6, 7, 33],
  })
  selectedRowKeys: number[];
}

export class RequestUpdatedUser {
  @ApiProperty()
  company: number;
  @ApiProperty()
  department: number;
  @ApiProperty()
  division: number;
  @ApiProperty()
  flagSkillValue: number;
  @ApiProperty()
  level: number;
  @ApiProperty({
    isArray: true,
    example: [1, 2, 3],
  })
  listId: number[];
  @ApiProperty()
  listUserSelecteds: [{}];
  @ApiProperty()
  radioLevelValue: number;
}

export class RequestFindSubDepartment {
  @ApiProperty()
  departmentCodeAndName: any;
  @ApiProperty()
  offset: any;
  @ApiProperty()
  limit: any;
  @ApiProperty()
  sortBy: any;
  @ApiProperty()
  sortType: any;
}
