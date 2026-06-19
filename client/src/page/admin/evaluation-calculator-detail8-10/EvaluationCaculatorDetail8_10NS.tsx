import { Form, Grid, message, Radio, Spin, Tabs, TabsProps, Typography } from 'antd';
import { NotificationPlacement } from 'antd/es/notification/interface';
import notification from 'antd/lib/notification';
import { t } from 'i18next';
import { startTransition, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import AdminEvaluationApiService from '../../../common/api/adminEvaluation';
import evaluationCalculationApiService from '../../../common/api/evaluation-calculation';
import { VersionSettingStatus } from '../../../constant/VersionSettingStatus';
import CardCommonInfo from './components/common/CardCommonInfo';
import GroupButton from './components/common/GroupButton';
import ComponentAdditionalDep from './components/ComponentAdditional';
import ComponentGoalsDepartment from './components/ComponentGoalsDepartment';
import ComponentSettingMaxPointDep from './components/ComponentSettingMaxPointDep';
import ComponentTotalPoint from './components/ComponentTotalPoint';
import ComponentAdditional from './components/personal/ComponentAdditional';
import ComponentBehavior from './components/personal/ComponentBehavior';
import ComponentGoals from './components/personal/ComponentGoals';
import ComponentPricingNS from './components/personal/ComponentPricingNS';
import ComponentSettingMaxPoint from './components/personal/ComponentSettingMaxPoint';
import {
  dataSource810,
  dataSubSetting810NS,
  dataTab17Behavior,
  dataTab17GoalPersonal,
  dataTab17GoalPersonalAdditional,
  dataTab17Level,
  dataTab810Formula,
  dataTab810GoalDepartment,
  dataTab810GoalDepartmentAdditional,
} from './interfaces/dataSource8_10';
import { urlCompanyCode } from '../../../common/util';
import { setFocusLevelError } from '../../../store/userEvaluation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';

enum TabPersonal {
  BEHAVIOR_KEY = 'behavior',
  GOAL_KEY = 'goals',
  ADDITIONAL_KEY = 'additional',
  PRICING_KEY = 'pricing',
  SETTING_MAX_POINT = 'settingMaxPoint',
}

enum TitleTab {
  DEPARTMENT = '部門評価',
  PERSONAL = '個人評価',
}

interface ModalType {
  type: string;
  content: string;
  textButton: string;
  open: boolean;
}

const EvaluationCaculatorDetail8_10NS = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const breaks = Grid.useBreakpoint();
  const [hasButton, setHasButton] = useState<boolean>(true);
  type TabId = '1' | '2' | '3' | '4';
  const [tabId, setTabId] = useState<TabId>('1');
  const [tabIdPersonal, setTabIdPersonal] = useState<TabPersonal>(TabPersonal.BEHAVIOR_KEY);
  const [tabParent, setTabParent] = useState<TitleTab>(TitleTab.DEPARTMENT);
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch<AppDispatch>();
  const openNotification = (placement: NotificationPlacement, mesage: string) => {
    api.warning({
      message: <Typography.Title level={4}>{t('IDS_NOTIFY')}</Typography.Title>,
      description: mesage,
      placement,
    });
  };
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [isSaveDraft, setIsSaveDraft] = useState<boolean>(false);
  const listStatus = t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any;

  const [types, setType] = useState<ModalType>({
    type: '',
    content: '',
    textButton: '',
    open: false,
  });

  useEffect(() => {
    if (location.state === null || !location.state || location.state === undefined) {
      navigate(urlCompanyCode() + '/admin-evaluation/list-evaluation-calculation-history');
    } else {
      setStatusNumber(location.state.record.status);

      getData(location.state.record.id, true);
    }
  }, []);

  const [record, setRecord] = useState<any>({});
  const [statusNumber, setStatusNumber] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    if (!(record.status === 4 && !record.isHaveEditRecord) && record.status !== 3 && !isEdit && record.status !== 2) {
      setHasButton(false);
    } else {
      setHasButton(true);
    }
    dispatch(setFocusLevelError([]));
  }, [record]);

  const getData = (versionId: number, loading?: boolean) => {
    setIsLoading(loading || false);
    const callback = (res: dataSource810) => {
      for (let i = 0; i < res.settingAchievementDepDiff.length; i++) {
        res.settingAchievementDepDiff[i].key = Math.random().toString(36).slice(2);
      }

      for (let i = 0; i < res.settingAchievementDepJudgeIndex.length; i++) {
        res.settingAchievementDepJudgeIndex[i].key = Math.random().toString(36).slice(2);
      }

      for (let i = 0; i < res.settingAchievementAdditionalDep.length; i++) {
        res.settingAchievementAdditionalDep[i].key = Math.random().toString(36).slice(2);
      }
      for (let i = 0; i < res.settingFormula810.length; i++) {
        res.settingFormula810[i].key = Math.random().toString(36).slice(2);
      }

      // set điểm default
      startTransition(() => {
        const arrs = res.settingFormula810;
        if (arrs.length === 0)
          arrs.push({
            key: Math.random().toString(36).slice(2),
            point: '-99999.99',
            result: null,
            note: null,
            id: null,
            versionId: null,
          });
        else if (arrs.filter((e: any) => e.point === '-99999.99').length > 0) {
          const tmp = arrs.find((e: any) => e.point === '-99999.99');
          arrs.splice(
            arrs.findIndex((e: any) => e.point === '-99999.99'),
            1,
          );
          if (tmp) {
            arrs.unshift(tmp);
          }
        }

        setDataHandling({
          id: res.id,
          updatedTime: res.updatedTime,
          maxPoint: res.maxPoint,
          minPoint: res.minPoint,
          maxPointDep: res.maxPointDep,
          minPointDep: res.minPointDep,

          settingAchievementDepDiff: res.settingAchievementDepDiff,
          settingAchievementDepJudgeIndex: res.settingAchievementDepJudgeIndex,
          settingAchievementAdditionalDep: res.settingAchievementAdditionalDep,
          settingFormula810: res.settingFormula810,

          settingPointBehavior: res.settingPointBehavior,
          settingAchievementPersonalDiff: res.settingAchievementPersonalDiff,
          settingAchievementPersonalJudgeIndex: res.settingAchievementPersonalJudgeIndex,
          settingAchievementAdditional: res.settingAchievementAdditional,
          settingLevel: res.settingLevel,
          basicMaxDifficulty: res.basicMaxDifficulty,
          behaviorMaxWeight: res.behaviorMaxWeight,
        });
        setData810GoalDepartment({
          settingAchievementDepDiff: res.settingAchievementDepDiff,
          settingAchievementDepJudgeIndex: res.settingAchievementDepJudgeIndex,
        });
        setData810GoalDepartmentAdditional({
          settingAchievementAdditionalDep: res.settingAchievementAdditionalDep,
        });
        setData810Formula({
          settingFormula810: res.settingFormula810,
        });
        setData17Behavior({
          settingPointBehavior: res.settingPointBehavior,
        });
        setData17GoalPersonal({
          settingAchievementPersonalDiff: res.settingAchievementPersonalDiff,
          settingAchievementPersonalJudgeIndex: res.settingAchievementPersonalJudgeIndex,
        });
        setData17GoalAdditional({
          settingAchievementAdditional: res.settingAchievementAdditional,
        });
        setData17Level({
          settingLevel: res.settingLevel,
        });
        setRecord({
          ...record,
          version: `${res.version}.${res.subVersion}`,
          reason: res.reason,
          status: res.status,
          creationUser: res.user.fullName,
          updatedTime: res.updatedTime,
          publicDate: res.publicDate,
          isNew: 0,
          id: res.id,
          type: res.type,
          lastUpdatedTime: res.lastUpdatedTime,
          isHaveEditRecord: res.isHaveEditRecord,
          basicMaxDifficulty: res.basicMaxDifficulty,
          behaviorMaxWeight: res.behaviorMaxWeight,
        });
        setStatusNumber(res.status);
        setIsLoading(false);
        if (res.status === 1) setIsEdit(true);
        else setIsEdit(false);
      });
    };

    const errorCallback = (error: any) => {
      console.log(error);
    };
    AdminEvaluationApiService.getData810NS(versionId, { callback, errorCallback });
  };

  const dataInit: dataSubSetting810NS = {
    id: 0,
    updatedTime: '',
    maxPoint: '',
    minPoint: '',
    maxPointDep: '',
    minPointDep: '',

    settingAchievementDepDiff: [],
    settingAchievementDepJudgeIndex: [],
    settingAchievementAdditionalDep: [],
    settingFormula810: [],

    settingPointBehavior: [],
    settingAchievementPersonalDiff: [],
    settingAchievementPersonalJudgeIndex: [],
    settingAchievementAdditional: [],
    settingLevel: [],
    basicMaxDifficulty: undefined,
    behaviorMaxWeight: undefined,
  };
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigates = useNavigate();
  const [data810GoalDepartment, setData810GoalDepartment] = useState<dataTab810GoalDepartment>({
    settingAchievementDepDiff: [],
    settingAchievementDepJudgeIndex: [],
  });
  const [data810GoalDepartmentAdditional, setData810GoalDepartmentAdditional] =
    useState<dataTab810GoalDepartmentAdditional>({
      settingAchievementAdditionalDep: [],
    });
  const [data810Formula, setData810Formula] = useState<dataTab810Formula>({
    settingFormula810: [],
  });
  const [data17Behavior, setData17Behavior] = useState<dataTab17Behavior>({
    settingPointBehavior: [],
  });
  const [data17GoalPersonal, setData17GoalPersonal] = useState<dataTab17GoalPersonal>({
    settingAchievementPersonalDiff: [],
    settingAchievementPersonalJudgeIndex: [],
  });
  const [data17GoalAdditional, setData17GoalAdditional] = useState<dataTab17GoalPersonalAdditional>({
    settingAchievementAdditional: [],
  });
  const [data17Level, setData17Level] = useState<dataTab17Level>({
    settingLevel: [],
  });
  const [dataHandling, setDataHandling] = useState<dataSubSetting810NS>(dataInit);
  const [isAffixed, setIsAffixed] = useState<boolean>();
  const items2s: TabsProps['items'] = [
    {
      key: '1',
      label: t('IDS_GOAL_DEPARTMENT'),
      children: (
        <ComponentGoalsDepartment
          form={form}
          data={data810GoalDepartment}
          setData={setData810GoalDepartment}
          isEdit={isEdit}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          openNotification={openNotification}
          dataHandling={dataHandling}
          setDataHandling={setDataHandling}
        />
      ),
      forceRender: true,
    },
    {
      key: '2',
      label: t('IDS_ACHIEVEMENT_ADDITIONAL_RESULT'),
      children: (
        <ComponentAdditionalDep
          data={data810GoalDepartmentAdditional}
          setData={setData810GoalDepartmentAdditional}
          form={form}
          isEdit={isEdit}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          openNotification={openNotification}
          dataHandling={dataHandling}
          setDataHandling={setDataHandling}
        />
      ),
      forceRender: true,
    },
    {
      key: '3',
      label: t('IDS_EVALUATION_PERSONAL'),
      children: (
        <ComponentTotalPoint
          data={data810Formula}
          setData={setData810Formula}
          form={form}
          isEdit={isEdit}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          openNotification={openNotification}
          dataHandling={dataHandling}
          setDataHandling={setDataHandling}
        />
      ),
      forceRender: true,
    },
    {
      key: '4',
      label: t('IDS_TOTAL_POINT_EVALUATION'),
      children: (
        <ComponentSettingMaxPointDep
          form={form}
          isEdit={isEdit}
          openNotification={openNotification}
          dataHandling={dataHandling}
          setDataHandling={setDataHandling}
        />
      ),
      forceRender: true,
    },
  ];
  const itemsPersonals: TabsProps['items'] = [
    {
      key: TabPersonal.BEHAVIOR_KEY,
      label: t('IDS_BEHAVIOR'),
      children: (
        <ComponentBehavior
          form={form}
          dataSource={data17Behavior}
          setDataSource={setData17Behavior}
          isEdit={isEdit || record?.status === VersionSettingStatus.EDITING}
          openNotification={openNotification}
          isLoading={isLoading}
          isSaveDraft={isSaveDraft}
          dataHandling={dataHandling}
          setDataHandling={setDataHandling}
        />
      ),
      forceRender: true,
    },
    {
      key: TabPersonal.GOAL_KEY,
      label: t('IDS_ACHIEVEMENT_PERSONAL'),
      children: (
        <ComponentGoals
          dataSource={data17GoalPersonal}
          setDataSource={setData17GoalPersonal}
          form={form}
          isEdit={isEdit || record?.status === VersionSettingStatus.EDITING}
          openNotification={openNotification}
          isLoading={isLoading}
          dataHandling={dataHandling}
          setDataHandling={setDataHandling}
        />
      ),
      forceRender: true,
    },
    {
      key: TabPersonal.ADDITIONAL_KEY,
      label: t('IDS_ACHIEVEMENT_ADDITIONAL_RESULT'),
      children: (
        <ComponentAdditional
          dataSource={data17GoalAdditional}
          setDataSource={setData17GoalAdditional}
          form={form}
          isEdit={isEdit || record?.status === VersionSettingStatus.EDITING}
          openNotification={openNotification}
          isLoading={isLoading}
          dataHandling={dataHandling}
          setDataHandling={setDataHandling}
        />
      ),
      forceRender: true,
    },
    {
      key: TabPersonal.PRICING_KEY,
      label: t('IDS_EVALUATION_DISTRIBUTION'),
      children: (
        <ComponentPricingNS
          dataSource={data17Level}
          setDataSource={setData17Level}
          form={form}
          isEdit={isEdit || record?.status === VersionSettingStatus.EDITING}
          dataHandling={dataHandling}
          setDataHandling={setDataHandling}
        />
      ),
      forceRender: true,
    },
    {
      key: TabPersonal.SETTING_MAX_POINT,
      label: t('IDS_TOTAL_POINT_EVALUATION_1_7'),
      children: (
        <ComponentSettingMaxPoint
          form={form}
          isEdit={isEdit || record?.status === VersionSettingStatus.EDITING}
          isLoading={isLoading}
          openNotification={openNotification}
          dataHandling={dataHandling}
          setDataHandling={setDataHandling}
        />
      ),
      forceRender: true,
    },
  ];
  const tabsParents = [
    {
      key: TitleTab.DEPARTMENT,
      title: TitleTab.DEPARTMENT,
      component: (
        <Tabs
          type="card"
          items={items2s.map((_: any, i: any) => {
            return {
              label: (
                <>
                  <span>{items2s[i].label}</span>
                </>
              ),
              key: items2s[i].key,
              children: items2s[i].children,
              forceRender: true,
            };
          })}
          activeKey={tabId}
          onChange={(key: string) => setTabId(key as TabId)}
        />
      ),
    },
    {
      key: TitleTab.PERSONAL,
      title: TitleTab.PERSONAL,
      component: (
        <Tabs
          type="card"
          items={itemsPersonals.map((_: any, i: any) => {
            return {
              label: (
                <>
                  <span>{itemsPersonals[i].label}</span>
                </>
              ),
              key: itemsPersonals[i].key,
              children: itemsPersonals[i].children,
              forceRender: true,
            };
          })}
          activeKey={tabIdPersonal}
          onChange={(key: string) => setTabIdPersonal(key as TabPersonal)}
        />
      ),
    },
  ];

  const handleMoveToTab = (id: TabId, msg: string) => {
    setTabParent(TitleTab.DEPARTMENT);
    setTabId(id);
    openNotification('bottomRight', msg);
    setTimeout(() => {
      form.validateFields();
    }, 500);
  };
  const handleMoveToTabPersonal = (id: TabPersonal, msg: string) => {
    setTabParent(TitleTab.PERSONAL);
    setTabIdPersonal(id);
    openNotification('bottomRight', msg);
    setTimeout(() => {
      form.validateFields();
    }, 500);
  };
  const setInitTabParent = () => {
    setTabParent(TitleTab.DEPARTMENT);
    setTabId('1');
  };

  const handleEditButton = () => {
    const callBack = (res: any) => {
      setRecord({
        ...record,
        version: `${res.version.toString()}.${(res.subVersion + 1).toString()}`,
        status: 1,
        isNew: 1,
        updatedTime: '',
        publicDate: '',
        creationUser: '',
        lastUpdatedTime: '',
        reason: '',
      });
      setStatusNumber(1);
      setInitTabParent();
      form.setFieldValue('reason', '');
      setIsEdit(true);
    };
    evaluationCalculationApiService.getNextVersionNS(record.version, callBack, setIsLoading);
  };

  const getDataEdited = () => {
    return {
      basicMaxDifficulty: dataHandling?.basicMaxDifficulty,
      settingPointBehavior: dataHandling?.settingPointBehavior,
      behaviorMaxWeight: dataHandling?.behaviorMaxWeight,
      settingAchievementPersonalDiff: dataHandling?.settingAchievementPersonalDiff,
      settingAchievementPersonalJudgeIndex: dataHandling?.settingAchievementPersonalJudgeIndex,
      settingAchievementAdditional: dataHandling?.settingAchievementAdditional,
      settingLevel: dataHandling?.settingLevel,
      minPoint: dataHandling?.minPoint,
      maxPoint: dataHandling?.maxPoint,

      settingAchievementDepDiff: dataHandling?.settingAchievementDepDiff,
      settingAchievementDepJudgeIndex: dataHandling?.settingAchievementDepJudgeIndex,
      settingAchievementAdditionalDep: dataHandling?.settingAchievementAdditionalDep,
      settingFormula810: dataHandling?.settingFormula810,
      minPointDep: dataHandling?.minPointDep,
      maxPointDep: dataHandling?.maxPointDep,
    };
  };

  const handleSaveDraftButton = () => {
    // setIsLoading(true);
    setIsLoadingButton(true);
    setIsSaveDraft(true);
    setData17Behavior({
      settingPointBehavior: dataHandling?.settingPointBehavior,
    });
    setData17GoalPersonal({
      settingAchievementPersonalDiff: dataHandling?.settingAchievementPersonalDiff,
      settingAchievementPersonalJudgeIndex: dataHandling?.settingAchievementPersonalJudgeIndex,
    });
    setData17GoalAdditional({
      settingAchievementAdditional: dataHandling?.settingAchievementAdditional,
    });
    setData17Level({ settingLevel: dataHandling?.settingLevel });

    setData810GoalDepartment({
      settingAchievementDepDiff: dataHandling?.settingAchievementDepDiff,
      settingAchievementDepJudgeIndex: dataHandling?.settingAchievementDepJudgeIndex,
    });
    setData810GoalDepartmentAdditional({
      settingAchievementAdditionalDep: dataHandling?.settingAchievementAdditionalDep,
    });
    setData810Formula({
      settingFormula810: dataHandling?.settingFormula810,
    });

    // form.resetFields();

    const callBack = (res: any) => {
      setIsLoadingButton(false);
      setIsSaveDraft(false);

      if (res.code && res.code === 403) {
        message.error(t(res.message));
      } else if (res.code && res.code === 411) {
        message.error(t('MESSAGE.SCREEN.CRITERIA.IDM_VERSION_NOT_ALREADY_PUBLIC'));
      } else {
        message.success(t('MESSAGE.COMMON.IDM_SAVE_DRAFT_SUCCESS'));
        navigates(location.pathname, {
          replace: true,
          state: {
            record: {
              id: res[0].id,
            },
          },
        });
        getData(res[0].id, false);
      }
    };

    evaluationCalculationApiService.saveDraftSetting810NS(
      {
        ...record,
        data: getDataEdited(),
      },
      callBack,
    );
  };
  const cancelVersionAPI = (id: number) => {
    const callBack = () => {
      closePopup();
      message.success(t('MESSAGE.COMMON.IDM_SAVE_CANCEL_SUCCESS'));

      getData(id);
    };
    evaluationCalculationApiService.cancelSetting(
      id,
      {
        ...record,
        data: getDataEdited(),
      },
      callBack,
      setIsLoading,
    );
  };
  const savePublic = () => {
    const popUp: ModalType = {
      type: 'savePublic',
      content: t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE_PUBLIC'),
      textButton: t('IDS_PUBLIC'),
      open: true,
    };
    validate(popUp);
  };

  // check validate và di chuyển các tabs
  const handleValidateFields = (popUp: ModalType) => {
    if (dataHandling?.settingAchievementDepDiff.length === 0) {
      handleMoveToTab('1', t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_DIFFICULTY')));
    } else if (dataHandling?.settingAchievementDepJudgeIndex.length === 0) {
      handleMoveToTab('1', t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_EVALUATION_JUDGMENT_INDEX')));
    } else if (dataHandling?.settingAchievementAdditionalDep.length === 0) {
      handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_EVALUATION_CRITERIA')));
    } else if (dataHandling?.settingFormula810.length === 0) {
      handleMoveToTab('3', t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_DIVISION_EVALUATION')));
    } else if (!dataHandling?.maxPointDep || dataHandling.maxPointDep === '') {
      handleMoveToTab('4', t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_MAX_POINT')));
    } else if (!dataHandling?.minPointDep || dataHandling.minPointDep === '') {
      handleMoveToTab('4', t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_MIN_POINT')));
    } else if (dataHandling?.settingPointBehavior.length === 0) {
      handleMoveToTabPersonal(
        TabPersonal.BEHAVIOR_KEY,
        t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_EVALUATION_CRITERIA')),
      );
    } else if (dataHandling?.settingAchievementPersonalDiff.length === 0) {
      handleMoveToTabPersonal(
        TabPersonal.GOAL_KEY,
        t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_DIFFICULTY')),
      );
    } else if (dataHandling?.settingAchievementPersonalJudgeIndex.length === 0) {
      handleMoveToTabPersonal(
        TabPersonal.GOAL_KEY,
        t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_EVALUATION_JUDGMENT_INDEX')),
      );
    } else if (dataHandling?.settingAchievementAdditional.length === 0) {
      handleMoveToTabPersonal(
        TabPersonal.ADDITIONAL_KEY,
        t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_EVALUATION_CRITERIA')),
      );
    } else if (dataHandling?.settingLevel.length === 0) {
      handleMoveToTabPersonal(
        TabPersonal.PRICING_KEY,
        t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_EVALUATION_CRITERIA')),
      );
    } else {
      const listLevelErrors: any[] = [];
      dataHandling?.settingLevel?.forEach((e: any) => {
        const total = (e.achievementPercent || 0) + (e.behaviorPercent || 0);

        if (total !== 100) {
          listLevelErrors.push(e.level);
        }
      });
      if (listLevelErrors.length > 0) {
        dispatch(setFocusLevelError(listLevelErrors));
        handleMoveToTabPersonal(
          TabPersonal.PRICING_KEY,
          t('MESSAGE.COMMON.IDS_EQUAL_100_PERCENT').replace('{value}', t('IDS_EVALUATION_CRITERIA')),
        );
      } else {
        setType({
          type: popUp.type,
          content: t(popUp.content),
          textButton: t(popUp.textButton),
          open: popUp.open,
        });
      }
    }
  };

  const handleValidateError = (err: any) => {
    const { errorFields } = err;
    if (
      errorFields.filter((item: any) => item.name[0].includes('evaluationGoals')).length > 0 ||
      errorFields.filter((item: any) => item.name[0].includes('noteGoals')).length > 0 ||
      errorFields.filter((item: any) => item.name[0].includes('evaluationJudgment')).length > 0 ||
      errorFields.filter((item: any) => item.name[0].includes('noteJugdment')).length > 0
    )
      handleMoveToTab('1', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    else if (
      errorFields.filter((item: any) => item.name[0].includes('ratingAdd')).length > 0 ||
      errorFields.filter((item: any) => item.name[0].includes('noteAdd')).length > 0 ||
      errorFields.filter((item: any) => item.name[0].includes('pointAdd')).length > 0
    )
      handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    else if (
      errorFields.filter((item: any) => item.name[0].includes('resultTotal')).length > 0 ||
      errorFields.filter((item: any) => item.name[0].includes('noteTotal')).length > 0 ||
      errorFields.filter((item: any) => item.name[0].includes('pointTotal')).length > 0
    )
      handleMoveToTab('3', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    else if (
      errorFields.filter((item: any) => item.name[0].includes('maxPointDep')).length > 0 ||
      errorFields.filter((item: any) => item.name[0].includes('minPointDep')).length > 0
    )
      handleMoveToTab('4', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    else if (
      errorFields.filter((item: any) => item.name[0].includes('max_weight_behavior')).length > 0 ||
      errorFields.filter((item: any) => item.name[0].includes('point_behavior')).length > 0 ||
      errorFields.filter((item: any) => item.name[0].includes('note_behavior')).length > 0
    ) {
      handleMoveToTabPersonal(TabPersonal.BEHAVIOR_KEY, t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    } else if (
      errorFields.filter((item: any) => item.name[0].includes('point_goal')).length > 0 ||
      errorFields.filter((item: any) => item.name[0].includes('note_goal')).length > 0
    ) {
      handleMoveToTabPersonal(TabPersonal.GOAL_KEY, t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    } else if (
      errorFields.filter((item: any) => item.name[0].includes('rating')).length > 0 ||
      errorFields.filter((item: any) => item.name[0].includes('point_additional')).length > 0 ||
      errorFields.filter((item: any) => item.name[0].includes('note_additional')).length > 0
    ) {
      handleMoveToTabPersonal(TabPersonal.ADDITIONAL_KEY, t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    } else if (
      errorFields.filter((item: any) => item.name[0].includes('behaviorpercent')).length > 0 ||
      errorFields.filter((item: any) => item.name[0].includes('achievementpercent')).length > 0
    ) {
      handleMoveToTabPersonal(TabPersonal.PRICING_KEY, t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    } else if (
      errorFields.filter((item: any) => item.name[0].includes('maxPointPersonal')).length > 0 ||
      errorFields.filter((item: any) => item.name[0].includes('minPointPersonal')).length > 0
    ) {
      handleMoveToTabPersonal(TabPersonal.SETTING_MAX_POINT, t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    }
  };

  const validate = async (popUp: ModalType) => {
    await form
      .validateFields()
      .then(() => handleValidateFields(popUp))
      .catch(handleValidateError);
  };

  const confirmPopup = async () => {
    if (types.type === 'cancel') {
      if (record.isNew === 1) {
        closePopup();

        getData(record.id);
        setInitTabParent();
      } else {
        cancelVersionAPI(record.id);
      }
    } else if (types.type === 'private' || types.type === 'public' || types.type === 'savePublic') {
      const callBack = (res: any) => {
        setIsLoading(false);

        if (res.code === 403) {
          if (res.dateGoal) {
            message.error(
              t('MESSAGE.COMMON.IDM_NOT_ALLOW_PUBLIC_DURING_GOAL_SETTING')
                .replace('{0}', res.dateGoal.startCheck)
                .replace('{1}', res.dateGoal.endCheck),
            );
          } else if (res.dateEvaluation) {
            message.error(
              t('MESSAGE.COMMON.IDM_NOT_ALLOW_PUBLIC_DURING_EVALUATION')
                .replace('{0}', res.dateEvaluation.startCheck)
                .replace('{1}', res.dateEvaluation.endCheck),
            );
          } else {
            message.error(res.message);
          }
        } else if (res.code === 411) {
          message.error(t('MESSAGE.SCREEN.CRITERIA.IDM_VERSION_NOT_ALREADY_PUBLIC'));
        } else {
          message.success(t('MESSAGE.COMMON.IDM_SAVE_PUBLIC'));
          getData(res[0].id);
          setInitTabParent();
        }

        navigates(location.pathname, {
          replace: true,
          state: {
            record: {
              id: res[0].id,
            },
          },
        });
        closePopup();
      };
      await evaluationCalculationApiService.savePublicOrPrivate(
        {
          ...record,
          data: getDataEdited(),
          status: 4,
          isUpdate: types.type === 'public' ? 0 : 1,
        },
        callBack,
        setIsLoading,
      );
    }
  };
  const closePopup = () => {
    setType({
      ...types,
      open: false,
    });
  };
  const cancelVersion = () => {
    setType({
      type: 'cancel',
      content: t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_CANCEL'),
      textButton: t('IDS_BUTTON_CANCELED'),
      open: true,
    });
  };
  const publicVersion = async () => {
    const popUp: ModalType = {
      ...types,
      type: 'public',
      content: t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_PUBLIC'),
      textButton: t('IDS_PUBLIC'),
      open: true,
    };
    validate(popUp);
  };

  return (
    <>
      {!isLoading ? (
        <div>
          {contextHolder}
          <Form labelAlign="left" labelCol={{ span: 1 }} layout="horizontal" style={{ width: '100%' }} form={form}>
            <CardCommonInfo
              isEdit={isEdit}
              listStatus={listStatus}
              record={record}
              setRecord={setRecord}
              statusNumber={statusNumber}
            />
            <div style={{ marginTop: 15 }}>
              <Tabs
                type="line"
                className="tab-test"
                defaultActiveKey={TitleTab.DEPARTMENT}
                activeKey={tabParent}
                onChange={(e: any) => {
                  setTabParent(e);
                  if (e === TitleTab.DEPARTMENT) {
                    setTabId('1');
                  } else if (e === TitleTab.PERSONAL) {
                    setTabIdPersonal(TabPersonal.BEHAVIOR_KEY);
                  }
                }}
                items={tabsParents.map((_: any, i: any) => {
                  return {
                    label: (
                      <>
                        <Radio.Group value={tabParent}>
                          {tabsParents[i].key === TitleTab.DEPARTMENT && (
                            <Radio value={TitleTab.DEPARTMENT}>
                              <span>{tabsParents[i].title}</span>
                            </Radio>
                          )}
                          {tabsParents[i].key === TitleTab.PERSONAL && (
                            <Radio value={TitleTab.PERSONAL}>
                              <span>{tabsParents[i].title}</span>
                            </Radio>
                          )}
                        </Radio.Group>
                      </>
                    ),
                    key: tabsParents[i].key,
                    children: tabsParents[i].component,
                    forceRender: true,
                  };
                })}
              />
              {(isEdit || (!isEdit && record.status !== 2)) && hasButton && (
                <GroupButton
                  key="group-button"
                  breaks={breaks}
                  cancelVersion={cancelVersion}
                  handleEditButton={handleEditButton}
                  handleSaveDraftButton={handleSaveDraftButton}
                  isAffixed={isAffixed}
                  isEdit={isEdit}
                  isLoading={isLoading}
                  isLoadingButton={isLoadingButton}
                  publicVersion={publicVersion}
                  record={record}
                  savePublic={savePublic}
                  setIsAffixed={setIsAffixed}
                />
              )}
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
        isOpen={types.open}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={types.content}
        fnHandleOk={confirmPopup}
        fnHandleCancel={closePopup}
        okText={types.textButton}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        loading={isLoading}
      />
    </>
  );
};

export default EvaluationCaculatorDetail8_10NS;
