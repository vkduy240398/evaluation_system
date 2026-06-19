import { CreationUserDto } from './CreationUserDto';
export declare class VersionNotificationDto {
    id: number;
    version: number;
    subVersion: number;
    versionDisplay: string;
    status: number;
    creationUser: number;
    reason: string;
    content: string;
    publicDate: string;
    updatedTime: Date;
    lastUpdatedTime: string;
    user?: CreationUserDto;
    existEditingVersion: boolean;
}
