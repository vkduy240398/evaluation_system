/* eslint-disable @typescript-eslint/naming-convention */
import { Select, Table, Tooltip, Typography } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { t } from 'i18next';
import { checkDisplaySumPoint, roundNumber } from './checkDisplayCondition';
import {
  EvaluationInfo,
  EvaluatorInfo,
  SettingAchievementAdditional,
  SettingFormula810,
} from './interfaces/response.interface';
import { InfoCircleOutlined } from '@ant-design/icons';
import { get2WithoutRound } from './components/valildateInputField';
import { hasNonNullOrUndefinedPoint } from '../../../common/util';
interface Props {
  dataSource: any;
  additionData: any;
  status: number;
  role: string;
  listEvalutor: EvaluatorInfo[];
  allowSeeList: EvaluatorInfo[];
  checkList: EvaluatorInfo[];
  setCheckList: (data: EvaluatorInfo) => void;
  Form: any;
  isEvaluationDate: boolean;
  evaluationData: EvaluationInfo;
  form: any;
  settingAchievementAdditional: SettingAchievementAdditional[];
  settingFormula810: SettingFormula810[];
  maxPointSettingFormula810: number;
  minPointSettingFormula810: number;
  isReview?: boolean;
  typeReview?: number;
  location: any;
  isLoading?: boolean;
}
const TotalComp8: React.FC<any> = (props: Props) => {
  const { Text } = Typography;
  const {
    dataSource,
    additionData,
    status,
    Form,
    checkList,
    isEvaluationDate,
    evaluationData,
    form,
    role,
    settingAchievementAdditional,
    settingFormula810,
    maxPointSettingFormula810,
    minPointSettingFormula810,
    isReview,
    typeReview,
    location,
    listEvalutor,
    isLoading,
  } = props;

  const store = useSelector((state: RootState) => state);

  const totalUser =
    store.calculateTotal.userSum == null && store.calculateTotal.additionSum == null
      ? null
      : Number(store.calculateTotal.userSum) + Number(store.calculateTotal.additionSum);

  const totalUser05 =
    store.calculateTotal.sumEvaluator05 == null && store.calculateTotal.additionSum05 == null
      ? null
      : Number(store.calculateTotal.sumEvaluator05) + Number(store.calculateTotal.additionSum05);

  const totalUser1 =
    store.calculateTotal.sumEvaluator1 == null && store.calculateTotal.additionSum1 == null
      ? null
      : Number(store.calculateTotal.sumEvaluator1) + Number(store.calculateTotal.additionSum1);

  const totalUser2 =
    store.calculateTotal.sumEvaluator2 == null && store.calculateTotal.additionSum2 == null
      ? null
      : Number(store.calculateTotal.sumEvaluator2) + Number(store.calculateTotal.additionSum2);

  const maxPoint = Number(maxPointSettingFormula810);
  const minPoint = Number(minPointSettingFormula810);

  //processing selectbox option list
  const optionList: any[] | undefined = [];
  settingFormula810 &&
    settingFormula810.map((item: SettingFormula810) => {
      optionList.push({
        label: item.result,
        value: item.result,
      });
    });

  const covertValueToChar = (num: string) => {
    const value = Number(num);
    const smallerList: string[] = [];
    settingFormula810.map((item: SettingFormula810) => {
      if (item.point <= value) {
        smallerList.push(item.result);
      }
    });
    let result = '';
    if (smallerList) {
      result = smallerList[0];
    }

    return result;
  };
  const renderColumnTitle = (title: string) => {
    return (
      <>
        {title}
        <Tooltip
          overlayStyle={{ whiteSpace: 'pre-line' }}
          title={`${t('IDS_DEPARTMENT_RESULTS')} + ${t('IDS_ACHIEVEMENT_ADDITIONAL')} = ${t(
            'IDS_TOTAL_POINT_EVALUATION',
          )} (${t('IDS_MIN_POINT')}：${minPoint}～${t('IDS_MAX_POINT')}：${maxPoint})`}
        >
          <InfoCircleOutlined style={{ paddingLeft: 2 }} />
        </Tooltip>
      </>
    );
  };

  const renderColumnTitlePersionalReview = (title: string) => {
    const sortedResults = settingFormula810?.sort((a: any, b: any) => b.point - a.point);
    const results = sortedResults?.map((item: any) => item.result);
    const settingFormulaChar = results.join('・');

    return (
      <>
        {title}
        <Tooltip
          overlayStyle={{ whiteSpace: 'pre-line' }}
          title={t('IDS_TOOLTIP_PERSIONAL_REVIEW').replace('{setting}', settingFormulaChar)}
        >
          <InfoCircleOutlined style={{ paddingLeft: 2 }} />
        </Tooltip>
      </>
    );
  };
  const tab1 =
    store.calculateTotal.userSum !== null && hasNonNullOrUndefinedPoint(dataSource, 'coefficientUser')
      ? store.calculateTotal.userSum.toFixed(2)
      : '';
  const tab2 =
    store.calculateTotal.additionSum !== null && hasNonNullOrUndefinedPoint(additionData, 'pointUser')
      ? get2WithoutRound(store.calculateTotal.additionSum)
      : '';
  const summaryPoint =
    tab1 === '' && tab2 === ''
      ? ''
      : totalUser
      ? roundNumber(totalUser.toFixed(2))
      : !isNaN(parseFloat(evaluationData.summaryPointUser)) &&
        roundNumber(parseFloat(evaluationData.summaryPointUser).toFixed(2));

  const charPoint =
    summaryPoint === ''
      ? ''
      : totalUser
      ? covertValueToChar(roundNumber(totalUser.toFixed(2)))
      : evaluationData.summaryCharPointUser;

  const dataSources = [
    {
      key: 0,
      user: t('IDS_POINT_USER'),
      tab1: tab1,
      tab2: tab2,
      charPoint: charPoint,
      summaryPoint: summaryPoint,
    },
  ];

  const dataSource2s: {
    key: number;
    user: string;
    charPoint: string;
    summaryPoint: string | boolean;
    tab1: string | null;
    tab2: string | number | null;
  }[] = [...dataSources];
  if (checkList.length) {
    checkList.forEach((item: EvaluatorInfo) => {
      if (item.evaluationOrder === '0.5' && status > 53) {
        const tab105 =
          store.calculateTotal.sumEvaluator05 !== null &&
          hasNonNullOrUndefinedPoint(dataSource, 'coefficientEvaluator05')
            ? store.calculateTotal.sumEvaluator05.toFixed(2)
            : '';
        const tab205 =
          store.calculateTotal.additionSum05 !== null && hasNonNullOrUndefinedPoint(additionData, 'pointEvaluator05')
            ? get2WithoutRound(store.calculateTotal.additionSum05)
            : '';
        const summaryPoint05 =
          tab105 === '' && tab205 === ''
            ? ''
            : totalUser05
            ? roundNumber(totalUser05.toFixed(2))
            : !isNaN(parseFloat(evaluationData.summaryPointEvaluator05)) &&
              roundNumber(parseFloat(evaluationData.summaryPointEvaluator05).toFixed(2));
        const charPoint05 =
          summaryPoint05 === ''
            ? ''
            : totalUser05
            ? covertValueToChar(roundNumber(totalUser05.toFixed(2)))
            : evaluationData.summaryCharPointEvaluator05;

        dataSource2s[1] = {
          key: 1,
          user: t('IDS_EVALUATOR_0_5'),
          tab1: tab105,
          tab2: tab205,
          charPoint: charPoint05,
          summaryPoint: summaryPoint05,
        };
      }

      if (item.evaluationOrder === '1.0' && status > 56) {
        const tab11 =
          store.calculateTotal.sumEvaluator1 !== null && hasNonNullOrUndefinedPoint(dataSource, 'coefficientEvaluator1')
            ? store.calculateTotal.sumEvaluator1.toFixed(2)
            : '';
        const tab21 =
          store.calculateTotal.additionSum1 !== null && hasNonNullOrUndefinedPoint(additionData, 'pointEvaluator1')
            ? get2WithoutRound(store.calculateTotal.additionSum1)
            : '';
        const summaryPoint1 =
          tab11 === '' && tab21 === ''
            ? ''
            : totalUser1
            ? roundNumber(totalUser1.toFixed(2))
            : !isNaN(parseFloat(evaluationData.summaryPointEvaluator1)) &&
              roundNumber(parseFloat(evaluationData.summaryPointEvaluator1).toFixed(2));
        const charPoint1 =
          summaryPoint1 === ''
            ? ''
            : totalUser1
            ? covertValueToChar(roundNumber(totalUser1.toFixed(2)))
            : evaluationData.summaryCharPointEvaluator1;

        dataSource2s[2] = {
          key: 2,
          user: t('IDS_POINT_EVALUATOR_1'),
          tab1: tab11,
          tab2: tab21,
          charPoint: charPoint1,
          summaryPoint: summaryPoint1,
        };
      }

      if (item.evaluationOrder === '2.0' && status > 59) {
        const tab12 =
          store.calculateTotal.sumEvaluator2 !== null && hasNonNullOrUndefinedPoint(dataSource, 'coefficientEvaluator2')
            ? store.calculateTotal.sumEvaluator2.toFixed(2)
            : '';
        const tab22 =
          store.calculateTotal.additionSum2 !== null && hasNonNullOrUndefinedPoint(additionData, 'pointEvaluator2')
            ? get2WithoutRound(store.calculateTotal.additionSum2)
            : '';
        const summaryPoint2 =
          tab12 === '' && tab22 === ''
            ? ''
            : totalUser2
            ? roundNumber(totalUser2.toFixed(2))
            : !isNaN(parseFloat(evaluationData.summaryPointEvaluator2)) &&
              roundNumber(parseFloat(evaluationData.summaryPointEvaluator2).toFixed(2));
        const charPoint2 =
          summaryPoint2 === ''
            ? ''
            : totalUser2
            ? covertValueToChar(roundNumber(totalUser2.toFixed(2)))
            : evaluationData.summaryCharPointEvaluator2;
        dataSource2s[3] = {
          key: 3,
          user: t('IDS_POINT_EVALUATOR_2'),
          tab1: tab12,
          tab2: tab22,
          charPoint: charPoint2,
          summaryPoint: summaryPoint2,
        };
      }
    });
  }

  const initialValue = (type: string) => {
    if (type == t('IDS_EVALUATOR_0_5')) {
      return evaluationData.summaryDepartment.summaryCharPointEvaluator05;
    }
    if (type == t('IDS_POINT_EVALUATOR_1')) {
      return evaluationData.summaryDepartment.summaryCharPointEvaluator1;
    }
    if (type == t('IDS_POINT_EVALUATOR_2')) {
      return evaluationData.summaryDepartment.summaryCharPointEvaluator2;
    }
    if (type == t('IDS_POINT_USER')) {
      return totalUser !== null
        ? [50, 51, 52].includes(status)
          ? covertValueToChar(roundNumber(totalUser.toFixed(2)))
          : evaluationData.summaryDepartment.summaryCharPointUser
        : '';
    }
  };

  return (
    <>
      <Typography.Title level={4}>{t('IDS_DIVISION_EVALUATION')}</Typography.Title>
      <Form form={form}>
        <Table
          size="small"
          bordered
          columns={[
            {
              title: ' ',
              dataIndex: 'user',
              align: 'center' as const,
              width: '50px',
            },
            {
              title: t('IDS_DEPARTMENT_RESULTS'),
              dataIndex: 'tab1',
              align: 'center' as const,
              width: '50px',
            },
            {
              title: t('IDS_ACHIEVEMENT_ADDITIONAL'),
              dataIndex: 'tab2',
              align: 'center' as const,
              width: '50px',
            },
            {
              title: renderColumnTitle(t('IDS_DEPARTMENT_EVALUATION_METER')),
              dataIndex: 'summaryPoint',
              align: 'center' as const,
              width: '100px',
              render: (
                text: string,
                record: { key: number; user: string; charPoint: string; summaryPoint: string | boolean },
              ) => {
                return (
                  <>
                    {(record.user == t('IDS_EVALUATOR_0_5') &&
                      (([54, 55].includes(status) && (store.calculateTotal.maxOrder !== '0.5' || !isEvaluationDate)) ||
                        ![54, 55].includes(status))) ||
                    (record.user == t('IDS_POINT_EVALUATOR_1') &&
                      (([57, 58].includes(status) && (store.calculateTotal.maxOrder !== '1.0' || !isEvaluationDate)) ||
                        ![57, 58].includes(status))) ||
                    (record.user == t('IDS_POINT_EVALUATOR_2') &&
                      (([60, 61].includes(status) && (store.calculateTotal.maxOrder !== '2.0' || !isEvaluationDate)) ||
                        ![60, 61].includes(status))) ||
                    record.user == t('IDS_POINT_USER') ||
                    (role === 'evaluator' && [50, 51, 52].includes(status)) ||
                    (role === 'user' && status === 50 && !isEvaluationDate) ||
                    role === 'admin' ||
                    store.calculateTotal.isDisable ? (
                      <Text>
                        {text ? roundNumber(Math.min(Math.max(Number(text), minPoint), maxPoint).toFixed(2)) : text}
                      </Text>
                    ) : (
                      <div>
                        {checkDisplaySumPoint(
                          record.user,
                          store,
                          record,
                          settingFormula810,
                          evaluationData,
                          maxPoint,
                          minPoint,
                        )}
                      </div>
                    )}
                  </>
                );
              },
            },
            {
              title: renderColumnTitlePersionalReview(t('IDS_EVALUATION_PERSONAL')),
              dataIndex: 'charPoint',
              align: 'center' as const,
              width: '100px',
              render: (
                _text: string,
                record: { key: number; user: string; charPoint: string; summaryPoint: string | boolean },
                index: number,
              ) => {
                return (
                  <>
                    {(record.user == t('IDS_EVALUATOR_0_5') &&
                      (([54, 55].includes(status) && (store.calculateTotal.maxOrder !== '0.5' || !isEvaluationDate)) ||
                        ![54, 55].includes(status))) ||
                    (record.user == t('IDS_POINT_EVALUATOR_1') &&
                      (([57, 58].includes(status) && (store.calculateTotal.maxOrder !== '1.0' || !isEvaluationDate)) ||
                        ![57, 58].includes(status))) ||
                    (record.user == t('IDS_POINT_EVALUATOR_2') &&
                      (([60, 61].includes(status) && (store.calculateTotal.maxOrder !== '2.0' || !isEvaluationDate)) ||
                        ![60, 61].includes(status))) ||
                    record.user == t('IDS_POINT_USER') ||
                    (role === 'evaluator' && [50, 51, 52].includes(status)) ||
                    (role === 'user' && status === 50 && !isEvaluationDate) ||
                    role === 'admin' ||
                    store.calculateTotal.isDisable ? (
                      <Text>{initialValue(record.user)}</Text>
                    ) : (
                      <Form.Item
                        style={{ marginBottom: '0px' }}
                        name={'charPoint_' + record.user}
                        rules={[
                          {
                            required: true,
                            message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM'),
                          },
                        ]}
                        initialValue={initialValue(record.user)}
                      >
                        <Select
                          style={{ width: 60 }}
                          onChange={(e) => {
                            const value = e;
                            checkList[index] = {
                              ...checkList[index],
                              charPoint: value || null,
                              evaluator: record.user,
                            };
                          }}
                          options={optionList}
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input)}
                          loading={isLoading}
                        ></Select>
                      </Form.Item>
                    )}
                  </>
                );
              },
            },
          ]}
          dataSource={
            (props.role === 'user' && props.status === 100) || (props.role !== 'user' && props.status > 3)
              ? dataSource2s
              : dataSources
          }
          pagination={false}
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
        />
      </Form>
    </>
  );
};

export default TotalComp8;
