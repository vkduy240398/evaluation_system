import { ApiProperty } from '@nestjs/swagger';
import { ListBasicBehaviorSkillDto } from './ListBasicBehaviorSkillDto';

export class VersionBasicBehaviorSkillDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: '1.0',
  })
  version: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  versionMain: number;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  versionSub: number;

  @ApiProperty({
    type: String,
    example: '1',
  })
  type: string;

  @ApiProperty({
    type: Number,
    example: '4',
  })
  status: number;

  @ApiProperty({
    type: Number,
    example: '4',
  })
  level: number;

  @ApiProperty({
    type: String,
    example: 'Lam DucHuy',
  })
  userUpdated: string;

  @ApiProperty({
    type: String,
    example: '理由',
  })
  reason: string;

  @ApiProperty({
    type: String,
    example: '2023/3/3 8:00',
  })
  publicDate: string;

  @ApiProperty({
    type: String,
    example: '2023/3/3 8:00',
  })
  lastUpdatedTime: string;

  @ApiProperty({
    type: String,
    example: '2023-05-24T03:13:30.552Z',
  })
  updatedTime: Date;

  @ApiProperty({
    type: [ListBasicBehaviorSkillDto],
    description: 'List basic behavior skill',
  })
  children: ListBasicBehaviorSkillDto[];
}
