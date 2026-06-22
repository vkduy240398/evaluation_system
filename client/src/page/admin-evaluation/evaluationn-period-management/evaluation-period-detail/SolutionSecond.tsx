import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Tabs,
  Space,
  Card,
  Form,
  Button,
  Row,
  Col,
  Table,
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
} from '@ant-design/icons';
import SendMail from './SendMail';
import evaluationPeriodServices from '../../../../common/api/evaluationPeriod';
import dayjs from 'dayjs';
import { getConditionSearch } from '../../../../views/admin/user-management/user-list/user-list/restApi/conditionSearch';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { t as tFn } from 'i18next';
import userEvaluationApiService from '../../../../common/api/userEvaluation';
import settingEvaluatorApiService from '../../../../common/api/settingEvaluator';
import httpAxios from '../../../../common/http';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import TargetSection from './components/TargetSection';
import DeptEditModal from './components/DeptEditModal';
import DeptAddModal, { SelectedDeptItem } from './components/DeptAddModal';

const { RangePicker } = DatePicker;

const ITEM_SPACING_DEFAULT = 15;
const BLOCK_SPACING = 15;
const DEPT_MODAL_PAGE_SIZE = 5;
const FONT_SIZE = 14;
const MARGIN_BOTTOM_BLOCK = 15;
const FONT_TOOLTIP = 11;
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
  const [activeTab, setActiveTab] = useState<string>('company');

  const { state: routeState } = useLocation();
  const { i18n } = useTranslation();
  const routeYear = routeState?.year;
  const routePeriodIndex = routeState?.periodIndex;

  // Mail send mode: tracks whether the modal was opened via "今すぐ送信" or "後で送信"
  const [isScheduledSend, setIsScheduledSend] = useState(false);
  const [mailType, setMailType] = useState<string>('');
  const [mailDepartmentId, setMailDepartmentId] = useState<number | undefined>(undefined);

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

  const isOutsideTime = useMemo(() => {
    if (!periodData) return false;
    const ends = [periodData.dateEvaluationEnd, periodData.dateEvaluationDepartmentEnd].filter(Boolean);
    if (!ends.length) return false;
    const latestEnd = ends
      .map((d: string) => dayjs(d, 'YYYY/MM/DD'))
      .reduce((max: ReturnType<typeof dayjs>, d: ReturnType<typeof dayjs>) => (d.isAfter(max) ? d : max));
    return dayjs().startOf('day').isAfter(latestEnd) && periodData.checkFixed === 2;
  }, [periodData]);

  const isLocked = isFixed || isOutsideTime;

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

  // ── Date parse helper ──────────────────────────────────────────
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
        message.success(tFn('MESSAGE.COMMON.IDM_SAVE_SUCCESS') || '保存しました');
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
  // Division-level is detected in TWO ways:
  //   1. Direct division selection: user picks the division itself in cascader → values=[divId] (length=1)
  //      → selectedLeafIds stays empty because the length-≥2 guard is never met
  //   2. All-children selection: user picks every individual child dept → selectedLeafIds.length >= realChildren.length
  //
  // Warning via Modal.confirm() (renders at document root, always on top) is shown ONLY when
  // a division-level save would delete existing individual child dept records in deptSettingList.
  // All other cases save immediately without confirmation.
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

          // Case 1: direct division pick → selectedLeafIds is empty (values.length === 1)
          // Case 2: all individual children picked
          const isDirectDivision = selectedLeafIds.length === 0;
          const allChildrenSelected = realChildren.length > 0 && selectedLeafIds.length >= realChildren.length;
          const isDivision = isDirectDivision || allChildrenSelected;

          if (isDivision) {
            departments.push({
              departmentId: divId,
              isDivisionLevel: true,
              childDepartmentIds: realChildren.map((c: any) => c.value),
              ...datePayload,
            });

            // Warn only when existing individual child records would be deleted
            const childIdSet = new Set(realChildren.map((c: any) => c.value));
            if (deptSettingList.some((d: any) => childIdSet.has(d.departmentId))) {
              needsWarning = true;
            }
          } else {
            // Partial selection → save each chosen leaf separately
            selectedDeptItems
              .filter((item) => (item.values[0] as number) === divId)
              .forEach((item) => {
                departments.push({
                  departmentId: item.values[item.values.length - 1] as number,
                  isDivisionLevel: false,
                  ...datePayload,
                });
              });
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
              <Space size="middle" align="start" style={{ width: '100%', marginTop: 15 }}>
                <Button
                  type="primary"
                  onClick={async () => {
                    instance?.destroy();
                    await executeDeptSave(payload);
                  }}
                >
                  {okLabel}
                </Button>
                <Button onClick={() => instance?.destroy()}>{cancelLabel}</Button>
              </Space>
            ),
          });
        } else {
          await executeDeptSave(payload);
        }
      })
      .catch(() => {});
  };

  // Opens the individual dept edit modal and pre-fills the form with existing dates
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

  // Saves updated dates for a single department override
  const handleSaveEditDept = async () => {
    if (!editDeptRecord) return;
    editDeptForm
      .validateFields()
      .then(async (values) => {
        setLoadingDept(true);
        try {
          const res: any = await httpAxios.Post('/api/v1/f5/management-evaluation-history/period/department/save', {
            evaluationPeriodId: routeState?.id,
            departments: [
              {
                departmentId: editDeptRecord.departmentId,
                dateCreationGoalDepartmentStart: values.deptGoalSetting?.[0]?.format('YYYY/MM/DD') ?? null,
                dateCreationGoalDepartmentEnd: values.deptGoalSetting?.[1]?.format('YYYY/MM/DD') ?? null,
                dateCreationGoalStart: values.userGoalSetting?.[0]?.format('YYYY/MM/DD') ?? null,
                dateCreationGoalEnd: values.userGoalSetting?.[1]?.format('YYYY/MM/DD') ?? null,
                dateEvaluationDepartmentStart: values.deptEvaluation?.[0]?.format('YYYY/MM/DD') ?? null,
                dateEvaluationDepartmentEnd: values.deptEvaluation?.[1]?.format('YYYY/MM/DD') ?? null,
                dateEvaluationStart: values.userEvaluation?.[0]?.format('YYYY/MM/DD') ?? null,
                dateEvaluationEnd: values.userEvaluation?.[1]?.format('YYYY/MM/DD') ?? null,
              },
            ],
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

  // Columns for the department-override table (部署別期間設定)
  const departmentColumns = useMemo(
    () => [
      {
        title: tFn('IDS_DEPARTMENT'),
        key: 'departmentName',
        width: 260,
        render: (_: any, record: any) => {
          if (record.divisionName) {
            return (
              <Space direction="vertical" size={2}>
                <Typography.Text style={{ fontSize: FONT_SIZE }}>
                  {`${tFn('IDS_DEPARTMENT')}: ${record.divisionName}`}
                </Typography.Text>

                <Typography.Text style={{ fontSize: FONT_SIZE }}>
                  {`${tFn('IDS_TYPE_DEPARTMENT_NAME')}: ${record.departmentName ?? '—'}`}
                </Typography.Text>
              </Space>
            );
          }
          return (
            <Typography.Text style={{ fontSize: FONT_SIZE }}>
              {`${tFn('IDS_TYPE_DEPARTMENT_NAME')}: ${record.departmentName ?? '—'}`}
            </Typography.Text>
          );
        },
      },
      {
        title: tFn('EVALUATION_PERIOD_SCREEN.IDS_IN_PROGRESS_SETTING_EVALUATE'),
        key: 'progress',
        width: 150,
        render: (_: any, record: any) => {
          const goalPct = record.totalCount > 0 ? Math.round((record.goalCount / record.totalCount) * 100) : 0;
          const evalPct = record.totalCount > 0 ? Math.round((record.evalCount / record.totalCount) * 100) : 0;

          return (
            <>
              <Row gutter={[4, 4]} align="middle">
                <Col flex="40px">
                  <Typography.Text style={{ fontSize: 14 }}>{tFn('IDS_GOAL')}:</Typography.Text>
                </Col>
                <Col flex="auto">
                  <Progress percent={goalPct} size="small" format={() => `${record.goalCount}/${record.totalCount}`} />
                </Col>
              </Row>
              <Row gutter={[4, 4]} align="middle">
                <Col flex="40px">
                  <Typography.Text style={{ fontSize: 14 }}>{tFn('IDS_EVALUATION')}:</Typography.Text>
                </Col>
                <Col flex="auto">
                  <Progress percent={evalPct} size="small" format={() => `${record.evalCount}/${record.totalCount}`} />
                </Col>
              </Row>
            </>
          );
        },
      },
      {
        title: tFn('IDS_AIM_SETTING'),
        key: 'goalPeriod',
        width: 200,
        render: (_: any, record: any) => (
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <div
              style={{
                background: '#e6f4ff',
                borderLeft: '3px solid #1677ff',
                padding: '4px 10px',
                borderRadius: '0 4px 4px 0',
              }}
            >
              <div style={{ fontSize: 14, color: '#1677ff', lineHeight: 1.3 }}>
                {tFn('IDS_DEPARTMENTAL_GOAL_SETTING')}
              </div>
              <div style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {record.dateCreationGoalDepartmentStart ? (
                  `${record.dateCreationGoalDepartmentStart} ～ ${record.dateCreationGoalDepartmentEnd}`
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
                  `${record.dateCreationGoalStart} ～ ${record.dateCreationGoalEnd}`
                ) : (
                  <span style={{ color: '#bbb', fontWeight: 'normal' }}>—</span>
                )}
              </div>
            </div>
          </Space>
        ),
      },
      {
        title: tFn('IDS_EVALUATION_IMPLEMENTATION'),
        key: 'evalPeriod',
        width: 200,
        render: (_: any, record: any) => (
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
                  `${record.dateEvaluationDepartmentStart} ～ ${record.dateEvaluationDepartmentEnd}`
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
                  `${record.dateEvaluationStart} ～ ${record.dateEvaluationEnd}`
                ) : (
                  <span style={{ color: '#bbb', fontWeight: 'normal' }}>—</span>
                )}
              </div>
            </div>
          </Space>
        ),
      },
      {
        title: tFn('IDS_OPERATION'),
        key: 'action',
        width: 35,
        align: 'center' as const,
        render: (_: any, record: any) => (
          <Tooltip
            title={tFn('EVALUATION_PERIOD_SCREEN.IDS_TOOTIP_ACTION_EDITED')}
            color="#424242"
            overlayInnerStyle={{ fontSize: FONT_TOOLTIP }}
          >
            {
              <EditOutlined
                style={{
                  color: '#007240',
                }}
                onClick={() => handleEditDept(record)}
                disabled={isLoadingDept || isLocked}
              />
            }
          </Tooltip>
        ),
      },
    ],
    [deptSettingList, isLoadingDept, isLocked],
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

  // Disables already-configured departments in the add-modal cascader
  const divisionListWithDisabled = useMemo(() => {
    const configuredIds = new Set(deptSettingList.map((d: any) => d.departmentId));

    return divisionList.map((div: any) => {
      const divisionConfigured = configuredIds.has(div.value);

      return {
        ...div,
        disabled: divisionConfigured,
        children: (div.children || []).map((dept: any) => ({
          ...dept,
          disabled: divisionConfigured || configuredIds.has(dept.value),
        })),
      };
    });
  }, [divisionList, deptSettingList]);

  // ── Render ─────────────────────────────────────────────────────
  return (
    <>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
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
                            border: '1px solid #ccc',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: 10,
                            }}
                          >
                            <Typography.Title level={5} style={{ margin: 0 }}>
                              {tFn('IDS_AIM_SETTING')}
                            </Typography.Title>
                            {!isEditPeriod && (
                              <Dropdown menu={createMailMenu('goal')} placement="bottomRight" trigger={['click']}>
                                <Button type="primary" size="middle" icon={<MailOutlined />} disabled={isLocked}>
                                  {tFn('IDS_SEND_MAIL')} <DownOutlined />
                                </Button>
                              </Dropdown>
                            )}
                          </div>
                          <Form.Item label={tFn('IDS_DEPARTMENTAL_GOAL_SETTING')} style={{ marginBottom: 5 }}>
                            {isEditPeriod ? (
                              <Form.Item name="deptGoalSetting" noStyle>
                                <RangePicker
                                  format="YYYY/MM/DD"
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
                          <Form.Item label={tFn('IDS_PERSONAL_GOAL_SETTING')} style={{ marginBottom: 0 }}>
                            {isEditPeriod ? (
                              <Form.Item name="userGoalSetting" noStyle>
                                <RangePicker
                                  format="YYYY/MM/DD"
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
                            borderRadius: 8,
                            padding: 20,
                            height: '100%',
                            border: '1px solid #ccc',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: 10,
                            }}
                          >
                            <Typography.Title level={5} style={{ margin: 0 }}>
                              {tFn('IDS_EVALUATION_IMPLEMENTATION')}
                            </Typography.Title>
                            {!isEditPeriod && (
                              <Dropdown menu={createMailMenu('evaluation')} placement="bottomRight" trigger={['click']}>
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
                                  format="YYYY/MM/DD"
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
                                  format="YYYY/MM/DD"
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

                    <div style={{ display: 'flex', gap: 15, marginTop: BLOCK_SPACING }}>
                      {isEditPeriod ? (
                        <>
                          <Button
                            type="primary"
                            loading={isLoadingPeriod}
                            disabled={isLocked}
                            onClick={handleValidateSavePeriod}
                          >
                            {tFn('IDS_BUTTON_SAVE')}
                          </Button>
                          <Button onClick={handleCancelPeriod} disabled={isLoadingPeriod}>
                            {tFn('IDS_BUTTON_CANCEL')}
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="primary"
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
                  <Space size={15}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      disabled={isLoadingDept || isLocked}
                      onClick={() => setIsDeptModalOpen(true)}
                    >
                      {t('IDS_BUTTON_ADD')}
                    </Button>
                    <Button
                      icon={<ReloadOutlined />}
                      loading={isLoadingDept}
                      onClick={fetchDeptSettings}
                      title="データ再読込"
                    >
                      {t('EVALUATION_PERIOD_SCREEN.IDS_RELOAD_BUTTON')}
                    </Button>
                  </Space>
                </div>
                <div
                  style={{
                    marginBottom: 10,
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <Typography.Text style={{ whiteSpace: 'nowrap' }}>{t('IDS_DEPARTMENT')}</Typography.Text>
                  <Cascader
                    options={divisionList}
                    value={deptCascaderValue}
                    style={{ minWidth: 180, maxWidth: '250px', flex: '1 1 220px' }}
                    showSearch
                    allowClear
                    changeOnSelect
                    size="small"
                    placeholder={tFn('IDS_ALL')}
                    disabled={isLoadingDept}
                    displayRender={(labels) => {
                      const filtered = labels.filter((l) => l && l !== t('IDS_ALL'));

                      return filtered.length > 0 ? filtered.join(' ► ') : t('IDS_ALL');
                    }}
                    onChange={(values: any) => {
                      setDeptCascaderValue(values ?? []);
                      setDeptFilterPath(values ?? []);
                    }}
                  />
                </div>
                <Table
                  columns={departmentColumns}
                  dataSource={filteredDeptData}
                  bordered
                  size="small"
                  loading={isLoadingDept}
                  pagination={
                    filteredDeptData.length > 10
                      ? {
                          position: ['bottomLeft'],
                          pageSize: 10,
                          size: 'default',
                          showSizeChanger: false,
                          showTotal: (total, range) =>
                            `${total}${tFn('IDS_CASE_LABEL')} ${range[0]}-${range[1]}${tFn('IDS_ITEM_LABEL')}`,
                          style: { marginTop: 15, marginBottom: 0 },
                        }
                      : false
                  }
                />
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
        handleSaveEditDept={handleSaveEditDept}
        onMailClick={(type, isScheduled) => {
          setMailType(type);
          setIsScheduledSend(isScheduled);
          setMailDepartmentId(editDeptRecord?.departmentId ?? undefined);
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
        content={tFn('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE') || '変更内容を保存しますか？'}
        fnHandleOk={handleSavePeriod}
        fnHandleCancel={() => setConfirmSaveOpen(false)}
        okText={(tFn('IDS_BUTTON_SAVE') as string) || '保存'}
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
      />
    </>
  );
};

export default SolutionSecond;
