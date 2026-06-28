// ** React Imports
import { useEffect, useState, useTransition, FC } from 'react';

// ** I18 Imports
import { t } from 'i18next';

//  ** Antd Imports
import Card from 'antd/es/card';
import Form from 'antd/es/form';
import Space from 'antd/es/space';
import Modal from 'antd/es/modal/Modal';
import { Spin, message } from 'antd';
import Typography from 'antd/es/typography';
import { useForm } from 'antd/es/form/Form';
import Grid, { Row } from 'antd/es/grid';
import notification from 'antd/es/notification';
import Button, { ButtonProps } from 'antd/es/button';
import { NotificationPlacement } from 'antd/es/notification/interface';

// ** Styles Imports
import styled from '@emotion/styled';

//  ** Component Imports
import AdminPeriodApiService from '../../../common/api/adminPeriod';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import ExceptionPeriodInfor from '../../../views/admin-period/ExceptionPeriodInfor';
import { EvaluationByPeriodType, PeriodType } from '../../../types/api/adminPeriodType';
import exceptionPeriodColumn from '../../../views/admin-period/column/exceoptionPeriodColumn';
import TableCustomComponent from '../../../@core/components/table-custom/TableCustomComponent';
import { ExceptionPeriodType } from '../../../types/pages/exception-period/ExceptionPeriodType';

// ** Store & Actions Imports
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { setErrorExceptionDate } from '../../../store/exception';
import { setFocusAchievementPersonalError } from '../../../store/userEvaluation';

// ** React router Inports
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { dayJsFormat, urlCompanyCode } from '../../../common/util';

// ** Day Imports
import dayjs from 'dayjs';

// ** Hook Import
import { useAuth } from '../../../hooks/useAuth';
import ExceptionPeriodAddNew from './ExceptionPeriodAddNew';
import httpAxios from '../../../common/http';

// ** Type
type OptionType = {
  label: string;
  value: any;
};
type DepartmentOptionType = {
  label: any;
  value: any;
  type: any;
};
type KeyEvaluation = keyof EvaluationByPeriodType;

const { useBreakpoint } = Grid;
interface Props {
  userInfo: any;
  handleCancelPopUp: any;
  handleSearchSavePopUp: any;
  handleClosePopUp: any;
  isEvaluationTime?: boolean;
  buttonShowMore?: any;
}

const ExceptionPeriodEvaluationScreen = (props: Props) => {
  const { userInfo, handleCancelPopUp, handleSearchSavePopUp, handleClosePopUp, isEvaluationTime, buttonShowMore } =
    props;

  // ** State
  const [isOpenExceptionPopup, setOpenExceptionPopup] = useState<boolean>(false);
  const [isOpenConfirmPopup, setOpenConfirmPopup] = useState<boolean>(false);
  const [isOpenNotification, setOpenNotification] = useState<boolean>(false);

  const [companies, setCompany] = useState<OptionType[]>([]);

  const [departments, setDepartment] = useState<DepartmentOptionType[]>([]);

  const [listSkills, setListSkill] = useState([]) as any;

  const [selectedRows, setSelectedRow] = useState<any[]>([]);

  // const [userInfo, setUserInfo] = useState<ExceptionPeriodType>();

  const [evaluations, setEvaluation] = useState<EvaluationByPeriodType[]>([]);

  const [evaluationOlds, setEvaluationOld] = useState<EvaluationByPeriodType[]>([]);

  const [evaluationDeleteIds, setEvaluationDeleteIds] = useState<number[]>([]);

  const [evaluators, setEvaluator] = useState<OptionType[]>([]);

  const [period, setPeriod] = useState<PeriodType | null>(null);

  const [isSaveLoading, setSaveLoading] = useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(false);

  const [form] = useForm();

  const [isPending, _startTransition] = useTransition();

  const [submitForm] = useForm();

  const screens = useBreakpoint();

  const [ids, setId] = useState<number>(1);

  const [evaluatorErrorNames, setEvaluatorErrorName] = useState<string[]>([]);

  const { user } = useAuth();

  // ** Redux
  const dispatch = useDispatch<AppDispatch>();

  const location = useLocation();
  const state = location.state as {
    title: string;
    year: number;
    periodIndex: number;
    userId?: number;
    userInfor: ExceptionPeriodType;
    periodId: number;
  };

  if (!state || !state.year) {
    return <Navigate to={'/admin-evaluation/list-period-evaluation'} />;
  }

  const year = state.year;
  const periodId = state.periodId;
  const periodIndex = state.periodIndex;
  const navigation = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  // ** Style Component
  const ButtonCustom = styled(Button)<ButtonProps>((theme) => ({
    '&.ant-btn-primary': {
      paddingLeft: screens.xs ? 15 : theme.style?.paddingLeft, // '1.5rem'
      paddingRight: screens.xs ? 15 : theme.style?.paddingRight, // '1.5rem'
    },
  }));

  // ** Effect
  useEffect(() => {
    // if (!state.periodIndex || !state.periodIndex) return navigation(-1);
    AdminPeriodApiService.getCompany({
      callback: (options) => setCompany([...options]),
    });

    AdminPeriodApiService.getDepartment(year, periodIndex, {
      callback: (options) => setDepartment([...options]),
    });

    AdminPeriodApiService.getEvaluatorUsers({
      evaluationCreatorId: userInfo?.id,
      callback: (options) => setEvaluator(options),
    });

    httpAxios.Get('/api/v1/f5/management-evaluation-history/get-all-skill-public').then((res) => {
      if (res && res?.status) {
        const arrays = res?.data.map((v: any) => ({
          label: `${v.name}`,
          value: v.id,
        }));

        setListSkill(arrays);
      }
    });

    return () => {
      dispatch(setFocusAchievementPersonalError(false));
      dispatch(setErrorExceptionDate(false));
    };
  }, []);
  useEffect(() => {
    handleGetEvaluationPeriod();
  }, [userInfo]);

  // ** Functional
  const handleExceptionPopup = () => setOpenExceptionPopup(!isOpenExceptionPopup);
  const handleConfirmPopup = () => {
    // if (!evaluations.length || evaluations.length < 2) {
    //   openNotification(
    //     'bottomRight',
    //     t('MESSAGE.COMMON.IDM_ADD_MIN_RECORD').replace('{min}', '2'),
    //   );

    //   return;
    // }

    submitForm
      .validateFields()
      .then(() => {
        const percentPoints = evaluations.map((v) => v.percentPoint);
        const totalPercentPoint = percentPoints.reduce((pre, cur) => (Number(pre) || 0) + (Number(cur) || 0), 0) || 0;
        const times = evaluations
          .map((v) => ({
            start: v.periodStart,
            end: v.periodEnd,
            startTime: dayjs(v.periodStart, 'YYYY/M').valueOf(),
          }))
          .sort((a, b) => a.startTime - b.startTime);

        if (evaluations.length > 0 && (totalPercentPoint < 100 || totalPercentPoint > 100)) {
          dispatch(setFocusAchievementPersonalError(true));
          openNotification(
            'bottomRight',
            t('MESSAGE.COMMON.IDS_EQUAL_100_PERCENT').replace('{value}', t('IDS_CALCULATED_RATIO')),
          );
        }

        const isDuplicateDate = handleDateDuplicate(times);
        if (isDuplicateDate) {
          openNotification('bottomRight', t('MESSAGE.COMMON.IDM_SAME_EVALUATION_PERIOD'));
          dispatch(setErrorExceptionDate(true));
        }
        if (evaluations.length === 0 || (evaluations.length > 0 && totalPercentPoint === 100 && !isDuplicateDate))
          setOpenConfirmPopup(!isOpenConfirmPopup);
      })
      .catch(() => setSaveLoading(false));
  };
  const handleBacktoPrevious = () =>
    navigation(`${urlCompanyCode()}/admin-evaluation/period-evaluation-detail-v2`, {
      // replace: true,
      state: { ...state, userId: undefined, title: state.title, year, periodIndex, isOpenTabException: true },
    });

  const handleSavePopup = async (response: { evaluations: EvaluationByPeriodType[]; period: PeriodType }) => {
    await setEvaluation(response.evaluations);
    await setEvaluationOld(response.evaluations);
    await setId(response.evaluations.length);
    await setPeriod(response.period);

    // if (selectedRows.length > 0) setUserInfo(selectedRows[0]);
    // if (state.userId) setUserInfo(state.userInfor);
  };

  const handleGetEvaluationPeriod = async () => {
    // if (state.userId) {
    setLoading(true);
    await AdminPeriodApiService.getEvaluationPeriod({
      userId: userInfo.id,
      year,
      periodIndex,
      callback: async (data) => {
        data.evaluations.forEach((item: any) => {
          const temSkills: any[] = [];
          const temSkillNames: any[] = [];
          item.skillUser.map((item: any) => {
            temSkills.push(item.skillId);
            temSkillNames.push(item.skill?.name);
          });
          item.skillUser = temSkills;
          item.skillNameUser = temSkillNames;
        });

        await handleSavePopup(data);
        setLoading(false);
      },
      errorCallback: () => setLoading(false),
    });

    // }
  };
  const handleAddNew = () => {
    const id = ids + 1;
    const periodString = `${year}年${periodIndex === 2 ? t('IDS_SECOND_PERIOD') : t('IDS_FIRST_PERIOD')}`;
    const item: EvaluationByPeriodType = {
      companyName: '',
      departmentName: '',
      divisionName: '',
      period: periodString,
      percentPoint: null,
      level: null,
      dateCreationGoalStart: undefined,
      dateCreationGoalEnd: undefined,
      evaluator05: null,
      evaluator10: null,
      evaluator20: null,

      // checkSendMail: false,
      // dateSendMail: null,
      key: `exception-key-${id}`,
      id: 0,
      isEdit: true,
      periodStart: null,
      periodEnd: null,
      evaluator05Name: null,
      evaluator10Name: null,
      evaluator20Name: null,
      evaluationPeriodId: period?.id,
      status: 0,
      dateEvaluationStart: undefined,
      dateEvaluationEnd: undefined,

      // checkSendMailEvaluation: false,
      // dateSendMailEvaluation: null,
      creationUser: user?.id || 1,
      isAddNew: true,
      flagSkill: 0,
      skillUser: null,
    };

    if (evaluations.length < 10) {
      setEvaluation([...evaluations, item]);
      setId(id);
    } else message.warning(t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '10'));
  };

  const handleDelteRow = (key: string) => {
    const fillters = evaluations.filter((f) => f.key !== key);
    const evaluation = evaluations.find((f) => f.key === key);
    if (evaluation && evaluation.id) {
      //
      setEvaluationDeleteIds([...evaluationDeleteIds, evaluation.id]);
    }
    setEvaluation(fillters);
  };

  const renderPopupProps = {
    year,
    form,
    companies,
    departments,
    periodIndex,
    setEvaluator,
    selectedRows,
    ButtonCustom,
    setSelectedRow,
    handleSavePopup,
    isOpenExceptionPopup,
    handleExceptionPopup,
    periodId,
  };
  const renderPopup = () => <ExceptionPeriodAddNew {...renderPopupProps} />;

  const handleChange = (index: number, key: KeyEvaluation, value: any, key2?: KeyEvaluation, value2?: any) => {
    const evaluationList: any[] = evaluations.map((v) => ({ ...v }));
    if (evaluationList.length > 0 && evaluationList[index]) {
      evaluationList[index][key] = value;

      if (key2 && value2) evaluationList[index][key2] = value2;
      if (key === 'evaluator05') evaluationList[index].evaluator05Error = false;
      if (key === 'evaluator10') evaluationList[index].evaluator10Error = false;
      if (key === 'departmentName') evaluationList[index][key] = value ?? null;
      if (key2 === 'departmentId') evaluationList[index][key2] = value2 ?? null;

      setEvaluation(evaluationList);
    }
  };

  const openNotification = (placement: NotificationPlacement, msg: string) => {
    api.warning({
      message: <Typography.Title level={4}>{t('IDS_NOTIFY')}</Typography.Title>,
      description: msg,
      placement,
      duration: 3,
    });
  };
  const handleDateDuplicate = (data: any[]) => {
    //     if (array.length === 0) return true;

    //     console.log(1, array);

    // return array.some((v, i) => {
    //       const copies: { start: number; end: number }[] = [...array.filter((_, index) => index !== i)];
    //       console.log(2, copies);

    //       if (copies.some((s) => v.start >= s.start)) return false;
    //       if (copies.some((s) => v.end >= s.start)) return false;

    //       return true;
    //     });

    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const startA = new Date(data[i].start + '/01'); // Thêm ngày để tạo đối tượng Date
        const endA = new Date(data[i].end + '/01');
        const startB = new Date(data[j].start + '/01');
        const endB = new Date(data[j].end + '/01');

        // Kiểm tra xem có trùng lặp không
        if (
          startA <= endB &&
          endA >= startB // Kiểm tra giao nhau
        ) {
          return true; // Có trùng
        }
      }
    }

    return false; // Không có trùng
  };

  const handleSave = async () => {
    const evaluationChanges = evaluations.filter((v, i) => {
      const index = evaluationOlds.findIndex(
        (t) =>
          t.id === v.id &&
          t.companyName === v.companyName &&
          t.departmentName === v.departmentName &&
          t.divisionName === v.divisionName &&
          t.periodStart === v.periodStart &&
          t.periodEnd === v.periodEnd &&
          t.percentPoint == v.percentPoint &&
          t.level === v.level &&
          t.dateCreationGoalStart === v.dateCreationGoalStart &&
          t.dateCreationGoalEnd === v.dateCreationGoalEnd &&
          t.dateEvaluationStart === v.dateEvaluationStart &&
          t.dateEvaluationEnd === v.dateEvaluationEnd &&
          t.evaluator05 === v.evaluator05 &&
          t.evaluator10 === v.evaluator10 &&
          t.evaluator20 === v.evaluator20 &&
          JSON.stringify(t.skillUser) === JSON.stringify(v.skillUser),
      );

      return i === index;
    });

    await submitForm
      .validateFields()
      .then(() => {
        setSaveLoading(true);
        const userId = userInfo.id;
        AdminPeriodApiService.updateEvaluationPeriodException({
          evaluations,
          userId,
          deleteIds: evaluationDeleteIds,
          year,
          periodIndex,
          callback(data: {
            evaluator05ErrorIds: number[];
            evaluator10ErrorIds: number[];
            evaluatorErrorNames: string[];
            evaluationNewIds: number[];
          }) {
            if (data && (data.evaluator05ErrorIds.length > 0 || data.evaluator10ErrorIds.length > 0)) {
              const evaluator05ErrorIds: number[] = data.evaluator05ErrorIds;
              const evaluator10ErrorIds: number[] = data.evaluator10ErrorIds;
              const evaluationNewIds = data.evaluationNewIds || [];
              const convertEvaluations = evaluations.map((v, i) => ({
                ...v,
                evaluator05Error: evaluator05ErrorIds.includes(v?.id),
                evaluator10Error: evaluator10ErrorIds.includes(v?.id),
                id: v.id === 0 ? evaluationNewIds[i] : v.id,
              }));
              if (data?.evaluatorErrorNames.length > 0) setEvaluatorErrorName(data.evaluatorErrorNames);
              setOpenNotification(true);
              setEvaluation(convertEvaluations);
            } else {
              if (
                data.evaluationNewIds?.length > 0 ||
                evaluations.length > evaluationChanges.length ||
                (evaluations.length === evaluationChanges.length && evaluations.length < evaluationOlds.length)
              )
                message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));

              handleBacktoPrevious();
              handleClosePopUp();
              handleSearchSavePopUp();
            }
            setSaveLoading(false);
          },
        });
        handleConfirmPopup();
      })
      .catch((_) => {
        handleConfirmPopup();
      });
  };

  const handleCaculatorPercent = () => {
    const totalPercentPoint = evaluations.reduce((pre, cur) => {
      if (!cur.periodStart || !cur.periodEnd) return pre;

      const periodStart = dayJsFormat(cur.periodStart, 'YYYY/M', true) as dayjs.Dayjs;
      const periodEnd = dayJsFormat(cur.periodEnd, 'YYYY/M', true) as dayjs.Dayjs;
      const duration = periodEnd.diff(periodStart, 'M') + 1;

      return duration + pre;
    }, 0);

    evaluations.map((v, i) => {
      if (!v.periodStart || !v.periodEnd)
        return {
          ...v,
          periodPercentPlaceholder: 0,
        };
      const periodStart = dayJsFormat(v.periodStart, 'YYYY/M', true) as dayjs.Dayjs;
      const periodEnd = dayJsFormat(v.periodEnd, 'YYYY/M', true) as dayjs.Dayjs;
      const duration = periodEnd.diff(periodStart, 'M') + 1;

      const periodPercentPlaceholder = totalPercentPoint === 0 ? 0 : Math.round((duration / totalPercentPoint) * 100);
      if (evaluations.length - 1 !== i) {
        submitForm.setFieldValue(`percentPoint-${v.key}`, periodPercentPlaceholder);
        v.percentPoint = periodPercentPlaceholder;
      } else {
        v.percentPoint = 0;
      }
    });

    if (
      evaluations?.length > 0 &&
      evaluations[evaluations.length - 1]?.key &&
      evaluations[evaluations.length - 1]?.periodStart &&
      evaluations[evaluations.length - 1]?.periodEnd
    ) {
      const percentPoint = 100 - evaluations.reduce((pre, cur) => pre + (cur.percentPoint || 0), 0);
      submitForm.setFieldValue(
        `percentPoint-${evaluations[evaluations.length - 1].key}`,
        percentPoint >= 0 ? percentPoint : 0,
      );

      evaluations[evaluations.length - 1].percentPoint = percentPoint >= 0 ? percentPoint : 0;
    }

    setEvaluation(evaluations);
  };

  const disabledPeriodDate = (current: dayjs.Dayjs, _index: number) => {
    const startDate = dayjs().subtract(1, 'day');
    const endDate = dayjs().add(15, 'year');

    return current && (current < startDate || current > endDate);
  };

  const renderNotification = () => {
    return (
      <>
        <div>{t('MESSAGE.COMMON.IDM_RESULT_TITLE')}</div>
        <div>{evaluatorErrorNames.map((v) => `${v}${t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_REASON')}`)}</div>
        <br />
        <div>{t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_2')}</div>
        <div>{t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_3')}</div>
      </>
    );
  };

  const exceptionPeriodColumnProps = {
    departments,
    companies,
    evaluators,
    period,
    submitForm,
    listSkills,
    handleChange,
    handleDelteRow,
    handleCaculatorPercent,
    disabledPeriodDate,
    buttonShowMore,
    evaluations,
    isEvaluationTime,
  };

  const columns = exceptionPeriodColumn(exceptionPeriodColumnProps);

  return (
    <>
      {contextHolder}
      {/* Infor */}
      {/* <ExceptionPeriodInfor {...inforProps} /> */}
      {/* Table */}
      {/* {isLoading ? (
        <Spin
          size="large"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        />
      ) : (
        <> */}
      {/* {period && ( */}

      <Form form={submitForm} requiredMark={false}>
        <TableCustomComponent
          columns={columns}
          dataSources={evaluations}
          size="small"
          style={{ paddingBottom: 15 }}
          isLoading={isLoading || isPending || isSaveLoading}
          isScroll={screens.sm}
          className="exception-table-custom-css"
          isSetScroll={{ x: screens.sm || screens.xs ? 2000 : undefined }}
        />
        <ButtonCustom
          type="primary"
          loading={isLoading || isSaveLoading}
          onClick={handleAddNew}
          disabled={isEvaluationTime}
        >
          {t('IDS_BUTTON_ADD')}
        </ButtonCustom>
        <Row style={{ paddingTop: 15 }}>
          <Space direction="horizontal">
            <ButtonCustom type="primary" onClick={handleConfirmPopup} loading={isLoading || isSaveLoading}>
              {t('IDS_BUTTON_SAVE')}
            </ButtonCustom>
            <ButtonCustom
              type="default"
              className="cancel_button"
              loading={isLoading || isSaveLoading}
              onClick={handleCancelPopUp}
            >
              {t('IDS_BUTTON_CANCEL')}
            </ButtonCustom>
          </Space>
        </Row>
      </Form>

      {/* </Card>
      )} */}
      {/* Modal */}
      <ModalCustomComponent
        isOpen={isOpenExceptionPopup}
        header={t('IDS_SELECT_EMPLOYEE')}
        content={renderPopup()}
        footer={null}
        width="calc(100vw - 100px)"
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        fnHandleOk={function (): void {
          throw new Error('Function not implemented.');
        }}
        fnHandleCancel={handleExceptionPopup}
        loading={isSaveLoading}
      />
      <ModalCustomComponent
        isOpen={isOpenConfirmPopup}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE')}
        fnHandleOk={handleSave}
        fnHandleCancel={handleConfirmPopup}
        okText={t('IDS_BUTTON_SAVE') as string}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        loading={isSaveLoading}
      />
      <Modal
        title={<Typography.Title level={4}>{t('POPUP_DIALOG.TITLE.PROCESS_RESULT')}</Typography.Title>}
        open={isOpenNotification}
        // closable={false}
        maskClosable={false}
        destroyOnClose={true}
        centered
        footer={[
          <div style={{ textAlign: 'left' }} key={'Modal-open-key-1'}>
            <Button className="cancel_button" onClick={() => setOpenNotification(false)}>
              {t('IDS_BUTTON_CLOSE')}
            </Button>
          </div>,
        ]}
      >
        {renderNotification()}
      </Modal>
    </>

    //   )}
    // </>
  );
};

export default ExceptionPeriodEvaluationScreen;
