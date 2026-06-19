/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { Select, Input, Form, Button, Tooltip, Row, Col } from 'antd';
import { useEffect, useRef } from 'react';
import { listDepartment } from '../../../../model/department';
import { t } from 'i18next';
import EmptyComponent from '../../../../common/EmptyComponent';
import { conditionsUser } from '../../../../model/Conditions';
import Icon, { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';

interface Props {
  form: any;
  conditions: conditionsUser;
  setConditions: (data: any) => void;
  setDataSources: (data: any) => void;
  isLoading: boolean;
  departments: listDepartment[];
  divisions: listDepartment[];
  companys: any[];
  roleList: any;
  setSelectedRowKeys: any;
}
const UserSearchFormComponent = (props: Props) => {
  const buttonFocus = useRef<HTMLButtonElement>(null);
  const { form, conditions, setConditions, isLoading, roleList, departments, divisions, companys } = props;

  const handleSearch = async () => {
    form
      .validateFields()
      .then(async () => {
        const role = form.getFieldValue('role');
        const department = form.getFieldValue('department');
        const division = form.getFieldValue('division');
        const company = form.getFieldValue('company');
        const nameAndEmail = form.getFieldValue('nameAndEmail');
        const skill = form.getFieldValue('skill');
        setConditions({
          ...conditions,
          role,
          department,
          division,
          company,
          nameAndEmail,
          skill,
          search: true,
          current: 1,
          offset: 0,
          limit: 20,
        });
      })
      .catch(() => {});
    props.setSelectedRowKeys([]);
  };

  useEffect(() => {
    form.setFieldsValue(conditions);
  }, []);

  return (
    <div>
      <Form
        name="create_template_form"
        initialValues={{ remember: true }}
        colon={false}
        labelCol={{ span: 1 }}
        style={{ width: '100%' }}
        layout="horizontal"
        labelAlign="left"
        form={form}
        onFinish={handleSearch}
      >
        <Form.Item label={t('IDS_ROLE')} name="role" initialValue={t('IDS_ALL')} colon={false}>
          <Select style={{ width: '200px' }} fieldNames={{ label: `roleName`, value: 'id' }} options={roleList} />
        </Form.Item>

        <Form.Item label={t('IDS_COMPANY')} name="company" initialValue={t('IDS_ALL')} colon={false}>
          <Select
            showSearch
            style={{ width: '200px' }}
            fieldNames={{ label: `name`, value: 'value' }}
            options={companys}
            filterOption={(input: any, option: any) => (option?.name ?? '').toLowerCase().includes(input.toLowerCase())}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          ></Select>
        </Form.Item>

        <Form.Item label={t('IDS_TYPE_DIVISION_NAME')} name="division" initialValue={t('IDS_ALL')} colon={false}>
          <Select
            showSearch
            style={{ width: '200px' }}
            fieldNames={{ label: `name`, value: 'value' }}
            options={divisions}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          ></Select>
        </Form.Item>

        <Form.Item label={t('IDS_TYPE_DEPARTMENT_NAME')} name="department" initialValue={t('IDS_ALL')} colon={false}>
          <Select
            showSearch
            style={{ width: '200px' }}
            fieldNames={{ label: `name`, value: 'value' }}
            options={departments}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          ></Select>
        </Form.Item>
        <Form.Item label={t('IDS_EVALUATION_SKILL')} name="skill" initialValue={t('IDS_ALL')} colon={false}>
          <Select
            style={{ width: '200px' }}
            fieldNames={{ label: `name`, value: 'value' }}
            options={[
              { value: t('IDS_ALL'), name: t('IDS_ALL') },
              { value: 1, name: t('IDS_HAVE') },
              { value: 0, name: t('IDS_NOT_HAVE') },
              // { value: 2, name: t('IDS_NOT_APPLICABLE') },
            ]}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          ></Select>
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
            name="nameAndEmail"
            rules={[
              {
                max: 30,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '30'),
              },
            ]}
          >
            <Input maxLength={31} style={{ width: '200px' }} />
          </Form.Item>
        </div>
        <Button
          className="main_button"
          ref={buttonFocus}
          type="primary"
          name="Search"
          value="txt_evaluation_search"
          style={{ marginBottom: 20, marginTop: 15 }}
          loading={isLoading}
          icon={<SearchOutlined />}
          htmlType="submit"
        >
          {t('IDS_BUTTON_SEARCH')}
        </Button>
      </Form>
    </div>
  );
};

export default UserSearchFormComponent;
