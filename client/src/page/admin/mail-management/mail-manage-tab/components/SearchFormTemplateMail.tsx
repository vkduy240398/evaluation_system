import { Button, Form, Input } from 'antd';
import React, { useRef } from 'react';
import { t } from 'i18next';
import { SearchOutlined } from '@ant-design/icons';
import { conditionsMailTemplate } from '../../interfaces/interfacesProps';

interface Props {
  form: any;
  isLoading: boolean;
  conditions: conditionsMailTemplate;
  setConditions: any;
  state: any;
}

const SearchFormTemplateMail: React.FC<Props> = (props: Props) => {
  const buttonFocus = useRef<HTMLButtonElement>(null);
  const { form, isLoading, conditions, setConditions, state } = props;

  /** Handle func */
  const handleSearch = async () => {
    form.validateFields().then(async () => {
      const templateName = form.getFieldValue('mailTemplateName');
      setConditions({
        ...conditions,
        name: templateName,
        searchManage: true,
        searchHistory: false,
        tabKey: '1',
      });
    });
  };

  return (
    <>
      <Form
        name="template-mail-form"
        form={form}
        initialValues={{ remember: true }}
        colon={false}
        labelCol={{ span: 1 }}
        style={{ width: '100%' }}
        layout="horizontal"
        labelAlign="left"
        onFinish={handleSearch}
      >
        <Form.Item
          label={t('IDS_TEMPLATE')}
          name="mailTemplateName"
          initialValue={''}
          colon={false}
          rules={[
            {
              max: 100,
              message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '100'),
            },
          ]}
        >
          <Input style={{ width: '200px' }} maxLength={101} />
        </Form.Item>
        <Button
          className="main_button"
          ref={buttonFocus}
          type="primary"
          name="Search"
          style={{ marginTop: 15 }}
          loading={isLoading}
          icon={<SearchOutlined />}
          htmlType="submit"
        >
          {t('IDS_BUTTON_SEARCH')}
        </Button>
      </Form>
    </>
  );
};

export default SearchFormTemplateMail;
