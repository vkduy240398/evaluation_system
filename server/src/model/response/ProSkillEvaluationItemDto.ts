import { ApiProperty } from '@nestjs/swagger';
import { ListProSkillDto } from './ListProSkillDto';

export class ProSkillEvaluationItemDto {
  @ApiProperty({
    type: [ListProSkillDto],
    example: [
      {
        itemId: 't9qg',
        smallClass: 'Small',
        mediumClass: 'Large',
        content: 'Description 1',
        difficulty: 3,
        note: 'Note',
        key: 't9qg',
        jobType: '1',
      },
      {
        itemId: 'lzxu',
        smallClass: 'Small',
        mediumClass: 'Large',
        content: 'Description 2',
        difficulty: 2,
        note: 'Note',
        key: 'lzxu',
        jobType: '2',
      },
    ],
  })
  results: ListProSkillDto[];

  @ApiProperty({
    type: String,
    example: 'GNW-1: department 23',
  })
  department: string;
}
