import { ApiProperty } from '@nestjs/swagger';

const data = {
  id: 5,
  level: '1 ～ 7',
  versionId: 5,
  createdTime: '2023/10/9',
  creationUser: 1,
  publicDate: false,
  reason: 'Version is edited',
  status: 3,
  subVersion: 3,
  type: 1,
  updatedTime: '2023/10/9 17:01',
  statusName: '非公開',
  updatedBy: 'ベトナム システム',
  version: 1,
  timer: '2023-10-09T08:01:25.406Z',
  contentEvaluationCriteria: 'Contend evaluation for level 1-7',
  contentNotes: 'Content notes for level 1-7',
  lastUpdatedTime: '2023/10/6 17:21',
};

export class DetailCriteriaDto {
  @ApiProperty({ type: Boolean, example: true })
  isShowEdit: boolean;

  @ApiProperty({ example: data })
  data: any;

  @ApiProperty({ type: Number, example: 9 })
  subVersion: number;
}
