import { ApiProperty } from '@nestjs/swagger';
import { DateResponseDto } from './DateResponseDto';

export class SavePublicVersionEvaluationItemDto extends DateResponseDto {
  @ApiProperty({ type: Number, example: 1 })
  id?: number;

  @ApiProperty({ type: Number, example: 1 })
  status?: number;

  @ApiProperty({ type: Number, example: 1 })
  type?: number;
}
