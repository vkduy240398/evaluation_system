import { FC, useEffect, useState } from 'react';
import SearchFeedbackForm from './SearchFeedbackForm';
import FeedbackHistoryTable from './FeedbackHistoryTable';
import { Space, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Feedback, FeedbackCondition, FeedbackSearchForm } from '../../../model/Feedback';
import feedbackApiService from '../../../common/api/feedback';
import { useTranslation } from 'react-i18next';
import { Workbook } from 'exceljs';
import moment from 'moment';

const defaultCondition: FeedbackCondition = {
  type: null,
  status: null,
  phase: null,
  feature: [],
  limit: 20,
  current: 1,
  offset: 0,
  search: false,
  dates: [new Date(), new Date()],
  keywork: '',
};

interface Props {
  role: 'user' | 'admin' | 'systemAdmin';
}

const FeedbackHistory: FC<Props> = (props: Props) => {
  const { role } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [count, setCount] = useState(0);
  const [condition, setCondition] = useState<FeedbackCondition>(defaultCondition);
  const { t } = useTranslation();

  const handleSearch = async (values: FeedbackSearchForm) => {
    setIsFetching(true);
    const newCondition: FeedbackCondition = {
      ...condition,
      ...values,
      dates: values.dates?.map((d) => d.toDate()) as [Date, Date],
      search: true,
      key: location?.state?.key,
    };
    navigate(location.pathname, { state: newCondition, replace: true });

    const callBack = (data: Feedback[], count: number) => {
      setFeedbacks(data);
      setCount(count);
      setCondition(newCondition);
      setIsFetching(false);
    };

    return feedbackApiService.listUserFeedback({ ...newCondition, role }, callBack, () => setIsFetching(false));
  };

  const handleExport = async () => {
    setIsFetching(true);
    await feedbackApiService.getFeedbacksForExcel(
      { ...condition, role: props.role },
      async (data) => {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet();
        worksheet.columns = [
          { header: t('IDS_NO').toString(), key: 'code' },
          { header: t('IDS_ROLE').toString(), key: 'role' },
          { header: t('IDS_TYPE_FEEDBACK').toString(), key: 'type' },
          { header: t('IDS_PHASE').toString(), key: 'phase' },
          { header: t('IDS_TARGET_SCREEN').toString(), key: 'feature' },
          { header: t('IDS_ISSUE_OVERVIEW').toString(), key: 'summary' },
          { header: t('IDS_FEEDBACK_DETAIL').toString(), key: 'detail' },
          { header: t('IDS_IMPACT_SCOPE').toString(), key: 'impactScope' },
          { header: t('IDS_STATUS').toString(), key: 'status' },
          { header: t('IDS_RELATED_FEEDBACKS').toString(), key: 'relatedFeedbacks' },
          { header: t('IDS_TIME_CREATED').toString(), key: 'createdTime' },
        ];
        for (let i = 1; i <= worksheet.columnCount; i++) {
          worksheet.getCell(1, i).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF00B050' },
          };
        }
        worksheet.getRow(1).font = {
          bold: true,
        };
        worksheet.getCell('A1').border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        worksheet.columns[0].width = 10;
        worksheet.columns[1].width = 20;
        worksheet.columns[2].width = 10;
        worksheet.columns[3].width = 10;
        worksheet.columns[4].width = 30;
        worksheet.columns[5].width = 30;
        worksheet.columns[6].width = 50;
        worksheet.columns[7].width = 15;
        worksheet.columns[8].width = 15;
        worksheet.columns[9].width = 20;
        worksheet.columns[10].width = 20;

        const createOuterBorder = (
          worksheet: any,
          start = { row: 1, col: 1 },
          end = { row: 1, col: 1 },
          borderWidth = 'thin',
        ) => {
          const borderStyle = {
            style: borderWidth,
          };
          for (let i = start.row; i <= end.row; i++) {
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
        data.forEach((item: Feedback) => {
          worksheet.addRow([
            item.id,
            item.role?.map((r) => (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[r]).join('、'),
            (t('IDS_TYPE_FEEDBACK_OPTIONS', { returnObjects: true }) as any)[item.type],
            (t('IDS_PHASE_FEEDBACK_OPTIONS', { returnObjects: true }) as any)[item.phase],
            item.feature &&
              item.feature
                .map(
                  (v: string) =>
                    `${t(v.split('-')[v.split('-').length - 1])}${
                      v.split('-').length > 1 ? `（${t(v.split('-')[0])}）` : ''
                    }`,
                )
                .join('、'),
            item.summary,
            item.detail,
            item.impactScope && (t('IDS_IMPACT_SCOPE_OPTIONS', { returnObjects: true }) as any)[item.impactScope],
            (t('IDS_STATUS_FEEDBACK_OPTIONS', { returnObjects: true }) as any)[item.status],
            item.relatedFeedbacks?.join('、'),
            moment(item.createdTime).format('YYYY/M/D H:mm'),
          ]);
        });
        worksheet.getRow(1).alignment = {
          wrapText: true,
          horizontal: 'center',
          vertical: 'middle',
        };
        for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
          worksheet.getRow(rowIndex).alignment = {
            wrapText: true,
            vertical: 'middle',
          };
        }
        worksheet.getColumn(11).alignment = {
          wrapText: true,
          horizontal: 'center',
          vertical: 'middle',
        };
        createOuterBorder(worksheet, { row: 1, col: 1 }, { row: worksheet.rowCount, col: worksheet.columnCount });

        if (props.role === 'admin') {
          worksheet.spliceColumns(10, 1); // Delete column related feedbacks
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${t('IDS_FEEDBACK_LIST')}_${moment(new Date()).format('YYYYMMDDHHmmss')}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsFetching(false);
      },
      () => {
        setIsFetching(false);
      },
    );
  };

  useEffect(() => {
    if (location?.state?.search) {
      handleSearch({ ...location.state, dates: location.state.dates.map((d: any) => dayjs(d)) });
    }
  }, []);

  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      {role !== 'user' && (
        <Space align="baseline">
          <Typography.Title level={3}>{t('IDS_FEEDBACK_LIST')}</Typography.Title>
        </Space>
      )}

      <SearchFeedbackForm
        isFetching={isFetching}
        handleSearch={handleSearch}
        condition={condition}
        isLoading={isFetching}
        role={role}
        search={condition.search}
        onExport={handleExport}
        resultCount={count}
      />
      {condition.search && (
        <>
          <FeedbackHistoryTable
            isFetching={isFetching}
            setIsFetching={setIsFetching}
            feedbacks={feedbacks}
            setFeedbacks={setFeedbacks}
            count={count}
            setCount={setCount}
            condition={condition}
            handleSearch={handleSearch}
            setCondition={setCondition}
            role={role}
          />
        </>
      )}
    </Space>
  );
};

export default FeedbackHistory;
