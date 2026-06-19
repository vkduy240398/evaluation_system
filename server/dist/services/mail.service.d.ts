import { SendMailBody, SendMailNowBody, SendMailRemindBody } from 'src/interfaces/service/mailSetting.service.interface';
import { EditMailTemplateObj } from 'src/model/request/MailManagementDto';
import { TemplateMailId } from 'src/enum/TemplateMailId';
import { EvaluationPeriod } from 'src/entity/EvaluationPeriod';
import { Evaluator } from 'src/entity/Evaluator';
import { EvaluatorInfo } from 'src/interfaces/service/evaluation.service.interface';
import { Transaction } from 'sequelize';
import { Request } from 'express';
export declare class MailService {
    private userRepo;
    private evaluationPeriodRepo;
    private evaluationRepo;
    private proSkillSettingRepo;
    private proSkillRepo;
    private mailSettingRepo;
    private historyCronJobRepository;
    DATE_FORMAT: string;
    sendMailStartGoalSetting(period: any, type: number, listToMail: string[], ccEmail: string[]): Promise<any>;
    sendMailStartEvaluation(period: any, type: number, listToMail: string[], ccEmail: string[]): Promise<any>;
    sendMailRejectGoalSetting(evaluatorId: number, rejecteeId: number, ownerId: number, evaluationId: number, status: number, rejectCcList: any, hostName: string, type: string, companyGroupCode: string): Promise<any>;
    sendMailApproveGoalSetting(approverId: number, ownerId: number, evaluationId: number, host: string, companyGroupCode: string): Promise<any>;
    sendMailEvaluatorApproved(evaluators: Evaluator[] | EvaluatorInfo[], ownerId: number, evaluationId: number, host: string, companyGroupCode: string): Promise<any>;
    submitGoalAndEvaluation(submitTo: number, ownerId: number, evaluationInfo: any, host: string): Promise<any>;
    sendMailPublicAllEvaluationForUser(list: any, host: string, companyGroupCode: string): Promise<void>;
    sendMailPublicAllEvaluationForEvaluator(list: any, host: string, companyGroupCode: string): Promise<void>;
    submitProSkill(data: any, host: string, companyGroupCode: string): Promise<any>;
    sendMailApproveProSkillToAdmin(data: any, hostName: string, companyGroupCode: string): Promise<any>;
    sendMailApproveProSkillToOther(data: any, approverId: number, hostName: string, companyGroupCode: string): Promise<any>;
    sendMailRejectProSkill(data: any, approverId: number, hostName: string, companyGroupCode: string): Promise<any>;
    sendMailPublicBasicAndBehavior(version: string, subVersion: string, hostName: string, type: number, level: number): Promise<any>;
    sendMailRejectProSkillFromAdmin(versionId: any, rejecterId: number, hostName: string, companyGroupCode: string): Promise<any>;
    sendMailFixedGoal(data: SendMailNowBody, mailList: string[], companyGroupCode: string, evaluationPeriodId?: number, type?: number): Promise<{
        message: string;
    }>;
    sendMailFixedUserEvaluator(data: any, object: any, companyGroupCode: string, transaction?: Transaction): Promise<{
        message: string;
    }>;
    sendMailFixedEvaluator(data: any, object: any, companyGroupCode: string, transaction: Transaction, emailHR: string): Promise<{
        message: string;
    }>;
    getFullNameEmailByStatus(evaluation: {
        status: number;
        user_full_name: string;
        evaluator_05_full_name: string;
        evaluator_1_full_name: string;
        evaluator_2_full_name: string;
        user_email: string;
        evaluator_05_email: string;
        evaluator_1_email: string;
        evaluator_2_email: string;
    }): {
        email: string;
        fullName: string;
        isSendEvaluator: boolean;
    };
    sendMailNotFixed(data: SendMailRemindBody, transaction: any, emailHR: string): Promise<{
        message: string;
    }>;
    saveMailTemplate(body: SendMailBody, companyGroupCode: string, isCreateHistoryCronjob: boolean): Promise<any>;
    getMailHistoryList(query: any, req: Request): Promise<any>;
    updateMailHistory(body: any, id: number, req: Request): Promise<any>;
    deleteMail(id: number): Promise<any>;
    getTitleContentFromTemplateMailId(idTemplateMail: TemplateMailId, companyGroupCode: string): Promise<{
        title: string;
        content: string;
    }>;
    getRawMailTemplate(idTemplateMail: TemplateMailId, companyGroupCode: string): Promise<{
        id: number;
        name: string;
        subject: string;
        content: string;
        note: string;
    }>;
    getSettingSendMailRemindGoalUserPeriod(companyGroupCode: string): Promise<{
        goalActive: number;
        goalDays: number[];
        companyGroupCode: string;
    }[]>;
    getSettingSendMailRemindEvalPeriod(companyGroupCode: string): Promise<{
        evalActive: number;
        evalDays: number[];
        companyGroupCode: string;
    }[]>;
    sendMailCustoms(toEmails: any[], ccEmail: string[], titleEmail: string, infoEmail: string): Promise<any>;
    getMailNotificateEvaluation(year: string, periodIndex: string, companyGroupCode: string): Promise<{
        title: string;
        content: string;
    }>;
    getMailNotificateGoalSetting(year: string, periodIndex: string, companyGroupCode: string): Promise<{
        title: string;
        content: string;
    }>;
    getMailNotificateEvaluationException(year: string, periodIndex: string, companyGroupCode: string): Promise<{
        title: string;
        content: string;
    }>;
    getMailNotificateGoalSettingException(year: string, periodIndex: string, companyGroupCode: string): Promise<{
        title: string;
        content: string;
    }>;
    getMailNotiGoalFixedUserAndEvaluatorWOTime(period: EvaluationPeriod, companyGroupCode: string): Promise<{
        title: string;
        content: string;
    }>;
    getMailNotiGoalFixedEvaluatorWOTime(period: EvaluationPeriod, companyGroupCode: string, evaluationId?: number): Promise<{
        title: string;
        content: string;
    }>;
    getMailNotiGoalFixedUserAndEvaluator(period: EvaluationPeriod, companyGroupCode: string): Promise<{
        title: string;
        content: string;
    }>;
    getMailNotiEvalFixedUserAndEvaluatorWOTime(period: EvaluationPeriod, companyGroupCode: string): Promise<{
        title: string;
        content: string;
    }>;
    getMailNotiEvalFixedEvaluatorWOTime(period: EvaluationPeriod, companyGroupCode: string, evaluationId?: number): Promise<{
        title: string;
        content: string;
    }>;
    getMailNotiEvalFixedUserAndEvaluator(period: EvaluationPeriod, companyGroupCode: string): Promise<{
        title: string;
        content: string;
    }>;
    getMailNotiGoalNotFixed(year: string, period_index: number, date_end: string, listEmailGoal: string[], companyGroupCode: string): Promise<{
        title: string;
        content: string;
    }>;
    getMailNotiEvalNotFixed(year: string, period_index: number, date_end: string, listEmailEval: string[], companyGroupCode: string): Promise<{
        title: string;
        content: string;
    }>;
    getSendMailCreateFeedback(data: {
        userName: string;
        departmentName: string;
        companyName: string;
        feedbackId: number;
        overview: string;
        typeFeedback: number;
    }, companyGroupCode: string): Promise<{
        title: string;
        content: string;
    }>;
    getSendMailUpdateFeedback(data: {
        userName: string;
        feedbackId: number;
        status: string;
    }, companyGroupCode: string): Promise<{
        title: string;
        content: string;
    }>;
    getSendMailCommentFeedback(data: {
        feedbackId: number;
        listFullName: string[];
        typeFeedback: number;
    }, companyGroupCode: string, typeAddComment: number): Promise<{
        title: string;
        content: string;
    }>;
    getSendMailDeleteComment(data: {
        feedbackId: number;
        listFullName: string[];
        typeFeedback: number;
    }, companyGroupCode: string, typeAddComment: number): Promise<{
        title: string;
        content: string;
    }>;
    getMailTemplateList(query: {
        name: string;
    }, req: Request): Promise<import("../entity/MailTemplate").MailTemplate>;
    getMailTemplateListById(query: {
        id: number;
    }, req: Request): Promise<import("../entity/MailTemplate").MailTemplate>;
    editMailTemplate(body: EditMailTemplateObj, req: Request): Promise<import("../entity/MailTemplate").MailTemplate>;
    getMailTemplateById(id: number): Promise<import("../entity/MailTemplate").MailTemplate>;
}
