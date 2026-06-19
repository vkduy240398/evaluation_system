import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
export declare class GetManagementEvaluationProDto {
    departmentId: number;
    limit: number;
    offset: number;
}
export declare class GetManagementEvaluationSkillDto {
    skillId: number;
    detailed: boolean;
    limit: number;
    offset: number;
}
export declare class GetManagementEvaluationProByDivisionIdDto {
    divisionId: number;
    limit: number;
    offset: number;
}
export declare class IsNumberOrArray implements ValidatorConstraintInterface {
    validate(text: any, _args: ValidationArguments): boolean;
    defaultMessage(_args: ValidationArguments): string;
}
export declare class UpdateSettingEvaluationProParamDto {
    departmentId: number;
}
export declare class GetGroupDto {
    divisionId: number;
    limit: number;
    offset: number;
}
export declare class CreateGroupDto {
    divisionId: number;
    groupName: string;
    departmentIds: number[];
}
export declare class DeleteGroupDto {
    groupId: number;
}
export declare class UpdateGroupParamDto {
    groupId: number;
}
export declare class UpdateGroupBodyDto {
    groupName: string;
    departmentIds: number[];
}
export declare class UpdateSettingEvaluationProDto {
    divisionId: number;
    skillSetters: number[];
    skillApprovers: number[];
    isCheckedDep?: boolean | undefined;
    isCheckedDiv?: boolean | undefined;
    isCheckedGroup?: boolean | undefined;
    group?: number | undefined;
    groups: number[] | undefined;
}
export declare class UpdateSettingEvaluationProMultipleDto {
    departmentIds: number[];
    skillSetters: number[];
    skillApprovers: number[];
    divisionId: number;
    isCheckedDep?: boolean | undefined;
    isCheckedDiv?: boolean | undefined;
    isCheckedGroup?: boolean | undefined;
    group?: number | undefined;
    groups: number[] | undefined;
}
export declare class UserPeriodExceptionParamDto {
    year: number;
    periodIndex: number;
    limit: number;
    offset: number;
}
export declare class EvaluationSearchDto {
    offset: number;
    limit: number;
    sortBy: string;
    sortType: string;
    email: string;
    department: string;
    yearDisplayCalendar: string;
    salaryRank: string;
    periodEvaluate: string;
    stringStatus: string;
    sortColumns: string[];
    sortDirections: string[];
    departmentSearch: {
        name: string;
        type: number;
    };
    divisionSearch: {
        name: string;
        type: number;
    };
}
