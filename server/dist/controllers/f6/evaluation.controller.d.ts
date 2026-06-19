import { Request } from 'express';
import { VersionNotificationDto } from 'src/model/generic/VersionNotificationDto';
import { VersionSetting810Dto, VersionSetting810NSDto, VersionSettingDto } from 'src/model/generic/VersionSettingDto';
import { CalculatorDetail810Dto, CalculatorDetail810NSDto } from 'src/model/request/CalculatorDetail810Dto';
import { AddProSkillDto } from 'src/model/request/F6/AddProSkillDto';
import { CancelVersionNotificationDto } from 'src/model/request/F6/CancelVersionNotificationDto';
import { EditProskillDto } from 'src/model/request/F6/EditProskillDto';
import { ListEvaluationCalculationHistoryDto } from 'src/model/request/F6/ListEvaluationCalculationHistoryDto';
import { ListVersionNotificationParam } from 'src/model/request/F6/ListVersionNotificationParam';
import { PublicVersionNotificationDto } from 'src/model/request/F6/PublicVersionSettingDto';
import { ListEvaluationCriteriaHistoryRequestDto } from 'src/model/request/ListEvaluationCriteriaHistoryRequestDto';
import { ListEvaluationItemHistoryRequestDto } from 'src/model/request/ListEvaluationItemHistoryRequestDto';
import { GetManagementEvaluationSkillDto } from 'src/model/request/ManagementEvaluationProDto';
import { PublicVersionSettingDto } from 'src/model/request/PublicVersionSettingDto';
import { ListEvaluationCalculationHistoryResponseDto } from 'src/model/response/F6/ListEvaluationCalculationResponseDto';
import { ListVersionNotificationResponse } from 'src/model/response/F6/ListVersionNotificationResponse';
export declare class ManagementEvaluationRoleController {
    private managementEvaluationService;
    private versionSettingService;
    private versionSettingNsService;
    private adminEvaluationService;
    private guideEvaluationService;
    private proSkillSettingServices;
    private basicBehaviorServices;
    private evaluationServices;
    private versionNotificationService;
    private proSkillServices;
    private settingReviewService;
    private settingDefaultPeriodServices;
    getSettingEvaluationSkills(query: GetManagementEvaluationSkillDto, req: Request): Promise<{
        dataList: {
            skillId: number;
            skillName: string;
            skillSetters: {
                fullName: string;
                id: number;
            }[];
            skillApprovers: {
                fullName: string;
                id: number;
            }[];
            skillDepartments: {
                departmentId: number;
                departmentName: string;
            }[];
            key: string;
        }[];
        count: number;
    }>;
    deleteAdminEvalutionSkill(skillId: number): Promise<{
        code: number;
        reason: string;
    } | {
        code: number;
        reason: boolean;
    }>;
    getUserActive(req: Request): Promise<{
        setters: any[];
        approvers: any[];
    }>;
    getListCommonSkill(query: any, req: Request): Promise<{
        dataSources: any[];
        counts: any;
    }>;
    detailEvaluationItem(id: number, query: any, req: Request): Promise<{
        data: any;
        subVersion: any;
        listPoints: any[];
        edited: boolean;
    }>;
    saveDraftEvaluationItem(req: Request): Promise<{
        fullName: any;
        versionId: any;
        timer: any;
        subVersion: any;
        version: any;
        status: any;
        lastUpdatedTime: any;
        edited: boolean;
        code: number;
    }>;
    savePublicVersionEvaluationItem(id: number, req: Request): Promise<{
        code: number;
        start: string;
        end: string;
        id?: undefined;
        status?: undefined;
        type?: undefined;
    } | {
        code: number;
        id: any;
        status: number;
        type: any;
        start?: undefined;
        end?: undefined;
    } | {
        id: any;
        status: any;
        type: any;
        code?: undefined;
        start?: undefined;
        end?: undefined;
    }>;
    cancelVersionEvaluationItem(versionId: number, req: Request, body: any): Promise<any>;
    getListEvaluationCalculationHistory(query: ListEvaluationCalculationHistoryDto, req: Request): Promise<ListEvaluationCalculationHistoryResponseDto>;
    getDetailEvaluationCalculation(id: number, req: Request): Promise<VersionSettingDto>;
    getDetailEvaluationCalculationNs(id: number, req: Request): Promise<VersionSettingDto>;
    getDetailEvaluationCalculationCommon(id: number, req: Request): Promise<VersionSettingDto>;
    saveDraftVersionSettingCommon(req: Request, type: string, dto: VersionSettingDto): Promise<any>;
    findListEvaluationCriteriaHistory(query: ListEvaluationCriteriaHistoryRequestDto, req: Request): Promise<{
        data: import("../../entity/VersionGuideEvaluation").VersionGuideEvaluation[];
        counts: number;
    }>;
    getHistoryApproveContent(versionId: number, userId: number): Promise<{
        info: {
            version: string;
            skill: string;
        };
        approvalHistories: any[];
    }>;
    findListEvaluationItemHistory(query: ListEvaluationItemHistoryRequestDto, req: Request): Promise<{
        data: import("../../entity/VersionProSkill").VersionProSkill[];
        counts: number;
    }>;
    getData810(versionId: number, req: Request): Promise<VersionSetting810Dto>;
    getData810NS(versionId: number, req: Request): Promise<VersionSetting810NSDto>;
    detailCriteria(id: number, req: Request): Promise<{
        isShowEdit: boolean;
        data: {
            id: number;
            level: string;
            versionId: number;
            createdTime: string;
            creationUser: number;
            publicDate: string;
            reason: string;
            status: number;
            subVersion: number;
            type: number;
            updatedTime: string;
            statusName: string;
            updatedBy: string;
            version: number;
            timer: Date;
            contentEvaluationCriteria: string;
            contentNotes: string;
            lastUpdatedTime: string;
        };
        subVersion: unknown;
    }>;
    publicVersion(id: number, req: Request): Promise<[affectedCount: number, affectedRows: import("../../entity/VersionGuideEvaluation").VersionGuideEvaluation[]]>;
    saveDraft(req: Request): Promise<{
        fullName: any;
        versionId: any;
        timer: Date;
        subVersion: any;
        version: any;
        lastUpdatedTime: any;
        id: any;
        status: any;
        code: number;
        edited?: undefined;
        updatedTime?: undefined;
    } | {
        fullName: any;
        versionId: any;
        timer: Date;
        subVersion: any;
        version: any;
        lastUpdatedTime: any;
        id: any;
        status: any;
        edited: boolean;
        code: number;
        updatedTime?: undefined;
    } | {
        fullName: any;
        versionId: any;
        timer: Date;
        subVersion: any;
        version: any;
        lastUpdatedTime: any;
        id: number;
        updatedTime: Date;
        code: number;
        status?: undefined;
        edited?: undefined;
    }>;
    cancelVersion(versionId: number, req: Request, body: any): Promise<[affectedCount: number]>;
    savePrivateVersion(id: number, req: Request): Promise<{
        id: number;
        status: number;
        type: any;
        contentEvaluationCriteria?: undefined;
        contentNotes?: undefined;
        creationUser?: undefined;
        reason?: undefined;
    } | {
        id: any;
        status: number;
        type: any;
        contentEvaluationCriteria: any;
        contentNotes: any;
        creationUser: any;
        reason: any;
    }>;
    savePublicVersion(id: number, req: Request): Promise<{
        code: number;
        id: any;
        status: number;
        type: any;
        contentEvaluationCriteria?: undefined;
        contentNotes?: undefined;
        creationUser?: undefined;
        reason?: undefined;
    } | {
        id: number;
        status: number;
        type: any;
        code?: undefined;
        contentEvaluationCriteria?: undefined;
        contentNotes?: undefined;
        creationUser?: undefined;
        reason?: undefined;
    } | {
        id: any;
        status: number;
        type: any;
        contentEvaluationCriteria: any;
        contentNotes: any;
        creationUser: any;
        reason: any;
        code?: undefined;
    }>;
    getDetailProSkill(id: number): Promise<any>;
    publicVersionById(id: number, body: Request, req: Request): Promise<{
        code: number;
        isDuringGoalSetting: true;
        goalSettingStart: string;
        goalSettingEnd: string;
        evaluationStart: string;
        evaluationEnd: string;
        updatedTime?: undefined;
        version?: undefined;
        publicDate?: undefined;
        publicStatus?: undefined;
        versionMain?: undefined;
        subVersion?: undefined;
        status?: undefined;
        id?: undefined;
    } | {
        updatedTime: Date;
        version: string;
        publicDate: string;
        publicStatus: number;
        versionMain: number;
        subVersion: number;
        status: number;
        id: number;
        code?: undefined;
        isDuringGoalSetting?: undefined;
        goalSettingStart?: undefined;
        goalSettingEnd?: undefined;
        evaluationStart?: undefined;
        evaluationEnd?: undefined;
    }>;
    rejectVersionById(id: number, body: Request, req: Request): Promise<{
        updatedTime: Date;
        version: string;
        publicDate: string;
        publicStatus: number;
        versionMain: number;
        subVersion: number;
        status: number;
        id: number;
        rejectComment: string;
    }>;
    getNextVersion810(version: number, req: Request): Promise<any>;
    getNextVersion810NS(version: number, req: Request): Promise<any>;
    listUserEvaluationPeriod(params: any, req: Request): Promise<any>;
    saveDraftSetting(params: CalculatorDetail810Dto, req: Request): Promise<any>;
    saveDraftSettingNS(params: CalculatorDetail810NSDto, req: Request): Promise<any>;
    savePublicOrPrivate(params: CalculatorDetail810Dto, req: Request): Promise<any>;
    savePublicOrPrivateNS(params: CalculatorDetail810NSDto, req: Request): Promise<any>;
    checkDatePublic(req: Request): Promise<boolean>;
    cancelSetting(id: number, params: any, req: Request): Promise<any>;
    publicVersionSetting(req: Request, publicVersionSettingDto: PublicVersionSettingDto): Promise<any>;
    publicVersionSettingCommon(req: Request, publicVersionSettingDto: PublicVersionSettingDto): Promise<any>;
    getMaxSubVersion(version: number, type: number, req: Request): Promise<number>;
    savePublicDetailCalculationCommon(req: Request, dto: VersionSettingDto): Promise<any>;
    saveDraftVersionSetting17(req: Request, type: string, dto: VersionSettingDto): Promise<any>;
    saveDraftVersionSetting17ns(req: Request, type: string, dto: VersionSettingDto): Promise<any>;
    cancelVersionSetting(id: number, body: any, req: Request): Promise<boolean>;
    savePublicDetailCalculation(req: Request, dto: VersionSettingDto): Promise<any>;
    basicBehaviorPublicVersion(id: number, req: Request): Promise<any>;
    savePublicDetailCalculationNs(req: Request, dto: VersionSettingDto): Promise<any>;
    getListVersionNotification(query: ListVersionNotificationParam, req: Request): Promise<ListVersionNotificationResponse>;
    getDetailNotification(id: number, req: Request): Promise<VersionNotificationDto>;
    saveDraftVersionNotification(req: Request, type: string, dto: VersionNotificationDto): Promise<import("../../model/response/ErrorMessageResponseDto").ErrorMessageResponseDto | VersionNotificationDto>;
    cancelVersionNotification(id: number, body: CancelVersionNotificationDto, req: Request): Promise<import("../../entity/VersionNotification").VersionNotification>;
    savePublicDetailNotification(req: Request, dto: VersionNotificationDto): Promise<import("../../model/response/ErrorMessageResponseDto").ErrorMessageResponseDto | VersionNotificationDto | import("../../model/response/F6/VersionDateValidation").VersionDateValidation>;
    getMaxSubVersionNotification(version: number, req: Request): Promise<number>;
    publicVersionNotification(publicVersionSettingDto: PublicVersionNotificationDto, req: Request): Promise<import("../../model/response/F6/VersionDateValidation").VersionDateValidation | PublicVersionNotificationDto>;
    getAllDepartmentsWithSubClass(req: Request): Promise<import("../../entity/Department").Department[]>;
    addProSkill(payload: AddProSkillDto, req: Request): Promise<import("../../entity/Skill").Skill>;
    editProSkill(skillId: number, payload: EditProskillDto, req: Request): Promise<import("../../entity/Skill").Skill>;
    getListDep_TempExport(params: any, req: Request): Promise<any[]>;
    dep_TempProSkillExport(params: any, req: Request): Promise<{
        departmentName: any;
        jobType: any;
        mediumClass: any;
        smallClass: any;
        content: any;
        difficulty: any;
        note: any;
    }[]>;
    searchListUserToSettingEvaluationHistoryReference(query: any, req: Request): Promise<{
        data: import("../../entity/User").User[];
        counts: number;
    }>;
    getAllUser(req: Request): Promise<import("../../entity/User").User[]>;
    addEditUser(data: any, req: Request): Promise<boolean>;
    listDepartment(req: Request): Promise<import("../../entity/Department").Department[]>;
    listSettingReviewHistory(query: any, req: Request): Promise<{
        data: any[];
        counts: any;
        pageSize: number;
    }>;
    saveNumberPeriod(payload: any, req: Request): Promise<import("../../entity/SettingDefaultPeriod").SettingDefaultPeriod>;
    findOne(req: Request): Promise<import("../../entity/SettingDefaultPeriod").SettingDefaultPeriod>;
    deleteHistoryReference(payload: any, query: any, req: Request): Promise<{
        data: any[];
        counts: any;
        pageSize: number;
    }>;
}
