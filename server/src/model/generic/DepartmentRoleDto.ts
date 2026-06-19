import { ApiProperty } from '@nestjs/swagger';

export class DepartmentRoleDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: Number, example: 1 })
  departmentId: number;

  @ApiProperty({ type: Number, example: 1 })
  userId: number;

  @ApiProperty({ type: Number, example: 1 })
  role: number;

  @ApiProperty({ type: String, example: '2023-10-26T07:17:02.142Z' })
  createdTime: String;

  @ApiProperty({ type: String, example: '2023-10-26T07:17:02.142Z' })
  updatedTime: String;
}
