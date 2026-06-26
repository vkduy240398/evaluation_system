import { Input, Radio, Select, Space, DatePicker, Cascader, Button, Col, Row, FormInstance } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { listDepartment } from '../../../model/department';
import moment from 'moment-timezone';
import dayjs from 'dayjs';
import evaluatorApiService from '../../../common/api/evaluator';
import { statusEvaluationObjComboBox } from '../../../common/status';
import { t } from 'i18next';
import EmptyComponent from '../../../common/EmptyComponent';
import Tooltip from 'antd/lib/tooltip';
import Icon, { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useAuth } from '../../../hooks/useAuth';

interface Props {
  departments: {
    division_id: string | number;
    name: string;
    value: string;
    code: string;
    type: number | null;
    children: {
      name: string;
      code: string;
      value: string;
      type: number; // 0 hoặc -1 cho "すべて"
    }[];
  }[];
  isLoading: boolean;
  conditions: any;
  setCondition: (data: any) => void;
  Form: any;
  setDataState: (data: any[]) => void;
  url: string;
  callBackListUserEvaluation: (data: any) => void;
  errorCallBack: (bool: boolean | undefined) => void;
  location: any;
  navigates: any;
  listStatus: any[];
  setFirsrLoading: () => void;
  listEvaluators: any;
  listLevels: any;
  setDepartmentCondition: any;
  departmentConditon: any;
  form: FormInstance<any>;
}
type objects = 'すべて';
const SearchComponent = (props: Props) => {
  const {
    isLoading,
    departments,
    conditions,
    Form,
    url,
    callBackListUserEvaluation,
    errorCallBack,
    navigates,
    location,
    listStatus,
    listEvaluators,
    listLevels,
    setDepartmentCondition,
    departmentConditon,
    form,

    // setFirsrLoading,
  } = props;

  const [counts, setCounts] = useState(conditions.status.length === 25 ? 0 : conditions.status.length || 0);
  const auth = useAuth();
  const years = new Date();
  years.setFullYear(conditions.yearDisplayCalendar);
  conditions.year = dayjs(moment(years, 'YYYY').format('YYYY'));
  const inputFocus = useRef<any>(null);

  const handleSearch = async () => {
    const statusSearchs: any[] = form
      .getFieldValue('status')
      .toString()
      .split(',')
      .filter((v: objects) => v !== t('IDS_ALL'));
    const departmentField = form.getFieldValue('department');
    let department = t('IDS_ALL');
    let divsion = t('IDS_ALL');

    if (departmentField !== t('IDS_ALL')) {
      if (departmentField[0]) divsion = departmentField[0];
      if (departmentField[1]) department = departmentField[1];
    }
    const divisionChildren = departments.find((v) => v.value === divsion);
    const isLeafDivision = !divisionChildren?.children || divisionChildren.children.length === 0;
    const departmentSearch =
      !isLeafDivision
        ? divisionChildren?.children
            .filter((v) => v.value === department)
            .map((v) => ({ name: v.name, type: v.type }))[0] ?? { name: t('IDS_ALL'), type: -1 }
        : { name: t('IDS_ALL'), type: -1 };
    const divisionSearch = departments
      .filter((v) => v.value === divsion)
      .map((v) => ({ name: v.name, type: v.type }))[0];
    form
      .validateFields()
      .then(() => {
        const temps = location.state || conditions;
        evaluatorApiService.listUserEvaluation(url, callBackListUserEvaluation, errorCallBack, {
          ...temps,
          ...form.getFieldsValue(['email', 'department', 'evaluator', 'year', 'salaryRank', 'periodEvaluate']),
          department: department,
          division: divsion,
          departmentSearch,
          divisionSearch,
          isLeafDivision,
          year: dayjs(form.getFieldValue('year'), 'YYYY').format('YYYY'),
          yearDisplayCalendar: dayjs(form.getFieldValue('year'), 'YYYY').format('YYYY'),
          stringStatus:
            statusSearchs.length > 0 ? statusSearchs.toString() : Object.keys(statusEvaluationObjComboBox).toString(),
          offset: 0,
          limit: conditions.limit,
        });
      })
      .catch(() => {});
    await navigates(location.pathname, {
      // save conditions
      replace: true,
      state: {
        ...conditions,
        ...form.getFieldsValue(['email', 'department', 'evaluator', 'year', 'salaryRank', 'periodEvaluate', 'status']),
        department: department,
        division: divsion,
        departmentSearch,
        divisionSearch,
        isLeafDivision,
        yearDisplayCalendar: dayjs(form.getFieldValue('year'), 'YYYY').format('YYYY'),
        stringStatus:
          statusSearchs.length > 0 ? statusSearchs.toString() : Object.keys(statusEvaluationObjComboBox).toString(),
        Reload: true,
        current: 1,
        offset: 0,
        limit: 20,
      },
    });
  };
  useEffect(() => {
    inputFocus?.current?.focus();
    form.setFieldsValue({ ...conditions });
    if (conditions.division && conditions.division !== t('IDS_ALL')) {
      if (conditions.isLeafDivision) {
        form.setFieldsValue({ department: [conditions.division] });
      } else if (conditions.departmentSearch) {
        form.setFieldsValue({ department: [conditions.division, conditions.departmentSearch.name] });
      }
    }
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
        {/* <Form.Item label={t('IDS_EVALUATION_ORDER')} colon={false} name="evaluator">
          <Radio.Group>
            <Radio value={'0.5,1,2'}>{t('IDS_ALL')}</Radio>
            <Radio value={'0.5'}>{t('IDS_POINT_EVALUATOR_0_5')}</Radio>
            <Radio value={'1'}>{t('IDS_POINT_EVALUATOR_1')}</Radio>
            <Radio value={'2'}>{t('IDS_POINT_EVALUATOR_2')}</Radio>
          </Radio.Group>
        </Form.Item> */}
        <Form.Item label={t('IDS_DISPLAY_ORDER')} name="evaluator" initialValue={t('IDS_ALL')} colon={false}>
          <Select
            style={{ width: '100px' }}
            fieldNames={{ label: `name`, value: 'id' }}
            options={listEvaluators}
          ></Select>
        </Form.Item>

        <Form.Item label={t('IDS_EVALUATION_PERIOD')} style={{ marginBottom: 0 }}>
          <Space direction="horizontal" size={'small'}>
            <Form.Item name={'year'}>
              <DatePicker
                format={'YYYY'}
                picker="year"
                disabledDate={(current) => {
                  const timeZone = auth.user?.timeZone || 'Asia/Tokyo';
                  const now = dayjs.tz(dayjs(), timeZone);
                  const end = now.add(5, 'year');

                  return current && current > end;
                }}
                size="small"
                placeholder="YYYY"
                allowClear={true}
                clearIcon={false}
                style={{ width: '100px' }}
                onChange={async (e: any) => {
                  await setDepartmentCondition({ ...departmentConditon, year: dayjs(e, 'YYYY').format('YYYY') });
                  form.setFieldValue('department', 'すべて');
                }}
              />
            </Form.Item>
            <Form.Item name="periodEvaluate">
              <Radio.Group
                onChange={async (e) => {
                  await setDepartmentCondition({ ...departmentConditon, periodIndex: e.target.value });
                  form.setFieldValue('department', 'すべて');
                }}
              >
                <Radio value={1}>{t('IDS_FIRST_PERIOD')}</Radio>
                <Radio value={2}>{t('IDS_SECOND_PERIOD')}</Radio>
              </Radio.Group>
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label={t('IDS_STATUS')} colon={false} name={'status'}>
          <Cascader
            className="Cascader"
            showSearch
            style={{ width: counts >= 2 ? '66%' : 200 }}
            onChange={(e) => {
              setCounts(e.length);
            }}
            size="small"
            loading={isLoading}
            options={listStatus}
            multiple
            allowClear={false}
            maxTagTextLength={150}
          />
        </Form.Item>
        <Form.Item label={t('IDS_DEPARTMENT')} colon={false} name={'department'}>
          <Cascader
            allowClear={false}
            showSearch
            style={{ width: '200px' }}
            onChange={(e) => {
              // console.log(e);
            }}
            size="small"
            loading={isLoading}
            fieldNames={{ label: `name`, value: 'value' }}
            options={departments}
            clearIcon={false}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
            onClear={() => {
              return false;
            }}
          />
        </Form.Item>
        {/* <Form.Item label={t('IDS_LEVEL')} colon={false} name={'salaryRank'}>
          <Radio.Group>
            <Radio value={'1,2,3,4,5,6,7,8,9,10'}>{t('IDS_ALL')}</Radio>
            <Radio value={'1,2,3,4,5,6,7'}>{t('IDS_LEVEL_1_7')}</Radio>
            <Radio value={'8,9,10'}>{t('IDS_LEVEL_8_10')}</Radio>
          </Radio.Group>
        </Form.Item> */}
        <Form.Item label={t('IDS_LEVEL')} name="salaryRank" initialValue={t('IDS_ALL')} colon={false}>
          <Select style={{ width: '200px' }} fieldNames={{ label: `name`, value: 'id' }} options={listLevels}></Select>
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
                      style={{ color: '#6e5b14', fontSize: 18, marginLeft: '7px', marginTop: 2, cursor: 'default' }}
                    />
                  </Tooltip>
                </Col>
              </Row>
            }
            colon={false}
            name="email"
            initialValue={conditions.email}
            rules={[
              {
                max: 30,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '30'),
              },
            ]}
          >
            <Input ref={inputFocus} style={{ width: '200px', marginBottom: 10 }} maxLength={31} />
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
          >
            {t('IDS_BUTTON_SEARCH')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SearchComponent;
