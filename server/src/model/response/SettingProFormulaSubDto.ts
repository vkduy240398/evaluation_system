import { ApiProperty } from '@nestjs/swagger';

export class SettingProFormulaSubDto {
  @ApiProperty()
  key: any;

  @ApiProperty()
  id: number;

  @ApiProperty()
  formulaId: number;

  @ApiProperty()
  totalItem: number;

  @ApiProperty()
  coefficient: number;
}
