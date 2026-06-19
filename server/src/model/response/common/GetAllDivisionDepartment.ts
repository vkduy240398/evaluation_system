import { ApiProperty } from '@nestjs/swagger';

class DepartmentDto {
  @ApiProperty({ type: Number, example: 502 })
  divisionId: number;

  @ApiProperty({ type: String, example: 'GNW-015' })
  code: string;

  @ApiProperty({ type: String, example: 'Division 1' })
  name: string;

  @ApiProperty({ type: String, example: 'GNW-015: Division 1' })
  codeName: string;
}

export class GetAllDivisionDepartmentDto extends DepartmentDto {
  @ApiProperty({
    type: [DepartmentDto],
    example: {
      id: 503,
      code: 'GNW-1234',
      name: '1234AAA',
      codeName: 'GNW-1234: 1234AAA',
    },
  })
  childrens: DepartmentDto[];
}
