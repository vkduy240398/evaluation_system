import { EvaluationByPeriodType } from 'src/interfaces/service/evaluationPeriod.interface';
import { EmailType, EmailTypeFixed } from 'src/enum/TemplateMailId';
export declare class ExceptionPeriodParamDto {
    departmentId: number;
    companyId: number;
    periodId: number;
    searchField: string;
    limit: number;
    offset: number;
}
export declare class EvaluationByPeriodParamDto {
    userId: number;
    year: number;
    periodIndex: number;
}
export declare class UpdateEvaluationPeriodExceptionDto {
    evaluations: EvaluationByPeriodType[];
    userId: number;
    deleteIds: number[];
    year: number;
    periodIndex: number;
}
export declare class PeriodDTO {
    year: number;
    periodIndex: number;
}
export declare class ListPeriodDTO {
    yearStart: number;
    yearEnd: number;
}
declare class SavePeriodConditionDTO {
    year: string;
    periodIndex: number;
}
export declare class SavePeriodDTO {
    body: any;
    condition: SavePeriodConditionDTO;
}
export declare class ListUserPeriodDTO {
    stringStatus: string;
    periodId: number;
    type: string;
}
export declare class GetToEmailListDTO {
    type: EmailType;
    year: string;
    periodIndex: string;
}
export declare class GetToEmailFixedListDTO {
    type: EmailTypeFixed;
    periodId: string;
    evaluationId: number;
}
export declare class CheckStatusRecordSendDTO {
    type: EmailTypeFixed;
}
export declare class SendMailBodyDTO {
    contentMail: string;
    content: string;
    evaluationPeriodId: number;
    mailTo: string;
    sendTimeActual: string | null;
    sendTimeSetting: string | null;
    status: number;
    title: string;
    type: number;
    cronjobId?: number;
    mailToObjList?: string[];
    dataMailCCs?: any[];
}
export declare class SendMailNowBodyDTO {
    toEmails: string[];
    mailContent: {
        subject: string;
        editor: string;
    };
}
export declare class SendMailNow2DTO {
    content: SendMailNowBodyDTO;
    inputedValues: SendMailBodyDTO;
}
export declare class GetMailHistoryListDTO {
    year: string;
    periodIndex: number;
    status: number;
    limit: number;
    offset: number;
}
export declare class ConfirmGoalDTO {
    periodId: number;
    checkFixed: number;
}
export declare class UpdateSettingEvaluatorOfOneUserDTO {
    evaluatorFirst: number;
    evaluatorHaft: number;
    evaluatorSecond: number;
    getValuaDelete05: string;
    skills: [];
    getValuaDelete10: string;
    state: State;
    userId: number;
}
export declare class UpdateSettingEvaluatorListUserDTO {
    evaluatorFirst: number;
    evaluatorHaft: number;
    evaluatorSecond: number;
    state: State;
    listUserSelected: any;
    userId: number;
}
export declare class ImportUserDTO {
    periodIndex: number;
    key: string;
    year: string;
    id: number;
    checkFixed: number;
    evaluationPeriod: string;
    goalRecord: number;
    evaluationRecord: number;
    evaluationConfirmRecord: number;
    totalRecord: number;
    goalFixedRecord: number;
    evaluationFixedRecord: number;
    evaluationConfirmFixedRecord: number;
    periodId: number;
    titile: string;
}
export declare class findListUserToSettingEvaluationDTO {
    department: string;
    division: string;
    nameAndEmail: string;
    limit: number;
    offset: number;
    sortBy: string;
    sortType: string;
    state: any;
}
export declare class SendMailDTO {
    emailType: number;
    evaluationPeriodId: String;
    goalEvaluation: string[];
    goaldepartmentEvaluation: string[];
    id: number[];
    mailContent: any;
    status: number;
    toEmails: string[];
    type: String;
}
export declare class DepartmentPeriodSettingItemDTO {
    departmentId: number;
    dateCreationGoalDepartmentStart: string;
    dateCreationGoalDepartmentEnd: string;
    dateCreationGoalStart: string;
    dateCreationGoalEnd: string;
    dateEvaluationDepartmentStart: string;
    dateEvaluationDepartmentEnd: string;
    dateEvaluationStart: string;
    dateEvaluationEnd: string;
    isDivisionLevel?: boolean;
    childDepartmentIds?: number[];
}
export declare class SavePeriodDepartmentSettingDTO {
    evaluationPeriodId: number;
    departments: DepartmentPeriodSettingItemDTO[];
}
export declare class ListPeriodDepartmentSettingDTO {
    evaluationPeriodId: string;
}
export declare class DeletePeriodDepartmentSettingDTO {
    id: number;
}
export declare class UndoFixEvaluationDTO {
    periodId: number;
    type: number;
}
interface State {
    periodIndex: Number;
    goals: String;
    departmentGoals: String;
    personalEvaluation: String;
    divisionEvaluate: String;
    key: String;
    year: String;
    id: Number;
    checkFixed: Number;
    evaluationPeriod: String;
    goalRecord: Number;
    evaluationRecord: Number;
    evaluationConfirmRecord: Number;
    totalRecord: Number;
    goalFixedRecord: Number;
    evaluationFixedRecord: Number;
    evaluationConfirmFixedRecord: Number;
    periodId: Number;
    goals810Time: String;
    goals17Time: String;
    title: String;
    department: String;
    isSearch: Boolean;
    current: Number;
    offset: Number;
    limit: Number;
}
export {};
