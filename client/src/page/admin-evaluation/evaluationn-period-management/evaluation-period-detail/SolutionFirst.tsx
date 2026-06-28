import React, { useEffect, useMemo, useState } from 'react';
import {
  Space,
  Card,
  Form,
  Button,
  Table,
  Progress,
  Row,
  Col,
  Select,
  Input,
  DatePicker,
  Dropdown,
  Checkbox,
  Tooltip,
  Typography,
  Modal,
  Divider,
  Cascader,
  Spin,
  message,
  Tag,
  Alert,
  Pagination,
} from 'antd';
import Icon, {
  DashOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  PlusSquareOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import SendMail from './SendMail';
import dayjs from 'dayjs';
import { getConditionSearch } from '../../../../views/admin/user-management/user-list/user-list/restApi/conditionSearch';
import settingEvaluatorApiService from '../../../../common/api/settingEvaluator';
import userEvaluationApiService from '../../../../common/api/userEvaluation';
import httpAxios from '../../../../common/http';
import ExceptionPeriodInfor from '../../../../views/admin-period/ExceptionPeriodInfor';
import SettingEvaluatorSearchForm from '../../../admin/set-evaluation/components/SettingEvaluatorSearchForm';
import PopupAddUserSettingEvaluator from '../../../admin/set-evaluation/components/PopupAddUserSettingEvaluator';
import ModalPopup from '../../../../common/ModalPopup';
import MultiEditForm from '../../../admin/set-evaluation/components/MultiEditForm';
import SingleEditForm from '../../../admin/set-evaluation/components/SingleEditForm';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import { MetaModal } from '../../../../model/MetalModel';
const { RangePicker } = DatePicker;
const { Option } = Select;
const BLOCK_SPACING = 25;
const ITEM_SPACING = 15;

const defaultCompanyDates = {
  deptGoalSetting: [dayjs('2026-05-28'), dayjs('2026-06-29')],
  userGoalSetting: [dayjs('2026-04-30'), dayjs('2026-05-29')],
  deptEvaluation: [dayjs('2026-05-28'), dayjs('2026-06-29')],
  userEvaluation: [dayjs('2026-04-30'), dayjs('2026-05-29')],
};
interface Props {
  departmentDatas: any;
  searchForm: any;
  selectedRowKeys: any;
  setSelectedRows: any;
  setSelectedRowKeys: any;
  selectedRows: any;
  dataSources: any;
  onIndividualSetting: (deptName: string) => void;
}

const SolutionFirst = ({
  departmentDatas,
  searchForm,
  selectedRowKeys,
  setSelectedRows,
  setSelectedRowKeys,
  selectedRows,
  dataSources,
  onIndividualSetting,
}: Props) => {
  const [isFixed, setIsFixed] = useState(false);
  const [tableSkill, setTableSkill] = useState() as any;
  const [isOpenPopup, setOpenPopup] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [divisionList, setDivisionList] = useState([]) as any;
  const [isLoading, setIsLoading] = useState(false);

  // ── Route state ────────────────────────────────────────────────
  const { state: routeState } = useLocation();
  const { i18n } = useTranslation();
  const routeYear = routeState?.year;
  const routePeriodIndex = routeState?.periodIndex;
  const dateFormat = i18n.language === 'ja' ? 'YYYY/M/D' : i18n.language === 'en' ? 'YYYY/D/M' : 'D/M/YYYY';

  // ── Tab 対象者 state (same as SolutionThird) ───────────────────
  const [searchEvaluatorForm] = Form.useForm();
  const [userConditions, setUserConditions] = useState<any>({
    offset: 0,
    limit: 20,
    department: t('IDS_ALL'),
    userName: '',
    evaluatorName: '',
    level: t('IDS_ALL'),
    flagSkill: t('IDS_ALL'),
    skill: t('IDS_ALL'),
    current: 1,
    exception: -1,
    isSearch: true,
  });
  const [userList, setUserList] = useState<any[]>([]);
  const [userTotal, setUserTotal] = useState(0);
  const [isLoadingUsers, setLoadingUsers] = useState(false);
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
  // 例外設定 popup
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

  // Flatten: mỗi child exception thành một hàng riêng
  const flatUserList = useMemo(
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

  const parseDate = (value: string | undefined | null): dayjs.Dayjs | null => {
    if (!value || !value.trim()) return null;
    const slashParts = value.trim().split('/');
    if (slashParts.length === 3) {
      const [y, m, d] = slashParts;
      const isoStr = `${y}-${m.padStart(2, '0')}-${d.slice(0, 2).padStart(2, '0')}`;
      const parsed = dayjs(isoStr);
      if (parsed.isValid()) return parsed;
    }
    const dashParts = value.trim().split('-');
    if (dashParts.length === 3) {
      const parsed = dayjs(value.trim().slice(0, 10));
      if (parsed.isValid()) return parsed;
    }
    return null;
  };

  const handleOnchangeUsers = () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
    settingEvaluatorApiService.searchListSettingEvaluator(
      { ...userConditions, ...routeState },
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
        state: {
          year: routeYear,
          periodIndex: routePeriodIndex,
          periodId: routeState?.periodId,
          checkFixed: routeState?.checkFixed,
        },
      })
      .then((res: any) => {
        if (res?.status === 200) {
          message.success(t('MESSAGE.COMMON.IDM_DELETE_USER_SUCCESS'));
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
      title: selectedRows.length > 1 ? t('IDS_EDIT_EVALUATOR_MULTIPLE') : t('IDS_EDIT_EVALUATOR'),
    });
  };

  const handleCancelEdit = () => {
    setMetaModal({ ...metaModal, isOpen: false });
    temListEvaluators = [];
    listChangeOptinals = [];
  };

  const handleSearchSavePopUp = () => {
    settingEvaluatorApiService.searchListSettingEvaluator(
      { ...userConditions, ...routeState, offset: (userConditions.current - 1) * 20 },
      (res: any) => {
        setUserList(res?.data || []);
        setUserTotal(res?.counts || 0);
      },
      setLoadingUsers,
    );
  };

  // --- Quản lý Trạng thái ---
  const [isCommonEdit, setIsCommonEdit] = useState<boolean>(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState<boolean>(false);
  const [deptFilter, setDeptFilter] = useState<string>('');
  const [deptCascaderValue, setDeptCascaderValue] = useState<any[]>([]);
  const [localDeptData, setLocalDeptData] = useState<any[]>(departmentDatas);
  const [selectedDeptName, setSelectedDeptName] = useState('');
  const [form] = Form.useForm();
  const [departmentAdd] = Form.useForm();

  const deptTableColumns = useMemo(() => {
    const filterOptions = divisionList.flatMap((div: any) => {
      const rows: { text: string; value: string }[] = [];
      if (div.label) rows.push({ text: div.label, value: div.label });
      (div.children || [])
        .filter((c: any) => c.value !== -1 && c.label !== t('IDS_ALL'))
        .forEach((c: any) => rows.push({ text: c.label, value: c.label }));
      return rows;
    });
    return [
      {
        title: '部署',
        dataIndex: 'departmentName',
        key: 'departmentName',
        width: 200,
        render: (text: string) => <strong>{text}</strong>,
      },
      {
        title: '進捗状況',
        key: 'progress',
        width: 200,
        render: (_: any, record: any) => (
          <>
            <Row gutter={[5, 5]}>
              <Col>
                <Typography.Text>目標:</Typography.Text>
              </Col>
              <Col span={16}>
                <Progress percent={record.goalProgress} size="small" />
              </Col>
            </Row>
            <Row gutter={[5, 5]}>
              <Col>
                <Typography.Text>評価:</Typography.Text>
              </Col>
              <Col span={16}>
                <Progress percent={record.evalProgress} size="small" />
              </Col>
            </Row>
          </>
        ),
      },
      {
        title: '設定期間',
        key: 'period',
        width: 260,
        render: (_: any, record: any) => (
          <Space direction="vertical" size={2}>
            <Space size={4}>
              <Typography.Text>目標設定:</Typography.Text>
              <Typography.Text>{`${record.evaluationGoalDivisionStart} ～ ${record.evaluationGoalDivisionEnd}`}</Typography.Text>
            </Space>
            <Space size={4}>
              <Typography.Text>評価実施:</Typography.Text>
              <Typography.Text>{`${record.evaluateDivisionStart} ～ ${record.evaluateDivisionEnd}`}</Typography.Text>
            </Space>
          </Space>
        ),
      },
      {
        title: '操作',
        key: 'action',
        width: 60,
        align: 'center' as const,
        render: (_: any, record: any) => (
          <Tooltip title="個別設定">
            <Button type="primary" icon={<EditOutlined />} onClick={() => onIndividualSetting(record.departmentName)} />
          </Tooltip>
        ),
      },
    ];
  }, [divisionList, onIndividualSetting]);

  const deptSelectOptions = useMemo(() => {
    if (divisionList.length > 0) {
      return divisionList.flatMap((div: any) => {
        const rows: { label: string; value: string }[] = [];
        if (div.label) rows.push({ label: div.label, value: div.label });
        (div.children || [])
          .filter((c: any) => c.value !== -1 && c.label !== t('IDS_ALL'))
          .forEach((c: any) => rows.push({ label: c.label, value: c.label }));
        return rows;
      });
    }
    return Array.from(new Set(localDeptData.map((d: any) => d.departmentName))).map((name: any) => ({
      label: name,
      value: name,
    }));
  }, [divisionList, localDeptData]);

  const filteredDeptData = useMemo(() => {
    if (!deptFilter) return localDeptData;
    return localDeptData.filter((d: any) => d.departmentName === deptFilter);
  }, [localDeptData, deptFilter]);

  const handleDeptSubmit = () => {
    departmentAdd
      .validateFields()
      .then((values) => {
        const newRecord = {
          key: String(Date.now()),
          departmentName: selectedDeptName,
          goalProgress: 0,
          evalProgress: 0,
          isCustomPeriod: true,
          evaluationGoalDivisionStart: values.deptGoalSetting[0].format('YYYY/MM/DD'),
          evaluationGoalDivisionEnd: values.deptGoalSetting[1].format('YYYY/MM/DD'),
          evaluateDivisionStart: values.deptEvaluation?.[0]?.format('YYYY/MM/DD') ?? '',
          evaluateDivisionEnd: values.deptEvaluation?.[1]?.format('YYYY/MM/DD') ?? '',
        };
        setLocalDeptData((prev) => [...prev, newRecord]);
        departmentAdd.resetFields();
        setSelectedDeptName('');
        setIsDeptModalOpen(false);
      })
      .catch(() => {});
  };

  const mailDropdownMenu = {
    items: [
      { key: '1', label: '今すぐ送信' },
      { key: '2', label: '後で送信' },
    ],
    onClick: ({ key }: { key: string }) => {
      setIsModalOpen(true);
    },
  };

  const buttonShowMore = (record: any) => {
    return (
      <Button
        style={{ marginLeft: '5px', marginTop: '2px' }}
        onClick={() => {
          setTableSkill(record);
          setOpenPopup(true);
        }}
      >
        <DashOutlined />
      </Button>
    );
  };

  const showColumnTitle = () => {
    return (
      <Space>
        <Checkbox></Checkbox>
        <Tooltip title={t('IDS_TOOLTIP_CHECKBOX_EVALUATOR')}>
          <Icon component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>} />
        </Tooltip>
      </Space>
    );
  };

  // Hàm phụ trợ để format dayjs array thành chuỗi hiển thị khi không ở chế độ edit
  const renderDisplayDate = (fieldName: keyof typeof defaultCompanyDates) => {
    const dates = form.getFieldValue(fieldName) || defaultCompanyDates[fieldName];
    if (dates && dates[0] && dates[1]) {
      return `${dates[0].format('YYYY/MM/DD')} ～ ${dates[1].format('YYYY/MM/DD')}`;
    }

    return '---';
  };

  const renderPeriodFormFields = (isEditMode: boolean) => (
    <Row gutter={[ITEM_SPACING, ITEM_SPACING]}>
      {/* Khối 1: Mục tiêu */}
      <Col xs={24} md={12} xl={12}>
        <div
          style={{
            background: '#F8FAFC',
            borderRadius: 8,
            padding: '20px',
            height: '100%',
            border: '1px solid #E2E8F0',
          }}
        >
          <Typography.Title level={5} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarOutlined style={{ color: '#0284C7' }} /> 目標設定
          </Typography.Title>

          {/* 部門目標設定 */}
          <div style={{ marginBottom: 15 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <Typography.Text strong>
                部門目標設定{isEditMode && <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>}
              </Typography.Text>
              {!isEditMode && (
                <Dropdown menu={mailDropdownMenu} placement="bottomRight" trigger={['click']}>
                  <Button type="primary" size="small">
                    メール送信 <DownOutlined />
                  </Button>
                </Dropdown>
              )}
            </div>
            {isEditMode ? (
              <Form.Item name="deptGoalSetting" noStyle rules={[{ required: true }]}>
                <RangePicker
                  style={{ width: '100%', maxWidth: '260px' }}
                  format="YYYY/MM/DD"
                  clearIcon={false}
                  size="large"
                />
              </Form.Item>
            ) : (
              <Typography.Text>{renderDisplayDate('deptGoalSetting')}</Typography.Text>
            )}
          </div>

          {/* 個人目標設定 */}
          <div style={{ marginBottom: 15 }}>
            <div style={{ marginBottom: 6 }}>
              <Typography.Text strong>
                個人目標設定{isEditMode && <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>}
              </Typography.Text>
            </div>
            {isEditMode ? (
              <Form.Item name="userGoalSetting" noStyle rules={[{ required: true }]}>
                <RangePicker
                  style={{ width: '100%', maxWidth: '260px' }}
                  format="YYYY/MM/DD"
                  clearIcon={false}
                  size="large"
                />
              </Form.Item>
            ) : (
              <Typography.Text>{renderDisplayDate('userGoalSetting')}</Typography.Text>
            )}
          </div>
        </div>
      </Col>

      {/* Khối 2: Đánh giá */}
      <Col xs={24} md={12} xl={12}>
        <div
          style={{
            background: '#F8FAFC',
            borderRadius: 8,
            padding: '20px',
            height: '100%',
            border: '1px solid #E2E8F0',
          }}
        >
          <Typography.Title level={5} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquareOutlined style={{ color: '#10B981' }} /> 評価実施
          </Typography.Title>

          {/* 部門評価 */}
          <div style={{ marginBottom: 15 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <Typography.Text strong>部門評価</Typography.Text>
              {!isEditMode && (
                <Dropdown menu={mailDropdownMenu} placement="bottomRight" trigger={['click']}>
                  <Button type="primary" size="small">
                    メール送信 <DownOutlined />
                  </Button>
                </Dropdown>
              )}
            </div>
            {isEditMode ? (
              <Form.Item name="deptEvaluation" noStyle>
                <RangePicker
                  style={{ width: '100%', maxWidth: '260px' }}
                  format="YYYY/MM/DD"
                  clearIcon={false}
                  size="large"
                />
              </Form.Item>
            ) : (
              <Typography.Text>{renderDisplayDate('deptEvaluation')}</Typography.Text>
            )}
          </div>

          {/* 個人評価 */}
          <div style={{ marginBottom: 15 }}>
            <div style={{ marginBottom: 6 }}>
              <Typography.Text strong>個人評価</Typography.Text>
            </div>
            {isEditMode ? (
              <Form.Item name="userEvaluation" noStyle>
                <RangePicker
                  style={{ width: '100%', maxWidth: '260px' }}
                  format="YYYY/MM/DD"
                  clearIcon={false}
                  size="large"
                />
              </Form.Item>
            ) : (
              <Typography.Text>{renderDisplayDate('userEvaluation')}</Typography.Text>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
  useEffect(() => {
    form.setFieldsValue(defaultCompanyDates);
    if (routeYear && routePeriodIndex) {
      userEvaluationApiService.getAllDepartmentEvaluationDefault(
        { year: routeYear, periodIndex: routePeriodIndex },
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
        { ...userConditions, ...routeState },
        (res: any) => {
          setUserList(res?.data || []);
          setUserTotal(res?.counts || 0);
        },
        setLoadingUsers,
      );
    }
  }, [userConditions]);

  useEffect(() => {
    // userApiService.getAllDepartmentTypeDepartment({ callBackTypeDepartment, errorCallBack }); // get department type department
    // userApiService.getAllDepartmentTypeDivision({ callBackTypeDivision, errorCallBack }); // get department type division
    // userApiService.getAllCompany({ callBackCompany, errorCallBack }); // get department type division
    const callBack = (data: {
      company: { id: number; name: string }[];
      departments: { id: number; code: string; name: string }[];
      divisions: {
        id: number;
        code: string;
        name: string;
        divisionId: number;
        childrens: {
          code: string;
          codeName: string;
          name: string;
          id: number;
        }[];
      }[];
    }) => {
      if (data.company.length > 0) {
        // const departmentList = data.departments.map((v) => {
        //   return {
        //     value: v.id,
        //     label: v.name,
        //   };
        // });
        // setdepartmentList(departmentList);

        const divisionList = data.divisions.map((v) => {
          if (v.childrens.length === 1 || v.childrens.length === 0) {
            return {
              value: v.divisionId,
              label: v.name,
              children: [
                ...v.childrens.map((val) => ({
                  value: val.id,
                  label: val.name,
                })),
              ],
            };
          } else {
            return {
              value: v.divisionId,
              label: v.name,
              children: [
                { label: t('IDS_ALL'), value: -1 },
                ...v.childrens.map((val) => ({
                  value: val.id,
                  label: val.name,
                })),
              ],
            };
          }
        });
        setDivisionList(divisionList);
      }
    };
    const errorCallBack = (bool: boolean) => {
      setIsLoading(bool);
    };
    setIsLoading(true);
    getConditionSearch(callBack, errorCallBack);
  }, []);

  return (
    <>
      <div style={{ marginBottom: `${BLOCK_SPACING}px` }}>
        <Space direction="vertical" style={{ width: '100%' }} size={25}>
          {/* KHỐI 1: Cấu hình chung */}
          <Card title="共通実施期間">
            <div>
              <Form form={form} layout="vertical" initialValues={defaultCompanyDates}>
                {renderPeriodFormFields(isCommonEdit)}
                <div style={{ marginTop: `${ITEM_SPACING}px`, display: 'flex', gap: `${ITEM_SPACING}px` }}>
                  {isCommonEdit ? (
                    <>
                      <Button type="primary" htmlType="submit" size="middle" onClick={() => setIsCommonEdit(false)}>
                        保存
                      </Button>
                      <Button htmlType="button" size="middle" onClick={() => setIsCommonEdit(false)}>
                        キャンセル
                      </Button>
                    </>
                  ) : (
                    <Button type="primary" htmlType="button" size="middle" onClick={() => setIsCommonEdit(true)}>
                      編集
                    </Button>
                  )}
                </div>
              </Form>
            </div>
          </Card>

          {/* KHỐI 2: Cấu hình theo phòng ban */}
          <Card title="部署別期間設定">
            <div style={{ marginBottom: 20 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDeptModalOpen(true)}>
                追加
              </Button>
              <div style={{ marginTop: 20 }}>
                <Space>
                  <Typography.Text>部署:</Typography.Text>
                  <Cascader
                    options={divisionList}
                    value={deptCascaderValue}
                    style={{ width: 280 }}
                    showSearch
                    allowClear
                    size="small"
                    placeholder="すべて"
                    displayRender={(labels) => labels.filter((l) => l && l !== t('IDS_ALL')).join(' ► ')}
                    onChange={(values: any, selectedOptions: any) => {
                      setDeptCascaderValue(values ?? []);
                      if (!values || values.length === 0) {
                        setDeptFilter('');
                        return;
                      }
                      const labels = (selectedOptions as any[])
                        .map((o: any) => o.label)
                        .filter((l: string) => l && l !== t('IDS_ALL'));
                      setDeptFilter(labels.join(' ► '));
                    }}
                  />
                </Space>
              </div>
            </div>
            <Table
              columns={deptTableColumns}
              dataSource={filteredDeptData}
              bordered
              size="small"
              pagination={{
                position: ['bottomLeft'],
                pageSize: 5,
                size: 'default',
                showSizeChanger: false,
                showTotal: (total, range) => `${total}件中 ${range[0]}-${range[1]}件目`,
                style: { marginTop: 15, marginBottom: 0 },
              }}
            />
          </Card>
        </Space>
      </div>

      {/* KHỐI 3: DANH SÁCH ĐỐI TƯỢNG */}
      <Card
        title={
          <Space size={10}>
            <UserOutlined style={{ color: '#00796B' }} />
            <span>対象者</span>
          </Space>
        }
        style={{ borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
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
            state={routeState}
            setSelectedRows={setSelectedRows}
            listSkill={listSkills}
            divisionList={divisionList}
          />
        </Card>

        {/* Action buttons */}
        <Space style={{ marginBottom: ITEM_SPACING }} wrap>
          <Button type="primary" icon={<PlusOutlined />} disabled={isFixed} onClick={() => setOpenPopupAddUser(true)}>
            {t('IDS_ADD_USER')}
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0 || isFixed}
            onClick={() => setDeleteConfirmOpen(true)}
          >
            {t('IDS_BUTTON_DELETE_MULTIPLE')}
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
            {t('IDS_BUTTON_EDIT_MULTIPLE')}
          </Button>
        </Space>

        {/* Table với expand record */}
        <Spin spinning={isLoadingUsers}>
          <Table
            dataSource={userList}
            rowKey={(r: any) => r.userId ?? r.key}
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
            expandable={{
              showExpandColumn: false,
              rowExpandable: (r: any) => (r?.childrens?.length || 0) > 0,
              expandedRowKeys: userList
                .filter((r: any) => (r?.childrens?.length || 0) > 0)
                .map((r: any) => r.userId ?? r.key),
              expandedRowRender: (record: any) => {
                const children: any[] = record.childrens || [];
                const fmt = (d: string) => {
                  const p = parseDate(d);
                  return p ? p.format(dateFormat) : d;
                };
                const childCols = [
                  {
                    title: t('IDS_FULLNAME'),
                    key: 'name',
                    width: '17%',
                    render: (_: any, c: any) => (
                      <Space direction="vertical" size={1}>
                        <Typography.Text style={{ fontSize: 13 }}>
                          <span style={{ color: '#888' }}>{record.employeeNumber}</span>
                          {': '}
                          <span style={{ fontWeight: 600 }}>{record.fullName}</span>
                        </Typography.Text>
                        {c.dateCreationGoalStart && (
                          <Typography.Text style={{ fontSize: 11, color: '#555', whiteSpace: 'nowrap' }}>
                            目標設定: {fmt(c.dateCreationGoalStart)} ～ {fmt(c.dateCreationGoalEnd ?? '')}
                          </Typography.Text>
                        )}
                        {c.dateEvaluationStart && (
                          <Typography.Text style={{ fontSize: 11, color: '#555', whiteSpace: 'nowrap' }}>
                            評価実施: {fmt(c.dateEvaluationStart)} ～ {fmt(c.dateEvaluationEnd ?? '')}
                          </Typography.Text>
                        )}
                      </Space>
                    ),
                  },
                  {
                    title: t('IDS_DEPARTMENT'),
                    key: 'dept',
                    width: '25%',
                    render: (_: any, c: any) => (
                      <Space direction="vertical" size={2}>
                        {c.divisionName && (
                          <Typography.Text style={{ fontSize: 12 }}>
                            <Tag color="geekblue" style={{ margin: 0, fontSize: 11 }}>
                              部署
                            </Tag>{' '}
                            {c.divisionName}
                          </Typography.Text>
                        )}
                        {c.departmentName && (
                          <Typography.Text style={{ fontSize: 12 }}>
                            <Tag color="cyan" style={{ margin: 0, fontSize: 11 }}>
                              課名
                            </Tag>{' '}
                            {c.departmentName}
                          </Typography.Text>
                        )}
                        {!c.divisionName && !c.departmentName && <span style={{ color: '#ccc' }}>—</span>}
                      </Space>
                    ),
                  },
                  {
                    title: t('IDS_LEVEL'),
                    key: 'level',
                    align: 'center' as const,
                    width: 35,
                    render: (_: any, c: any) =>
                      c.level ? (
                        <Tag color="blue" style={{ margin: 0 }}>
                          {c.level}
                        </Tag>
                      ) : (
                        <span style={{ color: '#ccc' }}>—</span>
                      ),
                  },
                  {
                    title: t('IDS_EVALUATION_SKILL'),
                    key: 'skill',
                    align: 'center' as const,
                    width: 75,
                    render: (_: any, c: any) =>
                      c.flagSkill === 1 ? (
                        <Tag color="success" style={{ margin: 0 }}>
                          {t('IDS_HAVE')}
                        </Tag>
                      ) : (
                        <Tag color="default" style={{ margin: 0 }}>
                          {t('IDS_NOT_HAVE')}
                        </Tag>
                      ),
                  },
                  {
                    title: t('IDS_EVALUATOR'),
                    key: 'ev',
                    width: 160,
                    render: (_: any, c: any) => {
                      const items = [
                        { label: t('IDS_POINT_EVALUATOR_0_5'), val: c.evaluator05Name },
                        { label: t('IDS_POINT_EVALUATOR_1'), val: c.evaluator10Name },
                        { label: t('IDS_POINT_EVALUATOR_2'), val: c.evaluator20Name },
                      ].filter((i) => i.val);
                      if (!items.length) return <span style={{ color: '#ccc', fontSize: 12 }}>—</span>;
                      return (
                        <Space direction="vertical" size={2}>
                          {items.map((i, idx) => (
                            <Typography.Text key={idx} style={{ fontSize: 12 }}>
                              <Tag style={{ margin: 0, fontSize: 11 }}>{i.label}</Tag> {i.val}
                            </Typography.Text>
                          ))}
                        </Space>
                      );
                    },
                  },
                  {
                    title: t('IDS_TEMPLATE'),
                    key: 'tpl',
                    width: 180,
                    render: (_: any, c: any) => {
                      const skills = (c.skillUser || [])
                        .filter((s: any) => s?.evaluationId == null)
                        .map((s: any) => s?.skill?.name)
                        .filter(Boolean);
                      if (!skills.length) return <span style={{ color: '#ccc', fontSize: 12 }}>—</span>;
                      return (
                        <Space wrap size={4}>
                          {skills.map((n: string, i: number) => (
                            <Tooltip key={i} title={n}>
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
                                {n}
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
                    columns={childCols}
                    dataSource={children}
                    rowKey={(c: any) => c.key || c.id}
                    pagination={false}
                    size="small"
                    bordered
                    style={{ margin: '0 0 0 48px' }}
                  />
                );
              },
            }}
            columns={[
              {
                title: ' ',
                key: 'exception',
                width: 30,
                align: 'center' as const,
                render: (_: any, record: any) => (
                  <Tooltip title={t('IDS_ADD_EXCEPTION')}>
                    <PlusSquareOutlined
                      style={{
                        color: '#007240',
                        fontSize: 22,
                        cursor: isFixed ? 'not-allowed' : 'pointer',
                        opacity: isFixed ? 0.4 : 1,
                      }}
                      onClick={() => {
                        if (isFixed) return;
                        setUserInfor({
                          ...userInfor,
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
                        setIsPopupEdit(true);
                        setOpenPopUp(true);
                      }}
                    />
                  </Tooltip>
                ),
              },
              {
                title: t('IDS_FULLNAME'),
                key: 'user',
                width: '17%',
                render: (_: any, record: any) => {
                  const ev = record.evaluatorDefault;
                  const fmt = (d: string) => {
                    const p = parseDate(d);
                    return p ? p.format(dateFormat) : d;
                  };
                  const goalStart = ev?.dateCreationGoalStart;
                  const goalEnd = ev?.dateCreationGoalEnd;
                  const evalStart = ev?.dateEvaluationStart;
                  const evalEnd = ev?.dateEvaluationEnd;

                  return (
                    <Space direction="vertical" size={1}>
                      <Space size={4} align="center">
                        <Typography.Text style={{ fontSize: 13 }}>
                          <span style={{ color: '#888' }}>{record.employeeNumber}</span>
                          {': '}
                          <span style={{ fontWeight: 600 }}>{record.fullName}</span>
                        </Typography.Text>
                        {(record?.childrens?.length || 0) > 0 && (
                          <Tooltip title="個人設定" color="orange">
                            <WarningOutlined style={{ color: '#faad14', fontSize: 14 }} />
                          </Tooltip>
                        )}
                      </Space>
                      {goalStart && (
                        <Typography.Text style={{ fontSize: 11, color: '#555', whiteSpace: 'nowrap' }}>
                          目標設定: {fmt(goalStart)} ～ {fmt(goalEnd ?? '')}
                        </Typography.Text>
                      )}
                      {evalStart && (
                        <Typography.Text style={{ fontSize: 11, color: '#555', whiteSpace: 'nowrap' }}>
                          評価実施: {fmt(evalStart)} ～ {fmt(evalEnd ?? '')}
                        </Typography.Text>
                      )}
                    </Space>
                  );
                },
              },
              {
                title: t('IDS_DEPARTMENT'),
                key: 'dept',
                width: '25%',
                render: (_: any, record: any) => {
                  const src = record.evaluatorDefault;
                  const divName = src?.divisionName;
                  const deptName = src?.departmentName;
                  return (
                    <Space direction="vertical" size={2}>
                      {divName && (
                        <Typography.Text style={{ fontSize: 12 }}>
                          <Tag color="geekblue" style={{ margin: 0, fontSize: 11 }}>
                            部署
                          </Tag>{' '}
                          {divName}
                        </Typography.Text>
                      )}
                      {deptName && (
                        <Typography.Text style={{ fontSize: 12 }}>
                          <Tag color="cyan" style={{ margin: 0, fontSize: 11 }}>
                            課名
                          </Tag>{' '}
                          {deptName}
                        </Typography.Text>
                      )}
                      {!divName && !deptName && <span style={{ color: '#ccc' }}>—</span>}
                    </Space>
                  );
                },
              },
              {
                title: t('IDS_LEVEL'),
                key: 'level',
                align: 'center' as const,
                width: 35,
                render: (_: any, record: any) => {
                  const lv = record.evaluatorDefault?.level;
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
                title: t('IDS_EVALUATION_SKILL'),
                key: 'flagSkill',
                align: 'center' as const,
                width: 75,
                render: (_: any, record: any) => {
                  const fs = record.evaluatorDefault?.flagSkill;
                  return fs === 1 ? (
                    <Tag color="success" style={{ margin: 0 }}>
                      {t('IDS_HAVE')}
                    </Tag>
                  ) : (
                    <Tag color="default" style={{ margin: 0 }}>
                      {t('IDS_NOT_HAVE')}
                    </Tag>
                  );
                },
              },
              {
                title: t('IDS_EVALUATOR'),
                key: 'evaluator',
                width: 160,
                render: (_: any, record: any) => {
                  const ev = record.evaluatorDefault;
                  if (!ev) return <span style={{ color: '#ccc', fontSize: 12 }}>—</span>;
                  const build = (obj: any) => (obj ? `${obj.employeeNumber}: ${obj.fullName}` : null);
                  const items = [
                    { label: t('IDS_POINT_EVALUATOR_0_5'), val: build(ev.evaluator05) },
                    { label: t('IDS_POINT_EVALUATOR_1'), val: build(ev.evaluator1) },
                    { label: t('IDS_POINT_EVALUATOR_2'), val: build(ev.evaluator2) },
                  ].filter((i) => i.val);
                  if (!items.length) return <span style={{ color: '#ccc', fontSize: 12 }}>—</span>;
                  return (
                    <Space direction="vertical" size={2}>
                      {items.map((item, i) => (
                        <Typography.Text key={i} style={{ fontSize: 12 }}>
                          <Tag style={{ margin: 0, fontSize: 11 }}>{item.label}</Tag> {item.val}
                        </Typography.Text>
                      ))}
                    </Space>
                  );
                },
              },
              {
                title: t('IDS_TEMPLATE'),
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
                `${total}${t('IDS_CASE_LABEL')} ${range[0]}-${range[1]}${t('IDS_ITEM_LABEL')}`
              }
              onChange={(page) =>
                setUserConditions((prev: any) => ({ ...prev, current: page, offset: (page - 1) * 20 }))
              }
            />
          </div>
        </Spin>

        {/* ユーザ追加 */}
        <PopupAddUserSettingEvaluator
          state={routeState}
          handleOnchange={handleOnchangeUsers}
          conditions={userConditions}
          isOpenPopupAddUser={isOpenPopupAddUser}
          setOpenPopupAddUser={setOpenPopupAddUser}
        />

        {/* 選択削除 confirm */}
        <ModalCustomComponent
          isOpen={isDeleteConfirmOpen}
          header={t('POPUP_DIALOG.TITLE.CONFIRM')}
          content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_USER')}
          fnHandleOk={handleDeleteUsers}
          fnHandleCancel={() => setDeleteConfirmOpen(false)}
          okText={t('IDS_DELETE') as string}
          cancelText={t('IDS_BUTTON_CANCEL') as string}
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
                state={routeState}
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
                state={routeState}
                setSelectedRows={setSelectedRows}
              />
            )
          }
        />

        {/* Edit result notify */}
        <Modal
          title={t('POPUP_DIALOG.TITLE.PROCESS_RESULT')}
          open={isVisibleNotify}
          maskClosable={false}
          onCancel={() => setIsVisibleNotify(false)}
          footer={[
            <div key="close" style={{ textAlign: 'left' }}>
              <Button onClick={() => setIsVisibleNotify(false)}>{t('IDS_BUTTON_CLOSE')}</Button>
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
            year={routeYear}
            periodIndex={routePeriodIndex}
            data={popupData}
            periodId={routeState?.periodId}
            isEdit={isPopupEdit}
            setIsEdit={setIsPopupEdit}
            title="評価情報"
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
      </Card>

      {/* 部署別期間追加 Modal */}
      <Modal
        title={
          <div style={{ fontSize: '18px', fontWeight: 600, paddingBottom: '10px', borderBottom: '1px solid #F0F0F0' }}>
            <ApartmentOutlined style={{ color: '#00796B', marginRight: '8px' }} />
            部署別期間設定 (追加)
          </div>
        }
        open={isDeptModalOpen}
        onCancel={() => {
          setIsDeptModalOpen(false);
          departmentAdd.resetFields();
          setSelectedDeptName('');
        }}
        width={850}
        destroyOnClose
        style={{ top: 60 }}
        footer={null}
      >
        <Form layout="vertical" style={{ marginTop: '20px' }} form={departmentAdd}>
          {/* 適用部署 */}
          <div
            style={{
              background: '#F0FDF4',
              padding: '16px 20px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #DCFCE7',
            }}
          >
            <Form.Item
              label="適用部署"
              name="targetDepartment"
              rules={[{ required: true, message: '部署を選択してください' }]}
              style={{ marginBottom: 0, maxWidth: 500 }}
            >
              <Cascader
                options={divisionList}
                style={{ width: '100%' }}
                size="small"
                showSearch
                clearIcon={false}
                displayRender={(labels) => labels.filter((l) => l && l !== t('IDS_ALL')).join(' ► ')}
                onChange={(_: any, selectedOptions: any) => {
                  const labels = (selectedOptions as any[])
                    .map((o: any) => o.label)
                    .filter((l: string) => l && l !== t('IDS_ALL'));
                  setSelectedDeptName(labels.join(' ► '));
                }}
              />
            </Form.Item>
          </div>

          <Row gutter={[20, 20]}>
            {/* Block 目標設定 */}
            <Col xs={24} sm={12}>
              <div
                style={{
                  background: '#F8FAFC',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid #E2E8F0',
                  height: '100%',
                }}
              >
                <Typography.Title
                  level={5}
                  style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <CalendarOutlined style={{ color: '#0284C7' }} /> 目標設定
                </Typography.Title>

                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}
                  >
                    <Typography.Text strong>
                      部門目標設定 <span style={{ color: '#ff4d4f' }}>*</span>
                    </Typography.Text>
                    <Dropdown menu={mailDropdownMenu} placement="bottomRight" trigger={['click']}>
                      <Button type="primary" size="small">
                        メール送信 <DownOutlined />
                      </Button>
                    </Dropdown>
                  </div>
                  <Form.Item
                    name="deptGoalSetting"
                    noStyle
                    rules={[{ required: true, message: '部門目標設定を入力してください' }]}
                  >
                    <RangePicker style={{ width: '100%' }} format="YYYY/MM/DD" clearIcon={false} size="large" />
                  </Form.Item>
                </div>

                <div>
                  <div style={{ marginBottom: 6 }}>
                    <Typography.Text strong>
                      個人目標設定 <span style={{ color: '#ff4d4f' }}>*</span>
                    </Typography.Text>
                  </div>
                  <Form.Item
                    name="userGoalSetting"
                    noStyle
                    rules={[{ required: true, message: '個人目標設定を入力してください' }]}
                  >
                    <RangePicker style={{ width: '100%' }} format="YYYY/MM/DD" clearIcon={false} size="large" />
                  </Form.Item>
                </div>
              </div>
            </Col>

            {/* Block 評価実施 */}
            <Col xs={24} sm={12}>
              <div
                style={{
                  background: '#F8FAFC',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid #E2E8F0',
                  height: '100%',
                }}
              >
                <Typography.Title
                  level={5}
                  style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <CheckSquareOutlined style={{ color: '#10B981' }} /> 評価実施
                </Typography.Title>

                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}
                  >
                    <Typography.Text strong>部門評価</Typography.Text>
                    <Dropdown menu={mailDropdownMenu} placement="bottomRight" trigger={['click']}>
                      <Button type="primary" size="small">
                        メール送信 <DownOutlined />
                      </Button>
                    </Dropdown>
                  </div>
                  <Form.Item name="deptEvaluation" noStyle>
                    <RangePicker style={{ width: '100%' }} format="YYYY/MM/DD" clearIcon={false} size="large" />
                  </Form.Item>
                </div>

                <div>
                  <div style={{ marginBottom: 6 }}>
                    <Typography.Text strong>個人評価</Typography.Text>
                  </div>
                  <Form.Item name="userEvaluation" noStyle>
                    <RangePicker style={{ width: '100%' }} format="YYYY/MM/DD" clearIcon={false} size="large" />
                  </Form.Item>
                </div>
              </div>
            </Col>
          </Row>

          <div style={{ marginTop: 20 }}>
            <Space>
              <Button type="primary" onClick={handleDeptSubmit}>
                適用
              </Button>
              <Button
                type="default"
                onClick={() => {
                  setIsDeptModalOpen(false);
                  departmentAdd.resetFields();
                  setSelectedDeptName('');
                }}
              >
                {t('IDS_BUTTON_CANCEL')}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      <SendMail isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
};

export default SolutionFirst;
