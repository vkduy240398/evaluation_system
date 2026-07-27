/* eslint-disable no-await-in-loop */
import { Injectable } from '@nestjs/common';
import { jsPDF } from 'jspdf';
import autoTable, {
  ColumnInput,
  RowInput,
  ShowHeadType,
  Styles,
} from 'jspdf-autotable';
import { AchievementAdditionalTablePdfBusiness } from 'src/common/business/pdf/achievementAdditionalTablePdf';
import { AchievementPersonalSubTablePdfBusiness } from 'src/common/business/pdf/achievementSubTablePdf';
import { AchievementPersonalTablePdfBusiness } from 'src/common/business/pdf/achievementTablePdf';
import { BasicTablePdfBusiness } from 'src/common/business/pdf/basicTablePdf';
import { ProSkillTablePdfBusiness } from 'src/common/business/pdf/proSkillTablePdf';
import { TotalTablePdfBusiness } from 'src/common/business/pdf/totalTablePdf';
import { Pdf17Helper } from 'src/common/pdf/Pdf17Helper';
import {
  EvaluationDetail17Type,
  HeaderPdfType,
} from 'src/interfaces/service/pdfService.interface';
import msGothic from 'src/static/fonts/MS-Gothic/MsGothic';

@Injectable()
export class PdfService {
  constructor() {
    //
  }

  private pageWidth: number;
  private fontName = 'msgothic-normal';
  private pageHeight: number;

  private xDefault = 10;

  private pdfConfig(orientation: 'l' | 'p' = 'p', format: 'a4' | 'a3' = 'a4') {
    const doc = new jsPDF({
      unit: 'mm',
      orientation,
      format,
      putOnlyUsedFonts: true,
      floatPrecision: this.xDefault,
    });

    const mainFont = msGothic;
    doc.addFileToVFS('MS-Gothic.ttf', mainFont);
    doc.addFont('MS-Gothic.ttf', 'msgothic-normal', 'normal');
    doc.setFont('msgothic-normal');

    this.pageWidth = doc.internal.pageSize.width;
    this.pageHeight = doc.internal.pageSize.height;

    return doc;
  }

  headerPdf(
    doc: jsPDF,
    titleHeader = 'EVALUATION REPORT',
    userInfo: HeaderPdfType,
  ) {
    //
    // ** Logo header
    const base64Image =
      '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';
    const readImage = new Buffer(base64Image, 'base64');
    doc.addImage(readImage, 'png', 5, 5, 30, 12);

    // ** Title header
    doc.setFontSize(20);
    this.pageWidth = doc.internal.pageSize.width;
    this.pageHeight = doc.internal.pageSize.height;

    doc.text(titleHeader, this.pageWidth / 2, 30, { align: 'center' });

    // ** User info
    if (userInfo) {
      const {
        employeeNumber,
        fullName,
        department,
        periodStart,
        periodEnd,
        companyName,
        evaluators,
        level,
      } = userInfo;
      const x = this.xDefault;

      doc.setFontSize(11);

      // ** Row 40
      doc.text(`従業員名: ${fullName}`, x, 40);

      // ** Row 45
      doc.text(`従業員番号: ${employeeNumber}`, x, 45);

      doc.text(`会社: ${companyName}`, x, 50);
      doc.text(`部署: ${department}`, x, 55);
      doc.text(
        `評価者: ${evaluators?.length > 0 ? evaluators.join('、') : ''}`,
        x,
        60,
      );
      doc.text(`評価期間: ${periodStart} ～ ${periodEnd}`, x, 65);
      doc.text(`等級: ${level}`, x, 70);
    }
  }
  shortHeaderPdf(
    doc: jsPDF,
    titleHeader = 'EVALUATION REPORT',
    userInfo: HeaderPdfType,
  ) {
    //
    // ** Logo header
    const base64Image =
      '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';
    const readImage = new Buffer(base64Image, 'base64');
    doc.addImage(readImage, 'png', 5, 5, 30, 12);

    // ** Title header
    doc.setFontSize(20);
    this.pageWidth = doc.internal.pageSize.width;
    this.pageHeight = doc.internal.pageSize.height;

    doc.text(titleHeader, this.pageWidth / 2, 30, { align: 'center' });

    // ** User info
    if (userInfo) {
      const { employeeNumber, fullName } = userInfo;
      const x = this.xDefault;

      doc.setFontSize(11);

      // ** Row 40
      doc.text(`従業員名: ${fullName}`, x, 40);

      // ** Row 45
      doc.text(`従業員番号: ${employeeNumber}`, x, 45);
    }
  }

  loadTable(
    doc: jsPDF,
    startY: number,
    columns: ColumnInput[],
    body: RowInput[],
    columnStyles?: any,
    showHead?: ShowHeadType,
    styles?: Partial<Styles>,
    fillColor?: string,
  ) {
    autoTable(doc, {
      headStyles: {
        halign: 'center',
        valign: 'middle',
        fillColor: fillColor || [209, 209, 209],
        textColor: [0, 0, 0],
      }, // , fillColor: 'gray'
      startY,
      margin: { left: this.xDefault, right: this.xDefault },
      theme: 'grid',
      columns,
      body,
      columnStyles: columnStyles,
      styles: {
        font: this.fontName,
        lineColor: [162, 162, 162],
        lineWidth: 0.1,
        ...styles,
      },
      didDrawPage: (d) => {
        this.pageHeight = d.cursor.y;
      },
      showHead: showHead || 'everyPage',
    });
  }

  // eslint-disable-next-line complexity
  templatePdfReport(doc: jsPDF, evaluation: EvaluationDetail17Type) {
    // ** Header
    this.headerPdf(doc, 'EVALUATION REPORT', {
      ...evaluation,
    });

    const { status, isEvaluationDate, evaluatorOrderList } = evaluation;

    // ** Display column evaluator 1.0 to evaluation
    // const isDisplayEvaluator1: boolean =
    //   (([55, 57, 58, 59, 60, 61, 98, 99].includes(status) ||
    //     (status === 50 && isEvaluationDate)) &&
    //     evaluatorOrderList.some((s) => Number(s) === 1) &&
    //     [1, 2].includes(Number(evaluatorOrder)) &&
    //     !isEvaluatorUser) ||
    //   (status === 100 && evaluatorOrderList.some((s) => Number(s) === 1)) ||
    //   ([55, 57, 58, 59, 60, 61, 98, 99].includes(status) &&
    //     isEvaluatorException);
    // ** Display column evaluator 2.0 to evaluation
    const isDisplayEvaluator2: boolean =
      // (([60, 61, 98, 99].includes(status) ||
      //   (status === 50 && isEvaluationDate)) &&
      //   evaluatorOrderList.some((s) => Number(s) === 2) &&
      //   Number(evaluatorOrder) === 2 &&
      //   !isEvaluatorUser) ||
      // (status === 100 && evaluatorOrderList.some((s) => Number(s) === 2)) ||
      // [60, 61, 98, 99].includes(status); // && isEvaluatorException
      evaluatorOrderList.some((s) => Number(s) === 2) && status > 50;

    const haveSkill = evaluation.flagSkill === 1;

    // this.loadTable(
    //   doc,
    //   75,
    //   TotalTablePdfBusiness.columnTotalTable(haveSkill),
    //   TotalTablePdfBusiness.dataSourceTotalTable(
    //     evaluation,
    //     isDisplayEvaluator2,
    //   ),
    //   {
    //     title: { halign: 'center' },
    //     skillTotalPoint: { halign: 'center' },
    //     skillPercent: { halign: 'center' },
    //     behaviorTotalPoint: { halign: 'center' },
    //     behaviorPercent: { halign: 'center' },
    //     achievementPersonalTotalPoint: { halign: 'center' },
    //     achievementPercent: { halign: 'center' },
    //     achievementAddition: { halign: 'center' },
    //     percentPoint: { halign: 'center' },
    //   },
    // );

    if (haveSkill) {
      // ** Get height
      if (this.pageHeight + 27 > doc.internal.pageSize.height) {
        this.pageHeight = 15;
        doc.addPage();
      }
      // ** Basic skill
      doc.text('基本スキル', this.xDefault, this.pageHeight + 8);
      this.loadTable(
        doc,
        this.pageHeight + 10,
        BasicTablePdfBusiness.column(isDisplayEvaluator2),
        BasicTablePdfBusiness.dataSources(
          evaluation.evaluationBasicSkills,
          status,
        ),
        {
          title: { halign: 'left', cellWidth: 30 },
          content: { halign: 'left' },
          difficulty: { halign: 'center', valign: 'middle', cellWidth: 20 },
          pointEvaluator2: {
            halign: 'center',
            valign: 'middle',
            cellWidth: 20,
          },
        },
      );

      // ** Get height
      if (this.pageHeight + 27 > doc.internal.pageSize.height) {
        this.pageHeight = 15;
        doc.addPage();
      }
      // ** Pro skill
      doc.text('専門スキル', this.xDefault, this.pageHeight + 8);
      this.loadTable(
        doc,
        this.pageHeight + 10,
        ProSkillTablePdfBusiness.column(isDisplayEvaluator2),
        ProSkillTablePdfBusiness.dataSources(evaluation.proSkillList, status),
        {
          itemTitle: { halign: 'left', cellWidth: 30 },
          content: {
            halign: 'left',
            font: this.fontName,
            // cellWidth: 90,
          },
          difficulty: { halign: 'center', valign: 'middle', cellWidth: 20 },
          totalPointEvaluator2: {
            halign: 'center',
            valign: 'middle',
            cellWidth: 20,
          },
        },
      );
    }

    // ** Get height
    if (this.pageHeight + 27 > doc.internal.pageSize.height) {
      this.pageHeight = 15;
      doc.addPage();
    }
    // ** Behavior table
    doc.text('行動・情意', this.xDefault, this.pageHeight + 8);
    this.loadTable(
      doc,
      this.pageHeight + 10,
      BasicTablePdfBusiness.column(isDisplayEvaluator2),
      BasicTablePdfBusiness.dataSources(
        evaluation.evaluationBehaviorSkills,
        status,
      ),
      {
        title: {
          halign: 'left',
          cellWidth: 30,
        },
        content: {
          halign: 'left',
        },
        difficulty: {
          halign: 'center',
          valign: 'middle',
          cellWidth: 20,
        },
        pointEvaluator2: {
          halign: 'center',
          valign: 'middle',
          cellWidth: 20,
        },
      },
    );

    // ** Achievement personal
    doc.text('個人目標', this.xDefault, this.pageHeight + 8);

    for (const [
      index,
      userEvaluationAchievement,
    ] of evaluation.userEvaluationAchievements.entries()) {
      if (userEvaluationAchievement.achievementStatus !== '小計') {
        this.loadTable(
          doc,
          index === 0 ? this.pageHeight + 10 : this.pageHeight,
          AchievementPersonalTablePdfBusiness.column2(isDisplayEvaluator2),
          AchievementPersonalTablePdfBusiness.dataSources([
            userEvaluationAchievement,
          ]),
          {
            title: {
              // minCellWidth: 45,
              cellWidth: (this.pageWidth * 30) / 100,
            },
            achievementValue: {
              // minCellWidth: 40,
            },
            method: {
              cellWidth: (this.pageWidth * 30) / 100,
            },
            weight: {
              halign: 'center',
              valign: 'middle',
              cellWidth: 20,
            },
            difficultyEvaluator2: {
              halign: 'center',
              valign: 'middle',
              cellWidth: 20,
            },
          },
        );
        this.loadTable(
          doc,
          this.pageHeight,
          AchievementPersonalSubTablePdfBusiness.column(),
          (userEvaluationAchievement as any).childrens, // minCellWidth
          {
            coefficient: {
              halign: 'center',
              valign: 'middle',
              cellWidth: 20,
            },
          },
          'everyPage',
          {},
          '#E8E8E8',
        );
      }
    }

    // this.loadTable(
    //   doc,
    //   this.pageHeight + 10,
    //   AchievementPersonalTablePdfBusiness.column2(isDisplayEvaluator2),
    //   AchievementPersonalTablePdfBusiness.dataSources(
    //     evaluation.userEvaluationAchievements,
    //   ),
    //   {
    //     weight: {
    //       halign: 'center',
    //       cellWidth: 30,
    //     },
    //     difficultyEvaluator2: {
    //       halign: 'center',
    //       cellWidth: 21,
    //     },
    //   },
    // );

    // ** Get height
    if (this.pageHeight + 27 > doc.internal.pageSize.height) {
      this.pageHeight = 15;
      doc.addPage();
    }
    if ((status === 50 && isEvaluationDate) || status > 50) {
      // ** Achievement personal
      doc.text('個人成果', this.xDefault, this.pageHeight + 8);
      this.loadTable(
        doc,
        this.pageHeight + 10,
        AchievementPersonalTablePdfBusiness.column(isDisplayEvaluator2),
        AchievementPersonalTablePdfBusiness.dataSources2(
          evaluation.userEvaluationAchievements,
        ),
        {
          achievementStatus: {
            halign: 'center',
            cellWidth: 15,
          },
          reasonComment: {
            halign: 'left',
            // cellWidth: 55,
          },
          actionPlan: {
            halign: 'left',
            // cellWidth: 75,
          },
          pointEvaluator2: {
            halign: 'center',
            valign: 'middle',
            cellWidth: 20,
          },
        },
      );
      // ** Get height
      if (this.pageHeight + 27 > doc.internal.pageSize.height) {
        this.pageHeight = 15;
        doc.addPage();
      }
      // ** Achievement additional
      if (
        AchievementAdditionalTablePdfBusiness.dataSources(
          evaluation.achievementAdditionals,
        ).length > 1
      ) {
        doc.text('追加目標/成果', this.xDefault, this.pageHeight + 8);
        this.loadTable(
          doc,
          this.pageHeight + 10,
          AchievementAdditionalTablePdfBusiness.column(isDisplayEvaluator2),
          AchievementAdditionalTablePdfBusiness.dataSources(
            evaluation.achievementAdditionals,
          ),
          {
            titleAdditional: {
              halign: 'left',
              cellWidth: 70,
            },
            achievementStatus: {
              halign: 'center',
              cellWidth: 20,
            },
            reasonComment: {
              halign: 'left',
            },

            pointEvaluator2: {
              halign: 'center',
              cellWidth: 20,
            },
          },
        );
      }

      // ** Get height
      if (this.pageHeight + 27 > doc.internal.pageSize.height) {
        this.pageHeight = 15;
        doc.addPage();
      }

      const comment =
        evaluation.comment.comment1Public || '該当データがありません';
      doc.text('一次評価者コメント', this.xDefault, this.pageHeight + 10);
      this.loadTable(
        doc,
        this.pageHeight + 10,
        [{ header: '個人目標', dataKey: 'title' }],
        [{ title: comment }],
        {},
        'never',
        { lineWidth: 0 },
      );
      // dimensionHeight = doc.getTextDimensions(comment, {
      //   maxWidth: this.maxCommentLength,
      // }).h;
      // } else sub = 15;

      // if (isDisplayEvaluator2) {
      // const h = this.pageHeight + 25 + (dimensionHeight || 0) - sub;
      const comment2 =
        evaluation.comment.comment2Public || '該当データがありません';
      doc.text('二次評価者コメント', this.xDefault, this.pageHeight + 10);

      this.loadTable(
        doc,
        this.pageHeight + 10,
        [{ header: '個人目標', dataKey: 'title' }],
        [{ title: comment2 }],
        {},
        'never',
        { lineWidth: 0 },
      );

      // doc.text(comment2, this.xDefault, h, {
      //   maxWidth: this.maxCommentLength,
      // });
    }
    // } else {
    //   // ** Get height
    //   if (this.pageHeight + 27 > doc.internal.pageSize.height) {
    //     this.pageHeight = 15;
    //     doc.addPage();
    //   }
    //   // ** Achievement personal
    //   doc.text('個人目標', this.xDefault, this.pageHeight + 8);
    //   this.loadTable(
    //     doc,
    //     this.pageHeight + 10,
    //     AchievementPersonalTablePdfBusiness.column2(),
    //     AchievementPersonalTablePdfBusiness.dataSources(
    //       evaluation.userEvaluationAchievements,
    //     ),
    //     {
    //       weight: {
    //         halign: 'center',
    //         cellWidth: 10,
    //       },
    //       difficultyEvaluator2: {
    //         halign: 'center',
    //         valign: 'middle',
    //         cellWidth: 20,
    //       },
    //     },
    //   );
    // }

    return doc;
  }

  exportEvaluationForPdf(
    evaluation: EvaluationDetail17Type,
    orientation: 'l' | 'p' = 'p',
    format: 'a4' | 'a3' = 'a4',
  ) {
    //
    const doc = this.pdfConfig(orientation, format);

    const results = this.templatePdfReport(doc, evaluation);

    const arrayBuffer = results.output('arraybuffer');

    return {
      buffer: Buffer.from(arrayBuffer),
      fileName: `【${evaluation.fiscalYear}】${evaluation.fullName}評価表.pdf`,
    };
  }
  private getSummaryPeriodTable(
    evaluations: EvaluationDetail17Type[],
    doc: jsPDF,
  ) {
    this.shortHeaderPdf(doc, 'EVALUATION REPORT', {
      ...evaluations[0],
    });
    let currentY = 50;

    // Table summary
    autoTable(doc, {
      theme: 'grid',
      startY: currentY,
      margin: { left: this.xDefault, right: this.xDefault },
      styles: {
        font: this.fontName,
        lineColor: [162, 162, 162],
        lineWidth: 0.1,
      },
      head: [Pdf17Helper.getHeaderSummaryPeriodTable()],
      body: Pdf17Helper.getSummaryPeriodTableData(evaluations),
      headStyles: { fillColor: [209, 209, 209], textColor: [0, 0, 0] },
    });
    currentY = (doc as any).lastAutoTable.finalY + 10;

    return doc;
  }
  async exportListEvaluationPdf(
    evaluations: EvaluationDetail17Type[],
    orientation: 'l' | 'p' = 'p',
    format: 'a4' | 'a3' = 'a4',
  ) {
    //
    const fileName = `【${evaluations[0].fiscalYear}】${evaluations[0].fullName}評価表.pdf`;
    let doc = this.pdfConfig(orientation, format);

    doc = this.getSummaryPeriodTable(evaluations, doc);
    doc.addPage();
    for (let i = 0; i < evaluations.length; i++) {
      if (i > 0) {
        doc.addPage();
      }
      doc = await this.templatePdfReport(doc, evaluations[i]);
    }

    const arrayBuffer = await doc.output('arraybuffer');

    return {
      buffer: Buffer.from(arrayBuffer),
      fileName: fileName,
    };
  }
}
