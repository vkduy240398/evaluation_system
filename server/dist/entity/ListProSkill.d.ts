import { Model } from 'sequelize-typescript';
import { VersionProSkill } from './VersionProSkill';
export declare class ListProSkill extends Model {
    id: number;
    itemId: string;
    versionId: number;
    jobType: string;
    mediumClass: string;
    smallClass: string;
    content: string;
    difficulty: number;
    note: string;
    versionProSkill: VersionProSkill;
}
