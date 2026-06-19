import { HttpStatus } from '@nestjs/common';
import { VersionSettingDto } from 'src/model/generic/VersionSettingDto';
import { Request } from 'express';
import { ErrorMessageResponseDto } from 'src/model/response/ErrorMessageResponseDto';
import { VersionSettingNsServiceI } from 'src/interfaces/service/versionSettingNs.service.interface';
import { CalculatorDetail810NSDto } from 'src/model/request/CalculatorDetail810Dto';
export declare class VersionSettingNsService implements VersionSettingNsServiceI {
    private versionSettingRepository;
    private settingPointBasicBehaviorProRepository;
    private settingAchievementPersonalRepository;
    private settingAchievementAdditionalRepository;
    private settingLevelRepository;
    private evaluationPeriodRepo;
    getDetailEvaluationCalculation17ns(versionSettingId: number, req: Request): Promise<VersionSettingDto>;
    saveDraftVersionSetting17ns(versionSettingDto: VersionSettingDto, type: string, req: Request): Promise<ErrorMessageResponseDto | VersionSettingDto>;
    saveDraft810NS(params: CalculatorDetail810NSDto, userId: number, req: Request): Promise<any>;
    savePublicOrPrivateNS(params: CalculatorDetail810NSDto, userId: number, req: Request): Promise<any>;
    savePublicVersionSetting17ns(versionSettingDto: VersionSettingDto, req: Request): Promise<ErrorMessageResponseDto | VersionSettingDto | {
        code: HttpStatus;
        startGoal: string;
        endGoal: string;
        startEvaluation: string;
        endEvaluation: string;
        isGoalCreationTime: boolean;
        isEvaluationTime: boolean;
    }>;
    private bulkCreateSettingsToVersionNsT;
    private batchUpdateSettingsToVersionT;
}
