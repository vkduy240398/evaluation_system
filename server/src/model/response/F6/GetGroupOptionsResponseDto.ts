import { ApiProperty } from '@nestjs/swagger';

export class GetGroupOptionsResponseDto {
  @ApiProperty({ type: Number, example: 449 })
  value: number;

  @ApiProperty({ type: String, example: '000449: Group 149' })
  label: string;

  @ApiProperty({ type: String, example: 'group-data-table-key-0' })
  key: string;

  @ApiProperty({
    type: [Number],
    example: [170, 225],
  })
  departmentIds: number[];
}
