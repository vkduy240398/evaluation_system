import { ApiProperty } from '@nestjs/swagger';

export class GetUserDataOracleDb {
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

export class ResultsAddUserOracle {
  @ApiProperty()
  message: string;
}
// =======================================================================
export class Company {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}

export class Department {
  @ApiProperty()
  id: number;
  @ApiProperty()
  code: string;
  @ApiProperty()
  name: string;
}
export class Division {
  @ApiProperty()
  id: number;
  @ApiProperty()
  code: string;
  @ApiProperty()
  name: string;
}

export class Roles {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}
export class RolesCondition {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}
export class ListUsers {
  @ApiProperty()
  company: Company;
  @ApiProperty()
  department: Department;
  @ApiProperty()
  division: Division;
  @ApiProperty()
  email: string;
  @ApiProperty()
  employeeNumber: string;
  @ApiProperty()
  flagSkill: number;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  id: number;
  @ApiProperty()
  level: number;
  @ApiProperty({ isArray: true })
  roles: Roles;
  @ApiProperty({ isArray: true })
  rolesCondition: RolesCondition;
}
export class FindUser {
  @ApiProperty()
  counts: number;
  @ApiProperty({
    isArray: true,
  })
  data: ListUsers;
}

export class ResponseUpdatedUser {
  @ApiProperty()
  companyName: number;
  @ApiProperty()
  departmentName: number;
  @ApiProperty()
  divisionName: number;
  @ApiProperty()
  level: number;
  @ApiProperty({ isArray: true })
  userIdResetDatas: number[];
}

export class ResponseDetailUser {
  @ApiProperty()
  company: Company;
  @ApiProperty()
  companyId: number;
  @ApiProperty()
  department: Department;
  @ApiProperty()
  departmentId: number | null;
  @ApiProperty()
  division: Division;
  @ApiProperty()
  divisionId: number | null;
  @ApiProperty()
  email: string;
  @ApiProperty()
  employeeNumber: string;
  @ApiProperty()
  flagSkill: number;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  id: number;
  @ApiProperty()
  level: number | null;
  @ApiProperty({
    isArray: true,
  })
  roles: Roles;
  @ApiProperty()
  updatedTime: number;
}
export class CompanyResponse {
  @ApiProperty()
  conpanyId: string;
  @ApiProperty()
  companyName: string;
}
