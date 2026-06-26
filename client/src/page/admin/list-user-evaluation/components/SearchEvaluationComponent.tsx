import { Button, Cascader, Col, DatePicker, Input, Radio, Row, Select, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment-timezone';
import dayjs from 'dayjs';
import { t } from 'i18next';
import evaluatorApiService from '../../../../common/api/evaluator';
import { statusEvaluationObj } from '../../../../common/status';
import { listDepartment } from '../../../../model/department';
import EmptyComponent from '../../../../common/EmptyComponent';
import Icon, { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';

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
  status: any;
  setLoading: any;
  listLevels: any;
  setDepartmentCondition: any;
  departmentConditon: any;
  errorCallBackEvaluation: (bool: boolean) => void;
}

type objects = 'すべて';
const SearchEvaluationComponent = (props: Props) => {
  const {
    isLoading,
    departments,
    conditions,
    Form,
    url,
    callBackListUserEvaluation,
    navigates,
    location,
    listStatus,
    status,
    setCondition,
    setLoading,
    listLevels,
    setDepartmentCondition,
    departmentConditon,
    errorCallBackEvaluation,
  } = props;

  const [form] = Form.useForm();
  const [counts, setCounts] = useState(status.length === 25 ? 0 : status.length || 0);
  const years = new Date();
  years.setFullYear(conditions.yearDisplayCalendar);
  conditions.year = dayjs(moment(years, 'YYYY').format('YYYY'));
  const inputFocus = useRef<any>(null);

  const handleSearch = async () => {
    // setLoading(true);
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

        evaluatorApiService.listUserEvaluation(url, callBackListUserEvaluation, errorCallBackEvaluation, {
          ...temps,
          ...form.getFieldsValue(['email', 'evaluator', 'year', 'salaryRank', 'periodEvaluate']),
          department: department,
          division: divsion,
          departmentSearch,
          divisionSearch,
          isLeafDivision,
          ...{ current: 1, offset: 0 },
          year: dayjs(form.getFieldValue('year'), 'YYYY').format('YYYY'),
          yearDisplayCalendar: dayjs(form.getFieldValue('year'), 'YYYY').format('YYYY'),
          stringStatus:
            statusSearchs.length > 0 && statusSearchs[0] !== ''
              ? statusSearchs.toString()
              : Object.keys(statusEvaluationObj).toString(),
        });
        setCondition({
          ...conditions,
          ...form.getFieldsValue(['email', 'evaluator', 'year', 'salaryRank', 'periodEvaluate']),
          department: department,
          division: divsion,
          departmentSearch,
          divisionSearch,
          isLeafDivision,
          stringStatus:
            statusSearchs.length > 0 && statusSearchs[0] !== ''
              ? statusSearchs.toString()
              : Object.keys(statusEvaluationObj).toString(),
          current: 1,
          yearDisplayCalendar: dayjs(form.getFieldValue('year'), 'YYYY').format('YYYY'),
        });
      })
      .catch(() => {});

    await navigates(location.pathname, {
      // save conditions
      replace: true,
      state: {
        ...conditions,
        ...form.getFieldsValue(['email', 'evaluator', 'year', 'salaryRank', 'periodEvaluate', 'status']),
        department: department,
        division: divsion,
        departmentSearch,
        divisionSearch,
        isLeafDivision,
        yearDisplayCalendar: dayjs(form.getFieldValue('year'), 'YYYY').format('YYYY'),
        stringStatus: statusSearchs.length > 0 ? statusSearchs.toString() : Object.keys(statusEvaluationObj).toString(),
        Reload: true,
        current: 1,
        offset: 0,
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
        style={{ width: '100%' }}
        layout="horizontal"
        colon={false}
        form={form}
        onFinish={handleSearch}
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
                  await setDepartmentCondition({
                    ...departmentConditon,
                    year: dayjs(e, 'YYYY').format('YYYY'),
                  });
                  form.setFieldValue('department', 'すべて');
                }}
              />
            </Form.Item>
            <Form.Item name="periodEvaluate" initialValue={conditions.periodEvaluate}>
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
        <Form.Item
          label={t('IDS_STATUS')}
          colon={false}
          name={'status'}
          initialValue={[t('IDS_ALL').toString()]}

          // style={{ marginBottom: 15 }}
        >
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
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </Form.Item>
        <Form.Item label={t('IDS_DEPARTMENT')} colon={false} name={'department'}>
          <Cascader
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

export default SearchEvaluationComponent;
