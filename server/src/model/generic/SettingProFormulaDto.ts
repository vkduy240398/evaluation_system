import { SettingDto } from './SettingDto';
import { SettingProFormulaSubDto } from '../response/SettingProFormulaSubDto';
import { ApiProperty } from '@nestjs/swagger';

export class SettingProFormulaDto extends SettingDto {
  @ApiProperty()
  settingProFormulaSub: SettingProFormulaSubDto[];
}
