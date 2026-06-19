import { ApiProperty } from '@nestjs/swagger';
import { GetAllDto } from './GetAllDto';
import { Roles } from 'src/enum/Roles';

export class GetAllRoleDto implements GetAllDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({
    type: String,
    example: Roles.F1,
  })
  name: string;
}
