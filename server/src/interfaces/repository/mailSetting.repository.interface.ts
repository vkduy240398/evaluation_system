import { HistoryMail } from 'src/entity/HistoryMail';
import { Transaction } from 'sequelize';
import { MailTemplate } from 'src/entity/MailTemplate';
import { EditMailTemplateObj } from 'src/model/request/MailManagementDto';
import { Request } from 'express';

export interface MailSettingRepositoryI {
  saveMailTemplate(body: any): Promise<any>;
  getMailHistoryList(query: any, req: Request): Promise<any>;
  updateMailHistory(body: any, id: number): Promise<any>;
  findOne(query: { [x: string]: any }): Promise<HistoryMail>;
  deleteMail(id: number, transaction: any): Promise<any>;
  getMailTemplateList(
    query: { name: string },
    req: Request,
  ): Promise<MailTemplate>;
  getMailTemplateListById(
    query: { id: number },
    req: Request,
  ): Promise<MailTemplate>;
  editMailTemplate(
    body: EditMailTemplateObj,
    req: Request,
  ): Promise<MailTemplate>;
  transaction(): Promise<Transaction>;
  transactionMailTemplate(): Promise<Transaction>;
  getMailTemplateById(query: any): Promise<MailTemplate>;
  getListMailTemplateById(query: any): Promise<MailTemplate[]>;
  hasRecentDuplicateMail(
    condition: {
      evaluationPeriodId: number;
      type: number;
      mailTo: string;
      sendTimeSetting: string | null;
      companyGroupCode: string;
    },
    withinSeconds: number,
  ): Promise<boolean>;
}
