import { ApiProperty } from '@nestjs/swagger';
import { SettingDto } from './SettingDto';

export class SettingFormula810Dto extends SettingDto {
  @ApiProperty()
  result: string;
}
