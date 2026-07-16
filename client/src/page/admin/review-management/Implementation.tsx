import { Form, Table, Typography, DatePicker, Grid, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainButton } from '../../../common/MainButton';
import { t } from 'i18next';
import moment from 'moment-timezone';
import { RangePickerProps } from 'antd/es/date-picker';
import { useEffect, useState, useTransition } from 'react';
import dayjs from 'dayjs';
import functionsPeriods from '../../../common/api/adminPeriod';
import { ListPeriods } from './interfaces/InterfacesProps';
import { SearchOutlined } from '@ant-design/icons';
import AdminEvaluationApiService from '../../../common/api/adminEvaluation';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import ColumnImplementation from './components/ColumnImplementation';
import { EvaluationPeriodHelper } from '../../../common/utils/datetime/EvaluationPeriodHelper';
import { urlCompanyCode } from '../../../common/util';
import { useAuth } from '../../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
const Implementation = () => {
  const { i18n } = useTranslation();
  const [dataSources, setDataSource] = useState<ListPeriods[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [_form] = Form.useForm();
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const year = new Date();
  const state = useLocation().state;
  const breaks = Grid.useBreakpoint();
  const [condition, setCondition] = useState({ ...state });
  const [types, setType] = useState({
    type: '',
    title: '',
    content: '',
    textButton: '',
    open: false,
    checkFixed: undefined,
    periodId: undefined,
  });
  const auth = useAuth();
  const dateFormat = i18n.language === 'ja' ? 'YYYY/M/D' : i18n.language === 'en' ? 'YYYY/D/M' : 'D/M/YYYY';
  const timeZone = auth.user?.timeZone || 'Asia/Tokyo';
  const nows = dayjs.tz(dayjs(), timeZone);
  const defaultYear = dayjs().set('year', 2023);
  const endYear = nows.add(5, 'year');
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return defaultYear > current || current > endYear;
  };
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
      };
    });

    setDataSource(newsArrays);
  };
  const errorsCallback = (bool: boolean) => {
    setLoading(bool);
  };

  useEffect(() => {
    const yearStart =
      state?.yearStart || EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo');
    const yearEnd = state?.yearEnd || EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo');

    if (state !== null) {
      functionsPeriods.listPeriodByYear(
        `/api/v1/f5/management-evaluation-history/list-periods`,
        {
          yearStart,
          yearEnd,
        },
        callBack,
        errorsCallback,
      );
    }

    _form.setFieldsValue({
      year: [
        dayjs(moment(yearStart || year.getFullYear(), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
        dayjs(moment(yearEnd || year.getFullYear(), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
      ],
    });
  }, []);
  const fixedGoal = (item: any) => {
    setType({
      type: 'fixedGoal',
      title: t('POPUP_DIALOG.TITLE.CONFIRM'),
      content: t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_FIXED_GOAL'),
      textButton: t('POPUP_DIALOG.BUTTON.IDM_CONFIRM_FIXED_EVALUATION'),
      open: true,
      periodId: item.id,
      checkFixed: item.checkFixed,
    });
  };
  const fixedEvaluation = (item: any) => {
    setType({
      type: 'fixedEvaluation',
      title: t('POPUP_DIALOG.TITLE.CONFIRM'),
      content: t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_FIXED_EVALUATION'),
      textButton: t('POPUP_DIALOG.BUTTON.IDM_CONFIRM_FIXED_EVALUATION'),
      open: true,
      periodId: item.id,
      checkFixed: item.checkFixed,
    });
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
      title: t('Undo Fix Goal'),
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
      title: t('Undo Fix Evaluation'),
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
  const errorCallback = (error: any) => {
    console.log(error);
  };

  const goalConfirm = () => {
    const callback = (_res: any) => {
      if (state !== null) {
        const yearStart = state?.yearStart || new Date().getFullYear();
        const yearEnd = state?.yearEnd || new Date().getFullYear();
        functionsPeriods.listPeriodByYear(
          `/api/v1/f5/management-evaluation-history/list-periods`,
          {
            yearStart,
            yearEnd,
          },
          callBack,
          errorsCallback,
        );
      }
      message.success(t('MESSAGE.COMMON.IDM_FIX_GOAL_SUCCESS'));
    };
    AdminEvaluationApiService.goalConfirm(
      { periodId: types.periodId, checkFixed: types.checkFixed },
      { callback, errorCallback },
    );
  };
  const evaluationConfirm = () => {
    const callback = (_res: any) => {
      if (state !== null) {
        const yearStart = state?.yearStart || new Date().getFullYear();
        const yearEnd = state?.yearEnd || new Date().getFullYear();
        functionsPeriods.listPeriodByYear(
          `/api/v1/f5/management-evaluation-history/list-periods`,
          {
            yearStart,
            yearEnd,
          },
          callBack,
          errorsCallback,
        );
      }
      message.success(t('MESSAGE.COMMON.IDM_FIX_EVALUATION_SUCCESS'));
    };
    AdminEvaluationApiService.evaluationConfirm(
      { periodId: types.periodId, checkFixed: types.checkFixed },
      { callback, errorCallback },
    );
  };

  const publicEvaluation = () => {
    const callback = (_res: any) => {
      if (state !== null) {
        const yearStart = state?.yearStart || new Date().getFullYear();
        const yearEnd = state?.yearEnd || new Date().getFullYear();
        functionsPeriods.listPeriodByYear(
          `/api/v1/f5/management-evaluation-history/list-periods`,
          {
            yearStart,
            yearEnd,
          },
          callBack,
          errorsCallback,
        );
      }
      message.success(t('MESSAGE.COMMON.IDM_PUBLIC_EVALUATION_SUCCESS'));
    };
    AdminEvaluationApiService.publicEvaluation({ periodId: types.periodId }, { callback, errorCallback });
  };
  const undoFixGoalConfirm = () => {
    const callback = (_res: any) => {
      if (state !== null) {
        const yearStart = state?.yearStart || new Date().getFullYear();
        const yearEnd = state?.yearEnd || new Date().getFullYear();
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
      }
    };
    AdminEvaluationApiService.undoFixGoal({ periodId: types.periodId, type: 1 }, { callback, errorCallback });
  };
  const undoFixEvaluationConfirm = () => {
    const callback = (_res: any) => {
      if (state !== null) {
        const yearStart = state?.yearStart || new Date().getFullYear();
        const yearEnd = state?.yearEnd || new Date().getFullYear();
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
      }
    };
    AdminEvaluationApiService.undoFixGoal({ periodId: types.periodId, type: 2 }, { callback, errorCallback });
  };

  const handleSearch = () => {
    const years = _form.getFieldValue('year');
    const yearStart = dayjs(years[0], 'YYYY').format('YYYY');
    const yearEnd = dayjs(years[1], 'YYYY').format('YYYY');
    functionsPeriods.listPeriodByYear(
      `/api/v1/f5/management-evaluation-history/list-periods`,
      {
        yearStart,
        yearEnd,
      },
      callBack,
      errorsCallback,
    );

    navigate(window.location.pathname, {
      replace: true,
      state: {
        yearStart,
        yearEnd,
        isSearch: true,
      },
    });
    setCondition({ ...state, yearStart, yearEnd, isSearch: true });
  };

  return (
    <div>
      <Typography.Title level={3}>{(t('IDL_LIST_MENU_F5', { returnObjects: true }) as any)[2]}</Typography.Title>
      <Form
        colon={false}
        form={_form}
        labelCol={{ span: 1 }}
        style={{ width: '100%' }}
        layout="horizontal"
        labelAlign="left"
      >
        <Form.Item label={t('IDS_YEAR')} colon={false} name={'year'}>
          <RangePicker
            size={'small'}
            format={'YYYY'}
            picker="year"
            // disabledDate={disabledDate}
            clearIcon={false}
            style={{ width: 180 }}
          />
        </Form.Item>
        <MainButton
          type="primary"
          onClick={handleSearch}
          name="Search"
          value="Search"
          style={{ marginBottom: 20, marginTop: 15 }}
          loading={isLoading}
          icon={<SearchOutlined />}
        >
          {t('IDS_BUTTON_SEARCH')}
        </MainButton>
      </Form>
      {condition && condition.isSearch && (
        <Table
          bordered
          size="small"
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
          columns={ColumnImplementation({
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
            showTotal: (total, range) => `${total}${t('IDS_CASE_LABEL')} ${range[0]}-${range[1]}${t('IDS_ITEM_LABEL')}`,
            size: 'default',
            showSizeChanger: false,
          }}
          className={'ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer'}
          onRow={(record) => {
            return {
              onClick: (_e) => {
                navigate(urlCompanyCode() + `/${window.location.pathname.split('/')[3]}/period-evaluation-detail`, {
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
                });
              }, // click row
            };
          }}
          loading={isLoading}
          scroll={{ x: breaks.xs ? 900 : breaks.md ? 768 : breaks.sm ? 1024 : undefined }}
        />
      )}
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
    </div>
  );
};

export default Implementation;
