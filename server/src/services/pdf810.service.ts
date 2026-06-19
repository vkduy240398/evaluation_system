/* eslint-disable complexity */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-named-as-default
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { EvaluationHelper } from 'src/common/EvaluationHelper';
// import { EvaluationPeriodHelper } from 'src/common/datetime/EvaluationPeriodHelper';
import { Pdf810Helper } from 'src/common/pdf/Pdf810Helper';
import { Pdf810Helper3 } from 'src/common/pdf/Pdf810Helper3';
import { Evaluation } from 'src/entity/Evaluation';
import { Evaluator } from 'src/entity/Evaluator';
import { PdfService810I } from 'src/interfaces/service/pdf.service.interface';
import msGothic from 'src/static/fonts/MS-Gothic/MsGothic';
import { PdfService } from './pdf.service';
import { AchievementPersonalSubTablePdfBusiness } from 'src/common/business/pdf/achievementSubTablePdf';

const LEFT_BRACKET = '【';
const RIGHT_BRACKET = '】';
const YEAR = '年';
const SUFFIX = '評価表.pdf';
const MIME_LOGO = 'png';
const BASE64_IMAGE =
  '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';

export class Pdf810Service implements PdfService810I {
  private xDefault = 10;
  private maxCommentLength = 277;
  private initDocument(orientation: 'p' | 'l', size: string) {
    const doc = new jsPDF({
      unit: 'mm',
      orientation: orientation,
      format: size,
      putOnlyUsedFonts: true,
      floatPrecision: this.xDefault,
    });

    const mainFont = msGothic;
    doc.addFileToVFS('MS-Gothic.ttf', mainFont);
    doc.addFont('MS-Gothic.ttf', 'msgothic-normal', 'normal');
    doc.setFont('msgothic-normal');

    return doc;
  }

  private getPageHeight(doc: jsPDF) {
    return doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  }

  private getPageWidth(doc: jsPDF) {
    return doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  }

  /**
   * Generate report with choosen template
   *
   * @author tran.le.ha.nam
   * @last_update
   * @param evaluation - evaluation object
   * @param type - template type
   */
  async exportEvaluationReportPdf(
    evaluation: Evaluation,
    listEvalutor: Evaluator[],
    orientation: 'p' | 'l',
    size: string,
    subList: any,
  ) {
    const fileName = this.getFileName(
      evaluation.title,
      evaluation.user.fullName,
    );
    let doc = this.initDocument(orientation, size);

    doc = this.getTemplateThreeReportFrame(
      evaluation,
      listEvalutor,
      subList,
      doc,
    );

    const arrayBuffer = await doc.output('arraybuffer');
    return {
      buffer: Buffer.from(arrayBuffer),
      fileName: fileName,
    };
  }

  private getTemplateThreeReportFrame(
    evaluation: Evaluation,
    listEvalutor: Evaluator[],
    subList: any,
    doc: jsPDF,
  ) {
    //
    // const pageHeight = this.getPageHeight(doc);
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
    doc.text(`従業員名: ${evaluation.user.fullName}`, this.xDefault, currenY);
    currenY += 5;

    doc.text(
      `従業員番号: ${evaluation.user.employeeNumber}`,
      this.xDefault,
      currenY,
    );
    currenY += 5;

    doc.text(`会社: ${evaluation.companyName}`, this.xDefault, currenY);
    currenY += 5;

    doc.text(`部署: ${evaluation.divisionName}`, this.xDefault, currenY);
    currenY += 5;

    doc.text(
      `評価者: ${EvaluationHelper.getOrderEvaluators(evaluation.evaluator)}`,
      this.xDefault,
      currenY,
    );
    currenY += 5;

    doc.text(
      `評価期間: ${evaluation.periodStart} ～ ${evaluation.periodEnd}`,
      this.xDefault,
      currenY,
    );
    currenY += 5;

    doc.text(`等級: ${evaluation.level}`, this.xDefault, currenY);
    currenY += 5;

    // Table summary
    // autoTable(doc, {
    //   styles: {
    //     font: 'msgothic-normal',
    //     lineColor: [162, 162, 162],
    //     lineWidth: 0.1,
    //   },
    //   margin: { left: this.xDefault, right: this.xDefault },
    //   theme: 'grid',
    //   startY: currenY,
    //   head: [
    //     [
    //       {
    //         content: '判定（自動集計）',
    //         styles: {
    //           halign: 'center',
    //           fillColor: [209, 209, 209],
    //           textColor: [0, 0, 0],
    //         },
    //       },
    //     ],
    //   ],
    //   body: [],
    // });
    // currenY += 7;
    if (evaluation.status > 50) {
      autoTable(doc, {
        styles: {
          font: 'msgothic-normal',
          lineColor: [162, 162, 162],
          lineWidth: 0.1,
        },
        margin: { left: this.xDefault, right: this.xDefault },
        theme: 'grid',
        startY: currenY,
        head: Pdf810Helper3.getHeaderSummaryTable(),
        headStyles: { fillColor: [209, 209, 209], textColor: [0, 0, 0] },
        body: Pdf810Helper3.getSummaryTableData(evaluation),
        columnStyles: {
          0: { cellWidth: 40, halign: 'center' },
          1: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'center' },
        },
      });
      currenY = (doc as any).lastAutoTable.finalY + 8;
    }
    if (evaluation.status < 51) currenY += 3;

    // Table department target
    doc.text(`部門目標`, this.xDefault, currenY);
    currenY += 2;

    if (evaluation.evaluationAchievementPersonals.length) {
      evaluation.evaluationAchievementPersonals.forEach((el) => {
        autoTable(doc, {
          theme: 'grid',
          styles: {
            font: 'msgothic-normal',
            lineColor: [162, 162, 162],
            lineWidth: 0.1,
          },
          margin: { left: this.xDefault, right: this.xDefault },
          startY: currenY,
          columns: Pdf810Helper3.getHeaderDepartmentGoalTable(
            evaluation.status,
          ),
          columnStyles: {
            0: { cellWidth: pageWidth * 29 / 100, },
            1: { cellWidth: 'auto' },
            2: { cellWidth: pageWidth * 30 / 100 },
            3: { halign: 'center', cellWidth: 20 },
            4: { halign: 'center', cellWidth: 20 }, 
          },
          headStyles: {
            valign: 'middle',
            halign: 'center',
            fillColor: [209, 209, 209],
            textColor: [0, 0, 0],
          },
          body: Pdf810Helper3.getDepartmentGoalTableData(el),
        });

        currenY = (doc as any).lastAutoTable.finalY;
        autoTable(doc, {
          theme: 'grid',
          styles: {
            font: 'msgothic-normal',
            lineColor: [162, 162, 162],
            lineWidth: 0.1,
          },
          margin: { left: this.xDefault, right: this.xDefault },
          startY: currenY,
          columns: AchievementPersonalSubTablePdfBusiness.column(),
          columnStyles: {
            0: { cellWidth: 'auto' },
            1: { halign: 'center', cellWidth: 20, valign: 'middle' },
          },
          headStyles: {
            valign: 'middle',
            halign: 'center',
            fillColor: '#E8E8E8',
            textColor: [0, 0, 0],
          },
          body: Pdf810Helper3.getSubListData(el, subList),
        });

        currenY = (doc as any).lastAutoTable.finalY;
      });
    }

    currenY = (doc as any).lastAutoTable.finalY + 8;
    if (evaluation.status > 50) {
      // Table department achievement
      doc.text(`部門成果`, this.xDefault, currenY);
      currenY += 2;
      autoTable(doc, {
        theme: 'grid',
        styles: {
          font: 'msgothic-normal',
          lineColor: [162, 162, 162],

          lineWidth: 0.1,
        },
        margin: { left: this.xDefault, right: this.xDefault },
        startY: currenY,
        columns: Pdf810Helper3.getHeaderDepartmentAchievementTable(),

        columnStyles: {
          0: { cellWidth: 19, halign: 'center' },
          1: { minCellWidth: 65 },
          2: { minCellWidth: 70 },
          3: { halign: 'center', cellWidth: 18 },
          4: { halign: 'center', cellWidth: 18 },
        },
        headStyles: {
          valign: 'middle',
          halign: 'center',
          fillColor: [209, 209, 209],
          textColor: [0, 0, 0],
        },
        body: Pdf810Helper.getDepartmentAchievementTableData(evaluation),
      });
      currenY = (doc as any).lastAutoTable.finalY + 8;

      // Table additional
      if (Pdf810Helper.getAdditionalTableData(evaluation).length > 1) {
        doc.text(`追加目標/成果`, this.xDefault, currenY);
        currenY += 2;
        autoTable(doc, {
          theme: 'grid',
          styles: {
            font: 'msgothic-normal',
            lineColor: [162, 162, 162],

            lineWidth: 0.1,
          },
          margin: { left: this.xDefault, right: this.xDefault },
          startY: currenY,
          columns: Pdf810Helper3.getHeaderAdditionalTable(),
          columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 30, halign: 'center' },
            2: { cellWidth: 70 },
            3: { halign: 'center' },
          },
          headStyles: {
            valign: 'middle',
            halign: 'center',
            fillColor: [209, 209, 209],
            textColor: [0, 0, 0],
          },
          body: Pdf810Helper.getAdditionalTableData(evaluation),
        });
      }

      currenY = (doc as any).lastAutoTable.finalY + 8;
      const comment1Info = listEvalutor.filter((item: Evaluator) => {
        return item.evaluationOrder.toString() === '1.0';
      });
      const comment2Info = listEvalutor.filter((item: Evaluator) => {
        return item.evaluationOrder.toString() === '2.0';
      });
      // Rater 1 comment

      doc.text(`一次評価者コメント`, this.xDefault, currenY);
      currenY += 2;
      autoTable(doc, {
        theme: 'grid',
        styles: {
          font: 'msgothic-normal',
          lineWidth: 0,
        },
        margin: { left: this.xDefault, right: this.xDefault },
        startY: currenY,
        body: [
          {
            content: comment1Info[0]?.commentPublic || '該当データがありません',
          },
        ] as RowInput[],
        showHead: 'never',
      });
      currenY = (doc as any).lastAutoTable.finalY + 8;

      // Rater 2 comment
      doc.text(`二次評価者コメント`, this.xDefault, currenY);
      currenY += 2;
      autoTable(doc, {
        theme: 'grid',
        styles: {
          font: 'msgothic-normal',
          lineWidth: 0,
        },
        margin: { left: this.xDefault, right: this.xDefault },
        startY: currenY,
        body: [
          {
            content: comment2Info[0]?.commentPublic || '該当データがありません',
          },
        ] as RowInput[],
        showHead: 'never',
      });
      currenY = (doc as any).lastAutoTable.finalY + 8;
    }

    return doc;
  }
  private getSummaryPeriodTable(evaluations: Evaluation[], doc: jsPDF) {
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
    doc.text(
      `従業員名: ${evaluations[0].user.fullName}`,
      this.xDefault,
      currenY,
    );
    currenY += 5;
    doc.text(
      `従業員番号: ${evaluations[0].user.employeeNumber}`,
      this.xDefault,
      currenY,
    );
    currenY += 5;
    // doc.text(`会社: ${evaluations[0].companyName}`, this.xDefault, currenY);
    // currenY += 5;

    // doc.text(`部署: ${evaluations[0].departmentName}`, this.xDefault, currenY);
    // currenY += 5;
    // doc.text(
    //   `評価期間: ${EvaluationPeriodHelper.getCurrentPeriodYear()}${EvaluationPeriodHelper.getCurrentPeriodIndex()}期`,
    //   this.xDefault,
    //   currenY,
    // );
    // currenY += 5;
    // doc.text(`等級: ${evaluations[0].level}`, this.xDefault, currenY);
    // currenY += 5;

    // Table summary
    autoTable(doc, {
      styles: {
        font: 'msgothic-normal',
        lineColor: [162, 162, 162],

        lineWidth: 0.1,
      },
      margin: { left: this.xDefault, right: this.xDefault },
      theme: 'grid',
      startY: currenY,
      head: Pdf810Helper.getHeaderSummaryTable(),
      body: Pdf810Helper.getSummaryPeriodTableData(evaluations),
      columnStyles: {
        0: { halign: 'center' },
        1: { halign: 'center' },
        2: { halign: 'center' },
      },
      headStyles: {
        valign: 'middle',
        halign: 'center',
        fillColor: [209, 209, 209],
        textColor: [0, 0, 0],
      },
    });
    currenY = (doc as any).lastAutoTable.finalY + 10;

    return doc;
  }

  private getFileName(title: string, fullname: string) {
    const fileName = LEFT_BRACKET + title + RIGHT_BRACKET + fullname + SUFFIX;

    return fileName;
  }
  async getChildEvaluation810ReportPdf(
    evaluation: Evaluation,
    listEvalutor: Evaluator[],
    role: string,
    userId: number,
    subList: any,
    doc: jsPDF,
  ) {
    doc = await this.getTemplateThreeReportFrame(
      evaluation,
      listEvalutor,
      subList,
      doc,
    );
    return doc;
  }

  async exportParentReportPdf(
    evaluations: Evaluation[],
    role: string,
    userId: number,
    orientation: 'l' | 'p' = 'p',
    size: 'a4' | 'a3' = 'a4',
    subList: any,
  ) {
    const fileName = `【${evaluations[0].title}】${evaluations[0].user.fullName}評価表.pdf`;
    let doc = this.initDocument(orientation, size);
    if (evaluations.length !== 1) {
      doc = await this.getSummaryPeriodTable(evaluations, doc);
      doc.addPage();
    }

    for (let i = 0; i < evaluations.length; i++) {
      if (i > 0) {
        doc.addPage();
      }
      doc = await this.getChildEvaluation810ReportPdf(
        evaluations[i],
        evaluations[i].evaluator,
        role,
        userId,
        subList,
        doc,
      );
    }

    const arrayBuffer = await doc.output('arraybuffer');
    return {
      buffer: Buffer.from(arrayBuffer),
      fileName: fileName,
    };
  }
  async exportListPDFReport(
    evaluations: any,
    role: string,
    userId: number,
    orientation: 'l' | 'p' = 'p',
    size: 'a4' | 'a3' = 'a4',
    subList: any,
  ) {
    let fileName = ``;
    if (evaluations[0]?.user && evaluations[0].user.fullName) {
      fileName = `【${evaluations[0].fiscalYear}】${evaluations[0].user.fullName}評価表.pdf`;
    } else {
      fileName = `【${evaluations[0].fiscalYear}】${evaluations[0].fullName}評価表.pdf`;
    }
    let doc = this.initDocument(orientation, size);
    const pdfService17 = new PdfService();

    for (let i = 0; i < evaluations.length; i++) {
      if (i > 0) {
        doc.addPage();
      }
      if (evaluations[i].level < 8) {
        doc = await pdfService17.templatePdfReport(doc, evaluations[i]);
      } else {
        doc = await this.getChildEvaluation810ReportPdf(
          evaluations[i],
          evaluations[i].evaluator,
          role,
          userId,
          subList,
          doc,
        );
      }
    }
    const arrayBuffer = await doc.output('arraybuffer');
    return {
      buffer: Buffer.from(arrayBuffer),
      fileName: fileName,
    };
  }
}
