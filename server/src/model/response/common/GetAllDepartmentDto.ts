import { ApiProperty } from '@nestjs/swagger';

export class GetAllDepartmentDto {
  @ApiProperty({ type: Number, example: 13 })
  id: number;

  @ApiProperty({ type: String, example: '000014' })
  code: string;

  @ApiProperty({ type: String, example: 'Division 13' })
  name: string;

  @ApiProperty({ type: Number, example: 0 })
  class: number;

  @ApiProperty({ type: Number, example: 1 })
  type: number;

  @ApiProperty({ type: Number, example: 1 })
  active: number;

  @ApiProperty({ type: Number, example: 1 })
  setting: number;

  @ApiProperty({ type: Number, example: null })
  divisionId: number;

  @ApiProperty({ type: Number, example: null })
  groupId: number;

  @ApiProperty({ type: String, example: '2023-10-09T01:51:48.472Z' })
  createdTime: string;

  @ApiProperty({ type: String, example: '2023-10-12T02:47:57.835Z' })
  updatedTime: string;
}
