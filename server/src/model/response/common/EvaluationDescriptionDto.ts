import { ApiProperty } from '@nestjs/swagger';

export class EvaluationDescriptionDto {
  @ApiProperty({ type: String, example: 'Contend evaluation for level 8-10' })
  contentEvaluationCriteria: string;

  @ApiProperty({ type: String, example: 'Content notes for level 8-10' })
  contentNotes: string;
}

export class EvaluationDescriptionQuery {
  @ApiProperty({ type: Number, example: 9 })
  userLevel: number;
}

export class EvaluationDescriptionByIdDto {
  @ApiProperty({ type: String, example: '2020年下期' })
  title: string;

  @ApiProperty({ type: Number, example: 'Content notes for level 8-10' })
  level: number;

  @ApiProperty({ type: [EvaluationDescriptionDto] })
  versionGuideEvaluation: EvaluationDescriptionDto[];
}
