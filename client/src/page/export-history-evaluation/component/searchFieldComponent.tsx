import { DatePicker, Button, Form, Select, Skeleton, Spin, FormInstance, Input, Row, Col, Tooltip, Radio } from 'antd';
import moment from 'moment-timezone';
import EmptyComponent from '../../../common/EmptyComponent';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';
interface Props {
  departmentList: { name: string; id: number }[];
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  form: FormInstance<any>;
  handleExport: () => void;
  yearPeriods: {
    label: string;
    value: string;
  }[];
  setYearPeriods: Dispatch<SetStateAction<{ label: string; value: string }[]>>;
  setDepartmentCondition: Dispatch<
    SetStateAction<{
      yearEvaluate: number;
      periodEvaluate: number;
    }>
  >;
}
const YEAR_RELEASE = 2024;
const SearchFieldComponent = (props: Props) => {
  const { departmentList, isLoading, form, handleExport, setLoading, yearPeriods, setDepartmentCondition } = props;
  const { t } = useTranslation();
  const { user } = useAuth();
  const { RangePicker } = DatePicker;
  const dayjsYearRelease = dayjs().set('year', YEAR_RELEASE);
  const [dayjsCurrentDay, setDayJsCurrentDay] = useState(dayjs().set('year', dayjs().get('year')));
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return !(current.year() >= dayjsYearRelease.year() && current.year() <= dayjsCurrentDay.year());
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
        onFinish={handleExport}
      >
        <Form.Item
          name="yearAndPeriod"
          label={
            <Row>
              <Col>{t('IDS_TIME_PRO_SKILL_YEAR_PERIOD')}</Col>
              <Col>
                <Tooltip
                  title={t('IDS_TOOLTIP_TIME_YEAR_PERIOD')}
                  color="#424242"
                  overlayInnerStyle={{ fontSize: '11px' }}
                >
                  <Icon
                    component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                    style={{ color: '#6e5b14', fontSize: 18, marginLeft: '7px', marginTop: 2, cursor: 'default' }}
                  />
                </Tooltip>
              </Col>
            </Row>
          }
          colon={false}
        >
          <Radio.Group
            onChange={async (e) => {
              const values = e.target.value.split('_');
              setDepartmentCondition({
                periodEvaluate: values[1],
                yearEvaluate: values[0],
              });
              setDayJsCurrentDay(dayjs().set('year', values[0]));
            }}
            disabled={isLoading}
          >
            {yearPeriods
              .sort(
                (a, b) =>
                  Number(a.value.split('_')[0]) - Number(b.value.split('_')[0]) ||
                  Number(a.value.split('_')[1]) - Number(b.value.split('_')[1]),
              )
              .map((v, i) => (
                <Radio key={i} value={v.value}>
                  {v.label}
                </Radio>
              ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label={t('IDS_DEPARTMENT')} name="department" colon={false}>
          <Select
            mode="multiple"
            showSearch
            style={{ width: '200px' }}
            fieldNames={{ label: `name`, value: 'value' }}
            options={departmentList.filter((item: any) => !((user?.level ?? 0) < 8 && item.type === 1))}
            disabled={isLoading}
            filterOption={(input, option) => (option?.name ?? '').toLowerCase().includes(input.toLowerCase())}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          ></Select>
        </Form.Item>
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
                    style={{ color: '#6e5b14', fontSize: 18, marginLeft: '7px', marginTop: 2, cursor: 'default' }}
                  />
                </Tooltip>
              </Col>
            </Row>
          }
          name="fullName"
          colon={false}
          rules={[
            {
              max: 30,
              message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '30'),
            },
          ]}
        >
          <Input style={{ width: '200px' }} maxLength={31} disabled={isLoading} />
        </Form.Item>
        <Form.Item
          label={
            <Row>
              <Col>{t('IDS_EVALUATION_EXPORT_SUMMARY')}</Col>
              <Col>
                <Tooltip
                  title={t('IDS_TOOLTIP_TIME_CALENDAR')}
                  color="#424242"
                  overlayInnerStyle={{ fontSize: '11px' }}
                >
                  <Icon
                    component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                    style={{ color: '#6e5b14', fontSize: 18, marginLeft: '7px', marginTop: 2, cursor: 'default' }}
                  />
                </Tooltip>
              </Col>
            </Row>
          }
          name="year"
          style={{ marginBottom: 15 }}
        >
          <RangePicker
            size={'small'}
            format={'YYYY'}
            picker="year"
            disabledDate={disabledDate}
            clearIcon={false}
            style={{ width: 200 }}
            disabled={isLoading}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            name="Export"
            value="txt_evaluation_search"
            loading={isLoading}
            className="main_button"
          >
            {t('IDS_OUTPUT')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SearchFieldComponent;
