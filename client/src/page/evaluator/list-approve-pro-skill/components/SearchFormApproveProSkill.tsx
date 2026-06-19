/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { Select, Form, Button } from 'antd';
import { useEffect, useRef } from 'react';
import { listDepartment } from '../../../../model/department';
import { t } from 'i18next';
import EmptyComponent from '../../../../common/EmptyComponent';
import { conditionsProskill } from '../../../../model/Conditions';
import { SearchOutlined } from '@ant-design/icons';

interface Props {
  form: any;
  conditions: conditionsProskill;
  setConditions: (data: any) => void;
  setDataSources: (data: any) => void;
  isLoading: boolean;
  skills: listDepartment[];
  listStatus: any;
  listPublicStatus: any;
}
const SearchFormApproveProSkill = (props: Props) => {
  const buttonFocus = useRef<HTMLButtonElement>(null);
  const { form, conditions, setConditions, isLoading, skills, listStatus, listPublicStatus } = props;

  const handleSearch = async () => {
    form
      .validateFields()
      .then(async () => {
        const status = form.getFieldValue('status');
        const skill = form.getFieldValue('skill');
        const publicStatus = form.getFieldValue('publicStatus');
        setConditions({
          ...conditions,
          status,
          skill,
          publicStatus,
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
        colon={false}
        labelCol={{ span: 1 }}
        style={{ width: '100%' }}
        layout="horizontal"
        labelAlign="left"
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

        <Form.Item label={t('IDS_STATUS')} name="status" initialValue={3} colon={false}>
          <Select
            style={{ width: '200px' }}
            fieldNames={{ label: `statusName`, value: 'id' }}
            options={listStatus}
          ></Select>
        </Form.Item>

        <Form.Item label={t('IDS_STATUS_PUBLIC')} name="publicStatus" initialValue={t('IDS_ALL')} colon={false}>
          <Select
            style={{ width: '200px' }}
            fieldNames={{ label: `statusPublicName`, value: 'id' }}
            options={listPublicStatus}
          ></Select>
        </Form.Item>

        <Button
          onClick={handleSearch}
          style={{ marginBottom: 20, marginTop: 15 }}
          loading={isLoading}
          className="main_button"
          ref={buttonFocus}
          type="primary"
          name="Search"
          value="txt_evaluation_search"
          icon={<SearchOutlined />}
        >
          {t('IDS_BUTTON_SEARCH')}
        </Button>
      </Form>
    </div>
  );
};

export default SearchFormApproveProSkill;
