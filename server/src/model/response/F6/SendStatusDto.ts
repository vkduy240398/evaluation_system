import { ApiProperty } from '@nestjs/swagger';

export class SendStatusDto {
  @ApiProperty({ type: Number, example: 0 })
  statusNumber: number;

  @ApiProperty({ type: String, example: '2023-10-26T07:17:02.142Z' })
  updateTime: string;
}
