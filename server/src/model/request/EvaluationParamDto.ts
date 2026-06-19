/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  AdditionData,
  CommentContent,
  EvaluatorInfo,
  RequestDataSave,
  Total,
} from 'src/interfaces/service/evaluation.service.interface';
import {
  AchievementType,
  BasicBehaviorType,
  EvaluationAdditionalAchievementNew,
  EvaluationPersonalAchievementNew,
  UserEvaluationBasicBehaviorType,
  UserEvaluationToProSkillType,
} from 'src/interfaces/user.interfaces';

export class EvaluationQueryDto {
  @ApiProperty()
  @IsString()
  periodStart: string;

  @ApiProperty()
  @IsString()
  periodEnd: string;
}
export class EvaluationSearchDto {
  @ApiProperty()
  @IsNumberString()
  offset: number;

  @ApiProperty()
  @IsNumberString()
  limit: number;

  @ApiProperty()
  @IsString()
  sortBy: string;

  @ApiProperty()
  @IsString()
  sortType: string;

  @ApiProperty()
  @IsString()
  yearStart: string;

  @ApiProperty()
  @IsString()
  yearEnd: string;
}

export class EvaluationProSkillDto {
  @ApiProperty()
  @IsNumberString()
  evaluationId: number;
}

export class EvaluationAchievementPublicTypeDto {
  @IsString()
  @ApiProperty()
  achievementType: AchievementType;
  type: number;
}

export class EvaluationBasicBehaviorPublicTypeDto {
  @IsString()
  @ApiProperty({
    enum: ['1', '2', '3'],
  })
  basicBehaviorType: BasicBehaviorType;

  @IsNumberString()
  @IsOptional()
  @ApiProperty({
    type: Number,
    example: 1,
  })
  level: number;
}

export class EvaluationUpdateTypeDto {
  @ApiProperty()
  @IsString()
  data: string;
}

export class GetEvaluationDTO {
  @ApiProperty({
    description: 'isEvaluatorUser',
    required: true,
    example: '17',
    type: String,
  })
  isEvaluatorUser: string;
}

export class Evaluation810Param {
  @ApiProperty({
    description: 'id',
    required: true,
    example: 21,
    type: Number,
  })
  @IsNumberString()
  id: number;

  @ApiProperty({
    type: Number,
    description: 'userId',
    required: true,
    example: 7,
  })
  @IsNumberString()
  userId: number;
}
export class EvaluationApproveInfo {
  @ApiProperty()
  @IsNumber()
  evaluationId: number;

  @ApiProperty()
  @IsNumber()
  status: number;

  @ApiProperty()
  listEvalutor: EvaluatorInfo[];

  @ApiProperty()
  @IsString()
  maxOrder: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNumber()
  approverId: number;

  @ApiProperty()
  @IsString()
  updatedTime: string;
}
export class Evaluation810RejectInfo {
  @ApiProperty({
    type: Number,
    description: 'evaluation id',
    example: 21,
  })
  @IsNumber()
  evaluationId: number;

  @ApiProperty({
    type: Number,
    description: 'evaluation id',
    example: 49,
  })
  @IsNumber()
  status: number;

  @ApiProperty({
    type: String,
    description: 'evaluation id',
    example: 'user',
  })
  @IsString()
  selectedOrder: string;

  @ApiProperty({
    type: String,
    description: 'content',
    example: 'aaaaa',
  })
  @IsString()
  content: string;

  @ApiProperty({
    type: Number,
    description: 'approver id',
    example: 7,
  })
  @IsNumber()
  approverId: number;

  @ApiProperty({
    type: Number,
    description: 'owner id',
    example: 8,
  })
  @IsNumber()
  ownerId: number;

  @ApiProperty({
    description: 'list evaluator',
    example: [
      {
        evaluationOrder: '2.0',
        evaluatorId: 9,
        commentPublic: 'comment 2.0 public',
        commentPrivate: 'comment 2.0 private',
        user: {
          employeeNumber: '2013787',
          fullName: 'dang.hoang.kha',
          email: 'dang.hoang.kha@geonet.co.jp',
        },
      },
      {
        evaluationOrder: '1.0',
        evaluatorId: 10,
        commentPublic: 'comment 1.0 public',
        commentPrivate: 'commment 1.0 private ',
        user: {
          employeeNumber: '2011111',
          fullName: 'nguyen.hoang.thien',
          email: 'nguyen.hoang.thien@geonet.co.jp',
        },
      },
    ],
  })
  listEvalutor: EvaluatorInfo[];

  @ApiProperty({
    type: String,
    description: 'updated time',
    example: '2023-11-22T02:44:17.612Z',
  })
  @IsString()
  updatedTime: string;

  @ApiProperty({
    type: String,
    description: '2023-11-22T02:44:17.612Z',
    example: '',
  })
  @IsString()
  maxOrder: string;
}
export class Evaluation810SaveInfo {
  @ApiProperty({
    description: 'userId',
    example: 7,
  })
  dataSource: RequestDataSave[];

  @ApiProperty()
  additionData: AdditionData[];

  @ApiProperty()
  commentData: CommentContent;

  @ApiProperty()
  @IsNumber()
  evaluationId: number;

  @ApiProperty()
  @IsNumber()
  status: number;

  @ApiProperty()
  @IsBoolean()
  isDraft: boolean;

  @ApiProperty()
  listEvalutor: EvaluatorInfo[];

  @ApiProperty()
  total: Total;

  @ApiProperty()
  @IsString()
  updatedTime: string;

  @ApiProperty()
  checkList: EvaluatorInfo[];

  @ApiProperty()
  evaluationOrder: number;

  @ApiProperty()
  listBehaviors: UserEvaluationBasicBehaviorType[];

  @ApiProperty()
  listPersonalGoals: EvaluationPersonalAchievementNew[];

  @ApiProperty()
  achievementAdditionalPersonals: EvaluationAdditionalAchievementNew[];
  listBasics?: UserEvaluationBasicBehaviorType[];
  listProSkills?: UserEvaluationToProSkillType[];
}

// ** Response Swagger Api
export class EvaluationSearchResponseDto {
  @ApiProperty()
  data: any[];

  @ApiProperty()
  counts: number;
}

export class EvaluationSkillCheckResponseDto {
  @ApiProperty()
  flagSkill: number;
}

export class EvaluationUpdateTypeResponseDto {
  @ApiProperty()
  statusNumber: number;
  @ApiProperty()
  updateTime: string;
}

export class EvaluationListProSkillPublicResponseDto {
  @ApiProperty()
  itemId: string;
  @ApiProperty()
  smallClass: string;
  @ApiProperty()
  mediumClass: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  difficulty: number;
  @ApiProperty()
  note: string;
  @ApiProperty()
  jobType: string;
  @ApiProperty()
  key: string;
}

export class GetAchievementSettingPublicResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  versionId: number;
  @ApiProperty()
  type: string;
  @ApiProperty()
  point: string;
  @ApiProperty()
  note: number;
}

export class GetBasicBehaviorSkillPublicResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  versionId: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  difficulty: number;
  @ApiProperty()
  key: string;
}

export class GetSettingProFormulaPublicResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  formulaId: number;
  @ApiProperty()
  totalItem: number;
  @ApiProperty()
  coefficient: number;
  @ApiProperty()
  settingProFormula: any;
}

export class GetEvaluation810ResponseDto {
  @ApiProperty({
    example: {
      results: {
        evaluationList: {
          id: 1,
          departmentName: 'GNW-00001: department_no_1',
          divisionName: 'GNW-00001: division_no_1',
          companyName: '株式会社ゲオホールディングス',
          title: '2023年下期',
          periodStart: '2023/11',
          periodEnd: '2023/12',
          status: 1,
          level: 8,
          summaryPointEvaluator2: null,
          percentPoint: 100,
          userId: 4,
          commentUser: 'commentUser',
          updatedTime: '2023-11-17T03:51:13.403Z',
          summaryCharPointUser: null,
          summaryCharPointEvaluator05: null,
          summaryCharPointEvaluator1: null,
          summaryCharPointEvaluator2: null,
          summaryPointUser: '49.00',
          summaryPointEvaluator05: '87.00',
          summaryPointEvaluator1: '87.00',
          achievementPersonalTotalPointUser: '10.00',
          achievementPersonalTotalPointEvaluator05: '100.00',
          achievementPersonalTotalPointEvaluator1: '100.00',
          achievementPersonalTotalPointEvaluator2: '0.00',
          achievementAdditionalTotalPointUser: null,
          achievementAdditionalTotalPointEvaluator05: null,
          achievementAdditionalTotalPointEvaluator1: null,
          achievementAdditionalTotalPointEvaluator2: null,
          dateCreationGoalStart: '2023/11/21',
          dateCreationGoalEnd: '2023/11/30',
          dateEvaluationStart: '2023/11/15',
          dateEvaluationEnd: '2023/11/17',
          evaluationAchievementPersonals: [
            {
              achievementStatus: '達成',
              achievementValue: 'sdf',
              actionPlan: 'actionPlan',
              coefficientEvaluator1: null,
              coefficientEvaluator2: null,
              coefficientEvaluator05: null,
              coefficientUser: null,
              difficultyEvaluator1: '1.00',
              difficultyEvaluator2: null,
              difficultyEvaluator05: '1.00',
              difficultyUser: '1.00',
              evaluationId: 1,
              id: 19,
              itemNo: 0,
              method: 'sdf',
              pointEvaluator1: 100,
              pointEvaluator2: null,
              pointEvaluator05: 100,
              pointUser: 10,
              reasonComment: 'reasonComment',
              title: 'dsf',
              weight: 100,
            },
          ],
          evaluationAchievementAdditional: [],
          evaluator: [
            {
              evaluationOrder: '0.5',
              evaluatorId: 6,
              commentPublic: 'commentPublic',
              commentPrivate: '',
              user: {
                employeeNumber: '201428a',
                fullName: 'fullName',
                email: 'pham.thuy.tien@geonet.co.jp',
              },
            },
            {
              evaluationOrder: '1.0',
              evaluatorId: 2,
              commentPublic: 'commentPublic',
              commentPrivate: 'commentPrivate',
              user: {
                employeeNumber: '2009859',
                fullName: 'fullName',
                email: 'vo.khanh.duy@geonet.co.jp',
              },
            },
            {
              evaluationOrder: '2.0',
              evaluatorId: 5,
              commentPublic: 'commentPublic',
              commentPrivate: 'commentPrivate',
              user: {
                employeeNumber: '2014289',
                fullName: 'fullName',
                email: 'tran.dang.khoa@geonet.co.jp',
              },
            },
          ],
          evaluationPeriod: {
            dateCreationGoalDepartmentEnd: '2023/11/16',
            dateCreationGoalDepartmentStart: '2023/11/16',
            dateCreationGoalEnd: '2023/11/17',
            dateCreationGoalStart: '2023/11/16',
            dateEvaluationDepartmentEnd: '2023/11/17',
            dateEvaluationDepartmentStart: '2023/11/17',
            dateEvaluationEnd: '2023/11/17',
            dateEvaluationStart: '2023/11/16',
            id: 8,
            periodEnd: '2024/3',
            periodIndex: 2,
            periodStart: '2023/10',
            year: '2023',
          },
          user: {
            id: 4,
            employeeNumber: '2014288',
            fullName: 'fullName',
            divisionId: 2,
            active: 1,
          },
        },
        subList: [
          [
            {
              evaluationDecision: 'evaluationDecision',
              coefficient: '1.00',
              parentKey: 0,
              achievementPersonalId: 19,
            },
          ],
        ],
        versionSetting8: {
          id: 3,
          version: 1,
          subVersion: 0,
          settingAchievementPersonal: [],
          settingAchievementAdditional: [],
          settingFormula810: [],
        },
      },
    },
  })
  results: any;
  // results: {
  //   evaluationList: Evaluation810List;
  //   subList: {
  //     evaluationDecision: string;
  //     coefficient: number;
  //     parentKey: number;
  //     achievementPersonalId: number;
  //   }[];
  //   versionSetting8: {
  //     id: number;
  //     version: number;
  //     subVersion: number;
  //     settingAchievementPersonal: any[];
  //     settingAchievementAdditional: any[];
  //     settingFormula810: any[];
  //   };
  // };
  @ApiProperty()
  'hasMode1': boolean;
  @ApiProperty()
  'hasMode2': boolean;
  @ApiProperty()
  'allowSeeList': any[];
  @ApiProperty()
  'maxOrder': string;

  @ApiProperty()
  'isDisable': boolean;
  @ApiProperty()
  'hasMode3': boolean;
  @ApiProperty()
  'hasEvaluator2': boolean;
  @ApiProperty({
    example: {
      id: 4,
      department: 'GNW-00001: division_no_1',
      division: 'GNW-00001: division_no_1',
      evaluationLevel: 8,
      evaluators: [
        '仮評価: 仮評価',
        '一次評価: 一次評価',
        '二次評価: 二次評価',
      ],
      fiscalYear: '2023年下期',
      periodStart: '2023/11',
      periodEnd: '2023/12',
      fullName: 'fullName',
      employeeNumber: '2014288',
      status: 1,
      active: 1,
    },
  })
  userInfo: any;
}

export class CreateOrUpdateEvaluationResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  status: number;
  @ApiProperty()
  updatedTime: string;
  @ApiProperty()
  level: number;
  @ApiProperty()
  summaryCharPointUser: number;
  @ApiProperty()
  summaryCharPointEvaluator05: number;
  @ApiProperty()
  summaryCharPointEvaluator1: number;
  @ApiProperty()
  summaryCharPointEvaluator2: number;
  @ApiProperty({
    example: {
      id: 8,
      year: '2023',
      periodIndex: 2,
      periodStart: '2023/10',
      periodEnd: '2024/3',
      dateCreationGoalStart: '2023/11/16',
      dateCreationGoalEnd: '2023/11/17',
      dateEvaluationStart: '2023/11/16',
      dateEvaluationEnd: '2023/11/17',
      dateCreationGoalDepartmentStart: '2023/11/16',
      dateCreationGoalDepartmentEnd: '2023/11/16',
      dateEvaluationDepartmentStart: '2023/11/17',
      dateEvaluationDepartmentEnd: '2023/11/17',
      createdTime: '2023-11-15T03:42:54.747Z',
      updatedTime: '2023-11-15T06:33:15.868Z',
      checkFixed: 0,
    },
  })
  evaluationPeriod: any;
  @ApiProperty({
    example: {
      evaluationId: 1,
      evaluatorId: 6,
      evaluationOrder: '0.5',
      commentPublic: 'commentPublic',
      commentPrivate: '',
      createdTime: '2023-11-15T08:36:26.161Z',
      updatedTime: '2023-11-15T10:08:32.359Z',
    },
  })
  evaluator: any[];
}

export class ListBasicBehaviorResponseDto {
  @ApiProperty()
  idItem: number;
  @ApiProperty()
  versionId: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  difficulty: string;

  @ApiProperty({
    example: {
      id: 10,
      version: 2,
      subVersion: 0,
    },
  })
  versionBasicBehavior: {
    id: number;
    version: number;
    subVersion: number;
  };

  @ApiProperty()
  key: string;
}

export class GetProSkillEvaluationItemResponseDto {
  @ApiProperty({
    example: {
      itemId: 'i9bc',
      smallClass: '1',
      mediumClass: '1',
      content: '11',
      difficulty: 4,
      note: '11111',
      jobType: '1',
      key: 'i9bc',
    },
  })
  results: {
    itemId: string;
    smallClass: string;
    mediumClass: string;
    content: string;
    difficulty: number;
    note: string;
    jobType: string;
    key: string;
  };

  @ApiProperty()
  department: string;
}

export class GetDepartmentGoalResponseDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  divisionName: string;
  @ApiProperty()
  evaluationAchievementPersonals: any[];
}

export class CheckPermissionDto {
  @ApiProperty()
  evaluationId: number;
  @ApiProperty()
  userId: number;
}

export class CheckPermissionResponseDto {
  @ApiProperty({
    example: true,
  })
  evaluationId: boolean;
}
export class CheckPermissionRequestDto {
  @ApiProperty({
    example: 1,
  })
  evaluationId: number;
  @ApiProperty({
    example: 1,
  })
  userId: number;
}
