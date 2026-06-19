import { Button, Col, DatePicker, Form, Input, Radio, Row, Select, Space, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { t } from 'i18next';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import EmptyComponent from '../../../common/EmptyComponent';
import Icon, { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import useDepartmentEvaluation from '../hooks/useDepartmentEvaluation';

interface Props {
  conditions: any;
  isLoading: boolean;
  setIsLoading: any;
  setDataSources: any;
  onFinish: any;
  setDepartmentList: any;
}

const SearchComponent = ({ conditions, isLoading, setIsLoading, onFinish, setDepartmentList }: Props) => {
  const [form] = useForm();

  const years = new Date();
  years.setFullYear(conditions.yearDisplayCalendar);
  conditions.year = dayjs(moment(years, 'YYYY').format('YYYY'));
  const [period, setPeriod] = useState<{
    year: string;
    periodIndex: string;
  }>({
    year: conditions.yearDisplayCalendar,
    periodIndex: conditions.periodEvaluate,
  });
  const departments = useDepartmentEvaluation({ period, setIsLoading }, setDepartmentList);
  const levels = [
    { value: '1,2,3,4,5,6,7,8,9,10', label: t('IDS_ALL') },
    { value: '1,2,3,4,5,6,7', label: t('IDS_LEVEL_1_7') },
    { value: '8,9,10', label: t('IDS_LEVEL_8_10') },
  ];
  const typeReferences = [
    { value: '1,2,3,4,5,6', label: t('IDS_ALL') },
    { value: '1', label: t('IDL_LIST_PERMISSION_VIEW_EVALUATION.1') },
    { value: '2', label: t('IDL_LIST_PERMISSION_VIEW_EVALUATION.2') },
    { value: '3', label: t('IDL_LIST_PERMISSION_VIEW_EVALUATION.3') },
    { value: '4', label: t('IDL_LIST_PERMISSION_VIEW_EVALUATION.4') },
    { value: '5', label: t('IDL_LIST_PERMISSION_VIEW_EVALUATION.5') },
    { value: '6', label: t('IDL_LIST_PERMISSION_VIEW_EVALUATION.6') },
  ];
  const inputFocus = useRef<any>(null);

  useEffect(() => {
    form.setFieldsValue(conditions);
  }, []);

  return (
    <div
      style={{
        marginBottom: 20,
      }}
    >
      <Form
        name="reference-review-form"
        initialValues={{ remember: true }}
        labelCol={{ span: 1 }}
        labelAlign="left"
        style={{ width: '100%' }}
        layout="horizontal"
        colon={false}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label={t('IDS_EVALUATION_PERIOD')} style={{ marginBottom: 0 }}>
          <Space direction="horizontal" size={'small'}>
            <Form.Item name={'year'} initialValue={conditions.year}>
              <DatePicker
                format={'YYYY'}
                picker="year"
                disabledDate={(current) => {
                  return current && current > dayjs().add(5, 'year');
                }}
                size="small"
                placeholder="YYYY"
                allowClear={true}
                clearIcon={false}
                style={{ width: 100 }}
                onChange={async (e: any) => {
                  setPeriod((oldPeriod) => {
                    return {
                      ...oldPeriod,
                      year: dayjs(e, 'YYYY').format('YYYY'),
                    };
                  });

                  form.setFieldValue('department', 'すべて');
                }}
              />
            </Form.Item>
            <Form.Item name="periodEvaluate" initialValue={conditions.periodEvaluate}>
              <Radio.Group
                onChange={async (e) => {
                  setPeriod((oldPeriod) => {
                    return {
                      ...oldPeriod,
                      periodIndex: e.target.value,
                    };
                  });
                  form.setFieldValue('department', 'すべて');
                }}
              >
                <Radio value={1}>{t('IDS_FIRST_PERIOD')}</Radio>
                <Radio value={2}>{t('IDS_SECOND_PERIOD')}</Radio>
              </Radio.Group>
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item
          label={t('IDS_DEPARTMENT')}
          colon={false}
          name={'department'}
          initialValue={[t('IDS_ALL').toString()]}

          // style={{ marginBottom: 15 }}
        >
          <Select
            allowClear={false}
            showSearch
            style={{ width: '200px' }}
            onChange={() => {}}
            size="small"
            loading={isLoading}
            fieldNames={{ label: `name`, value: 'value' }}
            options={departments}
            clearIcon={false}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </Form.Item>
        <Form.Item label={t('IDS_LEVEL')} name="salaryRank" initialValue={conditions.salaryRank} colon={false}>
          <Select style={{ width: '200px' }} options={levels}></Select>
        </Form.Item>
        <Form.Item
          label={t('IDS_VIEW_RANGE')}
          name="typeReference"
          initialValue={conditions.typeReference}
          colon={false}
        >
          <Select style={{ width: '200px' }} options={typeReferences}></Select>
        </Form.Item>
        <div style={{ width: '240px' }}>
          <Form.Item
            label={
              <Row>
                <Col>{(t('IDL_LIST_ROLE', { returnObjects: true }) as any)[1]}</Col>
                <Col>
                  <Tooltip
                    title={t('IDS_TOOLTIP_SEARCH_EXPLAINATION')}
                    color="#424242"
                    overlayInnerStyle={{ fontSize: '11px' }}
                  >
                    <Icon
                      component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                      style={{
                        color: '#6e5b14',
                        fontSize: 18,
                        marginLeft: '7px',
                        marginTop: 2,
                        cursor: 'default',
                      }}
                    />
                  </Tooltip>
                </Col>
              </Row>
            }
            colon={false}
            name="email"
            rules={[
              {
                max: 30,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '30'),
              },
            ]}
            initialValue={conditions.email}
          >
            <Input ref={inputFocus} style={{ width: '200px' }} maxLength={31} />
          </Form.Item>
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            name="Search"
            value="txt_evaluation_search"
            loading={isLoading}
            className="main_button"
            icon={<SearchOutlined />}
            style={{ marginTop: 10 }}
          >
            {t('IDS_BUTTON_SEARCH')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SearchComponent;
