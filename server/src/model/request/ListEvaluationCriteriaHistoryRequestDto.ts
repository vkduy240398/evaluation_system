import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class ListEvaluationCriteriaHistoryRequestDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsNumberString()
  offset: any;

  @ApiProperty()
  @IsNumberString()
  limit: any;

  @ApiProperty()
  @IsString()
  sortBy: any;

  @ApiProperty()
  @IsString()
  sortType: any;

  @ApiProperty()
  @IsString()
  flagSkill: any;
}
