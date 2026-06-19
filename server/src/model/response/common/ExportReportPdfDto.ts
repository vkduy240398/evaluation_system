import { ApiProperty } from '@nestjs/swagger';

export class ExportReportPdfDto {
  @ApiProperty({ type: [Number], example: [1, 2] })
  id: number[];

  @ApiProperty({ type: Boolean, example: false })
  isEvaluatorUser: boolean;
}
