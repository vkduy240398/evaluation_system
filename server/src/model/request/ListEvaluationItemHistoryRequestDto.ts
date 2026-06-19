import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class ListEvaluationItemHistoryRequestDto {
  @ApiProperty({ type: String, example: 'すべて' })
  @IsString()
  status: string;

  @ApiProperty({ type: String, example: 'すべて' })
  @IsString()
  publicStatus: string;

  @ApiProperty({ type: String, example: 'すべて' })
  @IsString()
  skill: string;

  @ApiProperty({ type: Number, example: 0 })
  @IsNumberString()
  offset: any;

  @ApiProperty({ type: Number, example: 20 })
  @IsNumberString()
  limit: any;

  @ApiProperty({ type: String, example: 'periodIndex' })
  @IsString()
  sortBy: any;

  @ApiProperty({ type: String, example: 'ASC' })
  @IsString()
  sortType: any;
}
