/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { ApiProperty } from '@nestjs/swagger';

export class GetEvaluationPeriodDto {
  @ApiProperty({ type: String, example: '2023/10/20' })
  date_creation_goal_start: string;

  @ApiProperty({ type: String, example: '2023/11/25' })
  date_creation_goal_end: string;

  @ApiProperty({ type: String, example: '2023/10/10' })
  date_creation_goal_department_start: string;

  @ApiProperty({ type: String, example: '2023/11/25' })
  date_creation_goal_department_end: string;
}
