import { Form, Typography, Spin, notification, Card, Grid, Affix, Button, Select } from 'antd';
import { useEffect, useState, startTransition, useTransition, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import proSetting from '../../../common/api/pro-setting';
import { t } from 'i18next';
import message from 'antd/lib/message';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import { NotificationPlacement } from 'antd/es/notification/interface';
import Information from '../../../views/pro-skill-setting/edit/Information';
import { ChildrenEditProSkill, DataSourceEditProSkill, saveDraftInterfaces } from '../interfaces/Interfaces';
import TableComponents from '../../../views/pro-skill-setting/edit/TableComponents';
import ButtonTableComponents from '../../../views/pro-skill-setting/edit/components/ButtonTableComponents';
import ButtonFooter from '../../../views/pro-skill-setting/edit/components/ButtonFooter';
import EmptyComponent from '../../../common/EmptyComponent';
import { urlCompanyCode } from '../../../common/util';
import { useForm } from 'antd/es/form/Form';

type tType = 'submit' | 'cancel';
type stringsType = {
  type: tType;
  content: string;
  textButton: string;
};

const EditProSkill = () => {
  const location = useLocation();
  const [isPending, transition] = useTransition();
  const { state }: any = useLocation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [dataSources, setDataSources] = useState<any>({
    data: {
      id: 0,
      skill: '',
      publicStatus: 0,
      children: [],
      status: 0,
      updated: '',
      versionId: 0,
      version: '',
      reason: '',
      versionMain: 0,
      versionSub: 0,
      skillActive: 1,
      lastUpdatedTime: '',
      userUpdated: '',

      // listDepartment: '',
    },
    settersAndApprovers: {
      setters: [],
      approvers: [],
    },
    subVersion: 0,
    listPoint: {
      settingProFormula: [],
    },
    skillRoles: 0,
    lengths: 0,
    rejectComment: '',
  });
  const [selectedRowKeys, setSelectRowsKeys] = useState<string[]>([]);

  const [selectRecords, setSelectRecord] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isOpen, setOpen] = useState(false);
  const [isAffixed, setIsAffixed] = useState<boolean>();
  const [types, setType] = useState<stringsType>({
    type: 'cancel',
    content: '',
    textButton: '',
  });
  const breaks = Grid.useBreakpoint();

  const [api, contextHolder] = notification.useNotification();
  const [isFinish, setFinish] = useState(false);
  const [listsPoints, setListPoint] = useState<
    {
      id: number;
      versionId: number;
      note: string;
      point: number;
    }[]
  >([]);
  const [isDrop, setDrop] = useState(false);
  const [listPublics, setListPublic] = useState([]);
  const [isImport, setImport] = useState(false);
  const [formImport] = useForm();
  const openNotification = (placement: NotificationPlacement, mesage: string) => {
    api.warning({
      message: <Typography.Title level={4}>{t('IDS_NOTIFY')}</Typography.Title>,
      description: mesage,
      placement,
    });
  };
  const errorsCallback = (bool: boolean) => {
    setLoading(bool);
  };

  // save draft data
  const saveDraft = useCallback(() => {
    const callBack = (response: any) => {
      if (response.code === 200) {
        if (response.skillActive <= 0) {
          return navigate('/404page');
        }

        setDataSources({
          data: {
            ...dataSources.data,
            updated: response.updated,
            versionId: response.id,
            status: response.status,
            skillActive: response.skillActive,
            versionMain: response.version,
            versionSub: response.subVersion,
            version: `${response.version}.${response.subVersion}`,
            id: response.id,
            skillId: response.skillId,
            createdUser: response.creationUser,
            skill: response.skill,
            lastUpdatedTime: response.lastUpdatedTime,

            // listDepartment: response.listDepartment,
          },
          rejectComment: dataSources.rejectComment,
          settersAndApprovers: dataSources.settersAndApprovers,
          subVersion: response.subVersion,
          listPoint: dataSources.listPoint,
          skillRoles: response.skillRoles,
        });

        navigate(`${location.pathname}`, {
          replace: true,
          state: {
            id: response.id,
            updated: response.updated,
            userUpdated: response.fullName,
            versionId: response.id,
            version: `${response.version}.${response.subVersion}`,
            reason: response.reason,
            versionMain: response.version,
            versionSub: response.subVersion,
            skilltActive: response.skilltActive,
            status: response.status,

            // listDepartment: response.listDepartment,
            edited: true,
          },
        });
        setSelectRowsKeys([]);
        if (response.status === 3) {
          navigate(`${location.pathname}`, {
            replace: true,
            state: {
              id: response.id,
            },
          });
        }
        message.success(t('MESSAGE.COMMON.IDM_SAVE_DRAFT_SUCCESS').toString());
      } else if (response.code === 403) {
        message.error(t('MESSAGE.COMMON.IDM_UNAUTHORIZED_SETTING_PRO_SKILL'));
      } else if (response.code === 401) {
        message.error(t('MESSAGE.SCREEN.CRITERIA.IDM_VERSION_EXIST_EDITING'));
      } else if (response.code === 406) {
        message.error(t('MESSAGE.SCREEN.CRITERIA.IDM_VERSION_EXIST_EDITING'));
      }
      setOpen(false);
    };
    const reason = form.getFieldValue('reason');
    if (dataSources.data.id === 0) {
      dataSources.data.reason = reason;
      dataSources.data.status = 1;

      proSetting.createVersionInit(
        `/api/v1/f3/pro-setting/${state?.skillId}/create-initial-version`,
        dataSources.data,
        true,
        callBack,
        errorsCallback,
      );
    } else {
      dataSources.data.reason = reason;
      proSetting.saveDraft(state?.id, dataSources.data, callBack, errorsCallback);
    }
  }, [isLoading, dataSources.data.children.length, isDrop, dataSources.data.children]);

  // submit version

  const submitData = () => {
    form
      .validateFields()
      .then(async () => {
        if (dataSources.data.children.length <= 0) {
          openNotification('bottomRight', t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_PRO_SKILL')));
        } else {
          setOpen(true);
          setType({
            type: 'submit',
            content: t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SUBMIT'),
            textButton: t('IDS_BUTTON_SUBMIT'),
          });
        }
      })
      .catch((errors) => {
        console.log(errors);
      });
  };

  // ===== get detail ==================================================
  const errorsCallbackDetail = (bool: boolean | undefined) => {
    setLoading(bool || false);
  };

  // cancel version
  const callBackCancel = (data: { code: number; id: number }) => {
    if (data?.code !== 403) {
      message.success(t('MESSAGE.COMMON.IDM_SAVE_CANCEL_SUCCESS').toString());
      navigate(urlCompanyCode() + `/pro-setting/detail-pro-skill/${data.id}`, {
        replace: true,
        state: {
          id: data.id,
          edited: false,
        },
      });
    } else {
      message.error(t('MESSAGE.COMMON.IDM_UNAUTHORIZED_SETTING_PRO_SKILL'));
    }

    setOpen(!isOpen);
  };
  const cancelVersion = () => {
    if (dataSources.data.versionMain > 0 || (dataSources.subVersion > 1 && [1, 5].includes(dataSources.data.status))) {
      setOpen(true);
      setType({
        type: 'cancel',
        content: t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_CANCEL'),
        textButton: (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[2],
      });
    } else {
      if (dataSources.data.id !== 0 && dataSources.data.status !== 1) {
        // navigate(location.pathname, {
        //   replace: false,
        //   state: {
        //     id: state?.id,
        //     edited: false,
        //   },
        // });
        navigate(-1);
      } else {
        navigate(-1);
      }
    }
  };

  const effectData = () => {
    const callBacks = (data: any) => {
      if (data.code === 403) {
        message.error(t('MESSAGE.COMMON.IDM_UNAUTHORIZED_SETTING_PRO_SKILL'));
        navigate(urlCompanyCode() + '/pro-setting/list-pro-skill');
      }
      data.data.children.forEach((e: any) => {
        e.key = e.itemId;
      });

      setDataSources({
        data: {
          ...data.data,
          versionSub: data.data.status !== 1 && data.data.status !== 5 ? data.subVersion + 1 : data.subVersion,
          updated: data.data.updated,
          createdUser: data.data.creationUser,
          editAlready: data.editAlready,

          // listDeparment: data.data.listDepartment,
        },
        rejectComment: data.rejectComment,
        settersAndApprovers: {
          setters: data.settersAndApprovers.setters,
          approvers: data.settersAndApprovers.approvers,
        },
        subVersion: data.subVersion,
        listPoint: data.listPoint,
        skillRoles: 1,
      });

      if (data.data.skillActive <= 0 || data.skillRoles <= 0) {
        return navigate('/404page');
      }
      setListPoint(data.listPoint?.settingProFormula || []);
      setLoading(false);

      if (Object.keys(data).length > 0) {
        if (data.data) {
          navigate(`${window.location.pathname}`, {
            replace: true,
            state: {
              id: data.data.versionId,
              updated: data.data.updated,
              versionId: data.data.id,
              version: `${data.data.version}.${data.subVersion}`,
              reason: data.data.reason,
              versionMain: data.data.version,
              versionSub: data.subVersion,
              skillActive: data.data.skillActive,
              edited: data.data.status !== 2,
            },
          });
        }
        form.setFieldsValue({
          reason: data.data.status !== 1 && data.data.status !== 5 ? '' : data.data.reason,
          status: data.data.publicStatus === 1 ? true : false,
        });
        setFinish(true);
      }
    };
    if (state && state.id) {
      proSetting.detailProSkill(
        `/api/v1/f3/pro-setting/edit-pro-skill`,
        state?.id,
        false,
        callBacks,
        errorsCallbackDetail,
      );
    }
  };

  // ==============
  const callBackResPoint = (data: {
    listPoint: { settingProFormula: any[] | [] };
    code: number;
    skill: string;

    // listDepartment: string;
    settersAndApprovers: { setters: string[]; approvers: string[] };
    rejectComment: string;
  }) => {
    if (data.code === 403) {
      message.error(t('MESSAGE.COMMON.IDM_UNAUTHORIZED_SETTING_PRO_SKILL'));
      navigate(urlCompanyCode() + `/pro-setting/list-pro-skill`, {
        replace: false,
      });
    } else {
      setListPoint(data.listPoint.settingProFormula);
      setDataSources({
        ...dataSources,
        data: {
          ...dataSources.data,
          skill: data.skill || state.name,

          // listDepartment: data.listDepartment,
        },
        rejectComment: data.rejectComment,
        settersAndApprovers: data.settersAndApprovers,
      });
    }
  };

  useEffect(() => {
    if (!state || state === null) {
      navigate(urlCompanyCode() + `/pro-setting/list-pro-skill`, {
        replace: false,
      });
    } else {
      if (state.skillId) {
        setDataSources({
          subVersion: 0,
          data: {
            children: [],
            skill: state.name,
            id: 0,
            publicStatus: 0,
            reason: null,
            status: 1,
            updated: null,
            version: '0.1',
            versionId: 0,
            versionMain: 0,
            versionSub: 0,
            skillActive: 1,
            lastUpdatedTime: '',
            userUpdated: '',

            // listDepartment: '',
          },
          rejectComment: dataSources.rejectComment,
          settersAndApprovers: {
            setters: dataSources.settersAndApprovers.setters,
            approvers: dataSources.settersAndApprovers.approvers,
          },
          listPoint: dataSources.listPoint,
          skillRoles: 0,
          type: state.type,
        });

        setFinish(true);
        proSetting.listPointByVersion(state?.skillId, callBackResPoint, errorsCallback);
      }
    }

    effectData();
  }, []);

  const openPopup = () => {
    setOpen(!isOpen);
  };
  const confirmPopup = async () => {
    const objectFunction: { [x: string]: any } = {
      cancel: async function () {
        if (state.id === 0) {
          navigate(urlCompanyCode() + `/pro-setting/list-pro-skill`);
        } else if (state.status === 3) {
          navigate(urlCompanyCode() + `/pro-setting/detail-pro-skill/${state?.id}`, {
            replace: false,
            state: {
              id: state?.id,
              edited: false,
            },
          });
        } else {
          dataSources.data.updated = state.updated || dataSources.data.updated;
          await proSetting.cancelVersionFunc(state?.id, dataSources.data, callBackCancel, errorsCallback);
        }
      },
      submit: async function () {
        const callBackSubmit = (data: { code: number; id: number }) => {
          setOpen(!isOpen);
          setLoading(false);

          if (data?.code === 200) {
            message.success(t('MESSAGE.COMMON.IDM_SUBMIT_SUCCESS').toString());
            if (data) {
              navigate(urlCompanyCode() + `/pro-setting/detail-pro-skill/${data.id}`, {
                replace: true,
                state: {
                  id: data.id,
                  edited: false,
                },
              });
            }
          } else if (data.code === 402) {
            message.error(t('MESSAGE.SCREEN.PRO_SKILL_SETTING.IDM_NOT_ALLOW_SUBMIT'));
          } else if (data.code === 403) {
            message.error(t('MESSAGE.COMMON.IDM_UNAUTHORIZED_SETTING_PRO_SKILL'));
          } else if (data.code === 405) {
            message.error(t('MESSAGE.COMMON.IDM_WITHOUT_ROLES_SUBMIT_SETTING_PRO_SKILL'));
          } else if (data.code === 401) {
            message.error(t('MESSAGE.SCREEN.CRITERIA.IDM_VERSION_EXIST_EDITING'));
          } else if (data?.code === 406) {
            message.error(t('MESSAGE.SCREEN.CRITERIA.IDM_VERSION_EXIST_EDITING'));
          }
        };
        const reason = form.getFieldValue('reason');
        dataSources.data.reason = reason;
        if (dataSources.data.id === 0) {
          dataSources.data.status = 3;
          if (dataSources.data.children.length > 0) {
            form
              .validateFields()
              .then(async () => {
                await proSetting.createVersionInit(
                  `/api/v1/f3/pro-setting/${state?.skillId}/create-initial-version`,
                  dataSources.data,
                  false,
                  callBackSubmit,
                  errorsCallback,
                );
              })
              .catch((_error) => {});
          } else {
            openNotification('bottomRight', t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_PRO_SKILL')));
          }
        } else {
          await form
            .validateFields()
            .then(async () => {
              if (dataSources.data.children.length > 0) {
                dataSources.data.updated = state?.updated || dataSources.data.updated;
                await proSetting.submitVersion(state?.id, dataSources.data, callBackSubmit, errorsCallback);
              } else {
                openNotification(
                  'bottomRight',
                  t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_PRO_SKILL')),
                );
              }
            })
            .catch((_error) => {});
        }
      },
    };
    objectFunction[types.type]();
    openPopup();
  };

  const cloneRecord = () => {
    if (selectRecords.length <= 0) {
      const arrays = dataSources.data.children[dataSources.data.children.length - 1];
      const clones = {
        ...arrays,
        itemId: Math.random().toString(36).slice(2).substr(0, 4),
        key: Math.random().toString(36).slice(2).substr(0, 4),
      };

      // const totals = [...dataSources.data.children, clones];
      // if (totals.length <= 100) {
      transition(() => {
        setDataSources({
          ...dataSources,
          data: {
            ...dataSources.data,
            children: [...dataSources.data.children, clones],
          },
        });
      });

      // } else {
      //   openNotification('bottomRight', t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '100'));
      // }
    } else {
      const arrays = selectRecords.map((v: ChildrenEditProSkill) => {
        const data = dataSources.data.children.find((f: ChildrenEditProSkill) => f.itemId === v.itemId);

        return {
          // ...data,
          content: data?.content || '',
          difficulty: data?.difficulty || null,
          jobType: data?.jobType || '',
          mediumClass: data?.mediumClass || '',
          note: data?.note || '',
          smallClass: data?.smallClass || '',
          versionId: data?.versionId,
          key: Math.random().toString(36).slice(2).substr(0, 4),
          itemId: Math.random().toString(36).slice(2).substr(0, 4),
        };
      });

      // console.log(dataSources.data.children, selectRecords[selectRecords.length - 1]);
      const index = dataSources.data.children.findIndex(
        (v: any) => v.itemId === selectRecords[selectRecords.length - 1].itemId,
      );
      const array = dataSources.data.children;
      array.splice(index + 1, 0, ...arrays);

      // const totals = [...dataSources.data.children, ...arrays];
      // if (totals.length <= 100) {
      transition(() => {
        setDataSources({
          ...dataSources,
          data: {
            ...dataSources.data,
            children: [...array],
          },
        });
      });

      // } else {
      //   openNotification('bottomRight', t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '100'));
      // }
    }
  };

  const cloneBlankInput = () => {
    // if (dataSources.data.children.length < 100) {
    const data = {
      itemId: Math.random().toString(36).slice(2).substr(0, 4),
      key: Math.random().toString(36).slice(2).substr(0, 4),
      jobType: '',
      mediumClass: '',
      smallClass: '',
      content: '',
      difficulty: null,
      note: '',
      versionId: dataSources.data.versionId,
    };

    transition(() => {
      setDataSources({
        ...dataSources,
        data: {
          // ...dataSources.data,
          skill: dataSources.data.skill,
          createdUser: dataSources.data.createdUser,
          skillActive: dataSources.data.skillActive,
          skillId: dataSources.data.skillId,
          id: dataSources.data.id,
          lastUpdatedTime: dataSources.data.lastUpdatedTime,
          publicStatus: dataSources.data.publicStatus,
          reason: dataSources.data.reason,
          status: dataSources.data.status,
          updated: dataSources.data.updated,
          userUpdated: dataSources.data.userUpdated,
          version: dataSources.data.version,
          versionId: dataSources.data.versionId,
          versionMain: dataSources.data.versionMain,
          versionSub: dataSources.data.versionSub,

          // listDepartment: dataSources.data.listDepartment,
          children: [...dataSources.data.children, data],
        },
      });
    });

    // } else {
    //   openNotification('bottomRight', t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '100'));
    // }
  };

  // console.log(dataSources.data.children, 222);
  const openPopupImportProSkill = () => {
    const callBack = (data: any) => {
      const results = data.map((v: any) => {
        return {
          ...v,
          name: v.skill.name,
        };
      });

      setListPublic(results);
      setImport(true);
    };
    const errorsCallback = (boolean: boolean) => {
      setLoading(boolean);
    };

    proSetting.listVersionPublic(callBack, errorsCallback);
  };
  const closePopupImport = () => {
    setImport(!isImport);
  };

  const handleImport = () => {
    const versionId = formImport.getFieldValue('versionId');
    if (versionId) {
      const callBack = (data: any) => {
        const mappingData = data.map((v: any) => {
          return {
            itemId: Math.random().toString(36).slice(2).substr(0, 4),
            key: Math.random().toString(36).slice(2).substr(0, 4),
            ...v,
          };
        });
        setDataSources({
          ...dataSources,
          data: {
            ...dataSources.data,
            children: [...dataSources.data.children, ...mappingData],
          },
        });
        formImport.setFieldValue('versionId', '');
        setImport(false);
      };
      const errorCallback = (bool: boolean) => {
        setLoading(bool);
      };

      proSetting.listItemTemplateSkills(versionId, callBack, errorCallback);
    }
  };

  return (
    <>
      {contextHolder}
      {Object.keys(dataSources.data).length > 0 && isFinish ? (
        <div>
          <Form labelAlign="left" labelCol={{ span: 1 }} layout="horizontal" style={{ width: '100%' }} form={form}>
            <Information dataSources={dataSources} isLoading={isLoading} />
            <div style={{ marginTop: 15 }}>
              <Card>
                <Typography.Title level={4}>{t('IDS_LIST_PRO_SKILL')}</Typography.Title>
                <Button
                  type="primary"
                  style={{
                    marginBottom: 10,
                  }}
                  onClick={openPopupImportProSkill}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {t('IDS_IMPORT_PRO_SKILL')}
                </Button>
                <TableComponents
                  breaks={breaks}
                  dataSources={dataSources}
                  isLoading={isLoading || isPending}
                  selectedRowKeys={selectedRowKeys}
                  setDataSources={setDataSources}
                  setSelectRecord={setSelectRecord}
                  setSelectRowsKeys={setSelectRowsKeys}
                  startTransition={startTransition}
                  listPoints={listsPoints}
                  setDrop={setDrop}
                  isDrop={isDrop}
                />
                <ButtonTableComponents
                  breaks={breaks}
                  cloneBlankInput={cloneBlankInput}
                  cloneRecord={cloneRecord}
                  dataSources={dataSources}
                  isLoading={isLoading || isPending}
                  selectedRowKeys={selectedRowKeys}
                  setDataSources={setDataSources}
                  setSelectRecord={setSelectRecord}
                  setSelectRowsKeys={setSelectRowsKeys}
                />
              </Card>
              <Affix
                offsetBottom={0}
                style={{ paddingBottom: 10 }}
                onChange={(affixed) => {
                  setIsAffixed(affixed);
                }}
              >
                <div className={isAffixed ? 'evaluation-sider-affixed' : 'evaluation-sider'}>
                  <ButtonFooter
                    breaks={breaks}
                    cancelVersion={cancelVersion}
                    dataSources={dataSources}
                    isLoading={isLoading || isPending}
                    saveDraft={saveDraft}
                    submitData={submitData}
                  />
                </div>
              </Affix>
            </div>
          </Form>
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        >
          <Spin size="large" />
        </div>
      )}
      <ModalCustomComponent
        isOpen={isOpen}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={types.content}
        fnHandleOk={confirmPopup}
        fnHandleCancel={openPopup}
        okText={types.textButton}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        loading={isLoading}
      />
      <ModalCustomComponent
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 182px)', maxWidth: 'calc(100vw - 50px)' }}
        isOpen={isImport}
        content={
          <>
            <Form form={formImport} onFinish={handleImport}>
              <Form.Item label={t('IDS_TEMPLATE')} name={'versionId'} colon={false}>
                <Select
                  fieldNames={{ label: 'name', value: 'id' }}
                  options={listPublics}
                  style={{
                    width: 200,
                  }}
                  showSearch
                  filterOption={(input: any, option: any) => {
                    return option.skill.name.toLowerCase().includes(input.toLowerCase());
                  }}
                  notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
                />
              </Form.Item>
            </Form>
          </>
        }
        okText={t('IDS_BUTTON_IMPORT') as string}
        fnHandleCancel={closePopupImport}
        // fnHandleOk={() => {
        //   setLoading(true);
        //   const datas: any = listPublics.find((v: any) => v.versionId === form.getFieldValue('versionId'));
        //   const clones =
        //     datas?.children.map((v: any) => {
        //       v.itemId = Math.random().toString(36).slice(2).substr(0, 4);
        //       v.key = Math.random().toString(36).slice(2).substr(0, 4);

        //       return v;
        //     }) || [];

        //   setDataSources({
        //     ...dataSources,
        //     data: {
        //       ...dataSources.data,
        //       children: [...dataSources.data.children, ...clones],
        //     },
        //   });
        //   setImport(false);
        //   form.setFieldValue('versionId', '');
        //   setLoading(false);
        // }}
        fnHandleOk={handleImport}
        header={t('IDS_IMPORT_PRO_SKILL')}
        loading={isLoading}
      />
    </>
  );
};

export default EditProSkill;
