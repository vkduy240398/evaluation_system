import { ApiProperty } from '@nestjs/swagger';

export class ProSKillVersionRequestDto {
  @ApiProperty({
    type: String,
    description: 'category',
    example: 'department',
  })
  category: string;
  @ApiProperty({
    type: Number,
    description: 'departmentId',
    example: 1,
  })
  departmentId: number;

  @ApiProperty({
    type: Number,
    description: 'limit',
    example: 5,
  })
  limit: number;
  @ApiProperty({
    type: Number,
    description: 'offset',
    example: 1,
  })
  offset: number;
  @ApiProperty({
    type: Number,
    description: 'publicStatus',
    example: 1,
  })
  publicStatus: number;

  @ApiProperty({
    type: Number,
    description: 'status',
    example: 1,
  })
  status: number;

  @ApiProperty({
    type: Number,
    description: 'skillId',
    example: 1,
  })
  skillId: number;
}

export class ListProSKillVersionRequestDto {
  @ApiProperty({
    type: String,
    description: 'category',
    example: 'department',
  })
  category: string;
  @ApiProperty({
    type: Number,
    description: 'skillId',
    example: 1,
  })
  skillId: number;

  @ApiProperty({
    type: Number,
    description: 'limit',
    example: 5,
  })
  limit: number;
  @ApiProperty({
    type: Number,
    description: 'offset',
    example: 1,
  })
  offset: number;
  @ApiProperty({
    type: Number,
    description: 'publicStatus',
    example: 1,
  })
  publicStatus: number;

  @ApiProperty({
    type: String,
    description: 'status',
    example: 1,
  })
  status: string;

  @ApiProperty({
    type: String,
    description: 'type',
    example: 1,
  })
  type: string;
}
