import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Form,
  Grid,
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

// Single source of truth for the data-column keys/labels shared by the parent
// grid (checkbox + exception + these) and the child grid (just these). Widths
// are NOT fixed — they scale per breakpoint below — but the key/titleId/align
// per column never change, so both grids' templates always derive from the
// same responsive width table and can never drift apart.
type ColumnKey = 'user' | 'dept' | 'level' | 'flagSkill' | 'evaluator' | 'template';
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const columnMetaList: Array<{ key: ColumnKey; titleId: string; align?: 'center' }> = [
  { key: 'user', titleId: 'IDS_FULLNAME' },
  { key: 'dept', titleId: 'IDS_DEPARTMENT' },
  { key: 'level', titleId: 'IDS_LEVEL', align: 'center' },
  { key: 'flagSkill', titleId: 'IDS_EVALUATION_SKILL', align: 'center' },
  { key: 'evaluator', titleId: 'IDS_EVALUATOR' },
  { key: 'template', titleId: 'IDS_TEMPLATE' },
];

// Widths shrink at smaller breakpoints so the table needs less horizontal
// scroll on smaller screens. level/flagSkill stay constant across every
// breakpoint: their content (a 1-2 digit number, or 「あり」「なし」) doesn't get
// any shorter, so shrinking them further would reintroduce header/text wrapping.
// `template` here is only a FLOOR, not the actual rendered width — it grows to
// fill whatever space is left in the container (see templateWidth below).
const COLUMN_WIDTHS_BY_BREAKPOINT: Record<Breakpoint, Record<ColumnKey, number>> = {
  xxl: { user: 300, dept: 335, level: 45, flagSkill: 65, evaluator: 300, template: 600 },
  xl: { user: 300, dept: 250, level: 45, flagSkill: 65, evaluator: 250, template: 280 },
  lg: { user: 200, dept: 200, level: 45, flagSkill: 65, evaluator: 160, template: 240 },
  md: { user: 190, dept: 190, level: 45, flagSkill: 65, evaluator: 150, template: 210 },
  sm: { user: 170, dept: 170, level: 45, flagSkill: 65, evaluator: 140, template: 180 },
  xs: { user: 160, dept: 160, level: 45, flagSkill: 65, evaluator: 130, template: 160 },
};

const CHECKBOX_COL_WIDTH = 20;
const EXCEPTION_COL_WIDTH = 20;
const CHILD_ROW_OFFSET = CHECKBOX_COL_WIDTH + EXCEPTION_COL_WIDTH;

const buildGridTemplate = (widths: number[]) => widths.map((w) => `${w}px`).join(' ');

const gridCellStyle = (align?: 'center'): React.CSSProperties => ({
  padding: '6px',
  borderRight: '1px solid #f0f0f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: align === 'center' ? 'center' : 'flex-start',
  overflow: 'hidden',
  fontSize: 13,
});

// Matches the app-wide antd Table header convention from Table.css
// (`.ant-table-thead tr > th { background: #007240; color: white; text-align: center; }`)
// so this CSS-Grid table's header looks consistent with every other table in the app.
// whiteSpace: 'nowrap' is safe here (unlike data cells) since header labels are
// short, fixed, known strings — wrapping them onto two lines looks broken.
const gridHeaderCellStyle: React.CSSProperties = {
  padding: '6px 4px',
  borderRight: '1px solid #809fa4',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  fontSize: 13,
  color: '#fff',
  whiteSpace: 'nowrap',
};

// Two-layer row: the OUTER div owns the background/borders and gets an
// EXPLICIT pixel width (Math.max(sum-of-columns, measured container width) —
// see useContainerWidth below). The INNER div is the actual CSS grid with
// entirely fixed-px tracks. An explicit number leaves no room for the browser
// to resolve width ambiguously (unlike width:max-content + min-width:100%,
// which in practice left an unclaimed trailing gap on wide screens — visible
// as a phantom extra column on colored rows, invisible-but-still-present on
// white ones). Every row reads from the same measured width, so they can't drift.
const GridRow: React.FC<{
  template: string;
  width: number;
  background: string;
  marginLeft?: number;
  fontWeight?: number;
  emphasizedBottom?: boolean;
  accentLeft?: boolean;
  children: React.ReactNode;
}> = ({ template, width, background, marginLeft, fontWeight, emphasizedBottom, accentLeft, children }) => (
  <div
    style={{
      width,
      marginLeft,
      background,
      borderBottom: emphasizedBottom ? '2px solid #d9d9d9' : '1px solid #f0f0f0',
      borderLeft: accentLeft ? '3px solid #91caff' : undefined,
    }}
  >
    <div style={{ display: 'grid', gridTemplateColumns: template, fontWeight }}>{children}</div>
  </div>
);

interface TargetSectionProps {
  tabMode: 'company' | 'department' | 'personal' | 'all';
  routeState: any;
  isLocked: boolean;
  isEvaluationTime?: boolean;
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
  ({
    tabMode,
    routeState,
    isLocked,
    isEvaluationTime,
    isActive,
    divisionList,
    listDepartment,
    listSkills,
    i18n,
    onAfterImport,
  }) => {
    const dateFormat = i18n.language === 'ja' ? 'YYYY/M/D' : i18n.language === 'en' ? 'YYYY/D/M' : 'D/M/YYYY';

    // Screen-based responsive breakpoints (antd's standard xs/sm/md/lg/xl/xxl),
    // used to pick column widths for the CSS-Grid table below.
    const screens = Grid.useBreakpoint();
    const currentBreakpoint: Breakpoint = screens.xxl
      ? 'xxl'
      : screens.xl
      ? 'xl'
      : screens.lg
      ? 'lg'
      : screens.md
      ? 'md'
      : screens.sm
      ? 'sm'
      : 'xs';
    const columnWidths = COLUMN_WIDTHS_BY_BREAKPOINT[currentBreakpoint];

    // Explicit row width = max(sum of this row's columns, the actual measured
    // width of the horizontal-scroll container). Using a real measured number
    // (rather than CSS width:max-content/min-width:100%) avoids relying on the
    // browser's grid intrinsic-size resolution, which in practice left a
    // trailing gap unclaimed by any column on wide screens.
    const scrollWrapperRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    useLayoutEffect(() => {
      const el = scrollWrapperRef.current;
      if (!el) return undefined;
      const observer = new ResizeObserver((entries) => setContainerWidth(entries[0].contentRect.width));
      observer.observe(el);

      return () => observer.disconnect();
    }, []);

    // The last column (template) isn't a fixed width — it absorbs whatever
    // space is left after the other columns and the measured container width,
    // so it keeps growing to fill wide screens instead of leaving unused space
    // after it. columnWidths.template is only the floor (used when the
    // container is too narrow to give it any extra room, at which point the
    // row exceeds the container and the ancestor's horizontal scroll kicks in).
    const fixedColumnsWidth =
      CHECKBOX_COL_WIDTH +
      EXCEPTION_COL_WIDTH +
      columnMetaList.filter((c) => c.key !== 'template').reduce((sum, c) => sum + columnWidths[c.key], 0);
    const templateWidth = Math.max(columnWidths.template, containerWidth - fixedColumnsWidth);
    const dataColumnList = useMemo(
      () =>
        columnMetaList.map((col) => ({
          ...col,
          width: col.key === 'template' ? templateWidth : columnWidths[col.key],
        })),
      [columnWidths, templateWidth],
    );
    const parentGridTemplate = useMemo(
      () => buildGridTemplate([CHECKBOX_COL_WIDTH, EXCEPTION_COL_WIDTH, ...dataColumnList.map((c) => c.width)]),
      [dataColumnList],
    );
    const childGridTemplate = useMemo(() => buildGridTemplate(dataColumnList.map((c) => c.width)), [dataColumnList]);

    const parentColumnsWidth =
      CHECKBOX_COL_WIDTH + EXCEPTION_COL_WIDTH + dataColumnList.reduce((s, c) => s + c.width, 0);
    const childColumnsWidth = dataColumnList.reduce((s, c) => s + c.width, 0);
    const parentRowWidth = Math.max(parentColumnsWidth, containerWidth);
    const childRowWidth = Math.max(childColumnsWidth, containerWidth - CHILD_ROW_OFFSET);

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
            if (newConds.department && newConds.department !== tFn('IDS_ALL')) next.set('ts_dept', newConds.department);
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

    const renderParentUserCell = (record: any) => {
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
              <span>{record.fullName}</span>
            </Typography.Text>
            {tabMode === 'all' && record.settingType === 'personal' && (
              <Tooltip title={tFn('IDS_PERSONAL_SETTING')} overlayInnerStyle={{ fontSize: 11 }} color="#424242">
                <WarningOutlined style={{ color: '#faad14', fontSize: 14, cursor: 'pointer' }} />
              </Tooltip>
            )}
            {tabMode === 'all' && record.settingType === 'department' && (
              <Tooltip title={tFn('IDS_DEPT_SETTING')} overlayInnerStyle={{ fontSize: 11 }} color="#424242">
                <WarningOutlined style={{ color: '#1677ff', fontSize: 14, cursor: 'pointer' }} />
              </Tooltip>
            )}
          </Space>
          {!(record.childrens?.length > 0) && goalStart && (
            <Typography.Text>
              {tFn('IDS_AIM_SETTING')}: {fmt(goalStart)} ～ {fmt(goalEnd ?? '')}
            </Typography.Text>
          )}
          {!(record.childrens?.length > 0) && evalStart && (
            <Typography.Text>
              {tFn('IDS_EVALUATION_IMPLEMENTATION')}: {fmt(evalStart)} ～ {fmt(evalEnd ?? '')}
            </Typography.Text>
          )}
        </Space>
      );
    };

    const renderParentDeptCell = (record: any) => {
      if ((record.childrens?.length || 0) > 0) return null;
      const divName = record.evaluatorDefault?.divisionName;
      const deptName = record.evaluatorDefault?.departmentName;

      return (
        <Space direction="vertical" size={2}>
          {divName && <Typography.Text>{`${tFn('IDS_DEPARTMENT')}: ${divName}`}</Typography.Text>}
          {deptName && <Typography.Text>{`${tFn('IDS_TYPE_DEPARTMENT_NAME')}: ${deptName ?? '—'}`}</Typography.Text>}
          {!divName && !deptName && <span style={{ color: '#ccc' }}>—</span>}
        </Space>
      );
    };

    const renderParentLevelCell = (record: any) => {
      if ((record.childrens?.length || 0) > 0) return null;
      const lv = record.evaluatorDefault?.level;

      return lv ? <>{lv}</> : <span style={{ color: '#ccc' }}>—</span>;
    };

    const renderParentFlagSkillCell = (record: any) => {
      if ((record.childrens?.length || 0) > 0) return null;
      const fs = record.evaluatorDefault?.flagSkill;

      return fs === 1 ? <>{tFn('IDS_HAVE')}</> : <>{tFn('IDS_NOT_HAVE')}</>;
    };

    const renderParentEvaluatorCell = (record: any) => {
      if ((record.childrens?.length || 0) > 0) return null;
      const ev = record.evaluatorDefault;
      if (!ev) return <span style={{ color: '#ccc' }}>—</span>;
      const build = (obj: any) => (obj ? `${obj.employeeNumber}: ${obj.fullName}` : null);
      const items = [
        { label: tFn('IDS_POINT_EVALUATOR_0_5'), val: build(ev.evaluator05) },
        { label: tFn('IDS_POINT_EVALUATOR_1'), val: build(ev.evaluator1) },
        { label: tFn('IDS_POINT_EVALUATOR_2'), val: build(ev.evaluator2) },
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
    };

    const renderParentTemplateCell = (record: any) => {
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
    };

    const renderChildUserCell = (parent: any, c: any) => (
      <Space direction="vertical" size={1}>
        <Typography.Text>
          <span>{parent.employeeNumber}</span>
          {': '}
          <span>{parent.fullName}</span>
        </Typography.Text>
        {c.dateCreationGoalStart && (
          <Typography.Text>
            {tFn('IDS_AIM_SETTING')}: {fmt(c.dateCreationGoalStart)} ～ {fmt(c.dateCreationGoalEnd ?? '')}
          </Typography.Text>
        )}
        {c.dateEvaluationStart && (
          <Typography.Text>
            {tFn('IDS_EVALUATION_IMPLEMENTATION')}: {fmt(c.dateEvaluationStart)} ～ {fmt(c.dateEvaluationEnd ?? '')}
          </Typography.Text>
        )}
      </Space>
    );

    const renderChildDeptCell = (c: any) => (
      <Space direction="vertical" size={2}>
        {c.divisionName && <Typography.Text>{`${tFn('IDS_DEPARTMENT')}: ${c.divisionName}`}</Typography.Text>}
        {c.departmentName && (
          <Typography.Text>{`${tFn('IDS_TYPE_DEPARTMENT_NAME')}: ${c.departmentName ?? '—'}`}</Typography.Text>
        )}
        {!c.divisionName && !c.departmentName && <span style={{ color: '#ccc' }}>—</span>}
      </Space>
    );

    const renderChildLevelCell = (c: any) => (c.level ? <>{c.level}</> : <span style={{ color: '#ccc' }}>—</span>);

    const renderChildFlagSkillCell = (c: any) =>
      c.flagSkill === 1 ? <>{tFn('IDS_HAVE')}</> : <>{tFn('IDS_NOT_HAVE')}</>;

    const renderChildEvaluatorCell = (c: any) => {
      const evaluatorList: any[] = c.evaluator || [];
      const orderLabels = [
        { key: 0.5, label: tFn('IDS_POINT_EVALUATOR_0_5') },
        { key: 1, label: tFn('IDS_POINT_EVALUATOR_1') },
        { key: 2, label: tFn('IDS_POINT_EVALUATOR_2') },
      ];
      const items = orderLabels.flatMap(({ key, label }) => {
        const ev = evaluatorList.find((e) => e.evaluationOrder === key);
        if (!ev?.user) return [];

        return [{ label, val: `${ev.user.employeeNumber}: ${ev.user.fullName}` }];
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
    };

    const renderChildTemplateCell = (c: any) => {
      const skills: string[] = (c.skillUser || [])
        .filter((item: any) => item?.evaluationId !== null)
        .map((v: any) => v?.skill?.name)
        .filter(Boolean);
      if (!skills.length) return <span style={{ color: '#ccc' }}>—</span>;

      return renderSkillTags(skills);
    };

    const selectableUsers = userList.filter((r: any) => !(tabMode === 'personal' || r.settingType === 'personal'));
    const isAllSelected =
      selectableUsers.length > 0 && selectableUsers.every((r: any) => selKeys.includes(r.userId ?? r.key));
    const isSomeSelected = !isAllSelected && selectableUsers.some((r: any) => selKeys.includes(r.userId ?? r.key));

    const handleSelectAllChange = (checked: boolean) => {
      if (checked) {
        setSelKeys(selectableUsers.map((r: any) => r.userId ?? r.key));
        setSelRows(selectableUsers);
      } else {
        setSelKeys([]);
        setSelRows([]);
      }
    };

    const handleRowCheckChange = (record: any, checked: boolean) => {
      const key = record.userId ?? record.key;
      if (checked) {
        setSelKeys((prev) => [...prev, key]);
        setSelRows((prev) => [...prev, record]);
      } else {
        setSelKeys((prev) => prev.filter((k) => k !== key));
        setSelRows((prev) => prev.filter((r: any) => (r.userId ?? r.key) !== key));
      }
    };

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
          <div style={{ border: '1px solid #f0f0f0', borderRadius: 6, overflow: 'hidden' }}>
            <div ref={scrollWrapperRef} style={{ overflowX: 'auto' }}>
              <GridRow template={parentGridTemplate} width={parentRowWidth} background="#007240" fontWeight={600}>
                <div style={gridHeaderCellStyle}>
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onChange={(e) => handleSelectAllChange(e.target.checked)}
                  />
                </div>
                <div style={gridHeaderCellStyle} />
                {dataColumnList.map((col) => (
                  <div key={col.key} style={gridHeaderCellStyle}>
                    {tFn(col.titleId)}
                  </div>
                ))}
              </GridRow>

              <Spin spinning={isLoading}>
                {userList.length === 0 && (
                  <div style={{ padding: 24, minHeight: 120, textAlign: 'center', color: '#999' }}>
                    {tFn('MESSAGE.COMMON.IDM_EMPTY_DATA')}
                  </div>
                )}
                {userList.map((record: any) => {
                  const key = record.userId ?? record.key;
                  const isPersonal = tabMode === 'personal' || record.settingType === 'personal';
                  const isShowingChildren = (record.childrens?.length || 0) > 0 && isPersonal;

                  return (
                    <React.Fragment key={key}>
                      <GridRow
                        template={parentGridTemplate}
                        width={parentRowWidth}
                        background={'#fff'}
                        emphasizedBottom={!isShowingChildren}
                      >
                        <div style={gridCellStyle('center')}>
                          <Checkbox
                            checked={selKeys.includes(key)}
                            disabled={isPersonal}
                            onChange={(e) => handleRowCheckChange(record, e.target.checked)}
                          />
                        </div>
                        <div style={gridCellStyle('center')}>
                          <Tooltip title={tFn('IDS_EDIT')} overlayInnerStyle={{ fontSize: 11 }} color="#424242">
                            <EditOutlined
                              style={{ color: '#007240', cursor: 'pointer' }}
                              onClick={() => handleOpenException(record)}
                            />
                          </Tooltip>
                        </div>
                        <div style={{ ...gridCellStyle(), color: isPersonal ? 'rgba(0,0,0,0.45)' : undefined }}>
                          {renderParentUserCell(record)}
                        </div>
                        <div style={{ ...gridCellStyle(), color: isPersonal ? 'rgba(0,0,0,0.45)' : undefined }}>
                          {renderParentDeptCell(record)}
                        </div>
                        <div style={{ ...gridCellStyle('center'), color: isPersonal ? 'rgba(0,0,0,0.45)' : undefined }}>
                          {renderParentLevelCell(record)}
                        </div>
                        <div style={{ ...gridCellStyle('center'), color: isPersonal ? 'rgba(0,0,0,0.45)' : undefined }}>
                          {renderParentFlagSkillCell(record)}
                        </div>
                        <div style={{ ...gridCellStyle(), color: isPersonal ? 'rgba(0,0,0,0.45)' : undefined }}>
                          {renderParentEvaluatorCell(record)}
                        </div>
                        <div style={{ ...gridCellStyle(), color: isPersonal ? 'rgba(0,0,0,0.45)' : undefined }}>
                          {renderParentTemplateCell(record)}
                        </div>
                      </GridRow>
                      {isShowingChildren && (
                        <GridRow
                          template={childGridTemplate}
                          width={childRowWidth}
                          background="#0F7A12"
                          marginLeft={CHILD_ROW_OFFSET}
                          fontWeight={600}
                        >
                          {dataColumnList.map((col) => (
                            <div key={col.key} style={gridHeaderCellStyle}>
                              {tFn(col.titleId)}
                            </div>
                          ))}
                        </GridRow>
                      )}
                      {isShowingChildren &&
                        (record.childrens as any[]).map((c: any, childIndex: number) => (
                          <GridRow
                            key={c.key || c.id}
                            template={childGridTemplate}
                            width={childRowWidth}
                            background="#f5faff"
                            marginLeft={CHILD_ROW_OFFSET}
                            accentLeft
                            emphasizedBottom={childIndex === record.childrens.length - 1}
                          >
                            <div style={gridCellStyle()}>{renderChildUserCell(record, c)}</div>
                            <div style={gridCellStyle()}>{renderChildDeptCell(c)}</div>
                            <div style={gridCellStyle('center')}>{renderChildLevelCell(c)}</div>
                            <div style={gridCellStyle('center')}>{renderChildFlagSkillCell(c)}</div>
                            <div style={gridCellStyle()}>{renderChildEvaluatorCell(c)}</div>
                            <div style={gridCellStyle()}>{renderChildTemplateCell(c)}</div>
                          </GridRow>
                        ))}
                    </React.Fragment>
                  );
                })}
              </Spin>
            </div>
          </div>
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
              <Typography.Text type="warning">{tFn('TARGET_SECTION.MSG_DELETE_CONFIRM')}</Typography.Text>
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
          rootClassName="send-mail-modal"
          open={skillsModal.open}
          title={
            <Typography.Title
              level={4}
              style={{
                fontSize: 18,
                fontWeight: 600,
                paddingBottom: 15,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {tFn('IDS_TEMPLATE')}
            </Typography.Title>
          }
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
            title={tFn('IDS_EVALUATION_INFO').toString()}
            evaluatorDefaultEmails={evaluatorDefaultEmails}
            isEvaluationTime={isEvaluationTime}
            skipBackNavigation
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
