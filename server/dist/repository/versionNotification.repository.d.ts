import { Transaction } from 'sequelize';
import { VersionNotification } from 'src/entity/VersionNotification';
import { VersionNotificationRepositoryI } from 'src/interfaces/repository/versionNotification.repository.interface';
import { VersionNotificationDto } from 'src/model/generic/VersionNotificationDto';
import { ListVersionNotificationParam } from 'src/model/request/F6/ListVersionNotificationParam';
export declare class VersionNotificationRepository implements VersionNotificationRepositoryI {
    private versionNotificationEntity;
    getListVersionPaging(param: ListVersionNotificationParam, companyGroupCode?: string): Promise<VersionNotification[]>;
    countListVersionNotification(param: ListVersionNotificationParam, companyGroupCode?: string): Promise<number>;
    getVersionNotificationById(versionId: number, companyGroupCode?: string): Promise<VersionNotification>;
    existEditingVersion(versionId: number, companyGroupCode?: string): Promise<boolean>;
    isMainVersionPublic(version: number, companyGroupCode?: string): Promise<boolean>;
    findMaxSubVersion(version: number, companyGroupCode?: string): Promise<VersionNotification>;
    createVersionNotification(data: any, t?: Transaction): Promise<VersionNotification>;
    updateVersionNotification(data: VersionNotificationDto, companyGroupCode?: string, t?: Transaction): Promise<[affectedCount: number]>;
    getVersionUpdatedTime(versionId: number): Promise<VersionNotification>;
    findUpdateTimeVersion(id: number, companyGroupCode?: string): Promise<VersionNotification>;
    findMaxVersion(companyGroupCode?: string): Promise<VersionNotification>;
    unPublicVersionSetting(idException: number, transaction: Transaction, companyGroupCode?: string): Promise<boolean>;
    getNewTransaction(): Promise<Transaction>;
    getPublicVersionNotification(companyGroupCode?: string): Promise<VersionNotification>;
    findVersionById(versionId: number): Promise<VersionNotification>;
    publicVersionSetting(versionId: number, data: any, companyGroupCode: string): Promise<boolean>;
    create(dto: any): Promise<VersionNotification>;
}
