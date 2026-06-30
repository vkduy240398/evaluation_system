import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  Form,
  message,
  Modal,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import PaginationUserList from '../../../../../views/admin/user-management/user-list/user-list/PaginationUserList';
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
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
const TARGET_MESSAGES: Record<string, string> = {
  company: tFn('TARGET_SECTION.MSG_COMPANY'),
  department: tFn('TARGET_SECTION.MSG_DEPARTMENT'),
  personal: tFn('TARGET_SECTION.MSG_PERSONAL'),
  all: tFn('TARGET_SECTION.MSG_ALL'),
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
    const tableWrapperRef = useRef<HTMLDivElement>(null);
    const [childTableMarginLeft, setChildTableMarginLeft] = useState<number | null>(null);

    const [searchParams, setSearchParams] = useSearchParams();

    // Compute URL-restored conditions once on mount (only for 'all' tabMode = tab 対象者)
    const [urlInit] = useState<any>(() => {
      if (tabMode !== 'all') return null;
      const parseVal = (val: string | null, def: any): any => {
        if (val == null) return def;
        const n = Number(val);
        return !isNaN(n) && val !== '' ? n : val;
      };
      const pageStr = searchParams.get('ts_page');
      const current = pageStr ? Number(pageStr) : 1;
      return {
        userName: searchParams.get('ts_un') || '',
        evaluatorName: searchParams.get('ts_en') || '',
        department: searchParams.get('ts_dept') || tFn('IDS_ALL'),
        divisionId: searchParams.get('ts_divId') ? Number(searchParams.get('ts_divId')) : null,
        departmentId: searchParams.get('ts_deptId') ? Number(searchParams.get('ts_deptId')) : null,
        skill: parseVal(searchParams.get('ts_skill'), tFn('IDS_ALL')),
        level: parseVal(searchParams.get('ts_level'), tFn('IDS_ALL')),
        flagSkill: parseVal(searchParams.get('ts_flagSkill'), tFn('IDS_ALL')),
        current,
        offset: (current - 1) * 20,
      };
    });

    const measureIndent = useCallback(() => {
      const el = tableWrapperRef.current;
      if (!el) return;
      // ths order (showExpandColumn: false): selection[0], exception[1], user[2]
      const ths = el.querySelectorAll<HTMLElement>('.ant-table-thead th');
      if (ths.length < 3) return;
      const tableEl = el.querySelector<HTMLElement>('table');
      if (!tableEl) return;
      const tableLeft = tableEl.getBoundingClientRect().left;
      const userThLeft = ths[2].getBoundingClientRect().left;
      // 4px (expanded row <td> padding-left) + 40px (inner .ant-table margin-inline-start from zero-padding-expanded-row rule)
      setChildTableMarginLeft(userThLeft - tableLeft - 44);
    }, []);

    const [searchForm] = Form.useForm();
    const [userConds, setUserConds] = useState<any>({
      offset: urlInit?.offset ?? 0,
      limit: 20,
      current: urlInit?.current ?? 1,
      department: urlInit?.department ?? tFn('IDS_ALL'),
      userName: urlInit?.userName ?? '',
      evaluatorName: urlInit?.evaluatorName ?? '',
      level: urlInit?.level ?? tFn('IDS_ALL'),
      flagSkill: urlInit?.flagSkill ?? tFn('IDS_ALL'),
      skill: urlInit?.skill ?? tFn('IDS_ALL'),
      exception: tabMode === 'personal' ? 1 : tabMode === 'all' ? undefined : 0,
      tabMode,
      divisionId: urlInit?.divisionId ?? null,
      departmentId: urlInit?.departmentId ?? null,
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
    const [skillsModal, setSkillsModal] = useState<{ open: boolean; skills: string[] }>({ open: false, skills: [] });

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

    // Saves search conditions to URL params (only for 'all' tabMode = tab 対象者)
    const handleSetUserCondsWithUrl = useCallback(
      (newConds: any) => {
        setUserConds(newConds);
        if (tabMode !== 'all' || !newConds.isSearch) return;
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev.toString());
            if (newConds.userName) next.set('ts_un', newConds.userName);
            else next.delete('ts_un');
            if (newConds.evaluatorName) next.set('ts_en', newConds.evaluatorName);
            else next.delete('ts_en');
            if (newConds.department && newConds.department !== tFn('IDS_ALL'))
              next.set('ts_dept', newConds.department);
            else next.delete('ts_dept');
            if (newConds.divisionId != null) next.set('ts_divId', String(newConds.divisionId));
            else next.delete('ts_divId');
            if (newConds.departmentId != null) next.set('ts_deptId', String(newConds.departmentId));
            else next.delete('ts_deptId');
            if (newConds.skill != null && newConds.skill !== tFn('IDS_ALL'))
              next.set('ts_skill', String(newConds.skill));
            else next.delete('ts_skill');
            if (newConds.level != null && newConds.level !== tFn('IDS_ALL'))
              next.set('ts_level', String(newConds.level));
            else next.delete('ts_level');
            if (newConds.flagSkill != null && newConds.flagSkill !== tFn('IDS_ALL'))
              next.set('ts_flagSkill', String(newConds.flagSkill));
            else next.delete('ts_flagSkill');
            next.delete('ts_page');
            return next;
          },
          { replace: true, state: routeState },
        );
      },
      [tabMode, setSearchParams, routeState],
    );

    const handlePageChange = useCallback(
      (page: number) => {
        setUserConds((prev: any) => ({ ...prev, current: page, offset: (page - 1) * 20 }));
        if (tabMode === 'all') {
          setSearchParams(
            (prev) => {
              const next = new URLSearchParams(prev.toString());
              if (page > 1) next.set('ts_page', String(page));
              else next.delete('ts_page');
              return next;
            },
            { replace: true, state: routeState },
          );
        }
      },
      [tabMode, setSearchParams, routeState],
    );

    const temListEvaluators = useRef<any[]>([]);
    const listChangeOptinals = useRef<any[]>([]);
    const hasInitialized = useRef(false);
    const modalResetTrigger = useRef(false);
    const [modalResetKey, setModalResetKey] = useState(0);

    // Re-measure khi data load xong (column widths có thể thay đổi theo content)
    useEffect(() => {
      measureIndent();
    }, [userList, measureIndent]);

    // Re-measure khi resize window
    useEffect(() => {
      window.addEventListener('resize', measureIndent);
      return () => window.removeEventListener('resize', measureIndent);
    }, [measureIndent]);

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

    const MAX_VISIBLE_SKILLS = 2;

    const renderSkillTags = useCallback((skills: string[]) => {
      const visible = skills.slice(0, MAX_VISIBLE_SKILLS);
      const hiddenCount = skills.length - MAX_VISIBLE_SKILLS;
      return (
        <Space wrap size={4}>
          {visible.map((name, i) => (
            <Tooltip key={i} title={name}>
              <Tag
                color="purple"
                style={{
                  margin: 0,
                  maxWidth: 200,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {name}
              </Tag>
            </Tooltip>
          ))}
          {hiddenCount > 0 && (
            <Tag
              style={{ margin: 0, cursor: 'pointer', userSelect: 'none' }}
              onClick={(e) => {
                e.stopPropagation();
                setSkillsModal({ open: true, skills });
              }}
            >
              + {hiddenCount} <EllipsisOutlined />
            </Tag>
          )}
        </Space>
      );
    }, []);

    return (
      <>
        <Card size="small" style={{ marginBottom: 20, borderRadius: 6 }}>
          <SettingEvaluatorSearchForm
            form={searchForm}
            conditions={userConds}
            setConditions={handleSetUserCondsWithUrl}
            setDataSources={() => {}}
            isLoading={isLoading}
            listDepartment={listDepartment}
            setSelectedRowKeys={setSelKeys}
            state={routeState}
            setSelectedRows={setSelRows}
            listSkill={listSkills}
            divisionList={divisionList}
            initialDivisionId={urlInit?.divisionId}
            initialDepartmentId={urlInit?.departmentId}
          />
        </Card>
        <Card size="small" style={{ marginBottom: 0, borderRadius: 6 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
            <Button
              size="middle"
              type="primary"
              icon={<PlusOutlined />}
              disabled={isLocked}
              onClick={() => setOpenPopupAddUser(true)}
            >
              {tFn('IDS_ADD_USER')}
            </Button>
            <Button
              size="middle"
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
          </div>

          {tabMode === 'all' && (
            <Space size={12} style={{ marginBottom: 8 }}>
              <Space size={6}>
                <WarningOutlined style={{ color: '#faad14', fontSize: 14 }} />
                <span style={{ fontSize: 14, color: '#555' }}>{tFn('IDS_PERSONAL_SETTING')}</span>
              </Space>
              <Space size={6}>
                <WarningOutlined style={{ color: '#1677ff', fontSize: 14 }} />
                <span style={{ fontSize: 14, color: '#555' }}>{tFn('IDS_DEPT_SETTING')}</span>
              </Space>
            </Space>
          )}
          <div ref={tableWrapperRef}>
            <Spin spinning={isLoading}>
              <Table
                dataSource={userList}
                rowKey={(r: any) => r.userId ?? r.key}
                size="small"
                bordered
                style={{ borderRadius: 6, overflow: 'hidden' }}
                pagination={false}
                scroll={{ x: 1200 }}
                expandable={{
                  showExpandColumn: false,
                  expandedRowClassName: () => 'zero-padding-expanded-row',
                  rowExpandable: (r: any) =>
                    (r?.childrens?.length || 0) > 0 && (tabMode === 'personal' || r?.settingType === 'personal'),
                  expandedRowKeys: userList
                    .filter(
                      (r: any) =>
                        (r?.childrens?.length || 0) > 0 && (tabMode === 'personal' || r?.settingType === 'personal'),
                    )
                    .map((r: any) => r.userId ?? r.key),
                  expandedRowRender: (record: any) => {
                    const children: any[] = record.childrens || [];
                    const childColumns = [
                      {
                        title: tFn('IDS_FULLNAME'),
                        key: 'childName',
                        width: 170,
                        render: (_: any, c: any) => (
                          <Space direction="vertical" size={1}>
                            <Typography.Text>
                              <span style={{}}>{record.employeeNumber}</span>
                              {': '}
                              <span>{record.fullName}</span>
                            </Typography.Text>
                            {c.dateCreationGoalStart && (
                              <Typography.Text style={{ whiteSpace: 'nowrap' }}>
                                {tFn('IDS_AIM_SETTING')}: {fmt(c.dateCreationGoalStart)} ～ {fmt(c.dateCreationGoalEnd ?? '')}
                              </Typography.Text>
                            )}
                            {c.dateEvaluationStart && (
                              <Typography.Text style={{ whiteSpace: 'nowrap' }}>
                                {tFn('IDS_EVALUATION_IMPLEMENTATION')}: {fmt(c.dateEvaluationStart)} ～ {fmt(c.dateEvaluationEnd ?? '')}
                              </Typography.Text>
                            )}
                          </Space>
                        ),
                      },
                      {
                        title: tFn('IDS_DEPARTMENT'),
                        key: 'childDept',
                        width: 200,
                        render: (_: any, c: any) => (
                          <Space direction="vertical" size={2}>
                            {c.divisionName && (
                              <Typography.Text>
                                {`${tFn('IDS_DEPARTMENT')}: ${c.divisionName}`}
                              </Typography.Text>
                            )}
                            {c.departmentName && (
                              <Typography.Text>
                                {`${tFn('IDS_TYPE_DEPARTMENT_NAME')}: ${c.departmentName ?? '—'}`}
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
                        width: 35,
                        render: (_: any, c: any) =>
                          c.level ? <>{c.level}</> : <span style={{ color: '#ccc' }}>—</span>,
                      },
                      {
                        title: tFn('IDS_EVALUATION_SKILL'),
                        key: 'childFlagSkill',
                        align: 'center' as const,
                        width: 50,
                        render: (_: any, c: any) =>
                          c.flagSkill === 1 ? <>{tFn('IDS_HAVE')}</> : <>{tFn('IDS_NOT_HAVE')}</>,
                      },
                      {
                        title: tFn('IDS_EVALUATOR'),
                        key: 'childEvaluator',
                        width: 150,
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
                          if (!items.length) return <span style={{ color: '#ccc' }}>—</span>;
                          return (
                            <Space direction="vertical" size={2}>
                              {items.map((item, i) => (
                                <Typography.Text key={i}>
                                  {item.label}
                                  {': '}
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
                        width: 380,
                        render: (_: any, c: any) => {
                          const skills: string[] = (c.skillUser || [])
                            .filter((item: any) => item?.evaluationId !== null)
                            .map((v: any) => v?.skill?.name)
                            .filter(Boolean);
                          if (!skills.length) return <span style={{ color: '#ccc' }}>—</span>;
                          return renderSkillTags(skills);
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
                        style={childTableMarginLeft !== null ? { marginLeft: childTableMarginLeft } : undefined}
                        scroll={{ x: 1200 }}
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
                  columnWidth: 20,
                  getCheckboxProps: (record: any) => ({
                    disabled: tabMode === 'personal' || record.settingType === 'personal',
                  }),
                }}
                onRow={(record: any) => {
                  const isPersonal = tabMode === 'personal' || record.settingType === 'personal';
                  return isPersonal
                    ? { style: { backgroundColor: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.45)' } }
                    : {};
                }}
                columns={[
                  {
                    title: ' ',
                    key: 'exception',
                    width: 20,
                    fixed: 'left' as const,
                    align: 'center' as const,
                    render: (_: any, record: any) => (
                      <Tooltip
                        title={tFn('IDS_EDIT')}
                        overlayInnerStyle={{
                          fontSize: 11,
                        }}
                        color="#424242"
                      >
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
                    width: 235,
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
                            <Typography.Text>
                              <span>{record.employeeNumber}</span>
                              {': '}
                              <span style={{}}>{record.fullName}</span>
                            </Typography.Text>

                            {tabMode === 'all' && record.settingType === 'personal' && (
                              <Tooltip
                                title={tFn('IDS_PERSONAL_SETTING')}
                                overlayInnerStyle={{ fontSize: 11 }}
                                color="#424242"
                              >
                                <WarningOutlined style={{ color: '#faad14', fontSize: 14, cursor: 'pointer' }} />
                              </Tooltip>
                            )}
                            {tabMode === 'all' && record.settingType === 'department' && (
                              <Tooltip
                                title={tFn('IDS_DEPT_SETTING')}
                                overlayInnerStyle={{ fontSize: 11 }}
                                color="#424242"
                              >
                                <WarningOutlined style={{ color: '#1677ff', fontSize: 14, cursor: 'pointer' }} />
                              </Tooltip>
                            )}
                          </Space>
                          {!(record.childrens?.length > 0) && goalStart && (
                            <Typography.Text style={{ whiteSpace: 'nowrap' }}>
                              {tFn('IDS_AIM_SETTING')}: {fmt(goalStart)} ～ {fmt(goalEnd ?? '')}
                            </Typography.Text>
                          )}
                          {!(record.childrens?.length > 0) && evalStart && (
                            <Typography.Text style={{ whiteSpace: 'nowrap' }}>
                              {tFn('IDS_EVALUATION_IMPLEMENTATION')}: {fmt(evalStart)} ～ {fmt(evalEnd ?? '')}
                            </Typography.Text>
                          )}
                        </Space>
                      );
                    },
                  },
                  {
                    title: tFn('IDS_DEPARTMENT'),
                    key: 'dept',
                    width: 215,
                    render: (_: any, record: any) => {
                      if ((record.childrens?.length || 0) > 0) return null;
                      const divName = record.evaluatorDefault?.divisionName;
                      const deptName = record.evaluatorDefault?.departmentName;
                      return (
                        <Space direction="vertical" size={2}>
                          {divName && (
                            <Typography.Text>
                              {`${tFn('IDS_DEPARTMENT')}: ${divName}`}
                            </Typography.Text>
                          )}
                          {deptName && (
                            <Typography.Text>
                              {`${tFn('IDS_TYPE_DEPARTMENT_NAME')}: ${deptName ?? '—'}`}
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
                    width: 35,
                    render: (_: any, record: any) => {
                      if ((record.childrens?.length || 0) > 0) return null;
                      const lv = record.evaluatorDefault?.level;
                      return lv ? <>{lv}</> : <span style={{ color: '#ccc' }}>—</span>;
                    },
                  },
                  {
                    title: tFn('IDS_EVALUATION_SKILL'),
                    key: 'flagSkill',
                    align: 'center' as const,
                    width: 50,
                    render: (_: any, record: any) => {
                      if ((record.childrens?.length || 0) > 0) return null;
                      const fs = record.evaluatorDefault?.flagSkill;
                      return fs === 1 ? <>{tFn('IDS_HAVE')}</> : <>{tFn('IDS_NOT_HAVE')}</>;
                    },
                  },
                  {
                    title: tFn('IDS_EVALUATOR'),
                    key: 'evaluator',
                    width: 150,
                    render: (_: any, record: any) => {
                      if ((record.childrens?.length || 0) > 0) return null;
                      const ev = record.evaluatorDefault;
                      if (!ev) return <span style={{ color: '#ccc' }}>—</span>;
                      const build = (obj: any) => (obj ? `${obj.employeeNumber}: ${obj.fullName}` : null);
                      const items = [
                        { label: tFn('IDS_POINT_EVALUATOR_0_5'), val: build(ev.evaluator05), color: 'volcano' },
                        { label: tFn('IDS_POINT_EVALUATOR_1'), val: build(ev.evaluator1), color: 'blue' },
                        { label: tFn('IDS_POINT_EVALUATOR_2'), val: build(ev.evaluator2), color: 'green' },
                      ].filter((i) => i.val);
                      if (!items.length) return <span style={{ color: '#ccc' }}>—</span>;
                      return (
                        <Space direction="vertical" size={2}>
                          {items.map((item, i) => (
                            <Typography.Text key={i}>
                              {item.label}
                              {': '}
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
                      if ((record?.childrens?.length || 0) > 0) {
                        const childSkills: string[] = [
                          ...new Set(
                            (record.childrens as any[]).flatMap((c: any) =>
                              (c.skillUser || [])
                                .filter((item: any) => item?.evaluationId == null)
                                .map((v: any) => v?.skill?.name)
                                .filter(Boolean),
                            ),
                          ),
                        ];
                        if (!childSkills.length) return null;
                        return renderSkillTags(childSkills);
                      }
                      const skills: string[] = (record.skillUser || [])
                        .filter((item: any) => item?.evaluationId == null)
                        .map((v: any) => v?.skill?.name)
                        .filter(Boolean);
                      if (!skills.length) return <span style={{ color: '#ccc' }}>—</span>;
                      return renderSkillTags(skills);
                    },
                  },
                ]}
              />
              {userTotal > 0 && (
                <PaginationUserList
                  total={userTotal}
                  pageSize={20}
                  current={userConds.current}
                  isLoading={isLoading}
                  onChange={(page) => handlePageChange(page)}
                  style={{ marginTop: 8 }}
                />
              )}
            </Spin>
          </div>
        </Card>
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
              <Typography.Text type="warning">
                {tFn('TARGET_SECTION.MSG_DELETE_CONFIRM')}
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
          title={tFn('POPUP_DIALOG.TITLE.PROCESS_RESULT') as string}
          open={isVisibleNotify}
          maskClosable={false}
          onCancel={() => setIsVisibleNotify(false)}
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button size="middle" onClick={() => setIsVisibleNotify(false)}>
                {tFn('IDS_BUTTON_CLOSE')}
              </Button>
            </div>
          }
        >
          <p dangerouslySetInnerHTML={{ __html: textNotify }} />
        </Modal>

        {/* テンプレート全件表示 */}
        <Modal
          open={skillsModal.open}
          title={tFn('IDS_TEMPLATE') as string}
          width={800}
          maskClosable={false}
          destroyOnClose
          style={{ top: 20 }}
          onCancel={() => setSkillsModal({ open: false, skills: [] })}
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button size="middle" onClick={() => setSkillsModal({ open: false, skills: [] })}>
                {tFn('IDS_BUTTON_CLOSE')}
              </Button>
            </div>
          }
        >
          <Table
            dataSource={skillsModal.skills.map((name, i) => ({ key: i, name }))}
            pagination={false}
            size="small"
            bordered
            columns={[
              {
                title: tFn('IDS_TEMPLATE'),
                dataIndex: 'name',
                key: 'name',
              },
            ]}
          />
        </Modal>

        {/* 評価情報 popup */}
        <Modal
          open={openPopUp}
          maskClosable={false}
          footer={null}
          width={1000}
          style={{ top: 20 }}
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
            title={tFn('IDS_EVALUATION_INFO')}
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
