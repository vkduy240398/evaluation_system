import moment from 'moment';
import HttpAxios from '../../http/';
import { t } from 'i18next';
import { message } from 'antd';
import { Workbook } from 'exceljs';
import { dayJsFormat, toArrayBuffer } from '../../util';
import dayjs from 'dayjs';
const exportExcelHistoryEvaluationEvaluator = async (errorCallBackExport: (bool: boolean) => void, params: any) => {
  // console.log('check params', params);
  const exportTimes = moment(new Date()).format('YYYYMMDDHHmmss');
  errorCallBackExport(true);

  return await HttpAxios.Get('/api/v1/f2/evaluator/export-history-evaluation-evaluator', {
    params: params,
  }).then(async (res) => {
    if (res && res.status === 200) {
      if (!res.data || !res.data.length) {
        message.error(t('MESSAGE.COMMON.IDM_NO_USER_MATCH_CONDITIONS'));
      } else {
        const dataDownload = await bufferHistoryEvaluation(params.yearStart, params.yearEnd, res.data);
        const arrayBuffer = toArrayBuffer(dataDownload);

        const blob = new Blob([arrayBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const filename = `${(t('IDL_LIST_MENU_F5', { returnObjects: true }) as any)[3]}_${exportTimes}`;

        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      errorCallBackExport(false);
    } else errorCallBackExport && errorCallBackExport(false);
  });
};

const getDivisionName = (listDivision: { divisionName: string; periodEnd: string }[]) => {
  // Bước 1: Sắp xếp giảm dần theo periodEnd
  const sorteds = listDivision.sort(
    (a, b) => dayjs(b.periodEnd, 'YYYY/M').valueOf() - dayjs(a.periodEnd, 'YYYY/M').valueOf(),
  );

  // Bước 2: Lọc trùng departmentName (lấy bản mới nhất)
  const uniques = Object.values(
    sorteds.reduce((acc, item) => {
      if (!acc[item.divisionName]) {
        acc[item.divisionName] = item;
      }

      return acc;
    }, {} as Record<string, (typeof listDivision)[0]>),
  );

  // Bước 3: Gộp chuỗi departmentName cách nhau bởi '\n'
  const result = uniques.map((item) => item.divisionName).join('\n');

  return result;
};

const getDepartmentName = (listDepartments: { departmentName: string; periodEnd: string }[]) => {
  // Bước 1: Sắp xếp giảm dần theo periodEnd
  const sorteds = listDepartments.sort(
    (a, b) => dayjs(b.periodEnd, 'YYYY/M').valueOf() - dayjs(a.periodEnd, 'YYYY/M').valueOf(),
  );

  // Bước 2: Lọc trùng departmentName (lấy bản mới nhất)
  const uniques = Object.values(
    sorteds.reduce((acc, item) => {
      if (!acc[item.departmentName]) {
        acc[item.departmentName] = item;
      }

      return acc;
    }, {} as Record<string, (typeof listDepartments)[0]>),
  );

  // Bước 3: Gộp chuỗi departmentName cách nhau bởi '\n'
  const result = uniques.map((item) => item.departmentName).join('\n');

  return result;
};

const bufferHistoryEvaluation = async (yearStart: number, yearEnd: number, dataExports: any) => {
  // export excel
  const workBook = new Workbook();
  const worksheet = workBook.addWorksheet('sheet1', {
    properties: { tabColor: { argb: 'FFC0000' } },
    pageSetup: { paperSize: 9, orientation: 'landscape' },
  });
  const rowFirst: any = {};
  const columns = [
    { header: '社員番号', key: 'employeeNumber', width: 12 },
    { header: '氏名', key: 'userName', width: 20 },
    { header: 'ユーザ状態', key: 'active', width: 12 },
    { header: '部名', key: 'divisionName', width: 25 },
    { header: '課', key: 'departmentName', width: 25 },
    { header: '等級', key: 'level', width: 10 },
  ];
  for (let i = yearStart; i <= yearEnd; i++) {
    columns.push(
      ...[
        { header: `${i}年上期`, key: `${i}年上期`, width: 12 },
        { header: '', key: `${i}年上期_2`, width: 12 },
        { header: `${i}年下期`, key: `${i}年下期`, width: 12 },
        { header: '', key: `${i}年下期_2`, width: 12 },
      ],
    );
  }

  columns.map((e: any, index: number) => {
    if (index < 6) {
      rowFirst[e.key] = ' ';
    } else {
      rowFirst[e.key] = e.key.includes('_2') ? '総計' : '等級';
    }
  });

  dataExports.forEach((user: any) => {
    user.active = user.active === 1 ? '在職' : '異動/退職';

    user.divisionName = getDivisionName(user.divisionName);
    user.departmentName = getDepartmentName(user.departmentName);

    for (let i = yearStart; i <= yearEnd; i++) {
      user[`${i}年上期`] = user.evaluations?.filter(
        (e: any) => e.year === i.toString() && e.periodIndex === 1,
      )[0]?.level;
      user[`${i}年上期_2`] = user.evaluations?.filter(
        (e: any) => e.year === i.toString() && e.periodIndex === 1,
      )[0]?.totalPoint;
      user[`${i}年下期`] = user.evaluations?.filter(
        (e: any) => e.year === i.toString() && e.periodIndex === 2,
      )[0]?.level;
      user[`${i}年下期_2`] = user.evaluations?.filter(
        (e: any) => e.year === i.toString() && e.periodIndex === 2,
      )[0]?.totalPoint;
    }
  });

  worksheet.columns = columns;
  worksheet.addRow(rowFirst);
  worksheet.addRows(dataExports);
  worksheet.mergeCells('A1', 'A2');
  worksheet.mergeCells('B1', 'B2');
  worksheet.mergeCells('C1', 'C2');
  worksheet.mergeCells('D1', 'D2');
  worksheet.mergeCells('E1', 'E2');
  worksheet.mergeCells('F1', 'F2');

  let rangeMerge = '';
  worksheet.getRow(1).eachCell((cell: any) => {
    if (Number(cell.col) > 6 && cell.value && cell.value !== ' ' && rangeMerge === '' && !cell.isMerged) {
      rangeMerge = cell.address + ':';
    } else if (rangeMerge !== '' && !cell.isMerged) {
      rangeMerge += cell.address;
      worksheet.mergeCells(rangeMerge);
      rangeMerge = '';
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF87E7AD' },
      };
      cell.border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' },
      };
    }
  });
  for (let j = 1; j <= worksheet.rowCount; j++) {
    worksheet.getRow(j).alignment = { wrapText: true };
    worksheet.getRow(j).font = { name: '游ゴシック' };
  }
  worksheet.getRow(1).alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  worksheet.getRow(2).alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };

  for (let k = 1; k <= worksheet.columnCount; k++) {
    // tắt tự động format
    worksheet.getColumn(k).numFmt = '@';
    if (k > 5) {
      worksheet.getColumn(k).alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center',
      };
    }

    worksheet.getCell(2, k).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF87E7AD' },
    };

    worksheet.getCell(2, k).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
      top: { style: 'thin' },
      bottom: { style: 'thin' },
    };
  }

  const createOuterBorder = (
    worksheet: any,
    start = { row: 1, col: 1 },
    end = { row: 1, col: 1 },
    borderWidth = 'thin',
  ) => {
    const borderStyle = {
      style: borderWidth,
    };
    for (let i = start.row; i <= end.row + 1; i++) {
      for (let j = start.col; j <= end.col; j++) {
        const leftBorderCell = worksheet.getCell(i, j);
        leftBorderCell.border = {
          ...leftBorderCell.border,
          left: borderStyle,
          right: borderStyle,
          top: borderStyle,
          bottom: borderStyle,
        };
      }
    }
  };
  createOuterBorder(worksheet, { row: 2, col: 1 }, { row: worksheet.rowCount - 1, col: worksheet.columnCount });

  const buffer = await workBook.xlsx.writeBuffer();

  return buffer;
};

const exportHistoryEvaluationEvaluatorApiService = {
  exportExcelHistoryEvaluationEvaluator,
};
export default exportHistoryEvaluationEvaluatorApiService;
