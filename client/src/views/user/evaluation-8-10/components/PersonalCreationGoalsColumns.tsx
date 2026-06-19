import { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import {
  EvaluationPersonalAchievementOfUser,
  EvaluatorInfo,
  SettingAchievementPersonal,
} from '../interfaces/response.interface';
import { Button, Form, Input, Select, Tooltip, Typography } from 'antd';
import { CSSProperties } from 'react';
import Icon, { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import TextArea from 'antd/es/input/TextArea';
import { validateDifficulty, validateTarget } from './valildateInputField';
import { checkWeightNew, checkWeightNew2 } from '../../../../store/total';
interface Props {
  listPersonalGoals: EvaluationPersonalAchievementOfUser[];
  form: any;
  status: number;
  role: string;
  isEvaluationDate: boolean;
  isGoalDate: boolean;
  isDisable: boolean;
  listEvalutors: EvaluatorInfo[];
  allowSeeList: EvaluatorInfo[];
  maxOrder: string;
  store: any;
  setPersonalGoalsList: any;
  settingAchievementPersonalType3s: SettingAchievementPersonal[];
  settingAchievementPersonalType4s: SettingAchievementPersonal[];
}
const PersonalCreationGoalsColumns = (props: Props) => {
  const {
    allowSeeList,
    form,
    isEvaluationDate,
    isGoalDate,
    listEvalutors,
    role,
    status,
    store,
    setPersonalGoalsList,
    settingAchievementPersonalType3s,
  } = props;
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
  const dispatch = useDispatch<AppDispatch>();
  const buffList: string[] = [];
  const buffList1s: string[] = [];
  const buffList2s: string[] = [];

  const optionDifficultyList: { label: string; value: number }[] = [];
  for (let index = 0; index < settingAchievementPersonalType3s.length; index++) {
    optionDifficultyList.push({
      label: parseFloat(settingAchievementPersonalType3s[index].point.toString()).toFixed(1),
      value: settingAchievementPersonalType3s[index].point,
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
  const onCell = () => {
    return { style: { verticalAlign: 'top' } };
  };

  return [
    {
      title: t('IDS_ACHIEVEMENT_PERSONAL'),
      dataIndex: 'title',
      width: '150px',
      onCell,
      render(value: any, _record: any, index: number) {
        return (
          <>
            {index !== 0 && <div style={styleTitle}>{t('IDS_ACHIEVEMENT_PERSONAL')}</div>}
            {(role === 'user' && (![0, 1, 2].includes(status) || !isGoalDate)) ||
            role === 'evaluator' ||
            role === 'admin' ||
            store.isDisable ? (
              <>
                <Form.Item
                  name={['personalGoals', index, 'title']}
                  style={{ display: 'inline-block', marginBottom: 0, height: '0px' }}
                ></Form.Item>
                <Text style={{ whiteSpace: 'pre-wrap' }}>{value}</Text>
              </>
            ) : (
              <Form.Item
                name={['personalGoals', index, 'title']}
                style={{ textAlign: 'left', marginBottom: '0px' }}
                rules={[
                  {
                    validator(_rule: any, value: string) {
                      return validateTarget(value, 1000);
                    },
                  },
                ]}
              >
                <TextArea maxLength={1001} autoSize={{ minRows: 1, maxRows: 100 }} style={{ flex: 1 }} />
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
      onCell,
      render(value: any, _record: any, index: number) {
        return (
          <>
            {index !== 0 && <div style={styleTitle}>{t('IDS_ACHIEVEMENT_VALUE')}</div>}
            {(role === 'user' && (![0, 1, 2].includes(status) || !isGoalDate)) ||
            role === 'evaluator' ||
            role === 'admin' ||
            store.isDisable ? (
              <>
                <Form.Item
                  name={['personalGoals', index, 'achievementValue']}
                  style={{ display: 'inline-block', marginBottom: 0, height: '0px' }}
                ></Form.Item>
                <Text style={{ whiteSpace: 'pre-wrap' }}>{value}</Text>
              </>
            ) : (
              <Form.Item
                name={['personalGoals', index, 'achievementValue']}
                style={{ textAlign: 'left', marginBottom: '0px' }}
                rules={[
                  {
                    validator(_rule: any, value: string) {
                      return validateTarget(value, 1000);
                    },
                  },
                ]}
              >
                <TextArea maxLength={1001} autoSize={{ minRows: 1, maxRows: 100 }} style={{ flex: 1 }} />
              </Form.Item>
            )}
          </>
        );
      },
    },
    {
      title: t('IDS_METHOD'),
      dataIndex: 'method',
      onCell,
      render(value: any, _record: any, index: number) {
        return (
          <>
            {index !== 0 && <div style={styleTitle}>{t('IDS_METHOD')}</div>}
            {(role === 'user' && (![0, 1, 2].includes(status) || !isGoalDate)) ||
            role === 'evaluator' ||
            role === 'admin' ||
            store.isDisable ? (
              <>
                <Form.Item
                  name={['personalGoals', index, 'method']}
                  style={{ display: 'inline-block', marginBottom: 0, height: '0px' }}
                ></Form.Item>
                <Text style={{ whiteSpace: 'pre-wrap' }}>{value}</Text>
              </>
            ) : (
              <Form.Item
                name={['personalGoals', index, 'method']}
                style={{ textAlign: 'left', marginBottom: '0px' }}
                rules={[
                  {
                    validator(_rule: any, value: string) {
                      return validateTarget(value, 5000);
                    },
                  },
                ]}
              >
                <TextArea maxLength={5001} autoSize={{ minRows: 1, maxRows: 100 }} style={{ flex: 1 }} />
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
      width: '100px',
      onCell,
      align: 'center' as const,
      render(value: any, record: any, index: number) {
        return (
          <>
            {index !== 0 && (
              <div style={styleTitle}>
                {
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
                }
              </div>
            )}
            {(role === 'user' && (![0, 1, 2].includes(status) || !isGoalDate)) ||
            role === 'evaluator' ||
            role === 'admin' ||
            store.isDisable ? (
              <>
                <Form.Item
                  name={['personalGoals', index, 'weight']}
                  style={{ display: 'inline-block', marginBottom: 0, height: '0px' }}
                ></Form.Item>
                <Text style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>{value}</Text>
              </>
            ) : (
              <Form.Item
                name={['personalGoals', index, 'weight']}
                style={{ textAlign: 'left', marginBottom: '0px' }}
                rules={[
                  {
                    validator(_rule: any, value: number) {
                      if (value === 0) {
                        return Promise.resolve();
                      } else {
                        if (!value) {
                          return Promise.reject(t('MESSAGE.COMMON.IDM_BLANK_ITEM'));
                        }
                        if (value.toString().trim() === '') {
                          return Promise.reject(t('MESSAGE.COMMON.IDM_BLANK_ITEM'));
                        }
                        if (Number(value) < 0)
                          return Promise.reject(t('MESSAGE.COMMON.IDM_MIN_POINT').replace('{min value}', '-1'));
                        if (value && value.toString().match(/^[0-9]*$/) === null) {
                          return Promise.reject(t('MESSAGE.COMMON.IDM_INVALID_NUMBER'));
                        }
                        if (
                          value &&
                          Number(value)
                            .toString()
                            .match(/(^100$)|^[0-9]\d?$/) === null
                        ) {
                          return Promise.reject(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '100'));
                        }

                        return Promise.resolve();
                      }
                    },
                  },
                ]}
                validateStatus={store.isEqualDisplayNew ? 'success' : 'error'}
              >
                <Input
                  suffix={'%'}
                  maxLength={3}
                  name={'weight_' + record.itemNo}
                  style={{ padding: '0 10px' }}
                  onChange={() => {
                    const filterPersonalForms =
                      form.getFieldsValue(['personalGoals']) &&
                      form.getFieldsValue(['personalGoals']).personalGoals !== undefined &&
                      form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined);
                    dispatch(checkWeightNew(filterPersonalForms));
                    dispatch(checkWeightNew2(true));
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
          {t('IDS_DIFFICULTY_PERSONAL')}
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
      width: '5%',
      onCell,
      align: 'center' as const,
      render(value: any, record: any, index: number) {
        return (
          <>
            {(role === 'user' && (![0, 1, 2].includes(status) || !isGoalDate)) ||
            role === 'evaluator' ||
            role === 'admin' ||
            role === 'reviewer' ? (
              <>
                {index !== 0 && (
                  <div
                    style={{
                      ...styleTitle,
                    }}
                  >
                    {t('IDS_DIFFICULTY_PERSONAL')}
                  </div>
                )}

                <>
                  <Form.Item
                    name={['personalGoals', index, 'difficultyUser']}
                    style={{ display: 'inline-block', marginBottom: 0, height: '0px' }}
                  ></Form.Item>
                  <Text style={{ whiteSpace: 'pre-wrap' }}>
                    {record.difficultyUser && Number(record.difficultyUser).toFixed(1)}
                  </Text>
                </>
              </>
            ) : (
              <>
                {index !== 0 && (
                  <div
                    style={{
                      ...styleTitle,
                    }}
                  >
                    {t('IDS_DIFFICULTY_PERSONAL')}
                  </div>
                )}
                <Form.Item
                  name={['personalGoals', index, 'difficultyUser']}
                  style={{ textAlign: 'center', marginBottom: '0px' }}
                  rules={[
                    {
                      validator(_rule: any, value: string) {
                        return validateTarget(value, 200);
                      },
                    },
                  ]}
                >
                  <Select
                    options={optionDifficultyList}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                  />
                </Form.Item>
              </>
            )}
          </>
        );
      },
    },
    {
      title: ' ',
      dataIndex: 'action',
      key: 'action',
      width: '50px',
      onCell,
      align: 'center' as const,
      render(_value: any, record: any, index: number) {
        return (
          <>
            {index !== 0 && <div style={styleTitle}> </div>}
            <Button
              icon={<DeleteOutlined />}
              style={{ color: '#007240 ' }}
              disabled={Number(record.evaluationOrder) > Number(store.maxOrder)}
              onClick={(_e) => {
                const filterPersonalForms =
                  form.getFieldsValue(['personalGoals']) &&
                  form.getFieldsValue(['personalGoals']).personalGoals !== undefined &&
                  form
                    .getFieldsValue(['personalGoals'])
                    .personalGoals.filter((v: any) => v !== undefined)
                    .filter((v: any, i: number) => i !== index);
                dispatch(checkWeightNew(filterPersonalForms));
                setPersonalGoalsList(filterPersonalForms);
              }}
            />
          </>
        );
      },
    },
  ].filter((v) => {
    if (props.role === 'user' && !store.isDisable) {
      if ([0, 1, 2].includes(status) && isGoalDate) {
        return (
          v.key !== 'difficultyEvaluator2' && v.key !== 'difficultyEvaluator1' && v.key !== 'difficultyEvaluator05'
        );
      } else if (status < 50 || (status === 50 && !isEvaluationDate)) {
        return (
          v.key !== 'difficultyEvaluator2' &&
          v.key !== 'difficultyEvaluator1' &&
          v.key !== 'difficultyEvaluator05' &&
          v.key !== 'action'
        );
      } else if (status < 100) {
        return (
          v.key !== 'difficultyEvaluator2' &&
          v.key !== 'difficultyEvaluator1' &&
          v.key !== 'difficultyEvaluator05' &&
          v.key !== 'action'
        );
      } else {
        if (!comment05Infos[0]) buffList2s.push('difficultyEvaluator05');
        if (!comment1Infos[0]) buffList2s.push('difficultyEvaluator1');
        if (!comment2Infos[0]) buffList2s.push('difficultyEvaluator2');

        return !buffList2s.includes(v.key ? v.key : 'action') && v.key !== 'action';
      }
    } else {
      if (status < 50 || (status === 50 && !isEvaluationDate)) {
        return (
          v.key !== 'difficultyEvaluator2' &&
          v.key !== 'difficultyEvaluator1' &&
          v.key !== 'difficultyEvaluator05' &&
          v.key !== 'description' &&
          v.key !== 'action'
        );
      }
      if (status < 100) {
        if (!isDisplay05 || (isDisplay05 && status < 54)) buffList.push('difficultyEvaluator05');
        if (!isDisplay1 || (isDisplay1 && status < 57)) buffList.push('difficultyEvaluator1');
        if (!isDisplay2 || (isDisplay2 && status < 60)) buffList.push('difficultyEvaluator2');

        return !buffList.includes(v.key ? v.key : 'action') && v.key !== 'action';
      } else {
        if (!comment05Infos[0]) buffList1s.push('difficultyEvaluator05');
        if (!comment1Infos[0]) buffList1s.push('difficultyEvaluator1');
        if (!comment2Infos[0]) buffList1s.push('difficultyEvaluator2');

        return !buffList1s.includes(v.key ? v.key : 'action') && v.key !== 'action';
      }
    }
  }) as ColumnsType<any>;
};

export default PersonalCreationGoalsColumns;
