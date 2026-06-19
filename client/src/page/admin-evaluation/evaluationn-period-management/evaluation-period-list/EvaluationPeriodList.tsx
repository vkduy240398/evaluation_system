import React, { useEffect, useMemo, useState } from 'react';
import { Form, Table, Typography, Grid, message, Card, Space, Modal, Button, Tag, Badge, Progress, Alert } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { t } from 'i18next';
import moment from 'moment-timezone';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import AdminEvaluationApiService from '../../../../common/api/adminEvaluation';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import { EvaluationPeriodHelper } from '../../../../common/utils/datetime/EvaluationPeriodHelper';
import { urlCompanyCode } from '../../../../common/util';
import { useAuth } from '../../../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { ListPeriods } from '../../../../page/admin/review-management/interfaces/InterfacesProps';
import functionsPeriods from '../../../../common/api/adminPeriod';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ColumnEvaluationPeriodList from '../../../../views/admin-evaluation/evaluationn-period-management/evaluation-period-list/ColumnEvaluationPeriodList';
import SearchPeriodComponent from '../../../../views/admin-evaluation/evaluationn-period-management/evaluation-period-list/SearchPeriodComponent';
dayjs.extend(utc);
dayjs.extend(timezone);
interface SearchQuery {
  yearStart?: string;
  yearEnd?: string;
}

interface DeptSchedule {
  key: string;
  departmentName: string;
  goalStart: string;
  goalEnd: string;
  evalStart: string;
  evalEnd: string;
  isCustom: boolean;
  goalCompleted: number;
  evalCompleted: number;
  totalEmployees: number;
}

const MOCK_DEPT_SCHEDULES: DeptSchedule[] = [
  {
    key: '1',
    departmentName: '営業第一部',
    goalStart: '2026/04/01',
    goalEnd: '2026/05/31',
    evalStart: '2026/09/01',
    evalEnd: '2026/10/31',
    isCustom: false,
    goalCompleted: 12,
    evalCompleted: 0,
    totalEmployees: 15,
  },
  {
    key: '2',
    departmentName: 'グローバル情報システム部',
    goalStart: '2026/05/01',
    goalEnd: '2026/07/15',
    evalStart: '2026/10/01',
    evalEnd: '2026/11/30',
    isCustom: true,
    goalCompleted: 8,
    evalCompleted: 0,
    totalEmployees: 20,
  },
  {
    key: '3',
    departmentName: '経営企画部',
    goalStart: '2026/04/01',
    goalEnd: '2026/05/31',
    evalStart: '2026/09/01',
    evalEnd: '2026/10/31',
    isCustom: false,
    goalCompleted: 5,
    evalCompleted: 0,
    totalEmployees: 5,
  },
  {
    key: '4',
    departmentName: '人事部',
    goalStart: '2026/06/01',
    goalEnd: '2026/07/31',
    evalStart: '2026/10/01',
    evalEnd: '2026/11/30',
    isCustom: true,
    goalCompleted: 3,
    evalCompleted: 0,
    totalEmployees: 10,
  },
  {
    key: '5',
    departmentName: '財務部',
    goalStart: '2026/04/01',
    goalEnd: '2026/05/31',
    evalStart: '2026/09/01',
    evalEnd: '2026/10/31',
    isCustom: false,
    goalCompleted: 7,
    evalCompleted: 0,
    totalEmployees: 8,
  },
  {
    key: '6',
    departmentName: '開発部',
    goalStart: '2026/05/15',
    goalEnd: '2026/06/30',
    evalStart: '2026/09/15',
    evalEnd: '2026/10/31',
    isCustom: true,
    goalCompleted: 15,
    evalCompleted: 0,
    totalEmployees: 18,
  },
];

const EvaluationPeriodList = () => {
  const { i18n } = useTranslation();
  const [dataSources, setDataSource] = useState<ListPeriods[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [_form] = Form.useForm();
  const navigate = useNavigate();
  const year = new Date();
  const state = useLocation().state;
  const breaks = Grid.useBreakpoint();
  const [types, setType] = useState({
    type: '',
    title: '',
    content: '',
    textButton: '',
    open: false,
    checkFixed: undefined,
    periodId: undefined,
  });
  const [deptModal, setDeptModal] = useState<{
    open: boolean;
    scheduleType: 'goal' | 'evaluation';
    periodItem: any;
  }>({ open: false, scheduleType: 'goal', periodItem: null });
  const auth = useAuth();
  const dateFormat = i18n.language === 'ja' ? 'YYYY/M/D' : i18n.language === 'en' ? 'YYYY/D/M' : 'D/M/YYYY';
  const timeZone = auth.user?.timeZone || 'Asia/Tokyo';
  const nows = dayjs.tz(dayjs(), timeZone);
  const defaultYear = dayjs().set('year', nows.year());
  const endYear = nows.add(5, 'year');
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = useMemo(() => Object.fromEntries([...searchParams]) as SearchQuery, [searchParams]);
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return defaultYear > current || current > endYear;
  };
  const currentYear = dayjs(moment(defaultYear.format('YYYY'), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY');
  const callBack = (data: ListPeriods[]) => {
    const newsArrays: any[] = data.map((v) => {
      const departmentGoals = v.departmentGoals ? v.departmentGoals.split(' ～ ') : null;
      const goals = v.goals ? v.goals.split(' ～ ') : null;
      const personalEvaluations = v.personalEvaluation ? v.personalEvaluation.split(' ～ ') : null;
      const divisionEvaluates = v.divisionEvaluate ? v.divisionEvaluate.split(' ～ ') : null;

      return {
        ...v,
        key: v.id,
        year: v.year,
        periodIndex: v.periodIndex,
        evaluationPeriod: v.evaluationPeriod,
        departmentGoals: departmentGoals
          ? `${dayjs(departmentGoals[0], 'YYYY/M/D').format(dateFormat)} ～ ${dayjs(
              departmentGoals[1],
              'YYYY/M/D',
            ).format(dateFormat)}`
          : null,
        goals: goals
          ? `${dayjs(goals[0], 'YYYY/M/D').format(dateFormat)} ～ ${dayjs(goals[1], 'YYYY/M/D').format(dateFormat)}`
          : null,
        checkFixed: v.checkFixed,
        personalEvaluation: personalEvaluations
          ? `${dayjs(personalEvaluations[0], 'YYYY/M/D').format(dateFormat)} ～ ${dayjs(
              personalEvaluations[1],
              'YYYY/M/D',
            ).format(dateFormat)}`
          : null,
        divisionEvaluate: divisionEvaluates
          ? `${dayjs(divisionEvaluates[0], 'YYYY/M/D').format(dateFormat)} ～ ${dayjs(
              divisionEvaluates[1],
              'YYYY/M/D',
            ).format(dateFormat)}`
          : null,
        goalDeptRange: v.goalDeptRange
          ? {
              start: v.goalDeptRange.start ? dayjs(v.goalDeptRange.start, 'YYYY/M/D').format(dateFormat) : null,
              end: v.goalDeptRange.end ? dayjs(v.goalDeptRange.end, 'YYYY/M/D').format(dateFormat) : null,
            }
          : null,
        evalDeptRange: v.evalDeptRange
          ? {
              start: v.evalDeptRange.start ? dayjs(v.evalDeptRange.start, 'YYYY/M/D').format(dateFormat) : null,
              end: v.evalDeptRange.end ? dayjs(v.evalDeptRange.end, 'YYYY/M/D').format(dateFormat) : null,
            }
          : null,
      };
    });

    setDataSource(newsArrays);
  };
  const errorsCallback = (bool: boolean) => {
    setLoading(bool);
  };

  useEffect(() => {
    const yearStart = searchQuery.yearStart
      ? searchQuery.yearStart
      : EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo');
    const yearEnd = searchQuery.yearEnd
      ? searchQuery.yearEnd
      : EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo');
    _form.setFieldsValue({
      year: [
        dayjs(moment(yearStart || year.getFullYear(), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
        dayjs(moment(yearEnd || year.getFullYear(), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
      ],
    });
    handleSearch();
    if (Object.keys(searchQuery).length > 0) handleSearch();
  }, []);

  const handleDeptConfirmRow = (record: DeptSchedule, scheduleType: 'goal' | 'evaluation') => {
    message.success(`${record.departmentName} の${scheduleType === 'goal' ? '目標' : '評価'}を確定しました（デモ）`);
  };

  const buildDeptScheduleContent = (scheduleType: 'goal' | 'evaluation', periodItem: any) => {
    const today = dayjs();

    const columns = [
      {
        title: '部署',
        dataIndex: 'departmentName',
        key: 'dept',
        width: 185,
        render: (name: string, record: DeptSchedule) => (
          <Space direction="vertical" size={2}>
            <Typography.Text style={{ fontSize: 12, fontWeight: 500 }}>{name}</Typography.Text>
            {record.isCustom && (
              <Badge
                count="個別設定"
                style={{ backgroundColor: '#fa8c16', fontSize: 10, padding: '0 4px', height: 16, lineHeight: '16px' }}
              />
            )}
          </Space>
        ),
      },
      {
        title: scheduleType === 'goal' ? '目標設定期間' : '評価実施期間',
        key: 'period',
        width: 165,
        render: (_: any, record: DeptSchedule) => {
          const start = scheduleType === 'goal' ? record.goalStart : record.evalStart;
          const end = scheduleType === 'goal' ? record.goalEnd : record.evalEnd;
          const active = today.isBefore(dayjs(end, 'YYYY/MM/DD'));
          return (
            <Space direction="vertical" size={3}>
              <Typography.Text style={{ fontSize: 12 }}>
                {start} ～ {end}
              </Typography.Text>
              {active ? (
                <Tag icon={<ClockCircleOutlined />} color="warning" style={{ fontSize: 10, margin: 0 }}>
                  期間中
                </Tag>
              ) : (
                <Tag icon={<CheckCircleOutlined />} color="success" style={{ fontSize: 10, margin: 0 }}>
                  期間終了
                </Tag>
              )}
            </Space>
          );
        },
      },
      {
        title: scheduleType === 'goal' ? '目標完了状況' : '評価完了状況',
        key: 'progress',
        width: 140,
        render: (_: any, record: DeptSchedule) => {
          const done = scheduleType === 'goal' ? record.goalCompleted : record.evalCompleted;
          const total = record.totalEmployees;
          const percent = total > 0 ? Math.round((done / total) * 100) : 0;
          return (
            <Space direction="vertical" size={2} style={{ width: '100%' }}>
              <Typography.Text style={{ fontSize: 12 }}>
                <Typography.Text strong style={{ fontSize: 12 }}>
                  {done}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  /{total}名
                </Typography.Text>
              </Typography.Text>
              <Progress
                percent={percent}
                size="small"
                strokeColor={percent === 100 ? '#52c41a' : '#1677ff'}
                style={{ margin: 0 }}
              />
            </Space>
          );
        },
      },
      {
        title: 'アクション',
        key: 'action',
        align: 'center' as const,
        width: 75,
        render: (_: any, record: DeptSchedule) => {
          const done = scheduleType === 'goal' ? record.goalCompleted : record.evalCompleted;
          const allOk = done === record.totalEmployees;
          return (
            <Button
              type="primary"
              size="small"
              disabled={allOk}
              onClick={(e) => {
                e.stopPropagation();
                handleDeptConfirmRow(record, scheduleType);
              }}
              style={{ fontSize: 11 }}
            >
              {allOk ? '確定済' : '確定'}
            </Button>
          );
        },
      },
    ];

    const activeCount = MOCK_DEPT_SCHEDULES.filter((d) => {
      const end = scheduleType === 'goal' ? d.goalEnd : d.evalEnd;
      return today.isBefore(dayjs(end, 'YYYY/MM/DD'));
    }).length;

    const companyPeriod =
      scheduleType === 'goal'
        ? `${periodItem?.departmentGoals || '—'} / ${periodItem?.goals || '—'}`
        : `${periodItem?.divisionEvaluate || '—'} / ${periodItem?.personalEvaluation || '—'}`;

    return (
      <Space direction="vertical" style={{ width: '100%' }} size={10}>
        <div style={{ padding: '5px 10px', background: '#f0f5ff', borderRadius: 4, border: '1px solid #adc6ff' }}>
          <Typography.Text style={{ fontSize: 11 }}>
            <Typography.Text strong style={{ fontSize: 11 }}>
              全社共通期間:{' '}
            </Typography.Text>
            {companyPeriod}
          </Typography.Text>
        </div>

        <Table
          dataSource={MOCK_DEPT_SCHEDULES}
          columns={columns}
          size="small"
          pagination={false}
          bordered
          rowClassName={(record: DeptSchedule) => {
            const end = scheduleType === 'goal' ? record.goalEnd : record.evalEnd;
            return today.isBefore(dayjs(end, 'YYYY/MM/DD')) ? 'dept-active-row' : '';
          }}
        />

        {activeCount > 0 && (
          <Alert
            type="warning"
            showIcon
            icon={<ExclamationCircleOutlined />}
            style={{ padding: '6px 12px' }}
            message={
              <Typography.Text style={{ fontSize: 12 }}>
                <Typography.Text strong style={{ fontSize: 12 }}>
                  {activeCount}件の部署
                </Typography.Text>
                でまだ実施期間が終了していません。各行の「確定」で部署ごとに確定できます。
              </Typography.Text>
            }
          />
        )}
      </Space>
    );
  };

  const handleProceedToConfirm = () => {
    const { scheduleType, periodItem } = deptModal;
    setDeptModal((prev) => ({ ...prev, open: false }));
    setType({
      type: scheduleType === 'goal' ? 'fixedGoal' : 'fixedEvaluation',
      title: t('POPUP_DIALOG.TITLE.CONFIRM'),
      content:
        scheduleType === 'goal'
          ? t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_FIXED_GOAL')
          : t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_FIXED_EVALUATION'),
      textButton: t('POPUP_DIALOG.BUTTON.IDM_CONFIRM_FIXED_EVALUATION'),
      open: true,
      periodId: periodItem.id,
      checkFixed: periodItem.checkFixed,
    });
  };

  const fixedGoal = (item: any) => {
    setDeptModal({ open: true, scheduleType: 'goal', periodItem: item });
  };
  const fixedEvaluation = (item: any) => {
    setDeptModal({ open: true, scheduleType: 'evaluation', periodItem: item });
  };
  const fixedEvaluationPublic = (item: any) => {
    setType({
      type: 'fixedEvaluationPublic',
      title: t('POPUP_DIALOG.TITLE.IDM_CONFIRM_FIXED_EVALUATION_PUBLIC'),
      content: t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_FIXED_EVALUATION_PUBLIC'),
      textButton: t('POPUP_DIALOG.BUTTON.IDM_CONFIRM_FIXED_EVALUATION_PUBLIC'),
      open: true,
      periodId: item.id,
      checkFixed: item.checkFixed,
    });
  };
  const undoFixGoal = (item: any) => {
    setType({
      type: 'undoFixGoal',
      title: t('確認'),
      content: t(t('MESSAGE.COMMON.IDM_CONFIRM_UNDO_FIX_GOAL')),
      textButton: t('IDS_UNDO'),
      open: true,
      periodId: item.id,
      checkFixed: item.checkFixed,
    });
  };
  const undoFixEvaluation = (item: any) => {
    setType({
      type: 'undoFixEvaluation',
      title: t('確認'),
      content: t('MESSAGE.COMMON.IDM_CONFIRM_UNDO_FIX_EVALUATION'),
      textButton: t('IDS_UNDO'),
      open: true,
      periodId: item.id,
      checkFixed: item.checkFixed,
    });
  };
  const confirmPopup = async () => {
    setLoading(true);
    if (types.type === 'fixedGoal') {
      goalConfirm();
    } else if (types.type === 'fixedEvaluation') {
      evaluationConfirm();
    } else if (types.type === 'fixedEvaluationPublic') publicEvaluation();
    else if (types.type === 'undoFixGoal') undoFixGoalConfirm();
    else if (types.type === 'undoFixEvaluation') undoFixEvaluationConfirm();

    closePopup();
  };
  const closePopup = () => {
    setType({
      ...types,
      open: false,
    });
  };
  const errorCallback = (error: any) => {};

  const goalConfirm = () => {
    const callback = (_res: any) => {
      const years = _form.getFieldValue('year');
      const yearStart = years ? dayjs(years[0], 'YYYY').format('YYYY') : currentYear.format('YYYY');
      const yearEnd = years ? dayjs(years[1], 'YYYY').format('YYYY') : currentYear.format('YYYY');
      functionsPeriods.listPeriodByYear(
        `/api/v1/f5/management-evaluation-history/list-periods`,
        {
          yearStart,
          yearEnd,
        },
        callBack,
        errorsCallback,
      );
      message.success(t('MESSAGE.COMMON.IDM_FIX_GOAL_SUCCESS'));
    };
    AdminEvaluationApiService.goalConfirm(
      { periodId: types.periodId, checkFixed: types.checkFixed },
      { callback, errorCallback },
    );
  };
  const evaluationConfirm = () => {
    const callback = (_res: any) => {
      const years = _form.getFieldValue('year');
      const yearStart = years ? dayjs(years[0], 'YYYY').format('YYYY') : currentYear.format('YYYY');
      const yearEnd = years ? dayjs(years[1], 'YYYY').format('YYYY') : currentYear.format('YYYY');
      functionsPeriods.listPeriodByYear(
        `/api/v1/f5/management-evaluation-history/list-periods`,
        {
          yearStart,
          yearEnd,
        },
        callBack,
        errorsCallback,
      );
      message.success(t('MESSAGE.COMMON.IDM_FIX_EVALUATION_SUCCESS'));
    };
    AdminEvaluationApiService.evaluationConfirm(
      { periodId: types.periodId, checkFixed: types.checkFixed },
      { callback, errorCallback },
    );
  };

  const publicEvaluation = () => {
    const callback = (_res: any) => {
      const years = _form.getFieldValue('year');
      const yearStart = years ? dayjs(years[0], 'YYYY').format('YYYY') : currentYear.format('YYYY');
      const yearEnd = years ? dayjs(years[1], 'YYYY').format('YYYY') : currentYear.format('YYYY');
      functionsPeriods.listPeriodByYear(
        `/api/v1/f5/management-evaluation-history/list-periods`,
        {
          yearStart,
          yearEnd,
        },
        callBack,
        errorsCallback,
      );
      message.success(t('MESSAGE.COMMON.IDM_PUBLIC_EVALUATION_SUCCESS'));
    };
    AdminEvaluationApiService.publicEvaluation({ periodId: types.periodId }, { callback, errorCallback });
  };
  const undoFixGoalConfirm = () => {
    const callback = (_res: any) => {
      const years = _form.getFieldValue('year');
      const yearStart = years ? dayjs(years[0], 'YYYY').format('YYYY') : currentYear.format('YYYY');
      const yearEnd = years ? dayjs(years[1], 'YYYY').format('YYYY') : currentYear.format('YYYY');
      if (_res.statusCode === 200) {
        console.log(222);

        message.info(t('MESSAGE.COMMON.IDM_NO_DATA_UNDO'));
        setLoading(false);
      } else {
        functionsPeriods.listPeriodByYear(
          `/api/v1/f5/management-evaluation-history/list-periods`,
          {
            yearStart,
            yearEnd,
          },
          callBack,
          errorsCallback,
        );
        message.success(t('MESSAGE.COMMON.IDM_UNDO_SUCCESS'));
      }
    };
    AdminEvaluationApiService.undoFixGoal({ periodId: types.periodId, type: 1 }, { callback, errorCallback });
  };
  const undoFixEvaluationConfirm = () => {
    const callback = (_res: any) => {
      const years = _form.getFieldValue('year');
      const yearStart = years ? dayjs(years[0], 'YYYY').format('YYYY') : currentYear.format('YYYY');
      const yearEnd = years ? dayjs(years[1], 'YYYY').format('YYYY') : currentYear.format('YYYY');
      if (_res.statusCode === 200) {
        message.info(t('MESSAGE.COMMON.IDM_NO_DATA_UNDO'));
        setLoading(false);
      } else {
        functionsPeriods.listPeriodByYear(
          `/api/v1/f5/management-evaluation-history/list-periods`,
          {
            yearStart,
            yearEnd,
          },
          callBack,
          errorsCallback,
        );
        message.success(t('MESSAGE.COMMON.IDM_UNDO_SUCCESS'));
      }
    };
    AdminEvaluationApiService.undoFixGoal({ periodId: types.periodId, type: 2 }, { callback, errorCallback });
  };

  const handleSearch = async () => {
    const years = _form.getFieldValue('year');
    const yearStart = years ? dayjs(years[0], 'YYYY').format('YYYY') : currentYear.format('YYYY');
    const yearEnd = years ? dayjs(years[1], 'YYYY').format('YYYY') : currentYear.format('YYYY');
    if (yearStart && yearEnd)
      await fetchEvaluationPeriodList({
        yearStart,
        yearEnd,
      });
  };
  const fetchEvaluationPeriodList = async ({ yearStart, yearEnd }: { yearStart: string; yearEnd: string }) => {
    await functionsPeriods.listPeriodByYear(
      `/api/v1/f5/management-evaluation-history/list-periods`,
      {
        yearStart,
        yearEnd,
      },
      callBack,
      errorsCallback,
    );
    setSearchParams({ ...searchQuery, yearStart: yearStart, yearEnd: yearEnd }, { replace: true });
  };

  return (
    <div>
      <Typography.Title level={3}>{(t('IDL_LIST_MENU_F5', { returnObjects: true }) as any)[2]}</Typography.Title>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        <Card>
          <SearchPeriodComponent
            currentYear={currentYear}
            form={_form}
            handleSearch={handleSearch}
            isLoading={isLoading}
            yearStart={2025}
            t={t}
          />
        </Card>

        <Card>
          <Table
            bordered
            size="small"
            locale={{
              emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
            }}
            columns={ColumnEvaluationPeriodList({
              fixedEvaluation: fixedEvaluation,
              fixedEvaluationPublic: fixedEvaluationPublic,
              fixedGoal: fixedGoal,
              undoFixEvaluation: undoFixEvaluation,
              undoFixGoal: undoFixGoal,
            })}
            dataSource={dataSources}
            pagination={{
              position: ['bottomLeft'],
              pageSize: 20,
              total: dataSources.length,
              showTotal: (total, range) =>
                `${total}${t('IDS_CASE_LABEL')} ${range[0]}-${range[1]}${t('IDS_ITEM_LABEL')}`,
              size: 'default',
              showSizeChanger: false,
              style: {
                marginBottom: 0,
              },
            }}
            className={'ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer'}
            onRow={(record) => {
              return {
                onClick: (_e) => {
                  navigate(
                    urlCompanyCode() + `/${window.location.pathname.split('/')[3]}/period-evaluation-detail-v2`,
                    {
                      state: {
                        ...record,
                        periodId: record.id,
                        goals810Time: record?.departmentGoals,
                        goals17Time: record?.goals,
                        year: record.year,
                        periodIndex: record.periodIndex,
                        title: record.evaluationPeriod,
                        checkFixed: record.checkFixed,
                      },
                    },
                  );
                }, // click row
              };
            }}
            loading={isLoading}
            scroll={{ x: breaks.xs ? 900 : breaks.md ? 768 : breaks.sm ? 1024 : undefined }}
          />
        </Card>
      </Space>
      {/* Modal step 1: xem lịch bộ phận trước khi xác nhận */}
      <Modal
        title={
          <Typography.Text strong style={{ fontSize: 15 }}>
            {deptModal.scheduleType === 'goal' ? '目標確定 - 部署別実施期間確認' : '評価確定 - 部署別実施期間確認'}
          </Typography.Text>
        }
        open={deptModal.open}
        onCancel={() => setDeptModal((prev) => ({ ...prev, open: false }))}
        width={680}
        maskClosable={false}
        destroyOnClose
        footer={[
          <Button key="cancel" onClick={() => setDeptModal((prev) => ({ ...prev, open: false }))}>
            {t('POPUP_DIALOG.BUTTON.CANCEL')}
          </Button>,
          <Button key="proceed" type="primary" onClick={handleProceedToConfirm}>
            {deptModal.scheduleType === 'goal' ? '目標を全体確定へ進む' : '評価を全体確定へ進む'}
          </Button>,
        ]}
      >
        {deptModal.periodItem && buildDeptScheduleContent(deptModal.scheduleType, deptModal.periodItem)}
      </Modal>

      {/* Modal step 2: xác nhận cuối — logic không thay đổi */}
      <ModalCustomComponent
        isOpen={types.open}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={types.content}
        fnHandleOk={confirmPopup}
        fnHandleCancel={closePopup}
        okText={types.textButton}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        loading={isLoading}
      />

      <style>{`.dept-active-row > td { background-color: #fff7e6 !important; }`}</style>
    </div>
  );
};

export default EvaluationPeriodList;

// import React, { useEffect, useMemo, useState } from 'react';
// import { Alert, Select, Button, Radio, Card, Tag, Progress, Space, Row, Col, Typography, Form } from 'antd';
// import {
//   SearchOutlined,
//   CheckCircleFilled,
//   ClockCircleOutlined,
//   CalendarOutlined,
//   UndoOutlined,
//   WarningOutlined,
// } from '@ant-design/icons';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../../../../hooks/useAuth';
// import dayjs from 'dayjs';
// import { useSearchParams } from 'react-router-dom';
// import moment from 'moment';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
// import SearchPeriodComponent from '../../../../views/admin-evaluation/evaluationn-period-management/evaluation-period-list/SearchPeriodComponent';
// dayjs.extend(utc);
// dayjs.extend(timezone);
// import functionsPeriods from '../../../../common/api/adminPeriod';
// import { ListPeriods } from '../../../../page/admin/review-management/interfaces/InterfacesProps';
// import { RangePickerProps } from 'antd/es/date-picker';
// import { EvaluationPeriodHelper } from '../../../../common/utils/datetime/EvaluationPeriodHelper';
// interface SearchQuery {
//   yearStart?: string;
//   yearEnd?: string;
// }
// const EvaluationPeriodList = () => {
//   const [displayFormat, setDisplayFormat] = useState('dashboard');
//   const { t, i18n } = useTranslation();

//   const auth = useAuth();
//   const dateFormat = i18n.language === 'ja' ? 'YYYY/M/D' : i18n.language === 'en' ? 'YYYY/D/M' : 'D/M/YYYY';
//   const timeZone = auth.user?.timeZone || 'Asia/Tokyo';
//   const nows = dayjs.tz(dayjs(), timeZone);
//   const defaultYear = dayjs().set('year', nows.year());
//   const endYear = nows.add(5, 'year');
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [_form] = Form.useForm();
//   const searchQuery = useMemo(() => Object.fromEntries([...searchParams]) as SearchQuery, [searchParams]);
//   const [dataSources, setDataSource] = useState<ListPeriods[]>([]);
//   const [isLoading, setLoading] = useState(false);
//   const year = new Date();
//   const disabledDate: RangePickerProps['disabledDate'] = (current) => {
//     return defaultYear > current || current > endYear;
//   };
//   useEffect(() => {
//     const yearStart = searchQuery.yearStart
//       ? searchQuery.yearStart
//       : EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo');
//     const yearEnd = searchQuery.yearEnd
//       ? searchQuery.yearEnd
//       : EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo');
//     _form.setFieldsValue({
//       year: [
//         dayjs(moment(yearStart || year.getFullYear(), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
//         dayjs(moment(yearEnd || year.getFullYear(), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
//       ],
//     });
//     handleSearch();
//     if (Object.keys(searchQuery).length > 0) handleSearch();
//   }, []);
//   const handleSearch = async () => {
//     const years = _form.getFieldValue('year');
//     const yearStart = years ? dayjs(years[0], 'YYYY').format('YYYY') : currentYear.format('YYYY');
//     const yearEnd = years ? dayjs(years[1], 'YYYY').format('YYYY') : currentYear.format('YYYY');
//     if (yearStart && yearEnd)
//       await fetchEvaluationPeriodList({
//         yearStart,
//         yearEnd,
//       });
//   };
//   const callBack = (data: ListPeriods[]) => {
//     const newsArrays: any[] = data.map((v) => {
//       const departmentGoals = v.departmentGoals ? v.departmentGoals.split(' ～ ') : null;
//       const goals = v.goals ? v.goals.split(' ～ ') : null;
//       const personalEvaluations = v.personalEvaluation ? v.personalEvaluation.split(' ～ ') : null;
//       const divisionEvaluates = v.divisionEvaluate ? v.divisionEvaluate.split(' ～ ') : null;

//       return {
//         ...v,
//         key: v.id,
//         year: v.year,
//         periodIndex: v.periodIndex,
//         evaluationPeriod: v.evaluationPeriod,
//         departmentGoals: departmentGoals
//           ? `${dayjs(departmentGoals[0], 'YYYY/M/D').format(dateFormat)} ～ ${dayjs(
//               departmentGoals[1],
//               'YYYY/M/D',
//             ).format(dateFormat)}`
//           : null,
//         goals: goals
//           ? `${dayjs(goals[0], 'YYYY/M/D').format(dateFormat)} ～ ${dayjs(goals[1], 'YYYY/M/D').format(dateFormat)}`
//           : null,
//         checkFixed: v.checkFixed,
//         personalEvaluation: personalEvaluations
//           ? `${dayjs(personalEvaluations[0], 'YYYY/M/D').format(dateFormat)} ～ ${dayjs(
//               personalEvaluations[1],
//               'YYYY/M/D',
//             ).format(dateFormat)}`
//           : null,
//         divisionEvaluate: divisionEvaluates
//           ? `${dayjs(divisionEvaluates[0], 'YYYY/M/D').format(dateFormat)} ～ ${dayjs(
//               divisionEvaluates[1],
//               'YYYY/M/D',
//             ).format(dateFormat)}`
//           : null,
//       };
//     });

//     setDataSource(newsArrays);
//   };
//   const errorsCallback = (bool: boolean) => {
//     setLoading(bool);
//   };
//   const fetchEvaluationPeriodList = async ({ yearStart, yearEnd }: { yearStart: string; yearEnd: string }) => {
//     await functionsPeriods.listPeriodByYear(
//       `/api/v1/f5/management-evaluation-history/list-periods`,
//       {
//         yearStart,
//         yearEnd,
//       },
//       callBack,
//       errorsCallback,
//     );
//     setSearchParams({ ...searchQuery, yearStart: yearStart, yearEnd: yearEnd }, { replace: true });
//   };
//   const currentYear = dayjs(moment(defaultYear.format('YYYY'), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY');
//   console.log(dataSources);

//   return (
//     <div style={{ minHeight: '100vh' }}>
//       <Typography.Title level={3}>{(t('IDL_LIST_MENU_F5', { returnObjects: true }) as any)[2]}</Typography.Title>
//       {/* 1. Top Banner Alert */}
//       <Card style={{ marginBottom: 25 }}>
//         <SearchPeriodComponent
//           currentYear={currentYear}
//           form={_form}
//           handleSearch={handleSearch}
//           isLoading={isLoading}
//           yearStart={2025}
//           t={t}
//         />
//       </Card>
//       <div style={{}}>
//         {/* 5. Main Content Cards */}
//         <Space direction="vertical" size={15} style={{ width: '100%' }}>
//           {/* CARD 1: 2026年下期 (Chưa thiết lập) */}
//           <Card
//             bordered
//             style={{ borderRadius: '8px', borderLeft: '5px solid #ccc' }}
//             bodyStyle={{ padding: '16px 24px' }}
//           >
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 20 }}>
//               <span style={{ fontSize: '16px', fontWeight: 'bold' }}>2026年下期</span>
//               <Tag color="default">未設定</Tag>
//             </div>

//             {/* Workflow Timeline (Customized Flex Row) */}
//             <Row justify="space-between" align="middle" style={{ color: '#ccc' }}>
//               <Col style={{ color: '#007240' }}>
//                 <CheckCircleFilled /> 目標設定<div style={{ fontSize: 11, color: '#aaa', textAlign: 'center' }}>-</div>
//               </Col>
//               <Col style={{ flex: 1, height: '2px', backgroundColor: '#e8e8e8', margin: '0 8px' }}></Col>
//               <Col>
//                 <ClockCircleOutlined /> 目標確定
//                 <div style={{ fontSize: 11, color: '#aaa', textAlign: 'center' }}>-</div>
//               </Col>
//               <Col style={{ flex: 1, height: '2px', backgroundColor: '#e8e8e8', margin: '0 8px' }}></Col>
//               <Col>
//                 <ClockCircleOutlined /> 評価<div style={{ fontSize: 11, color: '#aaa', textAlign: 'center' }}>-</div>
//               </Col>
//               <Col style={{ flex: 1, height: '2px', backgroundColor: '#e8e8e8', margin: '0 8px' }}></Col>
//               <Col>
//                 <ClockCircleOutlined /> 評価結果確定
//                 <div style={{ fontSize: 11, color: '#aaa', textAlign: 'center' }}>-</div>
//               </Col>
//               <Col style={{ flex: 1, height: '2px', backgroundColor: '#e8e8e8', margin: '0 8px' }}></Col>
//               <Col>
//                 <ClockCircleOutlined /> 評価結果公開
//                 <div style={{ fontSize: 11, color: '#aaa', textAlign: 'center' }}>-</div>
//               </Col>
//             </Row>
//           </Card>

//           {/* CARD 2: 2026年上期 (Đang tiến hành) */}
//           <Card
//             bordered
//             style={{ borderRadius: '8px', border: '1px solid #006241', borderLeft: '5px solid #006241' }}
//             bodyStyle={{ padding: '16px 24px' }}
//           >
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 20 }}>
//               <span style={{ fontSize: '16px', fontWeight: 'bold' }}>2026年上期</span>
//               <Tag color="processing">進行中</Tag>
//               <Tag color="success">⚲ 42 件</Tag>
//               <Tag icon={<CalendarOutlined />} color="default" style={{ padding: '4px 8px' }}>
//                 目標部門 2026/5/22 ~ 2026/5/29
//               </Tag>
//               <Tag icon={<CalendarOutlined />} color="default" style={{ padding: '4px 8px' }}>
//                 目標個人 2026/5/21 ~ 2026/5/29
//               </Tag>
//             </div>
//             {/* Bottom Target Meta Badges */}
//             {/* Workflow Timeline */}
//             <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
//               <Col style={{ color: '#007240' }}>
//                 <CheckCircleFilled /> <span style={{ color: '#333' }}>目標設定</span>
//                 <div style={{ fontSize: '11px', color: '#999', marginTop: 4 }}>設定済み</div>
//               </Col>
//               <Col style={{ flex: 1, height: '2px', backgroundColor: '#1890ff', margin: '0 8px' }}></Col>

//               <Col style={{ color: '#006241', fontWeight: 'bold' }}>
//                 <CheckCircleFilled /> <span style={{ color: '#333' }}>目標確定</span>
//                 <div style={{ fontSize: '11px', color: '#666', marginTop: 4 }}>0/42件</div>
//               </Col>
//               <Col style={{ flex: 1, height: '2px', backgroundColor: '#e8e8e8', margin: '0 8px' }}></Col>

//               <Col style={{ color: '#aaa' }}>
//                 <ClockCircleOutlined /> <span style={{ color: '#999' }}>評価</span>
//                 <div style={{ fontSize: '11px', color: '#ccc', marginTop: 4 }}>-</div>
//               </Col>
//               <Col style={{ flex: 1, height: '2px', backgroundColor: '#e8e8e8', margin: '0 8px' }}></Col>

//               <Col style={{ color: '#aaa' }}>
//                 <ClockCircleOutlined /> <span style={{ color: '#999' }}>評価結果確定</span>
//                 <div style={{ fontSize: '11px', color: '#ccc', marginTop: 4 }}>0/42件</div>
//               </Col>
//               <Col style={{ flex: 1, height: '2px', backgroundColor: '#e8e8e8', margin: '0 8px' }}></Col>

//               <Col style={{ color: '#aaa' }}>
//                 <ClockCircleOutlined /> <span style={{ color: '#999' }}>評価結果公開</span>
//                 <div style={{ fontSize: '11px', color: '#ccc', marginTop: 4 }}>0/42件</div>
//               </Col>
//             </Row>

//             {/* Expanded Action Panel inside Card */}
//             <div
//               style={{ backgroundColor: '#f7f9fa', padding: '16px', borderRadius: '4px', border: '1px dashed #e8e8e8' }}
//             >
//               <Row align="middle" justify="space-between">
//                 <Col>
//                   <span style={{ fontSize: '12px', color: '#666', marginRight: 8 }}>現在のステップ</span>
//                   <strong style={{ color: '#333' }}>② 目標確定</strong>
//                   <Button type="primary" style={{ backgroundColor: '#006241', borderColor: '#006241', marginLeft: 16 }}>
//                     確定
//                   </Button>
//                   <span style={{ marginLeft: 12, color: '#666', fontSize: 13 }}>0/42 件</span>
//                 </Col>

//                 <Col style={{ flex: 1, margin: '0 24px' }}>
//                   <div
//                     style={{
//                       display: 'flex',
//                       justifyContent: 'flex-end',
//                       fontSize: '12px',
//                       color: '#006241',
//                       marginBottom: 4,
//                     }}
//                   >
//                     0%
//                   </div>
//                   <Progress percent={0} showInfo={false} strokeColor="#006241" trailColor="#e8e8e8" size="small" />
//                 </Col>

//                 <Col>
//                   <Space>
//                     <Button
//                       type="primary"
//                       danger
//                       icon={<WarningOutlined />}
//                       style={{ color: '#fa8c16', borderColor: '#fa8c16' }}
//                     >
//                       ▲ 42 件
//                     </Button>
//                     <Button icon={<UndoOutlined />}>元に戻す</Button>
//                   </Space>
//                 </Col>
//               </Row>
//             </div>
//           </Card>
//         </Space>
//       </div>
//     </div>
//   );
// };

// export default EvaluationPeriodList;
