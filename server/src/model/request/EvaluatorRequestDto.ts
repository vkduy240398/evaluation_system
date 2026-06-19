import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsBooleanString,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  StatusRejectType,
  TypeApprovedStatus,
} from 'src/interfaces/evaluator.interfaces';

export class EvaluatorSearchDto {
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
  email: string;

  @ApiProperty()
  @IsString()
  department: string;

  @ApiProperty()
  @IsString()
  evaluator: string;

  @ApiProperty()
  @IsString()
  yearDisplayCalendar: string;

  @ApiProperty()
  @IsString()
  salaryRank: string;

  @ApiProperty()
  @IsString()
  periodEvaluate: string;

  @ApiProperty()
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

export class EvaluatorApproveStatusDto {
  @ApiProperty({ type: String, example: 'Comment' })
  @IsOptional()
  @IsString()
  comment: string;

  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  type: TypeApprovedStatus;

  @ApiProperty({ type: String, example: '2' })
  @IsOptional()
  @IsString()
  statusReject: StatusRejectType;

  @ApiProperty({ type: String, example: '2023-10-26T07:17:02.142Z' })
  @IsOptional()
  updateTime: any;
}

export class GetListDepartmentExportEvaluationHistoryDto {
  @IsNumberString()
  @ApiProperty()
  yearEvaluate: string;

  @IsNumberString()
  @ApiProperty()
  periodEvaluate: string;
}

export class ExportHistoryEvaluationEvaluatorDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  fullName: string;

  @IsOptional()
  @ApiProperty()
  department: string[];

  @IsNumberString()
  @ApiProperty()
  yearStart: string;

  @IsNumberString()
  @ApiProperty()
  yearEnd: string;

  @IsNumberString()
  @ApiProperty()
  periodEvaluate: string;

  @IsNumberString()
  @ApiProperty()
  yearEvaluate: string;
}
