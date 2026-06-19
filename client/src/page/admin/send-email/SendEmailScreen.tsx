/* eslint-disable prefer-const */
import { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Typography, DatePicker, message, Row, Cascader } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import AdminEvaluationApiService from '../../../common/api/adminEvaluation';
import localeJa from '../../../@core/locales/jaDatePick';
import ShowMoreMailPopUp from '../period-evaluation/period-evaluation-detail/components/ShowMoreMailPopUp';
import { DashOutlined } from '@ant-design/icons';
import moment from 'moment';
import { RangePickerProps } from 'antd/es/date-picker';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import TextEditor from '../../../@core/components/text-editor/TextEditor';
import sunEditorSetting from '../../../@core/components/text-editor/setting';
import { TemplateMailId } from './TemplateMailId';
import ShowMoreMailCCPopUp from '../period-evaluation/period-evaluation-detail/components/ShowMoreMailCCPopUp';
import { useAuth } from '../../../hooks/useAuth';
const { RangePicker } = DatePicker;

type TypeSendMailReceiver =
  | 'userAndEvaluator'
  | 'userAndEvaluatorWithoutTime'
  | 'evaluatorWithoutTime'
  | 'evaluatorWithoutTimeStatus'
  | undefined;
type TypeFixed = 'fixedEvaluation' | 'fixedGoal';

interface RowData {
  id: number[];
  userName: string[];
  evaluatorName: string;
  userEmails: string[];
  evaluatorEmails: Set<string>;
  status: number;
  evaluationPeriodId: number;
  type: TypeFixed;
  userAndEvaluator: {
    user: string;
    evaluators: string[];
  }[];
}

interface Period {
  id: number;
  year: 'string';
  periodIndex: number;
  checkFixed: number;
  dateCreationGoalDepartmentEnd: string;
  dateCreationGoalDepartmentStart: string;
  dateCreationGoalEnd: string; // "2024/5/22"
  dateCreationGoalStart: string;
  dateEvaluationDepartmentEnd: string;
  dateEvaluationDepartmentStart: string;
  dateEvaluationEnd: string;
  dateEvaluationStart: string;
}

interface Props {
  isOpen: boolean;
  handleClosePopup: any;
  rowData: RowData;
  type: TypeSendMailReceiver;
  isChangeTime: boolean;
  period: Period;
  handleSearch: any;
  setSelectRows: any;
  emailEmployeeMap: Record<string, string>;
}

const SendEmailScreen = (props: Props) => {
  const { isOpen, handleClosePopup, rowData, type, isChangeTime, period, setSelectRows, emailEmployeeMap } = props;
  const [form] = Form.useForm();
  const { lengthLimit } = sunEditorSetting;
  const listKeywords = ['{{detailUrl}}', '{{userName}}', '{{divisionName}}', '{{level}}'];
  const dateGoals = [
    dayjs(
      moment(rowData.type === 'fixedGoal' ? period.dateCreationGoalStart : period.dateEvaluationStart).format(
        'YYYY-MM-DD',
      ),
      'YYYY-MM-DD',
    ),
    dayjs(
      moment(rowData.type === 'fixedGoal' ? period.dateCreationGoalEnd : period.dateEvaluationEnd).format('YYYY-MM-DD'),
      'YYYY-MM-DD',
    ).isBefore(dayjs().endOf('day'))
      ? dayjs(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')
      : dayjs(
          moment(rowData.type === 'fixedGoal' ? period.dateCreationGoalEnd : period.dateEvaluationEnd).format(
            'YYYY-MM-DD',
          ),
          'YYYY-MM-DD',
        ),
  ];

  const dateDepartments = [
    dayjs(
      moment(
        rowData.type === 'fixedGoal' ? period.dateCreationGoalDepartmentStart : period.dateEvaluationDepartmentStart,
      ).format('YYYY-MM-DD'),
      'YYYY-MM-DD',
    ),
    dayjs(
      moment(
        rowData.type === 'fixedGoal' ? period.dateCreationGoalDepartmentEnd : period.dateEvaluationDepartmentEnd,
      ).format('YYYY-MM-DD'),
      'YYYY-MM-DD',
    ).isBefore(dayjs().endOf('day'))
      ? dayjs(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')
      : dayjs(
          moment(
            rowData.type === 'fixedGoal' ? period.dateCreationGoalDepartmentEnd : period.dateEvaluationDepartmentEnd,
          ).format('YYYY-MM-DD'),
          'YYYY-MM-DD',
        ),
  ];

  const [contentLength, setContentLength] = useState<number>(-1);
  const [emailType, setEmailType] = useState<number>(0);
  const [goalEvaluationTimes, setGoalEvaluationTimes] = useState<string[]>([]);
  const [goalDepartmentEvaluationTimes, setGoalDepartmentEvaluationTimes] = useState<string[]>([]);
  const [isOpenPopUpConfirm, setIsOpenPopUpConfirm] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);
  const [isOpenMailList, setOpenMailList] = useState(false);
  const [isOpenMailCCList, setOpenMailCCList] = useState(false);
  const [isDepartmentSaved, setIsDepartmentSaved] = useState<boolean>(false);
  const [isPersonalSaved, setIsPersonalSaved] = useState<boolean>(false);
  const [toUserList, setToUserList] = useState<string[]>([]);
  const [dataMailCCs, setDataMailCCs] = useState<{ id?: number; user: string; evaluators: string[] }[]>([]);
  const [mailContent, setMailContent] = useState<string>('メッセージの内容を読み込んでいます...');
  const [content, setContent] = useState<string>('');
  const { user } = useAuth();

  const options: { label: string; value: string; key: string }[] = [];
  const defaultValueList: string[] = [];

  toUserList.forEach((item: any) => {
    options.push({
      label: item,
      value: item,
      key: item,
    });
    defaultValueList.push(item.split(','));
  });
  const [dataSourceList, setDataSource] = useState<{ label: string; value: string; key: string }[]>(options);
  const defaultMail = user?.emailHR;

  const callback = (res: any) => {
    if (res) {
      message.success(t('MESSAGE.COMMON.IDM_SEND_MAIL_SUCCESS'));

      // handleSearch();
    }
  };
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return (
      (current &&
        current <
          dayjs(
            moment(rowData.type === 'fixedGoal' ? period.dateCreationGoalEnd : period.dateEvaluationEnd).format(
              'YYYY-MM-DD',
            ),
          )) ||
      current < dayjs().endOf('day')
    );
  };
  const disabledDateDepartment: RangePickerProps['disabledDate'] = (current) => {
    return (
      (current &&
        current <
          dayjs(
            moment(
              rowData.type === 'fixedGoal' ? period.dateCreationGoalDepartmentEnd : period.dateEvaluationDepartmentEnd,
            ).format('YYYY-MM-DD'),
          )) ||
      current < dayjs().endOf('day')
    );
  };

  const isFilterStatus = type === 'evaluatorWithoutTimeStatus';

  const handleSubmit = async (val: any) => {
    await AdminEvaluationApiService.sendEmailFixedGoal(
      toUserList,
      { ...val, editor: content },
      emailType,
      rowData.status,
      rowData.evaluationPeriodId,
      goalEvaluationTimes,
      goalDepartmentEvaluationTimes,
      rowData.id,
      rowData.type,
      dataMailCCs,
      callback,
      setLoading,
      handleClosePopup,
      isFilterStatus,
    );
    setIsOpenPopUpConfirm(false);
    setSelectRows([]);
    if (type === 'userAndEvaluator') {
      setIsDepartmentSaved(true);
      setIsPersonalSaved(true);
    }
  };

  const handleFormValue = (data: string[]) => {
    const toList: string[] = data ? data : [];
    const options: { label: string; value: string; key: string }[] = [];
    const formValues: string[] = [];
    toList.forEach((item: any) => {
      formValues.push(item.split(','));
      options.push({
        label: item,
        value: item,
        key: item,
      });
    });
    form.setFieldsValue({ toMail: formValues });
    setToUserList(toList);
    setDataSource(options);
  };

  const handleGetListUserAndEvaluatorsEmails = (data: { user: string; evaluators: string[] }[]): string[] => {
    let userAndEvaluatorEmails: string[] = [];
    data.forEach((item: any) => {
      userAndEvaluatorEmails = [...userAndEvaluatorEmails, item.user, ...item.evaluators];
    });

    return userAndEvaluatorEmails;
  };

  // const handleUserAndEvaluatorMailValue = (user: any, evaluator: any) => {
  //   const temp = {
  //     toUser: user[0],
  //     evaluator: evaluator,
  //   };
  //   setDataMailCCs([]);
  // };

  const buttonShowMore = () => {
    return (
      <>
        <Button
          style={{ marginLeft: '5px', marginTop: '2px' }}
          onClick={() => {
            if (type === 'userAndEvaluatorWithoutTime') setOpenMailCCList(true);
            else setOpenMailList(true);
          }}
        >
          <DashOutlined />
        </Button>
      </>
    );
  };

  useEffect(() => {
    if (isOpen) {
      setToUserList([]);
      setMailContent('');
      form.setFieldValue('subject', '');
      setDataSource([]);
      loadDataMail();

      if (type === 'userAndEvaluatorWithoutTime') {
        const userAndEvaluatorEmails = handleGetListUserAndEvaluatorsEmails(rowData.userAndEvaluator);
        handleFormValue(Array.from(new Set([...(defaultMail ? [defaultMail] : []), ...userAndEvaluatorEmails])));

        // Thêm defaultMail vào mỗi evaluators (nếu chưa có)
        const updatedUserAndEvaluators = rowData.userAndEvaluator.map((item) => {
          const evaluators =
            defaultMail && !item.evaluators.includes(defaultMail)
              ? [...item.evaluators, defaultMail] // thêm vào cuối nếu chưa có
              : [...item.evaluators]; // giữ nguyên nếu đã có

          return {
            ...item,
            evaluators,
          };
        });
        console.log(updatedUserAndEvaluators);

        setDataMailCCs(updatedUserAndEvaluators);
      } else if (type === 'evaluatorWithoutTime') {
        handleFormValue(Array.from(new Set([...(defaultMail ? [defaultMail] : []), ...rowData.evaluatorEmails])));
      } else if (type === 'evaluatorWithoutTimeStatus') {
        handleFormValue(Array.from(new Set([...(defaultMail ? [defaultMail] : []), ...rowData.evaluatorEmails])));
      } else {
        handleFormValue(
          Array.from(
            new Set([...(defaultMail ? [defaultMail] : []), ...rowData.userEmails, ...rowData.evaluatorEmails]),
          ),
        );
      }
      form.validateFields(['subject']);
    }
  }, [rowData, type, isOpen]);

  const callBack = (data: { content: string; title: string }) => {
    setMailContent(data.content);
    form.setFieldValue('subject', data.title);
  };

  // const extractContentAfterCC = (text: string) => {
  //   const ccIndex =
  //     text.indexOf('CC：') !== -1
  //       ? text.indexOf('CC：')
  //       : text.indexOf('CC:') !== -1
  //       ? text.indexOf('CC:')
  //       : text.indexOf('CC :');
  //   if (ccIndex === -1) {
  //     return text; // Không tìm thấy "CC:", trả về nguyên văn
  //   }
  //   const contentAfterCC = text.slice(ccIndex + (text.indexOf('CC :') !== -1 ? 4 : 3)).trim();
  //   const endOfCCIndex = contentAfterCC.indexOf('<br>');
  //   if (endOfCCIndex === -1) {
  //     return contentAfterCC; // Không tìm thấy "<br>", trả về nội dung sau "CC:"
  //   }

  //   return contentAfterCC
  //     .slice(endOfCCIndex + 4)
  //     .replace(/^<br>\s*/, '')
  //     .trim(); // Lấy nội dung sau "<br>"
  // };

  // const extractContentBeforeCC = (text: string) => {
  //   const ccIndex =
  //     text.indexOf('CC：') !== -1
  //       ? text.indexOf('CC：')
  //       : text.indexOf('CC:') !== -1
  //       ? text.indexOf('CC:')
  //       : text.indexOf('CC :');
  //   if (ccIndex === -1) {
  //     return '';
  //   }

  //   const newlineIndex = text.indexOf('<br>', ccIndex);
  //   if (newlineIndex === -1) {
  //     return text.slice(0, ccIndex + 4).trim();
  //   }

  //   return text.slice(0, newlineIndex).trim();
  // };

  const loadDataMail = async () => {
    if (rowData.type === 'fixedGoal') {
      if (type === 'userAndEvaluatorWithoutTime') {
        //id = 5
        await AdminEvaluationApiService.getMailTemplateFixed(
          callBack,
          TemplateMailId.GOAL_USER_AND_EVALUATOR_WITHOUT_TIME,
          period.id,
        );
        setEmailType(1);
      } else if (type === 'evaluatorWithoutTime' || type === 'evaluatorWithoutTimeStatus') {
        //id = 6
        await AdminEvaluationApiService.getMailTemplateFixed(
          callBack,
          TemplateMailId.GOAL_EVALUATOR_WITHOUT_TIME,
          period.id,
          rowData?.id?.length === 1 ? rowData?.id[0] : 0,
        );
        setEmailType(9);
      } else if (type === 'userAndEvaluator') {
        //id = 7
        await AdminEvaluationApiService.getMailTemplateFixed(
          callBack,
          TemplateMailId.GOAL_USER_AND_EVALUATOR,
          period.id,
        );
        setEmailType(2);
      }
    } else {
      if (type === 'userAndEvaluatorWithoutTime') {
        //id = 8
        await AdminEvaluationApiService.getMailTemplateFixed(
          callBack,
          TemplateMailId.EVALUATION_USER_AND_EVALUATOR_WITHOUT_TIME,
          period.id,
        );
        setEmailType(3);
      } else if (type === 'evaluatorWithoutTime' || type === 'evaluatorWithoutTimeStatus') {
        //id = 9
        await AdminEvaluationApiService.getMailTemplateFixed(
          callBack,
          TemplateMailId.EVALUATION_EVALUATOR_WITHOUT_TIME,
          period.id,
          rowData?.id?.length === 1 ? rowData?.id[0] : 0,
        );
        setEmailType(10);
      } else if (type === 'userAndEvaluator') {
        //id = 10
        await AdminEvaluationApiService.getMailTemplateFixed(
          callBack,
          TemplateMailId.EVALUATION_USER_AND_EVALUATOR,
          period.id,
        );
        setEmailType(4);
      }
    }
  };

  useEffect(() => {
    setGoalEvaluationTimes([dateGoals[0].format('YYYY/M/D'), dateGoals[1].format('YYYY/M/D')]);
    setGoalDepartmentEvaluationTimes([dateDepartments[0].format('YYYY/M/D'), dateDepartments[1].format('YYYY/M/D')]);
    setIsDepartmentSaved(goalDepartmentEvaluationTimes[0] !== 'Invalid Date' ? true : false);
    setIsPersonalSaved(goalEvaluationTimes[0] !== 'Invalid Date' ? true : false);
  }, [period]);

  useEffect(() => {
    setContent(mailContent);
  }, [mailContent]);

  return (
    <>
      <Modal
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        open={isOpen}
        title={<Typography.Title level={3}>{t('IDS_SEND_MAIL')}</Typography.Title>}
        onCancel={handleClosePopup}
        width={1000}
        centered
        footer={null}
        destroyOnClose={true}
        maskClosable={false}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          style={{ width: '100%' }}
          labelCol={{ span: 1 }}
          labelAlign="left"
          requiredMark={false}
          colon={false}
        >
          {isChangeTime && (
            <>
              <Form.Item
                name="dateDepartment"
                label={rowData.type === 'fixedGoal' ? t('IDS_GOAL_DEPARTMENT') : t('IDS_DIVISION_EVALUATION')}
                initialValue={
                  (rowData.type === 'fixedGoal' &&
                    period.dateCreationGoalDepartmentStart &&
                    period.dateCreationGoalDepartmentEnd) ||
                  (rowData.type === 'fixedEvaluation' &&
                    period.dateEvaluationDepartmentStart &&
                    period.dateEvaluationDepartmentEnd)
                    ? [dayjs(goalDepartmentEvaluationTimes[0]), dayjs(goalDepartmentEvaluationTimes[1])]
                    : ''
                }
                rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() }]}
              >
                <RangePicker
                  locale={localeJa}
                  format={'YYYY/M/D'}
                  onCalendarChange={(_, date) => setGoalDepartmentEvaluationTimes(date)}
                  disabled={[isDepartmentSaved ? true : false, false]}
                  disabledDate={disabledDateDepartment}
                  allowClear={false}
                />
              </Form.Item>
              <Form.Item
                name="date"
                label={rowData.type === 'fixedGoal' ? t('IDS_ACHIEVEMENT_PERSONAL') : t('IDS_EVALUATION_PERSONAL')}
                initialValue={
                  (rowData.type === 'fixedGoal' && period.dateCreationGoalStart && period.dateCreationGoalEnd) ||
                  (rowData.type === 'fixedEvaluation' && period.dateEvaluationStart && period.dateEvaluationEnd)
                    ? [dayjs(goalEvaluationTimes[0]), dayjs(goalEvaluationTimes[1])]
                    : ''
                }
                rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() }]}
              >
                <RangePicker
                  locale={localeJa}
                  format={'YYYY/M/D'}
                  onCalendarChange={(_, date) => setGoalEvaluationTimes(date)}
                  disabled={[isPersonalSaved ? true : false, false]}
                  disabledDate={disabledDate}
                  allowClear={false}
                />
              </Form.Item>
            </>
          )}
          <Row>
            <Form.Item
              name="toMail"
              label={t('IDS_MAIL_TO')}
              style={{ marginBottom: 10, width: '90%' }}
              initialValue={defaultValueList}
            >
              <Cascader options={options} multiple disabled maxTagCount="responsive" value={defaultValueList} />
            </Form.Item>
            {buttonShowMore()}
          </Row>
          <Form.Item
            style={{ marginBottom: 10 }}
            name="subject"
            label={t('IDS_MAIL_SUBJECT')}
            colon={false}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: 200,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '200'),
              },
            ]}
          >
            <Input.TextArea autoSize style={{ width: '90%' }} maxLength={201} />
          </Form.Item>
          <TextEditor
            contentLength={contentLength}
            setContentLength={setContentLength}
            content={mailContent}
            setContent={setContent}
          />
          {rowData.id?.length > 1 && listKeywords.some((s) => mailContent?.includes(s)) ? (
            <Typography style={{ color: 'red', fontSize: 12 }}>
              {t('MESSAGE.COMMON.IDM_NOTE_NOT_DELETE_KEYWORD')}
            </Typography>
          ) : (
            <></>
          )}
          <Row style={{ marginTop: 10 }}>
            <Button
              key="submit"
              type="primary"
              style={{ marginRight: 15, marginTop: 0 }}
              onClick={() => {
                form
                  .validateFields()
                  .then(async (status: any) => {
                    if (!status.errorFields) {
                      setIsOpenPopUpConfirm(true);
                    }
                  })
                  .catch((_errors) => {
                    // console.log(errors);
                  });
              }}
              disabled={contentLength === 0 || contentLength > lengthLimit}
            >
              {t('IDS_BUTTON_SEND')}
            </Button>
            <Button key="back" className="cancel_button" onClick={handleClosePopup}>
              {t('IDS_BUTTON_CANCEL')}
            </Button>
          </Row>
        </Form>
      </Modal>
      <ShowMoreMailPopUp
        isOpenMailList={isOpenMailList}
        setOpenMailList={setOpenMailList}
        toUserList={toUserList}
        setToUserList={setToUserList}
        form={form}
        isDisabled={type === 'evaluatorWithoutTime' || type === 'evaluatorWithoutTimeStatus'}
        dataSourceList={dataSourceList}
        setDataSource={setDataSource}
      />
      <ShowMoreMailCCPopUp
        isOpenMailCCList={isOpenMailCCList}
        setOpenMailCCList={setOpenMailCCList}
        toUserList={toUserList}
        dataMailCCs={dataMailCCs}
        setDataMailCCs={setDataMailCCs}
        handleFormValue={handleFormValue}
        handleGetListUserAndEvaluatorsEmails={handleGetListUserAndEvaluatorsEmails}
        emailEmployeeMap={emailEmployeeMap}
      />
      <ModalCustomComponent
        isOpen={isOpenPopUpConfirm}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SEND_MAIL')}
        fnHandleOk={form.submit}
        fnHandleCancel={() => setIsOpenPopUpConfirm(false)}
        okText={t('IDS_BUTTON_SEND') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />
    </>
  );
};

export default SendEmailScreen;
