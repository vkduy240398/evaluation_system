import { ManualType } from 'src/enum/ManualType';
import { ManualResponseDto } from 'src/model/response/ManualResponseDto';

export interface ManualServiceI {
  getManualFile(type: ManualType): Promise<ManualResponseDto>;
}
