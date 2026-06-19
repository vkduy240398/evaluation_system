import Typography from 'antd/es/typography';
import { startTransition, useEffect, useMemo, useState } from 'react';
import Button from 'antd/es/button';
import { Form, Space, Table, Tooltip, message } from 'antd';
import { t } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from 'antd';
import { Modal } from 'antd/lib';

import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { statusEvaluationType } from '../../../../common/status';
import { UserEvaluationAchievementType } from '../../../../types/pages/user-evaluation/UserEvaluationType';
import { AppDispatch, RootState } from '../../../../store';
import {
  setAchievementSub2,
  setAchievementSub as setAchievementSubRedux,
  userEvaluationAchievement,
  userEvaluationAchievement2,
} from '../../../../store/userEvaluation';
import userEvaluationApiService from '../../../../common/api/userEvaluation';
import TableCustomComponent from '../../../../@core/components/table-custom/TableCustomComponent';
import AchievementColumnPersonal810, { AchievementSubColumn2 } from './AchievementColumnPersonal810';
import expandedAchievementColumn810 from './ColumnExpandedAchievement810';
import { goalsPastEvaluation } from '../../../../page/user/interfaces/interfacesProps';
import PopupGoals from '../../evaluation/PopupGoals';
import PopupPersonalGoal810 from '../../evaluation/PopupPersonalGoal810';
import PopupGoalPersonalHaveSkill from '../../evaluation/PopupGoalPersonalHaveSkill';
import { EvaluationInfo } from '../interfaces/response.interface';
const { useBreakpoint } = Grid;
type AchievementSubsType = {
  index: number;
  note: string;
  point: string;
};

interface Props {
  achievementDatas: any[];
  isHiddenButtonUserCreateContent: boolean;
  isHiddenButtonEvaluator: boolean;

  // ** Display/Allow edit - column user to self-evaluate
  isDisplayUserEvaluator: boolean;
  isEditUserEvaluation: boolean;

  // ** evaluator 0.5
  isDisplayEvaluator05: boolean;
  isEditEvaluation05: boolean;

  // ** evaluator 1.0
  isDisplayEvaluator1: boolean;
  isEditEvaluation1: boolean;

  // ** evaluator 2.0
  isDisplayEvaluator2: boolean;
  isEditEvaluation2: boolean;

  // ** is user created
  isEvaluatorUser: boolean;

  isNotEvaluator2: boolean;

  // ** F6
  isF5?: boolean;

  statusEvaluation: statusEvaluationType;

  isNoSkill?: boolean;

  isLoading?: boolean;

  isApprovateRejectGoal?: boolean;

  openNotification: (placement: NotificationPlacement, mesage: string) => void;

  fullName?: string;
  evaluatorOrder: number;
  evaluatorOrderList: number[];
  evaluators?: string[];
  pointUser: number;
  pointEvaluator05: number;
  pointEvaluator1: number;
  pointEvaluator2: number;
  evaluationData: EvaluationInfo;
  setPersonalGoalsList: React.Dispatch<React.SetStateAction<any[]>>;
}
const itemRow: UserEvaluationAchievementType = {
  key: 'key-add-new-123',
  itemNo: 0,
  title: null,
  achievementValue: null,
  method: null,
  weight: null,
  difficultyUser: null,
  difficultyEvaluator05: null,
  difficultyEvaluator1: null,
  difficultyEvaluator2: null,
  achievementStatus: null,
  reasonComment: null,
  actionPlan: null,
  pointUser: null,
  coefficientUser: null,
  pointEvaluator05: null,
  coefficientEvaluator05: null,
  pointEvaluator1: null,
  coefficientEvaluator1: null,
  pointEvaluator2: null,
  coefficientEvaluator2: null,
  evaluationAchievementPersonalSub: [],
};

const AchievementPersonalTab = ({
  achievementDatas,
  isHiddenButtonUserCreateContent,
  isHiddenButtonEvaluator,
  isDisplayUserEvaluator,
  isEditUserEvaluation,
  isDisplayEvaluator05,
  isEditEvaluation05,

  // ** evaluator 1.0
  isDisplayEvaluator1,
  isEditEvaluation1,

  // ** evaluator 2.0
  isDisplayEvaluator2,
  isEditEvaluation2,
  isEvaluatorUser,

  isF5,

  statusEvaluation,

  isLoading,

  openNotification,
  pointUser,
  pointEvaluator05,
  pointEvaluator1,
  pointEvaluator2,
  evaluationData,
  setPersonalGoalsList,
}: Props) => {
  // ** State
  const [dataSources, setDataSource] = useState<UserEvaluationAchievementType[]>([]);
  const [achievementSettings, setAchievementSetting] = useState<any[]>([]);
  const [ids, setId] = useState<number>(1);
  const [isLoadingScreen, setLoading] = useState<boolean>(false);
  const [popup, setOpenPopup] = useState<{ isOpen: boolean; childrens: any }>({ isOpen: false, childrens: {} });

  const [achievementSubs, setAchievementSub] = useState<any[]>([]);
  const [expandedRowKeys, setExpandedRowKey] = useState<string[]>(['key-add-new-123']);
  const [value, setValue] = useState<{ v: string; i: number; i2: number } | null>(null);

  // ** Hook
  const storeLoading = useSelector((state: RootState) => state.loading);
  const screens = useBreakpoint();
  const store = useSelector((state: RootState) => state.userEvaluation);
  const dispatch = useDispatch<AppDispatch>();

  const [clone, setClone] = useState<{
    isOpen: boolean;
    title: string;
    evaluationGoalList: goalsPastEvaluation[];
    type: number;
  }>({
    isOpen: false,
    title: t('IDS_TITLE_COPY_PERSONAL_GOAL'),
    evaluationGoalList: [],
    type: 2,
  });

  // state for comment
  const [isOpen, setOpen] = useState<boolean>(false);
  const totalAchivementPersonal: UserEvaluationAchievementType = {
    itemNo: -1,
    key: -1,
    achievementStatus: t('IDS_SUB_TOTAL'),
    achievementValue: '',
    actionPlan: '',
    coefficientEvaluator05: null,
    coefficientEvaluator1: null,
    coefficientEvaluator2: null,
    coefficientUser: null,
    difficultyEvaluator05: null,
    difficultyEvaluator1: null,
    difficultyEvaluator2: null,
    difficultyUser: null,
    method: '',
    reasonComment: '',
    weight: null,
    pointUser: pointUser,
    pointEvaluator05: pointEvaluator05,
    pointEvaluator1: pointEvaluator1,
    pointEvaluator2: pointEvaluator2,
    title: null,
  };

  // ** Effect
  useMemo(() => {
    const callback = (data: any[]) => {
      if (data && data.length > 0) {
        const options = data
          .filter((f) => f.type === 1 && f.typeEvaluation === 2)
          .map((v) => ({ value: v.point, label: parseFloat(v.point).toFixed(1) }));
        setAchievementSetting(options);
        setAchievementSub(
          data
            .filter((f) => f.type === 2 && f.typeEvaluation === 2)
            .map((v) => ({
              evaluationDecision: '',
              index: 0,
              coefficient: parseFloat(v.point).toFixed(1),
              key: v.id,
              degree: v.note,
            })),
        );
      }

      setLoading(false);
    };

    if (achievementDatas.length > 0) {
      setDataSource(achievementDatas);
      setExpandedRowKey(achievementDatas.map((v) => v.key));
      const idList = achievementDatas.map((v, i) => Number(v.key) || i);
      setId(Math.max(...idList));
      // if (Object.keys(store.achievementSubs).length === 0)
      achievementDatas.map((v, i) => {
        dispatch(
          setAchievementSubRedux({
            [i]: v.evaluationAchievementPersonalSub ? [...v.evaluationAchievementPersonalSub] : [],
          }),
        );
      });
    } else if (!store.achievementDatas || store.achievementDatas.length === 0) {
      dispatch(userEvaluationAchievement([itemRow]));
      setDataSource([itemRow]);
    }

    // ** Call api
    setLoading(true);
    userEvaluationApiService.getAchievementPublic({
      achievementType: 2,
      callback,
      isEvaluatorUser,
      isF5,
      type: 3,
    });
  }, [storeLoading.isReloadComponent, statusEvaluation]);

  useEffect(() => {
    if (value !== null) {
      const achievementSubRRedux = (store.achievementSubs[value.i] || []).map((v: any) => ({ ...v, index: value.i }));
      if (achievementSubRRedux[value.i2]) {
        achievementSubRRedux[value.i2].evaluationDecision = value.v;
        achievementSubRRedux[value.i2].index = value.i;
        dispatch(setAchievementSubRedux({ [value.i]: achievementSubRRedux }));
      } else {
        if (achievementSubs[value.i2]) {
          const copyAchievementSubs = achievementSubs.map((v) => ({ ...v, index: value.i }));
          copyAchievementSubs[value.i2].evaluationDecision = value.v;
          copyAchievementSubs[value.i2].index = value.i;
          dispatch(setAchievementSubRedux({ ...store.achievementSubs, [value.i]: copyAchievementSubs }));
        }
      }
    }

    return () => {};
  }, [value]);
  // useEffect(() => {
  //   if (isEvaluatorUser && dataSources.length <= 0) {
  //     addNewRow();
  //   }
  // }, []);

  // ** Functional
  const addNewRow = () => {
    if (store.achievementDatas && store.achievementDatas?.length < 30) {
      const id = (ids || 0) + 1;
      const random = Math.random().toString(36).substring(0, 4);
      const item = {
        ...itemRow,
        key: `achievement-component-key-${id}-${random}`,
      };

      const merges = [...dataSources, item];
      dispatch(
        setAchievementSubRedux({
          [dataSources.length]: achievementSubs.map((v) => ({ ...v, index: dataSources.length })),
        }),
      );
      setDataSource(merges);
      setId(id);
      dispatch(userEvaluationAchievement2(item));
      setExpandedRowKey((dataState) => {
        return [...dataState, `achievement-component-key-${id}-${random}`];
      });
    } else message.warning(t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '30'));
  };

  const deleteRow = (key: string | number, index: number) => {
    const filters = dataSources.filter((f) => f.key !== key);
    setDataSource(filters);

    const achievementSubCopy: { [x: string]: any[] } = { ...store.achievementSubs };

    delete achievementSubCopy[index];
    const obj: any = {};
    Object.values(achievementSubCopy).map((values: AchievementSubsType[], i) => {
      obj[i] = values.map((v) => ({ ...v, index: i }));
    });

    dispatch(userEvaluationAchievement(dataSources?.filter((f) => f.key !== key)));
    dispatch(setAchievementSub2(obj));
  };

  // Mở Popup comment
  // const handleOpenModal = (keyOpen: string, recordKey: string | number) => {

  const columns = AchievementColumnPersonal810({
    deleteRow,
    achievementSettings,
    dataSources: achievementDatas,
    isHiddenInput: isHiddenButtonUserCreateContent || isHiddenButtonEvaluator,

    isDisplayEvaluator05,
    isEditEvaluation05,

    // ** evaluator 1.0
    isDisplayEvaluator1,
    isEditEvaluation1,

    // ** evaluator 2.0
    isDisplayEvaluator2,
    isEditEvaluation2,

    // ** Open Popup
    setOpenPopup,
    isDisplayUserEvaluator,

    isOpen,
    setDataSource,
  });

  const renderTable = (record?: UserEvaluationAchievementType) => {
    const dataList = record ? [{ ...record }] : dataSources.map((v) => ({ ...v }));

    return (
      <>
        {/* Table */}
        <TableCustomComponent
          style={{ marginBottom: 0 }}
          dataSources={[...dataList]}
          columns={columns}
          size="small"
          isLoading={isLoadingScreen || storeLoading.isLoading || storeLoading.isDetailLoading}
        />
      </>
    );
  };

  const renderExpandedTable = () => {
    const columns = expandedAchievementColumn810({
      isDisplayUserEvaluator,
      isEditUserEvaluation,
      isDisplayEvaluator05,
      isEditEvaluation05,

      // ** evaluator 1.0
      isDisplayEvaluator1,
      isEditEvaluation1,

      // ** evaluator 2.0
      isDisplayEvaluator2,
      isEditEvaluation2,
      openNotification,

      isOpen,
    });
    const dataList: UserEvaluationAchievementType[] = dataSources.map((v) => ({ ...v }));

    return (
      <>
        {/* Expanded Table */}
        <Table
          className="table-expanded-vertical-top-header-sticky"
          size="small"
          style={{ wordBreak: 'break-all' }}
          columns={columns}
          dataSource={[...dataList, totalAchivementPersonal]}
          pagination={false}
          loading={storeLoading.isLoading || storeLoading.isDetailLoading}
          bordered
          expandable={{
            expandedRowClassName: () => 'table-expanded-custom',
            defaultExpandAllRows: true,
            expandedRowRender: (record) => renderTable(record),
            rowExpandable: (record) => {
              return record.achievementStatus !== t('IDS_SUB_TOTAL');
            },
          }}
          scroll={{ x: screens.xs || screens.sm ? 1000 : undefined }}
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
        />
      </>
    );
  };

  const renderAchievementSub = (record: UserEvaluationAchievementType, key: string | number, index: number) => {
    const dataList = record?.evaluationAchievementPersonalSub?.length
      ? [...record.evaluationAchievementPersonalSub]
      : achievementSubs;
    const isHiddenInput = isHiddenButtonUserCreateContent || isHiddenButtonEvaluator;

    if (dataList.length > 0)
      return (
        <TableCustomComponent
          style={{ marginBottom: 0 }}
          dataSources={[...dataList]}
          columns={AchievementSubColumn2({
            index,
            key,
            isHiddenInput,
            handle,
            isOpen,
          })}
          size="small"
        />
      );
  };
  const handle = (value: any, index: number, index2: number) => {
    startTransition(() => {
      setValue({ v: value, i: index, i2: index2 });
    });
  };

  const renderExpandedTableAchievementSub = () => {
    const dataList: UserEvaluationAchievementType[] = dataSources.map((v) => ({ ...v }));

    return (
      <Table
        className="table-expanded-vertical-top-header-sticky"
        size="small"
        style={{ wordBreak: 'break-all' }}
        columns={columns}
        dataSource={dataList}
        pagination={false}
        loading={storeLoading.isLoading || storeLoading.isDetailLoading}
        bordered
        expandable={{
          defaultExpandAllRows: true,

          expandedRowKeys: [...expandedRowKeys],
          expandedRowRender: (record, index) => {
            return renderAchievementSub(record, record.key, index);
          },
          rowExpandable: (record) => {
            return record.achievementStatus !== t('IDS_SUB_TOTAL');
          },
          onExpand(expanded, record: any) {
            if (expanded) {
              setExpandedRowKey((dataState) => [...dataState, record.key]);
            } else {
              setExpandedRowKey((dataState) => dataState.filter((f) => f !== record.key));
            }
          },
        }}
        scroll={{ x: screens.xs || screens.sm ? 1000 : undefined }}
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
      />
    );
  };
  const goalPastAchievement = async () => {
    setClone({
      isOpen: true,
      evaluationGoalList: [],
      title: t('IDS_TITLE_COPY_PERSONAL_GOAL'),
      type: 2,
    });
    // const callBack = (
    //   data: {
    //     title: string;
    //     id: number;
    //     achievementValue: string;
    //     method: string;
    //     weight: number;
    //     difficulty: number;
    //     evaluationAchievementPersonalSub: {
    //       evaluationDecision: string;
    //       degree: string;
    //       achievementId: number;
    //       point: string;
    //     }[];
    //   }[],
    // ) => {
    //   setClone({
    //     isOpen: true,
    //     evaluationGoalList: data as goalsPastEvaluation[],
    //     title: t('IDS_TITLE_COPY_PERSONAL_GOAL'),
    //     type: 1,
    //   });
    // };

    // const errorCallBack = (isLoading: boolean) => {
    //   setLoading(isLoading);
    // };
    // await userEvaluationApiService.goalsPastEvaluation(
    //   { year: Number(dayjs().format('YYYY')), periodIndex: 1, type: 1 },
    //   callBack,
    //   errorCallBack,
    // );
  };

  return (
    <div>
      {/* Header Tab */}
      {/*  */}
      <div>
        <Typography.Title level={4}>
          <span>{!isDisplayUserEvaluator ? t('IDS_ACHIEVEMENT_PERSONAL') : t('IDS_PERSONAL_RESULT')}</span>
          <Tooltip
            title={t(
              isEvaluatorUser && [0, 1, 2].includes(statusEvaluation)
                ? 'IDS_TOOLTIP_REQUIRED_INPUT_INDEX_EXPLANATION'
                : 'IDS_TOOLTIP_CHECK_INPUT_INDEX_EXPLANATION',
            )}
            overlayInnerStyle={{ fontSize: '11px' }}
          >
            <Icon
              component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
              style={{ cursor: 'default', paddingLeft: 4 }}
            />
          </Tooltip>
        </Typography.Title>
        {/*  */}
        <Button
          className="button-normal"
          type="primary"
          size="middle"
          onClick={goalPastAchievement}
          hidden={isHiddenButtonUserCreateContent || isHiddenButtonEvaluator}
          loading={isLoading || storeLoading.isLoading || storeLoading.isDetailLoading}
          style={{ marginBottom: '10px' }}
        >
          {t('IDS_BUTTON_COPY_PERSONAL_GOAL')}
        </Button>
      </div>
      {/*  */}
      {/* Table */}
      {isDisplayUserEvaluator ? renderExpandedTable() : renderExpandedTableAchievementSub()}
      {/* {renderExpandedTableAchievementSub()} */}
      {/* Button */}
      <Button
        className="button-normal"
        type="primary"
        size="middle"
        onClick={addNewRow}
        style={{ marginTop: 10, marginRight: 8 }}
        loading={isLoading || storeLoading.isLoading || storeLoading.isDetailLoading}
        hidden={isHiddenButtonUserCreateContent || isHiddenButtonEvaluator}
      >
        {t('IDS_BUTTON_ADD')}
      </Button>
      <Modal
        title={<Typography.Title level={4}>{t('IDS_EVALUATION_JUDGMENT_INDEX')}</Typography.Title>}
        open={popup.isOpen}
        maskClosable={false}
        destroyOnClose={true}
        width="calc(100vw - 100px)"
        style={{ top: 20 }}
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', maxWidth: 'calc(100vw - 50px)' }}
        footer={[
          <div style={{ textAlign: 'right' }} key={'Modal-open-key-1'}>
            <Button className="cancel_button" onClick={() => setOpenPopup({ isOpen: false, childrens: [] })}>
              {t('IDS_BUTTON_CLOSE')}
            </Button>
          </div>,
        ]}
        onCancel={() => setOpenPopup({ isOpen: false, childrens: [] })}
      >
        {renderAchievementSub(popup.childrens, '1', 2)}
      </Modal>
      {/* Modal Approvate */}
      {/* Popup copy personal goal */}
      <PopupGoalPersonalHaveSkill
        evaluationGoalList={clone.evaluationGoalList}
        isOpen={clone.isOpen}
        title={clone.title}
        setClone={setClone}
        t={t}
        type={clone.type}
        setDataState={setDataSource}
        dataStates={dataSources}
        setExpandedRowKey={setExpandedRowKey}
        achievementSubs={achievementSubs}
        evaluationPeriodId={evaluationData.evaluationPeriod.id}
        setPersonalGoalsList={setPersonalGoalsList}
      />
    </div>
  );
};

export default AchievementPersonalTab;
