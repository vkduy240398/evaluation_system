import { FormInstance } from 'antd';
import Form from 'antd/lib/form';
import { t } from 'i18next';
import React from 'react';
import EmptyComponent from '../../../common/EmptyComponent';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import { SearchOutlined } from '@ant-design/icons';

interface Props {
  form: FormInstance;
  isLoading: boolean;
  skills: { label: string; value: any }[];
  handleSearch: (args: any) => void;
}
const SearchFieldSkill = (props: Props) => {
  // ** Props
  const { form, isLoading, skills: skills, handleSearch } = props;

  // ** Hook
  const { Item } = Form;

  // ** Functional
  const onFinish = (values: any) => {
    handleSearch({ ...values, limit: 20, offset: 0 });
  };

  const layout = {
    labelCol: { span: 1 },
    wrapperCol: { xl: 4, lg: 6, md: 8, sm: 12, xs: 24 },
  };

  return (
    <>
      <Form {...layout} form={form} colon={false} labelAlign="left" onFinish={onFinish}>
        <Item name={'skillId'} label={t('IDS_TEMPLATE')} initialValue={-1} colon={false}>
          <Select
            showSearch
            options={skills}
            filterOption={(inputValue, option) =>
              option?.label.toLowerCase().includes(inputValue.toLowerCase()) || false
            }
            style={{ width: 200 }}
            loading={isLoading}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </Item>

        <Item>
          <Button
            type="primary"
            className="main_button"
            htmlType="submit"
            style={{ marginTop: 10, marginBottom: 15 }}
            loading={isLoading}
            icon={<SearchOutlined />}
          >
            {t('IDS_BUTTON_SEARCH')}
          </Button>
        </Item>
      </Form>
    </>
  );
};

export default SearchFieldSkill;
