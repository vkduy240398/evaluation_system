import { ApiProperty } from '@nestjs/swagger';

export class ExportReportPdfOnListDto {
  @ApiProperty({ type: Number, example: 1 })
  evaluationId: number;

  @ApiProperty({ type: String, example: 'user' })
  role: string;

  @ApiProperty({ type: Number, example: 1 })
  userId: number;

  @ApiProperty({ type: Number, example: 1 })
  level: number;
}
