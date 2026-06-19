import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export class GetManagementEvaluationProDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsOptional()
  @IsNumberString()
  departmentId: number;

  @ApiProperty({ type: Number, example: 20 })
  @IsNumberString()
  @IsOptional()
  limit: number;

  @ApiProperty({ type: Number, example: 0 })
  @IsNumberString()
  @IsOptional()
  offset: number;
}

export class GetManagementEvaluationSkillDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsOptional()
  @IsNumberString()
  skillId: number;

  @ApiProperty({ type: Boolean, example: true })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  detailed: boolean;

  @ApiProperty({ type: Number, example: 20 })
  @IsNumberString()
  @IsOptional()
  limit: number;

  @ApiProperty({ type: Number, example: 0 })
  @IsNumberString()
  @IsOptional()
  offset: number;
}

export class GetManagementEvaluationProByDivisionIdDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsOptional()
  @IsNumberString()
  divisionId: number;

  @ApiProperty({ type: Number, example: 20 })
  @IsNumberString()
  @IsOptional()
  limit: number;

  @ApiProperty({ type: Number, example: 0 })
  @IsNumberString()
  @IsOptional()
  offset: number;
}

@ValidatorConstraint({ name: 'string-or-number', async: false })
export class IsNumberOrArray implements ValidatorConstraintInterface {
  validate(text: any, _args: ValidationArguments) {
    return typeof text === 'number' || typeof text === 'object';
  }

  defaultMessage(_args: ValidationArguments) {
    return '($value) must be number or array';
  }
}

export class UpdateSettingEvaluationProParamDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsOptional()
  @IsNumberString()
  departmentId: number;
}

export class GetGroupDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumberString()
  divisionId: number;

  @ApiProperty({ type: Number, example: 20 })
  @IsOptional()
  @IsNumberString()
  limit: number;

  @ApiProperty({ type: Number, example: 0 })
  @IsOptional()
  @IsNumberString()
  offset: number;
}

export class CreateGroupDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumberString()
  divisionId: number;

  @ApiProperty({ type: String, example: 'GEO System Solutions VN' })
  @IsString()
  groupName: string;

  @ApiProperty({ type: [Number], example: [1, 2, 3] })
  departmentIds: number[];
}

export class DeleteGroupDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumberString()
  groupId: number;
}

export class UpdateGroupParamDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumberString()
  groupId: number;
}

export class UpdateGroupBodyDto {
  @ApiProperty({ type: String, example: 'Test group' })
  @IsString()
  groupName: string;

  @ApiProperty({ type: [Number], example: [1, 2] })
  departmentIds: number[];
}
export class UpdateSettingEvaluationProDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsOptional()
  divisionId: number;

  @ApiProperty({ type: [Number], example: [1, 2] })
  @IsOptional()
  skillSetters: number[];

  @ApiProperty({ type: [Number], example: [1, 2] })
  @IsOptional()
  skillApprovers: number[];

  @ApiProperty({ type: Boolean, example: true })
  @IsOptional()
  isCheckedDep?: boolean | undefined;

  @ApiProperty({ type: Boolean, example: true })
  @IsOptional()
  isCheckedDiv?: boolean | undefined;

  @ApiProperty({ type: Boolean, example: true })
  @IsOptional()
  isCheckedGroup?: boolean | undefined;

  @ApiProperty({ type: Number, example: 1 })
  @IsOptional()
  group?: number | undefined;

  @ApiProperty({ type: [Number], example: [1, 2] })
  @IsOptional()
  groups: number[] | undefined;
}

export class UpdateSettingEvaluationProMultipleDto {
  @ApiProperty({ type: [Number], example: [1, 2] })
  @Validate(IsNumberOrArray)
  departmentIds: number[];

  @ApiProperty({ type: [Number], example: [1, 2] })
  @IsOptional()
  skillSetters: number[];

  @ApiProperty({ type: [Number], example: [1, 2] })
  @IsOptional()
  skillApprovers: number[];

  @ApiProperty({ type: Number, example: 1 })
  @IsOptional()
  divisionId: number;

  @ApiProperty({ type: Boolean, example: true })
  @IsOptional()
  isCheckedDep?: boolean | undefined;

  @ApiProperty({ type: Boolean, example: true })
  @IsOptional()
  isCheckedDiv?: boolean | undefined;

  @ApiProperty({ type: Boolean, example: true })
  @IsOptional()
  isCheckedGroup?: boolean | undefined;

  @ApiProperty({ type: Number, example: true })
  @IsOptional()
  group?: number | undefined;

  @ApiProperty({ type: [Number], example: [1, 2] })
  @IsOptional()
  groups: number[] | undefined;
}

export class UserPeriodExceptionParamDto {
  @ApiProperty()
  @IsNumberString()
  year: number;

  @ApiProperty()
  @IsNumberString()
  periodIndex: number;

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  limit: number;

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  offset: number;
}

export class EvaluationSearchDto {
  @ApiProperty({
    type: Number,
    description: 'offset',
    example: 0,
  })
  @IsNumberString()
  offset: number;

  @ApiProperty({
    type: Number,
    description: 'limit',
    example: 10,
  })
  @IsNumberString()
  limit: number;

  @ApiProperty({
    type: String,
    description: 'sort by',
    example: 'periodStart',
  })
  @IsString()
  sortBy: string;

  @ApiProperty({
    type: String,
    description: 'sort type',
    example: 'ASC',
  })
  @IsString()
  sortType: string;

  @ApiProperty({
    type: String,
    description: 'email',
    example: '',
    required: false,
  })
  // @IsString()
  email: string;

  @ApiProperty({
    type: String,
    description: 'department',
    example: 'すべて',
  })
  @IsString()
  department: string;

  @ApiProperty({
    type: String,
    description: 'year',
    example: '2023',
  })
  @IsString()
  yearDisplayCalendar: string;

  @ApiProperty({
    type: String,
    description: 'salary rank',
    example: '1,2,3,4,5,6,7,8,9,10',
  })
  @IsString()
  salaryRank: string;

  @ApiProperty({
    type: String,
    description: 'period evaluate',
    example: '2',
  })
  @IsString()
  periodEvaluate: string;

  @ApiProperty({
    type: String,
    description: 'string status',
    example:
      '0,1,2,3,4,5,6,7,8,49,50,51,52,53,54,55,56,57,58,59,60,61,98,99,100',
  })
  @IsString()
  stringStatus: string;

  @ApiProperty()
  sortColumns: string[];

  @ApiProperty()
  sortDirections: string[];

  @ApiProperty()
  departmentSearch: { name: string; type: number };

  @ApiProperty()
  divisionSearch: { name: string; type: number };
}
