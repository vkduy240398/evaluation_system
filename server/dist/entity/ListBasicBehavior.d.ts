import { Model } from 'sequelize-typescript';
import { VersionBasicBehavior } from './VersionBasicBehavior';
export declare class ListBasicBehavior extends Model {
    idItem: number;
    versionId: number;
    title: string;
    content: string;
    difficulty: number;
    versionBasicBehavior: VersionBasicBehavior;
}
