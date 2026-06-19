import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PublicVersionSettingDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumber({}, { message: 'id must be a number' })
  @IsNotEmpty({ message: 'id cannot be blank' })
  versionId: number;

  @ApiProperty({ type: Number, example: 3 })
  @IsNumber({}, { message: 'type must be a number' })
  type: number;

  @ApiProperty({ type: Number, example: 4 })
  @IsNumber({}, { message: 'status must be a number' })
  status: number;

  @ApiProperty({ type: String, example: '2023-10-30T08:03:05.247Z' })
  @IsNotEmpty({ message: 'updatedTime cannot be blank' })
  updatedTime: string;

  @ApiProperty()
  //   @IsNumber({}, { message: 'Version must be a number' })
  version: number;

  @ApiProperty()
  //   @IsNumber({}, { message: 'Sub version must be a number' })
  subVersion: number;
}
