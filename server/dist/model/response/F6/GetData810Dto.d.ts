declare class Additional {
    id: number;
    versionId: number;
    rating: string;
    point: string;
    note: string;
}
declare class TotalPoint {
    id: number;
    versionId: number;
    point: string;
    result: string;
    note: string;
}
export declare class GetData810Dto {
    goals: any[];
    additional: Additional[];
    totalPoint: TotalPoint[];
    data: any;
    isHaveEditRecord: boolean;
}
export {};
