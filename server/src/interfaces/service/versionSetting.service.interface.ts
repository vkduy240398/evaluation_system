import { Request } from 'express';
import {
  VersionSetting810Dto,
  VersionSetting810NSDto,
  VersionSettingDto,
} from 'src/model/generic/VersionSettingDto';
import { CalculatorDetail810Dto } from 'src/model/request/CalculatorDetail810Dto';
import { ListEvaluationCalculationHistoryDto } from 'src/model/request/F6/ListEvaluationCalculationHistoryDto';
import { PublicVersionSettingDto } from 'src/model/request/PublicVersionSettingDto';
import { ListEvaluationCalculationHistoryResponseDto } from 'src/model/response/F6/ListEvaluationCalculationResponseDto';

export interface VersionSettingServiceI {
  getListEvaluationCalculationHistory(
    param: ListEvaluationCalculationHistoryDto,
    req: Request,
  ): Promise<ListEvaluationCalculationHistoryResponseDto>;

  getNextVersion810(version: number, req: Request): Promise<any>;
  getNextVersion810NS(version: number, req: Request): Promise<any>;
  saveDraft810(
    params: CalculatorDetail810Dto,
    userId: number,
    req: Request,
  ): Promise<any>;
  savePublicOrPrivate(params: any, userId: number, req: Request): Promise<any>;
  cancelSetting(
    id: number,
    params: any,
    userId: number,
    req: Request,
  ): Promise<any>;
  checkDatePublic(companyGroupCode: string, timeZone: string): Promise<boolean>;

  getDetailEvaluationCalculation17(
    versionSettingId: number,
    req: Request,
  ): Promise<VersionSettingDto>;
  getDetailEvaluationCalculation810(
    versionSettingId: number,
    req: Request,
  ): Promise<VersionSetting810Dto>;
  getDetailEvaluationCalculation810NS(
    versionSettingId: number,
    req: Request,
  ): Promise<VersionSetting810NSDto>;
  getDetailEvaluationCalculationCommon(
    versionSettingId: number,
    req: Request,
  ): Promise<VersionSettingDto>;
  publicVersionSetting17(
    publicVersionSettingDto: PublicVersionSettingDto,
    req: Request,
  ): Promise<any>;
  saveDraftVersionSetting17(
    versionSettingDto: VersionSettingDto,
    type: string,
    req: Request,
  ): Promise<any>;
  savePublicVersionSetting17(
    versionSettingDto: VersionSettingDto,
    req: Request,
  ): Promise<any>;
  publicVersionSettingCommon(
    publicVersionSettingDto: PublicVersionSettingDto,
    req: Request,
  ): Promise<any>;
  saveDraftVersionSettingCommon(
    versionSettingDto: VersionSettingDto,
    type: string,
    req: Request,
  ): Promise<any>;
  savePublicVersionSettingCommon(
    versionSettingDto: VersionSettingDto,
    req: Request,
  ): Promise<any>;
  findMaxSubVersion(
    version: number,
    type: number,
    req: Request,
  ): Promise<number>;
  cancelVersionSetting17(
    versionId: number,
    data: any,
    req: Request,
  ): Promise<boolean>;
}
