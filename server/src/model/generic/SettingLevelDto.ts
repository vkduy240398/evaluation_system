import { ApiProperty } from '@nestjs/swagger';

export class SettingLevelDto {
  key: any;

  @ApiProperty({ type: Number, example: 1 })
  versionId: number;

  @ApiProperty({ type: Number, example: 2 })
  level: number;

  @ApiProperty({ type: Number, example: 5 })
  skillPercent: number;

  @ApiProperty({ type: Number, example: 10 })
  behaviorPercent: number;

  @ApiProperty({ type: Number, example: 15 })
  achievementPercent: number;
}
