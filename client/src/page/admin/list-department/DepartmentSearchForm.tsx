/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Form, Input } from 'antd';
import { useEffect, useRef } from 'react';
import { t } from 'i18next';
import { DivisionType, conditionsDepartment } from '../../../model/Conditions';
import { SearchOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
interface Props {
  form: any;
  conditions: conditionsDepartment;
  setConditions: (data: any) => void;
  setDataSources: (data: any) => void;
  isLoading: boolean;
  listCatergories: any;
  listClassifications: any;
  type: number;
  divisionId: number;
  handleSearch: (data: conditionsDepartment) => void;
  selectedDivision: DivisionType;
}
const DepartmentSearchForm = (props: Props) => {
  const { form, conditions, setConditions, isLoading, type, divisionId, handleSearch, selectedDivision } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const buttonFocus = useRef<HTMLButtonElement>(null);
  const handleClick = async () => {
    form
      .validateFields()
      .then(async () => {
        const departmentCodeAndName = form.getFieldValue('departmentCodeAndName') || '';

        // const catergory = form.getFieldValue('catergory');
        // const classification = form.getFieldValue('classification');
        const searchConditions = {
          sortBy: 'periodIndex',
          sortType: 'ASC',
          departmentCodeAndName: departmentCodeAndName,
          catergory: type,
          classification: t('IDS_ALL'),
          search: true,
          current: 1,
          offset: 0,
          limit: 20,
          divisionId: divisionId,
        };
        setConditions(searchConditions);
        navigate(location.pathname, {
          replace: true,
          state: searchConditions,
        });
        handleSearch(searchConditions);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (location.state?.departmentCodeAndName !== undefined) {
      form.setFieldsValue(location.state);
    } else {
      form.setFieldsValue(conditions);
    }
  }, [type]);

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
        onFinish={handleClick}
      >
        {type === 0 && (
          <Form.Item label={t('IDS_TYPE_DIVISION')}>
            <>{selectedDivision.name}</>
          </Form.Item>
        )}
        <Form.Item
          label={type === 1 ? t('IDS_DIVISION_CODE_NAME') : t('IDS_DEPARTMENT_CODE_NAME')}
          colon={false}
          name="departmentCodeAndName"
          rules={[
            {
              max: 30,
              message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '30'),
            },
          ]}
        >
          <Input maxLength={31} style={{ width: '200px' }} />
        </Form.Item>

        <Button
          className="main_button"
          ref={buttonFocus}
          type="primary"
          name="Search"
          htmlType="submit"
          value="txt_evaluation_search"
          style={{ marginBottom: 20, marginTop: 15 }}
          loading={isLoading}
          icon={<SearchOutlined />}
        >
          {t('IDS_BUTTON_SEARCH')}
        </Button>
      </Form>
    </div>
  );
};

export default DepartmentSearchForm;
