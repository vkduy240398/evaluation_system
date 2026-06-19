import { ApiProperty } from '@nestjs/swagger';

class ChildrenArr {
  @ApiProperty({ type: Number, example: 30 })
  evaluationId: number;

  @ApiProperty({ type: Number, example: 4 })
  level: number;
}

export class ExportReportListPdfDto {
  @ApiProperty({ type: [ChildrenArr] })
  childrenArr: ChildrenArr[];

  @ApiProperty({ type: String, example: 'user' })
  role: string;

  @ApiProperty({ type: Number, example: 1 })
  userId: number;

  @ApiProperty({ type: Number, example: 4 })
  level: number;
}
