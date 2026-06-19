import { ApiProperty } from '@nestjs/swagger';
import { GetAllDepartmentDto } from './GetAllDepartmentDto';

export class GetAllDepartmentTypeDepartmentDto extends GetAllDepartmentDto {
  @ApiProperty({ type: Number, example: 1 })
  divisionId: number;

  @ApiProperty({ type: Number, example: 2 })
  groupId: number;
}
