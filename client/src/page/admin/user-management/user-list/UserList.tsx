import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { Table, Input, Button, Space, Typography, Card, Form, message, Popconfirm, Modal, Tooltip } from 'antd';
import {
  SearchOutlined,
  SlidersOutlined,
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import SearchForm from '../../../../views/admin/user-management/user-list/user-list/SearchForm';
import ColumnsUserList from '../../../../views/admin/user-management/user-list/user-list/ColumnsUserList';
import { useTranslation } from 'react-i18next';
import userApiService from '../../../../common/api/user.api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PaginationUserList from '../../../../views/admin/user-management/user-list/user-list/PaginationUserList';
import httpAxios from '../../../../common/http';
import ModalEditUser from '../../../../views/admin/user-management/user-list/user-list/ModalEditUser';
import { UserRecord } from './interfaces/interfaces';
import HistoryModal from '../../../../views/admin/user-management/user-list/user-list/HistoryModal';

const { Title } = Typography;

interface SearchQuery {
  company?: string;
  department?: string;
  division?: string;
  skill?: string;
  offset?: string;
  limit?: string;
  sortBy?: string;
  sortType?: string;
  nameAndEmail?: string;
  isGetData?: string;
  isCollap?: string;
  page?: string;
  role?: string;
  level?: string;
}

interface FetchCondition {
  company: string;
  department: string | null;
  division: string;
  skill: string;
  offset: string;
  limit: string;
  sortBy: string;
  sortType: string;
  nameAndEmail?: string;
  page?: string;
  role?: string;
  level: string;
}

const DEFAULT_PAGE_SIZE = 20;

const INITIAL_SEARCH_STATE: FetchCondition = {
  company: '-1',
  department: '-1',
  division: '-1',
  skill: '-1',
  sortBy: 'periodIndex',
  sortType: 'ASC',
  offset: '0',
  limit: String(DEFAULT_PAGE_SIZE),
  level: '-1',
  nameAndEmail: '',
};

/** Build a FetchCondition from URL query params, with optional nameAndEmail override. */
const buildConditionFromQuery = (q: SearchQuery, nameAndEmail?: string): FetchCondition => ({
  company: q.company ?? '-1',
  department: q.department ?? '-1',
  division: q.division ?? '-1',
  skill: q.skill ?? '-1',
  offset: q.offset ?? '0',
  limit: q.limit ?? String(DEFAULT_PAGE_SIZE),
  sortBy: 'periodIndex',
  sortType: 'ASC',
  nameAndEmail: nameAndEmail !== undefined ? nameAndEmail : q.nameAndEmail ?? '',
  page: q.page ?? '1',
  role: q.role ?? '-1',
  level: q.level ?? '-1',
});

/** Convert Cascader multi-select value to a comma-separated level string (or '-1' for all). */
const parseLevelFromCascader = (levelFieldValue: any, allLabel: string): string => {
  if (!Array.isArray(levelFieldValue) || levelFieldValue.length === 0) return '-1';

  if (levelFieldValue.length === 1 && levelFieldValue[1]) {
    const singleLevel = levelFieldValue[0];
    if (singleLevel[0] === '-1' || singleLevel[0] === allLabel) return '-1';
    return singleLevel[singleLevel.length - 1];
  }

  const validLevels = levelFieldValue
    .map((item: any) => item[item.length - 1])
    .filter((val: any) => val !== undefined && val !== '-1' && val !== allLabel);

  return validLevels.length > 0 ? validLevels.toString() : '-1';
};

const UserList: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [dataSources, setDataSources] = useState<{ data: UserRecord[]; counts: number }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = useMemo(() => Object.fromEntries([...searchParams]) as SearchQuery, [searchParams]);

  // Ref keeps debouncedSearch and handlePageChange from capturing stale searchQuery
  const searchQueryRef = useRef(searchQuery);
  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<UserRecord[]>([]);
  const [textNotify, setTextNotify] = useState('');
  const [isVisableNotify, setIsVisibleNotify] = useState(false);
  const [modalHistory, setHistoryModalOpen] = useState({ userId: '', isOpen: false });
  const [openDeletePop, setOpenDeletePop] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const columns = useMemo(() => ColumnsUserList({ t, setHistoryModalOpen, navigation: navigate }), [t, navigate]);

  const fetchData = useCallback(
    (condition: FetchCondition) => {
      const page = parseInt(condition.page || '1');
      const limit = parseInt(condition.limit || String(DEFAULT_PAGE_SIZE));
      const offset = ((page - 1) * limit).toString();
      const apiPayload = { ...condition, offset };

      userApiService.userListData(
        apiPayload,
        (res: any) => {
          setDataSources({ data: res.data, counts: res.counts });
          const raw = { ...condition, offset, isCollap: String(searchQueryRef.current.isCollap) };
          const urlParams = Object.fromEntries(
            Object.entries(raw).filter(([, v]) => v !== null && v !== undefined),
          ) as Record<string, string>;
          setSearchParams(urlParams, { replace: true });
        },
        setLoading,
      );
    },
    [setSearchParams],
  );

  const handleSearch = () => {
    form.validateFields().then(() => {
      const company = form.getFieldValue('company');
      const divisionCascader = form.getFieldValue('division');
      const nameAndEmail = form.getFieldValue('inputName') || '';

      let division = '-1';
      if (Array.isArray(divisionCascader) && divisionCascader[0] && Number(divisionCascader[0])) {
        division = divisionCascader[0];
      }

      let department = null;
      if (Array.isArray(divisionCascader) && divisionCascader[1] && Number(divisionCascader[1]) && division !== '-1') {
        department = divisionCascader[1];
      }

      const level = parseLevelFromCascader(form.getFieldValue('level'), t('IDS_ALL'));

      fetchData({
        company,
        department,
        division,
        limit: String(DEFAULT_PAGE_SIZE),
        offset: '0',
        skill: form.getFieldValue('skill'),
        sortBy: 'periodIndex',
        sortType: 'ASC',
        nameAndEmail,
        role: form.getFieldValue('role'),
        level,
      });
    });
  };

  const clearCondition = () => {
    if (Object.keys(searchQuery).includes('division')) {
      fetchData({ ...INITIAL_SEARCH_STATE, page: '1' });
    }
    setSelectedRowKeys([]);
    setSelectedRows([]);
    form.resetFields();
  };

  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        fetchData(buildConditionFromQuery(searchQueryRef.current, searchTerm));
      }, 500);
    },
    [fetchData],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    fetchData({
      ...buildConditionFromQuery(searchQueryRef.current),
      offset: ((page - 1) * pageSize).toString(),
      limit: pageSize.toString(),
      page: page.toString(),
    });
  };

  useEffect(() => {
    const q = searchQuery;

    fetchData({
      company: q.company || '-1',
      department: q.department || '-1',
      division: q.division || '-1',
      skill: q.skill || '-1',
      offset: q.offset || '0',
      limit: q.limit || String(DEFAULT_PAGE_SIZE),
      sortBy: 'periodIndex',
      sortType: 'ASC',
      nameAndEmail: q.nameAndEmail || '',
      page: q.page || '1',
      role: q.role || '-1',
      level: q.level || '-1',
    });

    // Restore form state from URL params
    const divisionVal =
      q.division && q.division !== '-1'
        ? q.department && q.department !== '-1'
          ? [Number(q.division), Number(q.department)]
          : [Number(q.division)]
        : '-1';

    const cascaderLevelVal =
      q.level && q.level !== '-1'
        ? q.level.split(',').map((val) => ['-1', val.trim()])
        : Array.from({ length: 10 }, (_, i) => ['-1', String(i + 1)]);

    form.setFieldsValue({
      company: q.company && q.company !== '-1' ? Number(q.company) : '-1',
      division: divisionVal,
      skill: q.skill && q.skill !== '-1' ? Number(q.skill) : '-1',
      inputName: q.nameAndEmail || '',
      role: q.role || '-1',
      level: cascaderLevelVal,
    });
  }, []); // intentional: runs once on mount to restore state from URL

  const handleDeleteUser = async () => {
    setLoading(true);
    await httpAxios.Put('/api/v1/f8/management-user/delete-user', { selectedRowKeys }).then((res) => {
      if (res?.status === 200) {
        handleSearch();
        setSelectedRowKeys([]);
        setSelectedRows([]);

        if (res.data.userInfor.length === 0) {
          message.success(t('MESSAGE.COMMON.IDM_DELETE_USER_SUCCESS'));
        } else {
          let text = `<div class='alert-box'><strong>${t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_1')}</strong></div>`;
          text += `<ul class="user-list">`;
          for (const user of res.data.userInfor) {
            text += `<li class="user-item"><span class="user-id">${
              user.employeeNumber
            }</span> <span class="user-info">${
              user.fullName + t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_REASON')
            }</span></li>`;
          }
          text += `</ul>`;
          text += '<div class="condition-section">';
          text += `<span class="condition-title">${t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_2')}</span>`;
          text += '<ul class="condition-list">';
          text += `<li>${t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_3')}</li>`;
          text += `<li>${t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_4')}</li>`;
          text += '</ul></div>';
          text += `<p style="margin-top: 15px; font-size: 0.9rem; text-align: center; color: #718096;">${t(
            'MESSAGE.COMMON.IDM_RESULT_DELETE_USER_5',
          )}</p>`;
          setTextNotify(text);
          setIsVisibleNotify(true);
        }
        setLoading(false);
      }
    });
  };

  const exportListUser = async () => {
    setLoading(true);
    const roles = t('IDL_LIST_ROLE', { returnObjects: true }) as any;
    const textLanguage = {
      role1: roles[1],
      role2: roles[2],
      role3: roles[3],
      role4: roles[4],
      role5: roles[5],
      role6: roles[6],
      role7: roles[7],
      role8: roles[8],
      headerEmployeeNumber: t('IDS_EMPLOYEE_NUMBER'),
      headerFullName: t('IDS_FULLNAME'),
      headerCompany: t('IDS_COMPANY'),
      headerDiv: t('IDS_TYPE_DIVISION_NAME'),
      headerDep: t('IDS_TYPE_DEPARTMENT_NAME'),
      headerLevel: t('IDS_LEVEL'),
      headerSkill: t('IDS_EVALUATION_SKILL'),
      headerEmail: t('IDS_EMAIL'),
      headerRole: t('IDS_ROLE'),
      textUnchange: t('IDS_HAVE_NOT_SET'),
      textNoSkill: t('IDS_NOT_HAVE'),
      textHaveSkill: t('IDS_HAVE'),
    };

    await httpAxios
      .Get('/api/v1/f8/management-user/export-list-user', {
        params: { ...searchQuery, role: '-1', limit: 99999, offset: 0, textLanguage },
        responseType: 'arraybuffer',
      })
      .then((res) => {
        if (res?.status === 200) {
          const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${t('IDS_LIST_USER')}.xlsx`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    setLoading(false);
  };

  const isFilterExpanded = searchQuery?.isCollap === 'true';
  const hasSearched = Object.keys(searchQuery).includes('division');

  return (
    <div style={{ padding: '0', minHeight: '100vh' }}>
      <Form form={form} name="create_template_form" layout="vertical" style={{ width: '100%' }} onFinish={handleSearch}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '20px',
          }}
        >
          <Title level={3} style={{ paddingBottom: 0 }}>
            {t('IDS_LIST_USER')}
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Form.Item name="inputName" style={{ margin: 0 }}>
              <Input
                placeholder={t('IDS_TOOLTIP_SEARCH_EXPLAINATION').toString()}
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                style={{ width: 380, borderRadius: '6px', fontSize: 14 }}
                onChange={handleChange}
              />
            </Form.Item>
            <Button
              icon={<SlidersOutlined />}
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setSearchParams({ ...searchQuery, isCollap: String(!isFilterExpanded) });
              }}
              style={{ borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}
              size="middle"
            >
              {t('IDS_EXPAND_ADVANDCED_FILTER')}
              <DownOutlined rotate={isFilterExpanded ? 180 : 0} style={{ fontSize: '10px', transition: '0.3s' }} />
            </Button>
          </div>
        </div>

        <div
          style={{
            maxHeight: isFilterExpanded ? '1000px' : '0',
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
            opacity: isFilterExpanded ? 1 : 0,
            marginBottom: isFilterExpanded ? '20px' : '0',
          }}
        >
          <Card className="info-board">
            <SearchForm
              isLoading={isLoading}
              setLoading={setLoading}
              form={form}
              handleSearch={handleSearch}
              clearCondition={clearCondition}
            />
          </Card>
        </div>
      </Form>

      {hasSearched && (
        <Card className="info-board" style={{ marginBottom: 0 }}>
          <div
            style={{
              padding: '0px 0px 10px 0px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Space size={15}>
              <Tooltip title={t('IDS_MOVE_DETAIL_USER_MANAGEMENT')} placement="top">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  loading={isLoading}
                  disabled={selectedRowKeys.length === 0}
                  icon={<EditOutlined />}
                  type="primary"
                >
                  {t('IDS_BUTTON_EDIT_MULTIPLE')}
                </Button>
              </Tooltip>

              <Popconfirm
                placement="rightTop"
                open={openDeletePop}
                onOpenChange={setOpenDeletePop}
                title={t('POPUP_DIALOG.TITLE.CONFIRM')}
                description={
                  <div>
                    <p>{t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_USER')}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '15px' }}>
                      <Button
                        type="primary"
                        size="middle"
                        loading={isLoading}
                        onClick={async () => {
                          await handleDeleteUser();
                          setOpenDeletePop(false);
                        }}
                      >
                        {t('IDS_DELETE')}
                      </Button>
                      <Button type="default" loading={isLoading} size="middle" onClick={() => setOpenDeletePop(false)}>
                        {t('IDS_BUTTON_CANCEL')}
                      </Button>
                    </div>
                  </div>
                }
                okText={t('IDS_DELETE') as string}
                cancelText={t('IDS_BUTTON_CANCEL') as string}
                onConfirm={handleDeleteUser}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}
              >
                <Button
                  loading={isLoading}
                  disabled={selectedRowKeys.length === 0}
                  icon={<DeleteOutlined />}
                  size="middle"
                  danger
                >
                  {t('IDS_BUTTON_DELETE_MULTIPLE')}
                </Button>
              </Popconfirm>
            </Space>

            <Tooltip title={t('IDS_TOOL_TIP_EXPORT_EXCEL_USER_MANAGEMENT')} placement="leftTop">
              <Button
                onClick={exportListUser}
                loading={isLoading}
                type="primary"
                size="middle"
                icon={<DownloadOutlined />}
              >
                {t('IDS_EXPORT_EXCEL_USER_LIST')}
              </Button>
            </Tooltip>
          </div>

          <Table<UserRecord>
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys,
              onChange: (keys, rows) => {
                setSelectedRowKeys(keys);
                setSelectedRows(rows as UserRecord[]);
              },
            }}
            columns={columns}
            pagination={false}
            bordered
            dataSource={dataSources?.data ?? []}
            loading={isLoading}
            rowKey={(record) => record.id}
            size="small"
          />

          <PaginationUserList
            current={searchQuery.page ? parseInt(searchQuery.page) : 1}
            total={dataSources?.counts || 0}
            pageSize={DEFAULT_PAGE_SIZE}
            onChange={handlePageChange}
            isLoading={isLoading}
            style={{ marginTop: 10 }}
          />
        </Card>
      )}

      <Modal
        title={<Typography.Title level={4}>{t('POPUP_DIALOG.TITLE.PROCESS_RESULT')}</Typography.Title>}
        open={isVisableNotify}
        maskClosable={false}
        onCancel={() => setIsVisibleNotify(false)}
        footer={[
          <div style={{ textAlign: 'left' }} key="close">
            <Button className="cancel_button" onClick={() => setIsVisibleNotify(false)}>
              {t('IDS_BUTTON_CLOSE')}
            </Button>
          </div>,
        ]}
      >
        <div dangerouslySetInnerHTML={{ __html: textNotify }} />
      </Modal>

      {isModalOpen && (
        <ModalEditUser
          selectedRecords={selectedRows}
          isModalOpen={isModalOpen}
          selectedRowKeys={selectedRowKeys}
          setIsModalOpen={setIsModalOpen}
          setSelectedRowKeys={setSelectedRowKeys}
          setSelectedRows={setSelectedRows}
          handleSearch={handleSearch}
        />
      )}

      {modalHistory.isOpen && (
        <HistoryModal
          isOpen={modalHistory.isOpen}
          setIsModalOpen={setHistoryModalOpen}
          userId={modalHistory.userId}
          t={t}
        />
      )}
    </div>
  );
};

export default UserList;
