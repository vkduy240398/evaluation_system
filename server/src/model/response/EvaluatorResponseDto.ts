import { UserDto } from '../generic/UserDto';
import { ApiProperty } from '@nestjs/swagger';

export class EvaluatorResponseDto {
  id: number;
  user: UserDto;
}
export class EvaluatorListResponseDto {
  @ApiProperty({
    type: Number,
    example: 20,
  })
  counts: number;

  @ApiProperty({
    example: {
      dateEvaluationDepartmentEnd: '2023/11/30',
      dateEvaluationDepartmentStart: '2023/11/20',
      dateEvaluationEnd: '2023/11/29',
      dateEvaluationEndEval: null,
      dateEvaluationStart: '2023/11/20',
      dateEvaluationStartEval: null,
      departmentName: 'GNW-20002: department test 2',
      divisionName: 'GNW-10001: division test 1',
      employeeNumber: '2013788',
      evaluationId: 15,
      evaluationOrder: '2.0',
      evaluatorId: 7,
      fullName: '2013788: tran.anh.khoi',
      id: 'a41mwrtyk',
      isBool: false,
      isInActive: false,
      level: 1,
      percentPoint: null,
      periodEnd: '2024/3',
      periodStart: '2023/10',
      status: 1,
      stringStatus: '【目標】作成中',
      summaryPointEvaluator2: null,
      title: '2023年下期',
      userId: 12,
    },
  })
  data: any;
}
export class Approve17ResponseDto {
  @ApiProperty({
    type: Number,
    example: 5,
  })
  statusNumber: number;

  @ApiProperty({
    type: String,
    example: '2023-11-22T09:49:59.096Z',
  })
  updateTime: string;
}
export class Reject17ResponseDto {
  @ApiProperty({
    type: Number,
    example: 2,
  })
  statusNumber: number;

  @ApiProperty({
    type: String,
    example: '2023-11-22T09:49:59.096Z',
  })
  updateTime: string;
}

export class ProSkillApprovalHistoryResponseDto {
  @ApiProperty({
    example: {
      department: 'GNW-00001: department_thai_no_ ',
      version: '1.0',
    },
  })
  info: any;

  @ApiProperty({
    example: {
      approverUser: { id: 5, fullName: 'tran.dang.khoa' },
      fullName: 'tran.dang.khoa',
      id: 5,
      comment: 'as',
      createdTime: '2023-11-20T03:15:04.889Z',
      status: '承認',
    },
    isArray: true,
  })
  approvalHistories: any;
}

export class DetailPublicProSkillResponseDto {
  @ApiProperty({
    example: {
      content:
        '目的に対して、効果的なタイトル・説明文を提案・判断できているか。',
      difficulty: 4,
      itemId: '1icn',
      jobType: 'Webマーケター',
      mediumClass: 'Web広告ディレクション_プランニング_',
      note: 'ﾏｰｹﾃｨﾝｸﾞ部',
      smallClass: 'タイトル・説明文',
      versionId: 17,
    },
    isArray: true,
  })
  children: any;

  @ApiProperty({
    type: String,
    example: 'GNW-00001：department_thai_no_ ',
  })
  department: string;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  departmentType: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  group: number;

  @ApiProperty({
    type: Number,
    example: 17,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: '2023/11/22 15:53',
  })
  lastUpdatedTime: string;

  @ApiProperty({
    type: String,
    example: '2023/11/20 15:07',
  })
  publicDate: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  publicStatus: number;

  @ApiProperty({
    type: String,
    example: 'not goods',
  })
  reason: string;

  @ApiProperty({
    example: {
      approvers: ['ベトナム システム', 'tran.dang.khoa'],
      setters: ['ベトナム システム'],
    },
    isArray: true,
  })
  settersAndApprovers: any;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  status: number;

  @ApiProperty({
    type: String,
    example: '2023-11-22T06:53:19.684Z',
  })
  updatedTime: string;

  @ApiProperty({
    type: String,
    example: 'ベトナム システム',
  })
  userUpdated: string;

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
}
export class PublicProSkillListResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  total: number;

  @ApiProperty({
    example: {
      department: { id: 4, code: 'GNW-00001', name: 'department_thai_no_ ' },
      id: 17,
      lastUpdatedTime: '2023/11/22 15:53',
      publicDate: '2023/11/20 15:07',
      publicStatus: 1,
      status: 1,
      subVersion: 0,
      updatedTime: '2023-11-22T06:53:19.684Z',
      user: { fullName: 'ベトナム システム' },
      version: 1,
    },
    isArray: true,
  })
  data: any;
}
export class Evaluation17SkillResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  flagSkill;
}
export class Evaluation17DetailResponseDto {
  @ApiProperty({
    type: Number,
    example: 54,
  })
  statusNumber: number;

  @ApiProperty({
    type: String,
    example: '2023-11-22T10:29:42.808Z',
  })
  updateTime: string;
}
export class Evaluation17AchievementResponseDto {
  @ApiProperty({
    example: {
      id: 1,
      note: null,
      point: '1.20',
      type: 1,
      versionId: 1,
      // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
      version_id: 1,
    },
    isArray: true,
  })
  data: any;
}
export class Evaluation17AdditionalAchievementResponseDto {
  @ApiProperty({
    example: {
      id: 1,
      note: null,
      point: '5.00',
      rating: 'S',
      versionId: 1,
      // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
      version_id: 1,
    },
    isArray: true,
  })
  data: any;
}
