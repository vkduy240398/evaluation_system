/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { ApiProperty } from '@nestjs/swagger';

const datas = [
  {
    id: 18314,
    version: 11,
    subVersion: 1,
    departmentId: 13,
    status: 1,
    creationUser: 1,
    reason: 'haha',
    publicStatus: 0,
    publicDate: null,
    lastUpdatedTime: '2023/11/22 16:25',
    createdTime: '2023-10-09T07:21:58.472Z',
    updatedTime: '2023-11-22T07:39:48.250Z',
    department_id: 13,
    creation_user: 1,
    department: {
      id: 13,
      code: '000014',
      name: 'Division 13',
    },
    user: {
      id: 1,
      employeeNumber: '2004045',
      fullName: 'ベトナム システム',
    },
  },
  {
    id: 12414,
    version: 10,
    subVersion: 0,
    departmentId: 13,
    status: 4,
    creationUser: 1,
    reason: null,
    publicStatus: 1,
    publicDate: '2023/10/16 13:55',
    lastUpdatedTime: '2023/10/09 16:21',
    createdTime: '2023-10-09T07:21:58.472Z',
    updatedTime: '2023-10-16T04:55:49.990Z',
    department_id: 13,
    creation_user: 1,
    department: {
      id: 13,
      code: '000014',
      name: 'Division 13',
    },
    user: {
      id: 1,
      employeeNumber: '2004045',
      fullName: 'ベトナム システム',
    },
  },
];

export class FindListEvaluationItemHistoryDto {
  @ApiProperty({ type: [], example: datas })
  data: any[];

  @ApiProperty({ type: Number, example: 2 })
  counts: number;
}
