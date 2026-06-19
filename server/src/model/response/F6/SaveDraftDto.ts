import { ApiProperty } from '@nestjs/swagger';

export class SaveDraftDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: '2023-10-26T07:17:02.142Z' })
  timer: string;

  @ApiProperty({ type: Number, example: 0 })
  subVersion: number;

  @ApiProperty({ type: Number, example: 1 })
  version: number;

  @ApiProperty({ type: Number, example: 1 })
  status: number;

  @ApiProperty({ type: String, example: '2023-10-26T07:17:02.142Z' })
  lastUpdatedTime: string;

  @ApiProperty({ type: Number, example: 0 })
  code: number;

  @ApiProperty({ type: Boolean, example: true })
  edited: boolean;

  @ApiProperty({ type: String, example: '2023-10-26T07:17:02.142Z' })
  updatedTime: string;
}
