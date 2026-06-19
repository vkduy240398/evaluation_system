import { ApiProperty } from '@nestjs/swagger';

export class ListBasicBehaviorSkillDto {
  @ApiProperty({
    type: String,
    example: 'item1',
  })
  itemId: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  versionId: number;

  @ApiProperty({
    type: String,
    example: '企画_戦略_',
  })
  title: string;

  @ApiProperty({
    type: String,
    example:
      'Web広告のプランニング/実行/検証/改善・Web広告制作物のディレクション・広告効果分析による示唆/改善案の立案・外部折衝によるコストパフォーマンスの向上・デジタルマーケティングノウハウの蓄積',
  })
  content: string;

  @ApiProperty({
    type: Number,
    example: 3,
  })
  difficulty: number;

}
