import {
  Button,
  Card,
  Cascader,
  Col,
  Dropdown,
  Form,
  Input,
  MenuProps,
  message,
  Radio,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { t } from 'i18next';
import { CancelButton, MainButton } from '../../../../common/MainButton';
import { useEffect, useState } from 'react';
import { CaretUpOutlined, FileOutlined, InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import httpAxios from '../../../../common/http';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import feedbackApiService from '../../../../common/api/feedback';
import EmptyComponent from '../../../../common/EmptyComponent';
import { getListExceptRoleByUser, getListKeyExceptRole, optionsTargetScreens } from '../../../../common/targetScreen';
import TextArea from 'antd/es/input/TextArea';
import { useAuth } from '../../../../hooks/useAuth';

interface Props {
  role: 'user' | 'admin' | 'systemAdmin';
  feedbackInfo: any;
  isLoading: boolean;
  setLoading: any;
  loadData: any;
}

const SUBJECT_MAX_LENGTH = 1000;
const DESCRIPTION_MAX_LENGTH = 5000;
const UPLOAD_MAX_QUANTITY = 10;
const UPLOAD_MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30 MB
const acceptedTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
];

const DetailAndEditlnforFeedback: React.FC<Props> = (props: Props) => {
  const { role, feedbackInfo, isLoading, setLoading, loadData } = props;

  const [isEditUser, setIsEditUser] = useState(false);

  const [isEditSystemAdmin, setIsEditSystemAdmin] = useState(false);

  const [isOpenDropDownScopeEffect, setIsOpenDropDownScopeEffect] = useState<boolean>(false);

  const [isOpenDropDownStatus, setIsOpenDropDownStatus] = useState<boolean>(false);

  const detailFeedback = feedbackInfo?.feedbackDetail;

  const statusFeedback = feedbackInfo?.feedbackDetail?.status;

  const [isOpenCancel, setOpenCancel] = useState<boolean>(false);

  const [isOpenImpactScope, setOpenImpactScope] = useState<boolean>(false);

  const [getImpactScopeValue, setImpactScopeValue] = useState<number>(0);

  const [isOpenStatus, setOpenStatus] = useState<boolean>(false);

  const [getStatusValue, setStatusValue] = useState<number>(0);

  const [isLoadingDownload, setIsLoadingDownload] = useState(false);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [listFilesDeleted, setListFilesDeleted] = useState<any>([]);

  const [isOpenModalUpdate, setOpenModalUpdate] = useState<boolean>(false);

  const [form] = Form.useForm();

  const { user } = useAuth();

  const listRoles = getListExceptRoleByUser(user?.roles, role).map((role) => role.toString());

  const roleName = {
    1: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[1],
    2: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[2],
    3: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[3],
    4: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[4],
    5: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[5],
    6: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[6],
    7: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[7],
    8: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[8],
  } as any;

  const openPopUpConfirmImpactScope = async (scope: number) => {
    setIsOpenDropDownScopeEffect(false);
    setOpenImpactScope(true);
    setImpactScopeValue(scope);
  };

  const openPopUpConfirmStatus = async (status: number) => {
    setIsOpenDropDownStatus(false);
    setOpenStatus(true);
    setStatusValue(status);
  };

  const itemsScopeEffect: MenuProps['items'] | any = [
    {
      key: 1,
      label: t('IDS_IMPACT_SCOPE_OPTIONS.1'),
      async onClick() {
        openPopUpConfirmImpactScope(1);
      },
    },
    {
      key: 2,
      label: t('IDS_IMPACT_SCOPE_OPTIONS.2'),
      async onClick() {
        openPopUpConfirmImpactScope(2);
      },
    },
    {
      key: 3,
      label: t('IDS_IMPACT_SCOPE_OPTIONS.3'),
      async onClick() {
        openPopUpConfirmImpactScope(3);
      },
    },
  ];

  const itemsStatus: MenuProps['items'] | any = [
    {
      key: 1,
      label: t('IDS_STATUS_FEEDBACK_OPTIONS.1'),
      async onClick() {
        openPopUpConfirmStatus(1);
      },
    },
    {
      key: 2,
      label: t('IDS_STATUS_FEEDBACK_OPTIONS.2'),
      async onClick() {
        openPopUpConfirmStatus(2);
      },
    },
    {
      key: 3,
      label: t('IDS_STATUS_FEEDBACK_OPTIONS.3'),
      async onClick() {
        openPopUpConfirmStatus(3);
      },
    },
    {
      key: 4,
      label: t('IDS_STATUS_FEEDBACK_OPTIONS.4'),
      async onClick() {
        openPopUpConfirmStatus(4);
      },
    },
    {
      key: 5,
      label: t('IDS_STATUS_FEEDBACK_OPTIONS.5'),
      async onClick() {
        openPopUpConfirmStatus(5);
      },
    },
    {
      key: 6,
      label: t('IDS_STATUS_FEEDBACK_OPTIONS.6'),
      async onClick() {
        openPopUpConfirmStatus(6);
      },
    },
    {
      key: 7,
      label: t('IDS_STATUS_FEEDBACK_OPTIONS.7'),
      async onClick() {
        openPopUpConfirmStatus(7);
      },
    },
    {
      key: 8,
      label: t('IDS_STATUS_FEEDBACK_OPTIONS.8'),
      async onClick() {
        openPopUpConfirmStatus(8);
      },
    },
  ];

  const convertListScreen = (value: any) => {
    const text = value?.map((v: string) => {
      return `${t(v?.split('-')[v?.split('-').length - 1])}${
        v?.split('-').length > 1 ? `（${t(v?.split('-')[0])}）` : ''
      }`;
    });

    return text?.join('、');
  };

  const handleUserCancelFeeback = async () => {
    setLoading(true);
    const id = feedbackInfo?.feedbackDetail?.id;
    await httpAxios
      .Put('/api/v1/common/cancel-feedback', { id: id, updatedTime: detailFeedback?.updatedTime })
      .then((res) => {
        if (res && res.status === 200) {
          message.success(t('MESSAGE.COMMON.IDM_SAVE_CANCEL_SUCCESS'));
          loadData();
          setLoading(false);
        }
        setLoading(false);
      });
    setLoading(false);
  };

  const handleUpdateImpactScope = async () => {
    setLoading(true);
    const id = feedbackInfo?.feedbackDetail?.id;
    await httpAxios
      .Put('/api/v1/f9/system-admin/update-impact-scope', {
        id: id,
        impactScope: getImpactScopeValue,
        updatedTime: detailFeedback?.updatedTime,
      })
      .then((res) => {
        if (res && res.status === 200) {
          message.success(t('IDS_UPDATE_TOOLTIP').replace('{key}', t('IDS_IMPACT_SCOPE')));
          setLoading(false);
          setOpenImpactScope(false);
          loadData();
        }
        setOpenImpactScope(false);
        setLoading(false);
      });
    setOpenImpactScope(false);
    setLoading(false);
  };

  const handleUpdateStatus = async () => {
    setLoading(true);
    const id = feedbackInfo?.feedbackDetail?.id;
    await httpAxios
      .Put('/api/v1/f9/system-admin/update-status', {
        id: id,
        status: getStatusValue,
        updatedTime: detailFeedback?.updatedTime,
      })
      .then((res) => {
        if (res && res.status === 200) {
          message.success(t('IDS_UPDATE_TOOLTIP').replace('{key}', t('IDS_STATUS')));
          setLoading(false);
          setOpenStatus(false);
          loadData();
        }
        setOpenStatus(false);
        setLoading(false);
      });
    setOpenStatus(false);
    setLoading(false);
  };

  const callbackDownloadFile = (data: any) => {
    if (data.name != '') {
      const byteArray = new Uint8Array(data.data.data);
      const blob = new Blob([byteArray], { type: data.contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${data.name}`); // Specify the download filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const displayAttachFiles = (data: any | undefined) => {
    const attachFile = data?.attachFile;
    const id = data?.id;

    if (attachFile === undefined || attachFile === null || attachFile === '') {
      return <>{t('MESSAGE.COMMON.IDM_EMPTY_DATA')}</>;
    } else {
      const listFileNames: string[] = attachFile?.split('|');

      const handleDownloadFile = async (id: number, fileName: string) => {
        const params = {
          id: id,
          fileName: fileName,
        };
        setIsLoadingDownload(true);
        feedbackApiService.downloadFileFeedback(params, callbackDownloadFile, setIsLoadingDownload);
      };

      return (
        <>
          {listFileNames.map((fileName) => {
            return (
              <Button
                loading={isLoadingDownload}
                key={fileName}
                style={{ marginRight: 5 }}
                onClick={() => handleDownloadFile(id, fileName)}
              >
                <FileOutlined />
                {fileName}
              </Button>
            );
          })}
        </>
      );
    }
  };

  const displayRole = (role: any | undefined) => {
    return (
      <div style={{ textAlign: 'left' }}>
        {role && role.length === 0
          ? ''
          : role &&
            role
              .sort((a: any, b: any) => {
                if (a < b) {
                  return -1;
                }
                if (a > b) {
                  return 1;
                }

                return 0;
              })
              .map((i: any, index: any) => {
                return roleName[`${i}`] + (index !== role.length - 1 ? '、' : '');
              })}
      </div>
    );
  };

  const handleRemove = (file: any) => {
    // Cập nhật lại fileList khi xóa
    setFileList((prevFileList) => prevFileList.filter((item) => item.uid !== file.uid));
    if (file.name) {
      setListFilesDeleted((prevList: any) => [...prevList, file.name]);
    }
  };

  let listFileTemps = [];
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // Filter out files with duplicate names
    const uniqueFileList = newFileList.filter(
      (file: any) => !fileList.some((existingFile) => existingFile.name === file.name),
    );

    const totalFiles = [...fileList, ...uniqueFileList];
    if (listFileTemps.length !== totalFiles.length) {
      listFileTemps = [...totalFiles];

      // Update the state with unique files
      setFileList((prevFileList) => [...prevFileList, ...uniqueFileList]);
    }
  };

  const handleUpdate = async () => {
    form
      .validateFields()
      .then(async (value) => {
        setLoading(true);
        const formData = new FormData();

        if (role == 'user') {
          const valueFiles = form.getFieldValue('files');

          // Xử lý file khi có thay đổi (chỉ thêm file mới)
          if (valueFiles) {
            valueFiles?.fileList.forEach((f: any) => {
              if (f.originFileObj) {
                formData.append('files', f.originFileObj); // Append the file to FormData
              }
            });
          }

          // Xử lý file khi có thay đổi (xóa các file cũ)
          listFilesDeleted?.forEach((file: string) => {
            formData.append('listFilesDeleted[]', file);
          });

          if (valueFiles) {
            const tempList: { name: any }[] = [];

            for (let i = 0; i < valueFiles?.fileList.length; i++) {
              const e = valueFiles?.fileList[i];
              tempList.push({ name: e?.name });
            }

            formData.append('attachFiles', tempList.map((item) => item.name).join('|'));
          } else {
            formData.append('attachFiles', fileList.map((item) => item.name).join('|'));
          }

          formData.append('permission', role);
          formData.append('id', detailFeedback.id);
          formData.append('role', JSON.stringify(value.roles));
          formData.append('type', value.type);
          formData.append('phase', value.phase);
          formData.append('features', JSON.stringify(value.features));
          formData.append('summary', value.summary);
          formData.append('detail', value.detail);
          formData.append('updatedTime', detailFeedback?.updatedTime || '');

          await httpAxios.Put(`/api/v1/common/update-feedbacks`, formData).then((res) => {
            if (res?.status === 200) {
              message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
              setOpenModalUpdate(false);
              setLoading(false);
              loadData();
            }
            setLoading(false);
            setOpenModalUpdate(false);
          });
        } else {
          formData.append('permission', role);
          formData.append('id', detailFeedback.id);
          formData.append('role', JSON.stringify(value.roles));
          formData.append('type', value.type);
          formData.append('phase', value.phase);
          formData.append('features', JSON.stringify(value.features));
          formData.append('summary', value.summary);
          formData.append('updatedTime', detailFeedback?.updatedTime || '');

          await httpAxios.Put(`/api/v1/f9/system-admin/update-feedbacks`, formData).then((res) => {
            if (res?.status === 200) {
              message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
              setOpenModalUpdate(false);
              setLoading(false);
              loadData();
            }
            setLoading(false);
            setOpenModalUpdate(false);
          });
        }
      })
      .catch(() => {});
  };

  const handleValidateUpdate = () => {
    form
      .validateFields()
      .then(async () => {
        setOpenModalUpdate(!isOpenModalUpdate);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    form.setFieldsValue({
      roles: detailFeedback?.role?.toString()?.split(','),
      type: detailFeedback?.type,
      phase: detailFeedback?.phase,
      features: detailFeedback?.feature?.map((v: string) => v?.split('-')),
      summary: detailFeedback?.summary,
      detail: detailFeedback?.detail,
    });
  }, [isEditUser, isEditSystemAdmin]);

  return (
    <div>
      <Card>
        <Typography.Title level={5}>{t('IDS_FEEDBACK_DETAIL_INFO')}</Typography.Title>
        <Form
          labelAlign="left"
          labelCol={{ span: 1 }}
          colon={false}
          requiredMark={false}
          form={form}
          name="create_template_form"
        >
          {(role === 'systemAdmin' || role === 'admin') && (
            <Form.Item colon={false} label={t('IDS_IMPACT_SCOPE')}>
              <Typography.Text>
                {detailFeedback?.impactScope !== null || undefined
                  ? (t('IDS_IMPACT_SCOPE_OPTIONS', { returnObjects: true }) as any)[detailFeedback?.impactScope]
                  : t('IDS_HAVE_NOT_SET')}
              </Typography.Text>
            </Form.Item>
          )}

          <Form.Item colon={false} label={t('IDS_NO')}>
            <Typography.Text>{detailFeedback?.id}</Typography.Text>
          </Form.Item>

          <Form.Item colon={false} label={t('IDS_STATUS')}>
            <Typography.Text>
              {(t('IDS_STATUS_FEEDBACK_OPTIONS', { returnObjects: true }) as any)[detailFeedback?.status]}
            </Typography.Text>
          </Form.Item>

          <Form.Item
            colon={false}
            label={t('IDS_ROLE')}
            name="roles"
            rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() }]}
          >
            {isEditUser || isEditSystemAdmin ? (
              <Select
                style={{ width: '250px' }}
                size="small"
                options={(() => {
                  const rawOptions = Object.entries(t('IDL_LIST_ROLE', { returnObjects: true })).map(([key, value]) => ({
                    value: key,
                    label: value,
                  }));
                
                  // Hoán vị index 5 và 6 nếu tồn tại
                  if (rawOptions.length > 6) {
                    const temp = rawOptions[5];
                    rawOptions[5] = rawOptions[6];
                    rawOptions[6] = temp;
                  }
                
                  // Lọc theo listRoles
                  return rawOptions.filter((item) => !listRoles.includes(item.value));
                })()}
                mode="multiple"
                notFoundContent={<EmptyComponent />}
                disabled={isLoading}
              />
            ) : (
              displayRole(detailFeedback?.role)
            )}
          </Form.Item>

          <Form.Item
            colon={false}
            label={t('IDS_TYPE_FEEDBACK')}
            name="type"
            rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() }]}
          >
            {isEditUser || isEditSystemAdmin ? (
              <Radio.Group
                options={Object.entries(t('IDS_TYPE_FEEDBACK_OPTIONS', { returnObjects: true }))
                  .map(([k, v]) => ({
                    label: v,
                    value: +k,
                  }))
                  .sort((o1, o2) => (o1.value === 0 ? 1 : o2.value === 0 ? -1 : o1.value - o2.value))}
                disabled={isLoading}
              />
            ) : (
              <Typography.Text>
                {(t('IDS_TYPE_FEEDBACK_OPTIONS', { returnObjects: true }) as any)[detailFeedback?.type]}
              </Typography.Text>
            )}
          </Form.Item>

          <Form.Item
            colon={false}
            label={t('IDS_CLASSIFICATION')}
            name="phase"
            rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() }]}
          >
            {isEditUser || isEditSystemAdmin ? (
              <Radio.Group
                options={Object.entries(t('IDS_PHASE_FEEDBACK_OPTIONS', { returnObjects: true }))
                  .map(([k, v]) => ({
                    label: v,
                    value: +k,
                  }))
                  .sort((o1, o2) => (o1.value === 0 ? 1 : o2.value === 0 ? -1 : o1.value - o2.value))}
                disabled={isLoading}
              />
            ) : (
              <Typography.Text>
                {(t('IDS_PHASE_FEEDBACK_OPTIONS', { returnObjects: true }) as any)[detailFeedback?.phase]}
              </Typography.Text>
            )}
          </Form.Item>

          <Form.Item
            name="features"
            colon={false}
            label={t('IDS_TARGET_SCREEN')}
            rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM').toString() }]}
          >
            {isEditUser || isEditSystemAdmin ? (
              <Cascader
                style={{ width: '400px' }}
                size="small"
                options={optionsTargetScreens(getListKeyExceptRole(user?.roles, role))}
                multiple={true}
                showSearch={true}
                displayRender={(labels) => {
                  return `${labels[labels.length - 1]}${labels.length > 1 ? `（${t(labels[0])}）` : ''}`;
                }}
                disabled={isLoading}
              />
            ) : (
              <Typography.Text>
                {detailFeedback?.feature.length > 0
                  ? convertListScreen(detailFeedback?.feature)
                  : t('MESSAGE.COMMON.IDM_EMPTY_DATA')}
              </Typography.Text>
            )}
          </Form.Item>

          <Form.Item
            colon={false}
            label={
              <Row>
                <Col>{t('IDS_ISSUE_OVERVIEW')}</Col>
                { (isEditUser || isEditSystemAdmin) && <Col>
                  <Tooltip
                    title={t('IDS_TOOLTIP_FEEDBACK_SUMMARY')}
                    color="#424242"
                    overlayInnerStyle={{ fontSize: '11px' }}
                  >
                    <InfoCircleOutlined
                      style={{
                        color: '#6e5b14',
                        fontSize: 18,
                        marginLeft: '7px',
                        marginTop: 2,
                        cursor: 'default',
                      }}
                    />
                  </Tooltip>
                </Col> }
              </Row>
            }
            name="summary"
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: SUBJECT_MAX_LENGTH,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', SUBJECT_MAX_LENGTH.toString()),
              },
            ]}
          >
            {isEditUser || isEditSystemAdmin ? (
              <TextArea disabled={isLoading} autoSize={{ minRows: 2 }} maxLength={SUBJECT_MAX_LENGTH + 1} />
            ) : (
              <Typography.Text>{detailFeedback?.summary}</Typography.Text>
            )}
          </Form.Item>

          <Form.Item
            colon={false}
            label={t('IDS_FEEDBACK_DETAIL')}
            name="detail"
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: DESCRIPTION_MAX_LENGTH,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace(
                  '{maxLength}',
                  DESCRIPTION_MAX_LENGTH.toString(),
                ),
              },
            ]}
          >
            {isEditUser ? (
              <TextArea disabled={isLoading} autoSize={{ minRows: 4 }} maxLength={DESCRIPTION_MAX_LENGTH + 1} />
            ) : (
              <Typography.Text>{detailFeedback?.detail}</Typography.Text>
            )}
          </Form.Item>

          <Form.Item
            colon={false}
            label={
              <Row>
                <Col>{t('IDS_FILE_ATTACHES')}</Col>

                {(isEditUser || isEditSystemAdmin) && (
                  <Col>
                    <Tooltip
                      title={t('IDS_TOOLTIP_FEEDBACK_UPLOAD')}
                      color="#424242"
                      overlayInnerStyle={{ fontSize: '11px' }}
                    >
                      <InfoCircleOutlined
                        style={{
                          color: '#6e5b14',
                          fontSize: 18,
                          marginLeft: '7px',
                          marginTop: 2,
                          cursor: 'default',
                        }}
                      />
                    </Tooltip>
                  </Col>
                )}
              </Row>
            }
            name="files"
            wrapperCol={{ span: 10 }}
            rules={[
              {
                validator: () => {
                  if (fileList.length > 10)
                    return Promise.reject(
                      t('MESSAGE.COMMON.IDM_UPLOAD_MAX_QUANTITY').replace('{0}', UPLOAD_MAX_QUANTITY.toString()),
                    );
                  if (fileList.reduce((sum, file) => sum + (file.size ?? 0), 0) > UPLOAD_MAX_TOTAL_SIZE)
                    return Promise.reject(t('MESSAGE.COMMON.IDM_UPLOAD_MAX_TOTAL_SIZE').replace('{0}', '30MB'));
                  if (fileList.some((file) => file.status != 'done' && !acceptedTypes.includes(file.type ?? ''))) {
                    const errorMessage = (
                      <>
                        {t('MESSAGE.COMMON.IDM_NOT_ACCEPTED_FILE_TYPES')
                          .split('\n')
                          .map((line, index) => (
                            <span key={index}>
                              {line}
                              <br />
                            </span>
                          ))}
                      </>
                    );

                    return Promise.reject(errorMessage);
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            {isEditUser ? (
              <Upload
                disabled={isLoading}
                accept={acceptedTypes.join()}
                multiple
                maxCount={UPLOAD_MAX_QUANTITY + 1}
                beforeUpload={() => false}
                style={{ width: 10 }}
                fileList={fileList}
                onChange={handleChange}
                onRemove={handleRemove}
              >
                <Button icon={<UploadOutlined />}>{t('IDS_UPLOAD')}</Button>
              </Upload>
            ) : (
              displayAttachFiles(detailFeedback)
            )}
          </Form.Item>

          {role === 'user' ? (
            <Row style={{ marginTop: 15 }}>
              {statusFeedback === 1 /**user chỉ có thể edit hoặc cancel khi detail feedback có status = 1 */ && (
                <Space size={'middle'}>
                  {isEditUser ? (
                    <MainButton
                      type="primary"
                      name="Search"
                      value="txt_evaluation_search"
                      onClick={handleValidateUpdate}
                    >
                      {t('IDS_BUTTON_SAVE')}
                    </MainButton>
                  ) : (
                    <MainButton
                      type="primary"
                      name="Search"
                      value="txt_evaluation_search"
                      onClick={() => {
                        setIsEditUser(true);
                        if (
                          detailFeedback?.attachFile !== undefined ||
                          detailFeedback?.attachFile !== null ||
                          detailFeedback?.attachFile !== ''
                        ) {
                          const listFileNames: string[] = detailFeedback?.attachFile?.split('|');
                          const finalListFileNames = listFileNames?.filter((value) => value !== '');
                          const listFiles: any = [];
                          for (let i = 0; i < finalListFileNames?.length; i++) {
                            listFiles.push({
                              uid: i.toString(),
                              name: finalListFileNames[i],
                              status: 'done',
                            });
                          }
                          setFileList(listFiles);
                        }
                      }}
                    >
                      {t('IDS_EDIT')}
                    </MainButton>
                  )}

                  {!isEditUser ? (
                    <MainButton
                      type="primary"
                      name="Search"
                      value="txt_evaluation_search"
                      onClick={() => {
                        setOpenCancel(true);
                      }}
                    >
                      {t('IDS_STATUS_FEEDBACK_OPTIONS.8')}
                    </MainButton>
                  ) : (
                    <CancelButton
                      onClick={() => {
                        setIsEditUser(false);
                      }}
                    >
                      {t('IDS_BUTTON_CANCEL')}
                    </CancelButton>
                  )}
                </Space>
              )}
            </Row>
          ) : role === 'systemAdmin' ? (
            <Row style={{ marginTop: 15 }}>
              <Space size={'middle'}>
                <>
                  {[2, 4, 5].includes(
                    statusFeedback,
                  ) /**system admin chỉ có thể edit khi detail feedback có status = 2, 4, 5 */ && (
                    <div>
                      {isEditSystemAdmin ? (
                        <MainButton
                          type="primary"
                          name="Search"
                          value="txt_evaluation_search"
                          onClick={handleValidateUpdate}
                        >
                          {t('IDS_BUTTON_SAVE')}
                        </MainButton>
                      ) : (
                        <MainButton
                          type="primary"
                          name="Search"
                          value="txt_evaluation_search"
                          onClick={() => setIsEditSystemAdmin(true)}
                        >
                          {t('IDS_FEEDBACK_EDIT_FEEDBACK')}
                        </MainButton>
                      )}
                    </div>
                  )}
                </>

                {!isEditSystemAdmin ? (
                  <>
                    <>
                      {[2, 4, 5].includes(
                        statusFeedback,
                      ) /**system admin chỉ có thể update phạm vi ảnh hưỡng khi detail feedback có status =  2, 4, 5 */ && (
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                          <Dropdown
                            trigger={['click']}
                            menu={{
                              items: itemsScopeEffect.filter((value: any) => {
                                return value.key !== detailFeedback?.impactScope;
                              }),
                            }}
                            placement="topLeft"
                            open={isOpenDropDownScopeEffect}
                            onOpenChange={() => setIsOpenDropDownScopeEffect(!isOpenDropDownScopeEffect)}
                          >
                            <Button className="button-normal" type="primary" size="middle" onClick={() => {}}>
                              {t('IDS_IMPACT_SCOPE_BUTTON')}
                              <CaretUpOutlined />
                            </Button>
                          </Dropdown>
                        </Col>
                      )}
                    </>

                    <Col style={{ display: 'flex', justifyContent: 'center' }}>
                      <Dropdown
                        trigger={['click']}
                        menu={{
                          items: itemsStatus.filter((value: any) => {
                            return value.key !== detailFeedback?.status;
                          }),
                        }}
                        placement="topLeft"
                        open={isOpenDropDownStatus}
                        onOpenChange={() => setIsOpenDropDownStatus(!isOpenDropDownStatus)}
                      >
                        <Button className="button-normal" type="primary" size="middle" onClick={() => {}}>
                          {t('IDS_STATUS_UPDATE')}
                          <CaretUpOutlined />
                        </Button>
                      </Dropdown>
                    </Col>
                  </>
                ) : (
                  <CancelButton
                    onClick={() => {
                      setIsEditSystemAdmin(false);
                    }}
                  >
                    {t('IDS_BUTTON_CANCEL')}
                  </CancelButton>
                )}
              </Space>
            </Row>
          ) : null}
        </Form>
      </Card>

      <ModalCustomComponent
        isOpen={isOpenCancel}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_CANCEL')}
        fnHandleOk={handleUserCancelFeeback}
        fnHandleCancel={() => {
          setOpenCancel(false);
        }}
        okText={t('IDS_STATUS_FEEDBACK_OPTIONS.8') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />

      <ModalCustomComponent
        isOpen={isOpenImpactScope}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={
          <div>
            <Form.Item
              label={t('IDS_UPDATE_VALUE')
                .replace(
                  '{keyOld}',
                  detailFeedback?.impactScope !== null || undefined
                    ? (t('IDS_IMPACT_SCOPE_OPTIONS', { returnObjects: true }) as any)[detailFeedback?.impactScope]
                    : t('IDS_HAVE_NOT_SET'),
                )
                .replace(
                  '{keyNew}',
                  (t('IDS_IMPACT_SCOPE_OPTIONS', { returnObjects: true }) as any)[getImpactScopeValue],
                )
                .replace('{key}', t('IDS_IMPACT_SCOPE'))}
              colon={false}
            ></Form.Item>
          </div>
        }
        fnHandleOk={handleUpdateImpactScope}
        fnHandleCancel={() => {
          setOpenImpactScope(false);
        }}
        okText={t('IDS_BUTTON_SAVE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />

      <ModalCustomComponent
        isOpen={isOpenStatus}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={
          <div>
            <Form.Item
              label={t('IDS_UPDATE_VALUE')
                .replace(
                  '{keyOld}',
                  (t('IDS_STATUS_FEEDBACK_OPTIONS', { returnObjects: true }) as any)[detailFeedback?.status],
                )
                .replace('{keyNew}', (t('IDS_STATUS_FEEDBACK_OPTIONS', { returnObjects: true }) as any)[getStatusValue])
                .replace('{key}', t('IDS_STATUS'))}
              colon={false}
            ></Form.Item>
          </div>
        }
        fnHandleOk={handleUpdateStatus}
        fnHandleCancel={() => {
          setOpenStatus(false);
        }}
        okText={t('IDS_BUTTON_SAVE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />

      <ModalCustomComponent
        isOpen={isOpenModalUpdate}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE')}
        fnHandleOk={handleUpdate}
        fnHandleCancel={() => {
          setOpenModalUpdate(!isOpenModalUpdate);
        }}
        okText={t('IDS_BUTTON_SAVE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />
    </div>
  );
};
export default DetailAndEditlnforFeedback;
