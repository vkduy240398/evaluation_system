import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Form,
  message,
  Modal,
  Pagination,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  PlusSquareOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { t as tFn } from 'i18next';
import type { i18n } from 'i18next';
import dayjs from 'dayjs';
import settingEvaluatorApiService from '../../../../../common/api/settingEvaluator';
import httpAxios from '../../../../../common/http';
import { MetaModal } from '../../../../../model/MetalModel';
import SettingEvaluatorSearchForm from '../../../../admin/set-evaluation/components/SettingEvaluatorSearchForm';
import PopupAddUserSettingEvaluator from '../../../../admin/set-evaluation/components/PopupAddUserSettingEvaluator';
import ModalPopup from '../../../../../common/ModalPopup';
import ModalCustomComponent from '../../../../../@core/components/modal-custom';
import MultiEditForm from '../../../../admin/set-evaluation/components/MultiEditForm';
import SingleEditForm from '../../../../admin/set-evaluation/components/SingleEditForm';
import ExceptionPeriodInfor from '../../../../../views/admin-period/ExceptionPeriodInfor';

const ITEM_SPACING = 15;
const FONT_SIZE = 14;
const TARGET_MESSAGES: Record<string, string> = {
  company: '全社設定の実施期間が適用されている対象者（部署別・個人別の設定がないメンバー）を表示しています。',
  department: '部署別の実施期間設定が適用されている対象者を表示しています。',
  personal: '個人別の実施期間設定が適用されている対象者を表示しています。',
  all: 'すべての対象者を表示しています。',
};

interface TargetSectionProps {
  tabMode: 'company' | 'department' | 'personal' | 'all';
  routeState: any;
  isLocked: boolean;
  isActive: boolean;
  divisionList: any[];
  listDepartment: any[];
  listSkills: any[];
  i18n: i18n;
  onAfterImport?: () => void;
}

const parseDate = (value: string | undefined | null): dayjs.Dayjs | null => {
  if (!value || !value.trim()) return null;
  const slashParts = value.trim().split('/');
  if (slashParts.length === 3) {
    const [y, m, d] = slashParts;
    const isoStr = `${y}-${m.padStart(2, '0')}-${d.slice(0, 2).padStart(2, '0')}`;
    const parsed = dayjs(isoStr);
    if (parsed.isValid()) return parsed;
  }
  if (value.trim().split('-').length === 3) {
    const parsed = dayjs(value.trim().slice(0, 10));
    if (parsed.isValid()) return parsed;
  }
  return null;
};

const TargetSection: React.FC<TargetSectionProps> = React.memo(
  ({ tabMode, routeState, isLocked, isActive, divisionList, listDepartment, listSkills, i18n, onAfterImport }) => {
    const dateFormat = i18n.language === 'ja' ? 'YYYY/M/D' : i18n.language === 'en' ? 'YYYY/D/M' : 'D/M/YYYY';

    const [searchForm] = Form.useForm();
    const [userConds, setUserConds] = useState<any>({
      offset: 0,
      limit: 20,
      current: 1,
      department: tFn('IDS_ALL'),
      userName: '',
      evaluatorName: '',
      level: tFn('IDS_ALL'),
      flagSkill: tFn('IDS_ALL'),
      skill: tFn('IDS_ALL'),
      exception: tabMode === 'personal' ? 1 : tabMode === 'all' ? undefined : 0,
      tabMode,
      divisionId: null,
      departmentId: null,
      isSearch: false,
    });
    const [userList, setUserList] = useState<any[]>([]);
    const [userTotal, setUserTotal] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [selKeys, setSelKeys] = useState<React.Key[]>([]);
    const [selRows, setSelRows] = useState<any[]>([]);

    const [isOpenPopupAddUser, setOpenPopupAddUser] = useState(false);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [isLoadingDelete, setLoadingDelete] = useState(false);
    const [metaModal, setMetaModal] = useState<MetaModal>({ type: '', record: {}, title: '', isOpen: false });
    const [textNotify, setTextNotify] = useState('');
    const [isVisibleNotify, setIsVisibleNotify] = useState(false);

    const [openPopUp, setOpenPopUp] = useState(false);
    const [userInfor, setUserInfor] = useState<any>({
      id: null,
      key: 'user-key',
      fullName: '',
      email: '',
      company: '',
      department: '',
    });
    const [popupData, setPopupData] = useState<any[]>([]);
    const [isPopupEdit, setIsPopupEdit] = useState(false);
    const [evaluatorDefaultEmails, setEvaluatorDefaultEmails] = useState<{
      evaluator05Email?: string;
      evaluator10Email?: string;
      evaluator20Email?: string;
    }>({});

    const temListEvaluators = useRef<any[]>([]);
    const listChangeOptinals = useRef<any[]>([]);
    const hasInitialized = useRef(false);
    const modalResetTrigger = useRef(false);
    const [modalResetKey, setModalResetKey] = useState(0);

    // Company tab loads on mount; other tabs load on first activation
    useEffect(() => {
      if (tabMode === 'company') {
        hasInitialized.current = true;
        setUserConds((p: any) => ({ ...p, isSearch: true }));
      }
    }, []);

    useEffect(() => {
      if (isActive && !hasInitialized.current) {
        hasInitialized.current = true;
        setUserConds((p: any) => ({ ...p, isSearch: true }));
      }
    }, [isActive]);

    useEffect(() => {
      if (userConds?.isSearch) {
        settingEvaluatorApiService.searchListSettingEvaluator(
          { ...userConds, ...routeState },
          (res: any) => {
            setUserList(res?.data || []);
            setUserTotal(res?.counts || 0);
            if (modalResetTrigger.current) {
              modalResetTrigger.current = false;
              setModalResetKey((k) => k + 1);
            }
          },
          setLoading,
        );
      }
    }, [userConds]);

    const handleOnchangeUsers = useCallback(() => {
      setSelKeys([]);
      setSelRows([]);
      modalResetTrigger.current = true;
      setUserConds((p: any) => ({ ...p, isSearch: true }));
      onAfterImport?.();
    }, [onAfterImport]);

    const handleDeleteUsers = useCallback(async () => {
      setLoadingDelete(true);
      try {
        const res: any = await httpAxios.Put('/api/v1/f5/management-evaluation-history/delete-user-setting-evaluator', {
          selectedKeyDeleted: [...new Set(selRows.map((r: any) => r.userId))],
          state: {
            year: routeState?.year,
            periodIndex: routeState?.periodIndex,
            periodId: routeState?.periodId,
            checkFixed: routeState?.checkFixed,
          },
        });
        if (res?.status === 200) {
          message.success(tFn('MESSAGE.COMMON.IDM_DELETE_USER_SUCCESS'));
          handleOnchangeUsers();
        }
      } catch {}
      setLoadingDelete(false);
      setDeleteConfirmOpen(false);
    }, [selRows, routeState, handleOnchangeUsers]);

    const handleCancelEdit = useCallback(() => {
      setMetaModal((prev: MetaModal) => ({ ...prev, isOpen: false }));
      temListEvaluators.current = [];
      listChangeOptinals.current = [];
    }, []);

    const handleSearchSavePopUp = useCallback(() => {
      settingEvaluatorApiService.searchListSettingEvaluator(
        { ...userConds, ...routeState, offset: (userConds.current - 1) * 20 },
        (res: any) => {
          setUserList(res?.data || []);
          setUserTotal(res?.counts || 0);
        },
        setLoading,
      );
    }, [userConds, routeState]);

    const handleOpenException = useCallback((record: any) => {
      setUserInfor({
        id: record.userId,
        fullName: `${record.employeeNumber ?? ''}: ${record.fullName ?? ''}`,
        email: record.email ?? '',
        company: record.company?.name ?? '',
        department:
          (record.evaluatorDefault?.level ?? 0) > 7
            ? record.evaluatorDefault?.divisionName ?? ''
            : record.evaluatorDefault?.departmentName ?? '',
      });
      setPopupData(record.childrens || []);
      setEvaluatorDefaultEmails({
        evaluator05Email: record.evaluatorDefault?.evaluator05?.email ?? undefined,
        evaluator10Email: record.evaluatorDefault?.evaluator1?.email ?? undefined,
        evaluator20Email: record.evaluatorDefault?.evaluator2?.email ?? undefined,
      });
      setIsPopupEdit(false);
      setOpenPopUp(true);
    }, []);

    const fmt = useCallback(
      (d: string) => {
        const p = parseDate(d);
        return p ? p.format(dateFormat) : d;
      },
      [dateFormat],
    );

    return (
      <>
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: ITEM_SPACING, padding: '4px 12px' }}
          message={<span style={{ fontSize: FONT_SIZE }}>{TARGET_MESSAGES[tabMode]}</span>}
        />

        <Card size="small" style={{ marginBottom: ITEM_SPACING, borderRadius: 8 }}>
          <SettingEvaluatorSearchForm
            form={searchForm}
            conditions={userConds}
            setConditions={setUserConds}
            setDataSources={() => {}}
            isLoading={isLoading}
            listDepartment={listDepartment}
            setSelectedRowKeys={setSelKeys}
            state={routeState}
            setSelectedRows={setSelRows}
            listSkill={listSkills}
            divisionList={divisionList}
          />
        </Card>

        <Space style={{ marginBottom: ITEM_SPACING }} wrap size={24}>
          <Button type="primary" icon={<PlusOutlined />} disabled={isLocked} onClick={() => setOpenPopupAddUser(true)}>
            {tFn('IDS_ADD_USER')}
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={selKeys.length === 0 || isLocked}
            onClick={() => setDeleteConfirmOpen(true)}
          >
            {tFn('IDS_BUTTON_DELETE_MULTIPLE')}
          </Button>
          <Button
            type="primary"
            size="middle"
            icon={<EditOutlined />}
            disabled={selKeys.length === 0 || isLocked}
            onClick={() =>
              setMetaModal((prev: MetaModal) => ({
                ...prev,
                isOpen: true,
                title: selRows.length > 1 ? tFn('IDS_EDIT_EVALUATOR_MULTIPLE') : tFn('IDS_EDIT_EVALUATOR'),
              }))
            }
          >
            {tFn('IDS_BUTTON_EDIT_MULTIPLE')}
          </Button>
        </Space>

        {tabMode === 'all' && (
          <div>
            <Space size={20} style={{ marginBottom: 15 }}>
              <Space size={6}>
                <WarningOutlined style={{ color: '#faad14', fontSize: 14 }} />
                <span style={{ fontSize: 14, color: '#555' }}>個人設定</span>
              </Space>
              <Space size={6}>
                <WarningOutlined style={{ color: '#1677ff', fontSize: 14 }} />
                <span style={{ fontSize: 14, color: '#555' }}>部署別設定</span>
              </Space>
            </Space>
          </div>
        )}
        <Spin spinning={isLoading}>
          <Table
            dataSource={userList}
            rowKey={(r: any) => r.userId ?? r.key}
            size="small"
            bordered
            style={{ borderRadius: 8, overflow: 'hidden' }}
            pagination={false}
            scroll={{ x: 1500 }}
            expandable={{
              showExpandColumn: false,
              rowExpandable: (r: any) => (r?.childrens?.length || 0) > 1,
              expandedRowKeys: userList
                .filter((r: any) => (r?.childrens?.length || 0) > 1)
                .map((r: any) => r.userId ?? r.key),
              expandedRowRender: (record: any) => {
                const children: any[] = record.childrens || [];
                const childColumns = [
                  {
                    title: tFn('IDS_FULLNAME'),
                    key: 'childName',
                    width: 280,
                    render: (_: any, c: any) => (
                      <Space direction="vertical" size={1}>
                        <Typography.Text style={{ fontSize: FONT_SIZE }}>
                          <span style={{ color: '#888' }}>{record.employeeNumber}</span>
                          {': '}
                          <span style={{ fontWeight: 600 }}>{record.fullName}</span>
                        </Typography.Text>
                        {c.dateCreationGoalStart && (
                          <Typography.Text style={{ fontSize: FONT_SIZE, color: '#555', whiteSpace: 'nowrap' }}>
                            目標設定: {fmt(c.dateCreationGoalStart)} ～ {fmt(c.dateCreationGoalEnd ?? '')}
                          </Typography.Text>
                        )}
                        {c.dateEvaluationStart && (
                          <Typography.Text style={{ fontSize: FONT_SIZE, color: '#555', whiteSpace: 'nowrap' }}>
                            評価実施: {fmt(c.dateEvaluationStart)} ～ {fmt(c.dateEvaluationEnd ?? '')}
                          </Typography.Text>
                        )}
                      </Space>
                    ),
                  },
                  {
                    title: tFn('IDS_DEPARTMENT'),
                    key: 'childDept',
                    width: 350,
                    render: (_: any, c: any) => (
                      <Space direction="vertical" size={2}>
                        {c.divisionName && (
                          <Typography.Text style={{ fontSize: FONT_SIZE }}>
                            <Tag color="geekblue" style={{ marginRight: 5, fontSize: FONT_SIZE }}>
                              部署
                            </Tag>
                            {c.divisionName}
                          </Typography.Text>
                        )}
                        {c.departmentName && (
                          <Typography.Text style={{ fontSize: FONT_SIZE }}>
                            <Tag color="cyan" style={{ marginRight: 5, fontSize: FONT_SIZE }}>
                              課名
                            </Tag>
                            {c.departmentName}
                          </Typography.Text>
                        )}
                        {!c.divisionName && !c.departmentName && <span style={{ color: '#ccc' }}>—</span>}
                      </Space>
                    ),
                  },
                  {
                    title: tFn('IDS_LEVEL'),
                    key: 'childLevel',
                    align: 'center' as const,
                    width: 50,
                    render: (_: any, c: any) => (c.level ? <>{c.level}</> : <span style={{ color: '#ccc' }}>—</span>),
                  },
                  {
                    title: tFn('IDS_EVALUATION_SKILL'),
                    key: 'childFlagSkill',
                    align: 'center' as const,
                    width: 60,
                    render: (_: any, c: any) =>
                      c.flagSkill === 1 ? (
                        <Tag color="success" style={{ margin: 0 }}>
                          {tFn('IDS_HAVE')}
                        </Tag>
                      ) : (
                        <Tag color="default" style={{ margin: 0 }}>
                          {tFn('IDS_NOT_HAVE')}
                        </Tag>
                      ),
                  },
                  {
                    title: tFn('IDS_EVALUATOR'),
                    key: 'childEvaluator',
                    width: 320,
                    render: (_: any, c: any) => {
                      const evaluatorList: any[] = c.evaluator || [];
                      const orderLabels = [
                        { key: 0.5, label: tFn('IDS_POINT_EVALUATOR_0_5'), color: 'volcano' },
                        { key: 1, label: tFn('IDS_POINT_EVALUATOR_1'), color: 'blue' },
                        { key: 2, label: tFn('IDS_POINT_EVALUATOR_2'), color: 'green' },
                      ];
                      const items = orderLabels.flatMap(({ key, label, color }) => {
                        const ev = evaluatorList.find((e) => e.evaluationOrder === key);
                        if (!ev?.user) return [];
                        return [{ label, val: `${ev.user.employeeNumber}: ${ev.user.fullName}`, color }];
                      });
                      if (!items.length) return <span style={{ color: '#ccc', fontSize: FONT_SIZE }}>—</span>;
                      return (
                        <Space direction="vertical" size={2}>
                          {items.map((item, i) => (
                            <Typography.Text key={i} style={{ fontSize: FONT_SIZE }}>
                              <Tag color={item.color} style={{ margin: 0, fontSize: FONT_SIZE }}>
                                {item.label}
                              </Tag>{' '}
                              {item.val}
                            </Typography.Text>
                          ))}
                        </Space>
                      );
                    },
                  },
                  {
                    title: tFn('IDS_TEMPLATE'),
                    key: 'childTemplate',
                    width: 360,
                    render: (_: any, c: any) => {
                      const skills: string[] = (c.skillUser || [])
                        .filter((item: any) => item?.evaluationId == null)
                        .map((v: any) => v?.skill?.name)
                        .filter(Boolean);
                      if (!skills.length) return <span style={{ color: '#ccc', fontSize: FONT_SIZE }}>—</span>;
                      return (
                        <Space wrap size={4}>
                          {skills.map((name: string, i: number) => (
                            <Tooltip key={i} title={name}>
                              <Tag
                                color="purple"
                                style={{
                                  margin: 0,
                                  maxWidth: 200,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  fontSize: FONT_SIZE,
                                }}
                              >
                                {name}
                              </Tag>
                            </Tooltip>
                          ))}
                        </Space>
                      );
                    },
                  },
                ];
                return (
                  <Table
                    columns={childColumns}
                    dataSource={children}
                    rowKey={(c: any) => c.key || c.id}
                    pagination={false}
                    size="small"
                    bordered
                    style={{ margin: '0 0 0 10px' }}
                  />
                );
              },
            }}
            rowSelection={{
              selectedRowKeys: selKeys,
              onChange: (keys, rows) => {
                setSelKeys(keys);
                setSelRows(rows);
              },
              columnWidth: 15,
            }}
            columns={[
              {
                title: ' ',
                key: 'exception',
                width: 20,
                fixed: 'left' as const,
                align: 'center' as const,
                render: (_: any, record: any) => (
                  <Tooltip title={'編集'}>
                    <EditOutlined
                      style={{ color: '#007240', cursor: 'pointer' }}
                      onClick={() => handleOpenException(record)}
                    />
                  </Tooltip>
                ),
              },
              {
                title: tFn('IDS_FULLNAME'),
                key: 'user',
                width: 170,
                fixed: 'left' as const,
                render: (_: any, record: any) => {
                  const ev = record.evaluatorDefault;
                  const goalStart = ev?.dateCreationGoalStart;
                  const goalEnd = ev?.dateCreationGoalEnd;
                  const evalStart = ev?.dateEvaluationStart;
                  const evalEnd = ev?.dateEvaluationEnd;

                  return (
                    <Space direction="vertical" size={1}>
                      <Space size={4} align="center" wrap>
                        <Typography.Text style={{ fontSize: FONT_SIZE }}>
                          <span style={{ color: '#888' }}>{record.employeeNumber}</span>
                          {': '}
                          <span style={{ fontWeight: 600 }}>{record.fullName}</span>
                        </Typography.Text>

                        {tabMode === 'all' && record.settingType === 'personal' && (
                          <Tooltip title="個人設定" color="orange">
                            <WarningOutlined style={{ color: '#faad14', fontSize: 14, cursor: 'pointer' }} />
                          </Tooltip>
                        )}
                        {tabMode === 'all' && record.settingType === 'department' && (
                          <Tooltip title="部署別設定" color="blue">
                            <WarningOutlined style={{ color: '#1677ff', fontSize: 14, cursor: 'pointer' }} />
                          </Tooltip>
                        )}
                      </Space>
                      {!(record.childrens?.length > 0) && goalStart && (
                        <Typography.Text style={{ fontSize: FONT_SIZE, color: '#555', whiteSpace: 'nowrap' }}>
                          目標設定: {fmt(goalStart)} ～ {fmt(goalEnd ?? '')}
                        </Typography.Text>
                      )}
                      {!(record.childrens?.length > 0) && evalStart && (
                        <Typography.Text style={{ fontSize: FONT_SIZE, color: '#555', whiteSpace: 'nowrap' }}>
                          評価実施: {fmt(evalStart)} ～ {fmt(evalEnd ?? '')}
                        </Typography.Text>
                      )}
                    </Space>
                  );
                },
              },
              {
                title: tFn('IDS_DEPARTMENT'),
                key: 'dept',
                width: 150,
                fixed: 'left' as const,
                render: (_: any, record: any) => {
                  const divName = record.evaluatorDefault?.divisionName;
                  const deptName = record.evaluatorDefault?.departmentName;
                  return (
                    <Space direction="vertical" size={2}>
                      {divName && (
                        <Typography.Text style={{ fontSize: FONT_SIZE }}>
                          <Tag color="geekblue" style={{ marginRight: 5, fontSize: FONT_SIZE }}>
                            部署
                          </Tag>
                          {divName}
                        </Typography.Text>
                      )}
                      {deptName && (
                        <Typography.Text style={{ fontSize: FONT_SIZE }}>
                          <Tag color="cyan" style={{ marginRight: 5, fontSize: FONT_SIZE }}>
                            課名
                          </Tag>
                          {deptName}
                        </Typography.Text>
                      )}
                      {!divName && !deptName && <span style={{ color: '#ccc' }}>—</span>}
                    </Space>
                  );
                },
              },
              {
                title: tFn('IDS_LEVEL'),
                key: 'level',
                align: 'center' as const,
                width: 25,
                render: (_: any, record: any) => {
                  const lv = record.evaluatorDefault?.level;
                  return lv ? <>{lv}</> : <span style={{ color: '#ccc' }}>—</span>;
                },
              },
              {
                title: tFn('IDS_EVALUATION_SKILL'),
                key: 'flagSkill',
                align: 'center' as const,
                width: 35,
                render: (_: any, record: any) => {
                  const fs = record.evaluatorDefault?.flagSkill;
                  return fs === 1 ? (
                    <Tag color="success" style={{ margin: 0 }}>
                      {tFn('IDS_HAVE')}
                    </Tag>
                  ) : (
                    <Tag color="default" style={{ margin: 0 }}>
                      {tFn('IDS_NOT_HAVE')}
                    </Tag>
                  );
                },
              },
              {
                title: tFn('IDS_EVALUATOR'),
                key: 'evaluator',
                width: 150,
                render: (_: any, record: any) => {
                  if ((record.childrens?.length || 0) > 0)
                    return <span style={{ color: '#ccc', fontSize: FONT_SIZE }}>—</span>;
                  const ev = record.evaluatorDefault;
                  if (!ev) return <span style={{ color: '#ccc', fontSize: FONT_SIZE }}>—</span>;
                  const build = (obj: any) => (obj ? `${obj.employeeNumber}: ${obj.fullName}` : null);
                  const items = [
                    { label: tFn('IDS_POINT_EVALUATOR_0_5'), val: build(ev.evaluator05), color: 'volcano' },
                    { label: tFn('IDS_POINT_EVALUATOR_1'), val: build(ev.evaluator1), color: 'blue' },
                    { label: tFn('IDS_POINT_EVALUATOR_2'), val: build(ev.evaluator2), color: 'green' },
                  ].filter((i) => i.val);
                  if (!items.length) return <span style={{ color: '#ccc', fontSize: FONT_SIZE }}>—</span>;
                  return (
                    <Space direction="vertical" size={2}>
                      {items.map((item, i) => (
                        <Typography.Text key={i} style={{ fontSize: FONT_SIZE }}>
                          <Tag color={item.color} style={{ margin: 0, fontSize: FONT_SIZE }}>
                            {item.label}
                          </Tag>{' '}
                          {item.val}
                        </Typography.Text>
                      ))}
                    </Space>
                  );
                },
              },
              {
                title: tFn('IDS_TEMPLATE'),
                key: 'template',
                width: 380,
                render: (_: any, record: any) => {
                  const skills: string[] = (record.skillUser || [])
                    .filter((item: any) => item?.evaluationId == null)
                    .map((v: any) => v?.skill?.name)
                    .filter(Boolean);
                  if ((record?.childrens?.length || 0) > 0) return null;
                  if (!skills.length) return <span style={{ color: '#ccc', fontSize: FONT_SIZE }}>—</span>;
                  return (
                    <Space wrap size={4}>
                      {skills.map((name: string, i: number) => (
                        <Tooltip key={i} title={name}>
                          <Tag
                            color="purple"
                            style={{
                              margin: 0,
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontSize: FONT_SIZE,
                            }}
                          >
                            {name}
                          </Tag>
                        </Tooltip>
                      ))}
                    </Space>
                  );
                },
              },
            ]}
          />
          {userTotal > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 12 }}>
              <Pagination
                current={userConds.current}
                pageSize={20}
                total={userTotal}
                showSizeChanger={false}
                showTotal={(total, range) =>
                  `${total}${tFn('IDS_CASE_LABEL')} ${range[0]}-${range[1]}${tFn('IDS_ITEM_LABEL')}`
                }
                onChange={(page) => setUserConds((prev: any) => ({ ...prev, current: page, offset: (page - 1) * 20 }))}
              />
            </div>
          )}
        </Spin>

        {/* ユーザ追加 */}
        <PopupAddUserSettingEvaluator
          state={routeState}
          handleOnchange={handleOnchangeUsers}
          conditions={userConds}
          isOpenPopupAddUser={isOpenPopupAddUser}
          setOpenPopupAddUser={setOpenPopupAddUser}
          divisionList={divisionList}
        />

        {/* 選択削除 confirm */}
        <ModalCustomComponent
          isOpen={isDeleteConfirmOpen}
          header={tFn('POPUP_DIALOG.TITLE.CONFIRM')}
          content={
            <span>
              {tFn('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_USER')}
              <br />
              <Typography.Text type="warning" style={{ fontSize: FONT_SIZE }}>
                ※
                この操作は現在の評価期間に関連するすべての評価データ（評価者設定・例外期間設定を含む）を削除します。他の評価期間には影響しません。
              </Typography.Text>
            </span>
          }
          fnHandleOk={handleDeleteUsers}
          fnHandleCancel={() => setDeleteConfirmOpen(false)}
          okText={tFn('IDS_DELETE') as string}
          cancelText={tFn('IDS_BUTTON_CANCEL') as string}
          loading={isLoadingDelete}
        />

        {/* 選択編集 */}
        <ModalPopup
          bodyStyle={{
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: 'calc(100vh - 150px)',
            maxWidth: 'calc(100vw - 50px)',
          }}
          metaModal={metaModal}
          setMetaModal={setMetaModal}
          width="750px"
          FormModal={
            selRows.length > 1 ? (
              <MultiEditForm
                selectedRecord={selRows}
                handleCancel={handleCancelEdit}
                setSelectedRowKeys={setSelKeys}
                selectedRowKeys={selKeys}
                handleSearch={handleOnchangeUsers}
                setTextNotify={setTextNotify}
                setIsVisibleNotify={setIsVisibleNotify}
                temListEvaluators={temListEvaluators.current}
                state={routeState}
                setSelectedRows={setSelRows}
              />
            ) : (
              <SingleEditForm
                selectedRecord={selRows}
                handleCancel={handleCancelEdit}
                setSelectedRowKeys={setSelKeys}
                selectedRowKeys={selKeys}
                handleSearch={handleSearchSavePopUp}
                listChangeOptinals={listChangeOptinals.current}
                setTextNotify={setTextNotify}
                setIsVisibleNotify={setIsVisibleNotify}
                state={routeState}
                setSelectedRows={setSelRows}
              />
            )
          }
        />

        {/* Edit result notify */}
        <Modal
          title={tFn('POPUP_DIALOG.TITLE.PROCESS_RESULT')}
          open={isVisibleNotify}
          maskClosable={false}
          onCancel={() => setIsVisibleNotify(false)}
          footer={[
            <div key="close" style={{ textAlign: 'right' }}>
              <Button onClick={() => setIsVisibleNotify(false)}>{tFn('IDS_BUTTON_CLOSE')}</Button>
            </div>,
          ]}
        >
          <p dangerouslySetInnerHTML={{ __html: textNotify }} />
        </Modal>

        {/* 評価情報 popup */}
        <Modal
          open={openPopUp}
          maskClosable={false}
          footer={false}
          width="90%"
          destroyOnClose
          onCancel={() => {
            if (!isPopupEdit) setOpenPopUp(false);
            setIsPopupEdit(false);
          }}
        >
          <ExceptionPeriodInfor
            userInfo={userInfor}
            isLoading={isLoading}
            year={routeState?.year}
            periodIndex={routeState?.periodIndex}
            data={popupData}
            periodId={routeState?.periodId}
            isEdit={isPopupEdit}
            setIsEdit={setIsPopupEdit}
            title="評価情報"
            evaluatorDefaultEmails={evaluatorDefaultEmails}
            handleCancelPopUp={() => {
              if (!isPopupEdit) setOpenPopUp(false);
              setIsPopupEdit(false);
            }}
            handleSearchSavePopUp={handleSearchSavePopUp}
            handleClosePopUp={() => setOpenPopUp(false)}
            isFixed={isLocked}
            i18n={i18n}
          />
        </Modal>
      </>
    );
  },
);

TargetSection.displayName = 'TargetSection';

export default TargetSection;
