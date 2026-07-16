/* eslint-disable @typescript-eslint/no-unused-vars */
import { Col, Form, Input, Modal, Radio, Row, Select, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { conditionsListCriteriaHistorty, conditionsSearchSettingEvaluator } from '../../../../model/Conditions';
import { MainButton } from '../../../../common/MainButton';
import EmptyComponent from '../../../../common/EmptyComponent';
import Icon, { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import ExceptionPeriodInfor from '../../../../views/admin-period/ExceptionPeriodInfor';
import { setOpenPopUp } from '../../../../store/total';
interface Props {
  form: any;
  conditions: conditionsSearchSettingEvaluator;
  setConditions: (data: any) => void;
  setDataSources: (data: any) => void;
  isLoading: boolean;
  listDepartment: any;
  setSelectedRowKeys: any;
  state: any;
  setSelectedRows: any;
  listSkill: any;
}
const SettingEvaluatorSearchForm = (props: Props) => {
  const { form, conditions, setConditions, isLoading, listDepartment, state, listSkill } = props;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const listException = [
    { label: t('IDS_ALL'), value: -1 },
    { label: t('IDS_HAVE'), value: 1 },
    { label: t('IDS_HAVE_NOT_SET'), value: 0 },
  ];

  const listFlagSkills = [
    { label: t('IDS_ALL'), value: t('IDS_ALL') },
    { label: t('IDS_HAVE'), value: 1 },
    { label: t('IDS_NOT_HAVE'), value: 0 },
  ];

  const listLevels = [{ label: t('IDS_ALL'), value: t('IDS_ALL') }] as any;
  for (let i = 1; i <= 10; i++) {
    listLevels.push({ label: i, value: i });
  }

  const handleSearch = async () => {
    form
      .validateFields()
      .then(async () => {
        // const statusActive = form.getFieldValue('statusActive');
        const department = form.getFieldValue('department');
        const userName = form.getFieldValue('userName');
        const evaluatorName = form.getFieldValue('evaluatorName');
        const exception = form.getFieldValue('exception');
        const skill = form.getFieldValue('skill');
        const level = form.getFieldValue('level');
        const flagSkill = form.getFieldValue('flagSkill');
        setConditions({
          ...conditions,
          ...state,
          department,
          userName,
          evaluatorName,
          exception,
          skill,
          level,
          flagSkill,
          isSearch: true,
          current: 1,
          offset: 0,
          limit: 20,
        });
      })
      .catch(() => {});

    props.setSelectedRows([]);
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
        labelCol={{ span: 1 }}
        labelAlign="left"
        style={{ width: '100%' }}
        layout="horizontal"
        colon={false}
        form={form}
        onFinish={handleSearch}
      >
        <Form.Item label={t('IDS_DEPARTMENT')} name="department" initialValue={t('IDS_ALL')} colon={false}>
          <Select
            showSearch
            style={{ width: '200px' }}
            fieldNames={{ label: `name`, value: 'name' }}
            options={listDepartment}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          ></Select>
        </Form.Item>
        <Form.Item label={t('IDS_TEMPLATE')} name="skill" initialValue={t('IDS_ALL')} colon={false}>
          <Select
            showSearch
            style={{ width: '200px' }}
            fieldNames={{ label: `name`, value: 'value' }}
            options={listSkill}
            filterOption={(input: any, option: any) => (option?.name ?? '').toLowerCase().includes(input.toLowerCase())}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          ></Select>
        </Form.Item>
        <Form.Item label={t('IDS_LEVEL')} name="level" initialValue={t('IDS_ALL')} colon={false}>
          <Select
            showSearch
            style={{ width: '200px' }}
            options={listLevels}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          ></Select>
        </Form.Item>
        <Form.Item label={t('IDS_EVALUATION_SKILL')} name="flagSkill" initialValue={t('IDS_ALL')} colon={false}>
          <Select
            showSearch
            style={{ width: '200px' }}
            options={listFlagSkills}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          ></Select>
        </Form.Item>
        <Form.Item label={t('IDS_EVALUATION_EXCEPTION')} name="exception" initialValue={-1} colon={false}>
          <Select
            showSearch
            style={{ width: '200px' }}
            options={listException}
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
            name="userName"
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

        <div style={{ width: '240px' }}>
          <Form.Item
            label={
              <Row>
                <Col>{(t('IDL_LIST_ROLE', { returnObjects: true }) as any)[2]}</Col>
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
            name="evaluatorName"
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

        <MainButton
          type="primary"
          name="Search"
          value="txt_evaluation_search"
          style={{ marginTop: 15 }}
          loading={isLoading}
          htmlType="submit"
          icon={<SearchOutlined />}
        >
          {t('IDS_BUTTON_SEARCH')}
        </MainButton>
      </Form>
    </div>
  );
};

export default SettingEvaluatorSearchForm;
