import { ApiProperty } from '@nestjs/swagger';

export class BasicBehaviorPublicVersionBody {
  @ApiProperty({ type: String, example: 'http://localhost:4200' })
  hostname: string;

  @ApiProperty({ type: Number, example: 9 })
  subVersion: number;

  @ApiProperty({ type: String, example: '2023/10/20' })
  timer: string;

  @ApiProperty({ type: Number, example: 1 })
  type: number;

  @ApiProperty({ type: Number, example: 1 })
  version: number;
}
