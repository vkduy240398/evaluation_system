import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Select, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { ColumnType } from 'antd/es/table';
import { t } from 'i18next';
import React from 'react';
import { evaluationListAchievementAdditionals } from '../../../../store/total';
import {
  EvaluationAdditionalAchievementNew,
  EvaluatorInfo,
  SettingAchievementAdditional,
} from '../interfaces/response.interface';
import { statusEvaluationType } from '../../../../common/status';
import { changeValuePoint } from '../services/EvaluationAchievement';
import { validateTarget } from './valildateInputField';
type Action =
  | { type: 'ADD'; payload: EvaluationAdditionalAchievementNew; oldData: EvaluationAdditionalAchievementNew[] }
  | { type: 'DELETE'; index: number; payload: EvaluationAdditionalAchievementNew[] }
  | { type: 'INITIAL_VALUE'; payload: EvaluationAdditionalAchievementNew[] };
interface Props {
  setDataSource: React.Dispatch<Action>;
  dataSources: EvaluationAdditionalAchievementNew[];
  dispatch: any;
  role: string;
  isEvaluationDate: boolean;
  isGoalDate: boolean;
  isDisable: boolean;
  listEvalutors: EvaluatorInfo[];
  allowSeeList: EvaluatorInfo[];
  maxOrder: string;
  store: any;
  status: statusEvaluationType;
  form: any;
  pointAchievementAdditionals: SettingAchievementAdditional[];
  openPopupConfirmDelete: (data: any[], index: number) => void;
  location: any;
}
const EvaluationAchievementNewColumn = (props: Props) => {
  const {
    setDataSource,
    dataSources,
    allowSeeList,
    isEvaluationDate,
    listEvalutors,
    maxOrder,
    role,
    store,
    status,
    form,
    pointAchievementAdditionals,
    openPopupConfirmDelete,
    location,
  } = props;

  const optionStatusList = [
    {
      label: t('IDS_ACHIEVED'),
      value: t('IDS_ACHIEVED'),
    },
    {
      label: t('IDS_NOT_ACHIEVE'),
      value: t('IDS_NOT_ACHIEVE'),
    },
  ];

  const optionPointList = pointAchievementAdditionals.reduce((acc, curr) => {
    acc.push({
      label: curr.rating,
      value: curr.rating,
    });

    return acc;
  }, [] as Record<string, string>[]);

  const onCell = () => {
    return { style: { verticalAlign: 'top' } };
  };
  const buffList: string[] = [];
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
  const { Text } = Typography;

  return [
    {
      title: t('IDS_OTHER_ITEM'),
      dataIndex: 'titleAdditional',
      width: '20%',
      onCell,
      render(value: any, record: any, index: any) {
        return !(
          ((props.role === 'user' && [50, 51, 52].includes(props.status) && isEvaluationDate && !store.isDisable) ||
            (props.role === 'evaluator' &&
              isEvaluationDate &&
              (([54, 55].includes(status) && store.maxOrder === '0.5') ||
                ([57, 58].includes(status) && store.maxOrder === '1.0') ||
                ([60, 61].includes(status) && store.maxOrder === '2.0')))) &&
          Number(record.evaluationOrder) === Number(store.maxOrder)
        ) ? (
          <>
            <Form.Item
              style={{ minHeight: 0, visibility: 'hidden', display: 'none' }}
              name={['achivement_personal', index, 'evaluationOrder']}
            ></Form.Item>
            <Form.Item name={['achivement_personal', index, 'titleAdditional']}>
              <Text>{value}</Text>
            </Form.Item>
          </>
        ) : (
          <Form.Item
            name={['achivement_personal', index, 'titleAdditional']}
            rules={[
              {
                validator(_rule: any, value: string) {
                  return validateTarget(value, 1000);
                },
              },
            ]}
          >
            <TextArea maxLength={1001} autoSize style={{ whiteSpace: 'pre-wrap' }} />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_STATUS_ACHIEVED'),
      dataIndex: 'achievementStatus',
      width: '5%',
      onCell,
      render(value: any, record: any, index: any) {
        return !(
          ((props.role === 'user' && [50, 51, 52].includes(props.status) && isEvaluationDate && !store.isDisable) ||
            (props.role === 'evaluator' &&
              isEvaluationDate &&
              (([54, 55].includes(status) && store.maxOrder === '0.5') ||
                ([57, 58].includes(status) && store.maxOrder === '1.0') ||
                ([60, 61].includes(status) && store.maxOrder === '2.0')))) &&
          Number(record.evaluationOrder) === Number(store.maxOrder)
        ) ? (
          <Form.Item name={['achivement_personal', index, 'achievementStatus']} style={{ textAlign: 'left' }}>
            <Text>{value}</Text>
          </Form.Item>
        ) : (
          <Form.Item
            name={['achivement_personal', index, 'achievementStatus']}
            rules={[
              {
                required: true,
                message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
              },
            ]}
          >
            <Select
              size="small"
              options={optionStatusList}
              style={{ display: 'absolute' }}
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              allowClear
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_ACHIEVEMENT_ADDITIONAL_REASON'),
      dataIndex: 'reasonComment',
      width: '35%',
      onCell,

      render(value: any, record: any, index: any) {
        return !(
          ((props.role === 'user' && [50, 51, 52].includes(props.status) && isEvaluationDate && !store.isDisable) ||
            (props.role === 'evaluator' &&
              isEvaluationDate &&
              (([54, 55].includes(status) && store.maxOrder === '0.5') ||
                ([57, 58].includes(status) && store.maxOrder === '1.0') ||
                ([60, 61].includes(status) && store.maxOrder === '2.0')))) &&
          Number(record.evaluationOrder) === Number(store.maxOrder)
        ) ? (
          <Form.Item name={['achivement_personal', index, 'reasonComment']}>
            <Text>{value}</Text>
          </Form.Item>
        ) : (
          <Form.Item
            name={['achivement_personal', index, 'reasonComment']}
            rules={[
              {
                validator(_rule: any, value: string) {
                  return validateTarget(value, 1000);
                },
              },
            ]}
          >
            <TextArea maxLength={1001} autoSize style={{ whiteSpace: 'pre-wrap' }} />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_EVALUATION_SELF_USER'),
      dataIndex: 'pointUser',
      width: '5%',
      onCell,
      align: 'center' as const,
      render(value: any, record: any, index: any) {
        return !(
          props.role === 'user' &&
          [50, 51, 52].includes(props.status) &&
          isEvaluationDate &&
          !store.isDisable &&
          Number(record.evaluationOrder) === Number(store.maxOrder)
        ) ? (
          <Form.Item name={['achivement_personal', index, 'pointUser']}>
            <Text>{value}</Text>
          </Form.Item>
        ) : (
          <Form.Item
            name={['achivement_personal', index, 'pointUser']}
            rules={[
              {
                required: true,
                message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM').toString(),
              },
            ]}
          >
            <Select
              size="small"
              options={optionPointList}
              onChange={async () => {
                await changeValuePoint({
                  form,
                  setAchievementAdditionalGoals: setDataSource,
                });
              }}
              allowClear
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_EVALUATOR_0_5'),
      dataIndex: 'pointEvaluator05',
      width: '5%',
      align: 'center' as const,
      onCell,

      render(value: any, record: any, index: any) {
        return !(
          props.role === 'evaluator' &&
          [54, 55].includes(status) &&
          store.maxOrder === '0.5' &&
          isEvaluationDate &&
          Number(record.evaluationOrder) <= Number(store.maxOrder)
        ) ? (
          <Form.Item name={['achivement_personal', index, 'pointEvaluator05']}>
            <Text>{value}</Text>
          </Form.Item>
        ) : (
          <Form.Item
            name={['achivement_personal', index, 'pointEvaluator05']}
            rules={[
              {
                required: true,
                message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM').toString(),
              },
            ]}
          >
            <Select
              size="small"
              options={optionPointList}
              onChange={async () => {
                await changeValuePoint({
                  form,
                  setAchievementAdditionalGoals: setDataSource,
                });
              }}
              allowClear
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              style={{ display: 'absolute' }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_POINT_EVALUATOR_1'),
      dataIndex: 'pointEvaluator1',
      width: '5%',
      align: 'center' as const,
      onCell,
      render(value: any, record: any, index: any) {
        return !(
          props.role === 'evaluator' &&
          [57, 58].includes(status) &&
          isEvaluationDate &&
          store.maxOrder === '1.0' &&
          Number(record.evaluationOrder) <= Number(store.maxOrder)
        ) ? (
          <Form.Item name={['achivement_personal', index, 'pointEvaluator1']}>
            <Text>{value}</Text>
          </Form.Item>
        ) : (
          <Form.Item
            name={['achivement_personal', index, 'pointEvaluator1']}
            rules={[
              {
                required: true,
                message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM').toString(),
              },
            ]}
          >
            <Select
              size="small"
              options={optionPointList}
              onChange={async () => {
                await changeValuePoint({
                  form,
                  setAchievementAdditionalGoals: setDataSource,
                });
              }}
              allowClear
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              style={{ display: 'absolute' }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_POINT_EVALUATOR_2'),
      dataIndex: 'pointEvaluator2',
      width: '5%',
      align: 'center' as const,
      onCell,
      render(value: any, record: any, index: any) {
        return !(
          props.role === 'evaluator' &&
          [60, 61].includes(status) &&
          store.maxOrder === '2.0' &&
          isEvaluationDate &&
          Number(record.evaluationOrder) <= Number(store.maxOrder)
        ) ? (
          <Form.Item name={['achivement_personal', index, 'pointEvaluator2']}>
            <Text>{value}</Text>
          </Form.Item>
        ) : (
          <Form.Item
            name={['achivement_personal', index, 'pointEvaluator2']}
            rules={[
              {
                required: true,
                message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM').toString(),
              },
            ]}
          >
            <Select
              size="small"
              options={optionPointList}
              onChange={async () => {
                changeValuePoint({
                  form,
                  setAchievementAdditionalGoals: setDataSource,
                });
              }}
              allowClear
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              style={{ display: 'absolute' }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: ' ',
      dataIndex: 'action',
      width: '1%',
      align: 'center' as const,
      onCell,
      render(_value: any, record: any, index: number) {
        return (
          <>
            <Button
              icon={<DeleteOutlined />}
              style={{ color: '#007240 ' }}
              onClick={() => {
                // const dataList = dataSources.filter((v, i) => i !== index);
                // setDataSource({
                //   type: 'DELETE',
                //   index: index,
                //   payload: dataSources,
                // });
                // dispatch(evaluationListAchievementAdditionals(dataList));
                openPopupConfirmDelete(dataSources, index);
              }}
              disabled={Number(record.evaluationOrder) > Number(store.maxOrder)}
            />
          </>
        );
      },
    },
  ].filter((v) => {
    if (role === 'user' && !store.isDisable) {
      if ([50, 51, 52].includes(status) && isEvaluationDate) {
        return (
          v.dataIndex !== 'pointEvaluator2' && v.dataIndex !== 'pointEvaluator1' && v.dataIndex !== 'pointEvaluator05'
        );
      } else if (status < 100 && ![50, 51, 52].includes(status)) {
        return (
          v.dataIndex !== 'pointEvaluator2' &&
          v.dataIndex !== 'pointEvaluator1' &&
          v.dataIndex !== 'pointEvaluator05' &&
          v.dataIndex !== 'action'
        );
      } else if (status === 100) {
        if (!comment05Infos[0]) buffList.push('pointEvaluator05');
        if (!comment1Infos[0]) buffList.push('pointEvaluator1');
        if (!comment2Infos[0]) buffList.push('pointEvaluator2');

        return !buffList.includes(v.dataIndex) && v.dataIndex !== 'action';
      }
    } else {
      if (status < 50 || (status === 50 && !isEvaluationDate)) {
        return (
          v.dataIndex !== 'pointEvaluator2' &&
          v.dataIndex !== 'pointEvaluator1' &&
          v.dataIndex !== 'pointUser' &&
          v.dataIndex !== 'pointEvaluator05' &&
          v.dataIndex !== 'action'
        );
      }
      if (status < 100) {
        if (!isDisplay05 || (isDisplay05 && status < 54)) buffList.push('pointEvaluator05');
        if (!isDisplay1 || (isDisplay1 && status < 57)) buffList.push('pointEvaluator1');
        if (!isDisplay2 || (isDisplay2 && status < 60)) buffList.push('pointEvaluator2');
        if (
          !(
            ([54, 55].includes(status) && maxOrder === '0.5' && props.role !== 'admin' && isEvaluationDate) ||
            ([57, 58].includes(status) && maxOrder === '1.0' && props.role !== 'admin' && isEvaluationDate) ||
            ([60, 61].includes(status) && maxOrder === '2.0' && props.role !== 'admin' && isEvaluationDate)
          )
        )
          buffList.push('action');

        return !buffList.includes(v.dataIndex);
      } else if (status === 100) {
        if (!comment05Infos[0]) buffList.push('pointEvaluator05');
        if (!comment1Infos[0]) buffList.push('pointEvaluator1');
        if (!comment2Infos[0]) buffList.push('pointEvaluator2');

        return !buffList.includes(v.dataIndex) && v.dataIndex !== 'action';
      }
    }

    return v;
  }) as ColumnType<any>;
};

export default EvaluationAchievementNewColumn;
