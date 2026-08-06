import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  Checkbox,
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
  ImportOutlined,
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

// Single source of truth for the data-column keys/labels/tracks shared by the
// parent grid (checkbox + exception + these) and the child grid (just these,
// indented — see CHILD_ROW_OFFSET below). Each track is `minmax(floor, fr)` —
// a hard lower bound plus a share of whatever space is left — except
// level/flagSkill, which stay a fixed px:
// their content (a 1-2 digit number, or 「あり」「なし」) never gets any shorter,
// so a flexible track there would only ever sit at its floor anyway. Because
// the floor is a real CSS minimum (not a JS-measured `width`), the browser
// itself keeps every column readable and redistributes the rest continuously
// as the viewport resizes, instead of jumping between hand-picked breakpoints.
type ColumnKey = 'user' | 'dept' | 'level' | 'flagSkill' | 'evaluator' | 'template';

const columnMetaList: Array<{ key: ColumnKey; titleId: string; align?: 'center'; track: string }> = [
  { key: 'user', titleId: 'IDS_FULLNAME', track: 'minmax(160px, 1.4fr)' },
  { key: 'dept', titleId: 'IDS_DEPARTMENT', track: 'minmax(150px, 1.3fr)' },
  { key: 'level', titleId: 'IDS_LEVEL', align: 'center', track: '45px' },
  { key: 'flagSkill', titleId: 'IDS_EVALUATION_SKILL', align: 'center', track: '65px' },
  { key: 'evaluator', titleId: 'IDS_EVALUATOR', track: 'minmax(130px, 1.2fr)' },
  { key: 'template', titleId: 'IDS_TEMPLATE', track: 'minmax(160px, 2.4fr)' },
];

const CHECKBOX_COL_WIDTH = 20;
const EXCEPTION_COL_WIDTH = 20;
const CHILD_ROW_OFFSET = CHECKBOX_COL_WIDTH + EXCEPTION_COL_WIDTH;

// Static — computed once at module load, not per-render/per-breakpoint.
const parentGridTemplate = [
  `${CHECKBOX_COL_WIDTH}px`,
  `${EXCEPTION_COL_WIDTH}px`,
  ...columnMetaList.map((c) => c.track),
].join(' ');

// Child rows skip the checkbox/exception columns entirely (children aren't
// individually selectable or exception-editable) and are indented by
// CHILD_ROW_OFFSET instead, so the *data* columns still land under their
// parent-row counterparts — see the width comment on GridRow for how the
// indent avoids breaking that alignment.
const childGridTemplate = columnMetaList.map((c) => c.track).join(' ');

const gridCellStyle = (align?: 'center'): React.CSSProperties => ({
  padding: '6px',
  borderRight: '1px solid #f0f0f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: align === 'center' ? 'center' : 'flex-start',
  overflow: 'hidden',
  fontSize: 13,
});

// Must take the same `align` as the data column's gridCellStyle. Wide
// left-aligned columns (user/dept/evaluator/template) can be hundreds of px
// wide — template alone grows to fill all remaining container width — so a
// header that's unconditionally centered drifts far away from its
// left-aligned data underneath, producing a huge visual gap that gets worse
// the wider the screen/column gets. Only checkbox/edit/level/flagSkill are
// actually centered below, so only those pass align='center' here.
// whiteSpace: 'nowrap' is safe here (unlike data cells) since header labels are
// short, fixed, known strings — wrapping them onto two lines looks broken.
const gridHeaderCellStyle = (align?: 'center'): React.CSSProperties => ({
  padding: '6px 4px',
  borderRight: '1px solid #809fa4',
  display: 'flex',
  alignItems: 'center',
  justifyContent: align === 'center' ? 'center' : 'flex-start',
  overflow: 'hidden',
  fontSize: 13,
  color: '#fff',
  whiteSpace: 'nowrap',
});

// Each row is its own `display: grid` box, so its columns are only
// guaranteed to line up with sibling rows if every row resolves its tracks
// against the *same* width. A bare block box (width: auto) fills its parent,
// so on a narrow viewport where `minmax(floor, fr)` tracks can't shrink
// enough, the grid's content overflows the row's own border-box — and since
// background/border paint on that border-box, the overflowed part renders
// with no color even though the (unclipped) text keeps showing. Sizing each
// row individually to its own content (e.g. `width: max-content` per row)
// "fixes" the color but breaks alignment instead, because each row's content
// differs, so each row would resolve to a different width/track split.
// GridBlock below solves both: it wraps a whole run of same-template rows in
// one `width: max-content` box, so that shared width — driven by the widest
// row in the run — is what every row inside fills via its own `width: 100%`,
// keeping tracks identical across rows while still covering full-width
// backgrounds. No JS-measured width needed.
const GridBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ width: 'max-content', minWidth: '100%' }}>{children}</div>
);

const GridRow: React.FC<{
  template: string;
  background: string;
  marginLeft?: number;
  fontWeight?: number;
  emphasizedBottom?: boolean;
  accentLeft?: boolean;
  children: React.ReactNode;
}> = ({ template, background, marginLeft, fontWeight, emphasizedBottom, accentLeft, children }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: template,

      // A margin-indented child row's `fr` tracks must divide up the same
      // available space as the parent row's *data* columns (total width
      // minus the checkbox/exception columns) to land on the same track
      // sizes — plain `100%` would hand the indented row the full row width
      // instead, over-crediting its `fr` tracks by the margin and drifting
      // every column after the first out of alignment with the parent row.
      width: marginLeft ? `calc(100% - ${marginLeft}px)` : '100%',
      marginLeft,
      background,
      fontWeight,
      borderBottom: emphasizedBottom ? '2px solid #d9d9d9' : '1px solid #f0f0f0',
      borderLeft: accentLeft ? '3px solid #91caff' : undefined,
    }}
  >
    {children}
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
        settingType: parseVal(searchParams.get('ts_st'), tFn('IDS_ALL')),
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
      settingType: urlInit?.settingType ?? tFn('IDS_ALL'),
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

    // 被評価者取り込み: shown instead of the search form/table when this period
    // has no evaluator_default_tbl rows yet (checked via check-import-user).
    const [isDisplayImportButton, setIsDisplayImportButton] = useState(false);
    const [isCheckingImport, setIsCheckingImport] = useState(tabMode === 'all');
    const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
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
            if (newConds.settingType != null && newConds.settingType !== tFn('IDS_ALL'))
              next.set('ts_st', String(newConds.settingType));
            else next.delete('ts_st');
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
        if (tabMode === 'all') {
          // 対象者 tab only: verify whether this period has been imported yet
          // (evaluator_default_tbl) before loading the search form/table.
          settingEvaluatorApiService.checkImportUser(
            routeState,
            (noRecordsYet: boolean) => {
              setIsDisplayImportButton(noRecordsYet);
              if (!noRecordsYet) setUserConds((p: any) => ({ ...p, isSearch: true }));
            },
            setIsCheckingImport,
          );
        } else {
          setUserConds((p: any) => ({ ...p, isSearch: true }));
        }
      }
    }, [isActive]);

    const handleConfirmImportUser = useCallback(async () => {
      setIsImporting(true);
      try {
        const res: any = await httpAxios.Get('/api/v1/f5/management-evaluation-history/import-user', {
          params: routeState,
        });
        if (res?.status === 200) {
          message.success(tFn('MESSAGE.COMMON.IDM_ADD_USER_SUCCESS'));
          setIsDisplayImportButton(false);
          setUserConds((p: any) => ({ ...p, isSearch: true }));
          onAfterImport?.();
        }
      } finally {
        setIsImporting(false);
        setIsImportConfirmOpen(false);
      }
    }, [routeState, onAfterImport]);

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

    const fmt = useCallback((d: string) => {
      const p = parseDate(d);

      return p ? p.format('YYYY/M/D') : d;
    }, []);

    const MAX_VISIBLE_SKILLS = 2;

    const renderSkillTags = useCallback((skills: string[]) => {
      const visible = skills.slice(0, MAX_VISIBLE_SKILLS);
      const hiddenCount = skills.length - MAX_VISIBLE_SKILLS;

      return (
        <Space wrap size={4}>
          {visible.map((name, i) => (
            <Tooltip key={i} title={name} color="#424242" overlayInnerStyle={{ fontSize: 11 }}>
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

      // Normal users (settingType 'company', i.e. not a dept/division-specific
      // setting) follow the period's individual dates for level <= 7 and the
      // period's department dates for level > 7. Dept-specific settings keep
      // their existing dates untouched.
      const useDeptDates = (ev?.level ?? 0) > 7;

      const goalStart = useDeptDates ? ev?.dateCreationGoalDepartmentStart : ev?.dateCreationGoalStart;
      const goalEnd = useDeptDates ? ev?.dateCreationGoalDepartmentEnd : ev?.dateCreationGoalEnd;
      const evalStart = useDeptDates ? ev?.dateEvaluationDepartmentStart : ev?.dateEvaluationStart;
      const evalEnd = useDeptDates ? ev?.dateEvaluationDepartmentEnd : ev?.dateEvaluationEnd;

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

    // 等級 / スキル belong to the evaluation record once the period has generated
    // one (`evaluationCommon`): it snapshots them at generation time and is what
    // the evaluation actually runs on, while evaluator_default_tbl keeps being
    // updated afterwards and drifts away from it. Rows carrying a 個別設定
    // (settingType 'personal') render their per-record values in the child rows
    // below instead, so they return null here and are deliberately left untouched.
    const renderParentLevelCell = (record: any) => {
      if ((record.childrens?.length || 0) > 0) return null;
      const lv = record.evaluationCommon?.level ?? record.evaluatorDefault?.level;

      return lv ? <>{lv}</> : <span style={{ color: '#ccc' }}>—</span>;
    };

    const renderParentFlagSkillCell = (record: any) => {
      if ((record.childrens?.length || 0) > 0) return null;
      const fs = record.evaluationCommon?.flagSkill ?? record.evaluatorDefault?.flagSkill;

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

    // Records with an individual (personal) evaluator setting must not be bulk-edited via
    // 選択編集, since that would overwrite the per-user setting made in the personal tab.
    const hasPersonalSelected = selRows.some((r: any) => r.settingType === 'personal');
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

    // 対象者 tab only: while checking, or once confirmed this period has no
    // evaluator_default_tbl rows yet, show only the 被評価者取り込み button and
    // skip the search form/table entirely.
    const isImportGateVisible = tabMode === 'all' && (isCheckingImport || isDisplayImportButton);

    return (
      <>
        {isImportGateVisible ? (
          <Card size="small" style={{ borderRadius: 6 }}>
            <Spin spinning={isCheckingImport}>
              <div style={{ padding: '12px 0' }}>
                <Button
                  size="middle"
                  type="primary"
                  icon={<ImportOutlined />}
                  disabled={isLocked}
                  onClick={() => setIsImportConfirmOpen(true)}
                >
                  {tFn('IDS_IMPORT_USER')}
                </Button>
              </div>
            </Spin>
          </Card>
        ) : (
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
                isSettingTypeFilterVisible={tabMode === 'all'}
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
                  disabled={selKeys.length === 0 || isLocked || hasPersonalSelected}
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
                <div style={{ overflowX: 'auto' }}>
                  <GridBlock>
                    <GridRow template={parentGridTemplate} background="#007240" fontWeight={600}>
                      <div style={gridHeaderCellStyle('center')}>
                        <Checkbox
                          checked={isAllSelected}
                          indeterminate={isSomeSelected}
                          disabled={isLocked}
                          onChange={(e) => handleSelectAllChange(e.target.checked)}
                        />
                      </div>
                      <div style={gridHeaderCellStyle('center')} />
                      {columnMetaList.map((col) => (
                        <div key={col.key} style={gridHeaderCellStyle(col.align)}>
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
                              background={'#fff'}
                              emphasizedBottom={!isShowingChildren}
                            >
                              <div style={gridCellStyle('center')}>
                                <Checkbox
                                  checked={selKeys.includes(key)}
                                  disabled={isLocked}
                                  onChange={(e) => handleRowCheckChange(record, e.target.checked)}
                                />
                              </div>
                              <div style={gridCellStyle('center')}>
                                <Tooltip title={tFn('IDS_EDIT')} overlayInnerStyle={{ fontSize: 11 }} color="#424242">
                                  <EditOutlined
                                    style={{
                                      color: isLocked ? 'rgba(0,0,0,0.25)' : '#007240',
                                      cursor: isLocked ? 'not-allowed' : 'pointer',
                                    }}
                                    onClick={() => !isLocked && handleOpenException(record)}
                                  />
                                </Tooltip>
                              </div>
                              <div style={{ ...gridCellStyle(), color: isPersonal ? 'rgba(0,0,0,0.45)' : undefined }}>
                                {renderParentUserCell(record)}
                              </div>
                              <div style={{ ...gridCellStyle(), color: isPersonal ? 'rgba(0,0,0,0.45)' : undefined }}>
                                {renderParentDeptCell(record)}
                              </div>
                              <div
                                style={{
                                  ...gridCellStyle('center'),
                                  color: isPersonal ? 'rgba(0,0,0,0.45)' : undefined,
                                }}
                              >
                                {renderParentLevelCell(record)}
                              </div>
                              <div
                                style={{
                                  ...gridCellStyle('center'),
                                  color: isPersonal ? 'rgba(0,0,0,0.45)' : undefined,
                                }}
                              >
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
                              <>
                                <GridRow
                                  template={childGridTemplate}
                                  background="#0F7A12"
                                  marginLeft={CHILD_ROW_OFFSET}
                                  fontWeight={600}
                                >
                                  {columnMetaList.map((col) => (
                                    <div key={col.key} style={gridHeaderCellStyle(col.align)}>
                                      {tFn(col.titleId)}
                                    </div>
                                  ))}
                                </GridRow>
                                {(record.childrens as any[]).map((c: any, childIndex: number) => (
                                  <GridRow
                                    key={c.key || c.id}
                                    template={childGridTemplate}
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
                              </>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </Spin>
                  </GridBlock>
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
          </>
        )}

        {/* 被評価者取り込み confirm */}
        <ModalCustomComponent
          isOpen={isImportConfirmOpen}
          header={tFn('POPUP_DIALOG.TITLE.CONFIRM')}
          content={(tFn('POPUP_DIALOG.CONTENT.IDM_CONFIRM_IMPORT_USER') as string).replace(
            '{timePeriod}',
            routeState?.title ?? '',
          )}
          fnHandleOk={handleConfirmImportUser}
          fnHandleCancel={() => setIsImportConfirmOpen(false)}
          okText={tFn('IDS_BUTTON_IMPORT') as string}
          cancelText={tFn('IDS_BUTTON_CANCEL') as string}
          loading={isImporting}
        />

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
