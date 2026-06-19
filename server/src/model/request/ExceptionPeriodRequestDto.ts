/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { EvaluationByPeriodType } from 'src/interfaces/service/evaluationPeriod.interface';
import { IsNumberOrArray } from './ManagementEvaluationProDto';
import { Type } from 'class-transformer';
import { EmailType, EmailTypeFixed } from 'src/enum/TemplateMailId';

export class ExceptionPeriodParamDto {
  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  departmentId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  companyId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  periodId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  searchField: string;

  @ApiProperty()
  @IsOptional()
  limit: number;

  @ApiProperty()
  @IsOptional()
  offset: number;
}

export class EvaluationByPeriodParamDto {
  @ApiProperty()
  @IsNumberString()
  userId: number;

  @ApiProperty()
  @IsNumberString()
  year: number;

  @ApiProperty()
  @IsNumberString()
  periodIndex: number;
}

export class UpdateEvaluationPeriodExceptionDto {
  @ApiProperty()
  @IsOptional()
  evaluations: EvaluationByPeriodType[];

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @Validate(IsNumberOrArray)
  deleteIds: number[];

  @ApiProperty()
  @IsNumberString()
  year: number;

  @ApiProperty()
  @IsNumber()
  periodIndex: number;
}
export class PeriodDTO {
  @ApiProperty({
    type: String,
    example: '2023',
  })
  year: number;

  @ApiProperty({
    type: Number,
    example: 2,
    enum: [1, 2],
  })
  periodIndex: number;
}
export class ListPeriodDTO {
  @ApiProperty({
    type: String,
    example: '2022',
  })
  yearStart: number;

  @ApiProperty({
    type: String,
    example: '2023',
  })
  yearEnd: number;
}

class SavePeriodConditionDTO {
  @IsNumberString()
  year: string;

  @IsNumber()
  periodIndex: number;
}
export class SavePeriodDTO {
  @ApiProperty({
    example: {
      id: 8,
      year: '2023',
      periodIndex: 2,
      periodStart: '2023/10',
      periodEnd: '2024/3',
      dateCreationGoalStart: '2023/11/22',
      dateCreationGoalEnd: '2023/11/30',
      dateEvaluationStart: '2023/11/20',
      dateEvaluationEnd: '2023/11/29',
      dateCreationGoalDepartmentStart: '2023/11/22',
      dateCreationGoalDepartmentEnd: '2023/11/30',
      dateEvaluationDepartmentStart: '2023/11/20',
      dateEvaluationDepartmentEnd: '2023/11/30',
      createdTime: '2023-11-15T10:52:45.934Z',
      updatedTime: '2023-11-22T02:56:04.582Z',
      checkFixed: 0,
    },
  })
  body: any;

  @ApiProperty({
    example: {
      year: '2023',
      periodIndex: 2,
    },
  })
  @ValidateNested()
  @Type(() => SavePeriodConditionDTO)
  condition: SavePeriodConditionDTO;
}

export class ListUserPeriodDTO {
  @ApiProperty({
    type: String,
    example:
      '0,1,2,3,4,5,6,7,8,49,50,51,52,53,54,55,56,57,58,59,60,61,98,99,100',
  })
  stringStatus: string;

  @ApiProperty({
    type: Number,
    example: 8,
  })
  periodId: number;

  @ApiProperty({
    type: String,
    example: 'fixedGoal',
    enum: ['fixedGoal', 'fixedEvaluation', 'fixedEvaluationConfirm'],
  })
  type: string;
}
export class GetToEmailListDTO {
  @ApiProperty({
    type: EmailType,
    example: '7',
  })
  type: EmailType;

  @ApiProperty({
    type: String,
    example: '2023',
  })
  year: string;

  @ApiProperty({
    type: String,
    example: '2',
  })
  periodIndex: string;
}

export class GetToEmailFixedListDTO {
  @ApiProperty({
    type: EmailTypeFixed,
    example: '1',
  })
  type: EmailTypeFixed;

  @ApiProperty({
    type: String,
    example: '1',
  })
  periodId: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  evaluationId: number;
}

export class CheckStatusRecordSendDTO {
  @ApiProperty({
    type: EmailTypeFixed,
    example: '1',
  })
  type: EmailTypeFixed;
}

export class SendMailBodyDTO {
  @ApiProperty()
  contentMail: string;
  @ApiProperty()
  content: string;
  @ApiProperty({
    type: Number,
    example: 1,
  })
  evaluationPeriodId: number;
  @ApiProperty()
  mailTo: string;
  @ApiProperty()
  sendTimeActual: string | null;
  @ApiProperty()
  sendTimeSetting: string | null;
  @ApiProperty()
  status: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  type: number;
  @ApiProperty()
  cronjobId?: number;
  @ApiProperty({
    example: [
      'le.vu.trung.hieu@geonet.co.jp',
      'vo.thi.huyen.trang@geonet.co.jp',
    ],
  })
  mailToObjList?: string[];
  @ApiProperty()
  dataMailCCs?: any[];
}

export class SendMailNowBodyDTO {
  @ApiProperty({
    example: [
      'le.vu.trung.hieu@geonet.co.jp',
      'vo.thi.huyen.trang@geonet.co.jp',
    ],
  })
  toEmails: string[];
  @ApiProperty({
    example: {
      subject: 'string',
      editor: 'string',
    },
  })
  mailContent: {
    subject: string;
    editor: string;
  };
}
export class SendMailNow2DTO {
  @ApiProperty()
  content: SendMailNowBodyDTO;
  @ApiProperty()
  inputedValues: SendMailBodyDTO;
}
export class GetMailHistoryListDTO {
  @ApiProperty({
    type: String,
    example: '2023',
  })
  year: string;

  @ApiProperty({
    type: Number,
    example: 2,
  })
  periodIndex: number;
  @ApiProperty({
    type: Number,
    example: 0,
  })
  status: number;
  @ApiProperty({
    type: Number,
    example: 0,
  })
  limit: number;
  @ApiProperty({
    type: Number,
    example: 10,
  })
  offset: number;
}
export class ConfirmGoalDTO {
  @ApiProperty({
    type: Number,
    example: 7,
  })
  periodId: number;

  @ApiProperty({
    type: Number,
    example: 2,
    enum: [0, 1, 2],
  })
  checkFixed: number;
}

export class UpdateSettingEvaluatorOfOneUserDTO {
  @ApiProperty({
    type: Number,
    example: 10,
  })
  evaluatorFirst: number;

  @ApiProperty({
    type: Number,
    example: 19,
  })
  evaluatorHaft: number;

  @ApiProperty({
    type: Number,
    example: 10,
  })
  evaluatorSecond: number;

  @ApiProperty({
    type: String,
    example: '',
  })
  getValuaDelete05: string;

  @ApiProperty({
    type: [],
    example: [1, 2],
  })
  skills: [];

  @ApiProperty({
    type: String,
    example: '',
  })
  getValuaDelete10: string;
  @ApiProperty({
    example: {
      periodIndex: 2,
      goals: '2023/11/22 ～ 2023/11/30',
      departmentGoals: '2023/11/22 ～ 2023/11/30',
      personalEvaluation: '2023/11/20 ～ 2023/11/29',
      divisionEvaluate: '2023/11/20 ～ 2023/11/30',
      key: '51xcmrp',
      year: '2023',
      id: 8,
      checkFixed: 0,
      evaluationPeriod: '2023年下期',
      goalRecord: 6,
      evaluationRecord: 11,
      evaluationConfirmRecord: 13,
      totalRecord: 15,
      goalFixedRecord: 9,
      evaluationFixedRecord: 2,
      evaluationConfirmFixedRecord: 2,
      periodId: 8,
      goals810Time: '2023/11/22 ～ 2023/11/30',
      goals17Time: '2023/11/22 ～ 2023/11/30',
      title: '2023年下期',
      department: 'すべて',
      isSearch: true,
      current: 1,
      offset: 0,
      limit: 20,
    },
  })
  state: State;

  @ApiProperty({
    type: Number,
    example: 8,
  })
  userId: number;
}
export class UpdateSettingEvaluatorListUserDTO {
  @ApiProperty({
    type: Number,
    example: 10,
  })
  evaluatorFirst: number;

  @ApiProperty({
    type: Number,
    example: 19,
  })
  evaluatorHaft: number;

  @ApiProperty({
    type: Number,
    example: 10,
  })
  evaluatorSecond: number;

  @ApiProperty({
    example: {
      periodIndex: 2,
      goals: '2023/11/22 ～ 2023/11/30',
      departmentGoals: '2023/11/22 ～ 2023/11/30',
      personalEvaluation: '2023/11/20 ～ 2023/11/29',
      divisionEvaluate: '2023/11/20 ～ 2023/11/30',
      key: '51xcmrp',
      year: '2023',
      id: 8,
      checkFixed: 0,
      evaluationPeriod: '2023年下期',
      goalRecord: 6,
      evaluationRecord: 11,
      evaluationConfirmRecord: 13,
      totalRecord: 15,
      goalFixedRecord: 9,
      evaluationFixedRecord: 2,
      evaluationConfirmFixedRecord: 2,
      periodId: 8,
      goals810Time: '2023/11/22 ～ 2023/11/30',
      goals17Time: '2023/11/22 ～ 2023/11/30',
      title: '2023年下期',
      department: 'すべて',
      isSearch: true,
      current: 1,
      offset: 0,
      limit: 20,
    },
  })
  state: State;
  @ApiProperty({
    example: [
      {
        id: 8,
        employeeNumber: '1000002',
        fullName: 'pham.dinh.quoc.hoa',
        active: 1,
        level: 5,
        department: {
          name: 'department test 1',
          code: 'GNW-20001',
        },
        division: {
          name: 'division test 1',
          code: 'GNW-10001',
        },
        evaluatorDefault: {
          id: 36,
          active: 1,
          userId: 8,
          evaluator05Id: 19,
          evaluator1Id: 10,
          evaluator2Id: 9,
          evaluationPeriodId: 8,
          createdTime: '2023-11-16T09:41:17.845Z',
          updatedTime: '2023-11-23T01:13:48.495Z',
          user_id: 8,
          evaluator_0_5_id: 19,
          evaluator_1_id: 10,
          evaluator_2_id: 9,
          evaluation_period_id: 8,
          evaluator05: {
            id: 19,
            employeeNumber: '2013786',
            fullName: 'Chu ThiHoangAnh',
            email: 'chu.thi.hoang.anh@geonet.co.jp',
            departmentId: 83,
            divisionId: 38,
            companyId: 3,
            active: 1,
            level: 4,
            flagSkill: 1,
            createdTime: '2023-11-20T04:59:50.170Z',
            updatedTime: '2023-11-22T04:22:28.984Z',
            department_id: 83,
            division_id: 38,
            company_id: 3,
          },
          evaluator1: {
            id: 10,
            employeeNumber: '2011111',
            fullName: 'nguyen.hoang.thien',
            email: 'nguyen.hoang.thien@geonet.co.jp',
            departmentId: 7,
            divisionId: 5,
            companyId: 1,
            active: 1,
            level: 7,
            flagSkill: 1,
            createdTime: '2023-11-15T10:52:42.783Z',
            updatedTime: '2023-11-17T01:10:00.360Z',
            department_id: 7,
            division_id: 5,
            company_id: 1,
          },
          evaluator2: {
            id: 9,
            employeeNumber: '2013787',
            fullName: 'dang.hoang.kha',
            email: 'dang.hoang.kha@geonet.co.jp',
            departmentId: 6,
            divisionId: 5,
            companyId: 2,
            active: 1,
            level: 2,
            flagSkill: 0,
            createdTime: '2023-11-15T10:52:42.783Z',
            updatedTime: '2023-11-22T07:57:19.820Z',
            department_id: 6,
            division_id: 5,
            company_id: 2,
          },
        },
        roles: [
          {
            id: 1,
            name: 'USER',
            createdTime: '2023-11-15T10:52:42.232Z',
            updatedTime: '2023-11-15T10:52:42.232Z',
            Permission: {
              userId: 8,
              roleId: 1,
              createdTime: '2023-11-17T01:09:42.333Z',
              updatedTime: '2023-11-17T01:09:42.333Z',
              user_id: 8,
              role_id: 1,
            },
          },
        ],
      },
      {
        id: 14,
        employeeNumber: '1000009',
        fullName: 'vu.trung.kien',
        active: 1,
        level: 5,
        department: {
          name: 'department test 2',
          code: 'GNW-20002',
        },
        division: {
          name: 'division test 1',
          code: 'GNW-10001',
        },
        evaluatorDefault: {
          id: 37,
          active: 1,
          userId: 14,
          evaluator05Id: null,
          evaluator1Id: 1,
          evaluator2Id: 7,
          evaluationPeriodId: 8,
          createdTime: '2023-11-16T09:41:17.845Z',
          updatedTime: '2023-11-22T09:31:43.397Z',
          user_id: 14,
          evaluator_0_5_id: null,
          evaluator_1_id: 1,
          evaluator_2_id: 7,
          evaluation_period_id: 8,
          evaluator05: null,
          evaluator1: {
            id: 1,
            employeeNumber: '2004045',
            fullName: 'ベトナム システム',
            email: 'vietnam.system@geonet.co.jp',
            departmentId: 1,
            divisionId: null,
            companyId: 1,
            active: 1,
            level: 1,
            flagSkill: 1,
            createdTime: '2023-11-15T10:52:42.783Z',
            updatedTime: '2023-11-15T10:52:42.783Z',
            department_id: 1,
            division_id: null,
            company_id: 1,
          },
          evaluator2: {
            id: 7,
            employeeNumber: '2005769',
            fullName: 'vo.thi.huyen.trang',
            email: 'vo.thi.huyen.trang@geonet.co.jp',
            departmentId: 7,
            divisionId: 5,
            companyId: 1,
            active: 1,
            level: 8,
            flagSkill: 0,
            createdTime: '2023-11-15T10:52:42.783Z',
            updatedTime: '2023-11-16T09:10:00.683Z',
            department_id: 7,
            division_id: 5,
            company_id: 1,
          },
        },
        roles: [
          {
            id: 1,
            name: 'USER',
            createdTime: '2023-11-15T10:52:42.232Z',
            updatedTime: '2023-11-15T10:52:42.232Z',
            Permission: {
              userId: 14,
              roleId: 1,
              createdTime: '2023-11-16T02:51:40.161Z',
              updatedTime: '2023-11-16T02:51:40.161Z',
              user_id: 14,
              role_id: 1,
            },
          },
        ],
      },
    ],
  })
  listUserSelected: any;

  @ApiProperty({
    type: Number,
    example: 8,
  })
  userId: number;
}
export class ImportUserDTO {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  periodIndex: number;
  @ApiProperty({
    type: String,
    example: '978bi0i',
  })
  key: string;

  @ApiProperty({
    type: String,
    example: '2028',
  })
  year: string;
  @ApiProperty({
    type: Number,
    example: 17,
  })
  id: number;
  @ApiProperty({
    type: Number,
    example: 0,
  })
  checkFixed: number;
  @ApiProperty({
    type: String,
    example: '2028年上期',
  })
  evaluationPeriod: string;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  goalRecord: number;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  evaluationRecord: number;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  evaluationConfirmRecord: number;
  @ApiProperty({
    type: Number,
    example: 0,
  })
  totalRecord: number;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  goalFixedRecord: number;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  evaluationFixedRecord: number;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  evaluationConfirmFixedRecord: number;

  @ApiProperty({
    type: Number,
    example: 17,
  })
  periodId: number;

  @ApiProperty({
    type: String,
    example: '2028年上期',
  })
  titile: string;
}

export class findListUserToSettingEvaluationDTO {
  @ApiProperty({
    type: String,
    example: 'すべて',
  })
  department: string;

  @ApiProperty({
    type: String,
    example: 'すべて',
  })
  division: string;

  @ApiProperty({
    type: String,
    example: '',
    nullable: true,
    required: false,
  })
  nameAndEmail: string;
  @ApiProperty({
    type: Number,
    example: 10,
  })
  limit: number;
  @ApiProperty({
    type: Number,
    example: 0,
  })
  offset: number;
  @ApiProperty({
    type: String,
    example: '',
    nullable: true,
    required: false,
  })
  sortBy: string;
  @ApiProperty({
    type: String,
    example: 'ASC',
  })
  sortType: string;

  @ApiProperty({
    type: 'object',
    example: {
      state: {
        periodIndex: '2',
        goals: '2023/11/22 ～ 2023/11/30',
        departmentGoals: '2023/11/22 ～ 2023/11/30',
        personalEvaluation: '2023/11/20 ～ 2023/11/29',
        divisionEvaluate: '2023/11/20 ～ 2023/11/30',
        key: 'pp7bkyfq',
        year: '2023',
        id: '8',
        checkFixed: '0',
        evaluationPeriod: '2023年下期',
        goalRecord: '7',
        evaluationRecord: '12',
        evaluationConfirmRecord: '13',
        totalRecord: '15',
        goalFixedRecord: '8',
        evaluationFixedRecord: '2',
        evaluationConfirmFixedRecord: '2',
        periodId: '8',
        goals810Time: '2023/11/22 ～ 2023/11/30',
        goals17Time: '2023/11/22 ～ 2023/11/30',
        title: '2023年下期',
      },
    },
  })
  state: any;
}
export class SendMailDTO {
  @ApiProperty({
    type: Number,
    example: 2,
  })
  emailType: number;

  @ApiProperty({
    type: String,
    example: '18',
  })
  evaluationPeriodId: String;

  @ApiProperty({
    type: Array,
    example: ['2023/11/23', '2023/11/23'],
  })
  goalEvaluation: string[];

  @ApiProperty({
    type: Array,
    example: ['2023/11/23', '2023/11/23'],
  })
  goaldepartmentEvaluation: string[];

  @ApiProperty({
    type: Array,
    example: [53, 47, 51, 44, 43, 40, 41, 42, 48, 52, 54, 49, 50, 45, 55, 46],
  })
  id: number[];

  @ApiProperty({
    type: 'object',
    example: {
      date: ['2023-11-23T17:00:00.000Z', '2023-11-24T17:00:00.000Z'],
      dateDepartment: ['2023-11-23T17:00:00.000Z', '2023-11-24T17:00:00.000Z'],
      subject: '【期限延長】GNW2028下期 目標設定',
      editor:
        '<p><span style="font-size: 11pt;"><span style="font-size: 11pt;"> お疲れ様です。<br />GNW人事総務課窓口です。<br /><br /></span><span style="font-size: 11pt;">2028下期</span><span style="font-size: 11pt;"> 目標設定期日が過ぎてしまいましたが、<br />未提出の状況であるため期間を延長し再案内いたします。 <br />評価システムにログインし、目標設定を完了してください。<br /><br />■ログイン情報<br />　1．URL： </span><a href="http://10.70.190.124:8083/login" target="_blank" rel="noopener noreferrer">http://10.70.190.124:8083/login</a><span style="font-size: 11pt;"> <br />　2．ユーザ名・パスワードはPCにログインするユーザ名・パスワードと同様。<br /><br />■実施期間<br />【変更前】 </span><span style="font-size: 11pt;">11月24日 (金)</span><span style="font-size: 11pt;"> &nbsp;~&nbsp;</span><span style="font-size: 11pt;">11月25日 (土) </span><span style="font-size: 11pt;"><br />【変更後】</span><span style="font-size: 11pt;"> 11月24日 (金)</span><span style="font-size: 11pt;">&nbsp;~&nbsp;</span><span style="color: #ff0000; font-size: 11pt;"><strong>M月DD日 (date)</strong> </span><span style="font-size: 11pt;"><br /><br />これ以上の期間延長は行わないので、確実に実施お願いいたします。 <br /><br />お忙しいところ恐れ入りますが、どうぞよろしくお願いいたします。</span></span></p>',
    },
  })
  mailContent: any;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  status: number;

  @ApiProperty({
    type: Array,
    example: [
      ['pham.dinh.quoc.hoa@geonet.co.jp'],
      ['vu.trung.kien@geonet.co.jp'],
      ['vietnam.system@geonet.co.jp'],
      ['vo.thi.huyen.trang@geonet.co.jp'],
      ['dao.thi.hong.nhung@geonet.co.jp'],
      ['lam.duc.huy@geonet.co.jp'],
      ['tran.le.ha.nam@geonet.co.jp'],
      ['nguyen.hoang.thien@geonet.co.jp'],
      ['le.vu.trung.hieu@geonet.co.jp'],
      ['dang.hoang.kha@geonet.co.jp'],
      ['tran.anh.khoi@geonet.co.jp'],
      ['tran.dang.khoa@geonet.co.jp'],
      ['chu.thi.hoang.anh@geonet.co.jp'],
      ['lieu.hong.thai@geonet.co.jp'],
    ],
  })
  toEmails: string[];

  @ApiProperty({
    type: String,
    example: 'fixedGoal',
  })
  type: String;
}
export class DepartmentPeriodSettingItemDTO {
  @ApiProperty({ type: Number, example: 5 })
  @IsNumber()
  departmentId: number;

  @ApiProperty({ type: String, example: '2025/04/01' })
  @IsString()
  @IsOptional()
  dateCreationGoalDepartmentStart: string;

  @ApiProperty({ type: String, example: '2025/05/31' })
  @IsString()
  @IsOptional()
  dateCreationGoalDepartmentEnd: string;

  @ApiProperty({ type: String, example: '2025/04/01' })
  @IsString()
  @IsOptional()
  dateCreationGoalStart: string;

  @ApiProperty({ type: String, example: '2025/05/31' })
  @IsString()
  @IsOptional()
  dateCreationGoalEnd: string;

  @ApiProperty({ type: String, example: '2025/06/01' })
  @IsString()
  @IsOptional()
  dateEvaluationDepartmentStart: string;

  @ApiProperty({ type: String, example: '2025/07/31' })
  @IsString()
  @IsOptional()
  dateEvaluationDepartmentEnd: string;

  @ApiProperty({ type: String, example: '2025/06/01' })
  @IsString()
  @IsOptional()
  dateEvaluationStart: string;

  @ApiProperty({ type: String, example: '2025/07/31' })
  @IsString()
  @IsOptional()
  dateEvaluationEnd: string;

  @ApiProperty({ type: Boolean, required: false })
  @IsBoolean()
  @IsOptional()
  isDivisionLevel?: boolean;

  @ApiProperty({ type: [Number], required: false })
  @IsArray()
  @IsOptional()
  childDepartmentIds?: number[];
}

export class SavePeriodDepartmentSettingDTO {
  @ApiProperty({ type: Number, example: 8 })
  @IsNumber()
  evaluationPeriodId: number;

  @ApiProperty({ type: [DepartmentPeriodSettingItemDTO] })
  @ValidateNested({ each: true })
  @Type(() => DepartmentPeriodSettingItemDTO)
  departments: DepartmentPeriodSettingItemDTO[];
}

export class ListPeriodDepartmentSettingDTO {
  @ApiProperty({ type: Number, example: 8 })
  @IsString()
  evaluationPeriodId: string;
}

export class DeletePeriodDepartmentSettingDTO {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  id: number;
}

export class UndoFixEvaluationDTO {
  @ApiProperty({
    type: Number,
    example: 8,
  })
  periodId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  type: number;
}
interface State {
  periodIndex: Number;
  goals: String;
  departmentGoals: String;
  personalEvaluation: String;
  divisionEvaluate: String;
  key: String;
  year: String;
  id: Number;
  checkFixed: Number;
  evaluationPeriod: String;
  goalRecord: Number;
  evaluationRecord: Number;
  evaluationConfirmRecord: Number;
  totalRecord: Number;
  goalFixedRecord: Number;
  evaluationFixedRecord: Number;
  evaluationConfirmFixedRecord: Number;
  periodId: Number;
  goals810Time: String;
  goals17Time: String;
  title: String;
  department: String;
  isSearch: Boolean;
  current: Number;
  offset: Number;
  limit: Number;
}
