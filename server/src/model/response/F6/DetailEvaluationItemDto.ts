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

const listPoints = [
  {
    value: 1,
    label: 1,
  },
  {
    value: 2,
    label: 2,
  },
];

export class DetailEvaluationItemDto {
  @ApiProperty({ type: [], example: dataSources })
  data: any[];

  @ApiProperty({ type: Number, example: 9 })
  subVersion: number;

  @ApiProperty({ type: [], example: listPoints })
  listPoints: any[];

  @ApiProperty({ type: Boolean, example: false })
  edited: boolean;
}
