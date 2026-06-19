import { Button, Cascader, Col, DatePicker, Input, Modal, Row } from 'antd';
import { Form, Typography } from 'antd';
import localeJa from '../../../../../@core/locales/jaDatePick';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import evaluationPeriodServices from '../../../../../common/api/evaluationPeriod';
import moment from 'moment';
import { DashOutlined } from '@ant-design/icons';
import ShowMoreMailPopUp from './ShowMoreMailPopUp';
import { MailProperty, MailQuery } from '../interfaces/interfacesProps';
import { i18n, t } from 'i18next';
import TextEditor from '../../../../../@core/components/text-editor/TextEditor';
import sunEditorSetting from '../../../../../@core/components/text-editor/setting';
interface Props {
  recordInfo: MailProperty;
  state: MailQuery;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClose: () => void;
  isLoading: boolean;
  setLoading: (data: boolean) => void;
  location: any;
  navigate: any;
  mailContent: string;
  i18n: i18n;
}
const DetailMailHistory: React.FC<Props> = (props: Props) => {
  const { recordInfo, state, isOpen, handleClose, isLoading, setLoading, location, navigate, mailContent, i18n } =
    props;
  const [form] = Form.useForm();
  const [isOpenMailList, setOpenMailList] = useState(false);
  const [contentLength, setContentLength] = useState<number>(-1);
  const [mailContentEditor, setMailContentEditor] = useState<string>(mailContent);

  // const location = useLocation();
  // const navigate = useNavigate();

  // const recordInfo = location.state.record;
  // const state = location.state.state;
  const dateFormat = 'YYYY/M/D';
  const [sendTime, setSendTime] = useState(recordInfo.sendTimeSetting);

  const options: { label: string; value: string; key: string }[] = [];
  const defaultValueList: string[] = [];

  const [toUserList, setToUserList] = useState<string[]>(recordInfo.mailTo ? recordInfo.mailTo.split(',') : []);

  const defaultMail = 'gnw-legal@geonet.co.jp';

  toUserList.forEach((item: any) => {
    options.push({
      label: item,
      value: item,
      key: item,
    });
    defaultValueList.push(item.split(','));
  });
  const [dataSourceList, setDataSource] = useState<{ label: any; value: any; key: string }[]>(options);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values: any) => {
        const updateValues = {
          contentMail: mailContentEditor,
          title: values.title,
          sendTimeSetting: sendTime,
          mailTo: toUserList.join(','),
        };
        await evaluationPeriodServices.updateMailHistory(updateValues, recordInfo.id, setLoading);
        await navigate(location.pathname, {
          replace: true,
          state: {
            type: state.type,
            title: state.title,
            year: state.year,
            periodIndex: state.periodIndex,
            isOpenTabException: state.isOpenTabException,
            goals810Time: state?.goals810Time,
            goals17Time: state?.goals17Time,
            offset: state.offset,
            current: state.current,
            limit: 20,
            periodId: state.periodId,
          } as MailQuery,
        });
        handleCancel();
      })
      .catch(() => {
        setLoading(false);
        handleCancel();
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
    const tempList = recordInfo.mailTo ? recordInfo.mailTo.split(',') : [];
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
  }, [isOpen]);

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
            initialValue={recordInfo.title}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: 200,
                message: (t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER') ?? '').replace('{maxLength}', '200'),
              },
            ]}
          >
            <Input.TextArea autoSize style={{ width: '90%' }} disabled={recordInfo.status === 1} maxLength={201} />
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
                recordInfo.status === 1 || contentLength === 0 || contentLength > lengthLimit || toUserList.length < 1
              }
              loading={isLoading}
            >
              {t('IDS_BUTTON_SAVE')}
            </Button>
            <Button className="cancel_button" size="middle" onClick={handleClose} loading={isLoading}>
              {t('IDS_BUTTON_CANCEL')}
            </Button>
          </Row>
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
        </Form>
      </Modal>
    </div>
  );
};
export default DetailMailHistory;
