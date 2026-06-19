import { ApiProperty } from '@nestjs/swagger';

export class UserSettingEvaluatorSearchRequestDto {
  @ApiProperty({
    type: Number,
    example: 0,
  })
  offset: number;

  @ApiProperty({
    type: Number,
    example: 10,
  })
  limit: number;

  @ApiProperty({
    type: String,
    example: 'すべて',
  })
  department: string;

  @ApiProperty({
    type: String,
    example: '',
    required: false,
  })
  userName: string;

  @ApiProperty({
    type: String,
    example: '',
    required: false,
  })
  evaluatorName: string;

  @ApiProperty({
    type: String,
    example: '2023',
  })
  year: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  periodIndex: number;
}

export class AddUserSettingEvaluationDTO {
  @ApiProperty({
    type: Array,
    example: [14, 1],
  })
  selectedRowKeys: number[];

  @ApiProperty({
    type: 'object',
    example: {
      periodIndex: 2,
      goals: '2023/11/22 ～ 2023/11/30',
      departmentGoals: '2023/11/22 ～ 2023/11/30',
      personalEvaluation: '2023/11/20 ～ 2023/11/29',
      divisionEvaluate: '2023/11/20 ～ 2023/11/30',
      key: 'pp7bkyfq',
      year: '2023',
      id: 8,
      checkFixed: 0,
      evaluationPeriod: '2023年下期',
      goalRecord: 7,
      evaluationRecord: 12,
      evaluationConfirmRecord: 13,
      totalRecord: 15,
      goalFixedRecord: 8,
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
  state: any;
}

export class DeleteSettingDTO {
  @ApiProperty({
    type: String,
    example: '2023-11-23T07:45:29.913Z',
  })
  updateTime: string;
}
