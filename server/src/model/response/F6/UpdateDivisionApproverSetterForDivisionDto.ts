import { ApiProperty } from '@nestjs/swagger';

export class UpdateDivisionApproverSetterForDivisionDto {
  @ApiProperty({ type: [], example: [] })
  convertGroups: any[];

  @ApiProperty({ type: [Number], example: [1, 2] })
  groupIds: number[];

  @ApiProperty({ type: [], example: [] })
  tests: any[];

  @ApiProperty({ type: [], example: [] })
  results: any[];
}
