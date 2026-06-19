import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProSkillDetail {
  @ApiProperty({ type: Number, example: 1 })
  @IsNotEmpty({ message: 'versionId cannot be blank' })
  versionId: number;
}
