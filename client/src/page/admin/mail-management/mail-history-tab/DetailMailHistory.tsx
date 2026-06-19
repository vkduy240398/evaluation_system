import { Button, Cascader, Col, DatePicker, Input, message, Modal, Row } from 'antd';
import { Form, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { DashOutlined } from '@ant-design/icons';
import { MailProperty, MailQuery } from '../interfaces/interfacesProps';
import { t } from 'i18next';
import sunEditorSetting from '../../../../@core/components/text-editor/setting';
import localeJa from '../../../../@core/locales/jaDatePick';
import mailManagementServices from '../../../../common/api/mailManagement';
import TextEditor from '../../../../@core/components/text-editor/TextEditor';
import ShowMoreMailPopUp from '../../period-evaluation/period-evaluation-detail/components/ShowMoreMailPopUp';
import ShowMoreMailCCPopUp from '../../period-evaluation/period-evaluation-detail/components/ShowMoreMailCCPopUp';
interface Props {
  recordInfo: MailProperty;
  state: MailQuery;
  conditions: any;
  handleSearchHistoryMail: (data: any) => void;
  isOpen: boolean;
  setOpen: () => void;
  handleClose: () => void;
  isLoading: boolean;
  setLoading: (data: boolean) => void;
  location: any;
  navigate: any;
  mailContent: string;
}

const TypeMailToCCs = [1, 3, 5, 6];

const DetailMailHistory: React.FC<any> = (props: Props) => {
  const {
    recordInfo,
    state,
    conditions,
    handleSearchHistoryMail,
    isOpen,
    handleClose,
    isLoading,
    setLoading,
    location,
    navigate,
    mailContent,
  } = props;
  const [form] = Form.useForm();
  const [isOpenMailList, setOpenMailList] = useState(false);
  const [titleEmail, setTitleEmail] = useState(recordInfo.title);
  const [contentLength, setContentLength] = useState<number>(-1);
  const [mailContentEditor, setMailContentEditor] = useState<string>(recordInfo.contentMail);
  const [isEditLoading, setEditLoading] = useState<boolean>(false);
  const [dataMailCCs, setDataMailCCs] = useState<{ id?: number; user: string; evaluators: string[] }[]>([]);

  // const location = useLocation();
  // const navigate = useNavigate();

  // const recordInfo = location.state.record;
  // const state = location.state.state;
  const dateFormat = 'YYYY/M/D';
  const [sendTime, setSendTime] = useState(recordInfo.sendTimeSetting);

  const options: { label: string; value: string; key: string }[] = [];
  const defaultValueList: string[] = [];

  const emails = [
    ...(recordInfo.mailTo ? recordInfo.mailTo.split(',') : []),
    ...(recordInfo.mailCC ? recordInfo.mailCC.split(',') : []),
  ];

  const uniqueEmails = Array.from(new Set(emails.map((email) => email.trim())));
  const [toUserList, setToUserList] = useState<string[]>(uniqueEmails);

  toUserList.forEach((item: any) => {
    options.push({
      label: item,
      value: item,
      key: item,
    });
    defaultValueList.push(item.split(','));
  });
  const [dataSourceList, setDataSource] = useState<{ label: any; value: any; key: string }[]>(options);

  const handleSuccess = () => {
    message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values: any) => {
        const updateValues = {
          contentMail: mailContentEditor || recordInfo.contentMail,
          title: values.title,
          sendTimeSetting: sendTime,
          mailTo: TypeMailToCCs.includes(recordInfo.typeNumber) ? recordInfo.mailTo : toUserList.join(','),
          mailCC:
            TypeMailToCCs.includes(recordInfo.typeNumber) && dataMailCCs?.length > 0
              ? dataMailCCs[0]?.evaluators.join(',')
              : recordInfo.mailCC,
        };

        await mailManagementServices.updateMailHistory(
          updateValues,
          recordInfo.id,
          setEditLoading,
          conditions,
          handleSuccess,
          handleCancel,
        );
        handleCancel();
        handleSearchHistoryMail({ ...conditions, year: dayjs(conditions.yearCalendar, 'YYYY').format('YYYY') });
      })
      .catch(() => {
        setLoading(false);

        // handleCancel();
      });
  };
  const handleCancel = () => {
    handleClose();
  };

  const buttonShowMore = () => {
    return (
      <>
        <Button style={{ marginLeft: '5px', marginTop: '2px' }} onClick={() => setOpenMailList(true)}>
          <DashOutlined />
        </Button>
      </>
    );
  };
  const { lengthLimit } = sunEditorSetting;
  useEffect(() => {
    const tempList = (() => {
      // Tách địa chỉ email từ mailTo
      const mailToList = recordInfo.mailTo ? recordInfo.mailTo.split(',') : [];

      // Tách địa chỉ email từ mailCC
      const mailCCList = recordInfo.mailCC ? recordInfo.mailCC.split(',') : [];

      // Kết hợp cả hai mảng và loại bỏ các giá trị trùng lặp
      return Array.from(new Set([...mailToList, ...mailCCList]));
    })();
    const options: { label: any; value: any; key: string }[] = [];

    // tempList.unshift(defaultMail);
    tempList.forEach((item: any) => {
      options.push({
        label: item,
        value: item,
        key: item,
      });
    });

    setToUserList(tempList);
    setDataSource(options);

    if (TypeMailToCCs.includes(recordInfo.typeNumber)) {
      const dataMails = [
        {
          id: recordInfo?.id,
          user: recordInfo?.mailTo,
          evaluators: recordInfo?.mailCC?.split(',').filter((email) => email !== undefined) || [],
        },
      ];
      setDataMailCCs(dataMails);
    }
  }, [isOpen]);

  useEffect(() => {
    form.setFieldValue('title', recordInfo.title);
  }, []);

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

  return (
    <div>
      <Modal
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        open={isOpen}
        title={<Typography.Title level={3}>{t('IDS_DETAIL_MAIL_HISTORY')}</Typography.Title>}
        width={1000}
        onCancel={handleClose}
        footer={null}
        destroyOnClose={true}
        maskClosable={false}
        centered
      >
        <Form
          form={form}
          colon={false}
          requiredMark={false}
          labelCol={{ span: 1 }}
          style={{ width: '100%' }}
          labelAlign="left"
          onFinish={handleSubmit}
          preserve={false}
        >
          {recordInfo.typeNumber == 2 && (
            <div>
              <Form.Item label={t('IDS_GOAL_DEPARTMENT')} name="departmentGoal" style={{ marginBottom: 10 }}>
                <Typography style={{ width: 700 }}>{recordInfo.evaluationDepartmentTime}</Typography>
              </Form.Item>
              <Form.Item label={t('IDS_ACHIEVEMENT_PERSONAL')} name="personalGoal" style={{ marginBottom: 10 }}>
                <Typography style={{ width: 700 }}>{recordInfo.evaluationTime}</Typography>
              </Form.Item>
            </div>
          )}
          {recordInfo.typeNumber == 4 && (
            <div>
              <Form.Item label={t('IDS_DIVISION_EVALUATION')} name="departmentEvaluation" style={{ marginBottom: 10 }}>
                <Typography style={{ width: 700 }}>{recordInfo.evaluationDepartmentTime}</Typography>
              </Form.Item>
              <Form.Item label={t('IDS_EVALUATION_PERSONAL')} name="personalEvaluation" style={{ marginBottom: 10 }}>
                <Typography style={{ width: 700 }}>{recordInfo.evaluationTime}</Typography>
              </Form.Item>
            </div>
          )}
          <Form.Item
            label={t('IDS_CLASSIFICATION')}
            name="type"
            initialValue={recordInfo.type}
            style={{ marginBottom: 10 }}
            rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() }]}
          >
            <Input style={{ width: '90%', height: 32 }} disabled />
          </Form.Item>
          {recordInfo.sendTimeSetting && (
            <Form.Item
              label={t('IDS_MAIL_SETTING_TIME')}
              name="time"
              style={{ marginBottom: 10 }}
              initialValue={dayjs(recordInfo.sendTimeSetting, dateFormat)}
            >
              <DatePicker
                locale={localeJa}
                format={dateFormat}
                allowClear={false}
                size="large"
                onChange={(_values: any, dateString: string) => {
                  setSendTime(moment(dateString).format(dateFormat));
                }}
                disabled={recordInfo.status === 1}
                disabledDate={(current) => {
                  return dayjs().add(0, 'days') >= current;
                }}
              />
            </Form.Item>
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
            label={t('IDS_MAIL_SUBJECT')}
            name="title"
            className="ant-form-item-info"
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: 200,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '200'),
              },
            ]}
          >
            <Input.TextArea
              autoSize
              style={{ width: '90%' }}
              onChange={(evt) => {
                setTitleEmail(evt.target.value);
              }}
              disabled={recordInfo.status === 1}
              maxLength={201}
            />
          </Form.Item>
          <Col style={{ width: 1000, margin: '10px 0 5px 0' }}>
            {/* cos dung readonly */}
            <TextEditor
              contentLength={contentLength}
              setContentLength={setContentLength}
              content={mailContent}
              setContent={setMailContentEditor}
              isReadonly={recordInfo.status === 1}
            />
          </Col>
          <Row style={{ marginTop: 5 }}>
            <Button
              onClick={handleSubmit}
              type="primary"
              className="button-normal"
              style={{ marginRight: 15 }}
              size="middle"
              disabled={
                recordInfo.status === 1 ||
                contentLength === 0 ||
                contentLength > lengthLimit ||
                toUserList.length < 1 ||
                titleEmail.length === 0
              }
              loading={isEditLoading}
            >
              {t('IDS_BUTTON_SAVE')}
            </Button>
            <Button className="cancel_button" size="middle" onClick={handleClose} loading={isEditLoading}>
              {t('IDS_BUTTON_CANCEL')}
            </Button>
          </Row>
          {TypeMailToCCs.includes(recordInfo.typeNumber) ? (
            <ShowMoreMailCCPopUp
              isOpenMailCCList={isOpenMailList}
              setOpenMailCCList={setOpenMailList}
              toUserList={toUserList}
              dataMailCCs={dataMailCCs}
              setDataMailCCs={setDataMailCCs}
              handleFormValue={handleFormValue}
              handleGetListUserAndEvaluatorsEmails={handleGetListUserAndEvaluatorsEmails}
              isDisabled={recordInfo.status === 1}
            />
          ) : (
            <ShowMoreMailPopUp
              isOpenMailList={isOpenMailList}
              setOpenMailList={setOpenMailList}
              toUserList={toUserList}
              setToUserList={setToUserList}
              form={form}
              isDisabled={recordInfo.status === 1}
              dataSourceList={dataSourceList}
              setDataSource={setDataSource}
            />
          )}
        </Form>
      </Modal>
    </div>
  );
};
export default DetailMailHistory;
