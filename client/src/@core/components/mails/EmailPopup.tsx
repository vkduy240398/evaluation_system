import EmailEditor from './EmailEditor';
import ModalCustomComponent from '../modal-custom';

// ** Antd Imports
import Card from 'antd/es/card';
import DatePicker from 'antd/es/date-picker';
import { useForm } from 'antd/es/form/Form';

import localeJa from '../../locales/jaDatePick';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import { t } from 'i18next';

interface Props {
  header: string;
  isOpen: boolean;
  toggleOpen: () => void;
  handleSentEmail?: (props: { calendar: any; to: any; subject: string; content: string }) => void;
  popupWidth?: any;
}

const { Item } = Form;
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { xl: 4, lg: 6, md: 8, sm: 12, xs: 24 },
};
const EmailPopup = (props: Props) => {
  // ** Props
  const { header, isOpen, toggleOpen, popupWidth, handleSentEmail } = props;

  // ** Hook
  const [form] = useForm();

  // ** Var
  const dateFormat = 'YYYY/M/D';

  // ** Functional
  const onFinish = () => {
    form.validateFields().then((values) => {
      handleSentEmail && handleSentEmail(values);
    });
  };

  // ** Render
  const contentRender = () => (
    <Card>
      <Form
        {...layout}
        form={form}
        initialValues={{ companyId: -1, departmentId: -1 }}
        labelAlign="left"
        colon={false}
        requiredMark={false}
        onFinish={onFinish}
        labelCol={{ span: 1 }}
      >
        <Item label="Calendar" name="calendar">
          <DatePicker locale={localeJa} format={dateFormat} allowClear={false} />
        </Item>

        <Item label="To" name="to">
          <Input.TextArea autoSize disabled />
        </Item>

        <Item label="Subject" name="subject">
          <Input />
        </Item>
        <Item
          name="content"
          rules={[
            {
              validator(__, value) {
                if (
                  value === '<p><br></p>' ||
                  value === '<p style="text-align: center;"><br></p>' ||
                  value === '<p style="text-align: right;"><br></p>' ||
                  value === '<p style="text-align: justify;"><br></p>'
                ) {
                  return Promise.reject(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString());
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <EmailEditor />
        </Item>
      </Form>
    </Card>
  );

  const _propsModal = {
    title: header,
    onCancel: toggleOpen,
    with: popupWidth,
    open: isOpen,
    centered: true,
    closable: false,
    maskClosable: false,
  };

  return (
    <ModalCustomComponent
      isOpen={isOpen}
      header={header}
      content={contentRender()}
      fnHandleOk={onFinish}
      fnHandleCancel={toggleOpen}
      bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
      key={'email-popup-key'}
      okText={t('IDS_BUTTON_SUBMIT') as string}
    />
  );
};

export default EmailPopup;
