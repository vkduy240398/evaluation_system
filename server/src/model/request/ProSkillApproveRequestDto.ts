import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class ProSkillApproveRequestDto {
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
  status: string;

  @ApiProperty()
  @IsString()
  publicStatus: string;

  @ApiProperty()
  @IsString()
  skill: string;
}
