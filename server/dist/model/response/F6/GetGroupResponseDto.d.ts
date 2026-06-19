declare class GroupDto {
    id: number;
    groupName: string;
    departmentIds: number[];
    departmentArrString: string;
    key: string;
}
export declare class GetGroupResponseDto {
    results: GroupDto[];
    count: number;
}
export {};
