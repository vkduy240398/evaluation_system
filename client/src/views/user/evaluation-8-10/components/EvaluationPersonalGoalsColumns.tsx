import { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import { EvaluationPersonalAchievementOfUser, EvaluatorInfo } from '../interfaces/response.interface';
import { Button, Col, Form, Input, Row, Select, Tooltip, Typography } from 'antd';
import { CSSProperties, useState } from 'react';
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import Icon from '@ant-design/icons/lib/components/Icon';
import { validateTarget } from './valildateInputField';
import {
  evaluatorTotalPointPersonalGoals05,
  evaluatorTotalPointPersonalGoals1,
  evaluatorTotalPointPersonalGoals2,
  userTotalPointPersonalGoals,
} from '../../../../store/total';
import TextArea from 'antd/es/input/TextArea';

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
  handleTotalUser: () => number | null;
  handleTotalEvaluator05: () => number | null;
  handleTotalEvaluator1: () => number | null;
  handleTotalEvaluator2: () => number | null;
  location: any;
}

const EvaluationPersonalGoalsColumns = (props: Props) => {
  const {
    allowSeeList,
    form,
    isEvaluationDate,
    isGoalDate,
    listEvalutors,
    role,
    status,
    store,
    handleTotalUser,
    handleTotalEvaluator05,
    handleTotalEvaluator1,
    handleTotalEvaluator2,
    maxOrder,
    listPersonalGoals,
    location,
  } = props;
  const { Text } = Typography;
  const [datas, setData] = useState<EvaluationPersonalAchievementOfUser[]>(listPersonalGoals);

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
  const dispatch = useDispatch<AppDispatch>();
  const buffList: string[] = [];
  const buffList1s: string[] = [];
  const buffList2s: string[] = [];

  const isColSpan = (value: any) => value === 'itemRowTotal';

  const shareOnCell3 = (record: any) => {
    if (isColSpan(record.key)) return { colSpan: 3, style: { verticalAlign: 'top', backgroundColor: '#59ad5b78' } };

    return { style: { verticalAlign: 'top' } };
  };

  const shareOnCell = (record: any) => {
    if (isColSpan(record.key)) return { colSpan: 0, style: { verticalAlign: 'top', backgroundColor: '#59ad5b78' } };

    return { style: { verticalAlign: 'top' } };
  };

  const onCell = (record: any) => {
    return {
      style: {
        colSpan: 0,
        verticalAlign: 'middle',
        backgroundColor: record.itemNo === -1 ? '#59ad5b78' : '',
        textAlign: 'center',
      },
    };
  };
  const styleTitle = {
    fontSize: 13,
    backgroundColor: '#007240',
    color: 'white',
    textAlign: 'center',
    margin: -4,
    marginBottom: 4,
    height: '1.8rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    fontWeight: 'bold',
  } as CSSProperties;

  const optionStatusList = [
    {
      label: '達成',
      value: '達成',
    },
    {
      label: '未達成',
      value: '未達成',
    },
  ];
  const filterPersonalForms =
    form.getFieldsValue(['personalGoals']) && form.getFieldsValue(['personalGoals']).personalGoals !== undefined
      ? form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined)
      : [];

  const checkPointIs0 = (point: string | number | null) => {
    return point !== null && point !== '' && Number(point) === 0;
  };
  const SPAN_ICON = 4;
  const FULL_SPAN = 24;
  const calculateSpanAlert0Point = (point: string | number | null): number => {
    if (checkPointIs0(point)) {
      return FULL_SPAN - SPAN_ICON;
    } else {
      return FULL_SPAN;
    }
  };
  const componentAlert0Point = (
    <>
      <Col span={SPAN_ICON}>
        <Tooltip
          title={t('MESSAGE.SCREEN.EVALUATION_CALCULATOR_DETAIL.IDM_ALERT_0_POINT') as string}
          color="#424242"
          overlayInnerStyle={{ fontSize: '11px' }}
        >
          <Icon
            component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
            style={{ cursor: 'default', color: 'red' }}
          />
        </Tooltip>
      </Col>
    </>
  );
  const displayAlert0Point = (point: string | number | null) => {
    if (checkPointIs0(point)) {
      return componentAlert0Point;
    } else {
      return <></>;
    }
  };

  return [
    {
      title: t('IDS_STATUS_ACHIEVED'),
      dataIndex: 'achievementStatus',
      width: '5%',
      align: 'center',
      onCell: shareOnCell3,
      render(value: any, record: any, index: number) {
        return (![50, 51, 52].includes(status) && props.role == 'user') ||
          props.role === 'evaluator' ||
          props.role === 'admin' ||
          !isEvaluationDate ||
          store.isDisable ? (
          <>
            {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
              <div
                style={{
                  ...styleTitle,
                  padding: '5px',
                }}
              >
                {t('IDS_STATUS_ACHIEVED')}
              </div>
            )}
            <Text>{value ? value : ''}</Text>
            <Form.Item
              name={['personalGoals', index, 'achievementStatus']}
              style={{ textAlign: 'center', height: 0, marginBottom: 0, display: 'inline-block' }}
            ></Form.Item>
          </>
        ) : (
          <>
            {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
              <div
                style={{
                  ...styleTitle,
                }}
              >
                {t('IDS_STATUS_ACHIEVED')}
              </div>
            )}
            <Form.Item
              name={['personalGoals', index, 'achievementStatus']}
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
                allowClear
                onChange={(_e) => {
                  setData(filterPersonalForms);
                }}
                style={{
                  textAlign: 'center',
                }}
              />
            </Form.Item>
          </>
        );
      },
    },
    {
      title: t('IDS_REASON_ACHIEVEMENT'),
      dataIndex: 'reasonComment',
      width: '25%',
      onCell: shareOnCell,

      render(value: any, record: any, index: number) {
        return (![50, 51, 52].includes(status) && props.role == 'user') ||
          props.role === 'evaluator' ||
          props.role === 'admin' ||
          !isEvaluationDate ||
          store.isDisable ? (
          <>
            {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
              <div
                style={{
                  ...styleTitle,
                }}
              >
                {t('IDS_REASON_ACHIEVEMENT')}
              </div>
            )}
            <Text>{value}</Text>
            <Form.Item
              name={['personalGoals', index, 'reasonComment']}
              style={{ height: 0, marginBottom: 0, display: 'inline-block' }}
            ></Form.Item>
          </>
        ) : (
          <>
            {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
              <div
                style={{
                  ...styleTitle,
                }}
              >
                {t('IDS_REASON_ACHIEVEMENT')}
              </div>
            )}
            <Form.Item
              name={['personalGoals', index, 'reasonComment']}
              rules={[
                {
                  validator(_rule: any, value: string) {
                    return validateTarget(value, 1000);
                  },
                },
              ]}
              initialValue={value}
            >
              <TextArea autoSize={{ minRows: 1, maxRows: 100 }} style={{ flex: 1 }} maxLength={1001} />
            </Form.Item>
          </>
        );
      },
    },
    {
      title: t('IDS_ACTION_PLAN'),
      dataIndex: 'actionPlan',
      onCell: shareOnCell,

      width: '35%',
      render(value: any, record: any, index: number) {
        return (![50, 51, 52].includes(status) && props.role == 'user') ||
          props.role === 'evaluator' ||
          props.role === 'admin' ||
          !isEvaluationDate ||
          store.isDisable ? (
          <>
            {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
              <div style={styleTitle}>{t('IDS_ACTION_PLAN')}</div>
            )}
            <Text>{value}</Text>
            <Form.Item
              name={['personalGoals', index, 'actionPlan']}
              style={{ height: 0, marginBottom: 0, display: 'inline-block' }}
            ></Form.Item>
          </>
        ) : (
          <>
            {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
              <div style={styleTitle}>{t('IDS_ACTION_PLAN')}</div>
            )}
            <Form.Item
              name={['personalGoals', index, 'actionPlan']}
              rules={[
                {
                  validator(rule, value) {
                    if (
                      filterPersonalForms[index].achievementStatus === '未達成' &&
                      filterPersonalForms[index].achievementStatus !== null
                    ) {
                      if (!value || value === '') {
                        return Promise.reject(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString());
                      }
                      if (value && value !== '' && value.length > 1000) {
                        return Promise.reject(
                          t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', `${1000}`),
                        );
                      }
                    } else {
                      if (value && value !== '' && value.length > 1000) {
                        return Promise.reject(
                          t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', `${1000}`),
                        );
                      }

                      return Promise.resolve();
                    }

                    return Promise.resolve();
                  },
                },
              ]}
              initialValue={value}
            >
              <TextArea autoSize={{ minRows: 1, maxRows: 100 }} style={{ flex: 1 }} maxLength={1001} />
            </Form.Item>
          </>
        );
      },
    },
    {
      title: (
        <>
          {t('IDS_POINT_SELF_USER')}
          <Tooltip title={t('IDS_TOOLTIP_ACHIEVEMENT_COLUMN')} color="#424242" overlayInnerStyle={{ fontSize: '11px' }}>
            <Icon
              component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
              style={{ cursor: 'default', paddingLeft: 2 }}
            />
          </Tooltip>
        </>
      ),
      dataIndex: 'pointUser',
      width: '5%',
      align: 'center' as const,
      onCell: () => {
        return {
          ...onCell,
          style: {
            verticalAlign: 'top',
          },
        };
      },
      render(text: any, record: any, index: number) {
        return (
          <>
            {(![50, 51, 52].includes(status) && props.role == 'user') ||
            props.role === 'evaluator' ||
            props.role === 'admin' ||
            !isEvaluationDate ||
            store.isDisable ? (
              <>
                {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
                  <div
                    style={{
                      ...styleTitle,
                      marginTop: -4,
                    }}
                  >
                    {t('IDS_POINT_SELF_USER')}
                    <Tooltip
                      title={t('IDS_TOOLTIP_ACHIEVEMENT_COLUMN')}
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
                <Text>{text}</Text>
                <Form.Item
                  name={['personalGoals', index, 'pointUser']}
                  style={{ height: 0, marginBottom: 0, display: 'inline-block' }}
                ></Form.Item>
              </>
            ) : (
              <>
                {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
                  <div
                    style={{
                      ...styleTitle,
                    }}
                  >
                    {t('IDS_POINT_SELF_USER')}
                  </div>
                )}
                <Row align="middle">
                  <Col
                    span={
                      datas[index] && datas[index].pointUser !== null && datas[index].pointUser !== ''
                        ? calculateSpanAlert0Point(filterPersonalForms[index]?.pointUser)
                        : FULL_SPAN
                    }
                  >
                    <Form.Item
                      style={{ textAlign: 'center', width: '100%', verticalAlign: 'top' }}
                      name={['personalGoals', index, 'pointUser']}
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
                    >
                      <Input
                        style={{ textAlign: 'center', width: '100%' }}
                        maxLength={3}
                        onChange={(e) => {
                          const filterPersonalForms =
                            form.getFieldsValue(['personalGoals']) &&
                            form.getFieldsValue(['personalGoals']).personalGoals !== undefined
                              ? form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined)
                              : [];
                          filterPersonalForms[index].pointUser =
                            e.target.value !== '' && !isNaN(Number(e.target.value))
                              ? Number(e.target.value)
                              : e.target.value;
                          dispatch(userTotalPointPersonalGoals(handleTotalUser()));
                          setData(filterPersonalForms);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  {datas[index] && datas[index].pointUser !== null && datas[index].pointUser !== ''
                    ? displayAlert0Point(filterPersonalForms[index]?.pointUser)
                    : null}
                </Row>
              </>
            )}
          </>
        );
      },
    },

    //
    {
      title: (
        <>
          {t('IDS_EVALUATOR_0_5')}
          <Tooltip title={t('IDS_TOOLTIP_ACHIEVEMENT_COLUMN')} color="#424242" overlayInnerStyle={{ fontSize: '11px' }}>
            <Icon
              component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
              style={{ cursor: 'default', paddingLeft: 2 }}
            />
          </Tooltip>
        </>
      ),
      dataIndex: 'pointEvaluatorPersonalGoals05',
      width: '5%',
      align: 'center' as const,
      onCell: () => {
        return {
          ...onCell,
          style: {
            verticalAlign: 'top',
          },
        };
      },

      render(text: any, record: any, index: number) {
        return (
          <>
            {!(
              isDisplay05 &&
              [54, 55].includes(props.status) &&
              isEvaluationDate &&
              maxOrder === '0.5' &&
              props.role !== 'admin'
            ) ? (
              <>
                {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
                  <div
                    style={{
                      ...styleTitle,
                      marginTop: -4,
                    }}
                  >
                    {t('IDS_EVALUATOR_0_5')}
                    <Tooltip
                      title={t('IDS_TOOLTIP_ACHIEVEMENT_COLUMN')}
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
                <Form.Item
                  name={['personalGoals', index, 'pointEvaluator05']}
                  style={{ height: 0, marginBottom: 0, display: 'inline-block' }}
                ></Form.Item>
                <Text>{record.pointEvaluator05}</Text>
              </>
            ) : (
              <>
                {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
                  <div
                    style={{
                      ...styleTitle,
                    }}
                  >
                    {t('IDS_EVALUATOR_0_5')}
                    <Tooltip
                      title={t('IDS_TOOLTIP_ACHIEVEMENT_COLUMN')}
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
                <Row align="middle">
                  <Col
                    span={
                      datas[index] && datas[index].pointEvaluator05 !== null && datas[index].pointEvaluator05 !== ''
                        ? calculateSpanAlert0Point(Number(datas[index]?.pointEvaluator05))
                        : FULL_SPAN
                    }
                  >
                    <Form.Item
                      style={{ textAlign: 'center' }}
                      name={['personalGoals', index, 'pointEvaluator05']}
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
                      initialValue={record.pointEvaluator05}
                    >
                      <Input
                        style={{ textAlign: 'center' }}
                        maxLength={3}
                        onChange={(e) => {
                          const filterPersonalForms =
                            form.getFieldsValue(['personalGoals']) &&
                            form.getFieldsValue(['personalGoals']).personalGoals !== undefined
                              ? form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined)
                              : [];

                          filterPersonalForms[index].pointEvaluator05 =
                            e.target.value !== '' && !isNaN(Number(e.target.value))
                              ? Number(e.target.value)
                              : e.target.value;
                          dispatch(evaluatorTotalPointPersonalGoals05(handleTotalEvaluator05()));
                          setData(filterPersonalForms);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  {datas[index] && datas[index].pointEvaluator05 !== null && datas[index].pointEvaluator05 !== ''
                    ? displayAlert0Point(Number(datas[index]?.pointEvaluator05))
                    : ''}
                </Row>
              </>
            )}
          </>
        );
      },
    },

    //
    {
      title: (
        <>
          {t('IDS_POINT_EVALUATOR_1')}
          <Tooltip title={t('IDS_TOOLTIP_ACHIEVEMENT_COLUMN')} color="#424242" overlayInnerStyle={{ fontSize: '11px' }}>
            <Icon
              component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
              style={{ cursor: 'default', paddingLeft: 2 }}
            />
          </Tooltip>
        </>
      ),
      dataIndex: 'pointEvaluatorPersonalGoals1',
      width: '5%',
      align: 'center' as const,
      onCell: () => {
        return {
          ...onCell,
          style: {
            verticalAlign: 'top',
          },
        };
      },

      render(text: any, record: any, index: number) {
        if (isColSpan(record.key)) return 1;

        return (
          <>
            {!(
              isDisplay1 &&
              [57, 58].includes(props.status) &&
              isEvaluationDate &&
              maxOrder === '1.0' &&
              props.role !== 'admin'
            ) ? (
              <>
                {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
                  <div
                    style={{
                      ...styleTitle,
                      marginTop: -4,
                    }}
                  >
                    {t('IDS_POINT_EVALUATOR_1')}
                    <Tooltip
                      title={t('IDS_TOOLTIP_ACHIEVEMENT_COLUMN')}
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
                <Form.Item
                  name={['personalGoals', index, 'pointEvaluator1']}
                  style={{ height: 0, marginBottom: 0, display: 'inline-block' }}
                ></Form.Item>
                <Text>{record.pointEvaluator1}</Text>
              </>
            ) : (
              <>
                {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
                  <div
                    style={{
                      ...styleTitle,
                    }}
                  >
                    {t('IDS_POINT_EVALUATOR_1')}
                    <Tooltip
                      title={t('IDS_TOOLTIP_ACHIEVEMENT_COLUMN')}
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
                <Row align="middle">
                  <Col
                    span={
                      datas[index] && datas[index].pointEvaluator1 !== null && datas[index].pointEvaluator1 !== ''
                        ? calculateSpanAlert0Point(Number(datas[index]?.pointEvaluator1))
                        : FULL_SPAN
                    }
                  >
                    <Form.Item
                      style={{ textAlign: 'center' }}
                      name={['personalGoals', index, 'pointEvaluator1']}
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
                      initialValue={record.pointEvaluator1}
                    >
                      <Input
                        style={{ textAlign: 'center' }}
                        maxLength={3}
                        onChange={(e) => {
                          const filterPersonalForms =
                            form.getFieldsValue(['personalGoals']) &&
                            form.getFieldsValue(['personalGoals']).personalGoals !== undefined
                              ? form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined)
                              : [];
                          filterPersonalForms[index].pointEvaluator1 =
                            e.target.value !== '' && !isNaN(Number(e.target.value))
                              ? Number(e.target.value)
                              : e.target.value;
                          dispatch(evaluatorTotalPointPersonalGoals1(handleTotalEvaluator1()));
                          setData(filterPersonalForms);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  {datas[index] && datas[index].pointEvaluator1 !== null && datas[index].pointEvaluator1 !== ''
                    ? displayAlert0Point(Number(datas[index]?.pointEvaluator1))
                    : ''}
                </Row>
              </>
            )}
          </>
        );
      },
    },
    {
      title: (
        <>
          {t('IDS_POINT_EVALUATOR_2')}
          <Tooltip title={t('IDS_TOOLTIP_ACHIEVEMENT_COLUMN')} color="#424242" overlayInnerStyle={{ fontSize: '11px' }}>
            <Icon
              component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
              style={{ cursor: 'default', paddingLeft: 2 }}
            />
          </Tooltip>
        </>
      ),
      dataIndex: 'pointEvaluatorPersonalGoals2',
      width: '5%',
      align: 'center' as const,
      onCell: () => {
        return {
          ...onCell,
          style: {
            verticalAlign: 'top',
          },
        };
      },

      render(text: any, record: any, index: number) {
        if (isColSpan(record.key)) return 1;

        return (
          <>
            {!(
              isDisplay2 &&
              [60, 61].includes(props.status) &&
              isEvaluationDate &&
              maxOrder === '2.0' &&
              props.role !== 'admin'
            ) ? (
              <>
                {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
                  <div
                    style={{
                      ...styleTitle,
                      marginTop: -4,
                    }}
                  >
                    {t('IDS_POINT_EVALUATOR_2')}
                    <Tooltip
                      title={t('IDS_TOOLTIP_ACHIEVEMENT_COLUMN')}
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
                <Form.Item
                  name={['personalGoals', index, 'pointEvaluator2']}
                  style={{ height: 0, marginBottom: 0, display: 'inline-block' }}
                ></Form.Item>
                <Text>{record.pointEvaluator2}</Text>
              </>
            ) : (
              <>
                {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
                  <div
                    style={{
                      ...styleTitle,
                    }}
                  >
                    {t('IDS_POINT_EVALUATOR_2')}
                    <Tooltip
                      title={t('IDS_TOOLTIP_ACHIEVEMENT_COLUMN')}
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
                <Row align="middle">
                  <Col
                    span={
                      datas[index] && datas[index].pointEvaluator2 !== null && datas[index].pointEvaluator2 !== ''
                        ? calculateSpanAlert0Point(Number(datas[index]?.pointEvaluator2))
                        : FULL_SPAN
                    }
                  >
                    <Form.Item
                      style={{ textAlign: 'center' }}
                      name={['personalGoals', index, 'pointEvaluator2']}
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
                    >
                      <Input
                        style={{ textAlign: 'center' }}
                        maxLength={3}
                        onChange={(e) => {
                          const filterPersonalForms =
                            form.getFieldsValue(['personalGoals']) &&
                            form.getFieldsValue(['personalGoals']).personalGoals !== undefined
                              ? form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined)
                              : [];
                          filterPersonalForms[index].pointEvaluator2 =
                            e.target.value !== '' && !isNaN(Number(e.target.value))
                              ? Number(e.target.value)
                              : e.target.value;
                          dispatch(evaluatorTotalPointPersonalGoals2(handleTotalEvaluator2()));
                          setData(filterPersonalForms);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  {datas[index] && datas[index].pointEvaluator2 !== null && datas[index].pointEvaluator2 !== ''
                    ? displayAlert0Point(Number(datas[index]?.pointEvaluator2))
                    : null}
                </Row>
              </>
            )}
          </>
        );
      },
    },

    {
      title: ' ',
      dataIndex: 'action',
      width: '50px',
      align: 'center' as const,
      render(value: any, record: any, index: number) {
        return (
          <>
            {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
              <div style={{ ...styleTitle }}>&nbsp;</div>
            )}
            {[0, 1, 2].includes(status) && isGoalDate && !store.isDisable && (
              <Button
                icon={<DeleteOutlined />}
                style={{ color: '#007240 ' }}
                disabled={Number(record.evaluationOrder) > Number(store.maxOrder)}
              />
            )}
          </>
        );
      },
    },
  ].filter((v) => {
    if (role === 'user' && !store.isDisable) {
      if ([0, 1, 2].includes(status) && isGoalDate) {
        return (
          v.dataIndex !== 'pointEvaluatorPersonalGoals2' &&
          v.dataIndex !== 'pointEvaluatorPersonalGoals1' &&
          v.dataIndex !== 'pointEvaluatorPersonalGoals05'
        );
      } else if (status < 50 || (status === 50 && !isEvaluationDate)) {
        return (
          v.dataIndex !== 'pointEvaluatorPersonalGoals2' &&
          v.dataIndex !== 'pointEvaluatorPersonalGoals1' &&
          v.dataIndex !== 'pointEvaluatorPersonalGoals05' &&
          v.dataIndex !== 'action'
        );
      } else if (status < 100) {
        return (
          v.dataIndex !== 'pointEvaluatorPersonalGoals2' &&
          v.dataIndex !== 'pointEvaluatorPersonalGoals1' &&
          v.dataIndex !== 'pointEvaluatorPersonalGoals05' &&
          v.dataIndex !== 'action'
        );
      } else {
        if (!comment05Infos[0]) buffList1s.push('pointEvaluatorPersonalGoals05');
        if (!comment1Infos[0]) buffList1s.push('pointEvaluatorPersonalGoals1');
        if (!comment2Infos[0]) buffList1s.push('pointEvaluatorPersonalGoals2');

        return !buffList1s.includes(v.dataIndex) && v.dataIndex !== 'action';
      }
    } else {
      if (status < 50 || (status === 50 && !isEvaluationDate)) {
        return (
          v.dataIndex !== 'pointEvaluatorPersonalGoals2' &&
          v.dataIndex !== 'pointEvaluatorPersonalGoals1' &&
          v.dataIndex !== 'pointEvaluatorPersonalGoals05' &&
          v.dataIndex !== 'action'
        );
      }
      if (status < 100) {
        if (
          !isDisplay05 ||
          (isDisplay05 && status < 54) ||
          (location.evaluatorOrderExcep && !(location.evaluatorOrderExcep >= 0.5))
        )
          buffList.push('pointEvaluatorPersonalGoals05');
        if (
          !isDisplay1 ||
          (isDisplay1 && status < 57) ||
          (location.evaluatorOrderExcep && !(location.evaluatorOrderExcep >= 1))
        )
          buffList.push('pointEvaluatorPersonalGoals1');
        if (
          !isDisplay2 ||
          (isDisplay2 && status < 60) ||
          (location.evaluatorOrderExcep && !(location.evaluatorOrderExcep >= 2) && props.role !== 'admin')
        )
          buffList.push('pointEvaluatorPersonalGoals2');

        return !buffList.includes(v.dataIndex) && v.dataIndex !== 'action';
      } else {
        if (!comment05Infos[0]) buffList1s.push('pointEvaluatorPersonalGoals05');
        if (!comment1Infos[0]) buffList1s.push('pointEvaluatorPersonalGoals1');
        if (!comment2Infos[0]) buffList1s.push('pointEvaluatorPersonalGoals2');

        return !buffList1s.includes(v.dataIndex) && v.dataIndex !== 'action';
      }
    }
  }) as ColumnsType<any>;
};
export default EvaluationPersonalGoalsColumns;
