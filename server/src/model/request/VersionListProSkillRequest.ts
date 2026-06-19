import { ApiProperty } from '@nestjs/swagger';

export class RequestApprovedProSkill {
  @ApiProperty()
  comment: string;

  @ApiProperty()
  updateTime: string;

  @ApiProperty()
  hostName: string;

  @ApiProperty()
  skillId: number;
}
