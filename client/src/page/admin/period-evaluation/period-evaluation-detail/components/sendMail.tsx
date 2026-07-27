import { DashOutlined } from '@ant-design/icons';
import { Button, Cascader, DatePicker, Form, Input, Modal, Row, Typography, message } from 'antd';
import { css } from '@emotion/css';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { i18n, t } from 'i18next';
import moment from 'moment';
import { useEffect, useState } from 'react';
import localeJa from '../../../../../@core/locales/jaDatePick';
import { MainButton } from '../../../../../common/MainButton';
import evaluationPeriodServices from '../../../../../common/api/evaluationPeriod';
import { EvaluationPeriod, MailTemplate, MailToSend, ToMailList } from '../interfaces/interfacesProps';
import ShowMoreMailPopUp from './ShowMoreMailPopUp';
import ModalCustomComponent from '../../../../../@core/components/modal-custom';
import TextEditor from '../../../../../@core/components/text-editor/TextEditor';
import sunEditorSetting from '../../../../../@core/components/text-editor/setting';
import ShowMoreMailCCPopUp from './ShowMoreMailCCPopUp';
import { useAuth } from '../../../../../hooks/useAuth';

interface Props {
  isOpen: boolean;
  handleClosePopup: () => void;
  type: number;
  toUserList: ToMailList[];
  periodInfo: EvaluationPeriod;
  levelType: number;
  isLoading: boolean;
  setLoading: (data: boolean) => void;
  mailTitle: string;
  mailContent: string;
  dataMailCCs?: any;
  setDataMailCCs?: any;
  i18n: i18n;
}

const SendEmailScreen = (props: Props) => {
  const {
    isOpen,
    handleClosePopup,
    type,
    toUserList,
    periodInfo,
    levelType,
    isLoading,
    setLoading,
    mailContent,
    mailTitle,
    dataMailCCs,
    setDataMailCCs,
    i18n,
  } = props;
  const auth = useAuth();

  const [_form] = Form.useForm();

  const [contentLength, setContentLength] = useState<number>(-1);

  const dateFormat =
    i18n && i18n.language === 'ja' ? 'YYYY/M/D' : i18n && i18n.language === 'en' ? 'YYYY/D/M' : 'D/M/YYYY';

  const dateTimeFormat = 'YYYY/M/D H:mm';

  const [toMailList, setToUserList] = useState<string[]>(toUserList.map((user: ToMailList) => user.email));

  // const [dataSourceList, setDataSource] = useState<string[]>(toUserList.map((user: ToMailList) => user.email));

  const [sendTime, setSendTime] = useState('');

  const [isOpenMailList, setOpenMailList] = useState(false);

  const [isOpenPopUpConfirm, setIsOpenPopUpConfirm] = useState<boolean>(false);

  const [mailContentEditor, setMailContentEditor] = useState<string>(mailContent);

  const { user } = useAuth();

  const options: { label: string; value: string; key: string }[] = [];

  const defaultValueList: string[] = [];

  const defaultMail = user?.emailHR;

  toMailList.forEach((item: any) => {
    options.push({
      label: item,
      value: item,
      key: item,
    });
    defaultValueList.push(item.split(','));
  });
  const [dataSourceList, setDataSource] = useState<{ label: string; value: string; key: string }[]>(options);

  useEffect(() => {
    const options: { label: any; value: any; key: string }[] = [];
    const tempList = toUserList.map((user: ToMailList) => user.email);
    defaultMail && tempList.unshift(defaultMail);
    tempList.forEach((item: any) => {
      options.push({
        label: item,
        value: item,
        key: item,
      });
    });
    setToUserList(tempList);
    setDataSource(options);
  }, [isOpen]);

  useEffect(() => {
    setMailContentEditor(mailContent);
  }, [mailContent]);

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today AND not select day 6 months apart
    const timeZone = auth.user?.timeZone || 'Asia/Tokyo';
    const now = dayjs.tz(dayjs(), timeZone).startOf('day');
    const sixMonthsLater = dayjs.tz(dayjs(), timeZone).add(6, 'months').startOf('day');

    return current && (current < now || current > sixMonthsLater);
  };

  const callback = (res: any) => {
    if (res) {
      message.success(t('MESSAGE.COMMON.IDM_SEND_MAIL_SUCCESS'));
    }
  };

  const callbackSaveMail = (res: any) => {
    if (res) {
      message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
    }
  };

  const handleSubmit = (values: any) => {
    _form
      .validateFields()
      .then(async () => {
        setLoading(true);
        const actualTime = new Date();
        const saveDatas: MailTemplate = {
          evaluationPeriodId: periodInfo.id,
          status: type == 0 ? 1 : 0,
          type: levelType,
          sendTimeSetting: type == 1 ? sendTime : null,
          sendTimeActual: type == 0 ? moment(actualTime).format(dateTimeFormat) : null,
          title: values.subject,
          contentMail: mailContentEditor,
          mailTo: toMailList.join(','),
          mailToObjList: toMailList,
          dataMailCCs: dataMailCCs,
        };
        if (type == 0) {
          sendMailNow(saveDatas);
        } else {
          await evaluationPeriodServices.saveMailTemplate(saveDatas, callbackSaveMail, setLoading);
          onCancel();
        }
      })
      .catch((err: any) => {
        console.log(err);
        setLoading(false);
        onCancel();
      });
  };

  const sendMailNow = async (values: MailTemplate) => {
    const content: MailToSend = {
      toEmails: '',
      mailContent: {
        subject: '',
        editor: '',
      },
    };
    content.toEmails = toMailList.join(',');
    content.mailContent.editor = values.contentMail;
    content.mailContent.subject = values.title;
    await evaluationPeriodServices.sendMailNow(setLoading, content, values, callback, onCancel);
    setIsOpenPopUpConfirm(false);
  };

  const onCancel = () => {
    handleClosePopup();
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
    _form.setFieldsValue({ toMail: formValues });
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

  const { lengthLimit } = sunEditorSetting;

  return (
    <>
      <Modal
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        open={isOpen}
        title={<Typography.Title level={3}>{t('IDS_SEND_MAIL')}</Typography.Title>}
        width={1000}
        onCancel={onCancel}
        footer={null}
        destroyOnClose={true}
        maskClosable={false}
        centered
      >
        <Form
          form={_form}
          onFinish={handleSubmit}
          style={{ width: '100%' }}
          labelCol={{ span: 1 }}
          labelAlign="left"
          preserve={false}
          requiredMark={false}
          colon={false}
        >
          {type === 1 && (
            <Form.Item
              style={{ marginBottom: 10 }}
              name="date"
              label={t('IDS_MAIL_SETTING_TIME')}
              rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() }]}
              className={css`
                & .ant-form-item-explain-error {
                  margin-bottom: 10px;
                }
              `}
            >
              <DatePicker
                locale={localeJa}
                format={dateFormat}
                disabledDate={disabledDate}
                allowClear={false}
                size="large"
                onChange={(_values: any, dateString: string) => {
                  setSendTime(moment(dateString).format(dateFormat));
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
            style={{ marginBottom: 15 }}
            name="subject"
            label={t('IDS_MAIL_SUBJECT')}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: 200,
                message: (t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER') ?? '').replace('{maxLength}', '200'),
              },
            ]}
            initialValue={mailTitle}
            className={css`
              & .ant-form-item-explain-error {
                margin-bottom: 15px;
              }
            `}
          >
            <Input.TextArea autoSize style={{ width: '90%' }} maxLength={201} />
          </Form.Item>
          <TextEditor
            contentLength={contentLength}
            setContentLength={setContentLength}
            content={mailContent}
            setContent={setMailContentEditor}
          />
          <Row justify="start" align="middle" style={{ marginTop: '6px' }}>
            <Row>
              <MainButton
                type="primary"
                style={{ marginTop: 0 }}
                loading={isLoading}
                disabled={contentLength === 0 || contentLength > lengthLimit || toMailList.length < 1}
                onClick={() => {
                  if (type == 0) {
                    _form
                      .validateFields()
                      .then(async (status: any) => {
                        if (!status.errorFields) {
                          setIsOpenPopUpConfirm(true);
                        }
                      })
                      .catch((_errors) => {});
                  } else {
                    _form.submit();
                  }
                }}
              >
                {type == 0 ? t('IDS_BUTTON_SEND') : t('IDS_BUTTON_SAVE')}
              </MainButton>
              <Button
                style={{ marginLeft: 15, marginTop: 0 }}
                onClick={onCancel}
                className="cancel_button"
                loading={isLoading}
              >
                {t('IDS_BUTTON_CANCEL')}
              </Button>
            </Row>
          </Row>
          {/* Trường hợp mở popup mail bằng block setting ngày đặt mục tiêu/đánh giá */}
          {[7, 8].includes(levelType) && (
            <ShowMoreMailPopUp
              isOpenMailList={isOpenMailList}
              setOpenMailList={setOpenMailList}
              toUserList={toMailList}
              setToUserList={setToUserList}
              form={_form}
              isDisabled={false}
              dataSourceList={dataSourceList}
              setDataSource={setDataSource}
            />
          )}
        </Form>
      </Modal>
      {/* Trường hợp mở popup mail bằng block setting ngoại lệ */}
      {[5, 6].includes(levelType) && (
        <ShowMoreMailCCPopUp
          isOpenMailCCList={isOpenMailList}
          setOpenMailCCList={setOpenMailList}
          toUserList={toMailList}
          dataMailCCs={dataMailCCs}
          setDataMailCCs={setDataMailCCs}
          handleFormValue={handleFormValue}
          handleGetListUserAndEvaluatorsEmails={handleGetListUserAndEvaluatorsEmails}
        />
      )}
      <ModalCustomComponent
        isOpen={isOpenPopUpConfirm}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SEND_MAIL')}
        fnHandleOk={_form.submit}
        fnHandleCancel={() => setIsOpenPopUpConfirm(false)}
        okText={t('IDS_BUTTON_SEND') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />
    </>
  );
};

export default SendEmailScreen;
