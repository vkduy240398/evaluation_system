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
  Input,
} from 'antd';
import {
  ApartmentOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { t as tFn } from 'i18next';
import httpAxios from '../../../../../common/http';

const { RangePicker } = DatePicker;

export interface SelectedDeptItem {
  values: (string | number)[];
  label: string;
  employeeCount: number;
}
const MARGIN_BOTTOM_ITEM = 5;

export interface DeptAddModalProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  deptModalForm: any;
  isLoadingDept: boolean;
  isEvaluationTimeStarted: boolean;
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
  isEvaluationTimeStarted,
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
  const [deptSearchText, setDeptSearchText] = React.useState('');

  // Once the 評価実施 period has started, 部門目標設定/個人目標設定 are frozen outright — a
  // brand-new department override can no longer set these either.
  const isGoalDateLocked = isEvaluationTimeStarted;

  // Every field starts blank on open — including 部門目標設定/個人目標設定, which used to be
  // pre-filled from the company-wide (全社設定) dates once that period had started. Add-modal
  // rows always represent a fresh override, so nothing should be pre-populated here; only
  // required-ness (isGoalDateLocked above) still reacts to timing.

  const handleClose = () => {
    setIsOpen(false);
    deptModalForm.resetFields();
    setSelectedDeptItems([]);
    setModalCascaderValue([]);
    setDeptModalTablePage(1);
    setDeptSearchText('');
  };

  // Keeps the normal 2-column tree navigation instead of antd's default flattened
  // search list: narrows down the left column to matching divisions (or divisions
  // containing a matching department), so the user can drill into the match directly.
  const filteredDivisionOptions = React.useMemo(() => {
    const keyword = deptSearchText.trim().toLowerCase();
    if (!keyword) return divisionListWithDisabled;

    return divisionListWithDisabled.reduce((acc: any[], div: any) => {
      const divMatches = (div.label || '').toLowerCase().includes(keyword);
      const children = div.children || [];
      const matchingChildren = children.filter((c: any) => (c.label || '').toLowerCase().includes(keyword));

      if (divMatches) {
        acc.push(div);
      } else if (matchingChildren.length > 0) {
        acc.push({ ...div, children: matchingChildren });
      }
      return acc;
    }, []);
  }, [divisionListWithDisabled, deptSearchText]);

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
    const seenExpand = new Set<string>();

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
              if (!seenExpand.has(key)) {
                seenExpand.add(key);
                expandedPaths.push([divId, dept.value]);
                expandedOpts.push([parentOpt ?? divOpt, dept]);
              }
            });
        }
      } else {
        const key = path.join('_');
        if (!seenExpand.has(key)) {
          seenExpand.add(key);
          expandedPaths.push(path);
          expandedOpts.push(optPath);
        }
      }
    });

    // A disabled leaf can only be present in expandedPaths because a *previous* call to this
    // handler pushed it in below (an already-saved sibling auto-included by full coverage) —
    // its checkbox can't be toggled by the user, so rc-cascader keeps reporting it as checked
    // on every later onChange even after a sibling gets unchecked. Drop it here and let the
    // pass below decide fresh each time whether it still belongs; otherwise, once added, it
    // would stay stuck checked forever, even once the division is no longer fully covered.
    const genuinePaths: any[][] = [];
    const genuineOpts: any[][] = [];
    const seen = new Set<string>();
    expandedPaths.forEach((path, i) => {
      const optPath = expandedOpts[i] ?? [];
      if (optPath[optPath.length - 1]?.disabled) return;
      seen.add(path.join('_'));
      genuinePaths.push(path);
      genuineOpts.push(optPath);
    });

    // Once a division's genuine selection (this session's picks ∪ what's already saved) covers
    // every one of its real departments, pull the already-saved siblings into the field too —
    // otherwise it would display only the newly-clicked departments while handleDeptSubmit
    // (SolutionSecond) silently folds the already-saved ones in as well once the division is
    // fully covered, which is confusing (the admin didn't click them, but the save touches
    // them). Surfacing them here makes the field show exactly what will actually be saved.
    const leafIdsByDivision = new Map<string | number, Set<string | number>>();
    genuinePaths.forEach((path) => {
      if (path.length < 2) return;
      const divId = path[0];
      if (!leafIdsByDivision.has(divId)) leafIdsByDivision.set(divId, new Set());
      leafIdsByDivision.get(divId)!.add(path[path.length - 1]);
    });

    leafIdsByDivision.forEach((selectedLeafIds, divId) => {
      const divWithDisabled = divisionListWithDisabled.find((d: any) => d.value === divId);
      const divRaw = divisionList.find((d: any) => d.value === divId);
      const realChildren = (divWithDisabled?.children || []).filter((c: any) => c.value !== -1);
      if (realChildren.length === 0) return;

      const alreadySavedSiblings = realChildren.filter((c: any) => c.disabled && !selectedLeafIds.has(c.value));
      const isFullyCovered = realChildren.every((c: any) => selectedLeafIds.has(c.value) || c.disabled);
      if (!isFullyCovered || alreadySavedSiblings.length === 0) return;

      const parentOpt = divRaw ?? divWithDisabled;
      alreadySavedSiblings.forEach((sibling: any) => {
        const key = `${divId}_${sibling.value}`;
        if (seen.has(key)) return;
        seen.add(key);
        genuinePaths.push([divId, sibling.value]);
        // Keep the "(設定済み)" labelled option (see divisionListWithDisabled) so the preview
        // table below makes clear *why* this department is included despite not being clicked.
        genuineOpts.push([parentOpt, sibling]);
      });
    });

    setModalCascaderValue(genuinePaths);
    deptModalForm.setFieldValue('targetDepartment', genuinePaths);

    const baseItems: SelectedDeptItem[] = genuineOpts.map((optPath, i) => {
      const labels = (optPath ?? []).map((o: any) => o.label).filter((l: string) => l && l !== t('IDS_ALL'));
      return {
        values: genuinePaths[i] ?? [],
        label: labels.join(' ► '),
        employeeCount: 0,
      };
    });
    setSelectedDeptItems(baseItems);

    // Same endpoint the 対象者 tab uses, so counts stay consistent with that tab.
    Promise.all(
      genuinePaths.map(async (path) => {
        const isLeaf = path.length > 1;
        const leafId = path[path.length - 1];
        try {
          const params: any = {
            department: 'すべて',
            userName: '',
            evaluatorName: '',
            skill: 'すべて',
            level: 'すべて',
            flagSkill: 'すべて',
            limit: 1,
            offset: 0,
            ...routeState,
          };
          if (isLeaf) {
            params.departmentId = leafId;
          } else {
            params.divisionId = leafId;
          }
          const res: any = await httpAxios.Get('/api/v1/f5/management-evaluation-history/find-user-setting-evaluator', {
            params,
          });
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
      maskClosable={false}
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
              options={filteredDivisionOptions}
              style={{ width: '100%' }}
              size="small"
              multiple
              // Default SHOW_PARENT collapses "every child checked" down to just the division's
              // own tag, hiding each individual department from both the select box and the
              // preview table below. SHOW_CHILD keeps every checked department as its own tag/
              // row, matching the save logic (which always operates per-department).
              showCheckedStrategy="SHOW_CHILD"
              expandTrigger="hover"
              maxTagCount="responsive"
              displayRender={(labels) => labels.filter((l) => l && l !== t('IDS_ALL')).join(' ► ')}
              onChange={handleCascaderChange}
              onDropdownVisibleChange={(open) => {
                if (!open) setDeptSearchText('');
              }}
              dropdownRender={(menus) => (
                <div>
                  <div style={{ padding: 8 }}>
                    <Input
                      allowClear
                      autoFocus
                      size="small"
                      prefix={<SearchOutlined />}
                      // placeholder={t('IDS_SEARCH')}
                      value={deptSearchText}
                      onChange={(e) => setDeptSearchText(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                  {menus}
                </div>
              )}
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
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CalendarOutlined style={{ color: '#0284C7' }} /> {tFn('IDS_AIM_SETTING')}
              </Typography.Title>

              <Form.Item
                label={tFn('IDS_DEPARTMENTAL_GOAL_SETTING')}
                name="deptGoalSetting"
                style={{ marginBottom: MARGIN_BOTTOM_ITEM }}
                required={!isGoalDateLocked}
                rules={
                  isGoalDateLocked
                    ? []
                    : [
                        {
                          validator: (_, value) =>
                            value && value[0] && value[1]
                              ? Promise.resolve()
                              : Promise.reject(new Error(tFn('IDS_VALIDATION_DEPT_GOAL').toString())),
                        },
                      ]
                }
              >
                <RangePicker style={{ width: '100%' }} format="YYYY/M/D" clearIcon={false} size="middle" />
              </Form.Item>

              <Form.Item
                label={tFn('IDS_PERSONAL_GOAL_SETTING')}
                name="userGoalSetting"
                required={!isGoalDateLocked}
                style={{ marginBottom: 0 }}
                rules={
                  isGoalDateLocked
                    ? []
                    : [
                        {
                          validator: (_, value) =>
                            value && value[0] && value[1]
                              ? Promise.resolve()
                              : Promise.reject(new Error(tFn('IDS_VALIDATION_PERSONAL_GOAL').toString())),
                        },
                      ]
                }
              >
                <RangePicker style={{ width: '100%' }} format="YYYY/M/D" clearIcon={false} size="middle" />
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
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckSquareOutlined style={{ color: '#007240' }} /> {tFn('IDS_EVALUATION_IMPLEMENTATION')}
              </Typography.Title>

              <Form.Item
                label={tFn('IDS_DIVISION_EVALUATION')}
                name="deptEvaluation"
                required={isEvaluationTimeStarted}
                rules={
                  isEvaluationTimeStarted
                    ? [
                        {
                          validator: (_, value) =>
                            value && value[0] && value[1]
                              ? Promise.resolve()
                              : Promise.reject(new Error(tFn('IDS_VALIDATION_DEPT_EVAL').toString())),
                        },
                      ]
                    : []
                }
              >
                <RangePicker style={{ width: '100%' }} format="YYYY/M/D" clearIcon={false} size="middle" />
              </Form.Item>

              <Form.Item
                label={tFn('IDS_EVALUATION_PERSONAL')}
                name="userEvaluation"
                required={isEvaluationTimeStarted}
                rules={
                  isEvaluationTimeStarted
                    ? [
                        {
                          validator: (_, value) =>
                            value && value[0] && value[1]
                              ? Promise.resolve()
                              : Promise.reject(new Error(tFn('IDS_VALIDATION_PERSONAL_EVAL').toString())),
                        },
                      ]
                    : []
                }
              >
                <RangePicker style={{ width: '100%' }} format="YYYY/M/D" clearIcon={false} size="middle" />
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
