import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, Typography, Button, Spin, Space, Form, Input, message, Tooltip, Row, Col, Modal } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  LockFilled,
  LoadingOutlined,
  UserOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { DataNode } from 'antd/es/tree';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import httpAxios from '../../../../common/http';
import { FlagSkillValue } from '../../../../constant/VersionSettingType';
import { urlCompanyCode } from '../../../../common/util';
import FullNameEdited from '../../../../views/admin/user-management/user-edit/FullNameEdited';
import RolesEditComponent from '../../../../views/admin/user-management/user-edit/RolesEditComponent';
import { changeRole1, changeRole2, changeRole3, changeRole4, compareArrayNumber } from '../../user-detail/processes';
import ModalEditUserFromDetail from '../../../../views/admin/user-management/user-detail/ModalEditUserFromDetail';

const { Title, Text } = Typography;
const FONT_SIZE = 14;
// 1. Component hiển thị thông tin chi tiết (Giữ nguyên bên ngoài component chính để tránh re-create)
interface InfoFieldProps {
  label: string;
  value: any;
  hasLock?: boolean;
  highlight?: boolean;
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  maxHeight: '32px',
};

const InfoField: React.FC<InfoFieldProps> = React.memo(({ label, value, hasLock = false, highlight = false }) => (
  <div
    style={{
      border: highlight ? '1px solid #91d5ff' : '1px solid #e8e8e8',
      borderRadius: '6px',
      padding: '6px 12px',
      height: '100%',
      backgroundColor: highlight ? '#f0f5ff' : '#ffffff',
    }}
  >
    <div style={{ color: '#007240', fontSize: FONT_SIZE, marginBottom: '2px', fontWeight: 500 }}>
      {label}{' '}
      {hasLock && (
        <>
          ( <LockFilled style={{ color: '#faad14', fontSize: FONT_SIZE }} /> Khóa)
        </>
      )}
    </div>
    <div style={{ fontSize: FONT_SIZE, color: '#262626', fontWeight: highlight ? 600 : 'normal' }}>{value}</div>
  </div>
));

interface RoleProps {
  id: number;
  name: string;
  value: number;
  label: string;
}

type StateType = {
  departmentId: number;
  department: { id: number; name: string; code: string };
  companyId: number;
  company: { id: number; name: string; code: string };
  divisionId: number;
  division: { id: number; name: string; code: string };
  id: number;
  employeeNumber: string;
  fullName: string;
  email: string;
  level: number;
  flagSkill: number;
  roles: RoleProps[];
  updatedTime: string | undefined;
};

const UserDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // States
  const [isLoading, setLoading] = useState(false);
  const [isLoadingEdit, setLoadingEdit] = useState(false);
  const [data, setData] = useState<StateType | undefined>();
  const [isEditFullName, setIsEditFullName] = useState(false);
  const [isEditInformation, setIsEditInformation] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisableNotify, setIsVisibleNotify] = useState(false);
  const [textNotify, setTextNotify] = useState('');
  // Tối ưu 1: Memoize danh sách cây Roles (Tránh re-call hàm dịch t() nhiều lần)
  const treeDatas = useMemo<DataNode[]>(() => {
    const rolesObj = (t('IDL_LIST_ROLE', { returnObjects: true }) as Record<string, string>) || {};

    return Array.from({ length: 8 }, (_, i) => ({
      title: rolesObj[String(i + 1)] || '',
      key: i + 1,
    }));
  }, [t]);

  // Tối ưu 2: Memoize Object Map tên Role để sử dụng khi submit nhanh
  const roleNamesMap = useMemo<Record<number, string>>(() => {
    const rolesObj = (t('IDL_LIST_ROLE', { returnObjects: true }) as Record<string, string>) || {};
    const map: Record<number, string> = {};
    for (let i = 1; i <= 8; i++) {
      map[i] = rolesObj[String(i)] || '';
    }
    map[9] = t('IDS_SYSTEM_ADMIN');

    return map;
  }, [t]);

  const fetchUserInfo = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await httpAxios.Get('/api/v1/f8/management-user/get-user-detail-by-id', {
        params: { id },
      });

      if (res?.status === 200 && res.data) {
        setData(res.data);
      } else {
        navigate(-1);
      }

      setLoading(false);
    } catch (error: any) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        return;
      }

      console.error(error);
      setLoading(false);
    }
  }, [id, navigate]);

  // Effect: Fetch thông tin user detail
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  // Effect: Đồng bộ giá trị form khi data thay đổi
  useEffect(() => {
    if (data) {
      form.setFieldsValue({ fullName: data.fullName });
    }
  }, [data, form]);

  // Tối ưu 3: Bọc toàn bộ các hàm logic vào useCallback để tối ưu re-render các button
  const toggleEditFullName = useCallback(() => setIsEditFullName((prev) => !prev), []);
  const toggleEditInformation = useCallback(() => setIsEditInformation((prev) => !prev), []);
  const handleNavigateBack = useCallback(() => navigate(-1), [navigate]);

  // const handleEditRedirect = useCallback(() => {
  //   if (!data?.id) return;
  //   const companyCode = urlCompanyCode();
  //   const currentSection = window.location.pathname.split('/')[3] || '';
  //   navigate(`${companyCode}/${currentSection}/user-list/edit/${data.id}`);
  // }, [data?.id, navigate]);

  const submitFullName = useCallback(async () => {
    if (!data?.id) return;
    setLoadingEdit(true);
    try {
      const values = await form.validateFields(['fullName']);
      const res = await httpAxios.Put('/api/v1/f8/management-user/update-full-name', {
        userId: data.id,
        fullName: values.fullName,
      });

      if (res?.status === 200) {
        setData((prev) => (prev ? { ...prev, fullName: values.fullName } : prev));
        setIsEditFullName(false);
        message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
      }
    } catch (errorInfo) {
      console.error('Lỗi validate hoặc API:', errorInfo);
    } finally {
      setLoadingEdit(false);
    }
  }, [data?.id, form, t]);

  const changeRole = useCallback(async () => {
    if (!data?.id) return;
    setLoadingEdit(true);
    try {
      const rolesForm = form.getFieldValue('roles') || [];
      const checkedList = rolesForm.reduce((acc: number[], currentItem: { role?: boolean }, index: number) => {
        if (currentItem?.role === true) {
          acc.push(index + 1);
        }

        return acc;
      }, []);

      const defaultRoleLists = data.roles.map((v) => v.id);
      const roles = compareArrayNumber(defaultRoleLists, checkedList)
        ? undefined
        : checkedList.filter((item: number) => item !== 0);

      const isChangeRoleF2 = changeRole2(defaultRoleLists, checkedList);
      const isChangeRoleF3 = changeRole3(defaultRoleLists, checkedList);
      const isChangeRoleF4 = changeRole4(defaultRoleLists, checkedList);
      const typeChangeRoleF1 = changeRole1(defaultRoleLists, checkedList);

      const res = await httpAxios.Put('/api/v1/f8/management-user/change-role-user', {
        userId: data.id,
        isChangeRoleF2,
        isChangeRoleF3,
        isChangeRoleF4,
        typeChangeRoleF1,
        newRole: checkedList,
      });

      if (res?.status === 200) {
        const errorList = res.data;
        const error05 = errorList?.role05 ? errorList.role05 : '';
        const error1 = errorList?.role1 ? errorList.role1 : '';
        const error2 = errorList?.role2 ? errorList.role2 : '';

        if (isChangeRoleF2 && (error05 || error1 || error2)) {
          let text = t('MESSAGE.COMMON.IDM_RESULT_EDIT_USER_1') + '\n';
          text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_EDIT_USER_2');
          text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_3');
          text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_4');
          text += '\n';
          text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_EDIT_USER_3');
          setTextNotify(text.replace(/\n/g, '<br />'));
          setIsVisibleNotify(true);
        } else {
          const resultRoles = (checkedList || []).map((v: number) => ({
            id: v,
            name: roleNamesMap[v] || '',
          }));

          setData((prev) => (prev ? { ...prev, roles: resultRoles } : prev));
          message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
          setIsEditInformation(false);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEdit(false);
    }
  }, [data, form, roleNamesMap, t]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Modal
        title={<Typography.Title level={4}>{t('POPUP_DIALOG.TITLE.PROCESS_RESULT')}</Typography.Title>}
        open={isVisableNotify}
        closable={false}
        maskClosable={false}
        footer={[
          <div key="ok" style={{ textAlign: 'left' }}>
            <Button className="cancel_button" onClick={() => setIsVisibleNotify(false)}>
              {t('IDS_BUTTON_OK')}
            </Button>
          </div>,
        ]}
      >
        <p dangerouslySetInnerHTML={{ __html: textNotify }} />
      </Modal>
      {/* 1. Thanh tiêu đề trên cùng */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px' }}>
        <Title level={3} style={{ color: '#007240', margin: 0, padding: 0 }}>
          {t('IDS_USER_DETAIL')}
        </Title>
      </div>

      {!isLoading ? (
        <Space direction="vertical" size={15} style={{ width: '100%' }}>
          {/* KHỐI 1: 詳細情報 */}
          <Card>
            <Form form={form} name="userDetailForm" layout="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <UserOutlined style={{ fontSize: '14px' }} />

                {/* Employee number — luôn hiển thị dạng text tĩnh */}
                {data && (
                  <Typography.Text strong style={{ fontSize: FONT_SIZE, whiteSpace: 'nowrap' }}>
                    {data.employeeNumber}:
                  </Typography.Text>
                )}

                {/* Full name: text hoặc input inline */}
                {isEditFullName ? (
                  <Form.Item
                    name="fullName"
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() }]}
                    help=""
                  >
                    <Input
                      size="small"
                      disabled={isLoadingEdit}
                      style={{ fontSize: FONT_SIZE, fontWeight: 600, width: '180px' }}
                    />
                  </Form.Item>
                ) : (
                  data && (
                    <Typography.Text strong style={{ fontSize: FONT_SIZE, whiteSpace: 'nowrap' }}>
                      {data.fullName}
                    </Typography.Text>
                  )
                )}

                {/* Icons edit / save / cancel — cùng hàng */}
                {!isEditFullName ? (
                  <Tooltip title="編集">
                    <EditOutlined onClick={toggleEditFullName} style={{ cursor: 'pointer' }} disabled={true} />
                  </Tooltip>
                ) : (
                  <>
                    <Button type="primary" loading={isLoadingEdit} size="middle" onClick={submitFullName}>
                      {t('IDS_BUTTON_SAVE')}
                    </Button>
                    <Button
                      type="default"
                      loading={isLoadingEdit}
                      onClick={toggleEditFullName}
                      size="middle"
                      style={{ cursor: 'pointer' }}
                    >
                      {t('IDS_BUTTON_CANCEL')}
                    </Button>
                  </>
                )}

                {/* Email — luôn hiển thị */}
                {data?.email && (
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: FONT_SIZE, fontWeight: 'normal', whiteSpace: 'nowrap' }}
                  >
                    ({data.email})
                  </Typography.Text>
                )}
              </div>
            </Form>
          </Card>
          <Card
            title={
              <>
                {/* Button edit — bottom left */}
                <Space>
                  <Typography.Text style={{ fontSize: FONT_SIZE }}>詳細情報</Typography.Text>
                  <Tooltip title="編集">
                    <EditOutlined
                      type="default"
                      onClick={() => setIsModalOpen(true)}
                      disabled={isEditInformation || isEditFullName || isLoadingEdit}
                    />
                  </Tooltip>
                </Space>
              </>
            }
            size="small"
            style={{ borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
          >
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              {/* Một hàng duy nhất — flex theo trọng số nội dung */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
                {[
                  { label: t('IDS_COMPANY'), value: data?.company?.name || '---', flex: 3 },
                  { label: t('IDS_TYPE_DIVISION_NAME'), value: data?.division?.name || '---', flex: 2 },
                  { label: t('IDS_TYPE_DEPARTMENT_NAME'), value: data?.department?.name || '---', flex: 2 },
                  { label: t('IDS_LEVEL'), value: String(data?.level ?? '0'), flex: 0.6 },
                  {
                    label: t('IDS_EVALUATION_SKILL'),
                    value: data?.flagSkill === FlagSkillValue.HAVE_SKILL ? t('IDS_HAVE') : t('IDS_NOT_HAVE'),
                    flex: 0.8,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: item.flex,
                      border: '1px solid #e8e8e8',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        color: '#007240',
                        fontSize: FONT_SIZE,
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.label}
                    </div>
                    <Typography.Text
                      style={{ fontSize: FONT_SIZE, color: '#262626', display: 'block' }}
                      ellipsis={{ tooltip: item.value }}
                    >
                      {item.value}
                    </Typography.Text>
                  </div>
                ))}
              </div>
            </Space>
          </Card>

          {/* KHỐI 2: システムアクセス制御 */}

          <Card
            title={
              <Space size="small" style={{ justifyContent: 'flex-start', width: '100%' }}>
                <span style={{ fontWeight: 600, fontSize: FONT_SIZE, color: '#262626' }}>ロール設定</span>
                {isEditInformation ? (
                  <>
                    <Button type="primary" loading={isLoadingEdit} size="middle" onClick={changeRole}>
                      {t('IDS_BUTTON_SAVE')}
                    </Button>
                    <Button
                      type="default"
                      loading={isLoadingEdit}
                      onClick={toggleEditInformation}
                      size="middle"
                      style={{ cursor: 'pointer' }}
                    >
                      {t('IDS_BUTTON_CANCEL')}
                    </Button>
                  </>
                ) : (
                  <Tooltip title="編集">
                    <EditOutlined
                      type="default"
                      onClick={toggleEditInformation}
                      disabled={isEditFullName || isLoadingEdit}
                    />
                  </Tooltip>
                )}
              </Space>
            }
            size="small"
            style={{ borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
          >
            <Space direction="vertical" size={15} style={{ width: '100%' }}>
              {isEditInformation ? (
                <RolesEditComponent treeDatas={treeDatas} form={form} roles={data?.roles || []} />
              ) : (
                <Row>
                  <Col md={24} lg={15} xl={15} sm={24} xs={24}>
                    <Row gutter={[10, 5]}>
                      {treeDatas.map((treeNode) => {
                        const isSet = (data?.roles || []).some((r) => r.id === treeNode.key);

                        return (
                          <Col span={6} key={treeNode.key}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                height: '34px',
                                padding: '0 12px',
                                backgroundColor: isSet ? '#e6f7ff' : '#fafafa',
                                border: `1px solid ${isSet ? '#91d5ff' : '#d9d9d9'}`,
                                borderRadius: '6px',
                                gap: 10,
                              }}
                            >
                              {isSet ? (
                                <CheckOutlined style={{ color: '#52c41a', fontSize: FONT_SIZE, flexShrink: 0 }} />
                              ) : (
                                <CloseOutlined style={{ color: '#d9d9d9', fontSize: FONT_SIZE, flexShrink: 0 }} />
                              )}
                              <Text
                                style={{
                                  color: isSet ? '#0050b3' : '#bfbfbf',
                                  fontSize: FONT_SIZE,
                                }}
                                ellipsis={{ tooltip: true }}
                              >
                                {(treeNode.title as string) || ''}
                              </Text>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </Col>
                </Row>
              )}
            </Space>
          </Card>

          <Button size="middle" onClick={handleNavigateBack} loading={isLoadingEdit}>
            {t('IDS_POPUP_EIDT_USER.IDS_BACK_BUTTON')}
          </Button>
        </Space>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <Spin size="large" />
        </div>
      )}
      <ModalEditUserFromDetail
        isModalOpen={isModalOpen}
        selectedRecord={data}
        setIsModalOpen={setIsModalOpen}
        onSuccess={fetchUserInfo}
      />
    </div>
  );
};

export default UserDetail;
