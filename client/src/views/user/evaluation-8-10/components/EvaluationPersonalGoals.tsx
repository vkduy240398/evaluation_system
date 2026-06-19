import { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import TableCustomComponent from '../../../../@core/components/table-custom/TableCustomComponent';
import { Table } from 'antd/lib';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { statusEvaluationType } from '../../../../common/status';
import {
  EvaluationInfo,
  EvaluationPersonalAchievementOfUser,
  EvaluatorInfo,
  SettingAchievementPersonal,
  SubListNew,
} from '../interfaces/response.interface';
import PersonalCreationGoalsColumns from './PersonalCreationGoalsColumns';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { Button, Form, Grid, message, Select, Space, Tooltip, Typography } from 'antd';
import EvaluationPersonalGoalsColumns from './EvaluationPersonalGoalsColumns';
import Icon, { InfoCircleOutlined, ProfileOutlined } from '@ant-design/icons';
import PopupPointDescription from '../PopupPointDescription';
import ModalPopup from '../../../../common/ModalPopup';
import { MetaModal } from '../../../../model/MetalModel';
import { validateTarget } from './valildateInputField';
import {
  evaluatorTotalPointPersonalGoals05,
  evaluatorTotalPointPersonalGoals1,
  evaluatorTotalPointPersonalGoals2,
  userEvaluationPersonalGoalsList,
  userTotalPointPersonalGoals,
} from '../../../../store/total';
import { useDispatch } from 'react-redux';
import TextArea from 'antd/es/input/TextArea';
import { goalsPastEvaluation } from '../../../../page/user/interfaces/interfacesProps';
import PopupPersonalGoal810 from '../../evaluation/PopupPersonalGoal810';
import userEvaluationApiService from '../../../../common/api/userEvaluation';
import dayjs from 'dayjs';
interface Props {
  isF5?: boolean;
  level: number;
  isNoSkill?: boolean;
  statusEvaluation: statusEvaluationType;
  openNotification: (placement: NotificationPlacement, mesage: string) => void;
  form: any;
  listPersonalGoals: EvaluationPersonalAchievementOfUser[];
  role: string;
  isEvaluationDate: boolean;
  isGoalDate: boolean;
  isDisable: boolean;
  listEvalutors: EvaluatorInfo[];
  allowSeeList: EvaluatorInfo[];
  maxOrder: string;
  setPersonalGoalsList?: any;
  evaluationId?: number;
  settingAchievementPersonalType3s: SettingAchievementPersonal[];
  settingAchievementPersonalType4s: SettingAchievementPersonal[];
  location: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  evaluationData: EvaluationInfo;
}
const EvaluationPersonalGoals = React.memo((props: Props) => {
  const {
    isDisable,
    isEvaluationDate,
    isGoalDate,
    allowSeeList,
    form,
    listEvalutors,
    listPersonalGoals,
    maxOrder,
    role,
    statusEvaluation,
    setPersonalGoalsList,
    evaluationId,
    settingAchievementPersonalType3s,
    settingAchievementPersonalType4s,
    location,
    setLoading,
    isLoading,
    evaluationData,
  } = props;
  const store = useSelector((state: RootState) => state.calculateTotal);
  const storeLoading = useSelector((state: RootState) => state.loading);
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

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [modalPersonalGoals, setModalPersonalGoal] = useState({
    type: '',
    record: {},
    title: '',
    isOpen: false,
  } as MetaModal);
  const [dataSubTemps, setDataSubTemps] = useState<SubListNew[]>([]);

  const columnsCreationPersonalGoals = PersonalCreationGoalsColumns({
    allowSeeList,
    form,
    isDisable,
    isEvaluationDate,
    isGoalDate,
    listEvalutors,
    listPersonalGoals,
    maxOrder,
    role,
    status: statusEvaluation,
    store,
    setPersonalGoalsList,
    settingAchievementPersonalType3s,
    settingAchievementPersonalType4s,
  });

  // =======================================================================
  const handleTotalUser = () => {
    const evaluationPersonalGoals =
      form.getFieldsValue(['personalGoals']) && form.getFieldsValue(['personalGoals']).personalGoals !== undefined
        ? form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined)
        : ([] as any[]);
    const pointUserList = evaluationPersonalGoals
      .map((v: any) => {
        return {
          difficultyUser: v.difficultyUser,
          pointUser: v.pointUser,
          weight: v.weight,
        };
      })
      .filter((obj: any) => {
        return (
          obj.difficultyUser !== null &&
          obj.difficultyUser !== undefined &&
          obj.pointUser !== null &&
          obj.pointUser !== undefined &&
          obj.pointUser !== '' &&
          !isNaN(Number(obj.pointUser))
        );
      });

    const totalPoint = pointUserList.reduce((acc: any, curr: any) => {
      if (
        curr.pointUser !== null &&
        curr.pointUser !== undefined &&
        curr.difficultyUser !== null &&
        curr.difficultyUser !== undefined &&
        !isNaN(Number(curr.pointUser))
      ) {
        return acc + Number(curr.pointUser) * Number(curr.difficultyUser) * (Number(curr.weight) / 100);
      }

      return acc;
    }, 0);

    return evaluationPersonalGoals.map((v: any) => v.pointUser).filter((v: any) => v !== null).length > 0 &&
      Object.keys(pointUserList).length > 0
      ? Math.round(totalPoint)
      : null;
  };

  const handleTotalEvaluator05 = () => {
    const evaluationPersonalGoals =
      form.getFieldsValue(['personalGoals']) && form.getFieldsValue(['personalGoals']).personalGoals !== undefined
        ? form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined)
        : ([] as any[]);
    const pointEvaluator05List = evaluationPersonalGoals
      .map((v: any) => {
        return {
          difficultyEvaluator05: v.difficultyEvaluator05,
          pointEvaluator05: v.pointEvaluator05,
          weight: v.weight,
        };
      })
      .filter((obj: any) => {
        return (
          obj.difficultyEvaluator05 !== null &&
          obj.difficultyEvaluator05 !== undefined &&
          obj.pointEvaluator05 !== null &&
          obj.pointEvaluator05 !== undefined &&
          obj.pointEvaluator05 !== '' &&
          obj.difficultyEvaluator05 !== '' &&
          obj.pointEvaluator05 !== '' &&
          !isNaN(Number(obj.pointEvaluator05))
        );
      });

    const totalPoint = pointEvaluator05List.reduce((acc: any, curr: any) => {
      if (
        curr.pointEvaluator05 !== null &&
        curr.pointEvaluator05 !== undefined &&
        curr.difficultyEvaluator05 !== null &&
        curr.difficultyEvaluator05 !== undefined &&
        !isNaN(Number(curr.pointEvaluator05))
      ) {
        return acc + Number(curr.pointEvaluator05) * Number(curr.difficultyEvaluator05) * (Number(curr.weight) / 100);
      }

      return acc;
    }, 0);

    return evaluationPersonalGoals.map((v: any) => v.pointEvaluator05).filter((v: any) => v !== null).length > 0 &&
      Object.keys(pointEvaluator05List).length > 0
      ? Math.round(totalPoint)
      : null;
  };

  const handleTotalEvaluator1 = () => {
    const evaluationPersonalGoals =
      form.getFieldsValue(['personalGoals']) && form.getFieldsValue(['personalGoals']).personalGoals !== undefined
        ? form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined)
        : ([] as any[]);
    const pointEvaluator1List = evaluationPersonalGoals
      .map((v: any) => {
        return {
          difficultyEvaluator1: v.difficultyEvaluator1,
          pointEvaluator1: v.pointEvaluator1,
          weight: v.weight,
        };
      })
      .filter((obj: any) => {
        return (
          obj.difficultyEvaluator1 !== null &&
          obj.difficultyEvaluator1 !== undefined &&
          obj.pointEvaluator1 !== null &&
          obj.pointEvaluator1 !== undefined &&
          obj.pointEvaluator1 !== '' &&
          obj.difficultyEvaluator1 !== '' &&
          obj.pointEvaluator1 !== '' &&
          !isNaN(Number(obj.pointEvaluator1))
        );
      });

    const totalPoint = pointEvaluator1List.reduce((acc: any, curr: any) => {
      if (
        curr.pointEvaluator1 !== null &&
        curr.pointEvaluator1 !== undefined &&
        curr.difficultyEvaluator1 !== null &&
        curr.difficultyEvaluator1 !== undefined &&
        !isNaN(Number(curr.pointEvaluator1))
      ) {
        return acc + Number(curr.pointEvaluator1) * Number(curr.difficultyEvaluator1) * (Number(curr.weight) / 100);
      }

      return acc;
    }, 0);

    return evaluationPersonalGoals.map((v: any) => v.pointEvaluator1).filter((v: any) => v !== null).length > 0 &&
      Object.keys(pointEvaluator1List).length > 0
      ? Math.round(totalPoint)
      : null;
  };

  const handleTotalEvaluator2 = () => {
    const evaluationPersonalGoals =
      form.getFieldsValue(['personalGoals']) && form.getFieldsValue(['personalGoals']).personalGoals !== undefined
        ? form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined)
        : ([] as any[]);
    const pointEvaluator2List = evaluationPersonalGoals
      .map((v: any) => {
        return {
          difficultyEvaluator2: v.difficultyEvaluator2,
          pointEvaluator2: v.pointEvaluator2,
          weight: v.weight,
        };
      })
      .filter((obj: any) => {
        return (
          obj.difficultyEvaluator2 !== null &&
          obj.difficultyEvaluator2 !== undefined &&
          obj.pointEvaluator2 !== null &&
          obj.pointEvaluator2 !== undefined &&
          obj.pointEvaluator2 !== '' &&
          obj.difficultyEvaluator2 !== '' &&
          obj.pointEvaluator2 !== '' &&
          !isNaN(Number(obj.pointEvaluator2))
        );
      });

    const totalPoint = pointEvaluator2List.reduce((acc: any, curr: any) => {
      if (
        curr.pointEvaluator2 !== null &&
        curr.pointEvaluator2 !== undefined &&
        curr.difficultyEvaluator2 !== null &&
        curr.difficultyEvaluator2 !== undefined &&
        !isNaN(Number(curr.pointEvaluator2))
      ) {
        return acc + Number(curr.pointEvaluator2) * Number(curr.difficultyEvaluator2) * (Number(curr.weight) / 100);
      }

      return acc;
    }, 0);

    return evaluationPersonalGoals.map((v: any) => v.pointEvaluator2).filter((v: any) => v !== null).length > 0 &&
      Object.keys(pointEvaluator2List).length > 0
      ? Math.round(totalPoint)
      : null;
  };

  // =======================================================================
  const columnsExpandsCreationPersonalGoals = ({ indexSub }: { indexSub: number }) => {
    return [
      {
        title: t('IDS_EVALUATION_JUDGMENT_INDEX'),
        dataIndex: 'evaluationDecision',
        key: 'evaluationDecision',
        render(value, record, index) {
          return (
            <>
              {(role === 'user' && (![0, 1, 2].includes(statusEvaluation) || !isGoalDate)) ||
              role === 'evaluator' ||
              role === 'admin' ||
              store.isDisable ? (
                <>
                  <Form.Item
                    name={['personalGoals', indexSub, 'evaluationAchievementPersonalSub', index, 'evaluationDecision']}
                    style={{ display: 'inline-block', marginBottom: 0, height: '0px' }}
                  ></Form.Item>
                  <Text style={{ whiteSpace: 'pre-wrap' }}>{value}</Text>
                </>
              ) : (
                <Form.Item
                  name={['personalGoals', indexSub, 'evaluationAchievementPersonalSub', index, 'evaluationDecision']}
                  style={{ textAlign: 'left', marginBottom: '0px' }}
                  rules={[
                    {
                      validator(_rule: any, value: string) {
                        return validateTarget(value, 1000);
                      },
                    },
                  ]}
                >
                  <TextArea
                    name={`evaluationDecision${record.itemNo}`}
                    maxLength={1001}
                    size="middle"
                    autoSize={{ minRows: 1, maxRows: 100 }}
                    onChange={() => {}}
                  />
                </Form.Item>
              )}
            </>
          );
        },
      },
      {
        title: t('IDS_DEGREE'),
        dataIndex: 'coefficient',
        align: 'left',
        width: 100,
        render(value, record, index) {
          return (
            <>
              <Form.Item
                style={{ display: 'inline-block', marginBottom: 0, height: '0px' }}
                name={['personalGoals', indexSub, 'evaluationAchievementPersonalSub', index, 'coefficient']}
              ></Form.Item>
              <Text style={{ whiteSpace: 'pre-wrap', display: 'inline-block' }}>{record.degree}</Text>
            </>
          );
        },
      },
    ] as ColumnsType<any>;
  };
  const RenderExpandTable = (record: any, index: number) => {
    return (
      <TableCustomComponent
        dataSources={record}
        columns={columnsExpandsCreationPersonalGoals({
          indexSub: index,
        })}
      />
    );
  };

  const { Text } = Typography;

  const comment05Infos = listEvalutors.filter((item: EvaluatorInfo) => {
    return item.evaluationOrder === '0.5';
  });
  const comment1Infos = listEvalutors.filter((item: EvaluatorInfo) => {
    return item.evaluationOrder === '1.0';
  });
  const comment2Infos = listEvalutors.filter((item: EvaluatorInfo) => {
    return item.evaluationOrder === '2.0';
  });
  let isDisplay05: number | boolean = role === 'admin' && comment05Infos.length;
  let isDisplay1: number | boolean = role === 'admin' && comment1Infos.length;
  let isDisplay2: number | boolean = role === 'admin' && comment2Infos.length;
  allowSeeList.forEach((item: EvaluatorInfo) => {
    if (item.evaluationOrder === '0.5') isDisplay05 = true;
    if (item.evaluationOrder === '1.0') isDisplay1 = true;
    if (item.evaluationOrder === '2.0') isDisplay2 = true;
  });
  if (location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 0.5 && comment05Infos.length > 0) {
    isDisplay05 = true;
  }
  if (location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 1 && comment1Infos.length > 0) {
    isDisplay1 = true;
  }
  if (location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 2 && comment2Infos.length > 0) {
    isDisplay2 = true;
  }
  const buffList: string[] = [];
  const evaluator1BuffList: string[] = [];
  const evaluator2BuffList: string[] = [];
  const onCell = () => {
    return { style: { verticalAlign: 'top' } };
  };
  const optionDifficultyList: { label: string; value: number }[] = [];
  for (let index = 0; index < settingAchievementPersonalType3s.length; index++) {
    optionDifficultyList.push({
      label: parseFloat(settingAchievementPersonalType3s[index].point.toString()).toFixed(1),
      value: settingAchievementPersonalType3s[index].point,
    });
  }

  const columnsExpandsCreationPersonalGoalsSubs = ({ subIndex }: { subIndex: number }) => {
    const subEvaluationExpands = [
      {
        title: t('IDS_ACHIEVEMENT_PERSONAL'),
        dataIndex: 'title',
        width: '10%',
        onCell,
        render: (value: string) => {
          return (
            <>
              <Form.Item
                name={['personalGoals', subIndex, 'title']}
                style={{ height: '0px', marginBottom: 0, display: 'inline-block' }}
              ></Form.Item>
              <Text>{value}</Text>
            </>
          );
        },
      },
      {
        title: t('IDS_ACHIEVEMENT_VALUE'),
        dataIndex: 'achievementValue',
        onCell,
        width: '30%',
        render: (value: string) => {
          return (
            <>
              <Form.Item
                name={['personalGoals', subIndex, 'achievementValue']}
                style={{ height: '0px', marginBottom: 0, display: 'inline-block' }}
              ></Form.Item>
              <Text>{value}</Text>
            </>
          );
        },
      },
      {
        title: t('IDS_METHOD'),
        dataIndex: 'method',
        width: '35%',
        onCell,
        render: (value: string) => {
          return (
            <>
              <Form.Item
                name={['personalGoals', subIndex, 'method']}
                style={{ height: '0px', marginBottom: 0, display: 'inline-block' }}
              ></Form.Item>
              <Text>{value}</Text>
            </>
          );
        },
      },
      {
        title: t('IDS_WEIGHT'),
        dataIndex: 'weight',
        width: '5%',
        align: 'center' as const,
        onCell,
        render: (value: string) => {
          return (
            <>
              <Form.Item
                name={['personalGoals', subIndex, 'weight']}
                style={{ height: '0px', marginBottom: 0, display: 'inline-block' }}
              ></Form.Item>
              <Text>{value}</Text>
            </>
          );
        },
      },
      {
        title: (
          <>
            {t('IDS_EVALUATION_JUDGMENT_INDEX_TITLE')}
            <Tooltip
              title={t('IDS_EVALUATION_JUDGMENT_INDEX_TOOLTIP') as string}
              color="#424242"
              overlayInnerStyle={{ fontSize: '11px' }}
            >
              <Icon
                component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                style={{ cursor: 'default', paddingLeft: 2 }}
              />
            </Tooltip>
          </>
        ),
        dataIndex: ' ',
        width: '5%',
        align: 'center' as const,
        onCell,
        render: (value: any, record: any) => {
          return (
            <>
              <ProfileOutlined
                style={{ color: '#007240 ', fontSize: 25, marginTop: 2 }}
                onClick={() => {
                  const tempList: SubListNew[] = [];
                  let count = 0;
                  record.evaluationAchievementPersonalSub.forEach((item: SubListNew) => {
                    tempList.push({
                      key: count,
                      achievementPersonalId: item.achievementPersonalId,
                      coefficient: item.coefficient,
                      evaluationDecision: item.evaluationDecision,
                      parentKey: item.parentKey,
                      degree: item.degree,
                    });
                    count++;
                  });
                  setModalPersonalGoal({
                    title: t('IDS_EVALUATION_JUDGMENT_INDEX'),
                    isOpen: true,
                    record: tempList,
                    type: 'add',
                  });
                  setDataSubTemps(tempList);
                }}
              />
            </>
          );
        },
      },
      {
        title: (
          <>
            {t('IDS_DIFFICULTY')}
            <Tooltip
              title={t('IDS_TOOLTIP_COEFFICIENT_EXPLANATION') as string}
              color="#424242"
              overlayInnerStyle={{ fontSize: '11px' }}
            >
              <Icon
                component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                style={{ cursor: 'default', paddingLeft: 2 }}
              />
            </Tooltip>
          </>
        ),
        dataIndex: 'difficulty',
        width: '10%',
        children: [
          {
            title: t('IDS_POINT_USER'),
            dataIndex: 'difficultyUser',
            key: 'difficultyUser',
            width: '60px',
            align: 'center' as const,
            onCell,
            render(value: any) {
              return (
                <>
                  <Form.Item
                    name={['personalGoals', subIndex, 'difficultyUser']}
                    style={{ height: '0px', marginBottom: 0, display: 'inline-block' }}
                  ></Form.Item>
                  <Text>{value ? Number(value).toFixed(1) : null}</Text>
                </>
              );
            },
          },
          {
            title: t('IDS_EVALUATOR_0_5'),
            dataIndex: 'difficultyEvaluator05',
            key: 'difficultyEvaluator05',
            width: '60px',
            align: 'center' as const,
            onCell,
            render(value: any, record: any) {
              return (
                <>
                  {!(
                    isDisplay05 &&
                    [54, 55].includes(statusEvaluation) &&
                    isEvaluationDate &&
                    maxOrder === '0.5' &&
                    role !== 'admin'
                  ) ? (
                    <Form.Item name={['personalGoals', subIndex, 'difficultyEvaluator05']}>
                      <Text>{value ? Number(value).toFixed(1) : null}</Text>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name={['personalGoals', subIndex, 'difficultyEvaluator05']}
                      initialValue={
                        record.difficultyEvaluator05 ? parseFloat(record.difficultyEvaluator05).toFixed(1) : null
                      }
                      rules={[
                        {
                          required: true,
                          message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
                        },
                      ]}
                    >
                      <Select
                        id="difficultyEvaluator05"
                        onChange={(e) => {
                          const filterPersonalForms =
                            form.getFieldsValue(['personalGoals']) &&
                            form.getFieldsValue(['personalGoals']).personalGoals !== undefined
                              ? form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined)
                              : [];
                          filterPersonalForms[subIndex].difficultyEvaluator05 =
                            e !== '' && !isNaN(Number(e)) ? Number(e) : e;
                          dispatch(evaluatorTotalPointPersonalGoals05(handleTotalEvaluator05()));
                        }}
                        options={optionDifficultyList}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        style={{ display: 'absolute' }}
                      />
                    </Form.Item>
                  )}
                </>
              );
            },
          },

          {
            title: t('IDS_POINT_EVALUATOR_1'),
            dataIndex: 'difficultyEvaluator1',
            key: 'difficultyEvaluator1',
            width: '60px',
            align: 'center' as const,
            onCell,
            render(value: any, record: any) {
              return (
                <>
                  {!(
                    isDisplay1 &&
                    [57, 58].includes(statusEvaluation) &&
                    isEvaluationDate &&
                    maxOrder === '1.0' &&
                    role !== 'admin'
                  ) ? (
                    <Form.Item name={['personalGoals', subIndex, 'difficultyEvaluator1']}>
                      <Text>
                        {record.difficultyEvaluator1 ? parseFloat(record.difficultyEvaluator1).toFixed(1) : null}
                      </Text>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name={['personalGoals', subIndex, 'difficultyEvaluator1']}
                      initialValue={
                        record.difficultyEvaluator1 ? parseFloat(record.difficultyEvaluator1).toFixed(1) : null
                      }
                      rules={[
                        {
                          required: true,
                          message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
                        },
                      ]}
                    >
                      <Select
                        id="difficultyEvaluator1"
                        onChange={(e) => {
                          const filterPersonalForms =
                            form.getFieldsValue(['personalGoals']) &&
                            form.getFieldsValue(['personalGoals']).personalGoals !== undefined
                              ? form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined)
                              : [];
                          filterPersonalForms[subIndex].difficultyEvaluator1 =
                            e !== '' && !isNaN(Number(e)) ? Number(e) : e;

                          dispatch(evaluatorTotalPointPersonalGoals1(handleTotalEvaluator1()));
                        }}
                        options={optionDifficultyList}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        style={{ display: 'absolute' }}
                      />
                    </Form.Item>
                  )}
                </>
              );
            },
          },

          {
            title: t('IDS_POINT_EVALUATOR_2'),
            dataIndex: 'difficultyEvaluator2',
            key: 'difficultyEvaluator2',
            width: '60px',
            align: 'center' as const,
            onCell,
            render(value: any, record: any) {
              return (
                <>
                  {!(
                    isDisplay2 &&
                    [60, 61].includes(statusEvaluation) &&
                    isEvaluationDate &&
                    maxOrder === '2.0' &&
                    role !== 'admin'
                  ) ? (
                    <Form.Item name={['personalGoals', subIndex, 'difficultyEvaluator2']}>
                      <Text>
                        {record.difficultyEvaluator2 ? parseFloat(record.difficultyEvaluator2).toFixed(1) : null}
                      </Text>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name={['personalGoals', subIndex, 'difficultyEvaluator2']}
                      initialValue={
                        record.difficultyEvaluator2 ? parseFloat(record.difficultyEvaluator2).toFixed(1) : null
                      }
                      rules={[
                        {
                          required: true,
                          message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
                        },
                      ]}
                    >
                      <Select
                        id="difficultyEvaluator2"
                        onChange={(e) => {
                          const filterPersonalForms =
                            form.getFieldsValue(['personalGoals']) &&
                            form.getFieldsValue(['personalGoals']).personalGoals !== undefined
                              ? form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined)
                              : [];
                          filterPersonalForms[subIndex].difficultyEvaluator2 =
                            e !== '' && !isNaN(Number(e)) ? Number(e) : e;
                          dispatch(evaluatorTotalPointPersonalGoals2(handleTotalEvaluator2()));
                        }}
                        options={optionDifficultyList}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        style={{ display: 'absolute' }}
                      />
                    </Form.Item>
                  )}
                </>
              );
            },
          },
        ],
      },
    ].filter((v) => {
      if (role === 'user' && !store.isDisable) {
        if ([0, 1, 2].includes(statusEvaluation) && isGoalDate) {
          const temps = v.children?.filter((item: any) => {
            if (item.key === 'difficultyUser') return item;
          });
          v.children = temps;

          return (
            v.dataIndex !== 'difficultyEvaluator2' &&
            v.dataIndex !== 'difficultyEvaluator1' &&
            v.dataIndex !== 'difficultyEvaluator05' &&
            v.dataIndex !== 'description'
          );
        } else if (statusEvaluation < 50 || (statusEvaluation === 50 && !isEvaluationDate)) {
          const temps = v.children?.filter((item: any) => {
            if (item.key === 'difficultyUser') return item;
          });
          v.children = temps;

          return (
            v.dataIndex !== 'difficultyEvaluator2' &&
            v.dataIndex !== 'difficultyEvaluator1' &&
            v.dataIndex !== 'difficultyEvaluator05' &&
            v.dataIndex !== 'description' &&
            v.dataIndex !== 'action'
          );
        } else if (statusEvaluation < 100) {
          const temps = v.children?.filter((item: any) => {
            if (item.dataIndex === 'difficultyUser') return item;
          });
          v.children = temps;

          return (
            v.dataIndex !== 'difficultyEvaluator2' &&
            v.dataIndex !== 'difficultyEvaluator1' &&
            v.dataIndex !== 'difficultyEvaluator05' &&
            v.dataIndex !== 'action'
          );
        } else {
          if (!comment05Infos[0]) evaluator2BuffList.push('difficultyEvaluator05');
          if (!comment1Infos[0]) evaluator2BuffList.push('difficultyEvaluator1');
          if (!comment2Infos[0]) evaluator2BuffList.push('difficultyEvaluator2');
          const temps = v.children?.filter((item: any) => {
            if (!evaluator2BuffList.includes(item.dataIndex)) return item;
          });
          v.children = temps;

          return !evaluator2BuffList.includes(v.dataIndex) && v.dataIndex !== 'action';
        }
      } else {
        if (statusEvaluation < 50 || (statusEvaluation === 50 && !isEvaluationDate)) {
          const temps = v.children?.filter((item: any) => {
            if (item.key === 'difficultyUser') return item;
          });
          v.children = temps;

          return (
            v.dataIndex !== 'difficultyEvaluator2' &&
            v.dataIndex !== 'difficultyEvaluator1' &&
            v.dataIndex !== 'difficultyEvaluator05' &&
            v.dataIndex !== 'description' &&
            v.dataIndex !== 'action'
          );
        }
        if (statusEvaluation < 100) {
          if (!isDisplay05 || (isDisplay05 && statusEvaluation < 54)) buffList.push('difficultyEvaluator05');
          if (!isDisplay1 || (isDisplay1 && statusEvaluation < 57)) buffList.push('difficultyEvaluator1');
          if (!isDisplay2 || (isDisplay2 && statusEvaluation < 60)) buffList.push('difficultyEvaluator2');
          const temps = v.children?.filter((item: any) => {
            if (!buffList.includes(item.dataIndex)) return item;
          });
          v.children = temps;

          return !buffList.includes(v.dataIndex) && v.dataIndex !== 'action';
        } else {
          if (!comment05Infos[0]) evaluator1BuffList.push('difficultyEvaluator05');
          if (!comment1Infos[0]) evaluator1BuffList.push('difficultyEvaluator1');
          if (!comment2Infos[0]) evaluator1BuffList.push('difficultyEvaluator2');
          const temps = v.children?.filter((item: any) => {
            if (!evaluator1BuffList.includes(item.dataIndex)) return item;
          });
          v.children = temps;

          return !evaluator1BuffList.includes(v.dataIndex) && v.dataIndex !== 'action';
        }
      }
    }) as ColumnsType<any>;

    return subEvaluationExpands;
  };
  const getFormModal = () => {
    return <PopupPointDescription dataSubTemps={dataSubTemps} />;
  };
  const RenderExpandTablePersonalSubs = (record: any, index: number) => {
    const arrays = record;

    return (
      <Table
        dataSource={[arrays]}
        columns={columnsExpandsCreationPersonalGoalsSubs({
          subIndex: index,
        })}
        bordered
        size="small"
        style={{ wordBreak: 'break-all' }}
        pagination={false}
      />
    );
  };

  const columnsEvaluationGoals = EvaluationPersonalGoalsColumns({
    allowSeeList,
    form,
    isDisable,
    isEvaluationDate,
    isGoalDate,
    listEvalutors,
    listPersonalGoals,
    maxOrder,
    role,
    status: statusEvaluation,
    store,
    setPersonalGoalsList,
    handleTotalUser,
    handleTotalEvaluator05,
    handleTotalEvaluator1,
    handleTotalEvaluator2,
    location,
  });
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]);

  const onExpand = (expanded: any, record: any) => {
    const newExpandedRowKeys: any = expanded
      ? [...expandedRowKeys, record.key] // Adding the expanded row key
      : expandedRowKeys.filter((key) => key !== record.key); // Removing the collapsed row key

    setExpandedRowKeys(newExpandedRowKeys); // Updating the state
  };
  useEffect(() => {
    const listExpandRowKeys: any[] = [];
    listPersonalGoals.map((v) => {
      listExpandRowKeys.push(v.key);
    });
    setExpandedRowKeys(listExpandRowKeys);

    // ===============================================================================================

    form.setFieldsValue({
      personalGoals: listPersonalGoals.map((item) => ({
        achievementStatus:
          item.achievementStatus !== undefined && item.achievementStatus !== null ? item.achievementStatus : null,
        reasonComment: item.reasonComment,
        actionPlan: item.actionPlan,

        pointUser: item.pointUser !== undefined && item.pointUser !== null ? item.pointUser : null,
        pointEvaluator05:
          item.pointEvaluator05 !== undefined && item.pointEvaluator05 !== null ? item.pointEvaluator05 : null,
        pointEvaluator1:
          item.pointEvaluator1 !== undefined && item.pointEvaluator1 !== null ? item.pointEvaluator1 : null,
        pointEvaluator2:
          item.pointEvaluator2 !== undefined && item.pointEvaluator2 !== null ? item.pointEvaluator2 : null,

        difficultyEvaluator05:
          item.difficultyEvaluator05 !== undefined && item.difficultyEvaluator05 !== null
            ? Number(item.difficultyEvaluator05).toFixed(1)
            : null,
        difficultyEvaluator1:
          item.difficultyEvaluator1 !== undefined && item.difficultyEvaluator1 !== null
            ? Number(item.difficultyEvaluator1).toFixed(1)
            : null,
        difficultyEvaluator2:
          item.difficultyEvaluator2 !== undefined && item.difficultyEvaluator2 !== null
            ? Number(item.difficultyEvaluator2).toFixed(1)
            : null,
        difficultyUser:
          item.difficultyUser !== undefined && item.difficultyUser !== null
            ? Number(item.difficultyUser).toFixed(1)
            : null,

        title: item.title,
        achievementValue: item.achievementValue,
        method: item.method,
        weight: item.weight !== undefined && item.weight !== null ? item.weight : null,
        evaluationAchievementPersonalSub: item.evaluationAchievementPersonalSub.map((subItem) => ({
          evaluationDecision: subItem.evaluationDecision,
          coefficient: subItem.coefficient,
          degree: subItem.degree,
        })),
      })),
    });

    // ===============================================================================================
    if (statusEvaluation < 98) {
      dispatch(userTotalPointPersonalGoals(handleTotalUser()));
      dispatch(evaluatorTotalPointPersonalGoals05(handleTotalEvaluator05()));
      dispatch(evaluatorTotalPointPersonalGoals1(handleTotalEvaluator1()));
      dispatch(evaluatorTotalPointPersonalGoals2(handleTotalEvaluator2()));
    }
  }, [listPersonalGoals]);

  const addNewItems = () => {
    const filterPersonalForms =
      form.getFieldsValue(['personalGoals']) &&
      form.getFieldsValue(['personalGoals']).personalGoals !== undefined &&
      form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined);
    const dataList = [...listPersonalGoals];
    const dataListNews = dataList.map((v, i) => {
      return {
        ...v,
        key: i,
        achievementValue:
          filterPersonalForms[i].achievementValue !== undefined
            ? filterPersonalForms[i].achievementValue
            : v.achievementValue,
        difficultyUser:
          filterPersonalForms[i].difficultyUser !== undefined
            ? filterPersonalForms[i].difficultyUser
            : v.difficultyUser,
        method: filterPersonalForms[i].method !== undefined ? filterPersonalForms[i].method : v.method,
        title: filterPersonalForms[i].title !== undefined ? filterPersonalForms[i].title : v.title,
        weight: filterPersonalForms[i].weight !== undefined ? filterPersonalForms[i].weight : v.weight,
        evaluationAchievementPersonalSub: v.evaluationAchievementPersonalSub.map((subItem, index) => ({
          ...subItem,
          evaluationDecision:
            filterPersonalForms[i].evaluationAchievementPersonalSub[index].evaluationDecision ||
            subItem.evaluationDecision,
        })),
      };
    }) as EvaluationPersonalAchievementOfUser[];

    if (dataListNews.length < 10) {
      const temps: SubListNew[] = [];
      for (let index = 0; index < settingAchievementPersonalType4s.length; index++) {
        temps.push({
          key: index,
          evaluationDecision: '',
          coefficient: Number(settingAchievementPersonalType4s[index].point.toString()).toFixed(1),
          parentKey: listPersonalGoals.length,
          type: 2,
          evaluationId: evaluationId,
          degree: settingAchievementPersonalType4s[index].note,
        });
      }

      dataListNews.push({
        key: dataListNews.length > 0 ? dataListNews[dataListNews.length - 1].key + 1 : 0,
        itemNo: dataListNews.length > 0 ? dataListNews[dataListNews.length - 1].itemNo + 1 : 0,
        evaluationAchievementPersonalSub: temps,
        type: 2,
        evaluationId: evaluationId,
      });

      setExpandedRowKeys([...dataListNews.map((v) => v.key)]);
      setPersonalGoalsList && setPersonalGoalsList(dataListNews);
      dispatch(userEvaluationPersonalGoalsList(dataListNews));
    } else message.warning(t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', `${10}`));
  };
  const filterPersonalForms =
    form.getFieldsValue(['personalGoals']) &&
    form.getFieldsValue(['personalGoals']).personalGoals !== undefined &&
    form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined);
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
    <>
      {/*  */}
      <div>
        <Typography.Title level={4}>
          <span>
            {statusEvaluation < 50 || (statusEvaluation === 50 && !isEvaluationDate)
              ? t('IDS_ACHIEVEMENT_PERSONAL')
              : t('IDS_PERSONAL_RESULT')}
          </span>
        </Typography.Title>
        {/*  */}
        <Button
          className="button-normal"
          type="primary"
          size="middle"
          loading={storeLoading.isDetailLoading || storeLoading.isLoading || isLoading}
          hidden={
            !(role === 'user' && [0, 1, 2].includes(statusEvaluation)) ||
            !isGoalDate ||
            ![0, 1, 2].includes(statusEvaluation)
          }
          onClick={goalPastAchievement}
          style={{ marginBottom: '10px' }}
        >
          {t('IDS_BUTTON_COPY_PERSONAL_GOAL')}
        </Button>
      </div>
      {/*  */}
      {(statusEvaluation < 50 || (statusEvaluation === 50 && !isEvaluationDate)) && (
        <Form form={form}>
          <Table
            size="small"
            style={{ wordBreak: 'break-all' }}
            dataSource={listPersonalGoals}
            columns={columnsCreationPersonalGoals}
            onRow={(data) => data.itemNo}
            pagination={false}
            loading={storeLoading.isDetailLoading || isLoading}
            expandable={{
              defaultExpandAllRows: true,
              expandedRowClassName: () => 'table-expanded-custom',
              expandedRowRender: (record, index) => {
                return record.evaluationAchievementPersonalSub ? (
                  RenderExpandTable(record.evaluationAchievementPersonalSub, index)
                ) : (
                  <></>
                );
              },
              rowExpandable: (record) => {
                return record.achievementStatus !== t('IDS_SUB_TOTAL');
              },
              onExpand,
              expandedRowKeys: expandedRowKeys,
            }}
            bordered
            locale={{
              emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
            }}
            scroll={{ x: screens.sm || screens.xs ? 1100 : undefined }}
          />
          {role === 'user' && [0, 1, 2].includes(statusEvaluation) && isGoalDate && !store.isDisable && (
            <Button
              className="button-normal"
              type="primary"
              size="middle"
              style={{ marginTop: 10 }}
              disabled={store.isDisable}
              onClick={addNewItems}
              loading={storeLoading.isDetailLoading}
            >
              {t('IDS_BUTTON_ADD')}
            </Button>
          )}
        </Form>
      )}
      <PopupPersonalGoal810
        dataStates={listPersonalGoals}
        evaluationGoalList={clone.evaluationGoalList}
        isOpen={clone.isOpen}
        setClone={setClone}
        setDataState={setPersonalGoalsList}
        setExpandedRowKey={setExpandedRowKeys}
        title={clone.title}
        t={t}
        type={clone.type}
        filterPersonalForms={filterPersonalForms}
        dataSubTemps={settingAchievementPersonalType4s}
        evaluationId={evaluationId}
        evaluationPeriodId={evaluationData.evaluationPeriod.id}
      />
      {(statusEvaluation > 50 || (statusEvaluation === 50 && isEvaluationDate)) && (
        <>
          <Form form={form}>
            <Table
              bordered
              size="small"
              style={{ wordBreak: 'break-all' }}
              dataSource={[...listPersonalGoals]}
              pagination={false}
              columns={columnsEvaluationGoals}
              loading={storeLoading.isDetailLoading}
              expandable={{
                columnWidth: '1%',
                defaultExpandAllRows: true,
                expandedRowClassName: () => 'table-expanded-custom',
                expandedRowRender: (record, index: number) => {
                  return RenderExpandTablePersonalSubs(record, index);
                },
                rowExpandable: (record) => {
                  return record.achievementStatus !== t('IDS_SUB_TOTAL');
                },
                onExpand,
                expandedRowKeys: expandedRowKeys,
              }}
              locale={{
                emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
              }}
              summary={() =>
                listPersonalGoals.length ? (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={4} align="center" className="cell-total">
                        {t('IDS_SUB_TOTAL')}
                      </Table.Summary.Cell>

                      <Table.Summary.Cell index={1} colSpan={1} align="center" className="cell-total">
                        {store.personalGoals !== null ? store.personalGoals : ''}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={1}
                        colSpan={
                          (role !== 'user' && isDisplay05 && statusEvaluation > 53) ||
                          (statusEvaluation == 100 && comment05Infos[0])
                            ? 1
                            : 0
                        }
                        align="center"
                        className="cell-total"
                      >
                        {store.personalGoals05 !== null ? store.personalGoals05 : ''}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={1}
                        colSpan={
                          (role !== 'user' && isDisplay1 && statusEvaluation > 56) ||
                          (statusEvaluation == 100 && comment1Infos[0])
                            ? 1
                            : 0
                        }
                        align="center"
                        className="cell-total"
                      >
                        {store.personalGoal1 !== null ? store.personalGoal1 : ''}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={1}
                        colSpan={
                          (role !== 'user' && isDisplay2 && statusEvaluation > 59) ||
                          (statusEvaluation == 100 && comment2Infos[0])
                            ? 1
                            : 0
                        }
                        align="center"
                        className="cell-total"
                      >
                        {store.personalGoal2 !== null ? store.personalGoal2 : ''}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                ) : (
                  <div></div>
                )
              }
              scroll={{ x: screens.sm || screens.xs ? 1100 : undefined }}
            />
          </Form>

          <ModalPopup
            metaModal={modalPersonalGoals}
            setMetaModal={setModalPersonalGoal}
            FormModal={getFormModal()}
            width="calc(100vw - 100px)"
            bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
            footer={
              <div style={{ textAlign: 'right' }} key={'Modal-open-key-1'}>
                <Button
                  className="cancel_button"
                  onClick={() => setModalPersonalGoal({ ...modalPersonalGoals, isOpen: false })}
                >
                  {t('IDS_BUTTON_CLOSE')}
                </Button>
              </div>
            }
          />
        </>
      )}
    </>
  );
});

export default EvaluationPersonalGoals;
