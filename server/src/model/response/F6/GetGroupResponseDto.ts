import { ApiProperty } from '@nestjs/swagger';

class GroupDto {
  @ApiProperty({ type: Number, example: 341 })
  id: number;

  @ApiProperty({ type: String, example: '000341: Group 41' })
  groupName: string;

  @ApiProperty({ type: [Number], example: [277, 299] })
  departmentIds: number[];

  @ApiProperty({
    type: String,
    example: '000277: Department 177、000299: Department 199',
  })
  departmentArrString: string;

  @ApiProperty({ type: String, example: 'group-data-table-key-0' })
  key: string;
}

export class GetGroupResponseDto {
  @ApiProperty({ type: [GroupDto] })
  results: GroupDto[];

  @ApiProperty({ type: Number, example: 2 })
  count: number;
}
