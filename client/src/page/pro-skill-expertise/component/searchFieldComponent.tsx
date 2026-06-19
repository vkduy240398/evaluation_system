import {
  DatePicker,
  Button,
  Form,
  Select,
  Skeleton,
  Spin,
  FormInstance,
  Input,
  Row,
  Col,
  Tooltip,
  Space,
  Radio,
} from 'antd';
import moment from 'moment-timezone';
import EmptyComponent from '../../../common/EmptyComponent';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import auth from '../../../common/api/auth';
interface Props {
  form: FormInstance<any>;
  conditions: any;
  setConditions: (data: any) => void;
  setDepartmentCondition: any;
  departmentConditon: any;
  departmentList: { name: string; id: number }[];
  isLoading: boolean;
}
const YEAR_RELEASE = 2023;
const SearchFieldComponent = (props: Props) => {
  const { departmentList, isLoading, form, conditions, setConditions, setDepartmentCondition, departmentConditon } =
    props;
  const { t } = useTranslation();
  const { user } = useAuth();
  const { RangePicker } = DatePicker;

  const dayjsYearRelease = dayjs().set('year', YEAR_RELEASE);
  const dayjsCurrentDay = dayjs().set('year', dayjs().get('year'));
  const [yearPeriods, setYearPeriods] = useState<{ label: string; value: string }[]>([]);
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return !(current >= dayjsYearRelease && current <= dayjsCurrentDay);
  };

  // Năm hiện tại: 2025 => [2025 kì 1 4 -> 9 , kì 2 10 -> 3 năm sau] => kì quá khứ
  //

  const handleSearch = async () => {
    const periodEvaluate = form.getFieldValue('yearAndPeriod');
    const splitYears = periodEvaluate.split('_');

    form
      .validateFields()
      .then(async () => {
        setConditions({
          ...conditions,
          department: form.getFieldValue('department'),
          fullName: form.getFieldValue('fullName').trim(),
          yearStart: dayjs(form.getFieldValue('year')[0], 'YYYY').format('YYYY'),
          yearEnd: dayjs(form.getFieldValue('year')[1], 'YYYY').format('YYYY'),
          yearEvaluate: splitYears[0],
          periodEvaluate: splitYears[1],
          reload: true,
          firstLoad: false,
          search: true,
          current: 1,
          offset: 0,
          limit: 20,
          yearAndPeriod: periodEvaluate,
        });
      })
      .catch(() => {});
  };

  //Xác định năm hiện tại là kì nào Ex: 2025 tháng 6 sẽ thuộc kì 1 năm 2025
  //Cho phép chọn 2024 kì 2: tháng 9 năm 2024 => tháng 3 năm 2025

  const setDisabledPeriods = () => {
    const dayjsCurrentYear = dayjs().year();
    const dayjsCurrentMonth = dayjs().month() + 1;

    const periodsFirsts = [4, 5, 6, 7, 8, 9];
    const periodsSeconds = [10, 11, 12, 1, 2, 3];

    const arrays: { label: string; value: string }[] = [];
    if (periodsFirsts.includes(dayjsCurrentMonth)) {
      arrays.push(
        {
          label: `${dayjsCurrentYear}${t('IDS_FIRST_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear}_1`,
        },
        {
          label: `${dayjsCurrentYear}${t('IDS_SECOND_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear}_2`,
        },
        {
          label: `${dayjsCurrentYear - 1}${t('IDS_SECOND_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear - 1}_2`,
        },
      );
    } else if (periodsSeconds.includes(dayjsCurrentMonth) && dayjsCurrentYear === new Date().getFullYear()) {
      arrays.push(
        {
          label: `${dayjsCurrentYear}${t('IDS_FIRST_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear}_1`,
        },
        {
          label: `${dayjsCurrentYear}${t('IDS_SECOND_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear}_2`,
        },
        {
          label: `${dayjsCurrentYear + 1}${t('IDS_FIRST_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear + 1}_1`,
        },
      );
    } else if (periodsSeconds.includes(dayjsCurrentMonth) && dayjsCurrentYear > new Date().getFullYear()) {
      arrays.push(
        {
          label: `${dayjsCurrentYear}${t('IDS_FIRST_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear}_1`,
        },
        {
          label: `${dayjsCurrentYear}${t('IDS_SECOND_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear}_2`,
        },
        {
          label: `${dayjsCurrentYear + 1}${t('IDS_SECOND_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear + 1}_2`,
        },
      );
    }
    setYearPeriods(arrays);
  };

  useEffect(() => {
    setDisabledPeriods();
    form.setFieldsValue(conditions);
  }, []);

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
        <Form.Item
          label={
            <Row>
              <Col>{t('IDS_TIME_PRO_SKILL_YEAR_PERIOD')}</Col>
              <Col>
                <Tooltip
                  title={t('IDS_TOOLTIP_TIME_PRO_SKILL_YEAR_PERIOD')}
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
          <Form.Item name="yearAndPeriod">
            <Radio.Group
              onChange={async (e) => {
                const values = e.target.value.split('_');
                await setDepartmentCondition({
                  ...departmentConditon,
                  periodEvaluate: values[1],
                  yearEvaluate: values[0],
                });
                form.setFieldValue('department', []);
                form.resetFields(['department']);
              }}
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
        </Form.Item>
        <Form.Item label={t('IDS_DEPARTMENT')} name="department" colon={false}>
          <Select
            mode="multiple"
            showSearch
            style={{ width: '200px' }}
            fieldNames={{ label: `name`, value: 'value' }}
            options={departmentList.filter((item: any) => !((user?.level ?? 0) < 8 && item.type === 1))}
            disabled={isLoading}
            loading={isLoading}
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
              <Col>{t('REVIEW_SUMMARY.IDS_EVALUATION_PERIOD')}</Col>
              <Col>
                <Tooltip
                  title={t('IDS_TOOLTIP_TIME_PRO_SKILL_2_CALENDAR')}
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
          colon={false}
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
            {t('IDS_BUTTON_SEARCH')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SearchFieldComponent;
