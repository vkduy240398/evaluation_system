import { Space, DatePicker, Radio, Button } from 'antd';
import { t } from 'i18next';
import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import moment from 'moment-timezone';
import { SearchOutlined } from '@ant-design/icons';
import exportProSkillApiService from '../../../../common/api/export-pro-skill';

interface Props {
  isLoading: boolean;
  condition: any;
  setCondition: (data: any) => void;
  Form: any;
  role: string;
  callBackListDep_Template: (data: any) => void;
  errorCallBack: (bool: boolean | undefined) => void;
  navigates: any;
  form: any;
  setSelectedRowKeys: any;
}
const SearchFieldComponent = (props: Props) => {
  const {
    isLoading,
    callBackListDep_Template,
    errorCallBack,
    condition,
    Form,
    role,
    navigates,
    form,
    setSelectedRowKeys,
  } = props;

  const inputFocus = useRef<any>(null);

  const years = new Date();
  years.setFullYear(condition.yearDisplayCalendar);
  condition.year = dayjs(moment(years, 'YYYY').format('YYYY'));

  useEffect(() => {
    inputFocus?.current?.focus();
    form.setFieldsValue(condition);
  }, []);

  const handleSearch = async () => {
    setSelectedRowKeys([]);
    form
      .validateFields()
      .then(() => {
        exportProSkillApiService.listDep_Template(role, callBackListDep_Template, errorCallBack, {
          ...form.getFieldsValue(['year', 'periodEvaluate']),
          year: dayjs(form.getFieldValue('year'), 'YYYY').format('YYYY'),
          yearDisplayCalendar: dayjs(form.getFieldValue('year'), 'YYYY').format('YYYY'),
          role: role,
        });
      })
      .catch(() => {});
    await navigates(location.pathname, {
      // save conditions
      replace: true,
      state: {
        ...condition,
        ...form.getFieldsValue(['year', 'periodEvaluate']),
        yearDisplayCalendar: dayjs(form.getFieldValue('year'), 'YYYY').format('YYYY'),
        Reload: true,
        role: role,
        year: dayjs(form.getFieldValue('year'), 'YYYY').format('YYYY'),
        periodEvaluate: form.getFieldValue('periodEvaluate'),
      },
    });
  };

  return (
    <div
      style={{
        marginBottom: 20,
      }}
    >
      <Form
        name="create_template_form"
        initialValues={{ remember: true }}
        labelCol={{ span: 1 }}
        labelAlign="left"
        layout="horizontal"
        colon={false}
        form={form}
        onFinish={handleSearch}
      >
        <Form.Item label={t('IDS_YEAR_2')} style={{ marginBottom: 0 }}>
          <Space direction="horizontal" size={'small'}>
            <Form.Item name={'year'}>
              <DatePicker
                format={'YYYY'}
                picker="year"
                disabledDate={(current) => {
                  return current && current > dayjs().add(0, 'year');
                }}
                size="small"
                placeholder="YYYY"
                allowClear={true}
                clearIcon={false}
                style={{ width: '100px' }}
              />
            </Form.Item>
            <Form.Item name="periodEvaluate">
              <Radio.Group>
                <Radio value={1}>{t('IDS_FIRST_PERIOD')}</Radio>
                <Radio value={2}>{t('IDS_SECOND_PERIOD')}</Radio>
              </Radio.Group>
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item>
          <Button
          style={{ marginTop: 10 }}
            type="primary"
            htmlType="submit"
            name="Search"
            value="txt_evaluation_search"
            loading={isLoading}
            className="main_button"
            icon={<SearchOutlined />}
          >
            {t('IDS_BUTTON_SEARCH')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SearchFieldComponent;
