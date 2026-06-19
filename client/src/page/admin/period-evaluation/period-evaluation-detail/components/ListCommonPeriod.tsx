import { Form, Space, DatePicker, Col, Button, message, Dropdown, MenuProps, Row, Typography } from 'antd';
import './Main.css';
import { useEffect, useState } from 'react';
import evaluationPeriodServices from '../../../../../common/api/evaluationPeriod';
import { i18n, t } from 'i18next';
import dayjs, { Dayjs } from 'dayjs';
import { RangePickerProps } from 'antd/es/date-picker';
import { useLocation, useNavigate } from 'react-router-dom';
import Spin from 'antd/lib/spin';
import moment, { Moment } from 'moment-timezone';
import ModalCustomComponent from '../../../../../@core/components/modal-custom';
import localeJa from '../../../../../@core/locales/jaDatePick';
import { CaretUpOutlined } from '@ant-design/icons';
import SendEmailScreen from './sendMail';
import { EvaluationPeriod, MailQuery, ToMailList } from '../interfaces/interfacesProps';
import { urlCompanyCode } from '../../../../../common/util';
import { useAuth } from '../../../../../hooks/useAuth';
import utc from 'dayjs/plugin/utc';
import timeZonePlugin from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timeZonePlugin);
const ListCommonPeriod: React.FC<any> = (props: { recordInfo: MailQuery; setEvaluationTime: any; i18n: i18n }) => {
  const { recordInfo, setEvaluationTime, i18n } = props;
  const auth = useAuth();

  const [form] = Form.useForm();

  const { RangePicker } = DatePicker;

  const dateFormat = i18n.language === 'ja' ? 'YYYY/M/D' : i18n.language === 'en' ? 'YYYY/D/M' : 'D/M/YYYY';
  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  const [isOpenMail, setOpenMail] = useState<boolean>(false);
  const timeZone = (auth.user && auth.user.timeZone) || 'Asia/Tokyo';

  const now = dayjs(dayjs(), timeZone);
  const current = dayjs(now).format('YYYY/M/D H:m:s');

  const [type, setType] = useState<any>();

  const init = {
    id: recordInfo.periodId,
    dateCreationGoalDepartmentEnd: current,
    dateCreationGoalDepartmentStart: current,
    dateCreationGoalEnd: current,
    dateCreationGoalStart: current,
    dateEvaluationDepartmentEnd: current,
    dateEvaluationDepartmentStart: current,
    dateEvaluationEnd: current,
    dateEvaluationStart: current,
    periodEnd: '',
    periodIndex: recordInfo.periodIndex,
    periodStart: '',
    year: recordInfo?.year,
  };

  const [dataSaves, setDataSaves] = useState(init as EvaluationPeriod);

  const [dataSources, setDataSource] = useState(init as EvaluationPeriod);

  const [isEdit, setIsEdit] = useState(false);

  const state = useLocation().state;

  const errorCallBack = (bool: boolean) => {
    setLoading(bool);
  };

  const year = state?.year;

  const periodIndex = state?.periodIndex;

  const navigate = useNavigate();

  const location = useLocation();

  const [isLoading, setLoading] = useState<boolean>(false);

  const [toEmailList, setToEmailList] = useState([] as ToMailList[]);

  const [mailTitle, setMailTitle] = useState<string>(``);

  const [mailContent, setMailContent] = useState<string>(``);

  const [levelType, setLevelType] = useState<number>(1);

  const [isFixed, setCheckFixed] = useState<boolean>(false);

  useEffect(() => {
    if (!state || state == null) {
      navigate(urlCompanyCode() + '/admin-evaluation/list-period-evaluation');
    }
    processData();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(!isOpenModal);
  };

  const isGreaterThanEqualToday = (dateString: string | undefined): boolean => {
    if (!dateString) return false;

    const dateNow = moment.tz(timeZone).format('YYYYMMDD');
    const convertStartDate = moment(`${dateString}`, 'YYYY/M/D').format('YYYYMMDD');

    return dateNow >= convertStartDate;
  };

  const callBack = (resData: EvaluationPeriod) => {
    if (isOpenModal) {
      message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
      handleOpenModal();
    }
    setIsEdit(false);
    setCheckFixed(resData.checkFixed == 2);
    setDataSaves(resData);
    setDataSource(resData);
    handleNavigation(resData);

    setEvaluationTime(
      isGreaterThanEqualToday(resData?.dateEvaluationStart) ||
        isGreaterThanEqualToday(resData?.dateEvaluationDepartmentStart),
    );
  };

  const processData = async () => {
    const url = `/api/v1/f5/management-evaluation-history/period/${year}/${periodIndex}`;
    await evaluationPeriodServices.getPeriodDetailByCondition(url, callBack, errorCallBack);
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today AND not select day 6 months apart
    const now = dayjs.tz(dayjs(), timeZone).add(0, 'day').startOf('day');
    const sixMonthsLater = dayjs.tz(dayjs(), timeZone).add(6, 'month');

    return (
      current && ((current < now && current.format(dateFormat) !== now.format(dateFormat)) || current > sixMonthsLater)
    );
  };

  const checkChange = (before: EvaluationPeriod, after: EvaluationPeriod) => {
    let isChange = false;

    if (
      before.dateCreationGoalDepartmentStart !== after.dateCreationGoalDepartmentStart ||
      before.dateCreationGoalDepartmentEnd !== after.dateCreationGoalDepartmentEnd ||
      before.dateCreationGoalStart !== after.dateCreationGoalStart ||
      before.dateCreationGoalEnd !== after.dateCreationGoalEnd ||
      before.dateEvaluationDepartmentStart !== after.dateEvaluationDepartmentStart ||
      before.dateEvaluationDepartmentEnd !== after.dateEvaluationDepartmentEnd ||
      before.dateEvaluationStart !== after.dateEvaluationStart ||
      before.dateEvaluationEnd !== after.dateEvaluationEnd
    )
      isChange = true;

    return isChange;
  };

  const handleValidate = () => {
    if (!checkChange(dataSources, dataSaves)) {
      setOpenModal(false);
      setIsEdit(false);
    }
    if (checkChange(dataSources, dataSaves)) handleOpenModal();
  };

  const handleSave = async () => {
    const url = '/api/v1/f5/management-evaluation-history/period/save';

    // console.log(dataSources, dataSaves);

    if (checkChange(dataSources, dataSaves))
      await evaluationPeriodServices.savePeriodValues(
        url,
        { condition: { year: year.toString(), periodIndex: periodIndex }, body: dataSaves },
        processData,
        errorCallBack,
      );
    handleOpenModal();
  };

  const handleNavigation = (data: EvaluationPeriod) => {
    navigate(location.pathname, {
      replace: true,
      state: {
        ...location.state,
        dateCreationGoalStart: data.dateCreationGoalStart,
        dateCreationGoalEnd: data.dateCreationGoalEnd,
        dateCreationGoalDepartmentStart: data.dateCreationGoalDepartmentStart,
        dateCreationGoalDepartmentEnd: data.dateCreationGoalDepartmentEnd,
        dateEvaluationDepartmentEnd: data.dateEvaluationDepartmentEnd,
        dateEvaluationDepartmentStart: data.dateEvaluationDepartmentStart,
        dateEvaluationEnd: data.dateEvaluationEnd,
        dateEvaluationStart: data.dateEvaluationStart,
        periodId: recordInfo.periodId,
      },
    });
  };

  const handleCancel = async () => {
    processData();
    setIsEdit(false);
  };

  const items: MenuProps['items'] = [
    {
      label: t('IDS_SEND_MAIL_NOW'),
      key: '0',
      onClick() {
        handleSelect(0);
      },
    },
    {
      label: t('IDS_SEND_MAIL_SETTING_TIME'),
      key: '1',
      onClick() {
        handleSelect(1);
      },
    },
  ];

  const handleSelect = async (type: number) => {
    setLoading(true);
    await evaluationPeriodServices.getToEmailList(processMailResponse, levelType, year.toString(), periodIndex);
    setType(type);
    setOpenMail(true);
    setLoading(false);
  };

  const handleClosePopup = () => {
    setOpenMail(false);
    setToEmailList([]);
    setMailTitle('');
    setMailContent('');
    setType(null);
  };

  const processMailResponse = (resData: { toEmailList: ToMailList[]; content: string; title: string }) => {
    setToEmailList(resData.toEmailList);
    setMailTitle(resData.title);

    //const newElement = convertMailContent(resData.content);
    setMailContent(resData.content);
  };

  return (
    <div>
      <Form
        form={form}
        labelAlign="left"
        labelCol={{ span: 1 }}
        colon={false}
        requiredMark={false}
        style={{ position: 'relative' }}
        disabled={isFixed}
      >
        {isLoading && (
          <>
            <div
              style={{
                position: 'absolute',
                zIndex: 2,
                width: '100%',
                height: '100%',
                background: '#ddd',
                opacity: 0.1,
              }}
            ></div>
            <Spin
              size="default"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%)`,
                zIndex: 5,
              }}
            />
          </>
        )}
        <Typography.Title level={5}>{t('IDS_COMMON_PERIOD')}</Typography.Title>
        <Form.Item
          label={t('IDS_DEPARTMENTAL_GOAL_SETTING')}
          name="departmentGoal"
          className={isEdit ? '' : 'ant-form-item-info'}
        >
          {isEdit ? (
            <>
              <Space size={'small'}>
                <RangePicker
                  id="departmentGoal1"
                  allowClear={false}
                  // disabledDate={disabledDate}
                  locale={localeJa}
                  defaultValue={[
                    dataSources.dateCreationGoalDepartmentStart
                      ? dayjs(dataSources.dateCreationGoalDepartmentStart, dateFormat)
                      : null,
                    dataSources.dateCreationGoalDepartmentEnd
                      ? dayjs(dataSources.dateCreationGoalDepartmentEnd, dateFormat)
                      : null,
                  ]}
                  format={dateFormat}
                  style={{ width: 250 }}
                  onChange={(_values: any, formatString: [string, string]) => {
                    setDataSaves((state: EvaluationPeriod) => ({
                      ...state,
                      dateCreationGoalDepartmentStart: formatString[0],
                      dateCreationGoalDepartmentEnd: formatString[1],
                    }));
                  }}
                />
              </Space>
            </>
          ) : (
            <Space
              style={{
                display:
                  !isLoading && (dataSources.dateCreationGoalDepartmentStart || dataSources.dateCreationGoalStart)
                    ? 'inline-flex'
                    : 'none',
              }}
            >
              <Col style={{ width: '180px' }}>
                {dataSources.dateCreationGoalDepartmentStart}
                {dataSources.dateCreationGoalDepartmentStart && ' ～ '}
                {dataSources.dateCreationGoalDepartmentEnd}
              </Col>
              <Col>
                <Dropdown
                  menu={{ items }}
                  trigger={['click']}
                  placement="topLeft"
                  autoAdjustOverflow
                  destroyPopupOnHide={true}
                >
                  <Button type="primary" onClick={() => setLevelType(7)}>
                    <a style={{ color: 'white' }}>
                      <Space>
                        {t('IDS_SEND_MAIL')}
                        <CaretUpOutlined />
                      </Space>
                    </a>
                  </Button>
                </Dropdown>
              </Col>
            </Space>
          )}
        </Form.Item>
        <Form.Item
          label={t('IDS_PERSONAL_GOAL_SETTING')}
          name="personalGoal"
          className={isEdit ? '' : 'ant-form-item-info'}
        >
          {isEdit ? (
            <>
              <Space size={'small'}>
                <RangePicker
                  id="personalGoal5"
                  allowClear={false}
                  // disabledDate={disabledDate}
                  locale={localeJa}
                  style={{ width: 250 }}
                  defaultValue={[
                    dataSources.dateCreationGoalStart ? dayjs(dataSources.dateCreationGoalStart, dateFormat) : null,
                    dataSources.dateCreationGoalEnd ? dayjs(dataSources.dateCreationGoalEnd, dateFormat) : null,
                  ]}
                  format={dateFormat}
                  onChange={(_values: any, formatString: [string, string]) => {
                    setDataSaves((state: EvaluationPeriod) => ({
                      ...state,
                      dateCreationGoalStart: formatString[0],
                      dateCreationGoalEnd: formatString[1],
                    }));
                  }}
                />
              </Space>
            </>
          ) : (
            <Space
              style={{
                display:
                  !isLoading && (dataSources.dateCreationGoalStart || dataSources.dateCreationGoalEnd)
                    ? 'inline-flex'
                    : 'none',
              }}
            >
              <Col style={{ width: '180px' }}>
                {dataSources.dateCreationGoalStart} ～ {dataSources.dateCreationGoalEnd}
              </Col>
            </Space>
          )}
        </Form.Item>

        <Form.Item
          label={t('IDS_DIVISION_EVALUATION')}
          name="departmentEvaluation"
          className={isEdit ? '' : 'ant-form-item-info'}
        >
          {isEdit ? (
            <>
              <Space size={'small'}>
                <RangePicker
                  id="departmentEvaluation9"
                  allowClear={false}
                  // disabledDate={disabledDate}
                  locale={localeJa}
                  style={{ width: 250 }}
                  defaultValue={[
                    dataSources.dateEvaluationDepartmentStart
                      ? dayjs(dataSources.dateEvaluationDepartmentStart, dateFormat)
                      : null,
                    dataSources.dateEvaluationDepartmentEnd
                      ? dayjs(dataSources.dateEvaluationDepartmentEnd, dateFormat)
                      : null,
                  ]}
                  format={dateFormat}
                  onChange={(_values: any, formatString: [string, string]) => {
                    setDataSaves((state: EvaluationPeriod) => ({
                      ...state,
                      dateEvaluationDepartmentStart: formatString[0],
                      dateEvaluationDepartmentEnd: formatString[1],
                    }));
                  }}
                />
              </Space>
            </>
          ) : (
            <Space
              style={{
                display:
                  !isLoading && (dataSources.dateEvaluationDepartmentStart || dataSources.dateEvaluationStart)
                    ? 'inline-flex'
                    : 'none',
              }}
            >
              <Col style={{ width: '180px' }}>
                {dataSources.dateEvaluationDepartmentStart}
                {dataSources.dateEvaluationDepartmentStart && ' ～ '}
                {dataSources.dateEvaluationDepartmentEnd}
              </Col>
              <Col>
                <Dropdown
                  menu={{ items }}
                  trigger={['click']}
                  placement="topLeft"
                  autoAdjustOverflow
                  destroyPopupOnHide={true}
                >
                  <Button type="primary" onClick={() => setLevelType(8)}>
                    <a style={{ color: 'white' }}>
                      <Space>
                        {t('IDS_SEND_MAIL')}
                        <CaretUpOutlined />
                      </Space>
                    </a>
                  </Button>
                </Dropdown>
              </Col>
            </Space>
          )}
        </Form.Item>

        <Form.Item label={t('IDS_EVALUATION_PERSONAL')} name="personalEvaluation" className={'ant-form-item-info'}>
          {isEdit ? (
            <>
              <Space size={'small'}>
                <RangePicker
                  id="personalEvaluation13"
                  allowClear={false}
                  // disabledDate={disabledDate}
                  locale={localeJa}
                  style={{ width: 250 }}
                  defaultValue={[
                    dataSources.dateEvaluationStart ? dayjs(dataSources.dateEvaluationStart, dateFormat) : null,
                    dataSources.dateEvaluationEnd ? dayjs(dataSources.dateEvaluationEnd, dateFormat) : null,
                  ]}
                  format={dateFormat}
                  onChange={(_values: any, formatString: [string, string]) => {
                    setDataSaves((state: EvaluationPeriod) => ({
                      ...state,
                      dateEvaluationStart: formatString[0],
                      dateEvaluationEnd: formatString[1],
                    }));
                  }}
                />
              </Space>
            </>
          ) : (
            <Space
              size={'small'}
              style={{
                display:
                  !isLoading && (dataSources.dateEvaluationStart || dataSources.dateEvaluationEnd)
                    ? 'inline-flex'
                    : 'none',
              }}
            >
              <Col style={{ width: '180px' }}>
                {dataSources.dateEvaluationStart} ～ {dataSources.dateEvaluationEnd}
              </Col>
            </Space>
          )}
        </Form.Item>

        <div style={{ marginTop: 20 }}>
          {isEdit ? (
            <div>
              <Button
                className="button-normal"
                style={{ marginRight: 15 }}
                type="primary"
                size="middle"
                onClick={handleValidate}
                disabled={isLoading || isFixed}
                loading={isLoading}
              >
                {t('IDS_BUTTON_SAVE')}
              </Button>
              <Button
                className="cancel_button"
                size="middle"
                disabled={isLoading || isFixed}
                loading={isLoading}
                onClick={handleCancel}
              >
                {t('IDS_BUTTON_CANCEL')}
              </Button>
            </div>
          ) : (
            <Row>
              <Button
                className="button-normal"
                type="primary"
                size="middle"
                disabled={isLoading || isFixed}
                loading={isLoading}
                onClick={() => setIsEdit(true)}
              >
                {t('IDS_EDIT')}
              </Button>
            </Row>
          )}
        </div>
      </Form>
      <ModalCustomComponent
        isOpen={isOpenModal}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE')}
        fnHandleOk={handleSave}
        fnHandleCancel={handleOpenModal}
        okText={t('IDS_BUTTON_SAVE') as string}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        loading={isLoading}
      />
      <SendEmailScreen
        key={`type-send-mail:${type}`}
        isOpen={isOpenMail}
        handleClosePopup={handleClosePopup}
        type={type}
        toUserList={toEmailList}
        mailTitle={mailTitle}
        mailContent={mailContent}
        periodInfo={dataSources}
        levelType={levelType}
        isLoading={isLoading}
        setLoading={setLoading}
        i18n={i18n}
      />
    </div>
  );
};

export default ListCommonPeriod;
