import { Button, Col, DatePicker, Form, Input, Row, Select, Tooltip } from 'antd';
import { t } from 'i18next';
import EmptyComponent from '../../../../common/EmptyComponent';
import type { RangePickerProps } from 'antd/es/date-picker';
import { listDepartment } from '../../../../model/department';
import dayjs from 'dayjs';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';

interface Props {
  divisions: listDepartment[];
  departments: listDepartment[];
  isLoading: boolean;
  form: any;
  navigates: any;
  handleExport: any;
}
const YEAR_RELEASE = 2024;
const SearchFieldComponent = (props: Props) => {
  const { divisions, departments, isLoading, form, handleExport } = props;
  const { RangePicker } = DatePicker;
  const dayjsYearRelease = dayjs().set('year', YEAR_RELEASE);
  const dayjsCurrentDay = dayjs().set('year', dayjs().get('year'));
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return !(current >= dayjsYearRelease && current <= dayjsCurrentDay);
  };

  const optionDivisions = divisions.filter((e: any) => {
    return e.code !== 'default';
  });

  const optionDepartments = departments.filter((e: any) => {
    return e.code !== 'default';
  });

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
        <Form.Item label={t('IDS_TYPE_DIVISION_NAME_2')} name="division" initialValue={null} colon={false}>
          <Select
            showSearch
            style={{ width: '200px' }}
            fieldNames={{ label: `name`, value: 'value' }}
            options={optionDivisions}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          ></Select>
        </Form.Item>

        <Form.Item label={t('IDS_TYPE_DEPARTMENT_NAME')} name="department" initialValue={null} colon={false}>
          <Select
            showSearch
            style={{ width: '200px' }}
            fieldNames={{ label: `name`, value: 'value' }}
            options={optionDepartments}
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
          colon={false}
          name="userInfo"
          rules={[
            {
              max: 30,
              message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '30'),
            },
          ]}
        >
          <Input maxLength={31} style={{ width: '200px' }} />
        </Form.Item>
        <Form.Item label={t('IDS_USER_STATE')} name="status" initialValue={null} colon={false}>
          <Select
            style={{ width: '200px' }}
            fieldNames={{ label: `name`, value: 'value' }}
            options={[
              { value: null, name: t('IDS_ALL') },
              { value: 1, name: t('IDS_VALID_LABEL') },
              { value: 0, name: t('IDS_INVALID_LABEL') },
            ]}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          ></Select>
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
