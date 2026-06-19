import { HistoryMail } from 'src/entity/HistoryMail';
import { MailTemplate } from 'src/entity/MailTemplate';
import { MailSettingRepositoryI } from 'src/interfaces/repository/mailSetting.repository.interface';
import { EditMailTemplateObj } from 'src/model/request/MailManagementDto';
import { Request } from 'express';
export declare class MailSettingRepository implements MailSettingRepositoryI {
    private historyMailEnity;
    private mailTemplateEntity;
    saveMailTemplate(body: any): Promise<any>;
    getMailHistoryList(query: any, req: Request): Promise<any>;
    updateMailHistory(body: any, id: number): Promise<any>;
    findOne(query: {
        [x: string]: any;
    }): Promise<HistoryMail>;
    deleteMail(id: number, transaction: any): Promise<any>;
    transaction(): Promise<any>;
    transactionMailTemplate(): Promise<any>;
    getMailTemplateList(query: any, req: Request): Promise<any>;
    getMailTemplateListById(query: any, req: Request): Promise<any>;
    editMailTemplate(body: EditMailTemplateObj, req: Request): Promise<any>;
    getMailTemplateById(object: {
        [x: string]: any;
    }): Promise<MailTemplate>;
    getListMailTemplateById(object: {
        [x: string]: any;
    }): Promise<MailTemplate[]>;
}
