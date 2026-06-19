type ChildrenBasicBehavior = {
    id: string;
    versionId: number;
    title: string;
    difficulty: number;
    content: string;
};
export interface DetailBasicBehavior {
    id: number;
    versionId: number;
    createdTime: string;
    creationUser: number;
    publicDate: string;
    reason: string;
    status: number;
    subVersion: number;
    type: number;
    updatedTime: Date;
    statusName: string;
    updatedBy: string;
    lastUpdatedTime: string;
    version: number;
    timer: Date;
    children: ChildrenBasicBehavior[];
    level: number;
}
export {};
