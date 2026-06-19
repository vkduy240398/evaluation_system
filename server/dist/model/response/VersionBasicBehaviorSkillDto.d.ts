import { ListBasicBehaviorSkillDto } from './ListBasicBehaviorSkillDto';
export declare class VersionBasicBehaviorSkillDto {
    id: number;
    version: string;
    versionMain: number;
    versionSub: number;
    type: string;
    status: number;
    level: number;
    userUpdated: string;
    reason: string;
    publicDate: string;
    lastUpdatedTime: string;
    updatedTime: Date;
    children: ListBasicBehaviorSkillDto[];
}
