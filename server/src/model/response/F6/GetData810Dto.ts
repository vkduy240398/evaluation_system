/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { ApiProperty } from '@nestjs/swagger';

const additionals = [
  {
    id: 3000,
    versionId: 300,
    rating: '10.1',
    point: '10.00',
    note: 'note',
    version_id: 300,
  },
  {
    id: 2999,
    versionId: 300,
    rating: '9.1',
    point: '9.00',
    note: 'note',
    version_id: 300,
  },
];

const totalPoints = [
  {
    id: 1500,
    versionId: 300,
    point: '10.00',
    result: '10',
    note: 'note',
  },
  {
    id: 1499,
    versionId: 300,
    point: '9.00',
    result: '9',
    note: 'note',
  },
];

const data = {
  id: 300,
  type: 2,
  version: 10,
  subVersion: 0,
  status: 4,
  creationUser: 1,
  reason: 'type 2 reason 2018',
  basicMaxDifficulty: 10,
  behaviorMaxWeight: 10,
  publicDate: '2018/7/26',
  lastUpdatedTime: null,
  createdTime: '2023-10-26T07:11:50.335Z',
  updatedTime: '2018-07-26T10:46:02.492Z',
  creation_user: 1,
  user: {
    id: 1,
    employeeNumber: '2004045',
    fullName: 'ベトナム システム',
    email: 'vietnam.system@geonet.co.jp',
    departmentId: 503,
    divisionId: 502,
    companyId: 1,
    active: 1,
    level: 9,
    flagSkill: 1,
    createdTime: '2023-10-09T01:34:57.067Z',
    updatedTime: '2023-10-13T09:10:43.818Z',
    department_id: 503,
    division_id: 502,
    company_id: 1,
  },
};

class Additional {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  versionId: number;

  @ApiProperty({ type: String })
  rating: string;

  @ApiProperty({ type: String })
  point: string;

  @ApiProperty({ type: String })
  note: string;
}

class TotalPoint {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  versionId: number;

  @ApiProperty({ type: String })
  point: string;

  @ApiProperty({ type: String })
  result: string;

  @ApiProperty({ type: String })
  note: string;
}

export class GetData810Dto {
  @ApiProperty({ type: [], example: [] })
  goals: any[];

  @ApiProperty({ type: [Additional], example: additionals })
  additional: Additional[];

  @ApiProperty({ type: [TotalPoint], example: totalPoints })
  totalPoint: TotalPoint[];

  @ApiProperty({ example: data })
  data: any;

  @ApiProperty({ type: Boolean, example: true })
  isHaveEditRecord: boolean;
}
