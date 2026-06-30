/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Cascader, Col, Form, Input, Row, Select, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { conditionsSearchSettingEvaluator } from '../../../../model/Conditions';
import EmptyComponent from '../../../../common/EmptyComponent';
import Icon, { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';

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
  divisionList?: any[];
}

const SettingEvaluatorSearchForm = (props: Props) => {
  const { form, conditions, setConditions, isLoading, listDepartment, state, listSkill, divisionList } = props;
  const [deptCascaderValue, setDeptCascaderValue] = useState<any[]>([t('IDS_ALL')]);
  const [selectedDivisionId, setSelectedDivisionId] = useState<number | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);

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
        const department = form.getFieldValue('department');
        const userName = form.getFieldValue('userName');
        const evaluatorName = form.getFieldValue('evaluatorName');
        const skill = form.getFieldValue('skill');
        const level = form.getFieldValue('level');
        const flagSkill = form.getFieldValue('flagSkill');
        setConditions({
          ...conditions,
          ...state,
          department,
          divisionId: selectedDivisionId,
          departmentId: selectedDepartmentId,
          userName,
          evaluatorName,
          // exception is tab-controlled (company/dept=0, personal=1) — not overridden by form
          exception: conditions.exception,
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
    if (!conditions.department || conditions.department === t('IDS_ALL')) {
      setDeptCascaderValue([t('IDS_ALL')]);
      setSelectedDivisionId(null);
      setSelectedDepartmentId(null);
    }
  }, []);

  const tooltipLabel = (roleIndex: number) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {(t('IDL_LIST_ROLE', { returnObjects: true }) as any)[roleIndex]}
      <Tooltip title={t('IDS_TOOLTIP_SEARCH_EXPLAINATION')} color="#424242" overlayInnerStyle={{ fontSize: '11px' }}>
        <Icon
          component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
          style={{ color: '#6e5b14', fontSize: 15, cursor: 'default' }}
        />
      </Tooltip>
    </span>
  );

  return (
    <Form name="setting_evaluator_search_form" layout="vertical" colon={false} form={form} onFinish={handleSearch}>
      {/* Row 1 */}
      <Row gutter={[10, 5]} align="bottom" style={{ marginBottom: 10 }}>
        <Col xs={24} md={6} lg={6}>
          <Form.Item label={t('IDS_DEPARTMENT')} name="department" initialValue={t('IDS_ALL')}>
            {divisionList && divisionList.length > 0 ? (
              <Cascader
                options={[{ label: t('IDS_ALL'), value: t('IDS_ALL'), isLeaf: true }, ...divisionList]}
                value={deptCascaderValue}
                showSearch
                clearIcon={false}
                size="small"
                changeOnSelect
                displayRender={(labels) => {
                  const filtered = labels.filter((l) => l && l !== t('IDS_ALL'));
                  return filtered.length > 0 ? filtered.join(' ► ') : t('IDS_ALL');
                }}
                onChange={(values: any, selectedOptions: any) => {
                  const newVal = values ?? [t('IDS_ALL')];
                  setDeptCascaderValue(newVal);
                  if (!values || values.length === 0 || values[0] === t('IDS_ALL')) {
                    form.setFieldValue('department', t('IDS_ALL'));
                    setSelectedDivisionId(null);
                    setSelectedDepartmentId(null);
                    return;
                  }
                  const opts = selectedOptions as any[];
                  const labels = opts.map((o: any) => o.label).filter((l: string) => l && l !== t('IDS_ALL'));
                  form.setFieldValue('department', labels.join(' ► ') || t('IDS_ALL'));

                  // Lưu ID để truyền xuống backend (tìm kiếm chính xác theo ID)
                  if (opts.length >= 2) {
                    // Chọn đến cấp phòng ban (department / 課)
                    setSelectedDivisionId(opts[0]?.value ?? null);
                    setSelectedDepartmentId(opts[1]?.value ?? null);
                  } else if (opts.length === 1) {
                    // Chỉ chọn cấp bộ phận (division / 部署)
                    setSelectedDivisionId(opts[0]?.value ?? null);
                    setSelectedDepartmentId(null);
                  } else {
                    setSelectedDivisionId(null);
                    setSelectedDepartmentId(null);
                  }
                }}
              />
            ) : (
              <Select
                showSearch
                fieldNames={{ label: 'name', value: 'name' }}
                options={listDepartment}
                notFoundContent={<EmptyComponent />}
              />
            )}
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label={t('IDS_TEMPLATE')} name="skill" initialValue={t('IDS_ALL')}>
            <Select
              showSearch
              fieldNames={{ label: 'name', value: 'value' }}
              options={listSkill}
              filterOption={(input: any, option: any) =>
                (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
              }
              notFoundContent={<EmptyComponent />}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label={t('IDS_EVALUATION_SKILL')} name="flagSkill" initialValue={t('IDS_ALL')}>
            <Select showSearch options={listFlagSkills} notFoundContent={<EmptyComponent />} />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item
            label={tooltipLabel(1)}
            name="userName"
            rules={[{ max: 30, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '30') }]}
          >
            <Input maxLength={31} />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item
            label={tooltipLabel(2)}
            name="evaluatorName"
            rules={[{ max: 30, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '30') }]}
          >
            <Input maxLength={31} />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label={t('IDS_LEVEL')} name="level" initialValue={t('IDS_ALL')}>
            <Select showSearch options={listLevels} notFoundContent={<EmptyComponent />} />
          </Form.Item>
        </Col>
      </Row>
      <Button size="middle" type="primary" htmlType="submit" loading={isLoading} icon={<SearchOutlined />}>
        {t('IDS_BUTTON_SEARCH')}
      </Button>
    </Form>
  );
};

export default SettingEvaluatorSearchForm;
