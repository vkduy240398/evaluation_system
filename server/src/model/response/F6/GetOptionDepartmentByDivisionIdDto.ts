import { ApiProperty } from '@nestjs/swagger';

export class GetOptionDepartmentByDivisionIdDto {
  @ApiProperty({ type: String, example: '000299: Department 199' })
  label: string;

  @ApiProperty({ type: Number, example: 299 })
  value: number;
}
