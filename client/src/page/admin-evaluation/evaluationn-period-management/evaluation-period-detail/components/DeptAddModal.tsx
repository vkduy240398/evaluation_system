import React from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  DatePicker,
  Button,
  Space,
  Typography,
  Alert,
  Table,
  Pagination,
  Cascader,
  Badge,
} from 'antd';
import { ApartmentOutlined, CalendarOutlined, CheckSquareOutlined, SaveOutlined } from '@ant-design/icons';
import { t as tFn } from 'i18next';
import httpAxios from '../../../../../common/http';

const { RangePicker } = DatePicker;

export interface SelectedDeptItem {
  values: (string | number)[];
  label: string;
  employeeCount: number;
}
const FONT_SIZE = 14;
const MARGIN_BOTTOM = 15;
const MARGIN_BOTTOM_ITEM = 5;

export interface DeptAddModalProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  deptModalForm: any;
  isLoadingDept: boolean;
  divisionList: any[];
  divisionListWithDisabled: any[];
  selectedDeptItems: SelectedDeptItem[];
  setSelectedDeptItems: React.Dispatch<React.SetStateAction<SelectedDeptItem[]>>;
  deptModalTablePage: number;
  setDeptModalTablePage: (page: number) => void;
  DEPT_MODAL_PAGE_SIZE: number;
  modalCascaderValue: any[][];
  setModalCascaderValue: React.Dispatch<React.SetStateAction<any[][]>>;
  routeState: any;
  handleDeptSubmit: () => void;
  t: any;
}

const DeptAddModal: React.FC<DeptAddModalProps> = ({
  isOpen,
  setIsOpen,
  deptModalForm,
  isLoadingDept,
  divisionList,
  divisionListWithDisabled,
  selectedDeptItems,
  setSelectedDeptItems,
  deptModalTablePage,
  setDeptModalTablePage,
  DEPT_MODAL_PAGE_SIZE,
  modalCascaderValue,
  setModalCascaderValue,
  routeState,
  handleDeptSubmit,
  t,
}) => {
  const handleClose = () => {
    setIsOpen(false);
    deptModalForm.resetFields();
    setSelectedDeptItems([]);
    setModalCascaderValue([]);
    setDeptModalTablePage(1);
  };

  const handleCascaderChange = (valuesList: any, selectedOptionsList: any) => {
    setDeptModalTablePage(1);
    if (!valuesList || valuesList.length === 0) {
      setModalCascaderValue([]);
      setSelectedDeptItems([]);
      deptModalForm.setFieldValue('targetDepartment', []);
      return;
    }

    const rawPaths = valuesList as any[][];
    const rawOpts = (selectedOptionsList ?? []) as any[][];

    // Expand "すべて" (value=-1) selections into individual child rows
    const expandedPaths: any[][] = [];
    const expandedOpts: any[][] = [];
    const seen = new Set<string>();

    rawPaths.forEach((path, i) => {
      const optPath = rawOpts[i] ?? [];
      if (path[path.length - 1] === -1) {
        const divId = path[0];
        const divOpt = divisionList.find((d: any) => d.value === divId);
        const parentOpt = optPath[0];
        if (divOpt) {
          (divOpt.children || [])
            .filter((c: any) => c.value !== -1)
            .forEach((dept: any) => {
              const key = `${divId}_${dept.value}`;
              if (!seen.has(key)) {
                seen.add(key);
                expandedPaths.push([divId, dept.value]);
                expandedOpts.push([parentOpt ?? divOpt, dept]);
              }
            });
        }
      } else {
        const key = path.join('_');
        if (!seen.has(key)) {
          seen.add(key);
          expandedPaths.push(path);
          expandedOpts.push(optPath);
        }
      }
    });

    setModalCascaderValue(expandedPaths);
    deptModalForm.setFieldValue('targetDepartment', expandedPaths);

    const baseItems: SelectedDeptItem[] = expandedOpts.map((optPath, i) => {
      const labels = (optPath ?? []).map((o: any) => o.label).filter((l: string) => l && l !== t('IDS_ALL'));
      return {
        values: expandedPaths[i] ?? [],
        label: labels.join(' ► '),
        employeeCount: 0,
      };
    });
    setSelectedDeptItems(baseItems);

    // Fetch employee count for each selected department
    Promise.all(
      expandedPaths.map(async (path) => {
        const isLeaf = path.length > 1;
        const leafId = path[path.length - 1];
        try {
          const res: any = await httpAxios.Get(
            '/api/v1/f5/management-evaluation-history/find-list-user-to-setting-evaluation',
            {
              params: {
                department: isLeaf ? String(leafId) : 'すべて',
                division: isLeaf ? 'すべて' : String(leafId),
                nameAndEmail: '',
                limit: 1000,
                offset: 0,
                state: routeState,
              },
            },
          );
          return res?.data?.counts ?? 0;
        } catch {
          return 0;
        }
      }),
    ).then((counts) => {
      setSelectedDeptItems((prev) => prev.map((item, i) => ({ ...item, employeeCount: counts[i] ?? 0 })));
    });
  };

  return (
    <Modal
      rootClassName="send-mail-modal"
      title={
        <Typography.Title level={4} style={{ paddingBottom: 15, marginBottom: 0 }}>
          <ApartmentOutlined style={{ color: '#007240', marginRight: '8px' }} />
          {tFn('EVALUATION_PERIOD_SCREEN.IDS_TITLE_MODAL_SETTING_GOAL_PRIVATE')}
        </Typography.Title>
      }
      open={isOpen}
      onCancel={handleClose}
      width={1000}
      destroyOnClose
      style={{ top: 20 }}
      footer={null}
    >
      <Form layout="vertical" style={{ marginTop: '0px' }} form={deptModalForm}>
        <div style={{ background: '#FFFBE6', padding: 10, marginBottom: 15 }}>
          <Typography.Title style={{ fontSize: 14 }}>
            {tFn('EVALUATION_PERIOD_SCREEN.IDS_TITLE_MODAL_ADD_SETTING_PRIVATE_GOAL')}
          </Typography.Title>
          <div style={{ fontSize: 14 }}>{tFn('EVALUATION_PERIOD_SCREEN.IDS_DEPT_SETTING_NOTE1')}</div>
          <div style={{ fontSize: 14 }}>{tFn('EVALUATION_PERIOD_SCREEN.IDS_DEPT_SETTING_NOTE2')}</div>
        </div>

        {/* 適用部署 selector */}
        <div
          style={{
            background: '#F0FDF4',
            padding: '10px 10px',
            borderRadius: '6px',
            marginBottom: '15px',
            border: '1px solid #DCFCE7',
          }}
        >
          <Form.Item
            label={tFn('EVALUATION_PERIOD_SCREEN.IDS_FIELD_DIVISION_DEPARTMENT')}
            name="targetDepartment"
            rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM') }]}
            style={{ marginBottom: 0 }}
          >
            <Cascader
              value={modalCascaderValue}
              options={divisionListWithDisabled}
              style={{ width: '100%' }}
              size="small"
              multiple
              showSearch
              maxTagCount="responsive"
              displayRender={(labels) => labels.filter((l) => l && l !== t('IDS_ALL')).join(' ► ')}
              onChange={handleCascaderChange}
            />
          </Form.Item>

          {/* Selected dept table with employee counts */}
          {selectedDeptItems.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {tFn('EVALUATION_PERIOD_SCREEN.IDS_SELECTED_DEPT_COUNT')}
              </Typography.Text>
              <Table
                size="small"
                style={{ marginTop: 6 }}
                pagination={false}
                dataSource={selectedDeptItems.slice(
                  (deptModalTablePage - 1) * DEPT_MODAL_PAGE_SIZE,
                  deptModalTablePage * DEPT_MODAL_PAGE_SIZE,
                )}
                bordered
                rowKey={(r) => r.values.join('_')}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <strong>{tFn('IDS_TOTAL')}</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <strong>
                        {selectedDeptItems.reduce((s, item) => s + item.employeeCount, 0)}
                        {tFn('IDS_PERSON_COUNT_SUFFIX')}
                      </strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
                columns={[
                  {
                    title: tFn('EVALUATION_PERIOD_SCREEN.IDS_COLUMN_DIVISION_DEPARTMENT'),
                    dataIndex: 'label',
                    key: 'label',
                  },
                  {
                    title: tFn('EVALUATION_PERIOD_SCREEN.IDS_COLUMN_COUNT_USER'),
                    dataIndex: 'employeeCount',
                    key: 'cnt',
                    align: 'right' as const,
                    width: 90,
                    render: (n: number) => `${n}${tFn('IDS_PERSON_COUNT_SUFFIX')}`,
                  },
                ]}
              />
              {selectedDeptItems.length > DEPT_MODAL_PAGE_SIZE && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 8 }}>
                  <Pagination
                    current={deptModalTablePage}
                    pageSize={DEPT_MODAL_PAGE_SIZE}
                    total={selectedDeptItems.length}
                    onChange={(page) => setDeptModalTablePage(page)}
                    showSizeChanger={false}
                    size="default"
                    showTotal={(total, range) =>
                      `${total}${tFn('IDS_CASE_LABEL')} ${range[0]}-${range[1]}${tFn('IDS_ITEM_LABEL')}`
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Period date pickers */}
        <Row gutter={[15, 15]}>
          {/* 目標設定 block */}
          <Col xs={24} sm={12}>
            <div
              style={{
                background: '#F8FAFC',
                borderRadius: '6px',
                padding: '20px',
                border: '1px solid #E2E8F0',
                height: '100%',
              }}
            >
              <Typography.Title
                level={5}
                style={{
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: FONT_SIZE,
                }}
              >
                <CalendarOutlined style={{ color: '#0284C7' }} /> {tFn('IDS_AIM_SETTING')}
              </Typography.Title>

              <Form.Item
                label={<Typography.Text>{tFn('IDS_DEPARTMENTAL_GOAL_SETTING')}</Typography.Text>}
                name="deptGoalSetting"
                style={{ marginBottom: MARGIN_BOTTOM_ITEM }}
                required
                rules={[
                  {
                    validator: (_, value) =>
                      value && value[0] && value[1]
                        ? Promise.resolve()
                        : Promise.reject(new Error(tFn('IDS_VALIDATION_DEPT_GOAL').toString())),
                  },
                ]}
              >
                <RangePicker style={{ width: '100%' }} format="YYYY/MM/DD" clearIcon={false} size="middle" />
              </Form.Item>

              <Form.Item
                label={<Typography.Text>{tFn('IDS_PERSONAL_GOAL_SETTING')}</Typography.Text>}
                name="userGoalSetting"
                required
                style={{ marginBottom: 0 }}
                rules={[
                  {
                    validator: (_, value) =>
                      value && value[0] && value[1]
                        ? Promise.resolve()
                        : Promise.reject(new Error(tFn('IDS_VALIDATION_PERSONAL_GOAL').toString())),
                  },
                ]}
              >
                <RangePicker style={{ width: '100%' }} format="YYYY/MM/DD" clearIcon={false} size="middle" />
              </Form.Item>
            </div>
          </Col>

          {/* 評価実施 block */}
          <Col xs={24} sm={12}>
            <div
              style={{
                background: '#F8FAFC',
                borderRadius: '6px',
                padding: '20px',
                border: '1px solid #E2E8F0',
                height: '100%',
              }}
            >
              <Typography.Title
                level={5}
                style={{
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: FONT_SIZE,
                }}
              >
                <CheckSquareOutlined style={{ color: '#007240' }} /> {tFn('IDS_EVALUATION_IMPLEMENTATION')}
              </Typography.Title>

              <Form.Item
                label={<Typography.Text>{tFn('IDS_DIVISION_EVALUATION')}</Typography.Text>}
                name="deptEvaluation"
              >
                <RangePicker style={{ width: '100%' }} format="YYYY/MM/DD" clearIcon={false} size="middle" />
              </Form.Item>

              <Form.Item
                label={<Typography.Text>{tFn('IDS_EVALUATION_PERSONAL')}</Typography.Text>}
                name="userEvaluation"
              >
                <RangePicker style={{ width: '100%' }} format="YYYY/MM/DD" clearIcon={false} size="middle" />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <div style={{ display: 'flex', gap: 8, marginTop: 15 }}>
          <Button size="middle" type="primary" loading={isLoadingDept} onClick={handleDeptSubmit}>
            {t('IDS_APPLY')}
          </Button>
          <Button size="middle" disabled={isLoadingDept} onClick={handleClose}>
            {t('IDS_BUTTON_CANCEL')}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default DeptAddModal;
