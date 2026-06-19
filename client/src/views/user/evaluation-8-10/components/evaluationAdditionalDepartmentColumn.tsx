/* eslint-disable @typescript-eslint/naming-convention */
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Select, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import {
  calculateAdditionTotal,
  calculateAdditionTotal05,
  calculateAdditionTotal1,
  calculateAdditionTotal2,
} from '../../../../store/total';
import { validateTarget } from './valildateInputField';
import { t } from 'i18next';
import {
  EvaluationAdditionalAchievement,
  EvaluatorInfo,
  SettingAchievementAdditional,
} from '../interfaces/response.interface';
import { useEffect } from 'react';
interface Props {
  status: number;
  additionData: EvaluationAdditionalAchievement[];
  setAdditionData: (data: EvaluationAdditionalAchievement[]) => void;
  role: string;
  Form: any;
  allowSeeList: EvaluatorInfo[];
  maxOrder: string;
  form: any;
  listEvalutor: EvaluatorInfo[];
  isEvaluationDate: boolean;
  settingAchievementAdditional: SettingAchievementAdditional[];
  store: any;
  setIsOpenPopUpConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  setRecord: React.Dispatch<any>;
  location: any;
}
const EvaluationAdditionaDepartmentColumn = (props: Props) => {
  const {
    status,
    additionData,
    Form,
    allowSeeList,
    maxOrder,
    form,
    listEvalutor,
    isEvaluationDate,
    settingAchievementAdditional,
    role,
    store,
    setIsOpenPopUpConfirm,
    setRecord,
    location,
  } = props;
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

  // if (location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 0.5 && comment05Info.length > 0) {
  //   isDisplay05 = true;
  // }
  // if (location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 1 && comment1Info.length > 0) {
  //   isDisplay1 = true;
  // }
  // if (location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 2 && comment2Info.length > 0) {
  //   isDisplay2 = true;
  // }
  const dispatch = useDispatch<AppDispatch>();
  const { Text } = Typography;
  const buffList: string[] = [];
  const buffList1s: string[] = [];
  const buffList2s: string[] = [];

  //processing selectbox option list
  const optionList: { label: string; value: string }[] = [];
  settingAchievementAdditional.map((item: { rating: string; point: number }) => {
    optionList.push({
      label: item.rating,
      value: item.rating,
    });
  });

  return [
    {
      title: t('IDS_OTHER_ITEM'),
      dataIndex: 'titleAdditional',
      key: 'titleAdditional',
      align: 'left' as const,
      onCell,
      width: '40%',
      render: (text: string, record: EvaluationAdditionalAchievement, index: number) => {
        return (
          <>
            {!(
              ((props.role === 'user' && [50, 51, 52].includes(props.status) && isEvaluationDate && !store.isDisable) ||
                (props.role === 'evaluator' &&
                  (([54, 55].includes(status) && store.maxOrder === '0.5') ||
                    ([57, 58].includes(status) && store.maxOrder === '1.0') ||
                    ([60, 61].includes(status) && store.maxOrder === '2.0')))) &&
              Number(record.evaluationOrder) === Number(store.maxOrder)
            ) ? (
              <Form.Item style={{ marginBottom: '0px' }} name={'additionTitle_' + record.itemNo}>
                <Text>{text}</Text>
              </Form.Item>
            ) : (
              <>
                <Form.Item
                  style={{ marginBottom: '0px' }}
                  name={'additionTitle_' + record.itemNo}
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
                    onChange={(e) => {
                      const value = e.target.value;
                      additionData[index] = {
                        ...additionData[index],
                        titleAdditional: value,
                      };
                    }}
                  />
                </Form.Item>
              </>
            )}
          </>
        );
      },
    },
    {
      title: t('IDS_STATUS_ACHIEVED'),
      dataIndex: 'achievementStatus',
      key: 'achievementStatus',
      width: '95px',
      align: 'center' as const,
      onCell,
      render: (text: string, record: EvaluationAdditionalAchievement, index: number) => {
        return (
          <>
            {!(
              ((props.role === 'user' && [50, 51, 52].includes(props.status) && isEvaluationDate && !store.isDisable) ||
                (props.role === 'evaluator' &&
                  (([54, 55].includes(status) && store.maxOrder === '0.5') ||
                    ([57, 58].includes(status) && store.maxOrder === '1.0') ||
                    ([60, 61].includes(status) && store.maxOrder === '2.0')))) &&
              Number(record.evaluationOrder) === Number(store.maxOrder)
            ) ? (
              <Form.Item
                // style={{ textAlign: 'left', marginBottom: '0px' }}
                name={'additionAchievementStatus_' + record.itemNo}
                // style={{ textAlign: 'left' }}
              >
                <Text>{text}</Text>
              </Form.Item>
            ) : (
              <Form.Item
                style={{ textAlign: 'left', marginBottom: '0px' }}
                name={'additionAchievementStatus_' + record.itemNo}
                rules={[
                  {
                    required: true,
                    message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM'),
                  },
                ]}
                initialValue={text}
              >
                <Select
                  style={{ width: 100 }}
                  options={[
                    { value: t('IDS_ACHIEVED'), label: t('IDS_ACHIEVED') },
                    { value: t('IDS_NOT_ACHIEVE'), label: t('IDS_NOT_ACHIEVE') },
                  ]}
                  onChange={(e) => {
                    const value = e;
                    additionData[index] = {
                      ...additionData[index],
                      achievementStatus: value,
                    };
                  }}
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
      title: t('IDS_ACHIEVEMENT_ADDITIONAL_REASON'),
      dataIndex: 'reasonComment',
      key: 'reasonComment',
      onCell,
      render: (text: string, record: EvaluationAdditionalAchievement, index: number) => {
        return (
          <>
            {!(
              ((props.role === 'user' && [50, 51, 52].includes(props.status) && isEvaluationDate && !store.isDisable) ||
                (props.role === 'evaluator' &&
                  (([54, 55].includes(status) && store.maxOrder === '0.5') ||
                    ([57, 58].includes(status) && store.maxOrder === '1.0') ||
                    ([60, 61].includes(status) && store.maxOrder === '2.0')))) &&
              Number(record.evaluationOrder) === Number(store.maxOrder)
            ) ? (
              <Form.Item style={{ marginBottom: '0px' }} name={'additionReasonComment_' + record.itemNo}>
                <Text>{text}</Text>
              </Form.Item>
            ) : (
              <Form.Item
                style={{ marginBottom: '0px' }}
                name={'additionReasonComment_' + record.itemNo}
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
                  onChange={(e) => {
                    const value = e.target.value;
                    additionData[index] = {
                      ...additionData[index],
                      reasonComment: value,
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
      title: t('IDS_EVALUATION_SELF_USER'),
      dataIndex: 'pointUser',
      key: 'pointUser',
      width: '65px',
      align: 'center' as const,
      onCell,
      render: (text: string, record: EvaluationAdditionalAchievement, index: number) => {
        return (
          <>
            {!(
              props.role === 'user' &&
              [50, 51, 52].includes(props.status) &&
              isEvaluationDate &&
              !store.isDisable &&
              Number(record.evaluationOrder) <= Number(store.maxOrder)
            ) ? (
              <Form.Item style={{ marginBottom: '0px' }} name={'additionPointUser_' + record.itemNo}>
                <Text>{text}</Text>
              </Form.Item>
            ) : (
              <Form.Item
                style={{ textAlign: 'left', marginBottom: '0px' }}
                name={'additionPointUser_' + record.itemNo}
                rules={[
                  {
                    required: true,
                    message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM'),
                  },
                ]}
                initialValue={text}
              >
                <Select
                  style={{ width: 60 }}
                  options={optionList}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input)}
                  onChange={(e) => {
                    const value = e;
                    additionData[index] = {
                      ...additionData[index],
                      pointUser: value,
                    };
                    dispatch(calculateAdditionTotal([additionData, settingAchievementAdditional]));
                  }}
                />
              </Form.Item>
            )}
          </>
        );
      },
    },
    {
      title: t('IDS_EVALUATION_0_5'),
      dataIndex: 'pointEvaluator05',
      key: 'pointEvaluator05',
      width: '60px',
      align: 'center' as const,
      onCell,
      render: (text: string, record: EvaluationAdditionalAchievement, index: number) => {
        return (
          <>
            {!(
              props.role === 'evaluator' &&
              [54, 55].includes(status) &&
              store.maxOrder === '0.5' &&
              Number(record.evaluationOrder) <= Number(store.maxOrder)
            ) ? (
              <Form.Item style={{ marginBottom: '0px' }} name={'additionPointEvaluator05_' + record.itemNo}>
                <Text>{text}</Text>
              </Form.Item>
            ) : (
              <Form.Item
                style={{ textAlign: 'left', marginBottom: '0px' }}
                name={'additionPointEvaluator05_' + record.itemNo}
                rules={[
                  {
                    required: true,
                    message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM'),
                  },
                ]}
                initialValue={text}
              >
                <Select
                  style={{ width: 60 }}
                  options={optionList}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input)}
                  onChange={(e) => {
                    const value = e;
                    additionData[index] = {
                      ...additionData[index],
                      pointEvaluator05: value,
                    };
                    dispatch(calculateAdditionTotal05([additionData, settingAchievementAdditional]));

                    // dispatch(calculateEvaluator05Total(achievementData));
                  }}
                />
              </Form.Item>
            )}
          </>
        );
      },
    },
    {
      title: t('IDS_POINT_EVALUATOR_1'),
      dataIndex: 'pointEvaluator1',
      key: 'pointEvaluator1',
      width: '60px',
      align: 'center' as const,
      onCell,
      render: (text: string, record: EvaluationAdditionalAchievement, index: number) => {
        return (
          <>
            {!(
              props.role === 'evaluator' &&
              [57, 58].includes(status) &&
              store.maxOrder === '1.0' &&
              Number(record.evaluationOrder) <= Number(store.maxOrder)
            ) ? (
              <Form.Item style={{ marginBottom: '0px' }} name={'additionPointEvaluator1_' + record.itemNo}>
                <Text>{text}</Text>
              </Form.Item>
            ) : (
              <Form.Item
                style={{ textAlign: 'left', marginBottom: '0px' }}
                name={'additionPointEvaluator1_' + record.itemNo}
                rules={[
                  {
                    required: true,
                    message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM'),
                  },
                ]}
                initialValue={text}
              >
                <Select
                  style={{ width: 60 }}
                  options={optionList}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input)}
                  onChange={(e) => {
                    const value = e;
                    additionData[index] = {
                      ...additionData[index],
                      pointEvaluator1: value,
                    };
                    dispatch(calculateAdditionTotal1([additionData, settingAchievementAdditional]));
                  }}
                />
              </Form.Item>
            )}
          </>
        );
      },
    },
    {
      title: t('IDS_POINT_EVALUATOR_2'),
      dataIndex: 'pointEvaluator2',
      key: 'pointEvaluator2',
      width: '60px',
      align: 'center' as const,
      onCell,
      render: (text: string, record: EvaluationAdditionalAchievement, index: number) => {
        return (
          <>
            {![60, 61].includes(status) ||
            maxOrder !== '2.0' ||
            !isEvaluationDate ||
            props.role === 'admin' ||
            store.isDisable ? (
              <Form.Item style={{ marginBottom: '0px' }} name={'additionPointEvaluator2_' + record.itemNo}>
                <Text>{text}</Text>
              </Form.Item>
            ) : (
              <Form.Item
                style={{ textAlign: 'left', marginBottom: '0px' }}
                name={'additionPointEvaluator2_' + record.itemNo}
                rules={[
                  {
                    required: true,
                    message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM'),
                  },
                ]}
                initialValue={text}
              >
                <Select
                  style={{ width: 60 }}
                  options={optionList}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input)}
                  onChange={(e) => {
                    const value = e;
                    additionData[index] = {
                      ...additionData[index],
                      pointEvaluator2: value,
                    };

                    dispatch(calculateAdditionTotal2([additionData, settingAchievementAdditional]));

                    // dispatch(calculateEvaluator2Total(achievementData));
                  }}
                />
              </Form.Item>
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
      align: 'center' as const,
      render: (_text: string, record: EvaluationAdditionalAchievement, _index: number) => {
        return (
          <Button
            icon={<DeleteOutlined />}
            style={{ color: '#007240 ' }}
            disabled={Number(record.evaluationOrder) > Number(store.maxOrder)}
            onClick={() => {
              setIsOpenPopUpConfirm(true);
              setRecord(record);
            }}
          />
        );
      },
    },
  ].filter((v) => {
    if (props.role === 'user' && !store.isDisable) {
      if ([50, 51, 52].includes(status) && isEvaluationDate) {
        return v.key !== 'pointEvaluator05' && v.key !== 'pointEvaluator2' && v.key !== 'pointEvaluator1';
      }
      if (status < 100) {
        return (
          v.key !== 'pointEvaluator05' &&
          v.key !== 'pointEvaluator2' &&
          v.key !== 'pointEvaluator1' &&
          v.key !== 'action'
        );
      } else {
        if (!comment05Info[0]) buffList2s.push('pointEvaluator05');
        if (!comment1Info[0]) buffList2s.push('pointEvaluator1');
        if (!comment2Info[0]) buffList2s.push('pointEvaluator2');

        return !buffList2s.includes(v.key) && v.key !== 'action';
      }
    } else {
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

        return !buffList.includes(v.key);
      } else {
        if (!comment05Info[0]) buffList1s.push('pointEvaluator05');
        if (!comment1Info[0]) buffList1s.push('pointEvaluator1');
        if (!comment2Info[0]) buffList1s.push('pointEvaluator2');

        return !buffList1s.includes(v.key) && v.key !== 'action';
      }
    }

    return v;
  });
};
export default EvaluationAdditionaDepartmentColumn;
