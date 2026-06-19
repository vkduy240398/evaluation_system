import { GetMailHistoryListDTO } from 'src/model/request/ExceptionPeriodRequestDto';
import { Request } from 'express';
import { EditMailTemplateObj, GetMailTemplateListDTO } from 'src/model/request/MailManagementDto';
export declare class ManagementEvaluationSettingRoleController {
    private userService;
    private mailService;
    getUsersEmailList(conditions: any, req: Request): Promise<any>;
    getMailHistoryList(query: GetMailHistoryListDTO, req: Request): Promise<any>;
    updateMailHistory(body: any, id: number, req: Request): Promise<any>;
    deleteMail(id: number): Promise<any>;
    importUserFromExcel(body: any): Promise<{
        listUserCanotImport: any[];
        listEvaluatorCannotSetting: unknown[];
    }>;
    getMailTemplateList(query: GetMailTemplateListDTO, req: Request): Promise<import("../../entity/MailTemplate").MailTemplate>;
    getMailTemplateListById(query: any, req: Request): Promise<import("../../entity/MailTemplate").MailTemplate>;
    editMailTemplate(body: EditMailTemplateObj, req: Request): Promise<import("../../entity/MailTemplate").MailTemplate>;
}
