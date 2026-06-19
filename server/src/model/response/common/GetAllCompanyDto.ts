import { ApiProperty } from '@nestjs/swagger';
import { GetAllDto } from './GetAllDto';

export class GetAllCompanyDto implements GetAllDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({
    type: String,
    example: 'GEO SYSTEM SOLUTIONS VIETNAM CO. LTD',
  })
  name: string;
}
