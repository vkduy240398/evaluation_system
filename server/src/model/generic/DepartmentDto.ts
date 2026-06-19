import { ApiProperty } from '@nestjs/swagger';
import { DepartmentRoleDto } from './DepartmentRoleDto';

export class DepartmentDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: '000001' })
  code: string;

  @ApiProperty({ type: String, example: 'Geo System Solutions VN' })
  name: string;

  @ApiProperty({ type: Number, example: 0 })
  class: number;

  @ApiProperty({ type: Number, example: 1 })
  type: number;

  @ApiProperty({ type: Number, example: 1 })
  active: number;

  @ApiProperty({ type: Number, example: 1 })
  setting: number;

  @ApiProperty({ type: Number, example: 1 })
  divisionId: number;

  @ApiProperty({ type: Number, example: 1 })
  groupId: number;

  @ApiProperty({ type: String, example: '2023-10-26T07:17:02.142Z' })
  createdTime: String;

  @ApiProperty({ type: String, example: '2023-10-26T07:17:02.142Z' })
  updatedTime: String;

  departmentRoles: DepartmentRoleDto[];

  divisionSubclass: any[];

  departmentSubClasses: any;

  versionProSkill: any[];

  groups: any[];

  departments: any[];
}
