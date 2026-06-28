import React, { useEffect, useState } from 'react';
import {
  Tabs,
  Card,
  Form,
  Button,
  Row,
  Col,
  Select,
  DatePicker,
  Space,
  Typography,
  Modal,
  Tag,
  Badge,
  Alert,
  Dropdown,
  Spin,
  message,
  Segmented,
  Table,
  Pagination,
  Tooltip,
} from 'antd';
import {
  CalendarOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  ApartmentOutlined,
  CheckCircleOutlined,
  SaveOutlined,
  DownOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  WarningOutlined,
  PlusSquareOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../hooks/useAuth';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezonePlugin from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import evaluationPeriodServices from '../../../../common/api/evaluationPeriod';
import settingEvaluatorApiService from '../../../../common/api/settingEvaluator';
import {
  EvaluationPeriod,
  ToMailList,
} from '../../../admin/period-evaluation/period-evaluation-detail/interfaces/interfacesProps';
import SendEmailScreen from '../../../admin/period-evaluation/period-evaluation-detail/components/sendMail';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import SettingEvaluatorSearchForm from '../../../admin/set-evaluation/components/SettingEvaluatorSearchForm';
import PopupAddUserSettingEvaluator from '../../../admin/set-evaluation/components/PopupAddUserSettingEvaluator';
import ModalPopup from '../../../../common/ModalPopup';
import MultiEditForm from '../../../admin/set-evaluation/components/MultiEditForm';
import SingleEditForm from '../../../admin/set-evaluation/components/SingleEditForm';
import { MetaModal } from '../../../../model/MetalModel';
import httpAxios from '../../../../common/http';
import userEvaluationApiService from '../../../../common/api/userEvaluation';
import ExceptionPeriodInfor from '../../../../views/admin-period/ExceptionPeriodInfor';
import { t, t as tFn } from 'i18next';

dayjs.extend(utc);
dayjs.extend(timezonePlugin);
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

const ITEM_SPACING = 15;
const BLOCK_SPACING = 24;

// ─── Endpoint mới cần backend implement ─────────────────────────
// POST /api/v1/f5/management-evaluation-history/add-extra-period
// Body: { userId, year, periodIndex, type: 'goal'|'evaluation', startDate, endDate, note }
//
// POST /api/v1/f5/management-evaluation-history/bulk-update-period-by-division
// Body: { divisionIds, year, periodIndex, deptGoalStart?, deptGoalEnd?,
//         userGoalStart?, userGoalEnd?, deptEvalStart?, deptEvalEnd?,
//         userEvalStart?, userEvalEnd? }
// ────────────────────────────────────────────────────────────────

interface SolutionThirdProps {
  form: any;
  searchForm: any;
  defaultCompanyDates: any;
  dataSources: any;
}

const SolutionThird: React.FC<SolutionThirdProps> = ({ dataSources }) => {
  const { state } = useLocation();
  const { i18n } = useTranslation();
  const auth = useAuth();

  const timeZone = auth.user?.timeZone || 'Asia/Tokyo';
  const dateFormat = i18n.language === 'ja' ? 'YYYY/M/D' : i18n.language === 'en' ? 'YYYY/D/M' : 'D/M/YYYY';

  const year = state?.year;
  const periodIndex = state?.periodIndex;

  // ── Tab 1: 共通実施期間 ─────────────────────────────────────────
  const [commonForm] = Form.useForm();
  const [periodData, setPeriodData] = useState<EvaluationPeriod | null>(null);
  const [savedPeriodData, setSavedPeriodData] = useState<EvaluationPeriod | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoadingPeriod, setLoadingPeriod] = useState(false);
  const [isConfirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  // mail state
  const [isOpenMail, setOpenMail] = useState(false);
  const [mailSendType, setMailSendType] = useState<number>(0);
  const [levelType, setLevelType] = useState<number>(7);
  const [toEmailList, setToEmailList] = useState<ToMailList[]>([]);
  const [mailTitle, setMailTitle] = useState('');
  const [mailContent, setMailContent] = useState('');

  // ── Tab 2: 対象者 ──────────────────────────────────────────────
  const [searchEvaluatorForm] = Form.useForm();
  const [userConditions, setUserConditions] = useState<any>({
    offset: 0,
    limit: 20,
    department: tFn('IDS_ALL'),
    userName: '',
    evaluatorName: '',
    level: tFn('IDS_ALL'),
    flagSkill: tFn('IDS_ALL'),
    skill: tFn('IDS_ALL'),
    current: 1,
    exception: -1,
    isSearch: true,
  });
  const [userList, setUserList] = useState<any[]>([]);
  const [userTotal, setUserTotal] = useState(0);
  const [isLoadingUsers, setLoadingUsers] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isOpenPopupAddUser, setOpenPopupAddUser] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isLoadingDelete, setLoadingDelete] = useState(false);
  const [metaModal, setMetaModal] = useState<MetaModal>({ type: '', record: {}, title: '', isOpen: false });
  const [textNotify, setTextNotify] = useState('');
  const [isVisibleNotify, setIsVisibleNotify] = useState(false);
  const [listDepartment, setListDepartment] = useState<any[]>([]);
  const [listSkills, setListSkills] = useState<any[]>([]);
  let temListEvaluators: any[] = [];
  let listChangeOptinals: any[] = [];
  // ── 例外設定 popup ─────────────────────────────────────────────
  const [openPopUp, setOpenPopUp] = useState(false);
  const [userInfor, setUserInfor] = useState<any>({
    id: null,
    key: 'user-key',
    fullName: '',
    email: '',
    company: {},
    department: {},
  });
  const [popupData, setPopupData] = useState<any[]>([]);
  const [isPopupEdit, setIsPopupEdit] = useState(false);
  // Flatten: mỗi child exception thành một hàng riêng trong table
  const flatUserList = React.useMemo(
    () =>
      userList.flatMap((record: any) => {
        if (record.childrens?.length > 0) {
          return record.childrens.map((child: any, idx: number) => ({
            ...record,
            _activeChild: child,
            _rowKey: `${record.userId}-${idx}`,
          }));
        }
        return [{ ...record, _activeChild: null, _rowKey: String(record.userId) }];
      }),
    [userList],
  );

  // ── Tab 3: クイック設定 ─────────────────────────────────────────
  const [quickForm] = Form.useForm();
  const [divisionList, setDivisionList] = useState<any[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [quickSettingType, setQuickSettingType] = useState<string>('both');
  const [isQuickConfirmOpen, setQuickConfirmOpen] = useState(false);
  const [isLoadingQuick, setLoadingQuick] = useState(false);
  const [quickUserCountMap, setQuickUserCountMap] = useState<Record<string, number>>({});
  const [quickOrgMode, setQuickOrgMode] = useState<'dept' | 'div'>('dept');

  // ── Date parse helpers ──────────────────────────────────────────
  // Parse "YYYY/M/D" hoặc "YYYY/MM/DD" bằng cách tách thủ công → ISO string → dayjs
  // Tránh phụ thuộc customParseFormat strict mode (hay fail với 2-digit day như "22")
  const parseDate = (value: string | undefined | null): dayjs.Dayjs | null => {
    if (!value || !value.trim()) return null;
    // Tách theo "/" (YYYY/M/D hoặc YYYY/MM/DD)
    const slashParts = value.trim().split('/');
    if (slashParts.length === 3) {
      const [y, m, d] = slashParts;
      const isoStr = `${y}-${m.padStart(2, '0')}-${d.slice(0, 2).padStart(2, '0')}`;
      const parsed = dayjs(isoStr);
      if (parsed.isValid()) return parsed;
    }
    // Tách theo "-" (YYYY-MM-DD)
    const dashParts = value.trim().split('-');
    if (dashParts.length === 3) {
      const parsed = dayjs(value.trim().slice(0, 10));
      if (parsed.isValid()) return parsed;
    }
    return null;
  };

  // Tách "start ～ end" → [Dayjs, Dayjs]. Hỗ trợ full-width ～ (U+FF5E) và regular ~
  const parsePeriodPair = (str: string | undefined): [dayjs.Dayjs, dayjs.Dayjs] | undefined => {
    if (!str) return undefined;
    const parts = str.split(/\s*[～~]\s*/);
    if (parts.length < 2) return undefined;
    const start = parseDate(parts[0].trim());
    const end = parseDate(parts[parts.length - 1].trim());
    return start && end ? [start, end] : undefined;
  };

  // ── Fetch period detail (Tab 1) ─────────────────────────────────
  const fetchPeriodData = async () => {
    const url = `/api/v1/f5/management-evaluation-history/period/${year}/${periodIndex}`;
    await evaluationPeriodServices.getPeriodDetailByCondition(
      url,
      (data: EvaluationPeriod) => {
        setPeriodData({ ...data });
        setSavedPeriodData({ ...data });
        setIsFixed(data.checkFixed === 2);

        const deptGoalStart = parseDate(data.dateCreationGoalDepartmentStart);
        const deptGoalEnd = parseDate(data.dateCreationGoalDepartmentEnd);
        const userGoalStart = parseDate(data.dateCreationGoalStart);
        const userGoalEnd = parseDate(data.dateCreationGoalEnd);
        const deptEvalStart = parseDate(data.dateEvaluationDepartmentStart);
        const deptEvalEnd = parseDate(data.dateEvaluationDepartmentEnd);
        const userEvalStart = parseDate(data.dateEvaluationStart);
        const userEvalEnd = parseDate(data.dateEvaluationEnd);

        // Fallback từ navigation state nếu API trả về null cho goal dates
        const deptGoalFallback = parsePeriodPair(state?.goals810Time ?? state?.departmentGoals);
        const userGoalFallback = parsePeriodPair(state?.goals17Time ?? state?.goals);

        const goalDeptValue = deptGoalStart && deptGoalEnd ? [deptGoalStart, deptGoalEnd] : deptGoalFallback;
        const goalUserValue = userGoalStart && userGoalEnd ? [userGoalStart, userGoalEnd] : userGoalFallback;

        if (!deptGoalStart && deptGoalFallback) {
          setPeriodData((prev: any) => ({
            ...prev,
            dateCreationGoalDepartmentStart: deptGoalFallback[0].format(dateFormat),
            dateCreationGoalDepartmentEnd: deptGoalFallback[1].format(dateFormat),
          }));
        }
        if (!userGoalStart && userGoalFallback) {
          setPeriodData((prev: any) => ({
            ...prev,
            dateCreationGoalStart: userGoalFallback[0].format(dateFormat),
            dateCreationGoalEnd: userGoalFallback[1].format(dateFormat),
          }));
        }

        commonForm.setFieldsValue({
          deptGoalSetting: goalDeptValue,
          userGoalSetting: goalUserValue,
          deptEvaluation: deptEvalStart && deptEvalEnd ? [deptEvalStart, deptEvalEnd] : undefined,
          userEvaluation: userEvalStart && userEvalEnd ? [userEvalStart, userEvalEnd] : undefined,
        });
      },
      setLoadingPeriod,
    );
  };

  // ── Fetch divisions for クイック設定 (Tab 2) ──────────────────
  const fetchDivisions = () => {
    settingEvaluatorApiService.getDepartmentNotGroup({
      callBack: (data: any[]) => setDivisionList(data.filter((d) => d.type !== -1)),
      errorCallBack: () => {},
    });
  };

  useEffect(() => {
    if (year && periodIndex) {
      fetchPeriodData();
      fetchDivisions();
      // Fetch department + skill for 対象者 search form
      userEvaluationApiService.getAllDepartmentEvaluationDefault(
        { year, periodIndex },
        { callBack: (data: any) => setListDepartment(data), errorCallBack: () => {} },
      );
      settingEvaluatorApiService.getAllSkill({
        callBackListSkill: (data: any) => setListSkills(data),
        errorCallBack: () => {},
      });
    }
  }, []);

  // Auto-search when userConditions change
  useEffect(() => {
    if (userConditions?.isSearch) {
      settingEvaluatorApiService.searchListSettingEvaluator(
        { ...userConditions, ...state },
        (res: any) => {
          setUserList(res?.data || []);
          setUserTotal(res?.counts || 0);
        },
        setLoadingUsers,
      );
    }
  }, [userConditions]);

  // ── Tab 2: 対象者 functions ─────────────────────────────────────
  const handleOnchangeUsers = () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
    settingEvaluatorApiService.searchListSettingEvaluator(
      { ...userConditions, ...state },
      (res: any) => {
        setUserList(res?.data || []);
        setUserTotal(res?.counts || 0);
      },
      setLoadingUsers,
    );
  };

  const handleDeleteUsers = async () => {
    setLoadingDelete(true);
    await httpAxios
      .Put('/api/v1/f5/management-evaluation-history/delete-user-setting-evaluator', {
        selectedKeyDeleted: [...new Set(selectedRows.map((r: any) => r.userId))],
        state: { year, periodIndex, periodId: state?.periodId, checkFixed: state?.checkFixed },
      })
      .then((res: any) => {
        if (res?.status === 200) {
          message.success(tFn('MESSAGE.COMMON.IDM_DELETE_USER_SUCCESS'));
          handleOnchangeUsers();
        }
      });
    setLoadingDelete(false);
    setDeleteConfirmOpen(false);
  };

  const handleOpenEdit = () => {
    setMetaModal({
      ...metaModal,
      isOpen: true,
      title: selectedRows.length > 1 ? tFn('IDS_EDIT_EVALUATOR_MULTIPLE') : tFn('IDS_EDIT_EVALUATOR'),
    });
  };

  const handleCancelEdit = () => {
    setMetaModal({ ...metaModal, isOpen: false });
    temListEvaluators = [];
    listChangeOptinals = [];
  };

  const handleSearchSavePopUp = () => {
    settingEvaluatorApiService.searchListSettingEvaluator(
      { ...userConditions, ...state, offset: (userConditions.current - 1) * 20 },
      (res: any) => {
        setUserList(res?.data || []);
        setUserTotal(res?.counts || 0);
      },
      setLoadingUsers,
    );
  };

  // ── Tab 1: save ────────────────────────────────────────────────
  const hasChanged = () => {
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

  const handleValidateSave = () => {
    commonForm
      .validateFields()
      .then(() => {
        if (!hasChanged()) {
          message.info(tFn('MESSAGE.COMMON.IDM_NO_CHANGE') || '変更がありません');
          return;
        }
        setConfirmSaveOpen(true);
      })
      .catch(() => {});
  };

  const handleSave = async () => {
    if (!periodData) return;
    await evaluationPeriodServices.savePeriodValues(
      '/api/v1/f5/management-evaluation-history/period/save',
      { condition: { year: year.toString(), periodIndex }, body: periodData },
      () => {
        message.success(tFn('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
        fetchPeriodData();
        setIsEdit(false);
      },
      setLoadingPeriod,
    );
    setConfirmSaveOpen(false);
  };

  const handleCancel = () => {
    fetchPeriodData();
    setIsEdit(false);
  };

  // ── Tab 1: mail ────────────────────────────────────────────────
  const mailMenuItems = (lt: number) => ({
    items: [
      {
        label: tFn('IDS_SEND_MAIL_NOW'),
        key: '0',
        onClick: () => handleOpenMail(0, lt),
      },
      {
        label: tFn('IDS_SEND_MAIL_SETTING_TIME'),
        key: '1',
        onClick: () => handleOpenMail(1, lt),
      },
    ],
  });

  const handleOpenMail = async (type: number, lt: number) => {
    setLoadingPeriod(true);
    setLevelType(lt);
    await evaluationPeriodServices.getToEmailList(
      (res) => {
        setToEmailList(res.toEmailList);
        setMailTitle(res.title);
        setMailContent(res.content);
      },
      lt,
      year.toString(),
      periodIndex,
    );
    setMailSendType(type);
    setOpenMail(true);
    setLoadingPeriod(false);
  };

  const handleCloseMail = () => {
    setOpenMail(false);
    setToEmailList([]);
    setMailTitle('');
    setMailContent('');
  };

  // ── Tab 2: quick apply ─────────────────────────────────────────
  const handleDivisionChange = (vals: string[]) => {
    setSelectedDivisions(vals);
    const minState = {
      year: state?.year,
      periodIndex: state?.periodIndex,
      periodId: state?.periodId,
      checkFixed: state?.checkFixed,
    };
    vals.forEach((v) => {
      if (quickUserCountMap[v] !== undefined) return;
      // Truyền tên phòng ban thực (không phải composite "id:name:type")
      // Backend LIKE search dùng departmentName[0] sau khi split(':')
      // nên cần truyền tên để "%name%" match đúng DEPARTMENT_NAME
      const deptName = divisionList.find((d) => d.value === v)?.name ?? v;
      settingEvaluatorApiService.searchListSettingEvaluator(
        {
          offset: 0,
          limit: 20,
          department: deptName,
          userName: '',
          evaluatorName: '',
          level: tFn('IDS_ALL'),
          flagSkill: tFn('IDS_ALL'),
          skill: tFn('IDS_ALL'),
          current: 1,
          exception: -1,
          sortBy: '',
          sortType: '',
          state: minState,
          isSearch: true,
          ...minState,
        },
        (res: any) => setQuickUserCountMap((prev) => ({ ...prev, [v]: res?.counts || 0 })),
        () => {},
      );
    });
  };

  const handleQuickApply = () => {
    quickForm
      .validateFields()
      .then(() => setQuickConfirmOpen(true))
      .catch(() => {});
  };

  const handleQuickConfirm = async () => {
    const values = quickForm.getFieldsValue();
    setLoadingQuick(true);

    // ⚠️ Endpoint mới: cần backend implement
    // await httpAxios.Post('/api/v1/f5/management-evaluation-history/bulk-update-period-by-division', {
    //   divisionIds: selectedDivisions,
    //   year,
    //   periodIndex,
    //   ...(values.quickDeptGoal ? {
    //     deptGoalStart: values.quickDeptGoal[0].format('YYYY/MM/DD'),
    //     deptGoalEnd: values.quickDeptGoal[1].format('YYYY/MM/DD'),
    //   } : {}),
    //   ...(values.quickUserGoal ? {
    //     userGoalStart: values.quickUserGoal[0].format('YYYY/MM/DD'),
    //     userGoalEnd: values.quickUserGoal[1].format('YYYY/MM/DD'),
    //   } : {}),
    //   ...(values.quickDeptEval ? {
    //     deptEvalStart: values.quickDeptEval[0].format('YYYY/MM/DD'),
    //     deptEvalEnd: values.quickDeptEval[1].format('YYYY/MM/DD'),
    //   } : {}),
    //   ...(values.quickUserEval ? {
    //     userEvalStart: values.quickUserEval[0].format('YYYY/MM/DD'),
    //     userEvalEnd: values.quickUserEval[1].format('YYYY/MM/DD'),
    //   } : {}),
    // });

    const totalCount = selectedDivisions.reduce((acc, v) => acc + (quickUserCountMap[v] || 0), 0);
    message.success(`${totalCount} 名の期間設定を更新しました`);
    setLoadingQuick(false);
    setQuickConfirmOpen(false);
    quickForm.resetFields();
    setSelectedDivisions([]);
    setQuickUserCountMap({});
  };

  // ── Render ──────────────────────────────────────────────────────
  return (
    <Spin spinning={isLoadingPeriod}>
      <Tabs
        type="line"
        tabBarStyle={{ marginBottom: BLOCK_SPACING }}
        items={[
          // ─────────────────────────────────────────────────────────
          // Tab 1: 共通実施期間
          // ─────────────────────────────────────────────────────────
          {
            key: 'common',
            label: (
              <Space>
                <CalendarOutlined />
                {tFn('IDS_COMMON_PERIOD')}
              </Space>
            ),
            children: (
              <Form form={commonForm} layout="vertical">
                <Row gutter={[BLOCK_SPACING, BLOCK_SPACING]}>
                  {/* 目標設定 */}
                  <Col xs={24} md={12}>
                    <div
                      style={{
                        background: '#F8FAFC',
                        borderRadius: 8,
                        padding: 20,
                        height: '100%',
                        borderStyle: 'dashed',
                        borderWidth: '0.5px',
                        borderColor: '#ccc',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 20,
                        }}
                      >
                        <Title level={5} style={{ margin: 0 }}>
                          {tFn('IDS_AIM_SETTING_TITLE')}
                        </Title>
                        {periodData?.dateCreationGoalDepartmentStart && (
                          <Dropdown menu={mailMenuItems(7)} trigger={['click']} placement="bottomRight">
                            <Button type="primary" size="small" onClick={() => setLevelType(7)}>
                              {tFn('IDS_SEND_MAIL')} <DownOutlined />
                            </Button>
                          </Dropdown>
                        )}
                      </div>

                      {/* 部門目標設定 */}
                      <Form.Item label={tFn('IDS_DEPARTMENTAL_GOAL_SETTING')} style={{ marginBottom: ITEM_SPACING }}>
                        {isEdit ? (
                          <Form.Item name="deptGoalSetting" rules={[{ required: true }]} noStyle>
                            <RangePicker
                              format={dateFormat}
                              clearIcon={false}
                              size="large"
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
                          <Text>
                            {periodData?.dateCreationGoalDepartmentStart
                              ? `${periodData.dateCreationGoalDepartmentStart} ～ ${periodData.dateCreationGoalDepartmentEnd}`
                              : '—'}
                          </Text>
                        )}
                      </Form.Item>

                      {/* 個人目標設定 */}
                      <Form.Item label={tFn('IDS_PERSONAL_GOAL_SETTING')} style={{ marginBottom: 0 }}>
                        {isEdit ? (
                          <Form.Item name="userGoalSetting" rules={[{ required: true }]} noStyle>
                            <RangePicker
                              format={dateFormat}
                              clearIcon={false}
                              size="large"
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
                          <Text>
                            {periodData?.dateCreationGoalStart
                              ? `${periodData.dateCreationGoalStart} ～ ${periodData.dateCreationGoalEnd}`
                              : '—'}
                          </Text>
                        )}
                      </Form.Item>
                    </div>
                  </Col>

                  {/* 評価実施 */}
                  <Col xs={24} md={12}>
                    <div
                      style={{
                        background: '#F8FAFC',
                        borderRadius: 8,
                        padding: 20,
                        height: '100%',
                        borderStyle: 'dashed',
                        borderWidth: '0.5px',
                        borderColor: '#ccc',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 20,
                        }}
                      >
                        <Title level={5} style={{ margin: 0 }}>
                          {tFn('IDS_EVALUATION_TIME_TITLE')}
                        </Title>
                        {periodData?.dateEvaluationDepartmentStart && (
                          <Dropdown menu={mailMenuItems(8)} trigger={['click']} placement="bottomRight">
                            <Button type="primary" size="small" onClick={() => setLevelType(8)}>
                              {tFn('IDS_SEND_MAIL')} <DownOutlined />
                            </Button>
                          </Dropdown>
                        )}
                      </div>

                      {/* 部門評価 */}
                      <Form.Item label={tFn('IDS_DIVISION_EVALUATION')} style={{ marginBottom: ITEM_SPACING }}>
                        {isEdit ? (
                          <Form.Item name="deptEvaluation" rules={[{ required: true }]} noStyle>
                            <RangePicker
                              format={dateFormat}
                              clearIcon={false}
                              size="large"
                              style={{ maxWidth: 500 }}
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
                          <Text>
                            {periodData?.dateEvaluationDepartmentStart
                              ? `${periodData.dateEvaluationDepartmentStart} ～ ${periodData.dateEvaluationDepartmentEnd}`
                              : '—'}
                          </Text>
                        )}
                      </Form.Item>

                      {/* 個人評価 */}
                      <Form.Item label={tFn('IDS_EVALUATION_PERSONAL')} style={{ marginBottom: 0 }}>
                        {isEdit ? (
                          <Form.Item name="userEvaluation" rules={[{ required: true }]} noStyle>
                            <RangePicker
                              format={dateFormat}
                              clearIcon={false}
                              size="large"
                              style={{ maxWidth: 500 }}
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
                          <Text>
                            {periodData?.dateEvaluationStart
                              ? `${periodData.dateEvaluationStart} ～ ${periodData.dateEvaluationEnd}`
                              : '—'}
                          </Text>
                        )}
                      </Form.Item>
                    </div>
                  </Col>
                </Row>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: BLOCK_SPACING, gap: 10 }}>
                  {isEdit ? (
                    <>
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleValidateSave}
                        loading={isLoadingPeriod}
                        disabled={isFixed}
                      >
                        {tFn('IDS_BUTTON_SAVE')}
                      </Button>
                      <Button onClick={handleCancel} disabled={isLoadingPeriod}>
                        {tFn('IDS_BUTTON_CANCEL')}
                      </Button>
                    </>
                  ) : (
                    <Button type="primary" onClick={() => setIsEdit(true)} disabled={isFixed || isLoadingPeriod}>
                      {tFn('IDS_EDIT')}
                    </Button>
                  )}
                </div>
              </Form>
            ),
          },

          // ─────────────────────────────────────────────────────────
          // Tab 2: 部署別期間設定 (NEW)
          // ─────────────────────────────────────────────────────────
          {
            key: 'quick',
            label: (
              <Space>
                <ThunderboltOutlined />
                部署別期間設定
                <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>
                  NEW
                </Tag>
              </Space>
            ),
            children: (
              <div>
                <Alert
                  type="warning"
                  showIcon
                  banner
                  style={{ marginBottom: BLOCK_SPACING, padding: '4px 12px', fontSize: 12 }}
                  message="一括適用に関する注意 — 選択した部署・部門の全メンバーに対して期間を一括で上書き設定します。個人別の既存設定は保持されます。"
                />

                <Spin spinning={isLoadingQuick}>
                  <Form form={quickForm} layout="vertical">
                    <Row gutter={[BLOCK_SPACING, BLOCK_SPACING]}>
                      {/* Step 1 */}
                      <Col xs={24}>
                        <Card
                          size="small"
                          title={
                            <Space>
                              <Badge count="1" style={{ backgroundColor: '#1677ff' }} />
                              <ApartmentOutlined />
                              <Text strong>対象の部署・部門を選択</Text>
                            </Space>
                          }
                          style={{ borderRadius: 8 }}
                        >
                          <div style={{ marginBottom: 10 }}>
                            <Segmented
                              value={quickOrgMode}
                              onChange={(val) => {
                                setQuickOrgMode(val as 'dept' | 'div');
                                setSelectedDivisions([]);
                                setQuickUserCountMap({});
                                quickForm.setFieldValue('divisions', []);
                              }}
                              options={[
                                { label: '部署', value: 'dept' },
                                { label: '課', value: 'div' },
                              ]}
                            />
                          </div>
                          <Form.Item
                            name="divisions"
                            rules={[{ required: true, message: '対象部署を選択してください' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select
                              mode="multiple"
                              placeholder={quickOrgMode === 'dept' ? '部署を選択（複数可）' : '課を選択（複数可）'}
                              style={{ width: '100%' }}
                              onChange={handleDivisionChange}
                              options={divisionList
                                .filter((d) => d.type === (quickOrgMode === 'dept' ? 0 : 1))
                                .map((d) => ({ label: d.name, value: d.value }))}
                              showSearch
                              filterOption={(input, opt) =>
                                ((opt?.label as string) ?? '').toLowerCase().includes(input.toLowerCase())
                              }
                              allowClear
                            />
                          </Form.Item>
                        </Card>
                      </Col>

                      {/* Step 2 */}
                      <Col xs={24}>
                        <Card
                          size="small"
                          title={
                            <Space>
                              <Badge count="2" style={{ backgroundColor: '#1677ff' }} />
                              <CalendarOutlined />
                              <Text strong>設定する期間の種類と日程</Text>
                            </Space>
                          }
                          style={{ borderRadius: 8 }}
                        >
                          <Form.Item
                            label="設定対象"
                            name="settingType"
                            initialValue="both"
                            style={{ marginBottom: ITEM_SPACING }}
                          >
                            <Select
                              style={{ width: 280 }}
                              onChange={setQuickSettingType}
                              options={[
                                { value: 'goal', label: `${tFn('IDS_AIM_SETTING')}のみ` },
                                { value: 'evaluation', label: `${tFn('IDS_EVALUATION')}のみ` },
                                { value: 'both', label: '目標設定・評価実施の両方' },
                              ]}
                            />
                          </Form.Item>

                          <Row gutter={[ITEM_SPACING, ITEM_SPACING]}>
                            {(quickSettingType === 'goal' || quickSettingType === 'both') && (
                              <>
                                <Col xs={24} md={12}>
                                  <Form.Item
                                    label={tFn('IDS_DEPARTMENTAL_GOAL_SETTING')}
                                    name="quickDeptGoal"
                                    rules={[{ required: true, message: '設定してください' }]}
                                    style={{ marginBottom: 0 }}
                                  >
                                    <RangePicker format={dateFormat} clearIcon={false} style={{ width: '100%' }} />
                                  </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                  <Form.Item
                                    label={tFn('IDS_PERSONAL_GOAL_SETTING')}
                                    name="quickUserGoal"
                                    rules={[{ required: true, message: '設定してください' }]}
                                    style={{ marginBottom: 0 }}
                                  >
                                    <RangePicker format={dateFormat} clearIcon={false} style={{ width: '100%' }} />
                                  </Form.Item>
                                </Col>
                              </>
                            )}
                            {(quickSettingType === 'evaluation' || quickSettingType === 'both') && (
                              <>
                                <Col xs={24} md={12}>
                                  <Form.Item
                                    label={tFn('IDS_DIVISION_EVALUATION')}
                                    name="quickDeptEval"
                                    rules={[{ required: true, message: '設定してください' }]}
                                    style={{ marginBottom: 0 }}
                                  >
                                    <RangePicker format={dateFormat} clearIcon={false} style={{ width: '100%' }} />
                                  </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                  <Form.Item
                                    label={tFn('IDS_EVALUATION_PERSONAL')}
                                    name="quickUserEval"
                                    rules={[{ required: true, message: '設定してください' }]}
                                    style={{ marginBottom: 0 }}
                                  >
                                    <RangePicker format={dateFormat} clearIcon={false} style={{ width: '100%' }} />
                                  </Form.Item>
                                </Col>
                              </>
                            )}
                          </Row>
                        </Card>
                      </Col>

                      {/* Step 3: Preview + per-division quick edit */}
                      <Col xs={24}>
                        <Card
                          size="small"
                          title={
                            <Space>
                              <Badge count="3" style={{ backgroundColor: '#1677ff' }} />
                              <TeamOutlined />
                              <Text strong>適用{t('IDS_PREVIEW')}</Text>
                            </Space>
                          }
                          style={{ borderRadius: 8 }}
                        >
                          {selectedDivisions.length === 0 ? (
                            <Text type="secondary">ステップ 1 で部署を選択してください。</Text>
                          ) : (
                            <Space direction="vertical" style={{ width: '100%' }} size={12}>
                              {/* Summary row */}
                              <Space wrap>
                                {selectedDivisions.map((d) => {
                                  const found = divisionList.find((o) => o.value === d);
                                  const count = quickUserCountMap[d];
                                  return (
                                    <Tag key={d} color="geekblue" style={{ fontSize: 13 }}>
                                      <ApartmentOutlined style={{ marginRight: 4 }} />
                                      {found?.name || d}
                                      {count !== undefined && (
                                        <span style={{ marginLeft: 6, fontWeight: 600 }}>{count}名</span>
                                      )}
                                    </Tag>
                                  );
                                })}
                              </Space>
                              {(() => {
                                const total = selectedDivisions.reduce(
                                  (acc, v) => acc + (quickUserCountMap[v] || 0),
                                  0,
                                );
                                return total > 0 ? (
                                  <Space>
                                    <TeamOutlined style={{ color: '#1677ff', fontSize: 15 }} />
                                    <Text strong style={{ fontSize: 14 }}>
                                      合計 <Text style={{ fontSize: 16, color: '#1677ff' }}>{total}</Text>{' '}
                                      名に適用されます
                                    </Text>
                                  </Space>
                                ) : null;
                              })()}
                            </Space>
                          )}
                        </Card>
                      </Col>
                    </Row>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: BLOCK_SPACING }}>
                      <Button
                        type="primary"
                        icon={<ThunderboltOutlined />}
                        disabled={selectedDivisions.length === 0 || isFixed}
                        onClick={handleQuickApply}
                        loading={isLoadingQuick}
                      >
                        一括適用
                      </Button>
                    </div>
                  </Form>
                </Spin>
              </div>
            ),
          },

          // ─────────────────────────────────────────────────────────
          // Tab 3: 対象者
          // ─────────────────────────────────────────────────────────
          {
            key: 'targets',
            label: (
              <Space>
                <TeamOutlined />
                {tFn('IDS_TARGET_PERSON')}
              </Space>
            ),
            children: (
              <div>
                {/* Compact alert */}
                <Alert
                  type="info"
                  showIcon
                  style={{ marginBottom: ITEM_SPACING, padding: '4px 12px' }}
                  message={
                    <span style={{ fontSize: 12 }}>
                      個人別の追加期間設定 — 対象者に共通期間とは別の追加評価期間を設定できます。
                    </span>
                  }
                />

                {/* Search form */}
                <Card size="small" style={{ marginBottom: ITEM_SPACING, borderRadius: 8 }}>
                  <SettingEvaluatorSearchForm
                    form={searchEvaluatorForm}
                    conditions={userConditions}
                    setConditions={setUserConditions}
                    setDataSources={() => {}}
                    isLoading={isLoadingUsers}
                    listDepartment={listDepartment}
                    setSelectedRowKeys={setSelectedRowKeys}
                    state={state}
                    setSelectedRows={setSelectedRows}
                    listSkill={listSkills}
                  />
                </Card>

                {/* Action buttons */}
                <Space style={{ marginBottom: ITEM_SPACING }} wrap>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    disabled={isFixed}
                    onClick={() => setOpenPopupAddUser(true)}
                  >
                    {tFn('IDS_ADD_USER')}
                  </Button>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    disabled={selectedRowKeys.length === 0 || isFixed}
                    onClick={() => setDeleteConfirmOpen(true)}
                  >
                    {tFn('IDS_BUTTON_DELETE_MULTIPLE')}
                  </Button>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    disabled={
                      selectedRowKeys.length === 0 ||
                      isFixed ||
                      (selectedRows.length > 0 && selectedRows.every((r: any) => r.childrens?.length > 0))
                    }
                    onClick={handleOpenEdit}
                  >
                    {tFn('IDS_BUTTON_EDIT_MULTIPLE')}
                  </Button>
                </Space>

                {/* Flat modern table */}
                <Spin spinning={isLoadingUsers}>
                  <Table
                    dataSource={flatUserList}
                    rowKey={(r: any) => r._rowKey}
                    size="small"
                    bordered
                    style={{ borderRadius: 8, overflow: 'hidden' }}
                    pagination={false}
                    scroll={{ x: 1300 }}
                    rowSelection={{
                      selectedRowKeys,
                      onChange: (keys, rows) => {
                        setSelectedRowKeys(keys);
                        setSelectedRows(rows);
                      },
                    }}
                    columns={[
                      {
                        title: ' ',
                        key: 'exception',
                        width: 55,
                        align: 'center' as const,
                        render: (_: any, record: any) => {
                          const ac = record._activeChild;
                          const buildUserInfor = () => ({
                            ...userInfor,
                            id: record.userId,
                            fullName: `${record.employeeNumber}: ${record.fullName}`,
                            email: record.email,
                            company: ac?.companyName ?? record.company?.name,
                            department: ac
                              ? ac.level > 7
                                ? ac.divisionName
                                : ac.departmentName
                              : record.evaluatorDefault?.level > 7
                              ? record.evaluatorDefault?.divisionName
                              : record.evaluatorDefault?.departmentName,
                          });
                          return (
                            <Tooltip title={tFn('IDS_ADD_EXCEPTION')}>
                              <PlusSquareOutlined
                                style={{
                                  color: '#007240',
                                  fontSize: 22,
                                  cursor: isFixed ? 'not-allowed' : 'pointer',
                                  opacity: isFixed ? 0.4 : 1,
                                }}
                                onClick={() => {
                                  if (isFixed) return;
                                  setUserInfor(buildUserInfor());
                                  setPopupData(record.childrens || []);
                                  setIsPopupEdit(true);
                                  setOpenPopUp(true);
                                }}
                              />
                            </Tooltip>
                          );
                        },
                      },
                      {
                        title: tFn('IDS_FULLNAME'),
                        key: 'user',
                        width: 180,
                        render: (_: any, record: any) => {
                          const level = record.evaluatorDefault?.level ?? 0;
                          const child = record._activeChild;
                          const pd = periodData as any;

                          const norm = (d: string | null | undefined) => {
                            if (!d) return null;
                            const p = parseDate(d);
                            return p ? p.format('YYYY/MM/DD') : null;
                          };

                          let isCustom = false;
                          let customLines: string[] = [];

                          if (child) {
                            if (level <= 7) {
                              const uGoalS = norm(child.dateCreationGoalStart);
                              const uGoalE = norm(child.dateCreationGoalEnd);
                              const uEvalS = norm(child.dateEvaluationStart);
                              const uEvalE = norm(child.dateEvaluationEnd);
                              const cGoalS = norm(pd?.dateCreationGoalStart);
                              const cGoalE = norm(pd?.dateCreationGoalEnd);
                              const cEvalS = norm(pd?.dateEvaluationStart);
                              const cEvalE = norm(pd?.dateEvaluationEnd);
                              if (uGoalS && (uGoalS !== cGoalS || uGoalE !== cGoalE)) {
                                isCustom = true;
                                customLines.push(`目標設定: ${uGoalS} ～ ${uGoalE}`);
                              }
                              if (uEvalS && (uEvalS !== cEvalS || uEvalE !== cEvalE)) {
                                isCustom = true;
                                customLines.push(`評価実施: ${uEvalS} ～ ${uEvalE}`);
                              }
                            } else {
                              const tc = child.timeCommon;
                              const uGoalS = norm(tc?.dateCreationGoalDepartmentStart || child.dateCreationGoalStart);
                              const uGoalE = norm(tc?.dateCreationGoalDepartmentEnd || child.dateCreationGoalEnd);
                              const uEvalS = norm(tc?.dateEvaluationDepartmentStart || child.dateEvaluationStart);
                              const uEvalE = norm(tc?.dateEvaluationDepartmentEnd || child.dateEvaluationEnd);
                              const cGoalS = norm(pd?.dateCreationGoalDepartmentStart || pd?.dateCreationGoalStart);
                              const cGoalE = norm(pd?.dateCreationGoalDepartmentEnd || pd?.dateCreationGoalEnd);
                              const cEvalS = norm(pd?.dateEvaluationDepartmentStart || pd?.dateEvaluationStart);
                              const cEvalE = norm(pd?.dateEvaluationDepartmentEnd || pd?.dateEvaluationEnd);
                              if (uGoalS && (uGoalS !== cGoalS || uGoalE !== cGoalE)) {
                                isCustom = true;
                                customLines.push(`目標設定: ${uGoalS} ～ ${uGoalE}`);
                              }
                              if (uEvalS && (uEvalS !== cEvalS || uEvalE !== cEvalE)) {
                                isCustom = true;
                                customLines.push(`評価実施: ${uEvalS} ～ ${uEvalE}`);
                              }
                            }
                          }

                          return (
                            <Space size={4} align="center">
                              <Text style={{ fontSize: 13 }}>
                                <span style={{ color: '#888' }}>{record.employeeNumber}</span>
                                {': '}
                                <span style={{ fontWeight: 600 }}>{record.fullName}</span>
                              </Text>
                              {isCustom && (
                                <Tooltip
                                  title={
                                    <div>
                                      <div style={{ fontWeight: 600, marginBottom: 4 }}>手動設定済み</div>
                                      {customLines.map((line, i) => (
                                        <div key={i}>{line}</div>
                                      ))}
                                    </div>
                                  }
                                  color="orange"
                                >
                                  <WarningOutlined style={{ color: '#faad14', fontSize: 14, flexShrink: 0 }} />
                                </Tooltip>
                              )}
                            </Space>
                          );
                        },
                      },
                      {
                        title: tFn('IDS_DEPARTMENT'),
                        key: 'dept',
                        width: 160,
                        render: (_: any, record: any) => {
                          const src = record._activeChild || record.evaluatorDefault;
                          const divName = src?.divisionName;
                          const deptName = src?.departmentName;
                          return (
                            <Space direction="vertical" size={2}>
                              {divName && (
                                <Text style={{ fontSize: 12 }}>
                                  <Tag color="geekblue" style={{ margin: 0, fontSize: 11 }}>
                                    部署
                                  </Tag>{' '}
                                  {divName}
                                </Text>
                              )}
                              {deptName && (
                                <Text style={{ fontSize: 12 }}>
                                  <Tag color="cyan" style={{ margin: 0, fontSize: 11 }}>
                                    課名
                                  </Tag>{' '}
                                  {deptName}
                                </Text>
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
                        width: 50,
                        render: (_: any, record: any) => {
                          const lv = record._activeChild?.level ?? record.evaluatorDefault?.level;
                          return lv ? (
                            <Tag color="blue" style={{ margin: 0 }}>
                              {lv}
                            </Tag>
                          ) : (
                            <span style={{ color: '#ccc' }}>—</span>
                          );
                        },
                      },
                      {
                        title: tFn('IDS_EVALUATION_SKILL'),
                        key: 'flagSkill',
                        align: 'center' as const,
                        width: 75,
                        render: (_: any, record: any) => {
                          const fs = record._activeChild?.flagSkill ?? record.evaluatorDefault?.flagSkill;
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
                        width: 160,
                        render: (_: any, record: any) => {
                          const ev = record.evaluatorDefault;
                          if (!ev) return <span style={{ color: '#ccc', fontSize: 12 }}>—</span>;
                          const build = (obj: any) => (obj ? `${obj.employeeNumber}: ${obj.fullName}` : null);
                          const items = [
                            { label: tFn('IDS_POINT_EVALUATOR_0_5'), val: build(ev.evaluator05) },
                            { label: tFn('IDS_POINT_EVALUATOR_1'), val: build(ev.evaluator1) },
                            { label: tFn('IDS_POINT_EVALUATOR_2'), val: build(ev.evaluator2) },
                          ].filter((i) => i.val);
                          if (!items.length) return <span style={{ color: '#ccc', fontSize: 12 }}>—</span>;
                          return (
                            <Space direction="vertical" size={2}>
                              {items.map((item, i) => (
                                <Text key={i} style={{ fontSize: 12 }}>
                                  <Tag style={{ margin: 0, fontSize: 11 }}>{item.label}</Tag> {item.val}
                                </Text>
                              ))}
                            </Space>
                          );
                        },
                      },
                      {
                        title: '目標設定期間',
                        key: 'goalPeriod',
                        width: 155,
                        render: (_: any, record: any) => {
                          const level = record.evaluatorDefault?.level ?? 0;
                          const child = record._activeChild;
                          const tc = child?.timeCommon;
                          // periodData (Tab 1) làm fallback cuối cùng khi chưa có evaluation record
                          const pd = periodData as any;
                          let start: string | null = null;
                          let end: string | null = null;
                          if (level <= 7) {
                            start =
                              child?.dateCreationGoalStart ||
                              tc?.dateCreationGoalStart ||
                              pd?.dateCreationGoalStart ||
                              null;
                            end =
                              child?.dateCreationGoalEnd || tc?.dateCreationGoalEnd || pd?.dateCreationGoalEnd || null;
                          } else {
                            start =
                              tc?.dateCreationGoalDepartmentStart ||
                              tc?.dateCreationGoalStart ||
                              pd?.dateCreationGoalDepartmentStart ||
                              pd?.dateCreationGoalStart ||
                              null;
                            end =
                              tc?.dateCreationGoalDepartmentEnd ||
                              tc?.dateCreationGoalEnd ||
                              pd?.dateCreationGoalDepartmentEnd ||
                              pd?.dateCreationGoalEnd ||
                              null;
                          }
                          if (!start) return <span style={{ color: '#ccc', fontSize: 12 }}>—</span>;
                          const fmt = (d: string) => {
                            const p = parseDate(d);
                            return p ? p.format(dateFormat) : d;
                          };
                          return (
                            <Text style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                              {fmt(start)} ～ {fmt(end ?? '')}
                            </Text>
                          );
                        },
                      },
                      {
                        title: '評価実施期間',
                        key: 'evalPeriod',
                        width: 155,
                        render: (_: any, record: any) => {
                          const level = record.evaluatorDefault?.level ?? 0;
                          const child = record._activeChild;
                          const tc = child?.timeCommon;
                          const pd = periodData as any;
                          let start: string | null = null;
                          let end: string | null = null;
                          if (level <= 7) {
                            start =
                              child?.dateEvaluationStart || tc?.dateEvaluationStart || pd?.dateEvaluationStart || null;
                            end = child?.dateEvaluationEnd || tc?.dateEvaluationEnd || pd?.dateEvaluationEnd || null;
                          } else {
                            start =
                              tc?.dateEvaluationDepartmentStart ||
                              tc?.dateEvaluationStart ||
                              pd?.dateEvaluationDepartmentStart ||
                              pd?.dateEvaluationStart ||
                              null;
                            end =
                              tc?.dateEvaluationDepartmentEnd ||
                              tc?.dateEvaluationEnd ||
                              pd?.dateEvaluationDepartmentEnd ||
                              pd?.dateEvaluationEnd ||
                              null;
                          }
                          if (!start) return <span style={{ color: '#ccc', fontSize: 12 }}>—</span>;
                          const fmt = (d: string) => {
                            const p = parseDate(d);
                            return p ? p.format(dateFormat) : d;
                          };
                          return (
                            <Text style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                              {fmt(start)} ～ {fmt(end ?? '')}
                            </Text>
                          );
                        },
                      },
                      {
                        title: tFn('IDS_TEMPLATE'),
                        key: 'template',
                        width: 180,
                        render: (_: any, record: any) => {
                          const skills: string[] = (record.skillUser || [])
                            .filter((item: any) => item?.evaluationId == null)
                            .map((v: any) => v?.skill?.name)
                            .filter(Boolean);
                          if (!skills.length) return <span style={{ color: '#ccc', fontSize: 12 }}>—</span>;
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
                                      fontSize: 11,
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
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <Pagination
                      current={userConditions.current}
                      pageSize={20}
                      total={userTotal}
                      showSizeChanger={false}
                      showTotal={(total, range) =>
                        `${total}${tFn('IDS_CASE_LABEL')} ${range[0]}-${range[1]}${tFn('IDS_ITEM_LABEL')}`
                      }
                      onChange={(page) =>
                        setUserConditions((prev: any) => ({
                          ...prev,
                          current: page,
                          offset: (page - 1) * 20,
                        }))
                      }
                    />
                  </div>
                </Spin>

                {/* ユーザ追加 */}
                <PopupAddUserSettingEvaluator
                  state={state}
                  handleOnchange={handleOnchangeUsers}
                  conditions={userConditions}
                  isOpenPopupAddUser={isOpenPopupAddUser}
                  setOpenPopupAddUser={setOpenPopupAddUser}
                />

                {/* 選択削除 confirm */}
                <ModalCustomComponent
                  isOpen={isDeleteConfirmOpen}
                  header={tFn('POPUP_DIALOG.TITLE.CONFIRM')}
                  content={tFn('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_USER')}
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
                    selectedRows.length > 1 ? (
                      <MultiEditForm
                        selectedRecord={selectedRows}
                        handleCancel={handleCancelEdit}
                        setSelectedRowKeys={setSelectedRowKeys}
                        selectedRowKeys={selectedRowKeys}
                        handleSearch={handleOnchangeUsers}
                        setTextNotify={setTextNotify}
                        setIsVisibleNotify={setIsVisibleNotify}
                        temListEvaluators={temListEvaluators}
                        state={state}
                        setSelectedRows={setSelectedRows}
                      />
                    ) : (
                      <SingleEditForm
                        selectedRecord={selectedRows}
                        handleCancel={handleCancelEdit}
                        setSelectedRowKeys={setSelectedRowKeys}
                        selectedRowKeys={selectedRowKeys}
                        handleSearch={handleSearchSavePopUp}
                        listChangeOptinals={listChangeOptinals}
                        setTextNotify={setTextNotify}
                        setIsVisibleNotify={setIsVisibleNotify}
                        state={state}
                        setSelectedRows={setSelectedRows}
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
                    <div key="close" style={{ textAlign: 'left' }}>
                      <Button onClick={() => setIsVisibleNotify(false)}>{tFn('IDS_BUTTON_CLOSE')}</Button>
                    </div>,
                  ]}
                >
                  <p dangerouslySetInnerHTML={{ __html: textNotify }} />
                </Modal>

                {/* 例外設定 popup */}
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
                    isLoading={isLoadingUsers}
                    year={year}
                    periodIndex={periodIndex}
                    data={popupData}
                    periodId={state?.periodId}
                    isEdit={isPopupEdit}
                    setIsEdit={setIsPopupEdit}
                    handleCancelPopUp={() => {
                      if (!isPopupEdit) setOpenPopUp(false);
                      setIsPopupEdit(false);
                    }}
                    handleSearchSavePopUp={handleSearchSavePopUp}
                    handleClosePopUp={() => setOpenPopUp(false)}
                    isFixed={isFixed}
                    i18n={i18n}
                  />
                </Modal>
              </div>
            ),
          },
        ]}
      />

      {/* Confirm save modal */}
      <ModalCustomComponent
        isOpen={isConfirmSaveOpen}
        header={tFn('POPUP_DIALOG.TITLE.CONFIRM')}
        content={tFn('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE')}
        fnHandleOk={handleSave}
        fnHandleCancel={() => setConfirmSaveOpen(false)}
        okText={tFn('IDS_BUTTON_SAVE') as string}
        cancelText={tFn('POPUP_DIALOG.BUTTON.CANCEL') as string}
        loading={isLoadingPeriod}
      />

      {/* Quick apply confirm modal */}
      <Modal
        title={
          <Space>
            <ThunderboltOutlined style={{ color: '#faad14' }} />
            一括適用の確認
          </Space>
        }
        open={isQuickConfirmOpen}
        onOk={handleQuickConfirm}
        onCancel={() => setQuickConfirmOpen(false)}
        okText="適用する"
        cancelText={tFn('POPUP_DIALOG.BUTTON.CANCEL')}
        confirmLoading={isLoadingQuick}
      >
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message={`選択した部署の全メンバーに期間設定を一括で上書きします。続けますか？`}
        />
        <Space direction="vertical" size={4}>
          {selectedDivisions.map((d) => {
            const found = divisionList.find((o) => o.value === d);
            return (
              <Space key={d}>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <Text>{found?.name || d}</Text>
              </Space>
            );
          })}
        </Space>
      </Modal>

      {/* SendEmail modal */}
      <SendEmailScreen
        key={`mail-${mailSendType}-${levelType}`}
        isOpen={isOpenMail}
        handleClosePopup={handleCloseMail}
        type={mailSendType}
        toUserList={toEmailList}
        mailTitle={mailTitle}
        mailContent={mailContent}
        periodInfo={periodData as any}
        levelType={levelType}
        isLoading={isLoadingPeriod}
        setLoading={setLoadingPeriod}
        i18n={i18n}
      />
    </Spin>
  );
};

export default SolutionThird;
