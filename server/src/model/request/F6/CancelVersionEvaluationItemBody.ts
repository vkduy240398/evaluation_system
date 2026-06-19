import { ApiProperty } from '@nestjs/swagger';

export class CancelVersionEvaluationItemBody {
  @ApiProperty({ type: String, example: '2023/10/20' })
  timer: string;
}
