import { Form } from 'antd';
import { TFunction } from 'i18next';
import React from 'react';
interface Props {
  period: string;
  fullName: string;
  employeeNumber: string;
  divisionName: string;
  departmentName: string;
  level: number;
  t: TFunction;
}
const InfomationEmployee = (props: Props) => {
  const { period, fullName, employeeNumber, divisionName, departmentName, level, t } = props;

  return (
    <>
      <Form
        initialValues={{ remember: true }}
        labelCol={{ span: 1 }}
        labelAlign="left"
        layout="horizontal"
        colon={false}
      >
        <Form.Item label={t('REVIEW_SUMMARY.IDS_EVALUATION_PERIOD')}>{`${period}`}</Form.Item>
        <Form.Item label={t('IDS_FULLNAME')}>{`${employeeNumber}: ${fullName}`}</Form.Item>
        <Form.Item label={t('IDS_DEPARTMENT')}>{divisionName}</Form.Item>
        <Form.Item label={t('IDS_LEVEL')}>{`${level}`}</Form.Item>
      </Form>
    </>
  );
};

export default InfomationEmployee;
