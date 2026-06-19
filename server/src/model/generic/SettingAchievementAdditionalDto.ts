import { ApiProperty } from '@nestjs/swagger';

export class SettingAchievementAdditionalDto {
  key: null | string;

  id: null | number;

  versionId: number;

  @ApiProperty({ type: String, example: 'A' })
  rating: string;

  point: number;

  note: string;

  type: number;
}
