"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pdf17Service = void 0;
const jspdf_autotable_1 = require("jspdf-autotable");
const EvaluationHelper_1 = require("../common/EvaluationHelper");
const Pdf17Helper_1 = require("../common/pdf/Pdf17Helper");
const ReportResponseDto_1 = require("../model/response/ReportResponseDto");
const Pdf17Helper2_1 = require("../common/pdf/Pdf17Helper2");
const jspdf_1 = require("jspdf");
const MsGothic_1 = require("../static/fonts/MS-Gothic/MsGothic");
const LEFT_BRACKET = '【';
const RIGHT_BRACKET = '】';
const YEAR = '年';
const SUFFIX = '評価表.pdf';
const MIME_LOGO = 'png';
const BASE64_IMAGE = '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';
class Pdf17Service {
    initDocument() {
        const doc = new jspdf_1.jsPDF();
        const mainFont = MsGothic_1.default;
        doc.addFileToVFS('MS-Gothic.ttf', mainFont);
        doc.addFont('MS-Gothic.ttf', 'msgothic-normal', 'normal');
        doc.setFont('msgothic-normal');
        return doc;
    }
    getPageHeight(doc) {
        return doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    }
    getPageWidth(doc) {
        return doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    }
    async exportEvaluationReportPdf(evaluation, type) {
        const fileName = this.getFileName(evaluation.user.fullName);
        let doc = this.initDocument();
        if (type === 1) {
            doc = this.getTemplateOneReportFrame(evaluation, doc);
        }
        if (type === 2) {
            doc = this.getTemplateTwoReportFrame(evaluation, doc);
        }
        if (type === 3) {
            doc = this.getTemplateThreeReportFrame(evaluation, doc);
        }
        const arrayBuffer = await doc.output('arraybuffer');
        const results = new ReportResponseDto_1.ReportResponseDto();
        results.filename = fileName;
        results.buffer = Buffer.from(arrayBuffer);
        return results;
    }
    getTemplateOneReportFrame(evaluation, doc) {
        const pageHeight = this.getPageHeight(doc);
        const pageWidth = this.getPageWidth(doc);
        let currenY = 0;
        const exist05 = evaluation.evaluator.some((el) => {
            return el.evaluationOrder.toString() === '0.5';
        })
            ? true
            : false;
        const exist1 = evaluation.evaluator.some((el) => {
            return el.evaluationOrder.toString() === '1.0';
        })
            ? true
            : false;
        const exist2 = evaluation.evaluator.some((el) => {
            return el.evaluationOrder.toString() === '2.0';
        })
            ? true
            : false;
        const logoData = new Buffer(BASE64_IMAGE, 'base64');
        doc.addImage(logoData, MIME_LOGO, 5, 5, 30, 12.5);
        doc.setFontSize(20);
        doc.text('EVALUATION REPORT', pageWidth / 2, 30, {
            align: 'center',
        });
        currenY += 40;
        doc.setFontSize(11);
        doc.text(`従業員名: ${evaluation.user.fullName}`, 5, currenY);
        doc.text(`評価学期: ${evaluation.periodStart} ～ ${evaluation.periodEnd}`, pageWidth - pageWidth / 4, 40, {
            align: 'left',
        });
        currenY += 5;
        doc.text(`従業員番号: ${evaluation.user.employeeNumber}`, 5, currenY);
        doc.text(`給与ランク: ${evaluation.level}`, pageWidth - pageWidth / 4, currenY, {
            align: 'left',
        });
        currenY += 5;
        doc.text(`会社: ${evaluation.companyName}`, 5, currenY);
        currenY += 5;
        doc.text(`部署: ${evaluation.departmentName}`, 5, currenY);
        currenY += 5;
        doc.text(`評価者: ${EvaluationHelper_1.EvaluationHelper.getOrderEvaluators(evaluation.evaluator)}`, 5, currenY);
        currenY += 5;
        (0, jspdf_autotable_1.default)(doc, {
            styles: { font: 'msgothic-normal' },
            theme: 'grid',
            startY: currenY,
            head: [Pdf17Helper_1.Pdf17Helper.getHeaderSummaryTable()],
            body: Pdf17Helper_1.Pdf17Helper.getSummaryData(evaluation),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`基本的な技能・技術に関する評価`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper_1.Pdf17Helper.getHeaderBasicTable(exist05)],
            columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 100 } },
            body: Pdf17Helper_1.Pdf17Helper.getBasicTableData(evaluation, 1, exist05),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`専門的事項`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper_1.Pdf17Helper.getHeaderBasicTable(exist05)],
            columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 100 } },
            body: Pdf17Helper_1.Pdf17Helper.getProTableData(evaluation, exist05),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`等級別行動`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper_1.Pdf17Helper.getHeaderBasicTable(exist05)],
            columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 100 } },
            body: Pdf17Helper_1.Pdf17Helper.getBasicTableData(evaluation, 2, exist05),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`個人目標`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper_1.Pdf17Helper.getHeaderGoalTable(exist05)],
            columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 100 } },
            body: Pdf17Helper_1.Pdf17Helper.getGoalTableData(evaluation, exist05),
        });
        currenY = doc.lastAutoTable.finalY;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            columnStyles: Pdf17Helper_1.Pdf17Helper.getColumnTypeTotalPointGoalTable(exist05),
            body: Pdf17Helper_1.Pdf17Helper.getTotalPointGoalTableData(evaluation, exist05),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`個人成果`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper_1.Pdf17Helper.getHeaderAchievementTable(exist05)],
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 50 },
                2: { cellWidth: 50 },
            },
            body: Pdf17Helper_1.Pdf17Helper.getAchievementTableData(evaluation, exist05),
        });
        currenY = doc.lastAutoTable.finalY;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            columnStyles: Pdf17Helper_1.Pdf17Helper.getColumnTypeTotalPointAchievementTable(exist05),
            body: Pdf17Helper_1.Pdf17Helper.getTotalPointAchievementTableData(evaluation, exist05),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`期中発生した追加目標および事項（考慮項目）`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper_1.Pdf17Helper.getHeaderAdditionalTable(exist05)],
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 50 },
                2: { cellWidth: 50 },
            },
            body: Pdf17Helper_1.Pdf17Helper.getAdditionalTableData(evaluation, exist05),
        });
        currenY = doc.lastAutoTable.finalY;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            columnStyles: Pdf17Helper_1.Pdf17Helper.getColumnTypeTotalPointAdditionalTable(exist05),
            body: Pdf17Helper_1.Pdf17Helper.getTotalPointAdditionalTableData(evaluation, exist05),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        const rater05 = Pdf17Helper_1.Pdf17Helper.getEvaluatorByOrder(evaluation.evaluator, '0.5');
        const rater1 = Pdf17Helper_1.Pdf17Helper.getEvaluatorByOrder(evaluation.evaluator, '1.0');
        const rater2 = Pdf17Helper_1.Pdf17Helper.getEvaluatorByOrder(evaluation.evaluator, '2.0');
        doc.text(`自己評価`, 5, currenY);
        currenY += 1;
        const commentUser = doc.splitTextToSize(evaluation.commentUser, 195);
        const CommentUserDimension = doc.getTextDimensions(commentUser);
        if (CommentUserDimension.h + currenY > pageHeight) {
            doc.addPage();
            currenY = 5;
        }
        doc.rect(5, currenY, pageWidth - 10, CommentUserDimension.h + 5);
        currenY += 5;
        doc.text(commentUser, 8, currenY);
        currenY += CommentUserDimension.h + 10;
        if (exist05) {
            doc.text(`0.5次評価`, 5, currenY);
            currenY += 1;
            const commentRater05 = doc.splitTextToSize(rater05.commentPublic, 195);
            const CommentRater05Dimension = doc.getTextDimensions(commentRater05);
            if (CommentRater05Dimension.h + currenY > pageHeight) {
                doc.addPage();
                currenY = 5;
            }
            doc.rect(5, currenY, pageWidth - 10, CommentRater05Dimension.h + 5);
            currenY += 5;
            doc.text(commentRater05, 8, currenY);
            currenY += CommentRater05Dimension.h + 10;
        }
        if (exist1) {
            doc.text(`一次評価`, 5, currenY);
            currenY += 1;
            const commentRater1 = doc.splitTextToSize(rater1.commentPublic, 195);
            const CommentRater1Dimension = doc.getTextDimensions(commentRater1);
            if (CommentRater1Dimension.h + currenY > pageHeight) {
                doc.addPage();
                currenY = 5;
            }
            doc.rect(5, currenY, pageWidth - 10, CommentRater1Dimension.h + 5);
            currenY += 5;
            doc.text(commentRater1, 8, currenY);
            currenY += CommentRater1Dimension.h + 10;
        }
        if (exist2) {
            doc.text(`二次評価`, 5, currenY);
            currenY += 1;
            const commentRater2 = doc.splitTextToSize(rater2.commentPublic, 195);
            const CommentRater2Dimension = doc.getTextDimensions(commentRater2);
            if (CommentRater2Dimension.h + currenY > pageHeight) {
                doc.addPage();
                currenY = 5;
            }
            doc.rect(5, currenY, pageWidth - 10, CommentRater2Dimension.h + 5);
            currenY += 5;
            doc.text(commentRater2, 8, currenY);
            currenY += CommentRater2Dimension.h + 10;
        }
        return doc;
    }
    getTemplateTwoReportFrame(evaluation, doc) {
        const pageWidth = this.getPageWidth(doc);
        let currenY = 0;
        const logoData = new Buffer(BASE64_IMAGE, 'base64');
        doc.addImage(logoData, MIME_LOGO, 5, 5, 30, 12.5);
        doc.setFontSize(20);
        doc.text('EVALUATION REPORT', pageWidth / 2, 30, {
            align: 'center',
        });
        currenY += 40;
        doc.setFontSize(11);
        doc.text(`従業員名: ${evaluation.user.fullName}`, 5, currenY);
        doc.text(`評価学期: ${evaluation.periodStart} ～ ${evaluation.periodEnd}`, pageWidth - pageWidth / 4, 40, {
            align: 'left',
        });
        currenY += 5;
        doc.text(`従業員番号: ${evaluation.user.employeeNumber}`, 5, currenY);
        doc.text(`給与ランク: ${evaluation.level}`, pageWidth - pageWidth / 4, currenY, {
            align: 'left',
        });
        currenY += 5;
        doc.text(`会社: ${evaluation.companyName}`, 5, currenY);
        currenY += 5;
        doc.text(`部署: ${evaluation.departmentName}`, 5, currenY);
        currenY += 5;
        doc.text(`評価者: ${EvaluationHelper_1.EvaluationHelper.getOrderEvaluators(evaluation.evaluator)}`, 5, currenY);
        currenY += 5;
        (0, jspdf_autotable_1.default)(doc, {
            styles: { font: 'msgothic-normal' },
            theme: 'grid',
            startY: currenY,
            head: [Pdf17Helper2_1.Pdf17Helper2.getHeaderSummaryTable()],
            body: Pdf17Helper2_1.Pdf17Helper2.getSummaryData(evaluation),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`基本的な技能・技術に関する評価`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper2_1.Pdf17Helper2.getHeaderBasicTable()],
            columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 100 } },
            body: Pdf17Helper2_1.Pdf17Helper2.getBasicTableData(evaluation, 1),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`専門的事項`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper2_1.Pdf17Helper2.getHeaderBasicTable()],
            columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 100 } },
            body: Pdf17Helper2_1.Pdf17Helper2.getProTableData(evaluation),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`等級別行動`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper2_1.Pdf17Helper2.getHeaderBasicTable()],
            columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 100 } },
            body: Pdf17Helper2_1.Pdf17Helper2.getBasicTableData(evaluation, 2),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`個人目標`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper2_1.Pdf17Helper2.getHeaderGoalTable()],
            columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 100 } },
            body: Pdf17Helper2_1.Pdf17Helper2.getGoalTableData(evaluation),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`個人成果`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper2_1.Pdf17Helper2.getHeaderAchievementTable()],
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 50 },
                2: { cellWidth: 50 },
            },
            body: Pdf17Helper2_1.Pdf17Helper2.getAchievementTableData(evaluation),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        return doc;
    }
    getTemplateThreeReportFrame(evaluation, doc) {
        const pageHeight = this.getPageHeight(doc);
        const pageWidth = this.getPageWidth(doc);
        let currenY = 0;
        const logoData = new Buffer(BASE64_IMAGE, 'base64');
        doc.addImage(logoData, MIME_LOGO, 5, 5, 30, 12.5);
        doc.setFontSize(20);
        doc.text('EVALUATION REPORT', pageWidth / 2, 30, {
            align: 'center',
        });
        currenY += 40;
        doc.setFontSize(11);
        doc.text(`従業員名: ${evaluation.user.fullName}`, 5, currenY);
        doc.text(`評価学期: ${evaluation.periodStart} ～ ${evaluation.periodEnd}`, pageWidth - pageWidth / 4, 40, {
            align: 'left',
        });
        currenY += 5;
        doc.text(`従業員番号: ${evaluation.user.employeeNumber}`, 5, currenY);
        doc.text(`給与ランク: ${evaluation.level}`, pageWidth - pageWidth / 4, currenY, {
            align: 'left',
        });
        currenY += 5;
        doc.text(`会社: ${evaluation.companyName}`, 5, currenY);
        currenY += 5;
        doc.text(`部署: ${evaluation.departmentName}`, 5, currenY);
        currenY += 5;
        doc.text(`評価者: ${EvaluationHelper_1.EvaluationHelper.getOrderEvaluators(evaluation.evaluator)}`, 5, currenY);
        currenY += 5;
        (0, jspdf_autotable_1.default)(doc, {
            styles: { font: 'msgothic-normal' },
            theme: 'grid',
            startY: currenY,
            head: [Pdf17Helper2_1.Pdf17Helper2.getHeaderSummaryTable()],
            body: Pdf17Helper2_1.Pdf17Helper2.getSummaryData(evaluation),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`基本的な技能・技術に関する評価`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper2_1.Pdf17Helper2.getHeaderBasicTable()],
            columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 100 } },
            body: Pdf17Helper2_1.Pdf17Helper2.getBasicTableData(evaluation, 1),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`専門的事項`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper2_1.Pdf17Helper2.getHeaderBasicTable()],
            columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 100 } },
            body: Pdf17Helper2_1.Pdf17Helper2.getProTableData(evaluation),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`等級別行動`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper2_1.Pdf17Helper2.getHeaderBasicTable()],
            columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 100 } },
            body: Pdf17Helper2_1.Pdf17Helper2.getBasicTableData(evaluation, 2),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`個人目標`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper2_1.Pdf17Helper2.getHeaderGoalTable()],
            columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 100 } },
            body: Pdf17Helper2_1.Pdf17Helper2.getGoalTableData(evaluation),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`個人成果`, 5, currenY);
        currenY += 2;
        (0, jspdf_autotable_1.default)(doc, {
            theme: 'grid',
            styles: { font: 'msgothic-normal' },
            margin: { left: 5, right: 5 },
            startY: currenY,
            head: [Pdf17Helper2_1.Pdf17Helper2.getHeaderAchievementTable()],
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 50 },
                2: { cellWidth: 50 },
            },
            body: Pdf17Helper2_1.Pdf17Helper2.getAchievementTableData(evaluation),
        });
        currenY = doc.lastAutoTable.finalY + 10;
        doc.text(`自己評価`, 5, currenY);
        currenY += 1;
        const commentUser = doc.splitTextToSize(evaluation.commentUser, 195);
        const CommentUserDimension = doc.getTextDimensions(commentUser);
        if (CommentUserDimension.h + currenY > pageHeight) {
            doc.addPage();
            currenY = 5;
        }
        doc.rect(5, currenY, pageWidth - 10, CommentUserDimension.h + 5);
        currenY += 5;
        doc.text(commentUser, 8, currenY);
        return doc;
    }
    getSummaryPeriodTable(evaluations, doc) {
        const pageWidth = this.getPageWidth(doc);
        let currenY = 0;
        const logoData = new Buffer(BASE64_IMAGE, 'base64');
        doc.addImage(logoData, MIME_LOGO, 5, 5, 30, 12.5);
        doc.setFontSize(20);
        doc.text('EVALUATION REPORT', pageWidth / 2, 30, {
            align: 'center',
        });
        currenY += 40;
        doc.setFontSize(11);
        doc.text(`従業員名: ${evaluations[0].user.fullName}`, 5, currenY);
        currenY += 5;
        doc.text(`従業員番号: ${evaluations[0].user.employeeNumber}`, 5, currenY);
        doc.text(`給与ランク: ${evaluations[0].level}`, pageWidth - pageWidth / 4.8, currenY, {
            align: 'left',
        });
        currenY += 5;
        doc.text(`会社: ${evaluations[0].companyName}`, 5, currenY);
        currenY += 5;
        doc.text(`部署: ${evaluations[0].departmentName}`, 5, currenY);
        currenY += 5;
        (0, jspdf_autotable_1.default)(doc, {
            styles: { font: 'msgothic-normal' },
            theme: 'grid',
            startY: currenY,
            head: [Pdf17Helper_1.Pdf17Helper.getHeaderSummaryPeriodTable()],
        });
        currenY = doc.lastAutoTable.finalY + 10;
        return doc;
    }
    getFileName(fullname) {
        const fileName = '';
        return fileName;
    }
    async getChildEvaluationReportPdf(doc, evaluation, type) {
        if (type === 1) {
            doc = await this.getTemplateOneReportFrame(evaluation, doc);
        }
        if (type === 2) {
            doc = await this.getTemplateTwoReportFrame(evaluation, doc);
        }
        if (type === 3) {
            doc = await this.getTemplateThreeReportFrame(evaluation, doc);
        }
        return doc;
    }
    async exportParentReportPdf(evaluations) {
        const templateOneStatus = 100;
        const templateTwoStatus = Array.from(new Array(50), (x, i) => i + 1);
        const templateThreeStatus = Array.from(new Array(49), (x, i) => i + 51);
        const fileName = this.getFileName(evaluations[0].user.fullName);
        let doc = this.initDocument();
        for (let i = 0; i < evaluations.length; i++) {
            if (i > 0) {
                doc.addPage();
            }
            if (templateOneStatus === evaluations[i].status) {
                doc = await this.getChildEvaluationReportPdf(doc, evaluations[i], 1);
            }
            if (templateTwoStatus.includes(evaluations[i].status)) {
                doc = await this.getChildEvaluationReportPdf(doc, evaluations[i], 2);
            }
            if (templateThreeStatus.includes(evaluations[i].status)) {
                doc = await this.getChildEvaluationReportPdf(doc, evaluations[i], 3);
            }
        }
        doc.addPage();
        doc = await this.getSummaryPeriodTable(evaluations, doc);
        const arrayBuffer = await doc.output('arraybuffer');
        const results = new ReportResponseDto_1.ReportResponseDto();
        results.filename = fileName;
        results.buffer = Buffer.from(arrayBuffer);
        return results;
    }
}
exports.Pdf17Service = Pdf17Service;
//# sourceMappingURL=pdf17.service.js.map