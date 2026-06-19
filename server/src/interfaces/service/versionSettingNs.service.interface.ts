import { VersionSettingDto } from 'src/model/generic/VersionSettingDto';
import { Request } from 'express';
import { CalculatorDetail810NSDto } from 'src/model/request/CalculatorDetail810Dto';

export interface VersionSettingNsServiceI {
  getDetailEvaluationCalculation17ns(
    versionSettingId: number,
    req: Request,
  ): Promise<VersionSettingDto>;
  saveDraftVersionSetting17ns(
    versionSettingDto: VersionSettingDto,
    type: string,
    req: Request,
  ): Promise<any>;
  savePublicVersionSetting17ns(
    versionSettingDto: VersionSettingDto,
    req: Request,
  ): Promise<any>;
  saveDraft810NS(
    params: CalculatorDetail810NSDto,
    userId: number,
    req: Request,
  ): Promise<any>;
  savePublicOrPrivateNS(
    params: CalculatorDetail810NSDto,
    userId: number,
    req: Request,
  ): Promise<any>;
}
