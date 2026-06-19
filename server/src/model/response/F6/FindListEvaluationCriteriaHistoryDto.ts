/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { ApiProperty } from '@nestjs/swagger';

const datas = [
  {
    id: 101,
    type: 1,
    version: 10,
    subVersion: 9,
    status: 3,
    creationUser: 1,
    reason: 'Version is edited',
    contentEvaluationCriteria: 'Contend evaluation for level 1-7',
    contentNotes: 'Content notes for level 1-7',
    publicDate: null,
    lastUpdatedTime: '2023/10/6 17:21',
    createdTime: '2023-10-09T02:54:44.246Z',
    updatedTime: '2023-10-09T08:01:25.406Z',
    creation_user: 1,
    user: {
      id: 1,
      employeeNumber: '2004045',
      fullName: 'ベトナム システム',
    },
  },
  {
    id: 100,
    type: 1,
    version: 10,
    subVersion: 8,
    status: 3,
    creationUser: 1,
    reason: 'Version is edited',
    contentEvaluationCriteria: 'Contend evaluation for level 1-7',
    contentNotes: 'Content notes for level 1-7',
    publicDate: null,
    lastUpdatedTime: '2023/10/6 17:21',
    createdTime: '2023-10-09T02:54:44.165Z',
    updatedTime: '2023-10-09T08:01:25.406Z',
    creation_user: 1,
    user: {
      id: 1,
      employeeNumber: '2004045',
      fullName: 'ベトナム システム',
    },
  },
];

export class FindListEvaluationCriteriaHistoryDto {
  @ApiProperty({ type: [], example: datas })
  data: any[];

  @ApiProperty({ type: Number, example: 2 })
  counts: number;
}
