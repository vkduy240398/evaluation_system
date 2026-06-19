import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'src/enum/Roles';

export class GetEvaluation810ReportDto {
  @ApiProperty({ type: Buffer })
  buffer: Buffer;

  @ApiProperty({
    type: String,
    example: '【2023年下期】ベトナム システム評価表.pdf',
  })
  filename: string;
}

export class GetEvaluation810ReportParam {
  @ApiProperty({
    type: String,
    example: Roles.F1,
  })
  role: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  userId: number;
}
