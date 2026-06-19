import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { FeedbackType } from '../../enum/FeedbackType';
import { FeedbackStatus } from '../../enum/FeedbackStatus';
import { Transform } from 'class-transformer';
import { FeedbackPhase } from '../../enum/FeedbackPhase';
import { FeedbackImpactScope } from '../../enum/FeedbackImpactScope';

export class ListFeedbackDto {
  @ApiProperty()
  @IsString()
  dateStart: string;

  @ApiProperty()
  @IsString()
  dateEnd: string;

  @ApiProperty()
  @IsString()
  typeFeedback: string;

  @ApiProperty()
  @IsString()
  statusFeedback: string;

  @ApiProperty()
  @IsString()
  department: string;

  @ApiProperty()
  @IsString()
  user: string;

  @ApiProperty()
  @IsNumberString()
  offset: string;

  @ApiProperty()
  @IsNumberString()
  limit: string;

  @ApiProperty()
  @IsString()
  sortBy: string;

  @ApiProperty()
  @Matches('ASC|DESC')
  @IsString()
  sortType: string;
}

export class UserFeedbackSearchDto {
  @ApiProperty()
  @IsOptional()
  dates: [string, string];

  @ApiProperty()
  @IsOptional()
  @IsEnum(FeedbackType)
  @Transform(({ value }) => FeedbackType[value])
  type?: FeedbackType;

  @ApiProperty()
  @IsOptional()
  phase?: number;

  @ApiProperty()
  feature: (string | number)[][];

  @ApiProperty()
  @IsOptional()
  @IsEnum(FeedbackStatus)
  @Transform(({ value }) => FeedbackStatus[value])
  status?: FeedbackStatus;

  @ApiProperty()
  @IsNumber()
  offset: number;

  @ApiProperty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  role: 'user' | 'admin' | 'systemAdmin';

  @ApiProperty()
  impactScope?: number | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  keywork: string;
}

export class FeedbackCreateDto {
  @ApiProperty()
  roles: string;

  @ApiProperty()
  @IsEnum(FeedbackType)
  @Transform(({ value }) => FeedbackType[value])
  type: FeedbackType;

  @ApiProperty()
  @IsEnum(FeedbackPhase)
  @Transform(({ value }) => FeedbackPhase[value])
  phase: FeedbackPhase;

  @ApiProperty()
  features?: string;

  @ApiProperty()
  @IsString()
  summary: string;

  @ApiProperty()
  @IsString()
  detail: string;
}

export class NonRelatedFeedbackSearchDto {
  type: FeedbackType;
  phase: FeedbackPhase;
  features: string[][];
  impactScope: FeedbackImpactScope | -1;
  status: FeedbackStatus;
  keyword: string;
  originalFeedbackId: number;
  limit: number;
  offset: number;
}

export class AddCommentFeedbackDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNumber()
  feedbackId: number;

  @ApiProperty()
  @IsString()
  updatedTime: string;
}

export class EditCommentFeedbackDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNumber()
  commentId: number;

  @ApiProperty()
  @IsString()
  updatedTime: string;
}

export class DeleteCommentFeedbackDto {
  @ApiProperty()
  @IsNumber()
  commentId: number;

  @ApiProperty()
  @IsString()
  updatedTime: string;
}
