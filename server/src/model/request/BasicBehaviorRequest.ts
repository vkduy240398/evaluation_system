import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class TypeBasicBehavior {
  @ApiProperty()
  @IsNumberString()
  type: string;
}

export class BasicBehaviorSearchDto {
  @ApiProperty({ type: Number, example: 0 })
  @IsNumberString()
  offset: any;

  @ApiProperty({ type: Number, example: 20 })
  @IsNumberString()
  limit: any;

  @ApiProperty({ type: String, example: 'version' })
  @IsString()
  sortBy: any;

  @ApiProperty({ type: String, example: 'DESC' })
  @IsString()
  sortType: any;

  @ApiProperty({ type: String, example: '' })
  @IsString()
  basicBehavior: any;

  @ApiProperty({ type: Number, example: 0 })
  @IsString()
  status: any;

  @ApiProperty({ type: Boolean, example: false })
  @IsString()
  level: any;

  @ApiProperty({ type: Number, example: 2 })
  @IsString()
  flagSkill: any;
}
