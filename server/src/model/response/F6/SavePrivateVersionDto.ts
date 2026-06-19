import { ApiProperty } from '@nestjs/swagger';

export class SavePrivateVersionDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: Number, example: 1 })
  status: number;

  @ApiProperty({ type: Number, example: 1 })
  type: number;

  @ApiProperty({ type: String, example: 'Contend evaluation for level 1-7' })
  contentEvaluationCriteria?: string;

  @ApiProperty({ type: String, example: 'Content notes for level 1-7' })
  contentNotes?: string;

  @ApiProperty({ type: Number, example: 1 })
  creationUser?: number;

  @ApiProperty({ type: Number, example: 'Version is edited' })
  reason?: string;
}
