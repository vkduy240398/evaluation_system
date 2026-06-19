import { ApiProperty } from '@nestjs/swagger';

export class GetNextVersion810Dto {
  @ApiProperty({ type: String, example: '5' })
  version: string;

  @ApiProperty({ type: Number, example: 5 })
  subVersion: number;
}
