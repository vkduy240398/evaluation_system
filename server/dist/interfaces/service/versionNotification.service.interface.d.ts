import { VersionNotificationDto } from 'src/model/generic/VersionNotificationDto';
import { ListVersionNotificationParam } from 'src/model/request/F6/ListVersionNotificationParam';
import { ListVersionNotificationResponse } from 'src/model/response/F6/ListVersionNotificationResponse';
import { Request } from 'express';
import { ErrorMessageResponseDto } from 'src/model/response/ErrorMessageResponseDto';
import { CancelVersionNotificationDto } from 'src/model/request/F6/CancelVersionNotificationDto';
import { VersionNotification } from 'src/entity/VersionNotification';
import { VersionDateValidation } from 'src/model/response/F6/VersionDateValidation';
import { PublicVersionNotificationDto } from 'src/model/request/F6/PublicVersionSettingDto';
export interface VersionNotificationServiceI {
    getListVersionNotification(param: ListVersionNotificationParam, companyGroupCode?: string): Promise<ListVersionNotificationResponse>;
    getDetailNotification(versionId: number, companyGroupCode?: string): Promise<VersionNotificationDto>;
    saveDraftVersionNotification(versionNotificationDto: VersionNotificationDto, type: string, req: Request): Promise<VersionNotificationDto | ErrorMessageResponseDto>;
    cancelVersionNotification(data: CancelVersionNotificationDto, companyGroupCode?: string): Promise<VersionNotification>;
    savePublicVersionNotification(versionNotificationDto: VersionNotificationDto, req: Request): Promise<VersionDateValidation | ErrorMessageResponseDto | VersionNotificationDto>;
    findMaxSubVersion(version: number, companyGroupCode?: string): Promise<number>;
    getPublicNotification(companyGroupCode?: string): Promise<VersionNotificationDto>;
    publicVersionNotification(publicVersionNotificationDto: PublicVersionNotificationDto, companyGroupCode: string, timeZone: string): Promise<PublicVersionNotificationDto | VersionDateValidation>;
}
