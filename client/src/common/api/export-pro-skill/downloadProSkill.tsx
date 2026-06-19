import XLSX from 'xlsx-js-style';

const handleDownLoad = async (year: any, periodName: any, role: any, datas: any, errorCallback: any) => {
  const borderStyle = {
    top: {
      style: 'thin',
    },
    bottom: {
      style: 'thin',
    },
    left: {
      style: 'thin',
    },
    right: {
      style: 'thin',
    },
  };

  const fillStyle = (index: number) => {
    if (index === 1) {
      return {
        fgColor: { rgb: '87E7AC' },
      };
    } else {
      return null;
    }
  };

  let filename = '';
  if (role == 'f3' || role == 'f4') filename = `【${year}年${periodName}】専門スキル.xlsx`;
  if (role == 'f6') filename = `【${year}年${periodName}】専門スキル.xlsx`;

  if (role == 'f3' || role == 'f4') {
    const worksheet = XLSX.utils.json_to_sheet(datas);
    worksheet['!cols'] = [
      { wpx: 150 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 400 },
      { wpx: 60 },
      { wpx: 400 },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [['部署', '職種', '大・中分類', '小分類', '評価内容', '難易度', '備考']], {
      origin: 'A1',
    });

    // format header
    const fill = fillStyle(1);
    const styleHeader = {
      border: borderStyle,
      fill,
      alignment: { wrapText: true, horizontal: 'center' },
    };

    worksheet[`A1`].s = styleHeader;
    worksheet[`B1`].s = styleHeader;
    worksheet[`C1`].s = styleHeader;
    worksheet[`D1`].s = styleHeader;
    worksheet[`E1`].s = styleHeader;
    worksheet[`F1`].s = styleHeader;
    worksheet[`G1`].s = styleHeader;

    // format data
    for (let index = 2; index <= datas.length + 1; index++) {
      const styleData = {
        border: borderStyle,
        alignment: { wrapText: true, vertical: 'center' },
      };
      const styleDataDifficult = {
        border: borderStyle,
        alignment: { wrapText: true, horizontal: 'center', vertical: 'center' },
      };

      worksheet[`A${index}`].s = styleData;
      worksheet[`B${index}`].s = styleData;
      worksheet[`C${index}`].s = styleData;
      worksheet[`D${index}`].s = styleData;
      worksheet[`E${index}`].s = styleData;
      worksheet[`F${index}`].s = styleDataDifficult;
      worksheet[`G${index}`].s = styleData;
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');
    XLSX.writeFile(workbook, filename);
    errorCallback(false);
  } else if (role == 'f6') {
    const worksheet = XLSX.utils.json_to_sheet(datas);
    worksheet['!cols'] = [
      { wpx: 200 },
      { wpx: 200 },
      { wpx: 200 },
      { wpx: 200 },
      { wpx: 200 },
      { wpx: 200 },
      { wpx: 100 },
      { wpx: 400 },
    ];
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [['テンプレート ', '部署', '職種', '大・中分類', '小分類', '評価内容', '難易度', '備考']],
      {
        origin: 'A1',
      },
    );

    // format header
    const fill = fillStyle(1);
    const styleHeader = {
      border: borderStyle,
      fill,
      alignment: { wrapText: true, horizontal: 'center' },
    };

    worksheet[`A1`].s = styleHeader;
    worksheet[`B1`].s = styleHeader;
    worksheet[`C1`].s = styleHeader;
    worksheet[`D1`].s = styleHeader;
    worksheet[`E1`].s = styleHeader;
    worksheet[`F1`].s = styleHeader;
    worksheet[`G1`].s = styleHeader;
    worksheet[`H1`].s = styleHeader;

    // format data
    for (let index = 2; index <= datas.length + 1; index++) {
      const styleData = {
        border: borderStyle,
        alignment: { wrapText: true, vertical: 'center' },
      };
      const styleDataDifficult = {
        border: borderStyle,
        alignment: { wrapText: true, horizontal: 'center', vertical: 'center' },
      };

      worksheet[`A${index}`].s = styleData;
      worksheet[`B${index}`].s = styleData;
      worksheet[`C${index}`].s = styleData;
      worksheet[`D${index}`].s = styleData;
      worksheet[`E${index}`].s = styleData;
      worksheet[`F${index}`].s = styleData;
      worksheet[`G${index}`].s = styleDataDifficult;
      worksheet[`H${index}`].s = styleData;
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');
    XLSX.writeFile(workbook, filename);
    errorCallback(false);
  }
};
const DownloadProSkill = {
  handleDownLoad,
};
export default DownloadProSkill;
