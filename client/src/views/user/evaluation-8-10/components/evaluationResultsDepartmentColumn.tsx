/* eslint-disable @typescript-eslint/naming-convention */
import { Col, Input, Row, Select, Tooltip, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {
  calculateEvaluator05Total,
  calculateEvaluator1Total,
  calculateEvaluator2Total,
  calculateUserTotal,
} from '../../../../store/total';
import { validateActionPlan, validateDifficulty, validateTarget } from './valildateInputField';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { t } from 'i18next';
import {
  EvaluationPersonalAchievement,
  EvaluatorInfo,
  SettingAchievementPersonal,
} from '../interfaces/response.interface';
import { InfoCircleOutlined } from '@ant-design/icons';
import { CSSProperties, useState } from 'react';
import Icon from '@ant-design/icons/lib/components/Icon';
import { FormInstance } from 'antd/lib';
interface Props {
  status: number;
  dataSource: EvaluationPersonalAchievement[];
  setDataSource: (data: EvaluationPersonalAchievement[]) => void;
  role: string;
  Form: any;
  allowSeeList: EvaluatorInfo[];
  maxOrder: string;
  listEvalutor: EvaluatorInfo[];
  form: FormInstance;
  isEvaluationDate: boolean;
  settingAchievementPersonalType2: SettingAchievementPersonal[];
  store: any;
  location: any;
}
const EvaluationResultsDepartmentColumn = (props: Props) => {
  const {
    status,
    dataSource,
    Form,
    allowSeeList,
    maxOrder,
    listEvalutor,
    form,
    isEvaluationDate,
    settingAchievementPersonalType2,
    role,
    store,
    location,
  } = props;
  const dispatch = useDispatch<AppDispatch>();
  const { Text } = Typography;
  const [data, setData] = useState<EvaluationPersonalAchievement[]>(dataSource);

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
  let isDisplay05: boolean = role === 'admin' && comment05Info.length > 0;
  let isDisplay1: boolean = role === 'admin' && comment1Info.length > 0;
  let isDisplay2: boolean = role === 'admin' && comment2Info.length > 0;

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
  const buffList: string[] = [];
  const buffList1s: string[] = [];
  const buffList2s: string[] = [];
  for (let i = 0; i < dataSource.length; i++) {
    form.setFieldsValue({
      [`pointUser_${dataSource[i].itemNo}`]: dataSource[i]?.pointUser,
      [`pointEvaluator05_${dataSource[i].itemNo}`]: dataSource[i]?.pointEvaluator05,
      [`pointEvaluator1_${dataSource[i].itemNo}`]: dataSource[i]?.pointEvaluator1,
      [`pointEvaluator2_${dataSource[i].itemNo}`]: dataSource[i]?.pointEvaluator2,
    });
  }

  //processing selectbox option list
  const optionList: any[] | undefined = [];
  settingAchievementPersonalType2.map((item: SettingAchievementPersonal) => {
    optionList.push({
      label: item.point
        ? Number.isInteger(Number(item.point))
          ? Number(item.point).toFixed(1)
          : Number(item.point).toString()
        : '0',
      value: item.point,
    });
  });

  const renderColumnTitle = (title: string, tooltipTitle: string) => {
    return (
      <>
        {title}
        <Tooltip title={tooltipTitle} overlayInnerStyle={{ fontSize: '11px' }}>
          <InfoCircleOutlined style={{ paddingLeft: 2 }} />
        </Tooltip>
      </>
    );
  };

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

  const styleSpanSubtitle = {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 5,
    transform: 'translateX(50%)',
    background: '#007240',
  } as CSSProperties;

  const checkPointIs0 = (point: string | number | undefined) => {
    return point !== null && point !== undefined && point !== '' && Number(point) === 0;
  };
  const SPAN_ICON = 6;
  const FULL_SPAN = 24;
  const OFFSET = 2;

  const calculateSpanAlert0Point = (point: string | number | undefined): number => {
    if (checkPointIs0(point)) {
      return FULL_SPAN - SPAN_ICON - OFFSET;
    } else {
      return FULL_SPAN;
    }
  };
  const componentAlert0Point = (
    <>
      <Col span={SPAN_ICON} offset={OFFSET}>
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
  const displayAlert0Point = (point: string | number | undefined) => {
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
      key: 'achievementStatus',
      align: 'center' as const,
      width: '60px',
      onCell,
      render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
        return (
          <>
            {index !== 0 && <div style={styleTitle}>{t('IDS_STATUS_ACHIEVED')}</div>}
            {(![50, 51, 52].includes(status) && props.role == 'user') ||
            props.role === 'evaluator' ||
            props.role === 'admin' ||
            !isEvaluationDate ||
            store.isDisable ? (
              <Text style={{ whiteSpace: 'pre-wrap', minHeight: '22px', display: 'block' }}>{text}</Text>
            ) : (
              <Form.Item
                style={{ textAlign: 'left', marginBottom: '0px' }}
                name={'achievementStatus_' + record.itemNo}
                rules={[
                  {
                    required: true,
                    message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM'),
                  },
                ]}
                initialValue={dataSource[index].achievementStatus ?? ''}
              >
                <Select
                  style={{ width: 80 }}
                  options={[
                    { value: t('IDS_ACHIEVED'), label: t('IDS_ACHIEVED') },
                    { value: t('IDS_NOT_ACHIEVE'), label: t('IDS_NOT_ACHIEVE') },
                  ]}
                  onChange={(e) => {
                    dataSource[index] = {
                      ...dataSource[index],
                      achievementStatus: e,
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
      title: t('IDS_REASON_ACHIEVEMENT'),
      dataIndex: 'reasonComment',
      key: 'reasonComment',
      onCell,
      render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
        return (
          <>
            {index !== 0 && <div style={styleTitle}>{t('IDS_REASON_ACHIEVEMENT')}</div>}
            {(![50, 51, 52].includes(status) && props.role == 'user') ||
            props.role === 'evaluator' ||
            props.role === 'admin' ||
            !isEvaluationDate ||
            store.isDisable ? (
              <Text>{text}</Text>
            ) : (
              <Form.Item
                style={{ marginBottom: '0px' }}
                name={'reasonComment_' + record.itemNo}
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
                  name={'reason_' + record.itemNo}
                  maxLength={1001}
                  autoSize={{ minRows: 1, maxRows: 100 }}
                  onChange={(e) => {
                    const value = e.target.value;
                    dataSource[index] = { ...dataSource[index], reasonComment: value };
                  }}
                />
              </Form.Item>
            )}
          </>
        );
      },
    },
    {
      title: <div style={{ whiteSpace: 'pre-wrap' }}>{t('IDS_ACTION_PLAN_AND_INCIDENT_RECORD')}</div>,
      dataIndex: 'actionPlan',
      key: 'actionPlan',
      width: '45%',
      onCell,
      render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
        return (
          <>
            {index !== 0 && <div style={styleTitle}>{t('IDS_ACTION_PLAN_AND_INCIDENT_RECORD')}</div>}
            {(![50, 51, 52].includes(status) && props.role == 'user') ||
            props.role === 'evaluator' ||
            props.role === 'admin' ||
            !isEvaluationDate ||
            store.isDisable ? (
              <Text>{text}</Text>
            ) : (
              <Form.Item
                style={{ marginBottom: '0px' }}
                name={'actionPlan_' + record.itemNo}
                rules={[
                  {
                    validator(_rule: any, value: string) {
                      return validateActionPlan(value, 1000, form, record);
                    },
                  },
                ]}
                initialValue={text}
              >
                <TextArea
                  name={'action_' + record.itemNo}
                  maxLength={1001}
                  autoSize={{ minRows: 1, maxRows: 100 }}
                  onChange={(e) => {
                    const value = e.target.value;
                    dataSource[index] = { ...dataSource[index], actionPlan: value };
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
      key: 'user',
      children: [
        {
          title: renderColumnTitle(t('IDS_POINT'), t('IDS_FORMULA_EXPLAIN')),
          dataIndex: 'pointUser',
          key: 'pointUser',
          width: '60px',
          align: 'center' as const,
          onCell,
          render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
            return (
              <>
                {index !== 0 && (
                  <div style={{ ...styleTitle, flexDirection: 'column', overflow: 'unset' }}>
                    <div style={{ borderBottom: '1px solid #BABABA', width: '100%', position: 'relative' }}>
                      <span style={styleSpanSubtitle} className="title-css">
                        {t('IDS_POINT_USER')}
                      </span>
                      <span style={{ opacity: 0, userSelect: 'none' }}>{t('IDS_POINT_USER')}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {renderColumnTitle(t('IDS_POINT'), t('IDS_FORMULA_EXPLAIN'))}
                    </div>
                  </div>
                )}
                {(![50, 51, 52].includes(status) && props.role == 'user') ||
                props.role === 'evaluator' ||
                props.role === 'admin' ||
                !isEvaluationDate ||
                store.isDisable ? (
                  <Text>{text}</Text>
                ) : (
                  <Row align={'middle'}>
                    <Col span={calculateSpanAlert0Point(data[index].pointUser)}>
                      <Form.Item
                        style={{ textAlign: 'left', marginBottom: '0px' }}
                        name={'pointUser_' + record.itemNo}
                        rules={[
                          {
                            validator(_rule: any, value: number) {
                              return validateDifficulty(value);
                            },
                          },
                        ]}
                        initialValue={dataSource[index].pointUser ?? text}
                      >
                        <Input
                          style={{ textAlign: 'center' }}
                          name={'pointUser_' + record.itemNo}
                          maxLength={3}
                          onChange={(e) => {
                            // const value = isNotNumber(e.target.value) ? null : e.target.value;
                            dataSource[index] = {
                              ...dataSource[index],
                              pointUser: e.target.value,
                            };

                            setData((data) =>
                              data.map((item, itemIndex) => {
                                if (itemIndex === index) {
                                  return { ...item, pointUser: e.target.value };
                                } else {
                                  return item;
                                }
                              }),
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {displayAlert0Point(data[index].pointUser)}
                  </Row>
                )}
              </>
            );
          },
        },
        {
          title: renderColumnTitle(t('IDS_COEFFICIENT'), t('IDS_TOOLTIP_COEFFICIENT_EXPLANATION')),
          dataIndex: 'coefficientUser',
          key: 'coefficientUser',
          width: '60px',
          align: 'center' as const,
          onCell,
          render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
            return (
              <>
                {index !== 0 && (
                  <div style={{ ...styleTitle, flexDirection: 'column' }}>
                    <div style={{ borderBottom: '1px solid #BABABA', width: '100%' }}>
                      <span style={{ opacity: 0, userSelect: 'none' }}>{t('IDS_POINT_USER')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {renderColumnTitle(t('IDS_COEFFICIENT'), t('IDS_TOOLTIP_COEFFICIENT_EXPLANATION'))}
                    </div>
                  </div>
                )}
                {(![50, 51, 52].includes(status) && props.role == 'user') ||
                props.role === 'evaluator' ||
                props.role === 'admin' ||
                !isEvaluationDate ||
                store.isDisable ? (
                  <Text>{text && parseFloat(text).toFixed(1)}</Text>
                ) : (
                  <Form.Item
                    style={{ textAlign: 'center', marginBottom: '0px' }}
                    name={'coefficientUser_' + record.itemNo}
                    rules={[
                      {
                        required: true,
                        message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM'),
                      },
                    ]}
                    initialValue={text && parseFloat(text).toFixed(1)}
                  >
                    <Select
                      id={'coefficientUser_' + record.itemNo}
                      showSearch
                      onChange={(e) => {
                        dataSource[index] = {
                          ...dataSource[index],
                          coefficientUser: e,
                        };
                        dispatch(calculateUserTotal(dataSource));
                      }}
                      style={{ width: 70 }}
                      options={optionList}
                      allowClear
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
      title: t('IDS_EVALUATION_0_5'),
      key: 'column05',
      children: [
        {
          title: renderColumnTitle(t('IDS_POINT'), t('IDS_FORMULA_EXPLAIN')),
          dataIndex: 'pointEvaluator05',
          key: 'pointEvaluator05',
          width: '60px',
          align: 'center' as const,
          onCell,
          render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
            return (
              <>
                {index !== 0 && (
                  <div style={{ ...styleTitle, flexDirection: 'column', overflow: 'unset' }}>
                    <div style={{ borderBottom: '1px solid #BABABA', width: '100%', position: 'relative' }}>
                      <span style={styleSpanSubtitle} className="title-css">
                        {t('IDS_EVALUATION_0_5')}
                      </span>
                      <span style={{ opacity: 0, userSelect: 'none' }}>{t('IDS_EVALUATION_0_5')}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {renderColumnTitle(t('IDS_POINT'), t('IDS_FORMULA_EXPLAIN'))}
                    </div>
                  </div>
                )}
                {![54, 55].includes(status) ||
                maxOrder !== '0.5' ||
                !isEvaluationDate ||
                props.role === 'admin' ||
                store.isDisable ? (
                  <Text>{text}</Text>
                ) : (
                  <Row align={'middle'}>
                    <Col span={calculateSpanAlert0Point(data[index].pointEvaluator05)}>
                      <Form.Item
                        style={{ textAlign: 'left', marginBottom: '0px' }}
                        name={'pointEvaluator05_' + record.itemNo}
                        rules={[
                          {
                            validator(_rule: any, value: number) {
                              return validateDifficulty(value);
                            },
                          },
                        ]}
                        initialValue={dataSource[index].pointEvaluator05 ?? text}
                      >
                        <Input
                          style={{ textAlign: 'center' }}
                          maxLength={3}
                          onChange={(e) => {
                            // const value = isNotNumber(e.target.value) ? null : e.target.value;
                            dataSource[index] = { ...dataSource[index], pointEvaluator05: e.target.value };

                            setData((data) =>
                              data.map((item, itemIndex) => {
                                if (itemIndex === index) {
                                  return { ...item, pointEvaluator05: e.target.value };
                                } else {
                                  return item;
                                }
                              }),
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {displayAlert0Point(data[index].pointEvaluator05)}
                  </Row>
                )}
              </>
            );
          },
        },
        {
          title: renderColumnTitle(t('IDS_COEFFICIENT'), t('IDS_TOOLTIP_COEFFICIENT_EXPLANATION')),
          dataIndex: 'coefficientEvaluator05',
          key: 'coefficientEvaluator05',
          width: '60px',
          align: 'center' as const,
          onCell,
          render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
            return (
              <>
                {index !== 0 && (
                  <div style={{ ...styleTitle, flexDirection: 'column' }}>
                    <div style={{ borderBottom: '1px solid #BABABA', width: '100%' }}>
                      <span style={{ opacity: 0, userSelect: 'none' }}>{t('IDS_EVALUATION_0_5')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {renderColumnTitle(t('IDS_COEFFICIENT'), t('IDS_TOOLTIP_COEFFICIENT_EXPLANATION'))}
                    </div>
                  </div>
                )}
                {![54, 55].includes(status) ||
                maxOrder !== '0.5' ||
                !isEvaluationDate ||
                props.role === 'admin' ||
                store.isDisable ? (
                  <Text>{text && parseFloat(text).toFixed(1)}</Text>
                ) : (
                  <Form.Item
                    style={{ textAlign: 'center', marginBottom: '0px' }}
                    name={'coefficientEvaluator05_' + record.itemNo}
                    rules={[
                      {
                        required: true,
                        message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM'),
                      },
                    ]}
                    initialValue={text && parseFloat(text).toFixed(1)}
                  >
                    <Select
                      id="user_coefficien"
                      showSearch
                      onChange={(e) => {
                        dataSource[index] = {
                          ...dataSource[index],
                          coefficientEvaluator05: e,
                        };
                        dispatch(calculateEvaluator05Total(dataSource));
                      }}
                      style={{ width: 70 }}
                      options={optionList}
                      allowClear
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
      title: t('IDS_POINT_EVALUATOR_1'),
      key: 'column1',
      children: [
        {
          title: renderColumnTitle(t('IDS_POINT'), t('IDS_FORMULA_EXPLAIN')),
          dataIndex: 'pointEvaluator1',
          key: 'pointEvaluator1',
          width: '60px',
          align: 'center' as const,
          onCell,
          render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
            return (
              <>
                {index !== 0 && (
                  <div style={{ ...styleTitle, flexDirection: 'column', overflow: 'unset' }}>
                    <div style={{ borderBottom: '1px solid #BABABA', width: '100%', position: 'relative' }}>
                      <span style={styleSpanSubtitle} className="title-css">
                        {t('IDS_POINT_EVALUATOR_1')}
                      </span>
                      <span style={{ opacity: 0, userSelect: 'none' }}>{t('IDS_POINT_EVALUATOR_1')}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {renderColumnTitle(t('IDS_POINT'), t('IDS_FORMULA_EXPLAIN'))}
                    </div>
                  </div>
                )}
                {![57, 58].includes(status) ||
                maxOrder !== '1.0' ||
                !isEvaluationDate ||
                props.role === 'admin' ||
                store.isDisable ? (
                  <Text>{text}</Text>
                ) : (
                  <Row align={'middle'}>
                    <Col span={calculateSpanAlert0Point(data[index].pointEvaluator1)}>
                      <Form.Item
                        style={{ textAlign: 'left', marginBottom: '0px' }}
                        name={'pointEvaluator1_' + record.itemNo}
                        rules={[
                          {
                            validator(_rule: any, value: number) {
                              return validateDifficulty(value);
                            },
                          },
                        ]}
                        initialValue={dataSource[index].pointEvaluator1 ?? text}
                      >
                        <Input
                          style={{ textAlign: 'center' }}
                          maxLength={3}
                          onChange={(e) => {
                            // const value = isNotNumber(e.target.value) ? null : e.target.value;
                            dataSource[index] = { ...dataSource[index], pointEvaluator1: e.target.value };

                            setData((data) =>
                              data.map((item, itemIndex) => {
                                if (itemIndex === index) {
                                  return { ...item, pointEvaluator1: e.target.value };
                                } else {
                                  return item;
                                }
                              }),
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {displayAlert0Point(data[index].pointEvaluator1)}
                  </Row>
                )}
              </>
            );
          },
        },
        {
          title: renderColumnTitle(t('IDS_COEFFICIENT'), t('IDS_TOOLTIP_COEFFICIENT_EXPLANATION')),
          dataIndex: 'coefficientEvaluator1',
          key: 'coefficientEvaluator1',
          width: '60px',
          align: 'center' as const,
          onCell,
          render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
            return (
              <>
                {index !== 0 && (
                  <div style={{ ...styleTitle, flexDirection: 'column' }}>
                    <div style={{ borderBottom: '1px solid #BABABA', width: '100%' }}>
                      <span style={{ opacity: 0, userSelect: 'none' }}>{t('IDS_POINT_EVALUATOR_1')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {renderColumnTitle(t('IDS_COEFFICIENT'), t('IDS_TOOLTIP_COEFFICIENT_EXPLANATION'))}
                    </div>
                  </div>
                )}
                {![57, 58].includes(status) ||
                maxOrder !== '1.0' ||
                !isEvaluationDate ||
                props.role === 'admin' ||
                store.isDisable ? (
                  <Text>{text && parseFloat(text).toFixed(1)}</Text>
                ) : (
                  <Form.Item
                    style={{ textAlign: 'center', marginBottom: '0px' }}
                    name={'coefficientEvaluator1_' + record.itemNo}
                    rules={[
                      {
                        required: true,
                        message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM'),
                      },
                    ]}
                    initialValue={text && parseFloat(text).toFixed(1)}
                  >
                    <Select
                      id="coefficien_1"
                      showSearch
                      onChange={(e) => {
                        dataSource[index] = {
                          ...dataSource[index],
                          coefficientEvaluator1: e,
                        };
                        dispatch(calculateEvaluator1Total(dataSource));
                      }}
                      style={{ width: 70 }}
                      options={optionList}
                      allowClear
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
      title: t('IDS_POINT_EVALUATOR_2'),
      key: 'column2',
      children: [
        {
          title: renderColumnTitle(t('IDS_POINT'), t('IDS_FORMULA_EXPLAIN')),
          dataIndex: 'pointEvaluator2',
          key: 'pointEvaluator2',
          width: '60px',
          align: 'center' as const,
          onCell,
          render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
            return (
              <>
                {index !== 0 && (
                  <div style={{ ...styleTitle, flexDirection: 'column', overflow: 'unset' }}>
                    <div style={{ borderBottom: '1px solid #BABABA', width: '100%', position: 'relative' }}>
                      <span style={styleSpanSubtitle} className="title-css">
                        {t('IDS_POINT_EVALUATOR_2')}
                      </span>
                      <span style={{ opacity: 0, userSelect: 'none' }}>{t('IDS_POINT_EVALUATOR_2')}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {renderColumnTitle(t('IDS_POINT'), t('IDS_FORMULA_EXPLAIN'))}
                    </div>
                  </div>
                )}
                {![60, 61].includes(status) ||
                maxOrder !== '2.0' ||
                !isEvaluationDate ||
                props.role === 'admin' ||
                store.isDisable ? (
                  <Text>{text}</Text>
                ) : (
                  <Row align={'middle'}>
                    <Col span={calculateSpanAlert0Point(data[index].pointEvaluator2)}>
                      <Form.Item
                        style={{ textAlign: 'left', marginBottom: '0px' }}
                        name={'pointEvaluator2_' + record.itemNo}
                        rules={[
                          {
                            validator(_rule: any, value: number) {
                              return validateDifficulty(value);
                            },
                          },
                        ]}
                        initialValue={dataSource[index].pointEvaluator2 ?? text}
                      >
                        <Input
                          style={{ textAlign: 'center' }}
                          maxLength={3}
                          onChange={(e) => {
                            // const value = isNotNumber(e.target.value) ? null : e.target.value;
                            dataSource[index] = { ...dataSource[index], pointEvaluator2: e.target.value };

                            setData((data) =>
                              data.map((item, itemIndex) => {
                                if (itemIndex === index) {
                                  return { ...item, pointEvaluator2: e.target.value };
                                } else {
                                  return item;
                                }
                              }),
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {displayAlert0Point(data[index].pointEvaluator2)}
                  </Row>
                )}
              </>
            );
          },
        },
        {
          title: renderColumnTitle(t('IDS_COEFFICIENT'), t('IDS_TOOLTIP_COEFFICIENT_EXPLANATION')),
          dataIndex: 'coefficientEvaluator2',
          key: 'coefficientEvaluator2',
          width: '60px',
          align: 'center' as const,
          onCell,
          render: (text: string, record: EvaluationPersonalAchievement, index: number) => {
            return (
              <>
                {index !== 0 && (
                  <div style={{ ...styleTitle, flexDirection: 'column' }}>
                    <div style={{ borderBottom: '1px solid #BABABA', width: '100%' }}>
                      <span style={{ opacity: 0, userSelect: 'none' }}>{t('IDS_POINT_EVALUATOR_2')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {renderColumnTitle(t('IDS_COEFFICIENT'), t('IDS_TOOLTIP_COEFFICIENT_EXPLANATION'))}{' '}
                    </div>
                  </div>
                )}
                {![60, 61].includes(status) ||
                maxOrder !== '2.0' ||
                !isEvaluationDate ||
                props.role === 'admin' ||
                store.isDisable ? (
                  <Text>{text && parseFloat(text).toFixed(1)}</Text>
                ) : (
                  <Form.Item
                    style={{ textAlign: 'center', marginBottom: '0px' }}
                    name={'coefficientEvaluator2_' + record.itemNo}
                    rules={[
                      {
                        required: true,
                        message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM'),
                      },
                    ]}
                    initialValue={text && parseFloat(text).toFixed(1)}
                  >
                    <Select
                      id="user_coefficien"
                      showSearch
                      onChange={(e) => {
                        dataSource[index] = {
                          ...dataSource[index],
                          coefficientEvaluator2: e,
                        };
                        dispatch(calculateEvaluator2Total(dataSource));
                      }}
                      style={{ width: 70 }}
                      options={optionList}
                      allowClear
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
  ].filter((v) => {
    if (props.role === 'user') {
      if (status < 100) {
        return v.key !== 'column05' && v.key !== 'column1' && v.key !== 'column2';
      } else {
        if (!comment05Info[0]) buffList1s.push('column05');
        if (!comment1Info[0]) buffList1s.push('column1');
        if (!comment2Info[0]) buffList1s.push('column2');

        return !buffList1s.includes(v.key) && v.key !== 'action';
      }
    } else {
      if (status < 100) {
        if (
          !isDisplay05 ||
          (isDisplay05 && status < 54) ||
          (location.evaluatorOrderExcep && !(location.evaluatorOrderExcep >= 0.5))
        )
          buffList.push('column05');
        if (
          !isDisplay1 ||
          (isDisplay1 && status < 57) ||
          (location.evaluatorOrderExcep && !(location.evaluatorOrderExcep >= 1))
        )
          buffList.push('column1');
        if (
          !isDisplay2 ||
          (isDisplay2 && status < 60) ||
          (location.evaluatorOrderExcep && !(location.evaluatorOrderExcep >= 2))
        )
          buffList.push('column2');

        return !buffList.includes(v.key) && v.key !== 'action';
      } else {
        if (!comment05Info[0]) buffList2s.push('column05');
        if (!comment1Info[0]) buffList2s.push('column1');
        if (!comment2Info[0]) buffList2s.push('column2');

        return !buffList2s.includes(v.key) && v.key !== 'action';
      }
    }
  });
};
export default EvaluationResultsDepartmentColumn;
