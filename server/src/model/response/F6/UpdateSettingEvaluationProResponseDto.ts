import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingEvaluationProResponseDto {
  @ApiProperty({ type: [], example: [] })
  userInActivesSetters: any[];

  @ApiProperty({ type: [], example: [] })
  userInActivesApprovers: any[];

  @ApiProperty({ type: Number, example: [1, 2] })
  userIdActiveSetters: number[];

  @ApiProperty({ type: Number, example: [1, 2] })
  userIdActiveApprovers: number[];
}
