import { IsEnum } from 'class-validator';
import { ManualType } from 'src/enum/ManualType';

export class ManualQueryDto {
  @IsEnum(ManualType)
  type: ManualType;
}
