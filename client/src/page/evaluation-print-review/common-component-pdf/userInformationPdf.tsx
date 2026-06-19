import React from 'react';
import { Typography, Form } from 'antd';
import { t } from 'i18next';

interface Props {
  item: any;
}

const UserInformationPdf: React.FC<Props> = (props: Props) => {
  const { item } = props;

  return (
    <div>
      <Form
        name="create_template_form"
        colon={false}
        requiredMark={false}
        labelCol={{ span: 0 }}
        style={{ width: '100%' }}
        labelAlign="left"
      >
        <Form.Item label={t('IDS_FULLNAME') + ': '} className="ant-form-item-info">
          <Typography.Text>{item?.header?.fullName}</Typography.Text>
        </Form.Item>
        <Form.Item label={t('IDS_EMPLOYEE') + ': '} className="ant-form-item-info">
          <Typography.Text>{item?.header?.employeeNumber}</Typography.Text>
        </Form.Item>
        <Form.Item label={t('IDS_COMPANY') + ': '} className="ant-form-item-info">
          <Typography.Text>{item?.header?.companyName}</Typography.Text>
        </Form.Item>
        <Form.Item label={t('IDS_DEPARTMENT') + ': '} className="ant-form-item-info">
          <Typography.Text>{item?.header?.department}</Typography.Text>
        </Form.Item>
        <Form.Item label={t('IDS_EVALUATOR') + ': '} className="ant-form-item-info">
          <Typography.Text>{item?.header?.evaluator}</Typography.Text>
        </Form.Item>
        <Form.Item label={t('IDS_EVALUATION_PERIOD') + ': '} className="ant-form-item-info">
          <Typography.Text>{item?.header?.periodTime}</Typography.Text>
        </Form.Item>
        <Form.Item label={t('IDS_LEVEL') + ': '} className="ant-form-item-info">
          <Typography.Text>{item?.header?.level}</Typography.Text>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserInformationPdf;
