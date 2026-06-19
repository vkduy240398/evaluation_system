export const setupSheet = (sheet: any) => {
  // Gán tiêu đề cột A đến AK (37 cột)
  for (let i = 1; i <= 37; i++) {
    sheet.getColumn(i).width = 4;
  }

  // Ẩn tất cả các cột từ AL trở đi
  for (let i = 38; i <= 16384; i++) {
    sheet.getColumn(i).hidden = true;
  }

  // Giới hạn vùng in
  sheet.pageSetup.printArea = 'A1:AK50';
};

export const titleExcel = (sheet: any, title: string) => {
  sheet.mergeCells('K3:Y4');
  const titleCell = sheet.getCell('K3');
  titleCell.value = `【${title}評価結果】`;
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.font = {
    bold: true,
    color: { argb: 'FFFFFF' },
    size: 12,
    name: 'ＭＳ ゴシック',
  };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '000000' },
  };
};

export const userInfoDefault = (sheet: any, data: any, startRow: number) => {
  const getAccurateRowHeight = (
    text: string,
    totalWidth: number,
    fontSize = 11, // Excel default
  ): number => {
    if (!text || typeof text !== 'string') return 15;

    // 1 đơn vị width Excel ~ 7px với ＭＳ ゴシック 11
    const pixelsPerCol = totalWidth * 7;
    const lineHeight = fontSize + 4; // px/dòng

    let totalLines = 0;
    for (const line of text.split('\n')) {
      const visualLength = line.replace(/[^\x00-\xff]/g, 'aa').length; // fullwidth = 2 ký tự
      const pixelsNeeded = visualLength * (fontSize * 0.6);
      const estLines = Math.ceil(pixelsNeeded / pixelsPerCol);
      totalLines += estLines || 1;
    }

    return Math.max(15, totalLines * lineHeight * 0.75); // px → Excel row height
  };

  // Label và value mapping
  const infoMaps = [
    ['社員番号', data?.employeeNumber?.trim()],
    ['氏名', data?.fullName?.trim()],
    ['部署（部）', data?.divisionName?.trim()],
    ['部署（課）', data?.departmentName?.trim()],
    ['等級', data?.level],
    ['評価対象期間', data?.periodStart + ' ～ ' + data?.periodEnd],
    ['仮評価者', data?.evaluator05 ? data?.evaluator05?.fullName : ''],
    ['一次評価者', data?.evaluator1 ? data?.evaluator1?.fullName : ''],
    ['二次評価者', data?.evaluator2 ? data?.evaluator2?.fullName : ''],
  ];

  const fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'E2EFDA' },
  };

  const border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  };

  // Đồng bộ font ＭＳ ゴシック toàn sheet
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber >= 5) {
      row.font = { name: 'ＭＳ ゴシック', size: 11 };
    }
  });

  // Khóa zoom 100% để nhìn giống nhau
  sheet.views = [{ state: 'normal', zoomScale: 100 }];

  let currentRow = startRow;
  for (let i = 0; i < infoMaps.length; i++) {
    const row = startRow + i;
    const [label, value] = infoMaps[i];

    // Merge label & value
    sheet.mergeCells(`B${row}:E${row}`);
    sheet.mergeCells(`F${row}:L${row}`);

    const labelCell = sheet.getCell(`B${row}`);
    const valueCell = sheet.getCell(`F${row}`);

    // Label style
    labelCell.value = label;
    labelCell.fill = fill;
    labelCell.border = border;
    labelCell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: true,
    };
    labelCell.font = { name: 'ＭＳ ゴシック', size: 11 };

    // Value style
    valueCell.value = value;
    valueCell.border = border;
    valueCell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: true,
    };
    valueCell.font = { name: 'ＭＳ ゴシック', size: 11 };

    // Tính tổng width cột F–L
    let totalWidth = 0;
    for (let col = 6; col <= 12; col++) {
      const colWidth = sheet.getColumn(col).width ?? 8.43;
      totalWidth += colWidth;
    }

    // Tính height
    const valueText =
      typeof value === 'string' ? value : value?.toString?.() ?? '';
    const rowHeight = getAccurateRowHeight(valueText, totalWidth, 11);
    sheet.getRow(row).height = rowHeight;

    currentRow++;
  }

  return currentRow;
};

export const basicBehaviorProSkill = (
  sheet: any,
  title: string,
  type: number,
  data: any,
  startRow: number,
) => {
  const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };
  //* với type = -1 là mặc định cho pro skill, các type còn lại theo DB
  const listDatas: any[] =
    type == -1
      ? data?.listProSKill || []
      : data?.listBasicBehaviorSkill?.filter((f: any) => f?.type === type) ||
        [];

  const colMap = {
    itemTitle: { start: 2, end: 5 }, // B-E
    content: { start: 6, end: 22 }, // F-V
    difficulty: { start: 23, end: 24 }, // W-X
    pointUser: { start: 25, end: 27 }, // Y-AA
    pointEvaluator05: { start: 28, end: 30 }, // AB-AD
    pointEvaluator1: { start: 31, end: 33 }, // AE-AG
    pointEvaluator2: { start: 34, end: 36 }, // AH-AJ
    totalLabel: { start: 2, end: 24 },
  };
  const borderAll = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  const fillHeader = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'E2EFDA' },
  };

  const LINE_HEIGHT_PT = 15;

  const getAccurateRowHeight = (text: string, charPerLine = 40): number => {
    if (!text || typeof text !== 'string') return LINE_HEIGHT_PT;

    const lines = text.split('\n');
    let totalLines = 0;

    lines.forEach((line) => {
      const visualLength = line.replace(/[^\x00-\xff]/g, 'aa').length; // đếm 2 ký tự cho mỗi kí tự tiếng Nhật
      const estimatedLines = Math.ceil(visualLength / charPerLine);
      totalLines += estimatedLines;
    });

    return Math.max(LINE_HEIGHT_PT, totalLines * LINE_HEIGHT_PT);
  };

  const setMergedValue = (
    row: number,
    field: string,
    value: string | number | null,
    isLeftAlign = false,
  ) => {
    const col = colMap[field as keyof typeof colMap];
    if (!col) return;

    // Merge cells trước
    sheet.mergeCells(row, col.start, row, col.end);

    const cell = sheet.getCell(row, col.start);
    cell.value = value ?? '';

    cell.alignment = {
      vertical: 'middle',
      horizontal: isLeftAlign ? 'left' : 'center',
      wrapText: true,
    };

    cell.border = borderAll;
    cell.font = defaultFont;
  };

  const setSingleMergedValue = (
    row: number,
    colStart: number,
    colEnd: number,
    value: string | number | null,
    isLeftAlign = false,
  ) => {
    sheet.mergeCells(row, colStart, row, colEnd); // Chỉ merge 1 dòng
    const cell = sheet.getCell(row, colStart);
    cell.value = value ?? '';

    cell.alignment = {
      vertical: 'middle',
      horizontal: isLeftAlign ? 'left' : 'center',
      wrapText: true,
    };

    cell.border = borderAll;
    cell.font = defaultFont;
  };

  let currentRow = startRow;

  // 1. Title
  sheet.mergeCells(currentRow, 2, currentRow, 4); // column B (2) -> D (4)
  const titleCell = sheet.getCell(currentRow, 2);
  titleCell.value = title;
  titleCell.fill = fillHeader;
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.border = borderAll;
  titleCell.font = defaultFont;
  currentRow++;

  // 2. Header (merged 1 row only)
  sheet.mergeCells(currentRow, 2, currentRow, 5); // 評価項目 B-E
  sheet.mergeCells(currentRow, 6, currentRow, 22); // 評価内容 F-V
  sheet.mergeCells(currentRow, 23, currentRow, 24); // 難易度 W-X
  sheet.mergeCells(currentRow, 25, currentRow, 27); // 本人 Y-AA
  sheet.mergeCells(currentRow, 28, currentRow, 30); // 仮評価 AB-AD
  sheet.mergeCells(currentRow, 31, currentRow, 33); // 一次評価 AE-AG
  sheet.mergeCells(currentRow, 34, currentRow, 36); // 二次評価 AH-AJ

  const headers = [
    { label: '評価項目', col: 2 },
    { label: '評価内容', col: 6 },
    { label: '難易度', col: 23 },
    { label: '本人', col: 25 },
    { label: '仮', col: 28 },
    { label: '一次', col: 31 },
    { label: '二次', col: 34 },
  ];

  headers.forEach((h) => {
    const cell = sheet.getCell(currentRow, h.col);
    cell.value = h.label;
    cell.fill = fillHeader;
    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    };
    cell.border = borderAll;
    cell.font = defaultFont;
  });

  currentRow++;

  // 3.1 Nếu có data thì vẽ bảng với data
  if (listDatas?.length > 0) {
    if (title == '基本スキル' || title == '行動・情意') {
      listDatas.forEach((item) => {
        const title = item?.itemTitle?.trim() ?? '';
        const content = item?.content?.trim() ?? '';

        // Tính số ký tự hiển thị mỗi dòng theo số cột được merge
        const titleCharPerLine =
          (colMap.itemTitle.end - colMap.itemTitle.start + 1) * 5.5;
        const contentCharPerLine =
          (colMap.content.end - colMap.content.start + 1) * 5.5;

        // Tính chiều cao cần thiết dựa vào nội dung
        const titleHeight = getAccurateRowHeight(title, titleCharPerLine);
        const contentHeight = getAccurateRowHeight(content, contentCharPerLine);

        // Set chiều cao dòng
        sheet.getRow(currentRow).height =
          Math.max(titleHeight, contentHeight) * 2;

        // Set từng ô
        setMergedValue(currentRow, 'itemTitle', title, true);
        setMergedValue(currentRow, 'content', content, true);
        setMergedValue(currentRow, 'difficulty', item?.difficulty);
        setMergedValue(
          currentRow,
          'pointUser',
          item?.pointUser !== null
            ? item?.pointUser +
                `${
                  ' (' +
                  Number(item?.pointUser || 0) * Number(item?.difficulty || 0) +
                  ')'
                }`
            : '',
        );
        setMergedValue(
          currentRow,
          'pointEvaluator05',
          item?.pointEvaluator05 !== null
            ? item?.pointEvaluator05 +
                `${
                  ' (' +
                  Number(item?.pointEvaluator05 || 0) *
                    Number(item?.difficulty || 0) +
                  ')'
                }`
            : '',
        );
        setMergedValue(
          currentRow,
          'pointEvaluator1',
          item?.pointEvaluator1 !== null
            ? item?.pointEvaluator1 +
                `${
                  ' (' +
                  Number(item?.pointEvaluator1 || 0) *
                    Number(item?.difficulty || 0) +
                  ')'
                }`
            : '',
        );
        setMergedValue(
          currentRow,
          'pointEvaluator2',
          item?.pointEvaluator2 !== null
            ? item?.pointEvaluator2 +
                `${
                  ' (' +
                  Number(item?.pointEvaluator2 || 0) *
                    Number(item?.difficulty || 0) +
                  ')'
                }`
            : '',
        );
        currentRow += 1;
      });
    } else if (title == '専門スキル') {
      listDatas.forEach((item) => {
        const title = item?.itemTitle?.trim() ?? '';
        const content = item?.content?.trim() ?? '';

        // Tính số ký tự hiển thị mỗi dòng theo số cột được merge
        const titleCharPerLine =
          (colMap.itemTitle.end - colMap.itemTitle.start + 1) * 5.5;
        const contentCharPerLine =
          (colMap.content.end - colMap.content.start + 1) * 5.5;

        // Tính chiều cao cần thiết dựa vào nội dung
        const titleHeight = getAccurateRowHeight(title, titleCharPerLine);
        const contentHeight = getAccurateRowHeight(content, contentCharPerLine);

        // Set chiều cao dòng
        sheet.getRow(currentRow).height =
          Math.max(titleHeight, contentHeight) * 2;

        // Set từng ô
        setMergedValue(currentRow, 'itemTitle', title, true);
        setMergedValue(currentRow, 'content', content, true);
        setMergedValue(currentRow, 'difficulty', item?.difficulty);
        setMergedValue(
          currentRow,
          'pointUser',
          item?.totalPointUser !== null
            ? item?.pointUser + `${' (' + item?.totalPointUser + ')'}`
            : '',
        );
        setMergedValue(
          currentRow,
          'pointEvaluator05',
          item?.totalPointEvaluator05 !== null
            ? item?.pointEvaluator05 +
                `${' (' + item?.totalPointEvaluator05 + ')'}`
            : '',
        );
        setMergedValue(
          currentRow,
          'pointEvaluator1',
          item?.totalPointEvaluator1 !== null
            ? item?.pointEvaluator1 +
                `${' (' + item?.totalPointEvaluator1 + ')'}`
            : '',
        );
        setMergedValue(
          currentRow,
          'pointEvaluator2',
          item?.totalPointEvaluator2 !== null
            ? item?.pointEvaluator2 +
                `${' (' + item?.totalPointEvaluator2 + ')'}`
            : '',
        );
        currentRow += 1;
      });
    }

    // dòng 小計 cuối cùng cho các table
    if (title == '基本スキル') {
      // 1. 小計 ở cột B → X (cột 2 → 24), chỉ merge 1 dòng
      setSingleMergedValue(currentRow, 2, 24, '小計');

      // 2. Các điểm số 小計, mỗi cụm 3 cột (Y→AA, AB→AD,...), cũng chỉ merge 1 dòng
      setSingleMergedValue(currentRow, 25, 27, data?.basicTotalPointUser); // Y-AA - pointUser
      setSingleMergedValue(
        currentRow,
        28,
        30,
        data?.evaluator05 !== null ? data?.basicTotalPointEvaluator05 : '',
      ); // AB-AD - pointEvaluator05
      setSingleMergedValue(
        currentRow,
        31,
        33,
        data?.evaluator1 !== null ? data?.basicTotalPointEvaluator1 : '',
      ); // AE-AG - pointEvaluator1
      setSingleMergedValue(
        currentRow,
        34,
        36,
        data?.evaluator2 !== null ? data?.basicTotalPointEvaluator2 : '',
      ); // AH-AJ - pointEvaluator2
    } else if (title == '行動・情意') {
      // 1. 小計 ở cột B → X (cột 2 → 24), chỉ merge 1 dòng
      setSingleMergedValue(currentRow, 2, 24, '小計');

      // 2. Các điểm số 小計, mỗi cụm 3 cột (Y→AA, AB→AD,...), cũng chỉ merge 1 dòng
      setSingleMergedValue(currentRow, 25, 27, data?.behaviorTotalPointUser); // Y-AA - pointUser
      setSingleMergedValue(
        currentRow,
        28,
        30,
        data?.evaluator05 !== null ? data?.behaviorTotalPointEvaluator05 : '',
      ); // AB-AD - pointEvaluator05
      setSingleMergedValue(
        currentRow,
        31,
        33,
        data?.evaluator1 !== null ? data?.behaviorTotalPointEvaluator1 : '',
      ); // AE-AG - pointEvaluator1
      setSingleMergedValue(
        currentRow,
        34,
        36,
        data?.evaluator2 !== null ? data?.behaviorTotalPointEvaluator2 : '',
      ); // AH-AJ - pointEvaluator2
    } else if (title == '専門スキル') {
      // 1. 小計 ở cột B → X (cột 2 → 24), chỉ merge 1 dòng
      setSingleMergedValue(currentRow, 2, 24, '小計');

      // 2. Các điểm số 小計, mỗi cụm 3 cột (Y→AA, AB→AD,...), cũng chỉ merge 1 dòng
      setSingleMergedValue(currentRow, 25, 27, data?.proTotalPointUser); // Y-AA - pointUser
      setSingleMergedValue(
        currentRow,
        28,
        30,
        data?.evaluator05 !== null ? data?.proTotalPointEvaluator05 : '',
      ); // AB-AD - pointEvaluator05
      setSingleMergedValue(
        currentRow,
        31,
        33,
        data?.evaluator1 !== null ? data?.proTotalPointEvaluator1 : '',
      ); // AE-AG - pointEvaluator1
      setSingleMergedValue(
        currentRow,
        34,
        36,
        data?.evaluator2 !== null ? data?.proTotalPointEvaluator2 : '',
      ); // AH-AJ - pointEvaluator2
    }
  } else {
    // 3.2 Ko có data thì vẽ bảng với text
    setSingleMergedValue(currentRow, 2, 36, '該当データがありません');
  }

  // 4. Trả ra dòng tiếp theo để vẽ bảng khác
  return currentRow + 1;
};

export const personalGoal = (
  sheet: any,
  title: string,
  type: number,
  data: any,
  startRow: number,
) => {
  const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };

  let currentRow = startRow;
  const listGoals: any[] =
    data?.listGoal?.filter((f: any) => f?.type === type) || [];

  const borderAll = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  const getRowHeight = (text: string, charPerLine = 50) => {
    if (!text || typeof text !== 'string') return 15;
    const lines = text.split('\n');
    const height = lines.reduce((sum, line) => {
      return sum + Math.ceil(line.length / charPerLine);
    }, 0);
    return height * 15;
  };

  // === 1. Title chung ===
  sheet.mergeCells(`B${currentRow}:D${currentRow}`);
  const titleCell = sheet.getCell(`B${currentRow}`);
  titleCell.value = title;
  titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
  titleCell.border = borderAll;
  titleCell.font = defaultFont;
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'E2EFDA' }, // Màu xanh lá nhạt E2EFDA
  };
  sheet.getRow(currentRow).height = getRowHeight(title);
  currentRow += 1;

  // === 2. Nếu không có data ===
  if (!listGoals || listGoals.length === 0) {
    // Table 1 Header
    sheet.mergeCells(`B${currentRow}:G${currentRow + 1}`);
    sheet.getCell(`B${currentRow}`).value = '個人目標';
    sheet.mergeCells(`H${currentRow}:M${currentRow + 1}`);
    sheet.getCell(`H${currentRow}`).value = '指標・水準（達成数値）';
    sheet.mergeCells(`N${currentRow}:Z${currentRow + 1}`);
    sheet.getCell(`N${currentRow}`).value = '手段・方法（どのように）';
    sheet.mergeCells(`AA${currentRow}:AB${currentRow + 1}`);
    sheet.getCell(`AA${currentRow}`).value = 'ウェイト';
    sheet.mergeCells(`AC${currentRow}:AJ${currentRow}`);
    sheet.getCell(`AC${currentRow}`).value = '難易度';
    sheet.mergeCells(`AC${currentRow + 1}:AD${currentRow + 1}`);
    sheet.getCell(`AC${currentRow + 1}`).value = '本人';
    sheet.mergeCells(`AE${currentRow + 1}:AF${currentRow + 1}`);
    sheet.getCell(`AE${currentRow + 1}`).value = '仮';
    sheet.mergeCells(`AG${currentRow + 1}:AH${currentRow + 1}`);
    sheet.getCell(`AG${currentRow + 1}`).value = '一次';
    sheet.mergeCells(`AI${currentRow + 1}:AJ${currentRow + 1}`);
    sheet.getCell(`AI${currentRow + 1}`).value = '二次';

    for (let row = currentRow; row <= currentRow + 1; row++) {
      for (let col = 2; col <= 36; col++) {
        const cell = sheet.getCell(row, col);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E2EFDA' },
        };
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        };
        cell.border = borderAll;
        cell.font = defaultFont;
      }
    }

    currentRow += 2;
    sheet.mergeCells(`B${currentRow}:AJ${currentRow}`);
    const cell = sheet.getCell(`B${currentRow}`);
    cell.value = '該当データがありません';
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = borderAll;
    cell.font = defaultFont;

    return currentRow + 1;
  }

  // === 3. Có data – Mỗi item là 1 bảng ===
  listGoals.forEach((item, index) => {
    // === Table 1 Header ===
    sheet.mergeCells(`B${currentRow}:G${currentRow + 1}`);
    sheet.getCell(`B${currentRow}`).value = `個人目標（${index + 1}）`;
    sheet.mergeCells(`H${currentRow}:M${currentRow + 1}`);
    sheet.getCell(`H${currentRow}`).value = '指標・水準（達成数値）';
    sheet.mergeCells(`N${currentRow}:Z${currentRow + 1}`);
    sheet.getCell(`N${currentRow}`).value = '手段・方法（どのように）';
    sheet.mergeCells(`AA${currentRow}:AB${currentRow + 1}`);
    sheet.getCell(`AA${currentRow}`).value = 'ウェイト';
    sheet.mergeCells(`AC${currentRow}:AJ${currentRow}`);
    sheet.getCell(`AC${currentRow}`).value = '難易度';
    sheet.mergeCells(`AC${currentRow + 1}:AD${currentRow + 1}`);
    sheet.getCell(`AC${currentRow + 1}`).value = '本人';
    sheet.mergeCells(`AE${currentRow + 1}:AF${currentRow + 1}`);
    sheet.getCell(`AE${currentRow + 1}`).value = '仮';
    sheet.mergeCells(`AG${currentRow + 1}:AH${currentRow + 1}`);
    sheet.getCell(`AG${currentRow + 1}`).value = '一次';
    sheet.mergeCells(`AI${currentRow + 1}:AJ${currentRow + 1}`);
    sheet.getCell(`AI${currentRow + 1}`).value = '二次';

    for (let row = currentRow; row <= currentRow + 1; row++) {
      for (let col = 2; col <= 36; col++) {
        const cell = sheet.getCell(row, col);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E2EFDA' },
        };
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        };
        cell.border = borderAll;
        cell.font = defaultFont;
      }
    }

    currentRow += 2;

    // === Table 1 Data ===
    const endRow = currentRow;
    const mergeMap = {
      B: { end: 'G', value: item.title?.trim() },
      H: { end: 'M', value: item.achievementValue?.trim() },
      N: { end: 'Z', value: item.method?.trim() },
      AA: { end: 'AB', value: item.weight },
      AC: {
        end: 'AD',
        value: item.difficultyUser ? Number(item.difficultyUser) : '',
      },
      AE: {
        end: 'AF',
        value:
          data?.evaluator05 !== null
            ? item.difficultyEvaluator05
              ? Number(item.difficultyEvaluator05)
              : ''
            : '',
      },
      AG: {
        end: 'AH',
        value:
          data?.evaluator1 !== null
            ? item.difficultyEvaluator1
              ? Number(item.difficultyEvaluator1)
              : ''
            : '',
      },
      AI: {
        end: 'AJ',
        value:
          data?.evaluator2 !== null
            ? item.difficultyEvaluator2
              ? Number(item.difficultyEvaluator2)
              : ''
            : '',
      },
    };

    Object.entries(mergeMap).forEach(([start, { end, value }]) => {
      sheet.mergeCells(`${start}${currentRow}:${end}${endRow}`);
      const cell = sheet.getCell(`${start}${currentRow}`);
      cell.value = value ?? '';
      cell.alignment = {
        vertical: 'middle',
        horizontal: ['AA', 'AC', 'AE', 'AG', 'AI'].includes(start)
          ? 'center'
          : 'left',
        wrapText: true,
      };
      cell.border = borderAll;
      cell.font = defaultFont;
      // 💡 Format chỉ cho cột 難易度 (AC, AE, AG, AI)
      if (
        ['AC', 'AE', 'AG', 'AI'].includes(start) &&
        typeof value === 'number'
      ) {
        cell.numFmt = '0.0'; // ✅ Hiển thị 1 số thập phân
      }
    });
    sheet.getRow(currentRow).height = getRowHeight(
      Object.values(mergeMap)
        .map((m) => m.value)
        .join('\n'),
    );
    currentRow = endRow + 1;

    // === Table 2 Header (if goalSub) ===
    if (item.goalSub && item.goalSub.length > 0) {
      sheet.mergeCells(`B${currentRow}:AF${currentRow}`);
      sheet.getCell(`B${currentRow}`).value =
        '水準（指標がどのような状態になっているか）';
      sheet.mergeCells(`AG${currentRow}:AJ${currentRow}`);
      sheet.getCell(`AG${currentRow}`).value = '程度（度合）';

      for (let col = 2; col <= 36; col++) {
        const cell = sheet.getCell(currentRow, col);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'b8d8a5' },
        };
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        };
        cell.border = borderAll;
        cell.font = defaultFont;
      }

      currentRow += 1;

      // === Table 2 Data ===
      item.goalSub.forEach((sub: any) => {
        sheet.mergeCells(`B${currentRow}:AF${currentRow}`);
        sheet.mergeCells(`AG${currentRow}:AJ${currentRow}`);
        const cellNote = sheet.getCell(`B${currentRow}`);
        const cellDegree = sheet.getCell(`AG${currentRow}`);
        cellNote.value = sub.evaluationDecision?.trim();
        cellNote.alignment = {
          vertical: 'middle',
          horizontal: 'left',
          wrapText: true,
        };
        const degreeNumber = Number(sub.degree);
        const isNumber = !isNaN(degreeNumber) && sub.degree.trim() !== '';

        if (isNumber) {
          cellDegree.value = degreeNumber;
          cellDegree.numFmt = '0.0'; // Format số có 1 chữ số sau dấu chấm
        } else {
          cellDegree.value = sub.degree?.trim(); // Hiển thị text như nguyên bản
        }
        cellDegree.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
        cellNote.border = borderAll;
        cellDegree.border = borderAll;
        cellNote.font = defaultFont;
        cellDegree.font = defaultFont;
        sheet.getRow(currentRow).height = getRowHeight(sub.evaluationDecision);
        currentRow += 1;
      });
    }

    // === Table 3 Header === (chỉ merge 1 dòng, có wrapText, set row height)
    sheet.mergeCells(`B${currentRow}:D${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = `達成・未達成（${index + 1}）`;

    sheet.mergeCells(`E${currentRow}:N${currentRow}`);
    sheet.getCell(`E${currentRow}`).value = '達成理由／未達成理由';

    sheet.mergeCells(`O${currentRow}:AB${currentRow}`);
    sheet.getCell(`O${currentRow}`).value =
      '未達成の場合の達成するためのアクションプラン';

    sheet.mergeCells(`AC${currentRow}:AD${currentRow}`);
    sheet.getCell(`AC${currentRow}`).value = '本人';

    sheet.mergeCells(`AE${currentRow}:AF${currentRow}`);
    sheet.getCell(`AE${currentRow}`).value = '仮';

    sheet.mergeCells(`AG${currentRow}:AH${currentRow}`);
    sheet.getCell(`AG${currentRow}`).value = '一次';

    sheet.mergeCells(`AI${currentRow}:AJ${currentRow}`);
    sheet.getCell(`AI${currentRow}`).value = '二次';

    // ⚙️ Set border, wrapText, fill
    for (let col = 2; col <= 36; col++) {
      const cell = sheet.getCell(currentRow, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'b8d8a5' },
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.border = borderAll;
      cell.font = defaultFont;
    }

    // 📏 Tính chiều cao dòng header dựa theo nội dung dài nhất
    const getHeaderRowHeight = (text: string, charPerLine = 50): number => {
      const visualLength = text.replace(/[^\x00-\xff]/g, 'aa').length;
      const lines = Math.ceil(visualLength / charPerLine);
      return Math.max(15, lines * 15);
    };

    const longestHeaderText = '未達成の場合の達成するためのアクションプラン'; // dài nhất trong header

    sheet.getRow(currentRow).height = getHeaderRowHeight(longestHeaderText, 40);

    currentRow += 1;

    // === Table 3 Data ===
    const t3End = currentRow;
    const table3Map = {
      B: { end: 'D', value: item.achievementStatus?.trim() },
      E: { end: 'N', value: item.reasonComment?.trim() },
      O: { end: 'AB', value: item.actionPlan?.trim() },
      AC: { end: 'AD', value: item.pointUser },
      AE: {
        end: 'AF',
        value: data?.evaluator05 !== null ? item.pointEvaluator05 : '',
      },
      AG: {
        end: 'AH',
        value: data?.evaluator1 !== null ? item.pointEvaluator1 : '',
      },
      AI: {
        end: 'AJ',
        value: data?.evaluator2 !== null ? item.pointEvaluator2 : '',
      },
    };

    Object.entries(table3Map).forEach(([start, { end, value }]) => {
      sheet.mergeCells(`${start}${currentRow}:${end}${t3End}`);
      const cell = sheet.getCell(`${start}${currentRow}`);
      cell.value = value ?? '';
      cell.alignment = {
        vertical: 'middle',
        horizontal: ['AC', 'AE', 'AG', 'AI'].includes(start)
          ? 'center'
          : 'left',
        wrapText: true,
      };
      cell.border = borderAll;
      cell.font = defaultFont;
    });
    sheet.getRow(currentRow).height = getRowHeight(
      Object.values(table3Map)
        .map((m) => m.value)
        .join('\n'),
    );
    currentRow = t3End + 1;
  });

  // === Dòng subtotal "小計" cuối cùng sau tất cả dữ liệu ===
  sheet.mergeCells(`B${currentRow}:AB${currentRow}`);
  const subtotalCell = sheet.getCell(`B${currentRow}`);
  subtotalCell.value = '小計';
  subtotalCell.alignment = { horizontal: 'center', vertical: 'middle' };
  subtotalCell.border = borderAll;
  subtotalCell.font = defaultFont;

  // Set data các cột điểm: 本人 (AC:AD), 仮評価 (AE:AF), 一次評価 (AG:AH), 二次評価 (AI:AJ)
  const subtotalValues = {
    AC:
      data.achievementPersonalTotalPointUser !== null
        ? Math.round(data.achievementPersonalTotalPointUser)
        : '', // 本人
    AE:
      data.achievementPersonalTotalPointEvaluator05 !== null
        ? Math.round(data.achievementPersonalTotalPointEvaluator05)
        : '', // 仮評価
    AG:
      data.achievementPersonalTotalPointEvaluator1 !== null
        ? Math.round(data.achievementPersonalTotalPointEvaluator1)
        : '', // 一次評価
    AI:
      data.achievementPersonalTotalPointEvaluator2 !== null
        ? Math.round(data.achievementPersonalTotalPointEvaluator2)
        : '', // 二次評価
  };

  Object.entries(subtotalValues).forEach(([startCol, value]) => {
    const endCol = {
      AC: 'AD',
      AE: 'AF',
      AG: 'AH',
      AI: 'AJ',
    }[startCol];

    sheet.mergeCells(`${startCol}${currentRow}:${endCol}${currentRow}`);
    const cell = sheet.getCell(`${startCol}${currentRow}`);
    cell.value = value;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = borderAll;
    cell.font = defaultFont;
  });

  return currentRow + 1;
};

export const departmentGoal = (
  sheet: any,
  title: string,
  type: number,
  data: any,
  startRow: number,
) => {
  const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };

  let currentRow = startRow;

  const listGoals: any[] =
    data?.listGoal?.filter((f: any) => f?.type === type) || [];

  const borderAll = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  const getRowHeight = (text: string, charPerLine = 50) => {
    if (!text || typeof text !== 'string') return 15;
    const lines = text.split('\n');
    const height = lines.reduce((sum, line) => {
      return sum + Math.ceil(line.length / charPerLine);
    }, 0);
    return height * 16;
  };

  // === 1. Title chung ===
  sheet.mergeCells(`B${currentRow}:D${currentRow}`);
  const titleCell = sheet.getCell(`B${currentRow}`);
  titleCell.value = title;
  titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
  titleCell.border = borderAll;
  titleCell.font = defaultFont;
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'E2EFDA' }, // Màu xanh lá nhạt E2EFDA
  };
  sheet.getRow(currentRow).height = getRowHeight(title);
  currentRow += 1;

  // === 2. Nếu không có data ===
  if (!listGoals || listGoals.length === 0) {
    // Table 1 Header
    sheet.mergeCells(`B${currentRow}:G${currentRow + 1}`);
    sheet.getCell(`B${currentRow}`).value = '部門目標';
    sheet.mergeCells(`H${currentRow}:M${currentRow + 1}`);
    sheet.getCell(`H${currentRow}`).value = '指標・水準（達成数値）';
    sheet.mergeCells(`N${currentRow}:Z${currentRow + 1}`);
    sheet.getCell(`N${currentRow}`).value = '手段・方法（どのように）';
    sheet.mergeCells(`AA${currentRow}:AB${currentRow + 1}`);
    sheet.getCell(`AA${currentRow}`).value = 'ウェイト';
    sheet.mergeCells(`AC${currentRow}:AJ${currentRow}`);
    sheet.getCell(`AC${currentRow}`).value = '難易度';
    sheet.mergeCells(`AC${currentRow + 1}:AD${currentRow + 1}`);
    sheet.getCell(`AC${currentRow + 1}`).value = '本人';
    sheet.mergeCells(`AE${currentRow + 1}:AF${currentRow + 1}`);
    sheet.getCell(`AE${currentRow + 1}`).value = '仮';
    sheet.mergeCells(`AG${currentRow + 1}:AH${currentRow + 1}`);
    sheet.getCell(`AG${currentRow + 1}`).value = '一次';
    sheet.mergeCells(`AI${currentRow + 1}:AJ${currentRow + 1}`);
    sheet.getCell(`AI${currentRow + 1}`).value = '二次';

    for (let row = currentRow; row <= currentRow + 1; row++) {
      for (let col = 2; col <= 36; col++) {
        const cell = sheet.getCell(row, col);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E2EFDA' },
        };
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        };
        cell.border = borderAll;
        cell.font = defaultFont;
      }
    }

    currentRow += 2;
    sheet.mergeCells(`B${currentRow}:AJ${currentRow}`);
    const cell = sheet.getCell(`B${currentRow}`);
    cell.value = '該当データがありません';
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = borderAll;
    cell.font = defaultFont;
    return currentRow + 1;
  }

  // === 3. Có data – Mỗi item là 1 bảng ===
  listGoals.forEach((item, index) => {
    // === Table 1 Header ===
    sheet.mergeCells(`B${currentRow}:G${currentRow + 1}`);
    sheet.getCell(`B${currentRow}`).value = `部門目標（${index + 1}）`;
    sheet.mergeCells(`H${currentRow}:M${currentRow + 1}`);
    sheet.getCell(`H${currentRow}`).value = '指標・水準（達成数値）';
    sheet.mergeCells(`N${currentRow}:Z${currentRow + 1}`);
    sheet.getCell(`N${currentRow}`).value = '手段・方法（どのように）';
    sheet.mergeCells(`AA${currentRow}:AB${currentRow + 1}`);
    sheet.getCell(`AA${currentRow}`).value = 'ウェイト';
    sheet.mergeCells(`AC${currentRow}:AJ${currentRow}`);
    sheet.getCell(`AC${currentRow}`).value = '難易度';
    sheet.mergeCells(`AC${currentRow + 1}:AD${currentRow + 1}`);
    sheet.getCell(`AC${currentRow + 1}`).value = '本人';
    sheet.mergeCells(`AE${currentRow + 1}:AF${currentRow + 1}`);
    sheet.getCell(`AE${currentRow + 1}`).value = '仮';
    sheet.mergeCells(`AG${currentRow + 1}:AH${currentRow + 1}`);
    sheet.getCell(`AG${currentRow + 1}`).value = '一次';
    sheet.mergeCells(`AI${currentRow + 1}:AJ${currentRow + 1}`);
    sheet.getCell(`AI${currentRow + 1}`).value = '二次';

    for (let row = currentRow; row <= currentRow + 1; row++) {
      for (let col = 2; col <= 36; col++) {
        const cell = sheet.getCell(row, col);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'E2EFDA' },
        };
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        };
        cell.border = borderAll;
        cell.font = defaultFont;
      }
    }

    currentRow += 2;

    // === Table 1 Data ===
    const endRow = currentRow;
    const mergeMap = {
      B: { end: 'G', value: item.title?.trim() },
      H: { end: 'M', value: item.achievementValue?.trim() },
      N: { end: 'Z', value: item.method?.trim() },
      AA: { end: 'AB', value: item.weight },
      AC: {
        end: 'AD',
        value: item.difficultyUser ? item.difficultyUser : '',
      },
      AE: {
        end: 'AF',
        value:
          data?.evaluator05 !== null
            ? item.difficultyEvaluator05
              ? item.difficultyEvaluator05
              : ''
            : '',
      },
      AG: {
        end: 'AH',
        value:
          data?.evaluator1 !== null
            ? item.difficultyEvaluator1
              ? item.difficultyEvaluator1
              : ''
            : '',
      },
      AI: {
        end: 'AJ',
        value:
          data?.evaluator2 !== null
            ? item.difficultyEvaluator2
              ? item.difficultyEvaluator2
              : ''
            : '',
      },
    };

    Object.entries(mergeMap).forEach(([start, { end, value }]) => {
      sheet.mergeCells(`${start}${currentRow}:${end}${endRow}`);
      const cell = sheet.getCell(`${start}${currentRow}`);
      cell.value = value ?? '';
      cell.alignment = {
        vertical: 'middle',
        horizontal: ['AA', 'AC', 'AE', 'AG', 'AI'].includes(start)
          ? 'center'
          : 'left',
        wrapText: true,
      };
      cell.border = borderAll;
      cell.font = defaultFont;
      // 💡 Format chỉ cho cột 難易度 (AC, AE, AG, AI)
      if (
        ['AC', 'AE', 'AG', 'AI'].includes(start) &&
        typeof value === 'number'
      ) {
        cell.numFmt = '0.0'; // ✅ Hiển thị 1 số thập phân
      }
    });
    sheet.getRow(currentRow).height = getRowHeight(
      Object.values(mergeMap)
        .map((m) => m.value)
        .join('\n'),
    );
    currentRow = endRow + 1;

    // === Table 2 Header (if goalSub) ===
    if (item.goalSub && item.goalSub.length > 0) {
      sheet.mergeCells(`B${currentRow}:AF${currentRow}`);
      sheet.getCell(`B${currentRow}`).value =
        '水準（指標がどのような状態になっているか）';
      sheet.mergeCells(`AG${currentRow}:AJ${currentRow}`);
      sheet.getCell(`AG${currentRow}`).value = '係数';

      for (let col = 2; col <= 36; col++) {
        const cell = sheet.getCell(currentRow, col);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'b8d8a5' },
        };
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        };
        cell.border = borderAll;
        cell.font = defaultFont;
      }

      currentRow += 1;

      // === Table 2 Data ===
      item.goalSub.forEach((sub: any) => {
        sheet.mergeCells(`B${currentRow}:AF${currentRow}`);
        sheet.mergeCells(`AG${currentRow}:AJ${currentRow}`);
        const cellNote = sheet.getCell(`B${currentRow}`);
        const cellDegree = sheet.getCell(`AG${currentRow}`);
        cellNote.value = sub.evaluationDecision?.trim();
        cellNote.alignment = {
          vertical: 'middle',
          horizontal: 'left',
          wrapText: true,
        };
        const degreeNumber = Number(sub.coefficient);
        const isNumber = !isNaN(degreeNumber) && sub.coefficient.trim() !== '';

        if (isNumber) {
          cellDegree.value = degreeNumber;
          cellDegree.numFmt = '0.0'; // Format số có 1 chữ số sau dấu chấm
        } else {
          cellDegree.value = sub.degree?.trim(); // Hiển thị text như nguyên bản
        }
        cellDegree.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
        cellNote.border = borderAll;
        cellDegree.border = borderAll;
        cellNote.font = defaultFont;
        cellDegree.font = defaultFont;
        sheet.getRow(currentRow).height = getRowHeight(sub.evaluationDecision);
        currentRow += 1;
      });
    }

    // === Table 3 Header ===
    sheet.mergeCells(`B${currentRow}:D${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = `達成・未達成（${index + 1}）`;
    sheet.mergeCells(`E${currentRow}:L${currentRow}`);
    sheet.getCell(`E${currentRow}`).value = '達成理由／未達成理由';
    sheet.mergeCells(`M${currentRow}:T${currentRow}`);
    sheet.getCell(`M${currentRow}`).value =
      '達成するためのアクションプラン記載・ミス発生などインシデント内容の記載';
    sheet.mergeCells(`U${currentRow}:V${currentRow}`);
    sheet.getCell(`U${currentRow}`).value = '本人\n(点数)';
    sheet.mergeCells(`W${currentRow}:X${currentRow}`);
    sheet.getCell(`W${currentRow}`).value = '本人\n(係数)';
    sheet.mergeCells(`Y${currentRow}:Z${currentRow}`);
    sheet.getCell(`Y${currentRow}`).value = '仮\n(点数)';
    sheet.mergeCells(`AA${currentRow}:AB${currentRow}`);
    sheet.getCell(`AA${currentRow}`).value = '仮\n(係数)';
    sheet.mergeCells(`AC${currentRow}:AD${currentRow}`);
    sheet.getCell(`AC${currentRow}`).value = '一次\n(点数)';
    sheet.mergeCells(`AE${currentRow}:AF${currentRow}`);
    sheet.getCell(`AE${currentRow}`).value = '一次\n(係数)';
    sheet.mergeCells(`AG${currentRow}:AH${currentRow}`);
    sheet.getCell(`AG${currentRow}`).value = '二次\n(点数)';
    sheet.mergeCells(`AI${currentRow}:AJ${currentRow}`);
    sheet.getCell(`AI${currentRow}`).value = '二次\n(係数)';

    // ⚙️ Set border, wrapText, fill
    for (let col = 2; col <= 36; col++) {
      const cell = sheet.getCell(currentRow, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'b8d8a5' },
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.border = borderAll;
      cell.font = defaultFont;
    }

    // 📏 Tính chiều cao dòng header dựa theo nội dung dài nhất
    const getHeaderRowHeight = (text: string, charPerLine = 30): number => {
      const visualLength = text.replace(/[^\x00-\xff]/g, 'aa').length;
      const lines = Math.ceil(visualLength / charPerLine);
      return Math.max(40, lines * 18); // min = 40, mỗi dòng 18px
    };

    const longestHeaderText =
      '達成するためのアクションプラン記載・ミス発生などインシデント内容の記載'; // dài nhất trong header

    sheet.getRow(currentRow).height = getHeaderRowHeight(longestHeaderText, 30);

    currentRow += 1;

    // Table 3 Data
    const t3End = currentRow;
    const table3Map = {
      B: { end: 'D', value: item.achievementStatus?.trim() },
      E: { end: 'L', value: item.reasonComment?.trim() },
      M: { end: 'T', value: item.actionPlan?.trim() },
      U: { end: 'V', value: item.pointUser },
      W: {
        end: 'X',
        value: item.coefficientUser ? item.coefficientUser : '',
      },
      Y: {
        end: 'Z',
        value: data?.evaluator05 !== null ? item.pointEvaluator05 : '',
      },
      AA: {
        end: 'AB',
        value:
          data?.evaluator05 !== null
            ? item.coefficientEvaluator05
              ? item.coefficientEvaluator05
              : ''
            : '',
      },
      AC: {
        end: 'AD',
        value: data?.evaluator1 !== null ? item.pointEvaluator1 : '',
      },
      AE: {
        end: 'AF',
        value:
          data?.evaluator1 !== null
            ? item.coefficientEvaluator1
              ? item.coefficientEvaluator1
              : ''
            : '',
      },
      AG: {
        end: 'AH',
        value: data?.evaluator2 !== null ? item.pointEvaluator2 : '',
      },
      AI: {
        end: 'AJ',
        value:
          data?.evaluator2 !== null
            ? item.coefficientEvaluator2
              ? item.coefficientEvaluator2
              : ''
            : '',
      },
    };

    Object.entries(table3Map).forEach(([start, { end, value }]) => {
      sheet.mergeCells(`${start}${currentRow}:${end}${t3End}`);
      const cell = sheet.getCell(`${start}${currentRow}`);
      cell.value = value ?? '';
      cell.alignment = {
        vertical: 'middle',
        horizontal: ['U', 'W', 'Y', 'AA', 'AC', 'AE', 'AG', 'AI'].includes(
          start,
        )
          ? 'center'
          : 'left',
        wrapText: true,
      };
      cell.border = borderAll;
      cell.font = defaultFont;
      // 💡 Format chỉ cho cột 難易度 (AC, AE, AG, AI)
      if (
        ['W', 'AA', 'AE', 'AI'].includes(start) &&
        typeof value === 'number'
      ) {
        cell.numFmt = '0.0'; // ✅ Hiển thị 1 số thập phân
      }
    });
    sheet.getRow(currentRow).height = getRowHeight(
      Object.values(table3Map)
        .map((m) => m.value)
        .join('\n'),
    );
    currentRow = t3End + 1;
  });

  // === Dòng subtotal "小計" cuối cùng sau tất cả dữ liệu ===
  sheet.mergeCells(`B${currentRow}:T${currentRow}`);
  const subtotalCell = sheet.getCell(`B${currentRow}`);
  subtotalCell.value = '小計';
  subtotalCell.alignment = { horizontal: 'center', vertical: 'middle' };
  subtotalCell.border = borderAll;
  subtotalCell.font = defaultFont;

  // === Merge và ghi dữ liệu các cột 本人, 仮評価, 一次評価, 二次評価 ===
  const columnPairs = {
    U: 'V', // 本人(点数)
    W: 'X', // 本人(係数)
    Y: 'Z', // 仮評価(点数)
    AA: 'AB', // 仮評価(係数)
    AC: 'AD', // 一次評価(点数)
    AE: 'AF', // 一次評価(係数)
    AG: 'AH', // 二次評価(点数)
    AI: 'AJ', // 二次評価(係数)
  } as const;

  const subtotalValues: Record<keyof typeof columnPairs, number | string> = {
    U: '', // 本人(点数)
    W:
      data.summaryDepartment !== null
        ? data.summaryDepartment.achievementPersonalTotalPointUser
          ? data.summaryDepartment.achievementPersonalTotalPointUser
          : ''
        : '', // 本人(係数)
    Y: '', // 仮評価(点数)
    AA:
      data?.evaluator05 !== null
        ? data.summaryDepartment !== null
          ? data.summaryDepartment.achievementPersonalTotalPointEvaluator05
            ? data.summaryDepartment.achievementPersonalTotalPointEvaluator05
            : ''
          : ''
        : '', // 仮評価(係数)
    AC: '', // 一次評価(点数)
    AE:
      data?.evaluator1 !== null
        ? data.summaryDepartment !== null
          ? data.summaryDepartment.achievementPersonalTotalPointEvaluator1
            ? data.summaryDepartment.achievementPersonalTotalPointEvaluator1
            : ''
          : ''
        : '', // 一次評価(係数)
    AG: '', // 二次評価(点数)
    AI:
      data?.evaluator2 !== null
        ? data.summaryDepartment !== null
          ? data.summaryDepartment.achievementPersonalTotalPointEvaluator2
            ? data.summaryDepartment.achievementPersonalTotalPointEvaluator2
            : ''
          : ''
        : '', // 二次評価(係数)
  };

  (Object.keys(subtotalValues) as (keyof typeof columnPairs)[]).forEach(
    (startCol) => {
      const endCol = columnPairs[startCol];
      sheet.mergeCells(`${startCol}${currentRow}:${endCol}${currentRow}`);
      const cell = sheet.getCell(`${startCol}${currentRow}`);
      cell.value = subtotalValues[startCol];
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = borderAll;
      cell.font = defaultFont;
    },
  );

  return currentRow + 1;
};

export const additionalGoal = (
  sheet: any,
  title: string,
  type: number,
  data: any,
  startRow: number,
) => {
  const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };

  const listGoals: any[] =
    data?.listGoalAdditional?.filter((f: any) => f?.type === type) || [];

  const estimateLineCount = (text: string, widthCols: number): number => {
    if (!text || typeof text !== 'string') return 1;
    const lines = text.split('\n');
    const charPerLine = widthCols * 2.2;

    let total = 0;
    for (const line of lines) {
      const visualLength = line.replace(/[^\x00-\xff]/g, 'aa').length;
      total += Math.ceil(visualLength / charPerLine);
    }
    return Math.max(1, total);
  };

  const headerFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'E2EFDA' },
  };
  const border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  // ───── Title ─────
  sheet.mergeCells(`B${startRow}:G${startRow}`);
  const titleCell = sheet.getCell(`B${startRow}`);
  titleCell.value = title;
  titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
  titleCell.fill = headerFill;
  titleCell.border = border;
  titleCell.font = defaultFont;
  startRow++;

  // ───── Header ─────
  const headerRow = startRow;
  sheet.mergeCells(`B${headerRow}:G${headerRow}`);
  sheet.mergeCells(`H${headerRow}:J${headerRow}`);
  sheet.mergeCells(`K${headerRow}:AB${headerRow}`);
  sheet.mergeCells(`AC${headerRow}:AD${headerRow}`);
  sheet.mergeCells(`AE${headerRow}:AF${headerRow}`);
  sheet.mergeCells(`AG${headerRow}:AH${headerRow}`);
  sheet.mergeCells(`AI${headerRow}:AJ${headerRow}`);

  const headers = [
    ['B', 'その他特記事項'],
    ['H', '達成／未達成'],
    ['K', '理由および本人コメント'],
    ['AC', '本人'],
    ['AE', '仮'],
    ['AG', '一次'],
    ['AI', '二次'],
  ];

  for (const [col, label] of headers) {
    const cell = sheet.getCell(`${col}${headerRow}`);
    cell.value = label;
    cell.fill = headerFill;
    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    };
    cell.border = border;
    cell.font = defaultFont;
  }

  startRow++;

  // ───── No Data Case ─────
  if (!listGoals || listGoals.length === 0) {
    sheet.mergeCells(`B${startRow}:AJ${startRow}`);
    const cell = sheet.getCell(`B${startRow}`);
    cell.value = '該当データがありません';
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = border;
    cell.font = defaultFont;
    return startRow + 1;
  }

  // ───── Data Rows ─────
  for (const row of listGoals) {
    sheet.mergeCells(`B${startRow}:G${startRow}`);
    sheet.mergeCells(`H${startRow}:J${startRow}`);
    sheet.mergeCells(`K${startRow}:AB${startRow}`);
    sheet.mergeCells(`AC${startRow}:AD${startRow}`);
    sheet.mergeCells(`AE${startRow}:AF${startRow}`);
    sheet.mergeCells(`AG${startRow}:AH${startRow}`);
    sheet.mergeCells(`AI${startRow}:AJ${startRow}`);

    const setCell = (
      col: string,
      value: string | null,
      align: 'left' | 'center',
    ) => {
      const cell = sheet.getCell(`${col}${startRow}`);
      cell.value = value || '';
      cell.alignment = {
        horizontal: align,
        vertical: 'middle',
        wrapText: true,
      };
      cell.border = border;
      cell.font = defaultFont;
    };

    setCell('B', row.titleAdditional?.trim(), 'left');
    setCell('H', row.achievementStatus?.trim(), 'center');
    setCell('K', row.reasonComment?.trim(), 'left');
    setCell('AC', row.pointUser, 'center');
    setCell(
      'AE',
      data?.evaluator05 !== null ? row.pointEvaluator05 : '',
      'center',
    );
    setCell(
      'AG',
      data?.evaluator1 !== null ? row.pointEvaluator1 : '',
      'center',
    );
    setCell(
      'AI',
      data?.evaluator2 !== null ? row.pointEvaluator2 : '',
      'center',
    );

    // 👉 Tính chiều cao dòng chính xác
    const linesB = estimateLineCount(row.titleAdditional || '', 6);
    const linesK = estimateLineCount(row.reasonComment || '', 18);
    const maxLines = Math.max(linesB, linesK);
    sheet.getRow(startRow).height = Math.min(120, maxLines * 15); // Giới hạn tối đa

    startRow++;
  }

  if (type === 1 || type === 2) {
    // ───── Subtotal 小計 ─────
    sheet.mergeCells(`B${startRow}:AB${startRow}`);
    const subtotalCell = sheet.getCell(`B${startRow}`);
    subtotalCell.value = '小計';
    subtotalCell.alignment = { horizontal: 'center', vertical: 'middle' };
    subtotalCell.border = border;
    subtotalCell.font = defaultFont;

    const subtotalMergeMap: Record<string, string> = {
      AC: 'AD',
      AE: 'AF',
      AG: 'AH',
      AI: 'AJ',
    };
    const subtotalValues: Record<string, string | number> = {
      AC:
        data.achievementAdditionalTotalPointUser !== null
          ? Math.floor(data.achievementAdditionalTotalPointUser)
          : '',
      AE:
        data?.evaluator05 !== null
          ? data.achievementAdditionalTotalPointEvaluator05 !== null
            ? Math.floor(data.achievementAdditionalTotalPointEvaluator05)
            : ''
          : '',
      AG:
        data?.evaluator1 !== null
          ? data.achievementAdditionalTotalPointEvaluator1 !== null
            ? Math.floor(data.achievementAdditionalTotalPointEvaluator1)
            : ''
          : '',
      AI:
        data?.evaluator2 !== null
          ? data.achievementAdditionalTotalPointEvaluator2 !== null
            ? Math.floor(data.achievementAdditionalTotalPointEvaluator2)
            : ''
          : '',
    };

    for (const col in subtotalValues) {
      const toCol = subtotalMergeMap[col];
      sheet.mergeCells(`${col}${startRow}:${toCol}${startRow}`);
      const cell = sheet.getCell(`${col}${startRow}`);
      cell.value = subtotalValues[col];
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = border;
      cell.font = defaultFont;
    }
  } else if (type === 3) {
    const get2WithoutRound = (num: number) => {
      let temp = '';
      if (num) {
        temp = num.toString(); // If it's not already a String
        temp = temp.slice(0, temp.indexOf('.') + 3); // With 3 exposing the hundredths place
      }

      return Number(temp);
    };

    // ───── Subtotal 小計 ─────
    sheet.mergeCells(`B${startRow}:AB${startRow}`);
    const subtotalCell = sheet.getCell(`B${startRow}`);
    subtotalCell.value = '小計';
    subtotalCell.alignment = { horizontal: 'center', vertical: 'middle' };
    subtotalCell.border = border;
    subtotalCell.font = defaultFont;

    const subtotalMergeMap: Record<string, string> = {
      AC: 'AD',
      AE: 'AF',
      AG: 'AH',
      AI: 'AJ',
    };
    const subtotalValues: Record<string, string | number> = {
      AC:
        data.summaryDepartment !== null
          ? data.summaryDepartment?.achievementAdditionalTotalPointUser !== null
            ? get2WithoutRound(
                data.summaryDepartment?.achievementAdditionalTotalPointUser,
              )
            : ''
          : '',
      AE:
        data.summaryDepartment !== null
          ? data?.evaluator05 !== null
            ? data.summaryDepartment
                ?.achievementAdditionalTotalPointEvaluator05 !== null
              ? get2WithoutRound(
                  data.summaryDepartment
                    ?.achievementAdditionalTotalPointEvaluator05,
                )
              : ''
            : ''
          : '',
      AG:
        data.summaryDepartment !== null
          ? data?.evaluator1 !== null
            ? data.summaryDepartment
                ?.achievementAdditionalTotalPointEvaluator1 !== null
              ? get2WithoutRound(
                  data.summaryDepartment
                    ?.achievementAdditionalTotalPointEvaluator1,
                )
              : ''
            : ''
          : '',
      AI:
        data.summaryDepartment !== null
          ? data?.evaluator2 !== null
            ? data.summaryDepartment
                ?.achievementAdditionalTotalPointEvaluator2 !== null
              ? get2WithoutRound(
                  data.summaryDepartment
                    ?.achievementAdditionalTotalPointEvaluator2,
                )
              : ''
            : ''
          : '',
    };

    for (const col in subtotalValues) {
      const toCol = subtotalMergeMap[col];
      sheet.mergeCells(`${col}${startRow}:${toCol}${startRow}`);
      const cell = sheet.getCell(`${col}${startRow}`);
      cell.value = subtotalValues[col];
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = border;
      cell.font = defaultFont;
    }
  }

  return startRow + 1;
};

export const comment = (sheet: any, data: any, startRow: number) => {
  const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };
  const user = { comment: data.commentUser?.trim() || '' };
  const evaluator05 = {
    comment: data?.evaluator05?.commentPublic?.trim() || '',
  };
  const evaluator1 = { comment: data?.evaluator1?.commentPublic?.trim() || '' };
  const evaluator2 = { comment: data?.evaluator2?.commentPublic?.trim() || '' };

  const headerFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'E2EFDA' },
  };

  const border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  };

  const alignLeftWrap = {
    horizontal: 'left',
    vertical: 'middle',
    wrapText: true,
  };

  const blocks = [
    { title: '本人コメント', value: user?.comment },
    { title: '仮コメント', value: evaluator05?.comment },
    { title: '一次コメント', value: evaluator1?.comment },
    { title: '二次コメント', value: evaluator2?.comment },
  ];

  // Hàm tính chiều cao dòng dựa trên chiều rộng tương đối
  const estimateHeight = (text: string, colCount: number = 35) => {
    if (!text || typeof text !== 'string') return 15;
    const lines = text.split('\n');
    let totalLines = 0;
    const charPerLine = colCount * 2;

    for (const line of lines) {
      const visualLength = line.replace(/[^\x00-\xff]/g, 'aa').length;
      totalLines += Math.ceil(visualLength / charPerLine);
    }

    return Math.max(15, totalLines * 15); // mỗi dòng khoảng 15pt
  };

  for (const block of blocks) {
    // ── Title ──
    const titleRange = `B${startRow}:E${startRow}`;
    sheet.mergeCells(titleRange);
    const titleCell = sheet.getCell(`B${startRow}`);
    titleCell.value = block.title;
    titleCell.fill = headerFill;
    titleCell.alignment = alignLeftWrap;
    titleCell.border = border;
    titleCell.font = defaultFont;

    // ── Content (merge 1 dòng) ──
    const contentRow = startRow + 1;
    const contentRange = `B${contentRow}:AJ${contentRow}`;
    sheet.mergeCells(contentRange);
    const contentCell = sheet.getCell(`B${contentRow}`);

    if (block.value?.trim()) {
      contentCell.value = block.value;
    } else {
      contentCell.value = '該当データがありません';
    }

    contentCell.alignment = alignLeftWrap;
    contentCell.border = border;
    contentCell.font = defaultFont;

    // ✅ Tính chiều cao dòng động
    sheet.getRow(contentRow).height = estimateHeight(contentCell.value, 50);

    startRow += 2; // 1 dòng tiêu đề + 1 dòng nội dung
  }

  return startRow;
};

type SummaryRowPersonal = {
  title: string;
  skillPoint: any;
  skillPecent: any;
  behaviorPoint: any;
  behaviorPecent: any;
  personalPoint: any;
  personalPecent: any;
  additionPoint: any;
  totalPoint: any;
};

export const totalPersonal = (
  sheet: any,
  title: string,
  flagSkill: number,
  data: any,
  startRow: number,
) => {
  const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };

  const handleTotal = (total: number | undefined) => {
    return total !== null ? Math.round(total) : null;
  };

  const skillPercent = data?.skillPercent || 0;
  const behaviorPercent = data?.behaviorPercent || 0;
  const achievementPercent = data?.achievementPercent || 0;

  const percent100 =
    parseInt(skillPercent) +
    parseInt(behaviorPercent) +
    parseInt(achievementPercent);

  const isDisplayData = percent100 == 100 ? true : false; // biến dùng để check data khi hiển thị cho 8-10 ko có skill từ 2024 kỳ 2 trỡ về trước

  const listPoints: SummaryRowPersonal[] = [
    {
      title: '本人',
      skillPoint: isDisplayData
        ? data.basicProTotalPointUser !== null
          ? Math.round(data.basicProTotalPointUser)
          : null
        : '',
      skillPecent: isDisplayData ? `${data?.skillPercent}%` : '',
      behaviorPoint: isDisplayData
        ? data.behaviorTotalPointUser !== null
          ? Math.round(data.behaviorTotalPointUser)
          : null
        : '',
      behaviorPecent: isDisplayData ? `${data?.behaviorPercent}%` : '',
      personalPoint: isDisplayData
        ? data.achievementPersonalTotalPointUser !== null
          ? Math.round(data.achievementPersonalTotalPointUser)
          : null
        : '',
      personalPecent: isDisplayData ? `${data?.achievementPercent}%` : '',
      additionPoint: isDisplayData
        ? data.achievementAdditionalTotalPointUser !== null
          ? Math.round(data.achievementAdditionalTotalPointUser)
          : null
        : '',
      totalPoint: isDisplayData ? handleTotal(data.summaryPointUser) : '',
    },
    {
      title: '仮',
      skillPoint: isDisplayData
        ? data?.evaluator05 !== null
          ? data.basicProTotalPointEvaluator05 !== null
            ? Math.round(data.basicProTotalPointEvaluator05)
            : null
          : ''
        : '',
      skillPecent: isDisplayData
        ? data?.evaluator05 !== null
          ? `${data?.skillPercent}%`
          : ''
        : '',
      behaviorPoint: isDisplayData
        ? data?.evaluator05 !== null
          ? data.behaviorTotalPointEvaluator05 !== null
            ? Math.round(data.behaviorTotalPointEvaluator05)
            : null
          : ''
        : '',
      behaviorPecent: isDisplayData
        ? data?.evaluator05 !== null
          ? `${data?.behaviorPercent}%`
          : ''
        : '',
      personalPoint: isDisplayData
        ? data?.evaluator05 !== null
          ? data.achievementPersonalTotalPointEvaluator05 !== null
            ? Math.round(data.achievementPersonalTotalPointEvaluator05)
            : null
          : ''
        : '',
      personalPecent: isDisplayData
        ? data?.evaluator05 !== null
          ? `${data?.achievementPercent}%`
          : ''
        : '',
      additionPoint: isDisplayData
        ? data?.evaluator05 !== null
          ? data.achievementAdditionalTotalPointEvaluator05 !== null
            ? Math.round(data.achievementAdditionalTotalPointEvaluator05)
            : null
          : ''
        : '',
      totalPoint: isDisplayData
        ? data?.evaluator05 !== null
          ? handleTotal(data.summaryPointEvaluator05)
          : ''
        : '',
    },
    {
      title: '一次',
      skillPoint: isDisplayData
        ? data?.evaluator1 !== null
          ? data.basicProTotalPointEvaluator1 !== null
            ? Math.round(data.basicProTotalPointEvaluator1)
            : null
          : ''
        : '',
      skillPecent: isDisplayData
        ? data?.evaluator1 !== null
          ? `${data?.skillPercent}%`
          : ''
        : '',
      behaviorPoint: isDisplayData
        ? data?.evaluator1 !== null
          ? data.behaviorTotalPointEvaluator1 !== null
            ? Math.round(data.behaviorTotalPointEvaluator1)
            : null
          : ''
        : '',
      behaviorPecent: isDisplayData
        ? data?.evaluator1 !== null
          ? `${data?.behaviorPercent}%`
          : ''
        : '',
      personalPoint: isDisplayData
        ? data?.evaluator1 !== null
          ? data.achievementPersonalTotalPointEvaluator1 !== null
            ? Math.round(data.achievementPersonalTotalPointEvaluator1)
            : null
          : ''
        : '',
      personalPecent: isDisplayData
        ? data?.evaluator1 !== null
          ? `${data?.achievementPercent}%`
          : ''
        : '',
      additionPoint: isDisplayData
        ? data?.evaluator1 !== null
          ? data.achievementAdditionalTotalPointEvaluator1 !== null
            ? Math.round(data.achievementAdditionalTotalPointEvaluator1)
            : null
          : ''
        : '',
      totalPoint: isDisplayData
        ? data?.evaluator1 !== null
          ? handleTotal(data.summaryPointEvaluator1)
          : ''
        : '',
    },
    {
      title: '二次',
      skillPoint: isDisplayData
        ? data?.evaluator2 !== null
          ? data.basicProTotalPointEvaluator2 !== null
            ? Math.round(data.basicProTotalPointEvaluator2)
            : null
          : ''
        : '',
      skillPecent: isDisplayData
        ? data?.evaluator2 !== null
          ? `${data?.skillPercent}%`
          : ''
        : '',
      behaviorPoint: isDisplayData
        ? data?.evaluator2 !== null
          ? data.behaviorTotalPointEvaluator2 !== null
            ? Math.round(data.behaviorTotalPointEvaluator2)
            : null
          : ''
        : '',
      behaviorPecent: isDisplayData
        ? data?.evaluator2 !== null
          ? `${data?.behaviorPercent}%`
          : ''
        : '',
      personalPoint: isDisplayData
        ? data?.evaluator2 !== null
          ? data.achievementPersonalTotalPointEvaluator2 !== null
            ? Math.round(data.achievementPersonalTotalPointEvaluator2)
            : null
          : ''
        : '',
      personalPecent: isDisplayData
        ? data?.evaluator2 !== null
          ? `${data?.achievementPercent}%`
          : ''
        : '',
      additionPoint: isDisplayData
        ? data?.evaluator2 !== null
          ? data.achievementAdditionalTotalPointEvaluator2 !== null
            ? Math.round(data.achievementAdditionalTotalPointEvaluator2)
            : null
          : ''
        : '',
      totalPoint: isDisplayData
        ? data?.evaluator2 !== null
          ? handleTotal(data.summaryPointEvaluator2)
          : ''
        : '',
    },
  ];

  const getRowHeight = (text: string, charPerLine = 10) => {
    if (!text || typeof text !== 'string') return 15;
    const lines = text.split('\n');
    const height = lines.reduce((sum, line) => {
      return sum + Math.ceil(line.length / charPerLine);
    }, 0);
    return Math.max(height, 1) * 15;
  };

  const borderAll = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  const fillHeader = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE2EFDA' },
  };

  const headerRow = startRow;

  if (flagSkill == 1) {
    //* Total có skill
    const headers = [
      { label: title, start: 'N', end: 'O' },
      { label: 'スキル評価計', start: 'P', end: 'R' },
      { label: 'ウェイト', start: 'S', end: 'T' },
      { label: '行動・情意評価計', start: 'U', end: 'W' },
      { label: 'ウェイト', start: 'X', end: 'Y' },
      { label: '成果評価計', start: 'Z', end: 'AB' },
      { label: 'ウェイト', start: 'AC', end: 'AD' },
      { label: '追加目標・成果', start: 'AE', end: 'AG' },
      { label: '総計', start: 'AH', end: 'AJ' },
    ];

    // === Render header row (merge 2 rows) ===
    headers.forEach(({ label, start, end }) => {
      sheet.mergeCells(`${start}${headerRow}:${end}${headerRow + 1}`);
      const cell = sheet.getCell(`${start}${headerRow}`);
      cell.value = label;
      cell.fill = fillHeader;
      cell.border = borderAll;
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.font = defaultFont;
    });

    // === Render data rows ===
    let row = headerRow + 2;

    listPoints.forEach((item) => {
      const rowHeight = getRowHeight(item.title);

      // SS column
      sheet.mergeCells(`N${row}:O${row}`);
      const cellSS = sheet.getCell(`N${row}`);
      cellSS.value = item.title?.trim();
      cellSS.fill = fillHeader;
      cellSS.border = borderAll;
      cellSS.font = defaultFont;
      cellSS.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };

      // Other columns
      const cellsMap = [
        { value: item.skillPoint, range: `P${row}:R${row}` },
        { value: item.skillPecent, range: `S${row}:T${row}` },
        { value: item.behaviorPoint, range: `U${row}:W${row}` },
        { value: item.behaviorPecent, range: `X${row}:Y${row}` },
        { value: item.personalPoint, range: `Z${row}:AB${row}` },
        { value: item.personalPecent, range: `AC${row}:AD${row}` },
        { value: item.additionPoint, range: `AE${row}:AG${row}` },
        { value: item.totalPoint, range: `AH${row}:AJ${row}` },
      ];

      // ✅ Nếu là chuỗi phần trăm, chuyển thành số và format
      cellsMap.forEach(({ value, range }) => {
        sheet.mergeCells(range);
        const cell = sheet.getCell(range.split(':')[0]);
        if (typeof value === 'string' && value.includes('%')) {
          const numeric = parseFloat(value.replace('%', '')) / 100;
          cell.value = numeric;
          cell.numFmt = '0%'; // hoặc '0.0%' nếu muốn hiển thị thập phân
        } else {
          cell.value = value;
        }
        cell.border = borderAll;
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        };
        cell.font = defaultFont;
      });

      sheet.getRow(row).height = rowHeight;
      row += 1;
    });

    return row;
  } else {
    //* Total ko skill
    const headers = [
      { label: title, start: 'N', end: 'O' },
      { label: '行動・情意評価計', start: 'P', end: 'S' },
      { label: 'ウェイト', start: 'T', end: 'V' },
      { label: '成果評価計', start: 'W', end: 'Z' },
      { label: 'ウェイト', start: 'AA', end: 'AC' },
      { label: '追加目標・成果', start: 'AD', end: 'AG' },
      { label: '総計', start: 'AH', end: 'AJ' },
    ];

    // === Render header row (merge 2 rows) ===
    headers.forEach(({ label, start, end }) => {
      sheet.mergeCells(`${start}${headerRow}:${end}${headerRow + 1}`);
      const cell = sheet.getCell(`${start}${headerRow}`);
      cell.value = label;
      cell.fill = fillHeader;
      cell.border = borderAll;
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.font = defaultFont;
    });

    // === Render data rows ===
    let row = headerRow + 2;

    listPoints.forEach((item) => {
      const rowHeight = getRowHeight(item.title);

      // SS column
      sheet.mergeCells(`N${row}:O${row}`);
      const cellSS = sheet.getCell(`N${row}`);
      cellSS.value = item.title;
      cellSS.fill = fillHeader;
      cellSS.border = borderAll;
      cellSS.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cellSS.font = defaultFont;

      // Other columns
      const cellsMap = [
        { value: item.behaviorPoint, range: `P${row}:S${row}` },
        { value: item.behaviorPecent, range: `T${row}:V${row}` },
        { value: item.personalPoint, range: `W${row}:Z${row}` },
        { value: item.personalPecent, range: `AA${row}:AC${row}` },
        { value: item.additionPoint, range: `AD${row}:AG${row}` },
        { value: item.totalPoint, range: `AH${row}:AJ${row}` },
      ];
      // ✅ Nếu là chuỗi phần trăm, chuyển thành số và format
      cellsMap.forEach(({ value, range }) => {
        sheet.mergeCells(range);
        const cell = sheet.getCell(range.split(':')[0]);
        if (typeof value === 'string' && value.includes('%')) {
          const numeric = parseFloat(value.replace('%', '')) / 100;
          cell.value = numeric;
          cell.numFmt = '0%'; // hoặc '0.0%' nếu muốn hiển thị thập phân
        } else {
          cell.value = value;
        }
        cell.border = borderAll;
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        };
        cell.font = defaultFont;
      });

      sheet.getRow(row).height = rowHeight;
      row += 1;
    });

    return row;
  }
};

export const title = (sheet: any, title: string, startRow: number) => {
  const titleCell = sheet.getCell(`B${startRow}`);
  titleCell.value = title;
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.font = {
    bold: true,
    color: { argb: 'FF00703C' },
    size: 16,
    name: 'ＭＳ ゴシック',
  };

  return startRow + 1;
};

type SummaryRowDepartment = {
  title: string;
  achievementPersonalTotalPoint: number | string;
  achievementAdditionalTotalPoint: number | string;
  summaryPoint: number | string;
  summaryCharPoint: number | string;
};

export const totalDepartment = (
  sheet: any,
  title: string,
  data: any,
  startRow: number,
) => {
  const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };

  const get2WithoutRound = (num: number) => {
    let temp = '';
    if (num) {
      temp = num.toString(); // If it's not already a String
      temp = temp.slice(0, temp.indexOf('.') + 3); // With 3 exposing the hundredths place
    }

    return Number(temp);
  };
  const listPoints: SummaryRowDepartment[] = [
    {
      title: '本人',
      achievementPersonalTotalPoint:
        data.summaryDepartment !== null
          ? data.summaryDepartment?.achievementPersonalTotalPointUser !== null
            ? Number(
                data.summaryDepartment?.achievementPersonalTotalPointUser,
              ).toFixed(2)
            : ''
          : '',
      achievementAdditionalTotalPoint:
        data.summaryDepartment !== null
          ? data.summaryDepartment?.achievementAdditionalTotalPointUser !== null
            ? get2WithoutRound(
                data.summaryDepartment?.achievementAdditionalTotalPointUser,
              )
            : ''
          : '',
      summaryPoint:
        data.summaryDepartment !== null
          ? data.summaryDepartment?.summaryPointUser !== null
            ? data.summaryDepartment?.summaryPointUser
            : ''
          : '',
      summaryCharPoint:
        data.summaryDepartment !== null
          ? data.summaryDepartment?.summaryCharPointUser !== null
            ? data.summaryDepartment?.summaryCharPointUser
            : ''
          : '',
    },
    {
      title: '仮',
      achievementPersonalTotalPoint:
        data?.evaluator05 !== null
          ? data.summaryDepartment !== null
            ? data.summaryDepartment
                ?.achievementPersonalTotalPointEvaluator05 !== null
              ? Number(
                  data.summaryDepartment
                    ?.achievementPersonalTotalPointEvaluator05,
                ).toFixed(2)
              : ''
            : ''
          : '',
      achievementAdditionalTotalPoint:
        data?.evaluator05 !== null
          ? data.summaryDepartment !== null
            ? data.summaryDepartment
                ?.achievementAdditionalTotalPointEvaluator05 !== null
              ? get2WithoutRound(
                  data.summaryDepartment
                    ?.achievementAdditionalTotalPointEvaluator05,
                )
              : ''
            : ''
          : '',
      summaryPoint:
        data?.evaluator05 !== null
          ? data.summaryDepartment !== null
            ? data.summaryDepartment?.summaryPointEvaluator05 !== null
              ? data.summaryDepartment?.summaryPointEvaluator05
              : ''
            : ''
          : '',
      summaryCharPoint:
        data?.evaluator05 !== null
          ? data.summaryDepartment !== null
            ? data.summaryDepartment?.summaryCharPointEvaluator05 !== null
              ? data.summaryDepartment?.summaryCharPointEvaluator05
              : ''
            : ''
          : '',
    },
    {
      title: '一次',
      achievementPersonalTotalPoint:
        data?.evaluator1 !== null
          ? data.summaryDepartment !== null
            ? data.summaryDepartment
                ?.achievementPersonalTotalPointEvaluator1 !== null
              ? Number(
                  data.summaryDepartment
                    ?.achievementPersonalTotalPointEvaluator1,
                ).toFixed(2)
              : ''
            : ''
          : '',
      achievementAdditionalTotalPoint:
        data?.evaluator1 !== null
          ? data.summaryDepartment !== null
            ? data.summaryDepartment
                ?.achievementAdditionalTotalPointEvaluator1 !== null
              ? get2WithoutRound(
                  data.summaryDepartment
                    ?.achievementAdditionalTotalPointEvaluator1,
                )
              : ''
            : ''
          : '',
      summaryPoint:
        data?.evaluator1 !== null
          ? data.summaryDepartment !== null
            ? data.summaryDepartment?.summaryPointEvaluator1 !== null
              ? data.summaryDepartment?.summaryPointEvaluator1
              : ''
            : ''
          : '',
      summaryCharPoint:
        data?.evaluator1 !== null
          ? data.summaryDepartment !== null
            ? data.summaryDepartment?.summaryCharPointEvaluator1 !== null
              ? data.summaryDepartment?.summaryCharPointEvaluator1
              : ''
            : ''
          : '',
    },
    {
      title: '二次',
      achievementPersonalTotalPoint:
        data?.evaluator2 !== null
          ? data.summaryDepartment !== null
            ? data.summaryDepartment.achievementPersonalTotalPointEvaluator2 !==
              null
              ? Number(
                  data.summaryDepartment
                    .achievementPersonalTotalPointEvaluator2,
                ).toFixed(2)
              : ''
            : ''
          : '',
      achievementAdditionalTotalPoint:
        data?.evaluator2 !== null
          ? data.summaryDepartment !== null
            ? data.summaryDepartment
                ?.achievementAdditionalTotalPointEvaluator2 !== null
              ? get2WithoutRound(
                  data.summaryDepartment
                    ?.achievementAdditionalTotalPointEvaluator2,
                )
              : ''
            : ''
          : '',
      summaryPoint:
        data?.evaluator2 !== null
          ? data.summaryDepartment !== null
            ? data.summaryDepartment?.summaryPointEvaluator2 !== null
              ? data.summaryDepartment?.summaryPointEvaluator2
              : ''
            : ''
          : '',
      summaryCharPoint:
        data?.evaluator2 !== null
          ? data.summaryDepartment !== null
            ? data.summaryDepartment?.summaryCharPointEvaluator2 !== null
              ? data.summaryDepartment?.summaryCharPointEvaluator2
              : ''
            : ''
          : '',
    },
  ];

  const getRowHeight = (text: string, charPerLine = 10) => {
    if (!text || typeof text !== 'string') return 15;
    const lines = text.split('\n');
    const height = lines.reduce((sum, line) => {
      return sum + Math.ceil(line.length / charPerLine);
    }, 0);
    return Math.max(height, 1) * 15;
  };

  const borderAll = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  const fillHeader = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE2EFDA' },
  };

  const headerRow = startRow;

  const headers = [
    { label: title, start: 'N', end: 'P' },
    { label: '部門成果', start: 'Q', end: 'U' },
    { label: '追加目標・成果', start: 'V', end: 'Z' },
    { label: '部門評価計', start: 'AA', end: 'AE' },
    { label: '個人評価', start: 'AF', end: 'AJ' },
  ];

  // === Render header row (merge 2 rows) ===
  headers.forEach(({ label, start, end }) => {
    sheet.mergeCells(`${start}${headerRow}:${end}${headerRow + 1}`);
    const cell = sheet.getCell(`${start}${headerRow}`);
    cell.value = label;
    cell.fill = fillHeader;
    cell.border = borderAll;
    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    };
    cell.font = defaultFont;
  });

  // === Render data rows ===
  let row = headerRow + 2;

  listPoints.forEach((item) => {
    const rowHeight = getRowHeight(item.title);

    // SS column
    sheet.mergeCells(`N${row}:P${row}`);
    const cellSS = sheet.getCell(`N${row}`);
    cellSS.value = item.title;
    cellSS.fill = fillHeader;
    cellSS.border = borderAll;
    cellSS.alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    };
    cellSS.font = defaultFont;

    // Other columns
    const cellsMap = [
      {
        key: 'achievementPersonalTotalPoint',
        value: item.achievementPersonalTotalPoint,
        range: `Q${row}:U${row}`,
      },
      {
        key: 'achievementAdditionalTotalPoint',
        value: item.achievementAdditionalTotalPoint,
        range: `V${row}:Z${row}`,
      },
      {
        key: 'summaryPoint',
        value: item.summaryPoint,
        range: `AA${row}:AE${row}`,
      },
      {
        key: 'summaryCharPoint',
        value: item.summaryCharPoint,
        range: `AF${row}:AJ${row}`,
      },
    ];

    cellsMap.forEach(({ key, value, range }) => {
      sheet.mergeCells(range);
      const cell = sheet.getCell(range.split(':')[0]);
      if (key === 'achievementPersonalTotalPoint') {
        const num = Number(value);
        if (!isNaN(num) && value !== '') {
          cell.value = num;
          cell.numFmt = '0.00';
        } else {
          cell.value = value;
        }
      } else if (key === 'summaryPoint') {
        const num = Number(value);
        if (!isNaN(num) && value !== '') {
          cell.value = num;
          cell.numFmt = '0.0';
        } else {
          cell.value = value;
        }
      } else {
        cell.value = value;
      }
      cell.border = borderAll;
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.font = defaultFont;
    });

    sheet.getRow(row).height = rowHeight;
    row += 1;
  });

  return row;
};

export const userInfoSummary = (sheet: any, data: any, startRow: number) => {
  // Ước lượng height theo pixel cho ＭＳ ゴシック
  const getAccurateRowHeight = (
    text: string,
    totalWidth: number,
    fontSize = 11, // Excel default
  ): number => {
    if (!text || typeof text !== 'string') return 15;

    // 1 đơn vị width Excel ~ 7px với ＭＳ ゴシック 11
    const pixelsPerCol = totalWidth * 7;
    const lineHeight = fontSize + 4; // px/dòng

    let totalLines = 0;
    for (const line of text.split('\n')) {
      const visualLength = line.replace(/[^\x00-\xff]/g, 'aa').length; // fullwidth = 2 ký tự
      const pixelsNeeded = visualLength * (fontSize * 0.6);
      const estLines = Math.ceil(pixelsNeeded / pixelsPerCol);
      totalLines += estLines || 1;
    }

    return Math.max(15, totalLines * lineHeight * 0.75); // px → Excel row height
  };

  // Label và value mapping
  const infoMaps = [
    ['社員番号', data?.employeeNumber?.trim()],
    ['氏名', data?.fullName?.trim()],
  ];

  const fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'E2EFDA' },
  };

  const border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  };

  // Đồng bộ font ＭＳ ゴシック toàn sheet
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber >= 5) {
      row.font = { name: 'ＭＳ ゴシック', size: 11 };
    }
  });

  // Khóa zoom 100% để nhìn giống nhau
  sheet.views = [{ state: 'normal', zoomScale: 100 }];

  let currentRow = startRow;
  for (let i = 0; i < infoMaps.length; i++) {
    const row = startRow + i;
    const [label, value] = infoMaps[i];

    // Merge label & value
    sheet.mergeCells(`B${row}:E${row}`);
    sheet.mergeCells(`F${row}:L${row}`);

    const labelCell = sheet.getCell(`B${row}`);
    const valueCell = sheet.getCell(`F${row}`);

    // Label style
    labelCell.value = label;
    labelCell.fill = fill;
    labelCell.border = border;
    labelCell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: true,
    };
    labelCell.font = { name: 'ＭＳ ゴシック', size: 11 };

    // Value style
    valueCell.value = value;
    valueCell.border = border;
    valueCell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: true,
    };
    valueCell.font = { name: 'ＭＳ ゴシック', size: 11 };

    // Tính tổng width cột F–L
    let totalWidth = 0;
    for (let col = 6; col <= 12; col++) {
      const colWidth = sheet.getColumn(col).width ?? 8.43;
      totalWidth += colWidth;
    }

    // Tính height
    const valueText =
      typeof value === 'string' ? value : value?.toString?.() ?? '';
    const rowHeight = getAccurateRowHeight(valueText, totalWidth, 11);
    sheet.getRow(row).height = rowHeight;

    currentRow++;
  }

  return currentRow;
};

type SummaryTotalPersonal = {
  periodTime: string;
  basicProTotalPointEvaluator: number | string;
  behaviorTotalPointEvaluator: number | string;
  achievementPersonalTotalPointEvaluator: number | string;
  achievementAdditionalTotalPointEvaluator: number | string;
  summaryPointEvaluator: number | string;
};

export const summaryPersonal = (sheet: any, data: any, startRow: number) => {
  const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };

  let total = 0;
  const results: SummaryTotalPersonal[] = [];
  const sortData = data.childs.sort((a, b) => {
    const dateA = new Date(a.periodStart);
    const dateB = new Date(b.periodStart);

    if (dateA < dateB) {
      return 1;
    }
    if (dateA > dateB) {
      return -1;
    }

    return 0;
  });

  sortData.map((evaluation) => {
    results.push({
      periodTime: `${evaluation.periodStart} ～ ${evaluation.periodEnd}`,
      basicProTotalPointEvaluator:
        evaluation.basicProTotalPointEvaluator2 !== null
          ? Math.round(evaluation.basicProTotalPointEvaluator2)
          : null,
      behaviorTotalPointEvaluator:
        evaluation.behaviorTotalPointEvaluator2 !== null
          ? Math.round(evaluation.behaviorTotalPointEvaluator2)
          : null,
      achievementPersonalTotalPointEvaluator:
        evaluation.achievementPersonalTotalPointEvaluator2 !== null
          ? Math.round(evaluation.achievementPersonalTotalPointEvaluator2)
          : null,
      achievementAdditionalTotalPointEvaluator:
        evaluation.achievementAdditionalTotalPointEvaluator2 !== null
          ? Math.round(evaluation.achievementAdditionalTotalPointEvaluator2)
          : null,
      summaryPointEvaluator:
        evaluation.summaryPointEvaluator2 !== null
          ? Math.round(evaluation.summaryPointEvaluator2)
          : null,
    });

    total +=
      evaluation.summaryPointEvaluator2 *
      (evaluation.percentPoint === null ? 1 : evaluation.percentPoint / 100);
  });

  results.push({
    periodTime: '評価結果',
    basicProTotalPointEvaluator: '',
    behaviorTotalPointEvaluator: '',
    achievementPersonalTotalPointEvaluator: '',
    achievementAdditionalTotalPointEvaluator: '',
    summaryPointEvaluator: total ? Math.round(total) : '',
  });

  let currentRow = startRow;

  const borderAll = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  const headerBgColor = 'FFE2EFDA'; // Màu header + cột title

  // ==== Header ====
  sheet.mergeCells(`N${currentRow}:Q${currentRow + 1}`);
  sheet.getCell(`N${currentRow}`).value = '';
  sheet.mergeCells(`R${currentRow}:U${currentRow + 1}`);
  sheet.getCell(`R${currentRow}`).value = 'スキル評価計';
  sheet.mergeCells(`V${currentRow}:Y${currentRow + 1}`);
  sheet.getCell(`V${currentRow}`).value = '行動・情意評価計';
  sheet.mergeCells(`Z${currentRow}:AC${currentRow + 1}`);
  sheet.getCell(`Z${currentRow}`).value = '成果評価計';
  sheet.mergeCells(`AD${currentRow}:AG${currentRow + 1}`);
  sheet.getCell(`AD${currentRow}`).value = '追加目標・成果';
  sheet.mergeCells(`AH${currentRow}:AJ${currentRow + 1}`);
  sheet.getCell(`AH${currentRow}`).value = '総計';

  // Apply format cho header
  for (let row = currentRow; row <= currentRow + 1; row++) {
    for (let col = 14; col <= 36; col++) {
      const cell = sheet.getCell(row, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: headerBgColor },
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.border = borderAll;
      cell.font = defaultFont;
    }
  }

  currentRow += 2;

  // ==== Data ====
  results.forEach((item) => {
    // Tách dòng trong periodTime
    const titleValue =
      item.periodTime?.includes('～') && !item.periodTime.includes('\n')
        ? item.periodTime.replace('～', '～\n')
        : item.periodTime;

    // Dòng merge
    const map = {
      N: { end: 'Q', value: titleValue },
      R: { end: 'U', value: item.basicProTotalPointEvaluator },
      V: { end: 'Y', value: item.behaviorTotalPointEvaluator },
      Z: { end: 'AC', value: item.achievementPersonalTotalPointEvaluator },
      AD: { end: 'AG', value: item.achievementAdditionalTotalPointEvaluator },
      AH: { end: 'AJ', value: item.summaryPointEvaluator },
    };

    Object.entries(map).forEach(([startCol, { end, value }]) => {
      sheet.mergeCells(`${startCol}${currentRow}:${end}${currentRow}`);
      const cell = sheet.getCell(`${startCol}${currentRow}`);
      cell.value = value ?? '';
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: startCol === 'N',
      };
      cell.border = borderAll;
      cell.font = defaultFont;
      if (startCol === 'N') {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: headerBgColor },
        };
        cell.font = defaultFont;
      }
    });

    // Tính height theo số dòng trong periodTime
    const lines = String(titleValue).split('\n').length;
    sheet.getRow(currentRow).height = 15 * lines;

    currentRow += 1;
  });

  return currentRow;
};

type SummaryTotalDepartment = {
  periodTime: string;
  summaryCharPointEvaluator: number | string;
  summaryPointEvaluator: number | string;
};

export const summaryDepartment = (sheet: any, data: any, startRow: number) => {
  const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };
  let total = 0;
  const results: SummaryTotalDepartment[] = [];
  const sortData = data.childs.sort((a, b) => {
    const dateA = new Date(a.periodStart);
    const dateB = new Date(b.periodStart);

    if (dateA < dateB) {
      return 1;
    }
    if (dateA > dateB) {
      return -1;
    }

    return 0;
  });

  sortData.map((evaluation) => {
    results.push({
      periodTime: `${evaluation.periodStart} ～ ${evaluation.periodEnd}`,
      summaryCharPointEvaluator:
        evaluation.summaryDepartment == null
          ? null
          : evaluation.summaryDepartment?.summaryCharPointEvaluator2,
      summaryPointEvaluator:
        evaluation.summaryDepartment == null
          ? null
          : evaluation.summaryDepartment?.summaryPointEvaluator2,
    });

    total +=
      evaluation.summaryDepartment?.summaryPointEvaluator2 *
      (evaluation.percentPoint === null ? 1 : evaluation.percentPoint / 100);
  });

  results.push({
    periodTime: '評価結果',
    summaryCharPointEvaluator: '',
    summaryPointEvaluator: total
      ? Number((Math.round(Number(total) * 10) / 10).toFixed(1))
      : '',
  });

  let currentRow = startRow;

  const borderAll = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  const headerBgColor = 'FFE2EFDA'; // Màu header + cột title

  // ==== Header ====
  sheet.mergeCells(`N${currentRow}:U${currentRow + 1}`);
  sheet.getCell(`N${currentRow}`).value = '';
  sheet.mergeCells(`V${currentRow}:AC${currentRow + 1}`);
  sheet.getCell(`V${currentRow}`).value = '部門評価計';
  sheet.mergeCells(`AD${currentRow}:AJ${currentRow + 1}`);
  sheet.getCell(`AD${currentRow}`).value = '個人評価';

  // Apply format cho header
  for (let row = currentRow; row <= currentRow + 1; row++) {
    for (let col = 14; col <= 36; col++) {
      const cell = sheet.getCell(row, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: headerBgColor },
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.border = borderAll;
      cell.font = defaultFont;
    }
  }

  currentRow += 2;

  // ==== Data ====
  results.forEach((item) => {
    // Tách dòng trong periodTime
    const titleValue = item.periodTime;

    // Dòng merge
    const map = {
      N: { end: 'U', value: titleValue },
      V: { end: 'AC', value: item.summaryPointEvaluator },
      AD: { end: 'AJ', value: item.summaryCharPointEvaluator },
    };

    Object.entries(map).forEach(([startCol, { end, value }]) => {
      sheet.mergeCells(`${startCol}${currentRow}:${end}${currentRow}`);
      const cell = sheet.getCell(`${startCol}${currentRow}`);
      cell.value = value ?? '';
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: startCol === 'N',
      };
      cell.font = defaultFont;
      cell.border = borderAll;
      if (startCol === 'N') {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: headerBgColor },
        };
      }
      if (startCol === 'V') {
        cell.numFmt = '0.0'; // Format số có 1 chữ số thập phân
      }
    });

    // Tính height theo số dòng trong periodTime
    const lines = String(titleValue).split('\n').length;
    sheet.getRow(currentRow).height = 15 * lines;

    currentRow += 1;
  });

  return currentRow;
};

export const setThickBorder = (
  sheet,
  startRow,
  endRow,
  startColLetter,
  endColLetter,
) => {
  const colLetterToNumber = (letter) => {
    let colNum = 0;
    for (let i = 0; i < letter.length; i++) {
      colNum = colNum * 26 + (letter.charCodeAt(i) - 64); // A=1
    }
    return colNum;
  };

  const startCol = colLetterToNumber(startColLetter);
  const endCol = colLetterToNumber(endColLetter);

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const cell = sheet.getCell(row, col);

      let border = cell.border || {};

      if (row === startRow) {
        border.top = { style: 'thick', color: { argb: '000000' } };
      }
      if (row === endRow) {
        border.bottom = { style: 'thick', color: { argb: '000000' } };
      }
      if (col === startCol) {
        border.left = { style: 'thick', color: { argb: '000000' } };
      }
      if (col === endCol) {
        border.right = { style: 'thick', color: { argb: '000000' } };
      }

      cell.border = border;
    }
  }
};
