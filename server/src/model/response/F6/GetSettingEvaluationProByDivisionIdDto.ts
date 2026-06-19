import { ApiProperty } from '@nestjs/swagger';

class Department {
  @ApiProperty({ type: Number, example: 1 })
  typeD: number;

  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: 'GNW-123456: other division' })
  departmentName: string;

  @ApiProperty({ type: Number, example: 13 })
  departmentId: number;

  @ApiProperty({ type: String, example: 'Department manage' })
  type: string;

  @ApiProperty({ type: String, example: 'department-roles-key-13' })
  key: string;

  @ApiProperty({ type: Boolean, example: false })
  isCheckedDep: boolean;

  @ApiProperty({ type: Boolean, example: false })
  isCheckedDiv: boolean;

  @ApiProperty({ type: Boolean, example: false })
  isCheckedGroup: boolean;

  @ApiProperty({ type: [], example: [] })
  groups: any[];
}

export class GetSettingEvaluationProByDivisionIdDto {
  @ApiProperty({ type: [Department] })
  dataList: Department[];

  @ApiProperty({ type: Number, example: 1 })
  count: number;
}
