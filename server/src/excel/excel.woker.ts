// src/excel/excel.worker.ts
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
import * as JSZip from 'jszip';
import {
  setupSheet,
  titleExcel,
  userInfoDefault,
  basicBehaviorProSkill,
  personalGoal,
  additionalGoal,
  comment,
  totalPersonal,
  title,
  departmentGoal,
  totalDepartment,
  userInfoSummary,
  summaryPersonal,
  summaryDepartment,
  setThickBorder,
} from './common-component-excel';

const Encoding = require('encoding-japanese');
const zip = new JSZip();

function getOffsetHours(timezone: string): number {
  const date = new Date();
  const options = { timeZone: timezone, timeZoneName: 'short' } as const;
  const timeString = new Intl.DateTimeFormat('en-US', options).format(date);
  const match = timeString.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);

  if (!match) return 0;

  const hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;

  return hours + minutes / 60;
}

process.on(
  'message',
  async (message: {
    jobId: string;
    datas: any;
    year: any;
    periodIndex: any;
    timezone: string;
  }) => {
    const { jobId, datas, year, periodIndex, timezone } = message;
    const convertPeriod = (input) => {
      const [start, end] = input.split(' ～ ');

      const format = (str) => {
        const [year, month] = str.split('/');
        return `${year}${month.toString().padStart(2, '0')}`;
      };

      return `${format(start)} ～ ${format(end)}`;
    };

    try {
      // 1 lần xử lý 50 file
      const titleHeader = `${year}年${periodIndex == 1 ? '上期' : '下期'}`;

      const batchSize = 50;

      const totalBatches = Math.ceil(datas.length / batchSize);

      let fileNameExcel = '';

      const sheetNameSynthetic = '全体評価結果集計';

      let sheetNamePeriod = '';

      const nowUtc = new Date(); // UTC timestamp

      // Lấy offset giờ từ timezone (ví dụ Asia/Tokyo → +9)
      const offsetHours = getOffsetHours(timezone);

      // Tạo Date tương ứng với giờ của timezone
      const localTime = new Date(
        nowUtc.getTime() + offsetHours * 60 * 60 * 1000,
      );

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batchData = datas.slice(
          batchIndex * batchSize,
          (batchIndex + 1) * batchSize,
        );

        for (let i = 0; i < batchData.length; i++) {
          const workbook = new ExcelJS.Workbook();
          const item = batchData[i];
          fileNameExcel = `【${year}年${periodIndex == 1 ? '上期' : '下期'}】${
            item.employeeNumber
          }_${item.fullName}`;

          const hasChilds =
            Array.isArray(item.childs) && item.childs.length > 0;

          if (hasChilds) {
            //** Data cho record có ngoại lệ */
            if (item.sameLevel === '1-7' || item.sameLevel === '8-10') {
              const sheet = workbook.addWorksheet(sheetNameSynthetic);
              setupSheet(sheet); // ** setup sheet mặc định
              titleExcel(sheet, titleHeader); // set tiêu đề header
              if (item.sameLevel === '1-7') {
                // bảng summary 1-7
                userInfoSummary(sheet, item, 6);
                const lastRowBorder = summaryPersonal(sheet, item, 6);

                setThickBorder(sheet, 2, lastRowBorder, 'A', 'AK');
              } else if (item.sameLevel === '8-10') {
                // bảng summary 8-10
                userInfoSummary(sheet, item, 6);
                const lastRowBorder = summaryDepartment(sheet, item, 6);

                setThickBorder(sheet, 2, lastRowBorder, 'A', 'AK');
              }
            }

            item.childs.forEach((itemChilds: any) => {
              //** Data cho record ngoại lệ */
              sheetNamePeriod =
                itemChilds.periodStart + ' ～ ' + itemChilds.periodEnd;

              const sheet = workbook.addWorksheet(
                convertPeriod(sheetNamePeriod),
              );
              setupSheet(sheet); // ** setup sheet mặc định
              if (itemChilds.level <= 7) {
                if (itemChilds.flagSkill == 1) {
                  // set tiêu đề header
                  titleExcel(sheet, titleHeader);

                  // set thông tin user
                  const lastRowUserInfor = userInfoDefault(
                    sheet,
                    itemChilds,
                    6,
                  );

                  // set điểm total
                  totalPersonal(sheet, '', itemChilds.flagSkill, itemChilds, 6);

                  // set basic skill
                  const typeBasic = 1;
                  const lastRowBasicSkill = basicBehaviorProSkill(
                    sheet,
                    '基本スキル',
                    typeBasic,
                    itemChilds,
                    lastRowUserInfor + 1,
                  );

                  // set pro skill
                  const typePro = -1;
                  const lastRowProSkill = basicBehaviorProSkill(
                    sheet,
                    '専門スキル',
                    typePro,
                    itemChilds,
                    lastRowBasicSkill + 1,
                  );

                  // set behavior skill
                  const typeBehaviorHaveSkill = 2;
                  const lastRowBehaviorSkill = basicBehaviorProSkill(
                    sheet,
                    '行動・情意',
                    typeBehaviorHaveSkill,
                    itemChilds,
                    lastRowProSkill + 1,
                  );

                  // set mục tiêu cá nhân
                  const typePersonalGoal1_7 = 1;
                  const lastRowPersonalGoal = personalGoal(
                    sheet,
                    '個人成果',
                    typePersonalGoal1_7,
                    itemChilds,
                    lastRowBehaviorSkill + 1,
                  );

                  // set mục tiêu thêm
                  const typeAdditionalGoal1_7 = 1;
                  const lastRowAddiionalGoal = additionalGoal(
                    sheet,
                    '追加目標／成果',
                    typeAdditionalGoal1_7,
                    itemChilds,
                    lastRowPersonalGoal + 1,
                  );

                  // set comment
                  const lastRowBorder = comment(
                    sheet,
                    itemChilds,
                    lastRowAddiionalGoal + 1,
                  );

                  setThickBorder(sheet, 2, lastRowBorder, 'A', 'AK');
                } else {
                  // set tiêu đề header
                  titleExcel(sheet, titleHeader);

                  // set thông tin user
                  const lastRowUserInfor = userInfoDefault(
                    sheet,
                    itemChilds,
                    6,
                  );

                  // set điểm total
                  totalPersonal(sheet, '', itemChilds.flagSkill, itemChilds, 6);

                  // set behavior skill
                  const typeBehaviorNoSkill = 3;
                  const lastRowBehaviorSkill = basicBehaviorProSkill(
                    sheet,
                    '行動・情意',
                    typeBehaviorNoSkill,
                    itemChilds,
                    lastRowUserInfor + 1,
                  );

                  // set mục tiêu cá nhân
                  const typePersonalGoal1_7 = 1;
                  const lastRowPersonalGoal = personalGoal(
                    sheet,
                    '個人成果',
                    typePersonalGoal1_7,
                    itemChilds,
                    lastRowBehaviorSkill + 1,
                  );

                  // set mục tiêu thêm
                  const typeAdditionalGoal1_7 = 1;
                  const lastRowAddiionalGoal = additionalGoal(
                    sheet,
                    '追加目標／成果',
                    typeAdditionalGoal1_7,
                    itemChilds,
                    lastRowPersonalGoal + 1,
                  );

                  // set comment
                  const lastRowBorder = comment(
                    sheet,
                    itemChilds,
                    lastRowAddiionalGoal + 1,
                  );

                  setThickBorder(sheet, 2, lastRowBorder, 'A', 'AK');
                }
              } else {
                // set tiêu đề header
                titleExcel(sheet, titleHeader);

                // set thông tin user
                userInfoDefault(sheet, itemChilds, 6);

                // set điểm total bộ phận
                totalDepartment(sheet, '部門', itemChilds, 6);

                // set điểm total cá nhân
                totalPersonal(
                  sheet,
                  '個人',
                  itemChilds.flagSkill,
                  itemChilds,
                  13,
                );

                // set title 部門
                title(sheet, '部門', 20);

                // set departmentGoal
                const typeGoalDepartment = 3;
                const lastRowDepartmentGoal = departmentGoal(
                  sheet,
                  '部門成果',
                  typeGoalDepartment,
                  itemChilds,
                  22,
                );
                // set mục tiêu thêm
                const typeAdditionalGoalDepartment = 3;
                const lastRowAddtionalGoal = additionalGoal(
                  sheet,
                  '部門追加目標／成果',
                  typeAdditionalGoalDepartment,
                  itemChilds,
                  lastRowDepartmentGoal + 1,
                );

                // set title 個人
                const lastRowTitle = title(
                  sheet,
                  '個人',
                  lastRowAddtionalGoal + 1,
                );

                // set 1-7
                if (itemChilds.flagSkill == 1) {
                  // set basic skill
                  const typeBasic = 4;
                  const lastRowBasicSkill = basicBehaviorProSkill(
                    sheet,
                    '基本スキル',
                    typeBasic,
                    itemChilds,
                    lastRowTitle + 1,
                  );

                  // set pro skill
                  const typePro = -1;
                  const lastRowProSkill = basicBehaviorProSkill(
                    sheet,
                    '専門スキル',
                    typePro,
                    itemChilds,
                    lastRowBasicSkill + 1,
                  );

                  // set behavior skill
                  const typeBehaviorHaveSkill = 5;
                  const lastRowBehaviorSkill = basicBehaviorProSkill(
                    sheet,
                    '行動・情意',
                    typeBehaviorHaveSkill,
                    itemChilds,
                    lastRowProSkill + 1,
                  );

                  // set mục tiêu cá nhân
                  const typePersonalGoal = 2;
                  const lastRowPersonalGoal = personalGoal(
                    sheet,
                    '個人成果',
                    typePersonalGoal,
                    itemChilds,
                    lastRowBehaviorSkill + 1,
                  );

                  // set mục tiêu thêm
                  const typeAdditionalGoal = 2;
                  const lastRowAddiionalGoal = additionalGoal(
                    sheet,
                    '個人追加目標／成果',
                    typeAdditionalGoal,
                    itemChilds,
                    lastRowPersonalGoal + 1,
                  );

                  // set comment
                  const lastRowBorder = comment(
                    sheet,
                    itemChilds,
                    lastRowAddiionalGoal + 1,
                  );

                  setThickBorder(sheet, 2, lastRowBorder, 'A', 'AK');
                } else {
                  // set behavior skill
                  const typeBehaviorNoSkill = 6;
                  const lastRowBehaviorSkill = basicBehaviorProSkill(
                    sheet,
                    '行動・情意',
                    typeBehaviorNoSkill,
                    itemChilds,
                    lastRowTitle + 1,
                  );

                  // set mục tiêu cá nhân
                  const typePersonalGoal = 2;
                  const lastRowPersonalGoal = personalGoal(
                    sheet,
                    '個人成果',
                    typePersonalGoal,
                    itemChilds,
                    lastRowBehaviorSkill + 1,
                  );

                  // set mục tiêu thêm
                  const typeAdditionalGoal = 2;
                  const lastRowAddiionalGoal = additionalGoal(
                    sheet,
                    '個人追加目標／成果',
                    typeAdditionalGoal,
                    itemChilds,
                    lastRowPersonalGoal + 1,
                  );

                  // set comment
                  const lastRowBorder = comment(
                    sheet,
                    itemChilds,
                    lastRowAddiionalGoal + 1,
                  );

                  setThickBorder(sheet, 2, lastRowBorder, 'A', 'AK');
                }
              }
            });
          } else {
            //** Data cho record bình thường */
            sheetNamePeriod = item.periodStart + ' ～ ' + item.periodEnd;

            const sheet = workbook.addWorksheet(convertPeriod(sheetNamePeriod));
            setupSheet(sheet); // ** setup sheet mặc định
            if (item.level <= 7) {
              if (item.flagSkill == 1) {
                // set tiêu đề header
                titleExcel(sheet, titleHeader);

                // set thông tin user
                const lastRowUserInfor = userInfoDefault(sheet, item, 6);

                // set điểm total
                totalPersonal(sheet, '', item.flagSkill, item, 6);

                // set basic skill
                const typeBasic = 1;
                const lastRowBasicSkill = basicBehaviorProSkill(
                  sheet,
                  '基本スキル',
                  typeBasic,
                  item,
                  lastRowUserInfor + 1,
                );

                // set pro skill
                const typePro = -1;
                const lastRowProSkill = basicBehaviorProSkill(
                  sheet,
                  '専門スキル',
                  typePro,
                  item,
                  lastRowBasicSkill + 1,
                );

                // set behavior skill
                const typeBehaviorHaveSkill = 2;
                const lastRowBehaviorSkill = basicBehaviorProSkill(
                  sheet,
                  '行動・情意',
                  typeBehaviorHaveSkill,
                  item,
                  lastRowProSkill + 1,
                );

                // set mục tiêu cá nhân
                const typePersonalGoal1_7 = 1;
                const lastRowPersonalGoal = personalGoal(
                  sheet,
                  '個人成果',
                  typePersonalGoal1_7,
                  item,
                  lastRowBehaviorSkill + 1,
                );

                // set mục tiêu thêm
                const typeAdditionalGoal1_7 = 1;
                const lastRowAddiionalGoal = additionalGoal(
                  sheet,
                  '追加目標／成果',
                  typeAdditionalGoal1_7,
                  item,
                  lastRowPersonalGoal + 1,
                );

                // set comment
                const lastRowBorder = comment(
                  sheet,
                  item,
                  lastRowAddiionalGoal + 1,
                );

                setThickBorder(sheet, 2, lastRowBorder, 'A', 'AK');
              } else {
                // set tiêu đề header
                titleExcel(sheet, titleHeader);

                // set thông tin user
                const lastRowUserInfor = userInfoDefault(sheet, item, 6);

                // set điểm total
                totalPersonal(sheet, '', item.flagSkill, item, 6);

                // set behavior skill
                const typeBehaviorNoSkill = 3;
                const lastRowBehaviorSkill = basicBehaviorProSkill(
                  sheet,
                  '行動・情意',
                  typeBehaviorNoSkill,
                  item,
                  lastRowUserInfor + 1,
                );

                // set mục tiêu cá nhân
                const typePersonalGoal1_7 = 1;
                const lastRowPersonalGoal = personalGoal(
                  sheet,
                  '個人成果',
                  typePersonalGoal1_7,
                  item,
                  lastRowBehaviorSkill + 1,
                );

                // set mục tiêu thêm
                const typeAdditionalGoal1_7 = 1;
                const lastRowAddiionalGoal = additionalGoal(
                  sheet,
                  '追加目標／成果',
                  typeAdditionalGoal1_7,
                  item,
                  lastRowPersonalGoal + 1,
                );

                // set comment
                const lastRowBorder = comment(
                  sheet,
                  item,
                  lastRowAddiionalGoal + 1,
                );

                setThickBorder(sheet, 2, lastRowBorder, 'A', 'AK');
              }
            } else {
              // set tiêu đề header
              titleExcel(sheet, titleHeader);

              // set thông tin user
              userInfoDefault(sheet, item, 6);

              // set điểm total bộ phận
              totalDepartment(sheet, '部門', item, 6);

              // set điểm total cá nhân
              totalPersonal(sheet, '個人', item.flagSkill, item, 13);

              // set title 部門
              title(sheet, '部門', 20);

              // set departmentGoal
              const typeGoalDepartment = 3;
              const lastRowDepartmentGoal = departmentGoal(
                sheet,
                '部門成果',
                typeGoalDepartment,
                item,
                22,
              );
              // set mục tiêu thêm
              const typeAdditionalGoalDepartment = 3;
              const lastRowAddtionalGoal = additionalGoal(
                sheet,
                '部門追加目標／成果',
                typeAdditionalGoalDepartment,
                item,
                lastRowDepartmentGoal + 1,
              );

              // set title 個人
              const lastRowTitle = title(
                sheet,
                '個人',
                lastRowAddtionalGoal + 1,
              );

              // set 1-7
              if (item.flagSkill == 1) {
                // set basic skill
                const typeBasic = 4;
                const lastRowBasicSkill = basicBehaviorProSkill(
                  sheet,
                  '基本スキル',
                  typeBasic,
                  item,
                  lastRowTitle + 1,
                );

                // set pro skill
                const typePro = -1;
                const lastRowProSkill = basicBehaviorProSkill(
                  sheet,
                  '専門スキル',
                  typePro,
                  item,
                  lastRowBasicSkill + 1,
                );

                // set behavior skill
                const typeBehaviorHaveSkill = 5;
                const lastRowBehaviorSkill = basicBehaviorProSkill(
                  sheet,
                  '行動・情意',
                  typeBehaviorHaveSkill,
                  item,
                  lastRowProSkill + 1,
                );

                // set mục tiêu cá nhân
                const typePersonalGoal = 2;
                const lastRowPersonalGoal = personalGoal(
                  sheet,
                  '個人成果',
                  typePersonalGoal,
                  item,
                  lastRowBehaviorSkill + 1,
                );

                // set mục tiêu thêm
                const typeAdditionalGoal = 2;
                const lastRowAddiionalGoal = additionalGoal(
                  sheet,
                  '個人追加目標／成果',
                  typeAdditionalGoal,
                  item,
                  lastRowPersonalGoal + 1,
                );

                // set comment
                const lastRowBorder = comment(
                  sheet,
                  item,
                  lastRowAddiionalGoal + 1,
                );

                setThickBorder(sheet, 2, lastRowBorder, 'A', 'AK');
              } else {
                // set behavior skill
                const typeBehaviorNoSkill = 6;
                const lastRowBehaviorSkill = basicBehaviorProSkill(
                  sheet,
                  '行動・情意',
                  typeBehaviorNoSkill,
                  item,
                  lastRowTitle + 1,
                );

                // set mục tiêu cá nhân
                const typePersonalGoal = 2;
                const lastRowPersonalGoal = personalGoal(
                  sheet,
                  '個人成果',
                  typePersonalGoal,
                  item,
                  lastRowBehaviorSkill + 1,
                );

                // set mục tiêu thêm
                const typeAdditionalGoal = 2;
                const lastRowAddiionalGoal = additionalGoal(
                  sheet,
                  '個人追加目標／成果',
                  typeAdditionalGoal,
                  item,
                  lastRowPersonalGoal + 1,
                );

                // set comment
                const lastRowBorder = comment(
                  sheet,
                  item,
                  lastRowAddiionalGoal + 1,
                );

                setThickBorder(sheet, 2, lastRowBorder, 'A', 'AK');
              }
            }
          }

          const buffer = await workbook.xlsx.writeBuffer();

          // Ghi file Excel vào zip với mốc thời gian theo timezone
          zip.file(`${fileNameExcel}.xlsx`, buffer, { date: localTime });

          process.send({
            type: 'progress',
            jobId,
            percent: Math.floor(
              ((batchIndex * batchSize + i) / datas.length) * 100,
            ),
            file: `${batchIndex * batchSize + (i + 1)} / ${datas.length}`,
          });
        }
      }

      const zipBuffer: any = await zip.generateAsync({
        type: 'nodebuffer',
        encodeFileName: (name) =>
          Encoding.codeToString(
            Encoding.convert(name, {
              to: 'SJIS',
              from: 'UNICODE',
              type: 'array',
            }),
          ),
      });

      // const fileNameZip = `temp-${jobId}.zip`;
      const fileNameZip = `temp-${jobId}.zip`;
      const tempDir = path.join(__dirname, '../../jobs');
      const filePath = path.join(tempDir, fileNameZip);

      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      await fs.promises.writeFile(filePath, zipBuffer);

      process.send?.({ success: true, jobId });
      process.exit(0);
    } catch (err) {
      process.send?.({ success: false, jobId, error: err.message });
      process.exit(1);
    }
  },
);
