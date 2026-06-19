import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class ProSkillSettingDetail {
  @ApiProperty()
  @IsNumberString()
  versionId: string;
}

export class GetDetailProSkill {

    @ApiProperty({ type: Boolean, example: false })
    readonly: boolean;
}