import { ApiProperty } from '@nestjs/swagger';
import { ListProSkillDto } from './ListProSkillDto';

export class VersionProSkillDto {
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
    example: '00921: 経理1課',
  })
  department: string;

  @ApiProperty({
    type: String,
    example: 'skill 1',
  })
  skill: string;

  @ApiProperty({
    type: String,
    example: '00001: 経理2課',
  })
  division: string;

  @ApiProperty({
    type: String,
    example: '00001: 経理1課, 00002: 経理2課',
  })
  listDepartment: string;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  departmentType: number;

  @ApiProperty({
    type: Number,
    example: '4',
  })
  status: number;

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
    type: Number,
    description: '0: private, 1: public, 2: pending',
    example: 1,
  })
  publicStatus: number;

  @ApiProperty({
    type: String,
    example: '2023/3/3 8:00',
  })
  publicDate: string;

  @ApiProperty({
    type: Object,
    example: {
      setters: ['Lieu HongThai', 'Le NgocAnh'],
      approvers: ['Lieu HongThai', 'Le NgocAnh'],
    },
  })
  settersAndApprovers: { setters: string[]; approvers: string[] };

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
    type: [ListProSkillDto],
    description: 'List pro skill',
  })
  children: any[];
}

export class ListVersionPublicDto {
  @ApiProperty({
    type: Number,
    example: 2,
  })
  counts: number;

  @ApiProperty({
    type: Array,
    example: [
      {
        creationUser: 10,
        department: {
          id: 5,
          code: 'GNW-10001',
          name: 'division test 1',
          type: 1,
        },
        departmentId: 5,
        id: 16,
        lastUpdatedTime: '2023/11/16 18:58',
        publicDate: '2023/11/16 18:59',
        publicStatus: 1,
        status: 4,
        subVersion: 0,
        user: {
          id: 10,
          employeeNumber: '2011111',
          fullName: 'nguyen.hoang.thien',
        },
        version: 1,
      },
    ],
  })
  data: {
    creationUser: number;
    department: {
      id: number;
      code: string;
      name: string;
      type: number;
    };
    departmentId: number;
    id: number;
    lastUpdatedTime: string;
    publicDate: string;
    publicStatus: number;
    status: number;
    subVersion: number;
    user: {
      id: number;
      employeeNumber: string;
      fullName: string;
    };
    version: number;
  }[];
}

export class DetailProSkillApproved {
  @ApiProperty({
    type: Array,
    isArray: true,
    example: [
      {
        content: 'string',
        difficulty: 1,
        itemId: 'string',
        jobType: 'string',
        mediumClass: 'string',
        note: 'string',
        smallClass: 'string',
        versionId: 1,
      },
    ],
  })
  children: {
    content: string;
    difficulty: Number;
    itemId: string;
    jobType: string;
    mediumClass: string;
    note: string;
    smallClass: string;
    versionId: Number;
  };
  @ApiProperty()
  department: string;
  @ApiProperty()
  departmentActive: Number;
  @ApiProperty()
  lastUpdatedTime: string;
  @ApiProperty()
  listSettersAndApprovers: {
    setters: string[];
    approvers: string[];
  };
  @ApiProperty()
  publicDate: string;
  @ApiProperty()
  publicStatus: Number;
  @ApiProperty()
  reason: string;
  @ApiProperty()
  status: Number;
  @ApiProperty()
  updated: string;
  @ApiProperty()
  userUpdated: string;
  @ApiProperty()
  version: string;
  @ApiProperty()
  versionId: Number;
  @ApiProperty()
  versionMain: Number;
  @ApiProperty()
  versionSub: Number;
}

export class ResultsApproved {
  @ApiProperty()
  result: string;
}

export class VersionProSkillDepartment {
  @ApiProperty({
    type: Object,
    example: [
      {
        department: { id: 1, code: '123', name: 'string' },
        id: 1,
        lastUpdatedTime: '2023/11/16 18:36',
        publicDate: '2023/11/16 18:38',
        publicStatus: 1,
        status: 1,
        subVersion: 1,
        updatedTime: '2023-11-16T09:38:07.685Z',
        user: { fullName: 'huynh.ngoc.hung' },
        version: 1,
      },
    ],
  })
  data: {
    department: { id: number; code: string; name: string };
    id: number;
    lastUpdatedTime: string;
    publicDate: string;
    publicStatus: number;
    status: number;
    subVersion: number;
    updatedTime: string;
    user: { fullName: string };
    version: number;
  }[];
  @ApiProperty()
  total: Number;
}

export class ResultsHistoryApproved {
  @ApiProperty({
    type: Array,
    example: [
      {
        approverUser: { id: 1, fullName: 'ベトナム システム' },
        comment: null,
        createdTime: '2023-11-16T09:56:04.846Z',
        status: '公開',
      },
    ],
  })
  approvalHistories: {
    approverUser: { id: number; fullName: string };
    comment: string | null;
    createdTime: string;
    status: string;
  }[];
  @ApiProperty({
    type: Object,
    example: {
      department: 'GNW-20002: department test 2',
      version: '1.0',
    },
  })
  info: {
    department: string;
    version: string;
  };
}
