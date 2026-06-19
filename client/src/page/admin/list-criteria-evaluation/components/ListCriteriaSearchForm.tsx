/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form, Input, Radio, RadioChangeEvent, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';

import { t } from 'i18next';
import { conditionsListCriteriaHistorty } from '../../../../model/Conditions';
import { MainButton } from '../../../../common/MainButton';
import { SearchOutlined } from '@ant-design/icons';
interface Props {
  form: any;
  conditions: conditionsListCriteriaHistorty;
  setConditions: (data: any) => void;
  setDataSources: (data: any) => void;
  isLoading: boolean;
  listStatus: any;
}
const ListCriteriaSearchForm = (props: Props) => {
  const { form, conditions, setConditions, isLoading, listStatus } = props;
  const [typeLevel, setTypeLevel] = useState(conditions.type);
  const handleSearch = async () => {
    form
      .validateFields()
      .then(async () => {
        const type = form.getFieldValue('type');
        const status = form.getFieldValue('status');
        const flagSkill = form.getFieldValue('flagSkill');

        setConditions({ ...conditions, status, type, flagSkill, search: true, current: 1, offset: 0, limit: 20 });
      })
      .catch(() => {});
  };

  useEffect(() => {
    form.setFieldsValue(conditions);
  }, []);

  const onCategoryChange = (e: RadioChangeEvent) => {
    setTypeLevel(e.target.value);

    /**Retain data from search when there is a change from the 2nd time */
    if (e.target.value === conditions.type) {
      form.setFieldsValue(conditions);
    } else {
      form.setFieldValue(['status'], t('IDS_ALL'));
    }
  };

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
        <Form.Item label={t('IDS_LEVEL')} name="type" colon={false} initialValue={conditions.type}>
          <Radio.Group onChange={onCategoryChange}>
            <Radio value={1}>{t('IDS_LEVEL_1_7')}</Radio>
            <Radio value={2}>{t('IDS_LEVEL_8_10')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={t('IDS_EVALUATION_SKILL')} name="flagSkill">
          <Radio.Group>
            <Radio value={1}>{t('IDS_HAVE')}</Radio>
            <Radio value={3}>{t('IDS_NOT_HAVE')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={t('IDS_STATUS')} name="status" initialValue={t('IDS_ALL')} colon={false}>
          <Select
            style={{ width: '200px' }}
            fieldNames={{ label: `statusName`, value: 'id' }}
            options={listStatus}
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

export default ListCriteriaSearchForm;
