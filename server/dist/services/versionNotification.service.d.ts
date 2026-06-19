import { ListVersionNotificationParam } from 'src/model/request/F6/ListVersionNotificationParam';
import { VersionNotificationServiceI } from 'src/interfaces/service/versionNotification.service.interface';
import { VersionNotificationDto } from 'src/model/generic/VersionNotificationDto';
import { ListVersionNotificationResponse } from 'src/model/response/F6/ListVersionNotificationResponse';
import { Request } from 'express';
import { CancelVersionNotificationDto } from 'src/model/request/F6/CancelVersionNotificationDto';
import { ErrorMessageResponseDto } from 'src/model/response/ErrorMessageResponseDto';
import { PublicVersionNotificationDto } from 'src/model/request/F6/PublicVersionSettingDto';
export declare class VersionNotificationService implements VersionNotificationServiceI {
    private versionNotificationRepository;
    private evaluationPeriodRepository;
    getListVersionNotification(param: ListVersionNotificationParam, companyGroupCode?: string): Promise<ListVersionNotificationResponse>;
    getDetailNotification(versionId: number, companyGroupCode?: string): Promise<VersionNotificationDto>;
    saveDraftVersionNotification(versionNotificationDto: VersionNotificationDto, type: string, req: Request): Promise<ErrorMessageResponseDto | VersionNotificationDto>;
    cancelVersionNotification(data: CancelVersionNotificationDto, companyGroupCode?: string): Promise<import("../entity/VersionNotification").VersionNotification>;
    savePublicVersionNotification(versionNotificationDto: VersionNotificationDto, req: Request): Promise<ErrorMessageResponseDto | VersionNotificationDto>;
    findMaxSubVersion(version: number, companyGroupCode?: string): Promise<number>;
    getPublicNotification(companyGroupCode?: string): Promise<VersionNotificationDto>;
    publicVersionNotification(publicVersionNotificationDto: PublicVersionNotificationDto, companyGroupCode: string, timeZone: string): Promise<PublicVersionNotificationDto>;
}
