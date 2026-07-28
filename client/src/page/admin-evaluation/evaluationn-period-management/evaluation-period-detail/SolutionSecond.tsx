import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Tabs,
  Space,
  Card,
  Form,
  Button,
  Row,
  Col,
  Progress,
  Tag,
  Typography,
  Cascader,
  DatePicker,
  Tooltip,
  Spin,
  Dropdown,
  Modal,
  message,
} from 'antd';
import {
  ApartmentOutlined,
  PlusOutlined,
  EditOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  SaveOutlined,
  MailOutlined,
  ReloadOutlined,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons';
import SendMail from './SendMail';
import evaluationPeriodServices from '../../../../common/api/evaluationPeriod';
import dayjs from 'dayjs';
import { getConditionSearch } from '../../../../views/admin/user-management/user-list/user-list/restApi/conditionSearch';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { t as tFn } from 'i18next';
import userEvaluationApiService from '../../../../common/api/userEvaluation';
import settingEvaluatorApiService from '../../../../common/api/settingEvaluator';
import httpAxios from '../../../../common/http';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import TargetSection from './components/TargetSection';
import DeptEditModal from './components/DeptEditModal';
import DeptAddModal, { SelectedDeptItem } from './components/DeptAddModal';
import PaginationUserList from '../../../../views/admin/user-management/user-list/user-list/PaginationUserList';

const { RangePicker } = DatePicker;

const ITEM_SPACING_DEFAULT = 15;
const BLOCK_SPACING = 15;
const DEPT_MODAL_PAGE_SIZE = 5;
const DEPT_TABLE_PAGE_SIZE = 10;
const FONT_TOOLTIP = 11;

// ── 部署別 grid (mirrors the 対象者 tab's parent/child GridRow+GridBlock pattern —
// see TargetSection.tsx — so division parent rows and department child rows render
// as a real indented block instead of an antd Table expand/collapse tree) ──────
type DeptColumnKey = 'departmentName' | 'progress' | 'goalPeriod' | 'evalPeriod' | 'action';

const deptColumnMetaList: Array<{ key: DeptColumnKey; titleId: string; align?: 'center'; track: string }> = [
  { key: 'departmentName', titleId: 'IDS_DEPARTMENT', track: 'minmax(220px, 1.6fr)' },
  {
    key: 'progress',
    titleId: 'EVALUATION_PERIOD_SCREEN.IDS_IN_PROGRESS_SETTING_EVALUATE',
    track: 'minmax(150px, 1fr)',
  },
  { key: 'goalPeriod', titleId: 'IDS_AIM_SETTING', track: 'minmax(200px, 1.3fr)' },
  { key: 'evalPeriod', titleId: 'IDS_EVALUATION_IMPLEMENTATION', track: 'minmax(200px, 1.3fr)' },
  { key: 'action', titleId: 'IDS_OPERATION', align: 'center', track: '60px' },
];

// Same technique as CHECKBOX/EXCEPTION cols + CHILD_ROW_OFFSET in TargetSection: parent
// rows reserve a leading spacer column of this width, and child rows — whose template
// omits that column — are pushed right by the same amount via GridRow's marginLeft. Both
// rows then resolve the *same* deptColumnMetaList tracks against the *same* remaining
// width, so column boundaries land in identical places instead of merely approximating it.
const DEPT_CHILD_ROW_OFFSET = 40;
const deptDataGridTemplate = deptColumnMetaList.map((c) => c.track).join(' ');
const deptParentGridTemplate = [`${DEPT_CHILD_ROW_OFFSET}px`, deptDataGridTemplate].join(' ');
const deptChildGridTemplate = deptDataGridTemplate;

const deptGridCellStyle = (align?: 'center'): React.CSSProperties => ({
  padding: '8px',
  borderRight: '1px solid #f0f0f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: align === 'center' ? 'center' : 'flex-start',
  overflow: 'hidden',
  fontSize: 13,
});

const deptGridHeaderCellStyle = (align?: 'center'): React.CSSProperties => ({
  padding: '8px 4px',
  borderRight: '1px solid #809fa4',
  display: 'flex',
  alignItems: 'center',
  justifyContent: align === 'center' ? 'center' : 'flex-start',
  overflow: 'hidden',
  fontSize: 13,
  color: '#fff',
  whiteSpace: 'nowrap',
});

const DeptGridBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ width: 'max-content', minWidth: '100%' }}>{children}</div>
);

const DeptGridRow: React.FC<{
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
      // Same width-compensation formula as TargetSection's GridRow: shrinking the row's
      // own width by marginLeft is what makes the marginLeft push visually read as an
      // indent instead of just overflowing the row's container.
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

// dayjs(str, 'YYYY/MM/DD') needs the customParseFormat plugin (not registered here) to parse
// at all — without it, dayjs falls back to native Date parsing and silently returns Invalid
// Date for slash-separated strings. Parse manually instead: split → zero-pad → ISO → dayjs().
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

// Ascending compare for division/department codes (e.g. "D001", "D2") — `numeric: true` makes
// digit runs compare by value instead of lexicographically, so "D2" sorts before "D10".
const compareCode = (a?: string | number | null, b?: string | number | null) =>
  String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true, sensitivity: 'base' });

// Sort key for a top-level 部署別 row (division group or standalone row): division code first
// (so the whole table is grouped by division), department code second within that division.
// A division-group row has no department code of its own — it's a division, not a leaf.
const getDeptSortKey = (row: any): [string, string] => {
  if (row.isDivisionGroup) return [String(row.divisionCode ?? ''), ''];
  if (row.divisionName) return [String(row.divisionCode ?? ''), String(row.departmentCode ?? '')];
  return [String(row.departmentCode ?? ''), ''];
};

interface SolutionSecondProps {
  ITEM_SPACING?: number;
  isFixed: boolean;
  t: any;
  isModalOpenMail: boolean;
  setIsModalOpenMail: React.Dispatch<React.SetStateAction<boolean>>;
}

const SolutionSecond: React.FC<SolutionSecondProps> = ({
  ITEM_SPACING = ITEM_SPACING_DEFAULT,
  isFixed,
  t,
  isModalOpenMail,
  setIsModalOpenMail,
}) => {
  const { state: routeState } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'company';
  const handleTabChange = (key: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev.toString());
        next.set('tab', key);
        return next;
      },
      { replace: true, state: routeState },
    );
  };
  const { i18n } = useTranslation();
  const routeYear = routeState?.year;
  const routePeriodIndex = routeState?.periodIndex;

  // Mail send mode: tracks whether the modal was opened via "今すぐ送信" or "後で送信"
  const [isScheduledSend, setIsScheduledSend] = useState(false);
  const [mailType, setMailType] = useState<string>('');
  const [mailDepartmentId, setMailDepartmentId] = useState<number | undefined>(undefined);
  // Set instead of mailDepartmentId when the 目標設定/評価実施 mail dropdown is opened from a
  // division parent row, so SendMail fetches recipients across every department in the division.
  const [mailDepartmentIds, setMailDepartmentIds] = useState<number[] | undefined>(undefined);
  const [mailDepartmentName, setMailDepartmentName] = useState<string>('');
  const [mailDeptDates, setMailDeptDates] = useState<
    | {
        deptGoalStart?: string;
        deptGoalEnd?: string;
        userGoalStart?: string;
        userGoalEnd?: string;
        deptEvalStart?: string;
        deptEvalEnd?: string;
        userEvalStart?: string;
        userEvalEnd?: string;
      }
    | undefined
  >(undefined);

  // ── Shared data ────────────────────────────────────────────────
  const [listDepartment, setListDepartment] = useState<any[]>([]);
  const [listSkills, setListSkills] = useState<any[]>([]);
  const [divisionList, setDivisionList] = useState<any[]>([]);

  // ── 全社設定 state ─────────────────────────────────────────────
  const [commonForm] = Form.useForm();
  const [periodData, setPeriodData] = useState<any>(null);
  const [savedPeriodData, setSavedPeriodData] = useState<any>(null);
  const [isEditPeriod, setIsEditPeriod] = useState(false);
  const [isLoadingPeriod, setLoadingPeriod] = useState(false);
  const [isConfirmSaveOpen, setConfirmSaveOpen] = useState(false);

  // Once the evaluation period is published (checkFixed === 2), every editing/
  // sending action across all three tabs must be locked, regardless of dates.
  const isLocked = isFixed || periodData?.checkFixed === 2;

  // Same rule as the 例外設定 modal's Add/Delete buttons: once the personal or
  // department evaluation period has started, exception rows can no longer be
  // added/removed from the 評価情報 modal either.
  const isEvaluationTimeStarted = useMemo(() => {
    if (!periodData) return false;
    const isGreaterThanEqualToday = (dateString?: string) => {
      const parsed = parseDate(dateString);

      return parsed ? dayjs().format('YYYYMMDD') >= parsed.format('YYYYMMDD') : false;
    };

    return (
      isGreaterThanEqualToday(periodData.dateEvaluationStart) ||
      isGreaterThanEqualToday(periodData.dateEvaluationDepartmentStart)
    );
  }, [periodData]);

  // ── 部署別設定 state ───────────────────────────────────────────
  const [isDeptModalOpen, setIsDeptModalOpen] = useState<boolean>(false);
  const [deptFilterPath, setDeptFilterPath] = useState<any[]>([]);
  const [deptCascaderValue, setDeptCascaderValue] = useState<any[]>([]);
  const [deptSettingList, setDeptSettingList] = useState<any[]>([]);
  const [isLoadingDept, setLoadingDept] = useState(false);
  const [editDeptRecord, setEditDeptRecord] = useState<any>(null);
  const [editDeptForm] = Form.useForm();
  const [isEditDeptModalOpen, setIsEditDeptModalOpen] = useState(false);
  const [deptModalForm] = Form.useForm();
  const [selectedDeptItems, setSelectedDeptItems] = useState<SelectedDeptItem[]>([]);
  const [modalCascaderValue, setModalCascaderValue] = useState<any[][]>([]);
  const [deptModalTablePage, setDeptModalTablePage] = useState(1);
  const [deptTablePage, setDeptTablePage] = useState(1);
  // Division parent rows start collapsed; the toggle lives in the leading spacer column
  // of the grid (see DEPT_CHILD_ROW_OFFSET) rather than in the 操作 column, which stays
  // dedicated to editing.
  const [expandedDivisionKeys, setExpandedDivisionKeys] = useState<Set<string>>(new Set());

  const toggleDivisionExpanded = (key: string) => {
    setExpandedDivisionKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);

      return next;
    });
  };

  const fmtDate = (value: string | undefined | null): string | undefined | null => {
    const p = parseDate(value);
    return p ? p.format('YYYY/M/D') : value;
  };

  // ── Mail dropdown helper ───────────────────────────────────────
  // Creates a dropdown menu for メール送信 buttons.
  // `type` identifies which section triggered the send (e.g. 'goal', 'evaluation').
  const createMailMenu = (type: string) => ({
    items: [
      { key: '1', label: tFn('IDS_SEND_MAIL_NOW') },
      { key: '2', label: tFn('IDS_SEND_MAIL_SETTING_TIME') },
    ],
    onClick: ({ key }: { key: string }) => {
      setMailType(type);
      setIsScheduledSend(key === '2');
      setMailDepartmentId(undefined);
      setIsModalOpenMail(true);
    },
  });

  // ── 全社設定 handlers ──────────────────────────────────────────

  // Fetches the common period dates for the current evaluation period
  const fetchPeriodData = async () => {
    if (!routeYear || !routePeriodIndex) return;
    const url = `/api/v1/f5/management-evaluation-history/period/${routeYear}/${routePeriodIndex}`;
    await evaluationPeriodServices.getPeriodDetailByCondition(
      url,
      (data: any) => {
        setPeriodData({ ...data });
        setSavedPeriodData({ ...data });
        commonForm.setFieldsValue({
          deptGoalSetting:
            data.dateCreationGoalDepartmentStart && data.dateCreationGoalDepartmentEnd
              ? [parseDate(data.dateCreationGoalDepartmentStart), parseDate(data.dateCreationGoalDepartmentEnd)]
              : undefined,
          userGoalSetting:
            data.dateCreationGoalStart && data.dateCreationGoalEnd
              ? [parseDate(data.dateCreationGoalStart), parseDate(data.dateCreationGoalEnd)]
              : undefined,
          deptEvaluation:
            data.dateEvaluationDepartmentStart && data.dateEvaluationDepartmentEnd
              ? [parseDate(data.dateEvaluationDepartmentStart), parseDate(data.dateEvaluationDepartmentEnd)]
              : undefined,
          userEvaluation:
            data.dateEvaluationStart && data.dateEvaluationEnd
              ? [parseDate(data.dateEvaluationStart), parseDate(data.dateEvaluationEnd)]
              : undefined,
        });
      },
      setLoadingPeriod,
    );
  };

  const hasChangedPeriod = () => {
    if (!periodData || !savedPeriodData) return false;

    return (
      periodData.dateCreationGoalDepartmentStart !== savedPeriodData.dateCreationGoalDepartmentStart ||
      periodData.dateCreationGoalDepartmentEnd !== savedPeriodData.dateCreationGoalDepartmentEnd ||
      periodData.dateCreationGoalStart !== savedPeriodData.dateCreationGoalStart ||
      periodData.dateCreationGoalEnd !== savedPeriodData.dateCreationGoalEnd ||
      periodData.dateEvaluationDepartmentStart !== savedPeriodData.dateEvaluationDepartmentStart ||
      periodData.dateEvaluationDepartmentEnd !== savedPeriodData.dateEvaluationDepartmentEnd ||
      periodData.dateEvaluationStart !== savedPeriodData.dateEvaluationStart ||
      periodData.dateEvaluationEnd !== savedPeriodData.dateEvaluationEnd
    );
  };

  const handleValidateSavePeriod = () => {
    commonForm
      .validateFields()
      .then(() => {
        if (!hasChangedPeriod()) {
          message.info(tFn('MESSAGE.COMMON.IDM_NO_CHANGE'));
          return;
        }
        setConfirmSaveOpen(true);
      })
      .catch(() => {});
  };

  // Saves the common period dates to the server
  const handleSavePeriod = async () => {
    if (!periodData) return;
    await evaluationPeriodServices.savePeriodValues(
      '/api/v1/f5/management-evaluation-history/period/save',
      { condition: { year: String(routeYear), periodIndex: routePeriodIndex }, body: periodData },
      () => {
        message.success(tFn('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
        fetchPeriodData();
        setIsEditPeriod(false);
      },
      setLoadingPeriod,
    );
    setConfirmSaveOpen(false);
  };

  const handleCancelPeriod = () => {
    fetchPeriodData();
    setIsEditPeriod(false);
  };

  // ── 部署別 handlers ────────────────────────────────────────────

  // Fetches the list of department-specific period overrides for this evaluation period
  const fetchDeptSettings = useCallback(async () => {
    if (!routeState?.id) return;
    setLoadingDept(true);
    try {
      const res: any = await httpAxios.Get(`/api/v1/f5/management-evaluation-history/period/department/list`, {
        params: { evaluationPeriodId: routeState.id },
      });
      if (res?.status === 200) setDeptSettingList(res.data ?? []);
    } finally {
      setLoadingDept(false);
    }
  }, [routeState?.id]);

  // Reload button: clears the 部署 cascader filter (and dependent paging/expand state)
  // in addition to refetching, so it acts as a full reset of the tab rather than just
  // a data refresh under whatever filter happens to be applied.
  const handleReloadDeptTab = () => {
    setDeptFilterPath([]);
    setDeptCascaderValue([]);
    setDeptTablePage(1);
    setExpandedDivisionKeys(new Set());
    fetchDeptSettings();
  };

  // Executes the actual API call to save department-specific period overrides.
  // Called directly for department-level saves, or after warning confirmation for division-level.
  const executeDeptSave = async (payload: { evaluationPeriodId: number; departments: any[] }) => {
    setLoadingDept(true);
    try {
      const res: any = await httpAxios.Post('/api/v1/f5/management-evaluation-history/period/department/save', payload);
      if (res?.status === 200) {
        message.success(tFn('EVALUATION_PERIOD_SCREEN.MESSAGE_TOAST_SAVE_SUCCESS'));
        await fetchDeptSettings();
        deptModalForm.resetFields();
        setSelectedDeptItems([]);
        setModalCascaderValue([]);
        setIsDeptModalOpen(false);
      }
    } finally {
      setLoadingDept(false);
    }
  };

  // Builds and saves department-specific period overrides from the add-modal form.
  //
  // Whichever department(s) are picked, only those get saved — a partial pick (e.g. 1 of
  // division A's 6 departments) saves just that 1 row. Only when the selection covers every
  // department of the division (or the division itself has none to expand into) does the
  // save ALSO add a division-level row on top of all the department rows — e.g. picking all
  // 6 departments saves 7 rows total (6 departments + 1 division).
  //
  // Warning via Modal.confirm() (renders at document root, always on top) is shown ONLY when
  // the save would overwrite an existing record (department or division-level) already in
  // deptSettingList. All other cases save immediately without confirmation.
  const handleDeptSubmit = () => {
    deptModalForm
      .validateFields()
      .then(async (values) => {
        if (selectedDeptItems.length === 0) return;

        const datePayload = {
          dateCreationGoalDepartmentStart: values.deptGoalSetting?.[0]?.format('YYYY/MM/DD') ?? null,
          dateCreationGoalDepartmentEnd: values.deptGoalSetting?.[1]?.format('YYYY/MM/DD') ?? null,
          dateCreationGoalStart: values.userGoalSetting?.[0]?.format('YYYY/MM/DD') ?? null,
          dateCreationGoalEnd: values.userGoalSetting?.[1]?.format('YYYY/MM/DD') ?? null,
          dateEvaluationDepartmentStart: values.deptEvaluation?.[0]?.format('YYYY/MM/DD') ?? null,
          dateEvaluationDepartmentEnd: values.deptEvaluation?.[1]?.format('YYYY/MM/DD') ?? null,
          dateEvaluationStart: values.userEvaluation?.[0]?.format('YYYY/MM/DD') ?? null,
          dateEvaluationEnd: values.userEvaluation?.[1]?.format('YYYY/MM/DD') ?? null,
        };

        // A department already saved by an earlier, separate add — keyed by departmentId —
        // so completing a division's coverage across multiple add operations (not just one
        // "select all" submission) can still be detected, and so re-including an
        // already-configured department in this save doesn't blindly overwrite its own
        // 部門目標設定/個人目標設定 once 評価実施 has started (those two fields are frozen).
        const existingByDeptId = new Map<number, any>(deptSettingList.map((d: any) => [d.departmentId, d]));

        const buildGoalAwareDatePayload = (existing: any) => {
          if (isEvaluationTimeStarted && existing) {
            return {
              ...datePayload,
              dateCreationGoalDepartmentStart: existing.dateCreationGoalDepartmentStart ?? null,
              dateCreationGoalDepartmentEnd: existing.dateCreationGoalDepartmentEnd ?? null,
              dateCreationGoalStart: existing.dateCreationGoalStart ?? null,
              dateCreationGoalEnd: existing.dateCreationGoalEnd ?? null,
            };
          }

          return datePayload;
        };

        // Group selected items by top-level division ID
        const divisionMap = new Map<number, { selectedLeafIds: number[] }>();
        selectedDeptItems.forEach((item) => {
          const divId = item.values[0] as number;
          if (!divisionMap.has(divId)) divisionMap.set(divId, { selectedLeafIds: [] });
          if (item.values.length >= 2) {
            divisionMap.get(divId)!.selectedLeafIds.push(item.values[item.values.length - 1] as number);
          }
        });

        const departments: any[] = [];
        let needsWarning = false;

        for (const [divId, { selectedLeafIds }] of divisionMap) {
          const divOption = divisionList.find((d: any) => d.value === divId);
          const realChildren = (divOption?.children || []).filter((c: any) => c.value !== -1);

          if (realChildren.length === 0) {
            // Division has no departments beneath it — nothing to expand into, so add the
            // division itself as the row.
            departments.push({
              departmentId: divId,
              isDivisionLevel: true,
              ...buildGoalAwareDatePayload(existingByDeptId.get(divId)),
            });
            if (deptSettingList.some((d: any) => d.departmentId === divId)) {
              needsWarning = true;
            }
            continue;
          }

          const selectedLeafIdSet = new Set(selectedLeafIds);

          // "Complete" also counts departments already configured by an earlier, separate add
          // — not just the ones picked in this submission — so finishing a division's
          // coverage over several add operations still adds the division-level row, the same
          // as picking every department in one go.
          const isFullyCovered = realChildren.every(
            (child: any) => selectedLeafIdSet.has(child.value) || existingByDeptId.has(child.value),
          );

          let overwrittenIds: Set<number>;

          if (isFullyCovered) {
            // The division-level entry MUST come before its department siblings in the
            // payload: the backend clears every department setting under a division when it
            // processes that division's own entry (to keep the two in sync), so if it ran
            // after the departments in the same request it would immediately wipe them out.
            departments.push({
              departmentId: divId,
              isDivisionLevel: true,
              ...buildGoalAwareDatePayload(existingByDeptId.get(divId)),
            });
            realChildren.forEach((child: any) => {
              departments.push({
                departmentId: child.value,
                isDivisionLevel: false,
                ...buildGoalAwareDatePayload(existingByDeptId.get(child.value)),
              });
            });
            overwrittenIds = new Set<number>([...realChildren.map((c: any) => c.value), divId]);
          } else {
            // Partial selection → save only the specifically chosen departments, nothing else.
            selectedLeafIds.forEach((leafId) => {
              departments.push({
                departmentId: leafId,
                isDivisionLevel: false,
                ...datePayload,
              });
            });
            overwrittenIds = new Set<number>(selectedLeafIds);
          }

          // Warn only when existing records (department or division-level) would be overwritten
          if (deptSettingList.some((d: any) => overwrittenIds.has(d.departmentId))) {
            needsWarning = true;
          }
        }

        const payload = { evaluationPeriodId: routeState?.id, departments };

        if (needsWarning) {
          // instance is assigned right after Modal.confirm() returns;
          // closures inside footer capture the variable reference, not the value,
          // so instance is always populated by the time a button is clicked.
          let instance: ReturnType<typeof Modal.confirm>;
          const okLabel = tFn('IDS_BUTTON_SAVE') as string;
          const cancelLabel = tFn('IDS_BUTTON_CANCEL') as string;
          instance = Modal.confirm({
            title: tFn('POPUP_DIALOG.TITLE.CONFIRM'),
            icon: null,
            type: 'warning',
            content: tFn('IDS_OVERWRITE_DEPT_WARNING'),
            footer: (
              <div style={{ display: 'flex', gap: 8, marginTop: 15 }}>
                <Button
                  size="middle"
                  type="primary"
                  onClick={async () => {
                    instance?.destroy();
                    await executeDeptSave(payload);
                  }}
                >
                  {okLabel}
                </Button>
                <Button size="middle" onClick={() => instance?.destroy()}>
                  {cancelLabel}
                </Button>
              </div>
            ),
          });
        } else {
          await executeDeptSave(payload);
        }
      })
      .catch(() => {});
  };

  // Opens the individual dept edit modal and pre-fills the form with existing dates. For a
  // division parent row (isDivisionGroup), those are the division-level row's own dates (the
  // same ones shown at the parent's 目標設定/評価実施 columns) — editing then applies whatever
  // gets typed to every department in the division, on top of that starting point.
  const handleEditDept = (record: any) => {
    setEditDeptRecord(record);
    editDeptForm.setFieldsValue({
      deptGoalSetting: record.dateCreationGoalDepartmentStart
        ? [parseDate(record.dateCreationGoalDepartmentStart), parseDate(record.dateCreationGoalDepartmentEnd)]
        : undefined,
      userGoalSetting: record.dateCreationGoalStart
        ? [parseDate(record.dateCreationGoalStart), parseDate(record.dateCreationGoalEnd)]
        : undefined,
      deptEvaluation: record.dateEvaluationDepartmentStart
        ? [parseDate(record.dateEvaluationDepartmentStart), parseDate(record.dateEvaluationDepartmentEnd)]
        : undefined,
      userEvaluation: record.dateEvaluationStart
        ? [parseDate(record.dateEvaluationStart), parseDate(record.dateEvaluationEnd)]
        : undefined,
    });
    setIsEditDeptModalOpen(true);
  };

  // For a division-level edit, a blank range means "don't touch this field" — but the
  // save endpoint always upserts full rows (no partial-column update), so "don't touch"
  // has to be implemented by re-sending each child's own existing value for that field
  // rather than omitting it, otherwise it would get nulled out on every child.
  const buildDeptFieldPair = (rangeValue: any, existingStart: any, existingEnd: any) => {
    if (rangeValue?.[0] && rangeValue?.[1]) {
      return { start: rangeValue[0].format('YYYY/MM/DD'), end: rangeValue[1].format('YYYY/MM/DD') };
    }

    return { start: existingStart ?? null, end: existingEnd ?? null };
  };

  // Saves updated dates for a single department override, or — when the edit was opened
  // from a division parent row — applies whichever fields were filled in to every
  // department in that division, leaving the rest of each child's dates untouched.
  const handleSaveEditDept = async () => {
    if (!editDeptRecord) return;
    editDeptForm
      .validateFields()
      .then(async (values) => {
        setLoadingDept(true);
        try {
          let departments: any[];
          if (editDeptRecord.isDivisionGroup) {
            const buildRowFromExisting = (departmentId: number, existing: any) => {
              // Once 評価実施 has started, 部門目標設定/個人目標設定 are frozen — pass undefined
              // regardless of what the (disabled) form fields hold, so buildDeptFieldPair always
              // falls back to preserving each row's own existing value instead of applying
              // whatever the modal forced into the field for display purposes.
              const deptGoal = buildDeptFieldPair(
                isEvaluationTimeStarted ? undefined : values.deptGoalSetting,
                existing?.dateCreationGoalDepartmentStart,
                existing?.dateCreationGoalDepartmentEnd,
              );
              const userGoal = buildDeptFieldPair(
                isEvaluationTimeStarted ? undefined : values.userGoalSetting,
                existing?.dateCreationGoalStart,
                existing?.dateCreationGoalEnd,
              );
              const deptEval = buildDeptFieldPair(
                values.deptEvaluation,
                existing?.dateEvaluationDepartmentStart,
                existing?.dateEvaluationDepartmentEnd,
              );
              const userEval = buildDeptFieldPair(
                values.userEvaluation,
                existing?.dateEvaluationStart,
                existing?.dateEvaluationEnd,
              );

              return {
                departmentId,
                dateCreationGoalDepartmentStart: deptGoal.start,
                dateCreationGoalDepartmentEnd: deptGoal.end,
                dateCreationGoalStart: userGoal.start,
                dateCreationGoalEnd: userGoal.end,
                dateEvaluationDepartmentStart: deptEval.start,
                dateEvaluationDepartmentEnd: deptEval.end,
                dateEvaluationStart: userEval.start,
                dateEvaluationEnd: userEval.end,
              };
            };

            departments = [];

            // Keep the division-level row (the one 目標設定/評価実施 shows at the parent) in
            // sync too — creating it if this division never had one, since editing from the
            // parent should update every department PLUS the division itself. This MUST be
            // pushed before the department entries below: the backend clears every department
            // setting under a division when it processes that division's own entry, so if it
            // ran after the departments in the same request it would wipe them out again.
            if (editDeptRecord.divisionId) {
              departments.push(buildRowFromExisting(editDeptRecord.divisionId, editDeptRecord));
            }

            departments.push(
              ...editDeptRecord.childDepartments.map((child: any) => buildRowFromExisting(child.departmentId, child)),
            );
          } else {
            // Once 評価実施 has started, 部門目標設定/個人目標設定 must not change — keep this
            // department's own existing dates instead of whatever the (disabled) form fields
            // hold, regardless of their value.
            const deptGoal = isEvaluationTimeStarted
              ? {
                  start: editDeptRecord.dateCreationGoalDepartmentStart ?? null,
                  end: editDeptRecord.dateCreationGoalDepartmentEnd ?? null,
                }
              : {
                  start: values.deptGoalSetting?.[0]?.format('YYYY/MM/DD') ?? null,
                  end: values.deptGoalSetting?.[1]?.format('YYYY/MM/DD') ?? null,
                };
            const userGoal = isEvaluationTimeStarted
              ? { start: editDeptRecord.dateCreationGoalStart ?? null, end: editDeptRecord.dateCreationGoalEnd ?? null }
              : {
                  start: values.userGoalSetting?.[0]?.format('YYYY/MM/DD') ?? null,
                  end: values.userGoalSetting?.[1]?.format('YYYY/MM/DD') ?? null,
                };

            departments = [
              {
                departmentId: editDeptRecord.departmentId,
                dateCreationGoalDepartmentStart: deptGoal.start,
                dateCreationGoalDepartmentEnd: deptGoal.end,
                dateCreationGoalStart: userGoal.start,
                dateCreationGoalEnd: userGoal.end,
                dateEvaluationDepartmentStart: values.deptEvaluation?.[0]?.format('YYYY/MM/DD') ?? null,
                dateEvaluationDepartmentEnd: values.deptEvaluation?.[1]?.format('YYYY/MM/DD') ?? null,
                dateEvaluationStart: values.userEvaluation?.[0]?.format('YYYY/MM/DD') ?? null,
                dateEvaluationEnd: values.userEvaluation?.[1]?.format('YYYY/MM/DD') ?? null,
              },
            ];
          }

          const res: any = await httpAxios.Post('/api/v1/f5/management-evaluation-history/period/department/save', {
            evaluationPeriodId: routeState?.id,
            // Only meaningful (and only sent) for a division-group edit — editDeptRecord.divisionId
            // is already resolved in groupedDeptData. Omitted for a single-department edit so it
            // can't accidentally affect anything beyond that one department.
            ...(editDeptRecord.isDivisionGroup && editDeptRecord.divisionId
              ? { divisionId: editDeptRecord.divisionId }
              : {}),
            departments,
          });
          if (res?.status === 200) {
            message.success(tFn('EVALUATION_PERIOD_SCREEN.MESSAGE_TOAST_SAVE_SUCCESS'));
            await fetchDeptSettings();
            setIsEditDeptModalOpen(false);
            editDeptForm.resetFields();
          }
        } finally {
          setLoadingDept(false);
        }
      })
      .catch(() => {});
  };

  // ── Init effects ───────────────────────────────────────────────
  useEffect(() => {
    if (routeYear && routePeriodIndex) fetchPeriodData();
    if (routeState?.id) fetchDeptSettings();

    const timer = setTimeout(() => {
      // Fetch division/department tree for cascader selectors
      const divCallBack = (data: any) => {
        if (data.company?.length > 0) {
          const list = data.divisions.map((v: any) => ({
            value: v.divisionId,
            label: v.name,
            children: v.childrens.map((val: any) => ({ value: val.id, label: val.name })),
          }));
          setDivisionList(list);
        }
      };
      getConditionSearch(divCallBack, () => {});

      if (routeYear && routePeriodIndex) {
        // Fetch all departments for the target section filters
        userEvaluationApiService.getAllDepartmentEvaluationDefault(
          { year: routeYear, periodIndex: routePeriodIndex },
          { callBack: (data: any) => setListDepartment(data), errorCallBack: () => {} },
        );
        // Fetch skill templates used in the target section
        settingEvaluatorApiService.getAllSkill({
          callBackListSkill: (data: any) => setListSkills(data),
          errorCallBack: () => {},
        });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // ── Memos ──────────────────────────────────────────────────────

  // Cell renderers for the department-override grid (部署別期間設定), one per column
  // in deptColumnMetaList. Kept as plain functions (not antd Table `columns`) since the
  // grid itself is now the same custom GridRow/GridBlock structure as the 対象者 tab.
  const renderDeptNameCell = (record: any) => {
    if (record.isDivisionGroup) {
      return <Typography.Text strong>{`${tFn('IDS_DEPARTMENT')}: ${record.divisionName}`}</Typography.Text>;
    }
    if (record.isChildRow) {
      return <Typography.Text>{`${tFn('IDS_TYPE_DEPARTMENT_NAME')}: ${record.departmentName ?? '—'}`}</Typography.Text>;
    }
    if (record.divisionName) {
      // Ungrouped row that still belongs to a division (that division only has this one
      // department configured) — show both names inline, same as before grouping existed.
      return (
        <Space direction="vertical" size={4}>
          <Typography.Text>{`${tFn('IDS_DEPARTMENT')}: ${record.divisionName}`}</Typography.Text>
          <Typography.Text>{`${tFn('IDS_TYPE_DEPARTMENT_NAME')}: ${record.departmentName ?? '—'}`}</Typography.Text>
        </Space>
      );
    }
    return <Typography.Text>{`${tFn('IDS_DEPARTMENT')}: ${record.departmentName ?? '—'}`}</Typography.Text>;
  };

  const renderDeptProgressCell = (record: any) => {
    const goalPct = record.totalCount > 0 ? Math.round((record.goalCount / record.totalCount) * 100) : 0;
    const evalPct = record.totalCount > 0 ? Math.round((record.evalCount / record.totalCount) * 100) : 0;

    return (
      <Space direction="vertical" size={2} style={{ width: '100%' }}>
        <Row gutter={[4, 4]} align="middle" wrap={false}>
          <Col flex="40px">
            <Typography.Text style={{ fontSize: 12 }}>{tFn('IDS_GOAL')}:</Typography.Text>
          </Col>
          <Col flex="auto">
            <Tooltip title={`${record.goalCount}/${record.totalCount}`}>
              <Progress percent={goalPct} size="small" />
            </Tooltip>
          </Col>
        </Row>
        <Row gutter={[4, 4]} align="middle" wrap={false}>
          <Col flex="40px">
            <Typography.Text style={{ fontSize: 12 }}>{tFn('IDS_EVALUATION')}:</Typography.Text>
          </Col>
          <Col flex="auto">
            <Tooltip title={`${record.evalCount}/${record.totalCount}`}>
              <Progress percent={evalPct} size="small" />
            </Tooltip>
          </Col>
        </Row>
      </Space>
    );
  };

  const renderDeptGoalPeriodCell = (record: any) => {
    // For a division-group parent row, these dates (if present) come from that division's
    // own DB row (added alongside its departments when "select all" was used) — same fields,
    // same renderer, no special-casing needed beyond just reading them off the record.
    return (
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <div
          style={{
            background: '#e6f4ff',
            borderLeft: '3px solid #1677ff',
            padding: '4px 10px',
            borderRadius: '0 4px 4px 0',
          }}
        >
          <div style={{ fontSize: 14, color: '#1677ff', lineHeight: 1.3 }}>{tFn('IDS_DEPARTMENTAL_GOAL_SETTING')}</div>
          <div style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {record.dateCreationGoalDepartmentStart ? (
              `${fmtDate(record.dateCreationGoalDepartmentStart)} ～ ${fmtDate(record.dateCreationGoalDepartmentEnd)}`
            ) : (
              <span style={{ color: '#bbb', fontWeight: 'normal' }}>—</span>
            )}
          </div>
        </div>
        <div
          style={{
            background: '#fff7e6',
            borderLeft: '3px solid #fa8c16',
            padding: '4px 10px',
            borderRadius: '0 4px 4px 0',
          }}
        >
          <div style={{ fontSize: 14, color: '#fa8c16', lineHeight: 1.3 }}>{tFn('IDS_PERSONAL_GOAL_SETTING')}</div>
          <div style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {record.dateCreationGoalStart ? (
              `${fmtDate(record.dateCreationGoalStart)} ～ ${fmtDate(record.dateCreationGoalEnd)}`
            ) : (
              <span style={{ color: '#bbb', fontWeight: 'normal' }}>—</span>
            )}
          </div>
        </div>
      </Space>
    );
  };

  const renderDeptEvalPeriodCell = (record: any) => {
    return (
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <div
          style={{
            background: '#e6f4ff',
            borderLeft: '3px solid #1677ff',
            padding: '4px 10px',
            borderRadius: '0 4px 4px 0',
          }}
        >
          <div style={{ fontSize: 14, color: '#1677ff', lineHeight: 1.3 }}>{tFn('IDS_DIVISION_EVALUATION')}</div>
          <div style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {record.dateEvaluationDepartmentStart ? (
              `${fmtDate(record.dateEvaluationDepartmentStart)} ～ ${fmtDate(record.dateEvaluationDepartmentEnd)}`
            ) : (
              <span style={{ color: '#bbb', fontWeight: 'normal' }}>—</span>
            )}
          </div>
        </div>
        <div
          style={{
            background: '#fff7e6',
            borderLeft: '3px solid #fa8c16',
            padding: '4px 10px',
            borderRadius: '0 4px 4px 0',
          }}
        >
          <div style={{ fontSize: 14, color: '#fa8c16', lineHeight: 1.3 }}>{tFn('IDS_EVALUATION_PERSONAL')}</div>
          <div style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {record.dateEvaluationStart ? (
              `${fmtDate(record.dateEvaluationStart)} ～ ${fmtDate(record.dateEvaluationEnd)}`
            ) : (
              <span style={{ color: '#bbb', fontWeight: 'normal' }}>—</span>
            )}
          </div>
        </div>
      </Space>
    );
  };

  const renderDeptActionCell = (record: any) => (
    <Tooltip
      title={tFn('EVALUATION_PERIOD_SCREEN.IDS_TOOTIP_ACTION_EDITED')}
      color="#424242"
      overlayInnerStyle={{ fontSize: FONT_TOOLTIP }}
    >
      <EditOutlined
        onClick={() => !isLocked && handleEditDept(record)}
        disabled={isLoadingDept || isLocked}
        style={{
          cursor: isLocked ? 'not-allowed' : 'pointer',
          color: isLocked ? 'rgba(0,0,0,0.25)' : '#007240',
        }}
      />
    </Tooltip>
  );

  const renderDeptRowCells = (record: any) => (
    <>
      <div style={deptGridCellStyle()}>{renderDeptNameCell(record)}</div>
      <div style={deptGridCellStyle()}>{renderDeptProgressCell(record)}</div>
      <div style={deptGridCellStyle()}>{renderDeptGoalPeriodCell(record)}</div>
      <div style={deptGridCellStyle()}>{renderDeptEvalPeriodCell(record)}</div>
      <div style={deptGridCellStyle('center')}>{renderDeptActionCell(record)}</div>
    </>
  );

  // Filters the dept-override table by the cascader selection
  const filteredDeptData = useMemo(() => {
    if (deptFilterPath.length === 0) return deptSettingList;
    if (deptFilterPath.length >= 2) {
      const targetId = deptFilterPath[deptFilterPath.length - 1];
      return deptSettingList.filter((d: any) => d.departmentId === targetId);
    }
    const divId = deptFilterPath[0];
    const divOption = divisionList.find((d: any) => d.value === divId);
    const childIds = new Set((divOption?.children || []).map((c: any) => c.value));
    return deptSettingList.filter((d: any) => d.departmentId === divId || childIds.has(d.departmentId));
  }, [deptSettingList, deptFilterPath, divisionList]);

  const processedDivisionListForFilter = useMemo(() => {
    if (!divisionList || divisionList.length === 0) return [];
    return divisionList.map((div: any) => {
      const children: any[] = div.children || [];
      if (children.length <= 1) {
        return { value: div.value, label: div.label };
      }
      return {
        value: div.value,
        label: div.label,
        children: [{ label: tFn('IDS_ALL'), value: -1 }, ...children],
      };
    });
  }, [divisionList]);

  // Disables already-configured departments in the add-modal cascader (they show as checked
  // but read-only, reflecting current DB state — see the pre-checked-paths logic in
  // DeptAddModal). A division is also disabled once every one of its departments has already
  // been added individually — there's nothing left in it to select — even though the
  // division's own id was never configured.
  const divisionListWithDisabled = useMemo(() => {
    const configuredIds = new Set(deptSettingList.map((d: any) => d.departmentId));
    // "(設定済み)" suffix on an already-configured division/department's label is what makes
    // it recognizable as such while browsing the cascader tree — disabled styling alone
    // doesn't tell the admin *why* an option can't be picked (see EVALUATION_PERIOD_SCREEN
    // requirements: 適用部署 must reveal what's already registered, not just grey it out).
    const configuredSuffix = ` (${tFn('EVALUATION_PERIOD_SCREEN.IDS_CONFIGURED')})`;

    return divisionList.map((div: any) => {
      const realChildren = (div.children || []).filter((c: any) => c.value !== -1);
      const allChildrenConfigured =
        realChildren.length > 0 && realChildren.every((c: any) => configuredIds.has(c.value));
      const divisionConfigured = configuredIds.has(div.value) || allChildrenConfigured;

      return {
        ...div,
        label: divisionConfigured ? `${div.label}${configuredSuffix}` : div.label,
        // disableCheckbox (not disabled) keeps the division row clickable/expandable — the
        // user can still drill in to browse its departments, just can't select the division
        // itself. `disabled` would block expansion entirely (rc-cascader skips opening the
        // next column for disabled options), which isn't wanted here.
        disableCheckbox: divisionConfigured,
        children: (div.children || []).map((dept: any) => {
          const isConfigured = divisionConfigured || configuredIds.has(dept.value);
          return {
            ...dept,
            label: isConfigured ? `${dept.label}${configuredSuffix}` : dept.label,
            disabled: isConfigured,
          };
        }),
      };
    });
  }, [divisionList, deptSettingList]);

  // Groups flat department-override rows into division parent rows (one per divisionName,
  // aggregating child counts) plus department child rows. A division-type row (added
  // alongside its departments when "select all" was used in the add modal) doesn't become
  // its own child row — it merges into the parent group's own fields, since it's what the
  // parent's 目標設定/評価実施 columns display and what a parent-level edit updates.
  const groupedDeptData = useMemo(() => {
    const divisionGroups = new Map<string, any[]>();
    const divisionRowsByName = new Map<string, any>();

    filteredDeptData.forEach((row: any) => {
      if (row.divisionName) {
        if (!divisionGroups.has(row.divisionName)) divisionGroups.set(row.divisionName, []);
        divisionGroups.get(row.divisionName)!.push(row);
      } else {
        // A pure division-type row — its own name (departmentName) doubles as the divisionName
        // key its department siblings are grouped under.
        divisionRowsByName.set(row.departmentName, row);
      }
    });

    const standaloneRows: any[] = [];
    const groupRows: any[] = [];

    divisionGroups.forEach((children, divisionName) => {
      const divisionRow = divisionRowsByName.get(divisionName);
      divisionRowsByName.delete(divisionName); // consumed — merged into this group

      if (children.length === 1 && !divisionRow) {
        // A division with only one configured department, and no division-level row of its
        // own to show separately, doesn't need the parent/child grouping chrome — show it as
        // a single row, same as before divisions were grouped.
        standaloneRows.push({ ...children[0], key: `dept-${children[0].departmentId}` });
        return;
      }

      groupRows.push({
        key: `division-${divisionName}`,
        isDivisionGroup: true,
        divisionName,
        // Own code for sorting — from the division-level row itself when one exists, else any
        // child's divisionCode (the parent code the SQL join resolves for every leaf sharing
        // this division, so it's the same value on all of them).
        divisionCode: divisionRow?.departmentCode ?? children[0]?.divisionCode,
        // A division-level DB row (added once every department in it was selected together)
        // already aggregates the *whole* division through its own department_id/division_id
        // match — using it directly, instead of summing the children's counts, is what makes
        // a user assigned to the division but to none of its individually-configured
        // departments actually get counted; summing only the children silently dropped them.
        totalCount: divisionRow ? divisionRow.totalCount || 0 : children.reduce((sum, c) => sum + (c.totalCount || 0), 0),
        goalCount: divisionRow ? divisionRow.goalCount || 0 : children.reduce((sum, c) => sum + (c.goalCount || 0), 0),
        evalCount: divisionRow ? divisionRow.evalCount || 0 : children.reduce((sum, c) => sum + (c.evalCount || 0), 0),
        // The division-level row's own id + dates — read by 目標設定/評価実施 at the parent,
        // and by handleSaveEditDept to keep that row in sync when editing from the parent.
        // Falls back to a divisionList lookup so editing can still create that row even for a
        // group that formed purely from individually-added departments (no division row yet).
        divisionId: divisionRow?.departmentId ?? divisionList.find((d: any) => d.label === divisionName)?.value,
        dateCreationGoalDepartmentStart: divisionRow?.dateCreationGoalDepartmentStart,
        dateCreationGoalDepartmentEnd: divisionRow?.dateCreationGoalDepartmentEnd,
        dateCreationGoalStart: divisionRow?.dateCreationGoalStart,
        dateCreationGoalEnd: divisionRow?.dateCreationGoalEnd,
        dateEvaluationDepartmentStart: divisionRow?.dateEvaluationDepartmentStart,
        dateEvaluationDepartmentEnd: divisionRow?.dateEvaluationDepartmentEnd,
        dateEvaluationStart: divisionRow?.dateEvaluationStart,
        dateEvaluationEnd: divisionRow?.dateEvaluationEnd,
        // Named childDepartments (not `children`) so antd's Table doesn't auto-detect this as
        // tree data and add its own expand/collapse column — rows are rendered flat instead,
        // styled like the child rows in the 対象者 tab (indented, accented, always visible).
        // Sorted by department code ASC.
        childDepartments: [...children]
          .sort((a, b) => compareCode(a.departmentCode, b.departmentCode))
          .map((c) => ({ ...c, key: `dept-${c.departmentId}` })),
      });
    });

    // Any division-type row that had no department siblings to merge into (a division with
    // zero departments) shows as a normal standalone row, same as before grouping existed.
    divisionRowsByName.forEach((row: any) => {
      standaloneRows.push({ ...row, key: `dept-${row.departmentId}` });
    });

    // Division code first (division takes priority), department code second — across the
    // whole flat top-level list, not just within each bucket, so groups and standalone rows
    // interleave correctly instead of always showing all groups before all standalone rows.
    return [...groupRows, ...standaloneRows].sort((a, b) => {
      const [aDiv, aDept] = getDeptSortKey(a);
      const [bDiv, bDept] = getDeptSortKey(b);
      return compareCode(aDiv, bDiv) || compareCode(aDept, bDept);
    });
  }, [filteredDeptData, divisionList]);

  const pagedDeptData = useMemo(
    () => groupedDeptData.slice((deptTablePage - 1) * DEPT_TABLE_PAGE_SIZE, deptTablePage * DEPT_TABLE_PAGE_SIZE),
    [groupedDeptData, deptTablePage],
  );

  // ── Render ─────────────────────────────────────────────────────
  return (
    <>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        type="card"
        size="small"
        items={[
          // ── Tab 1: 全社設定 ──────────────────────────────────
          {
            key: 'company',
            label: (
              <span>
                <ApartmentOutlined />
                {tFn('IDS_COMPANY_WIDE_SETTING')}
              </span>
            ),
            children: (
              <Spin spinning={isLoadingPeriod}>
                <Space style={{ width: '100%' }} direction="vertical" size={BLOCK_SPACING}>
                  <Form form={commonForm} layout="vertical">
                    <Row gutter={[15, 15]}>
                      {/* 目標設定 block */}
                      <Col xs={24} md={12}>
                        <div
                          style={{
                            background: '#F8FAFC',
                            borderRadius: 6,
                            padding: 20,
                            height: '100%',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: 8,
                            }}
                          >
                            <Typography.Title
                              level={5}
                              style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}
                            >
                              <CalendarOutlined style={{ color: '#0284C7' }} />
                              {tFn('IDS_AIM_SETTING')}
                            </Typography.Title>
                            {!isEditPeriod &&
                              periodData?.dateCreationGoalDepartmentStart &&
                              periodData?.dateCreationGoalStart && (
                                <Dropdown
                                  menu={createMailMenu('goal')}
                                  placement="bottomRight"
                                  trigger={['click']}
                                  disabled={isLocked}
                                >
                                  <Button type="primary" size="middle" icon={<MailOutlined />} disabled={isLocked}>
                                    {tFn('IDS_SEND_MAIL')} <DownOutlined />
                                  </Button>
                                </Dropdown>
                              )}
                          </div>
                          <Form.Item
                            label={tFn('IDS_DEPARTMENTAL_GOAL_SETTING')}
                            style={{ marginBottom: 5 }}
                            required={isEditPeriod}
                          >
                            {isEditPeriod ? (
                              <Form.Item
                                name="deptGoalSetting"
                                noStyle
                                rules={[
                                  {
                                    validator: (_, value) =>
                                      value && value[0] && value[1]
                                        ? Promise.resolve()
                                        : Promise.reject(new Error(tFn('IDS_VALIDATION_DEPT_GOAL').toString())),
                                  },
                                ]}
                              >
                                <RangePicker
                                  format="YYYY/M/D"
                                  clearIcon={false}
                                  style={{ width: '100%' }}
                                  onChange={(_: any, fmt: [string, string]) =>
                                    setPeriodData((prev: any) => ({
                                      ...prev,
                                      dateCreationGoalDepartmentStart: fmt[0],
                                      dateCreationGoalDepartmentEnd: fmt[1],
                                    }))
                                  }
                                />
                              </Form.Item>
                            ) : (
                              <Typography.Text>
                                {periodData?.dateCreationGoalDepartmentStart
                                  ? `${periodData.dateCreationGoalDepartmentStart} ～ ${periodData.dateCreationGoalDepartmentEnd}`
                                  : '—'}
                              </Typography.Text>
                            )}
                          </Form.Item>
                          <Form.Item
                            label={tFn('IDS_PERSONAL_GOAL_SETTING')}
                            style={{ marginBottom: 0 }}
                            required={isEditPeriod}
                          >
                            {isEditPeriod ? (
                              <Form.Item
                                name="userGoalSetting"
                                noStyle
                                rules={[
                                  {
                                    validator: (_, value) =>
                                      value && value[0] && value[1]
                                        ? Promise.resolve()
                                        : Promise.reject(new Error(tFn('IDS_VALIDATION_PERSONAL_GOAL').toString())),
                                  },
                                ]}
                              >
                                <RangePicker
                                  format="YYYY/M/D"
                                  clearIcon={false}
                                  style={{ width: '100%' }}
                                  onChange={(_: any, fmt: [string, string]) =>
                                    setPeriodData((prev: any) => ({
                                      ...prev,
                                      dateCreationGoalStart: fmt[0],
                                      dateCreationGoalEnd: fmt[1],
                                    }))
                                  }
                                />
                              </Form.Item>
                            ) : (
                              <Typography.Text>
                                {periodData?.dateCreationGoalStart
                                  ? `${periodData.dateCreationGoalStart} ～ ${periodData.dateCreationGoalEnd}`
                                  : '—'}
                              </Typography.Text>
                            )}
                          </Form.Item>
                        </div>
                      </Col>

                      {/* 評価実施 block */}
                      <Col xs={24} md={12}>
                        <div
                          style={{
                            background: '#F8FAFC',
                            borderRadius: 6,
                            padding: 20,
                            height: '100%',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: 8,
                            }}
                          >
                            <Typography.Title
                              level={5}
                              style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}
                            >
                              <CheckSquareOutlined style={{ color: '#007240' }} />
                              {tFn('IDS_EVALUATION_IMPLEMENTATION')}
                            </Typography.Title>
                            {!isEditPeriod &&
                              periodData?.dateEvaluationDepartmentStart &&
                              periodData?.dateEvaluationStart && (
                                <Dropdown
                                  menu={createMailMenu('evaluation')}
                                  placement="bottomRight"
                                  trigger={['click']}
                                  disabled={isLocked}
                                >
                                  <Button type="primary" size="middle" icon={<MailOutlined />} disabled={isLocked}>
                                    {tFn('IDS_SEND_MAIL')} <DownOutlined />
                                  </Button>
                                </Dropdown>
                              )}
                          </div>
                          <Form.Item label={tFn('IDS_DIVISION_EVALUATION')} style={{ marginBottom: 5 }}>
                            {isEditPeriod ? (
                              <Form.Item name="deptEvaluation" noStyle>
                                <RangePicker
                                  format="YYYY/M/D"
                                  clearIcon={false}
                                  style={{ width: '100%' }}
                                  onChange={(_: any, fmt: [string, string]) =>
                                    setPeriodData((prev: any) => ({
                                      ...prev,
                                      dateEvaluationDepartmentStart: fmt[0],
                                      dateEvaluationDepartmentEnd: fmt[1],
                                    }))
                                  }
                                />
                              </Form.Item>
                            ) : (
                              <Typography.Text>
                                {periodData?.dateEvaluationDepartmentStart
                                  ? `${periodData.dateEvaluationDepartmentStart} ～ ${periodData.dateEvaluationDepartmentEnd}`
                                  : '—'}
                              </Typography.Text>
                            )}
                          </Form.Item>
                          <Form.Item label={tFn('IDS_EVALUATION_PERSONAL')} style={{ marginBottom: 0 }}>
                            {isEditPeriod ? (
                              <Form.Item name="userEvaluation" noStyle>
                                <RangePicker
                                  format="YYYY/M/D"
                                  clearIcon={false}
                                  style={{ width: '100%' }}
                                  onChange={(_: any, fmt: [string, string]) =>
                                    setPeriodData((prev: any) => ({
                                      ...prev,
                                      dateEvaluationStart: fmt[0],
                                      dateEvaluationEnd: fmt[1],
                                    }))
                                  }
                                />
                              </Form.Item>
                            ) : (
                              <Typography.Text>
                                {periodData?.dateEvaluationStart
                                  ? `${periodData.dateEvaluationStart} ～ ${periodData.dateEvaluationEnd}`
                                  : '—'}
                              </Typography.Text>
                            )}
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>

                    <div style={{ display: 'flex', gap: 12, marginTop: BLOCK_SPACING }}>
                      {isEditPeriod ? (
                        <>
                          <Button
                            type="primary"
                            size="middle"
                            loading={isLoadingPeriod}
                            disabled={isLocked}
                            onClick={handleValidateSavePeriod}
                          >
                            {tFn('IDS_BUTTON_SAVE')}
                          </Button>
                          <Button size="middle" onClick={handleCancelPeriod} disabled={isLoadingPeriod}>
                            {tFn('IDS_BUTTON_CANCEL')}
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="primary"
                          size="middle"
                          icon={<EditOutlined />}
                          disabled={isLocked || isLoadingPeriod}
                          onClick={() => setIsEditPeriod(true)}
                        >
                          {tFn('IDS_EDIT')}
                        </Button>
                      )}
                    </div>
                  </Form>
                </Space>
              </Spin>
            ),
          },

          // ── Tab 2: 部署別 実施期間設定 ───────────────────────
          {
            key: 'department',
            label: (
              <span>
                <ApartmentOutlined />
                {tFn('IDS_DEPT_PERIOD_SETTING')}
              </span>
            ),
            children: (
              <div>
                <div style={{ marginBottom: BLOCK_SPACING }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Button
                      type="primary"
                      size="middle"
                      icon={<PlusOutlined />}
                      disabled={isLoadingDept || isLocked}
                      onClick={() => !isLocked && setIsDeptModalOpen(true)}
                    >
                      {t('IDS_BUTTON_ADD')}
                    </Button>
                    <Button
                      size="middle"
                      icon={<ReloadOutlined />}
                      loading={isLoadingDept}
                      disabled={isLoadingDept || isLocked}
                      onClick={handleReloadDeptTab}
                      title={tFn('EVALUATION_PERIOD_SCREEN.IDS_RELOAD_BUTTON').toString()}
                    >
                      {t('EVALUATION_PERIOD_SCREEN.IDS_RELOAD_BUTTON')}
                    </Button>
                  </div>
                </div>
                <div
                  style={{
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <Typography.Text style={{ whiteSpace: 'nowrap' }}>{t('IDS_DEPARTMENT')}</Typography.Text>
                  <Cascader
                    options={[
                      { label: tFn('IDS_ALL'), value: tFn('IDS_ALL'), isLeaf: true },
                      ...processedDivisionListForFilter,
                    ]}
                    value={deptCascaderValue.length === 0 ? [tFn('IDS_ALL')] : deptCascaderValue}
                    style={{ minWidth: 180, maxWidth: '250px', flex: '1 1 220px' }}
                    showSearch
                    clearIcon={false}
                    size="small"
                    disabled={isLoadingDept}
                    displayRender={(labels) =>
                      labels.filter((l) => l !== null && l !== undefined && l !== 'NaN').join(' ► ')
                    }
                    onChange={(values: any, selectedOptions: any) => {
                      setDeptTablePage(1);
                      const newVal = values ?? [tFn('IDS_ALL')];
                      setDeptCascaderValue(newVal);
                      if (!values || values.length === 0 || values[0] === tFn('IDS_ALL')) {
                        setDeptFilterPath([]);

                        return;
                      }
                      const opts = selectedOptions as any[];
                      if (opts.length >= 2 && opts[1]?.value === -1) {
                        setDeptFilterPath([values[0]]);
                      } else {
                        setDeptFilterPath(values ?? []);
                      }
                    }}
                  />
                </div>
                <div style={{ border: '1px solid #f0f0f0', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <DeptGridBlock>
                      <DeptGridRow template={deptParentGridTemplate} background="#007240" fontWeight={600}>
                        <div style={deptGridHeaderCellStyle()} />
                        {deptColumnMetaList.map((col) => (
                          <div key={col.key} style={deptGridHeaderCellStyle(col.align)}>
                            {tFn(col.titleId)}
                          </div>
                        ))}
                      </DeptGridRow>

                      <Spin spinning={isLoadingDept}>
                        {pagedDeptData.length === 0 && (
                          <div style={{ padding: 24, minHeight: 120, textAlign: 'center', color: '#999' }}>
                            {t('MESSAGE.COMMON.IDM_EMPTY_DATA')}
                          </div>
                        )}
                        {pagedDeptData.map((record: any) => {
                          const childDepartments: any[] = record.isDivisionGroup ? record.childDepartments || [] : [];
                          const hasChildren = childDepartments.length > 0;
                          const isExpanded = hasChildren && expandedDivisionKeys.has(record.key);

                          return (
                            <React.Fragment key={record.key}>
                              <DeptGridRow
                                template={deptParentGridTemplate}
                                background="#fff"
                                emphasizedBottom={!isExpanded}
                              >
                                <div style={deptGridCellStyle('center')}>
                                  {hasChildren &&
                                    (isExpanded ? (
                                      <DownOutlined
                                        style={{ cursor: 'pointer', color: '#007240' }}
                                        onClick={() => toggleDivisionExpanded(record.key)}
                                      />
                                    ) : (
                                      <RightOutlined
                                        style={{ cursor: 'pointer', color: '#007240' }}
                                        onClick={() => toggleDivisionExpanded(record.key)}
                                      />
                                    ))}
                                </div>
                                {renderDeptRowCells(record)}
                              </DeptGridRow>
                              {isExpanded && (
                                <>
                                  <DeptGridRow
                                    template={deptChildGridTemplate}
                                    background="#0F7A12"
                                    marginLeft={DEPT_CHILD_ROW_OFFSET}
                                    fontWeight={600}
                                  >
                                    {deptColumnMetaList.map((col) => (
                                      <div key={col.key} style={deptGridHeaderCellStyle(col.align)}>
                                        {tFn(col.titleId)}
                                      </div>
                                    ))}
                                  </DeptGridRow>
                                  {childDepartments.map((child: any, childIndex: number) => (
                                    <DeptGridRow
                                      key={child.key}
                                      template={deptChildGridTemplate}
                                      background="#f5faff"
                                      marginLeft={DEPT_CHILD_ROW_OFFSET}
                                      accentLeft
                                      emphasizedBottom={childIndex === childDepartments.length - 1}
                                    >
                                      {renderDeptRowCells({ ...child, isChildRow: true })}
                                    </DeptGridRow>
                                  ))}
                                </>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </Spin>
                    </DeptGridBlock>
                  </div>
                </div>
                {groupedDeptData.length > DEPT_TABLE_PAGE_SIZE && (
                  <PaginationUserList
                    total={groupedDeptData.length}
                    pageSize={DEPT_TABLE_PAGE_SIZE}
                    current={deptTablePage}
                    isLoading={isLoadingDept}
                    onChange={(page) => setDeptTablePage(page)}
                    style={{ marginTop: 8 }}
                  />
                )}
              </div>
            ),
          },

          // ── Tab 3: 対象者 ────────────────────────────────────
          {
            key: 'personal',
            label: (
              <span>
                <ApartmentOutlined />
                {tFn('IDS_TARGET_PERSON')}
              </span>
            ),
            children: (
              <Space style={{ width: '100%' }} direction="vertical" size={BLOCK_SPACING}>
                <TargetSection
                  tabMode="all"
                  routeState={routeState}
                  isLocked={isLocked}
                  isEvaluationTime={isEvaluationTimeStarted}
                  isActive={activeTab === 'personal'}
                  divisionList={divisionList}
                  listDepartment={listDepartment}
                  listSkills={listSkills}
                  i18n={i18n}
                />
              </Space>
            ),
          },
        ]}
      />

      {/* ── 個別設定 Modal (extracted) ───────────────────────────── */}
      <DeptEditModal
        isOpen={isEditDeptModalOpen}
        setIsOpen={setIsEditDeptModalOpen}
        editDeptRecord={editDeptRecord}
        editDeptForm={editDeptForm}
        isLoadingDept={isLoadingDept}
        isLocked={isLocked}
        isEvaluationTimeStarted={isEvaluationTimeStarted}
        handleSaveEditDept={handleSaveEditDept}
        onMailClick={(type, isScheduled) => {
          setMailType(`dept_${type}`);
          setIsScheduledSend(isScheduled);
          if (editDeptRecord?.isDivisionGroup) {
            setMailDepartmentId(undefined);
            setMailDepartmentIds(
              (editDeptRecord.childDepartments || []).map((child: any) => child.departmentId).filter(Boolean),
            );
          } else {
            setMailDepartmentId(editDeptRecord?.departmentId ?? undefined);
            setMailDepartmentIds(undefined);
          }
          setMailDepartmentName(editDeptRecord?.departmentName || editDeptRecord?.divisionName || '');
          const fv = editDeptForm.getFieldsValue();
          setMailDeptDates({
            deptGoalStart: fv.deptGoalSetting?.[0]?.format('YYYY/MM/DD'),
            deptGoalEnd: fv.deptGoalSetting?.[1]?.format('YYYY/MM/DD'),
            userGoalStart: fv.userGoalSetting?.[0]?.format('YYYY/MM/DD'),
            userGoalEnd: fv.userGoalSetting?.[1]?.format('YYYY/MM/DD'),
            deptEvalStart: fv.deptEvaluation?.[0]?.format('YYYY/MM/DD'),
            deptEvalEnd: fv.deptEvaluation?.[1]?.format('YYYY/MM/DD'),
            userEvalStart: fv.userEvaluation?.[0]?.format('YYYY/MM/DD'),
            userEvalEnd: fv.userEvaluation?.[1]?.format('YYYY/MM/DD'),
          });
          setIsModalOpenMail(true);
        }}
        ITEM_SPACING={ITEM_SPACING}
        t={t}
      />

      {/* ── 部署別追加 Modal (extracted) ─────────────────────────── */}
      <DeptAddModal
        isOpen={isDeptModalOpen}
        setIsOpen={setIsDeptModalOpen}
        deptModalForm={deptModalForm}
        isLoadingDept={isLoadingDept}
        isEvaluationTimeStarted={isEvaluationTimeStarted}
        divisionList={divisionList}
        divisionListWithDisabled={divisionListWithDisabled}
        selectedDeptItems={selectedDeptItems}
        setSelectedDeptItems={setSelectedDeptItems}
        deptModalTablePage={deptModalTablePage}
        setDeptModalTablePage={setDeptModalTablePage}
        DEPT_MODAL_PAGE_SIZE={DEPT_MODAL_PAGE_SIZE}
        modalCascaderValue={modalCascaderValue}
        setModalCascaderValue={setModalCascaderValue}
        routeState={routeState}
        handleDeptSubmit={handleDeptSubmit}
        t={t}
      />

      {/* ── 全社設定 save confirm Modal ───────────────────────────── */}
      <ModalCustomComponent
        isOpen={isConfirmSaveOpen}
        header={tFn('POPUP_DIALOG.TITLE.CONFIRM')}
        content={tFn('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE')}
        fnHandleOk={handleSavePeriod}
        fnHandleCancel={() => setConfirmSaveOpen(false)}
        okText={tFn('IDS_BUTTON_SAVE') as string}
        cancelText={tFn('IDS_BUTTON_CANCEL') as string}
        loading={isLoadingPeriod}
      />

      {/* ── メール送信 Modal ─────────────────────────────────────── */}
      <SendMail
        isModalOpen={isModalOpenMail}
        setIsModalOpen={setIsModalOpenMail}
        isScheduled={isScheduledSend}
        mailType={mailType}
        routeYear={routeYear}
        routePeriodIndex={routePeriodIndex}
        periodData={periodData}
        departmentId={mailDepartmentId}
        departmentIds={mailDepartmentIds}
        departmentName={mailDepartmentName}
        deptDates={mailDeptDates}
      />
    </>
  );
};

export default SolutionSecond;
