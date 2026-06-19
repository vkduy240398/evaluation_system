import { ApiProperty } from '@nestjs/swagger';

const dataSources = [
  {
    key: 1602,
    level: null,
    versionNo: '23.0',
    state: '公開中',
    updatedBy: 'ベトナム システム',
    updatedAt: '2023-11-20T02:37:40.173Z',
    releasedDate: '2023/11/20 11:37',
    status: 4,
    type: 1,
    lastUpdatedTime: '2023/11/20 11:37',
  },
  {
    key: 1601,
    level: null,
    versionNo: '22.0',
    state: '非公開',
    updatedBy: 'ベトナム システム',
    updatedAt: '2023-11-20T02:37:40.166Z',
    releasedDate: null,
    status: 3,
    type: 1,
    lastUpdatedTime: '2023/11/20 11:37',
  },
];

export class GetListCommonSkillDto {
  @ApiProperty({ type: [], example: dataSources })
  dataSources: any[];

  @ApiProperty({ type: Number, example: 2 })
  counts: any;
}
