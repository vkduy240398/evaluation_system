import { ApiProperty } from '@nestjs/swagger';
import { VersionSettingDto } from '../../generic/VersionSettingDto';

export class ListEvaluationCalculationHistoryResponseDto {
  @ApiProperty({ type: [VersionSettingDto] })
  rows: VersionSettingDto[];

  @ApiProperty({ type: Number, description: 'Total records', example: 20 })
  counts: number;
}
