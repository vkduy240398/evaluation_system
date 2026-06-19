/* eslint-disable @typescript-eslint/naming-convention */
import Icon, { DeleteOutlined, InfoCircleOutlined, ProfileOutlined } from '@ant-design/icons';
import { Button, Input, Select, Tooltip, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { validateDifficulty, validateTarget } from './valildateInputField';
import {
  calculateEvaluator05Total,
  calculateEvaluator1Total,
  calculateEvaluator2Total,
  checkWeight,
  checkWeight2,
} from '../../../../store/total';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { t } from 'i18next';
import {
  EvaluationPersonalAchievement,
  EvaluatorInfo,
  SettingAchievementPersonal,
  SubList,
} from '../interfaces/response.interface';
import { CSSProperties } from 'react';
interface Props {
  dataSource: EvaluationPersonalAchievement[];
  setDataSource: (data: EvaluationPersonalAchievement[]) => void;
  status: number;
  role: string;
  onOpenAddModal: (data: SubList[]) => void;
  Form: any;
  allowSeeList: EvaluatorInfo[];
  maxOrder: string;
  form: any;
  isEvaluationDate: boolean;
  isGoalDate: boolean;
  listEvalutor: EvaluatorInfo[];
  store: any;
  settingAchievementPersonalType1: SettingAchievementPersonal[];
  setDefaultExpandedRowKeys: (data: number[]) => void;
  location: any;
}
const EvaluationGoalDepartmentColumn = (props: Props) => {
  const { Text } = Typography;
  const {
    dataSource,
    status,
    setDataSource,
    role,
    onOpenAddModal,
    Form,
    allowSeeList,
    maxOrder,
    form,
    isEvaluationDate,
    isGoalDate,
    listEvalutor,
    store,
    settingAchievementPersonalType1,
    setDefaultExpandedRowKeys,
    location,
  } = props;

  // const store = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();

  const onCell = () => {
    return { style: { verticalAlign: 'top' } };
  };

  const comment05Info = listEvalutor.filter((item: EvaluatorInfo) => {
    return item.evaluationOrder === '0.5';
  });
  const comment1Info = listEvalutor.filter((item: EvaluatorInfo) => {
    return item.evaluationOrder === '1.0';
  });
  const comment2Info = listEvalutor.filter((item: EvaluatorInfo) => {
    return item.evaluationOrder === '2.0';
  });
  let isDisplay05: number | boolean = role === 'admin' && comment05Info.length;
  let isDisplay1: number | boolean = role === 'admin' && comment1Info.length;
  let isDisplay2: number | boolean = role === 'admin' && comment2Info.length;
  allowSeeList.forEach((item: EvaluatorInfo) => {
    if (item.evaluationOrder === '0.5') isDisplay05 = true;
    if (item.evaluationOrder === '1.0') isDisplay1 = true;
    if (item.evaluationOrder === '2.0') isDisplay2 = true;
  });
  // if(location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 0.5 && comment05Info.length > 0){
  //   isDisplay05 = true;
  // }
  // if(location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 1 && comment1Info.length > 0){
  //   isDisplay1 = true;
  // }
  // if(location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 2 && comment2Info.length > 0){
  //   isDisplay2 = true;
  // }
  const buffList: string[] = [];
  const buffList1: string[] = [];
  const buffList2: string[] = [];
  for (let i = 0; i < dataSource.length; i++) {
    form.setFieldsValue({
      [`title_${dataSource[i].itemNo}`]: dataSource[i]?.title,
      [`achievement_${dataSource[i].itemNo}`]: dataSource[i]?.achievementValue,
      [`method_${dataSource[i].itemNo}`]: dataSource[i]?.method,
      [`weight_${dataSource[i].itemNo}`]: dataSource[i]?.weight,
      [`user_difficult_${dataSource[i].itemNo}`]:
        dataSource[i]?.difficultyUser && parseFloat(String(dataSource[i]?.difficultyUser) || '0').toFixed(1),

      // [`05_difficult_${dataSource[i].itemNo}`]: dataSource[i]?.difficultyEvaluator05,
      // [`1_difficult_${dataSource[i].itemNo}`]: dataSource[i]?.difficultyEvaluator1,
      // [`2_difficult_${dataSource[i].itemNo}`]: dataSource[i]?.difficultyEvaluator2,
    });
  }

  //processing selectbox option list
  const optionList: { label: string; value: string }[] = [];
  if (Array.isArray(settingAchievementPersonalType1)) {
    settingAchievementPersonalType1.map((item: SettingAchievementPersonal) => {
      optionList.push({
        label: item.point
          ? Number.isInteger(Number(item.point))
            ? Number(item.point).toFixed(1)
            : Number(item.point).toString()
          : '0',
        value: item.point.toString(),
      });
    });
  }

  const styleTitle = {
    fontSize: 13,
    backgroundColor: '#007240',
    color: 'white',
    textAlign: 'center',
    margin: -4,
    marginBottom: 4,
    height: '2.8rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    fontWeight: 'bold',
  } as CSSProperties;

  return [
    {
      title: t('IDS_GOAL_DEPARTMENT'),
      dataIndex: 'title',
      width: '150px',
      key: 'title',
      align: 'left' as const,
      onCell,
      render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
        return (
          <>
            {index !== 0 && <div style={styleTitle}>{t('IDS_GOAL_DEPARTMENT')}</div>}
            {(role === 'user' && (![0, 1, 2].includes(status) || !isGoalDate)) ||
            role === 'evaluator' ||
            role === 'admin' ||
            store.isDisable ? (
              <Text style={{ whiteSpace: 'pre-wrap', minHeight: '22px', display: 'block' }}>{text}</Text>
            ) : (
              <Form.Item
                name={`title_${record.itemNo}`}
                style={{ textAlign: 'left', marginBottom: '0px' }}
                rules={[
                  {
                    validator(_rule: any, value: string) {
                      return validateTarget(value, 1000);
                    },
                  },
                ]}
                initialValue={text}
              >
                <TextArea
                  maxLength={1001}
                  name={`title_${record.itemNo}`}
                  autoSize={{ minRows: 1, maxRows: 100 }}
                  style={{ flex: 1 }}
                  onChange={(e) => {
                    const value = e.target.value;
                    dataSource[index] = { ...dataSource[index], title: value };
                  }}
                />
              </Form.Item>
            )}
          </>
        );
      },
    },
    {
      title: t('IDS_ACHIEVEMENT_VALUE'),
      dataIndex: 'achievementValue',
      width: '250px',
      key: 'achievementValue',
      align: 'left' as const,
      onCell,
      render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
        return (
          <>
            {index !== 0 && <div style={styleTitle}>{t('IDS_ACHIEVEMENT_VALUE')}</div>}
            {(role === 'user' && (![0, 1, 2].includes(status) || !isGoalDate)) ||
            role === 'evaluator' ||
            role === 'admin' ||
            store.isDisable ? (
              <Text style={{ whiteSpace: 'pre-wrap' }}>{record.achievementValue}</Text>
            ) : (
              <Form.Item
                name={'achievement_' + record.itemNo}
                style={{ textAlign: 'left', marginBottom: '0px' }}
                rules={[
                  {
                    validator(_rule: any, value: string) {
                      return validateTarget(value, 1000);
                    },
                  },
                ]}
                initialValue={text}
              >
                <TextArea
                  maxLength={1001}
                  autoSize={{ minRows: 1, maxRows: 100 }}
                  name={`achievement_${record.itemNo}`}
                  onChange={(e) => {
                    const value = e.target.value;
                    dataSource[index] = {
                      ...dataSource[index],
                      achievementValue: value,
                    };
                  }}
                />
              </Form.Item>
            )}
          </>
        );
      },
    },
    {
      title: t('IDS_METHOD'),
      dataIndex: 'method',
      key: 'method',
      align: 'left' as const,
      onCell,
      render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
        return (
          <>
            {index !== 0 && <div style={styleTitle}>{t('IDS_METHOD')}</div>}
            {(role === 'user' && (![0, 1, 2].includes(status) || !isGoalDate)) ||
            role === 'evaluator' ||
            role === 'admin' ||
            store.isDisable ? (
              <Text style={{ whiteSpace: 'pre-wrap' }}>{record.method}</Text>
            ) : (
              <Form.Item
                name={`method_${record.itemNo}`}
                style={{ textAlign: 'left', marginBottom: '0px' }}
                rules={[
                  {
                    validator(_rule: any, value: string) {
                      return validateTarget(value, 5000);
                    },
                  },
                ]}
                initialValue={text}
              >
                <TextArea
                  maxLength={5001}
                  name={`method_${record.itemNo}`}
                  autoSize={{ minRows: 1, maxRows: 100 }}
                  onChange={(e) => {
                    const value = e.target.value;
                    dataSource[index] = {
                      ...dataSource[index],
                      method: value,
                    };
                  }}
                />
              </Form.Item>
            )}
          </>
        );
      },
    },
    {
      title: (
        <>
          {t('IDS_WEIGHT')}
          <Tooltip
            title={t('IDS_TOOLTIP_WEIGHT_COLUMN') as string}
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
      dataIndex: 'weight',
      key: 'weight',
      width: '100px',
      align: 'center' as const,
      onCell,
      render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
        return (
          <>
            {index !== 0 && (
              <div style={styleTitle}>
                {t('IDS_WEIGHT')}
                <Tooltip
                  title={t('IDS_TOOLTIP_WEIGHT_COLUMN') as string}
                  color="#424242"
                  overlayInnerStyle={{ fontSize: '11px' }}
                >
                  <Icon
                    component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                    style={{ cursor: 'default', paddingLeft: 2 }}
                  />
                </Tooltip>
              </div>
            )}
            {(role === 'user' && (![0, 1, 2].includes(status) || !isGoalDate)) ||
            role === 'evaluator' ||
            role === 'admin' ||
            store.isDisable ? (
              <Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Text>
            ) : (
              <Form.Item
                name={'weight_' + record.itemNo}
                style={{ textAlign: 'left', marginBottom: '0px' }}
                rules={[
                  {
                    validator(_rule: any, value: number) {
                      return validateDifficulty(value);
                    },
                  },
                ]}
                initialValue={text}
                validateStatus={store.isEqualDisplay ? 'success' : 'error'}
              >
                <Input
                  suffix={'%'}
                  maxLength={3}
                  name={'weight_' + record.itemNo}
                  style={{ padding: '0 10px', width: 100 }}
                  onChange={(e) => {
                    const value = e.target.value;
                    dataSource[index] = {
                      ...dataSource[index],
                      weight: value,
                    };
                    dispatch(checkWeight(dataSource));
                    dispatch(checkWeight2(true));
                  }}
                />
              </Form.Item>
            )}
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
      dataIndex: 'description',
      key: 'description',
      width: '80px',
      align: 'center' as const,
      onCell,
      render: (_text: string, record: EvaluationPersonalAchievement, _index: number) => {
        return (
          <>
            <ProfileOutlined
              style={{ color: '#007240 ', fontSize: 25, marginTop: 2 }}
              onClick={() => {
                const tempList: SubList[] = [];
                let count = 0;
                record.evaluationAchievementPersonalSub.forEach((item: SubList) => {
                  tempList.push({
                    key: count,
                    achievementPersonalId: item.achievementPersonalId,
                    coefficient: item.coefficient,
                    evaluationDecision: item.evaluationDecision,
                    parentKey: item.parentKey,
                  });
                  count++;
                });
                onOpenAddModal(tempList);
              }}
            />
          </>
        );
      },
    },
    {
      title: t('IDS_DIFFICULTY'),
      dataIndex: 'difficulty',
      key: 'difficulty',
      children: [
        {
          title: t('IDS_POINT_USER'),
          dataIndex: 'difficultyUser',
          key: 'difficultyUser',
          width: '60px',
          align: 'center' as const,
          onCell,
          render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
            return (
              <>
                {index !== 0 && (
                  <div style={{ ...styleTitle, flexDirection: 'column' }}>
                    <div style={{ borderBottom: '1px solid #809FA4', width: '100%' }}>
                      <span>{t('IDS_DIFFICULTY')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {t('IDS_POINT_USER')}
                    </div>
                  </div>
                )}

                {(role === 'user' && (![0, 1, 2].includes(status) || !isGoalDate)) ||
                role === 'evaluator' ||
                role === 'admin' ||
                store.isDisable ? (
                  <Text style={{ whiteSpace: 'pre-wrap' }}>{text ? parseFloat(text).toFixed(1) : ''}</Text>
                ) : (
                  <Form.Item
                    name={'user_difficult_' + record.itemNo}
                    style={{ textAlign: 'center', marginBottom: '0px' }}
                    rules={[
                      {
                        required: true,
                        message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM'),
                      },
                    ]}
                    initialValue={text && parseFloat(text).toFixed(1)}
                  >
                    <Select
                      id="user_difficult"
                      onChange={(e) => {
                        dataSource[index] = {
                          ...dataSource[index],
                          difficultyUser: e,
                        };
                      }}
                      style={{ width: 70 }}
                      options={optionList}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    />
                  </Form.Item>
                )}
              </>
            );
          },
        },
        {
          title: t('IDS_EVALUATION_0_5'),
          dataIndex: 'difficultyEvaluator05',
          key: 'difficultyEvaluator05',
          width: '60px',
          align: 'center' as const,
          onCell,
          render: (text: string, record: EvaluationPersonalAchievement, _index: number) => {
            return (
              <>
                {_index !== 0 && (
                  <div style={{ ...styleTitle, flexDirection: 'column' }}>
                    <div style={{ borderBottom: '1px solid #809FA4', width: '100%' }}>
                      <span>{t('IDS_DIFFICULTY')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {t('IDS_EVALUATION_0_5')}
                    </div>
                  </div>
                )}
                {![54, 55].includes(status) ||
                maxOrder !== '0.5' ||
                !isEvaluationDate ||
                role === 'admin' ||
                store.isDisable ? (
                  <Text style={{ whiteSpace: 'pre-wrap' }}>{text ? parseFloat(text).toFixed(1) : ''}</Text>
                ) : (
                  <Form.Item
                    name={'05_difficult_' + record.itemNo}
                    style={{ textAlign: 'center', marginBottom: '0px' }}
                    rules={[
                      {
                        required: true,
                        message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM'),
                      },
                    ]}
                    initialValue={text && parseFloat(text).toFixed(1)}
                  >
                    <Select
                      id="05_difficult"
                      onChange={(e) => {
                        dataSource[record.key] = {
                          ...dataSource[record.key],
                          difficultyEvaluator05: e,
                        };
                        dispatch(calculateEvaluator05Total(dataSource));
                      }}
                      style={{ width: 70 }}
                      options={optionList}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) => (option?.label ?? '').includes(input)}
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
          render: (text: string, record: EvaluationPersonalAchievement, _index: number) => {
            return (
              <>
                {_index !== 0 && (
                  <div style={{ ...styleTitle, flexDirection: 'column' }}>
                    <div style={{ borderBottom: '1px solid #809FA4', width: '100%' }}>
                      <span>{t('IDS_DIFFICULTY')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {t('IDS_POINT_EVALUATOR_1')}
                    </div>
                  </div>
                )}
                {![57, 58].includes(status) ||
                maxOrder !== '1.0' ||
                !isEvaluationDate ||
                role === 'admin' ||
                store.isDisable ? (
                  <Text style={{ whiteSpace: 'pre-wrap' }}>{text ? parseFloat(text).toFixed(1) : ''}</Text>
                ) : (
                  <Form.Item
                    name={'1_difficult_' + record.itemNo}
                    style={{ textAlign: 'center', marginBottom: '0px' }}
                    rules={[
                      {
                        required: true,
                        message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM'),
                      },
                    ]}
                    initialValue={text && parseFloat(text).toFixed(1)}
                  >
                    <Select
                      id="1_difficult"
                      onChange={(e) => {
                        dataSource[record.key] = {
                          ...dataSource[record.key],
                          difficultyEvaluator1: e,
                        };
                        dispatch(calculateEvaluator1Total(dataSource));
                      }}
                      style={{ width: 70 }}
                      options={optionList}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) => (option?.label ?? '').includes(input)}
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
          render: (text: string, record: EvaluationPersonalAchievement, _index: number) => {
            return (
              <>
                {_index !== 0 && (
                  <div style={{ ...styleTitle, flexDirection: 'column' }}>
                    <div style={{ borderBottom: '1px solid #809FA4', width: '100%' }}>
                      <span>{t('IDS_DIFFICULTY')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {t('IDS_POINT_EVALUATOR_2')}
                    </div>
                  </div>
                )}
                {![60, 61].includes(status) ||
                maxOrder !== '2.0' ||
                !isEvaluationDate ||
                role === 'admin' ||
                store.isDisable ? (
                  <Text style={{ whiteSpace: 'pre-wrap' }}>{text ? parseFloat(text).toFixed(1) : ''}</Text>
                ) : (
                  <Form.Item
                    name={'2_difficult_' + record.itemNo}
                    style={{ textAlign: 'center', marginBottom: '0px' }}
                    rules={[
                      {
                        required: true,
                        message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM'),
                      },
                    ]}
                    initialValue={text && parseFloat(text).toFixed(1)}
                  >
                    <Select
                      id="2_difficult_"
                      onChange={(e) => {
                        dataSource[record.key] = {
                          ...dataSource[record.key],
                          difficultyEvaluator2: e,
                        };
                        dispatch(calculateEvaluator2Total(dataSource));
                      }}
                      style={{ width: 70 }}
                      options={optionList}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    />
                  </Form.Item>
                )}
              </>
            );
          },
        },
      ],
    },
    {
      title: ' ',
      dataIndex: 'action',
      key: 'action',
      width: '50px',
      align: 'center' as const,
      onCell,
      render: (_text: string, record: EvaluationPersonalAchievement, index: number) => {
        return (
          <>
            {index !== 0 && <div style={{ ...styleTitle, top: 0 }}>&nbsp;</div>}
            {([0, 1, 2].includes(status) || isGoalDate) && !store.isDisable && (
              <Button
                icon={<DeleteOutlined />}
                style={{ color: '#007240 ' }}
                onClick={async () => {
                  const dataList = dataSource.filter(
                    (item: EvaluationPersonalAchievement) => item.itemNo !== record.itemNo,
                  );
                  for (let i = 0; i < dataList.length; i++) {
                    dataList[i].itemNo = i + 1;
                    dataList[i].key = i + 1;
                    const subData = dataList[i].evaluationAchievementPersonalSub;
                    Object.keys(subData).forEach((key: any) => {
                      subData[key].parentKey = i;
                    });
                  }
                  const dataKeyList: number[] = dataList.map((v) => v.key);
                  setDefaultExpandedRowKeys(dataKeyList);
                  setDataSource([...dataList]);
                  dispatch(checkWeight(dataList));
                }}
              />
            )}
          </>
        );
      },
    },
  ].filter((v) => {
    if (role === 'user' && !store.isDisable) {
      if ([0, 1, 2].includes(status) && isGoalDate) {
        const temp = v.children?.filter((item: any) => {
          if (item.key === 'difficultyUser') return item;
        });
        v.children = temp;

        return (
          v.key !== 'difficultyEvaluator2' &&
          v.key !== 'difficultyEvaluator1' &&
          v.key !== 'difficultyEvaluator05' &&
          v.key !== 'description'
        );
      } else if (status < 50 || (status === 50 && !isEvaluationDate)) {
        const temp = v.children?.filter((item: any) => {
          if (item.key === 'difficultyUser') return item;
        });
        v.children = temp;

        return (
          v.key !== 'difficultyEvaluator2' &&
          v.key !== 'difficultyEvaluator1' &&
          v.key !== 'difficultyEvaluator05' &&
          v.key !== 'description' &&
          v.key !== 'action'
        );
      } else if (status < 100) {
        const temp = v.children?.filter((item: any) => {
          if (item.key === 'difficultyUser') return item;
        });
        v.children = temp;

        return (
          v.key !== 'difficultyEvaluator2' &&
          v.key !== 'difficultyEvaluator1' &&
          v.key !== 'difficultyEvaluator05' &&
          v.key !== 'action'
        );
      } else {
        if (!comment05Info[0]) buffList2.push('difficultyEvaluator05');
        if (!comment1Info[0]) buffList2.push('difficultyEvaluator1');
        if (!comment2Info[0]) buffList2.push('difficultyEvaluator2');
        const temp = v.children?.filter((item: any) => {
          if (!buffList2.includes(item.key)) return item;
        });
        v.children = temp;

        return !buffList2.includes(v.key) && v.key !== 'action';
      }
    } else {
      if (status < 50 || (status === 50 && !isEvaluationDate)) {
        const temp = v.children?.filter((item: any) => {
          if (item.key === 'difficultyUser') return item;
        });
        v.children = temp;

        return (
          v.key !== 'difficultyEvaluator2' &&
          v.key !== 'difficultyEvaluator1' &&
          v.key !== 'difficultyEvaluator05' &&
          v.key !== 'description' &&
          v.key !== 'action'
        );
      }
      if (status < 100) {
        if (
          !isDisplay05 ||
          (isDisplay05 && status < 54) ||
          (location.evaluatorOrderExcep && !(location.evaluatorOrderExcep >= 0.5))
        )
          buffList.push('difficultyEvaluator05');
        if (
          !isDisplay1 ||
          (isDisplay1 && status < 57) ||
          (location.evaluatorOrderExcep && !(location.evaluatorOrderExcep >= 1))
        )
          buffList.push('difficultyEvaluator1');
        if (
          !isDisplay2 ||
          (isDisplay2 && status < 60) ||
          (location.evaluatorOrderExcep && !(location.evaluatorOrderExcep >= 2))
        )
          buffList.push('difficultyEvaluator2');
        const temp = v.children?.filter((item: any) => {
          if (!buffList.includes(item.key)) return item;
        });
        v.children = temp;

        return !buffList.includes(v.key) && v.key !== 'action';
      } else {
        if (!comment05Info[0]) buffList1.push('difficultyEvaluator05');
        if (!comment1Info[0]) buffList1.push('difficultyEvaluator1');
        if (!comment2Info[0]) buffList1.push('difficultyEvaluator2');
        const temp = v.children?.filter((item: any) => {
          if (!buffList1.includes(item.key)) return item;
        });
        v.children = temp;

        return !buffList1.includes(v.key) && v.key !== 'action';
      }
    }
  });
};
export default EvaluationGoalDepartmentColumn;
