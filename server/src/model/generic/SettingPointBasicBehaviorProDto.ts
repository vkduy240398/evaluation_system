import { ApiProperty } from '@nestjs/swagger';

export class SettingPointBasicBehaviorProDto {
  key: any;

  @ApiProperty({ type: Number, example: 0 })
  id: number;

  @ApiProperty({ type: Number, example: 1 })
  versionId: number;

  @ApiProperty({ type: Number, example: 2.0 })
  point: number;

  @ApiProperty({ type: Number, example: 0 })
  type: number;

  note: string;
}
