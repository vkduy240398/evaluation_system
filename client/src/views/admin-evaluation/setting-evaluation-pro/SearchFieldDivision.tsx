import { FormInstance } from 'antd';
import Form from 'antd/lib/form';
import Typography from 'antd/lib/typography';
import { t } from 'i18next';
import React from 'react';
import EmptyComponent from '../../../common/EmptyComponent';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import { SearchOutlined } from '@ant-design/icons';

interface Props {
  form: FormInstance;
  isLoading: boolean;
  divisions: { label: string; value: any }[];
  handleSearch: (args: any) => void;
}
const SearchFieldDivision = (props: Props) => {
  // ** Props
  const { form, isLoading, divisions, handleSearch } = props;

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
      {/* Title */}
      <Typography.Title level={3}>{(t('IDL_LIST_MENU_F6', { returnObjects: true }) as any)[5]}</Typography.Title>
      <Form {...layout} form={form} colon={false} labelAlign="left" onFinish={onFinish}>
        <Item name={'divisionId'} label={t('IDS_TYPE_DIVISION_NAME')} initialValue={-1} colon={false}>
          <Select
            showSearch
            options={divisions}
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

export default SearchFieldDivision;
