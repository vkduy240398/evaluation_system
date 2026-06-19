/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form, Radio, RadioChangeEvent, Select } from 'antd';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { MainButton } from '../../../../common/MainButton';
import { conditionsEvaluationItemHistory } from '../../../../model/Conditions';
import { Outlet } from 'react-router-dom';
import { listDepartment } from '../../../../model/department';
import EmptyComponent from '../../../../common/EmptyComponent';
import { SearchOutlined } from '@ant-design/icons';
interface Props {
  form: any;
  conditions: conditionsEvaluationItemHistory;
  setConditions: (data: any) => void;
  setDataSources: (data: any) => void;
  isLoading: boolean;
  skills: listDepartment[];
  listStatusProSkill: any;
  listPublicStatusProSkill: any;
}
const CriteriaHistorySearchForm = (props: Props) => {
  const { form, conditions, setConditions, isLoading, skills, listStatusProSkill, listPublicStatusProSkill } =
    props;

  const handleSearch = async () => {
    form
      .validateFields()
      .then(async () => {
        const skill = form.getFieldValue('skill');
        const status = form.getFieldValue('status');
        const typeDepartment = form.getFieldValue('typeDepartment');
        const publicStatus = form.getFieldValue('publicStatus');
        setConditions({
          ...conditions,
          skill,
          status,
          publicStatus,
          typeDepartment,
          search: true,
          current: 1,
          offset: 0,
          limit: 20,
        });
      })
      .catch(() => {});
  };

  useEffect(() => {
    form.setFieldsValue(conditions);
  }, []);

  return (
    <div>
      <Form
        name="create_template_form"
        initialValues={{ remember: true }}
        labelCol={{ span: 1 }}
        labelAlign="left"
        style={{ width: '100%' }}
        layout="horizontal"
        colon={false}
        form={form}
      >
        <Form.Item label={t('IDS_TEMPLATE')} name="skill" initialValue={t('IDS_ALL')} colon={false}>
          <Select
            showSearch
            style={{ width: '200px' }}
            fieldNames={{ label: `name`, value: 'value' }}
            options={skills}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          ></Select>
        </Form.Item>

        <Form.Item label={t('IDS_STATUS')} name="status" initialValue={t('IDS_ALL')} colon={false}>
          <Select
            style={{ width: '200px' }}
            fieldNames={{ label: `statusName`, value: 'id' }}
            options={listStatusProSkill}
          ></Select>
        </Form.Item>
        <Form.Item
          label={t('IDS_STATUS_PUBLIC')}
          name="publicStatus"
          initialValue={(t('IDL_LIST_PUBLIC_STATUS_PRO_SKILL', { returnObjects: true }) as any)[2]}
          colon={false}
        >
          <Select
            style={{ width: '200px' }}
            fieldNames={{ label: `statusPublicName`, value: 'id' }}
            options={listPublicStatusProSkill}
          ></Select>
        </Form.Item>

        <MainButton
          type="primary"
          name="Search"
          value="txt_evaluation_search"
          style={{ marginBottom: 20, marginTop: 15 }}
          loading={isLoading}
          onClick={handleSearch}
          icon={<SearchOutlined />}
        >
          {t('IDS_BUTTON_SEARCH')}
        </MainButton>
      </Form>
    </div>
  );
};

export default CriteriaHistorySearchForm;
