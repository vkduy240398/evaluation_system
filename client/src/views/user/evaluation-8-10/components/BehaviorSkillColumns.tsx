import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useLayoutEffect } from 'react';
import { BasicBehaviorSkillType, PointListBehaviors } from '../../../../types/pages/user-evaluation/UserEvaluationType';
import { t } from 'i18next';
import { Col, Form, Row, Select, Tooltip, Typography } from 'antd';
import { EvaluatorInfo } from '../interfaces/response.interface';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import {
  userEvaluationBehaviorSkill,
  userEvaluationSetBehaviorSkillScoreEvaluator05,
  userEvaluationSetBehaviorSkillScoreEvaluator1,
  userEvaluationSetBehaviorSkillScoreEvaluator2,
  userEvaluationSetBehaviorSkillScoreUser,
} from '../../../../store/total';
import Icon from '@ant-design/icons/lib/components/Icon';
import { InfoCircleOutlined } from '@ant-design/icons';
type KeyObject = 'pointUser' | 'pointEvaluator05' | 'pointEvaluator1' | 'pointEvaluator2';

interface Props {
  listBehaviors: BasicBehaviorSkillType[];
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
  setBehavior: any;
  pointListBehaviors: PointListBehaviors[];
  location: any;
}

const BehaviorSkillColumns = (props: Props) => {
  const {
    status,
    role,
    isEvaluationDate,
    isGoalDate,
    listEvalutors,
    allowSeeList,
    maxOrder,
    store,
    pointListBehaviors,
    form,
    listBehaviors,
    location,
  } = props;
  const buffList: string[] = [];
  const buffList1s: string[] = [];
  const buffList2s: string[] = [];
  const isColSpan = (value: any) => !value || value === 'totalPoint';
  const optionsLists: any[] = pointListBehaviors;
  const evaluationBehaviorSkills =
    form.getFieldsValue(['behavior']) && form.getFieldsValue(['behavior']).behavior !== undefined
      ? form.getFieldsValue(['behavior']).behavior
      : [];
  const maxPointOptionsLists = optionsLists.length > 0 ? optionsLists.map((v) => v.value) : [];
  const totalPointPercent = listBehaviors.reduce((acc: any, curr: any) => {
    acc = acc + curr.difficulty * (optionsLists.length > 0 ? Math.max(...maxPointOptionsLists) : 0);

    return acc;
  }, 0) as number;

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
  // if(location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 0.5 && comment05Infos.length > 0){
  //   isDisplay05 = true;
  // }
  // if(location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 1 && comment1Infos.length > 0){
  //   isDisplay1 = true;
  // }
  // if(location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 2 && comment2Infos.length > 0){
  //   isDisplay2 = true;
  // }
  const onCell = (record: any) => {
    return {
      style: { verticalAlign: 'top', backgroundColor: record.itemNo === -1 ? '#59ad5b78' : '', textAlign: 'center' },
    };
  };
  const shareOnCell3 = (record: BasicBehaviorSkillType) => {
    if (isColSpan(record.content)) return { colSpan: 3, style: { verticalAlign: 'top', backgroundColor: '#59ad5b78' } };

    return { style: { verticalAlign: 'top' } };
  };
  const shareOnCell = (record: BasicBehaviorSkillType) => {
    if (isColSpan(record.content)) return { colSpan: 0, style: { verticalAlign: 'top' } };

    return { style: { verticalAlign: 'top' } };
  };
  const widthColumn = (isEdit: boolean) => (!isEdit ? '85px' : '125px');
  const handleTotal = (key: KeyObject) => {
    if (listBehaviors.filter((e: any) => e?.[key] !== null && e?.[key] !== undefined).length <= 0) return null;
    const totalScore = listBehaviors
      .filter((e: any) => e?.[key] !== null && e?.[key] !== undefined)
      .reduce((acc: any, curr: any) => {
        return acc + curr.difficulty * curr[key];
      }, 0);

    return totalScore;
  };

  const handleTotalForm = (key: KeyObject) => {
    if (evaluationBehaviorSkills.filter((e: any) => e?.[key] !== null && e?.[key] !== undefined).length <= 0)
      return null;
    const totalScore = evaluationBehaviorSkills
      .filter((e: any) => e?.[key] !== null && e?.[key] !== undefined)
      .reduce((acc: any, curr: any) => {
        return acc + curr.difficulty * curr[key];
      }, 0);

    return totalScore;
  };
  useEffect(() => {
    form.setFieldsValue({
      behavior: listBehaviors.map((v) => ({
        title: v.title,
        content: v.content,
        difficulty: v.difficulty,
        pointUser: v.pointUser,
        pointEvaluator05: v.pointEvaluator05,
        pointEvaluator1: v.pointEvaluator1,
        pointEvaluator2: v.pointEvaluator2,
      })),
    });

    //
    const renderPointItem = setTimeout(() => {
      if (status < 100 && isEvaluationDate) {
        dispatch(
          userEvaluationSetBehaviorSkillScoreUser(
            handleTotal('pointUser') !== null ? Math.round((handleTotal('pointUser') / totalPointPercent) * 100) : null,
          ),
        );
        dispatch(
          userEvaluationSetBehaviorSkillScoreEvaluator05(
            handleTotal('pointEvaluator05') !== null
              ? Math.round((handleTotal('pointEvaluator05') / totalPointPercent) * 100)
              : null,
          ),
        );
        dispatch(
          userEvaluationSetBehaviorSkillScoreEvaluator1(
            handleTotal('pointEvaluator1') !== null
              ? Math.round((handleTotal('pointEvaluator1') / totalPointPercent) * 100)
              : null,
          ),
        );
        dispatch(
          userEvaluationSetBehaviorSkillScoreEvaluator2(
            handleTotal('pointEvaluator2') !== null
              ? Math.round((handleTotal('pointEvaluator2') / totalPointPercent) * 100)
              : null,
          ),
        );
      }
    }, 300);

    return () => {
      clearTimeout(renderPointItem);
    };
  }, []);

  const SPAN_ITEM = 10;
  const SPAN_ITEM_NO_ALERT = 12;
  const SPAN_ICON = 4;
  const SPAN_ICON_NO_ALERT = 0;
  const SPAN_POINT = 6;
  const SPAN_POINT_NO_ALERT = 10;
  const SPAN_OFFSET = 2;
  const checkPointIs0 = (point: string | number | null) => {
    return point !== null && point !== '' && Number(point) === 0;
  };
  const dispatch = useDispatch<AppDispatch>();
  const { Text } = Typography;

  const displayAlert0Point = (
    <>
      <Tooltip
        title={t('MESSAGE.SCREEN.EVALUATION_CALCULATOR_DETAIL.IDM_ALERT_0_POINT') as string}
        color="#424242"
        overlayInnerStyle={{ fontSize: '11px' }}
      >
        <Icon
          component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
          style={{ cursor: 'default', paddingLeft: 2, color: 'red' }}
        />
      </Tooltip>
    </>
  );

  return [
    {
      title: t('IDS_EVALUATION_ITEM'),
      dataIndex: 'title',
      width: '14rem',
      onCell: shareOnCell3,
      render: (text: string, index: number) => (
        <>
          <Form.Item
            key={index}
            name={['behavior', index, 'title']}
            style={{ display: 'inline-block', marginBottom: 0, height: '0px' }}
          ></Form.Item>
          <Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Text>
        </>
      ),
    },
    {
      title: t('IDS_EVALUATION_CONTENT'),
      dataIndex: 'content',
      onCell: shareOnCell,
      width: '70rem',
      render: (text: string, index: number) => (
        <>
          <Form.Item
            key={index}
            name={['behavior', index, 'content']}
            style={{ display: 'inline-block', marginBottom: 0, height: '0px' }}
          ></Form.Item>
          <Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Text>
        </>
      ),
    },
    {
      title: t('IDS_DIFFICULTY'),
      dataIndex: 'difficulty',
      width: '4rem',
      onCell: shareOnCell,
      align: 'center' as const,
      render: (text: string, index: number) => (
        <>
          <Form.Item
            key={index}
            name={['behavior', index, 'difficulty']}
            style={{ display: 'inline-block', marginBottom: 0, height: '0px' }}
          ></Form.Item>
          <Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Text>
        </>
      ),
    },
    {
      title: t('IDS_POINT_SELF_USER'),
      width: widthColumn(true),
      dataIndex: 'pointUser',
      onCell,
      render: (text: any, record: BasicBehaviorSkillType, index: any) => {
        return !(props.role === 'user' && [50, 51, 52].includes(props.status) && isEvaluationDate) ? (
          <div style={{ display: 'flex' }}>
            {evaluationBehaviorSkills?.[index]?.pointUser !== null ? (
              <>
                <div style={{ flexBasis: '45%', textAlign: 'right' }}>{text || 0}</div>
                <div style={{ flexBasis: '5%', letterSpacing: '1px' }}></div>
                <div style={{ flexBasis: '45%', textAlign: 'left', fontWeight: 600, width: 26 }}>
                  ({(evaluationBehaviorSkills?.[index]?.pointUser || 0) * record.difficulty})
                </div>
              </>
            ) : (
              ''
            )}
          </div>
        ) : (
          <Row align={'middle'}>
            <Col
              span={
                checkPointIs0(evaluationBehaviorSkills[index] && evaluationBehaviorSkills[index].pointUser)
                  ? SPAN_ITEM
                  : SPAN_ITEM_NO_ALERT
              }
              offset={SPAN_OFFSET}
            >
              <Form.Item
                name={['behavior', index, 'pointUser']}
                rules={[
                  {
                    required: true,
                    message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM').toString(),
                  },
                ]}
                style={{ textAlign: 'left', margin: 0 }}
              >
                <Select
                  id="pointUser"
                  onChange={(e) => {
                    if (evaluationBehaviorSkills.length > 0) {
                      const value = e;
                      evaluationBehaviorSkills[index].pointUser = value;
                      dispatch(
                        userEvaluationSetBehaviorSkillScoreUser(
                          handleTotalForm('pointUser') !== null
                            ? Math.round((handleTotalForm('pointUser') / totalPointPercent) * 100)
                            : null,
                        ),
                      );
                      dispatch(userEvaluationBehaviorSkill(evaluationBehaviorSkills));
                    }
                  }}
                  options={optionsLists}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? '').includes(input)}
                  style={{ display: 'absolute' }}
                />
              </Form.Item>
            </Col>
            <Col
              span={
                checkPointIs0(evaluationBehaviorSkills?.[index] && evaluationBehaviorSkills?.[index]?.pointUser)
                  ? SPAN_ICON
                  : SPAN_ICON_NO_ALERT
              }
            >
              {evaluationBehaviorSkills?.[index] &&
                evaluationBehaviorSkills?.[index]?.pointUser === 0 &&
                displayAlert0Point}
            </Col>
            <Col
              span={
                checkPointIs0(evaluationBehaviorSkills[index] && evaluationBehaviorSkills[index].pointUser)
                  ? SPAN_POINT
                  : SPAN_POINT_NO_ALERT
              }
            >
              <Typography style={{ fontWeight: 600 }}>
                (
                {((evaluationBehaviorSkills[index] && evaluationBehaviorSkills[index].pointUser) || 0) *
                  record.difficulty}
                )
              </Typography>
            </Col>
          </Row>
        );
      },
    },

    {
      title: t('IDS_EVALUATOR_0_5'),
      width: widthColumn(true),
      dataIndex: 'pointEvaluator05',
      onCell,
      render: (text: any, record: BasicBehaviorSkillType, index: any) => {
        return !(
          isDisplay05 &&
          [53, 54, 55].includes(props.status) &&
          isEvaluationDate &&
          maxOrder === '0.5' &&
          props.role !== 'admin'
        ) ? (
          <div style={{ display: 'flex' }}>
            {evaluationBehaviorSkills?.[index]?.pointEvaluator05 !== null ? (
              <>
                <div style={{ flexBasis: '45%', textAlign: 'right' }}>{text || 0}</div>
                <div style={{ flexBasis: '5%', letterSpacing: '1px' }}></div>
                <div style={{ flexBasis: '45%', textAlign: 'left', fontWeight: 600, width: 26 }}>
                  ({(evaluationBehaviorSkills?.[index]?.pointEvaluator05 || 0) * record.difficulty})
                </div>
              </>
            ) : (
              ''
            )}
          </div>
        ) : (
          <Row align={'middle'}>
            <Col
              span={
                checkPointIs0(evaluationBehaviorSkills[index] && evaluationBehaviorSkills[index].pointEvaluator05)
                  ? SPAN_ITEM
                  : SPAN_ITEM_NO_ALERT
              }
              offset={SPAN_OFFSET}
            >
              <Form.Item
                name={['behavior', index, 'pointEvaluator05']}
                rules={[
                  {
                    required: true,
                    message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM').toString(),
                  },
                ]}
                style={{ textAlign: 'left', margin: 0 }}
              >
                <Select
                  id="pointEvaluator05"
                  onChange={(e) => {
                    if (evaluationBehaviorSkills.length > 0) {
                      const value = e;
                      evaluationBehaviorSkills[index].pointEvaluator05 = value;
                      dispatch(
                        userEvaluationSetBehaviorSkillScoreEvaluator05(
                          handleTotalForm('pointEvaluator05') !== null
                            ? Math.round((handleTotalForm('pointEvaluator05') / totalPointPercent) * 100)
                            : null,
                        ),
                      );
                      dispatch(userEvaluationBehaviorSkill(evaluationBehaviorSkills));
                    }
                  }}
                  options={optionsLists}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? '').includes(input)}
                  style={{ display: 'absolute' }}
                />
              </Form.Item>
            </Col>
            <Col
              span={
                checkPointIs0(evaluationBehaviorSkills?.[index] && evaluationBehaviorSkills?.[index]?.pointEvaluator05)
                  ? SPAN_ICON
                  : SPAN_ICON_NO_ALERT
              }
            >
              {evaluationBehaviorSkills?.[index] &&
                evaluationBehaviorSkills?.[index]?.pointEvaluator05 === 0 &&
                displayAlert0Point}
            </Col>
            <Col
              span={
                checkPointIs0(evaluationBehaviorSkills[index] && evaluationBehaviorSkills[index].pointEvaluator05)
                  ? SPAN_POINT
                  : SPAN_POINT_NO_ALERT
              }
            >
              <Typography style={{ fontWeight: 600 }}>
                (
                {((evaluationBehaviorSkills[index] && evaluationBehaviorSkills[index].pointEvaluator05) || 0) *
                  record.difficulty}
                )
              </Typography>
            </Col>
          </Row>
        );
      },
    },

    {
      title: t('IDS_POINT_EVALUATOR_1'),
      width: widthColumn(true),
      dataIndex: 'pointEvaluator1',
      onCell,
      render: (text: any, record: BasicBehaviorSkillType, index: any) => {
        return !(
          isDisplay1 &&
          [56, 57, 58].includes(props.status) &&
          isEvaluationDate &&
          maxOrder === '1.0' &&
          props.role !== 'admin'
        ) ? (
          <div style={{ display: 'flex' }}>
            {evaluationBehaviorSkills?.[index]?.pointEvaluator1 !== null ? (
              <>
                <div style={{ flexBasis: '45%', textAlign: 'right' }}>{text || 0}</div>
                <div style={{ flexBasis: '5%', letterSpacing: '1px' }}></div>
                <div style={{ flexBasis: '45%', textAlign: 'left', fontWeight: 600, width: 26 }}>
                  ({(evaluationBehaviorSkills?.[index]?.pointEvaluator1 || 0) * record.difficulty})
                </div>
              </>
            ) : (
              ''
            )}
          </div>
        ) : (
          <Row align={'middle'}>
            <Col
              span={
                checkPointIs0(evaluationBehaviorSkills[index] && evaluationBehaviorSkills[index].pointEvaluator1)
                  ? SPAN_ITEM
                  : SPAN_ITEM_NO_ALERT
              }
              offset={SPAN_OFFSET}
            >
              <Form.Item
                name={['behavior', index, 'pointEvaluator1']}
                rules={[
                  {
                    required: true,
                    message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM').toString(),
                  },
                ]}
                style={{ textAlign: 'left', margin: 0 }}
              >
                <Select
                  id="pointEvaluator1"
                  onChange={(e) => {
                    if (evaluationBehaviorSkills.length > 0) {
                      const value = e;
                      evaluationBehaviorSkills[index].pointEvaluator1 = value;
                      dispatch(
                        userEvaluationSetBehaviorSkillScoreEvaluator1(
                          handleTotalForm('pointEvaluator1') !== null
                            ? Math.round((handleTotalForm('pointEvaluator1') / totalPointPercent) * 100)
                            : null,
                        ),
                      );
                      dispatch(userEvaluationBehaviorSkill(evaluationBehaviorSkills));
                    }
                  }}
                  options={optionsLists}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? '').includes(input)}
                  style={{ display: 'absolute' }}
                />
              </Form.Item>
            </Col>
            <Col
              span={
                checkPointIs0(evaluationBehaviorSkills[index] && evaluationBehaviorSkills?.[index]?.pointEvaluator1)
                  ? SPAN_ICON
                  : SPAN_ICON_NO_ALERT
              }
            >
              {evaluationBehaviorSkills?.[index] &&
                evaluationBehaviorSkills?.[index]?.pointEvaluator1 === 0 &&
                displayAlert0Point}
            </Col>
            <Col
              span={
                checkPointIs0(evaluationBehaviorSkills[index] && evaluationBehaviorSkills[index].pointEvaluator1)
                  ? SPAN_POINT
                  : SPAN_POINT_NO_ALERT
              }
            >
              <Typography style={{ fontWeight: 600 }}>
                (
                {((evaluationBehaviorSkills[index] && evaluationBehaviorSkills[index].pointEvaluator1) || 0) *
                  record.difficulty}
                )
              </Typography>
            </Col>
          </Row>
        );
      },
    },

    {
      title: t('IDS_POINT_EVALUATOR_2'),
      width: widthColumn(true),
      dataIndex: 'pointEvaluator2',
      onCell,
      render: (text: any, record: BasicBehaviorSkillType, index: any) => {
        // if (isColSpan(record.key)) return store.behaviorTotalPointEvaluator2;
        return !(
          isDisplay2 &&
          [59, 60, 61].includes(props.status) &&
          isEvaluationDate &&
          maxOrder === '2.0' &&
          props.role !== 'admin'
        ) ? (
          <div style={{ display: 'flex' }}>
            {evaluationBehaviorSkills?.[index]?.pointEvaluator2 !== null ? (
              <>
                <div style={{ flexBasis: '45%', textAlign: 'right' }}>{text || 0}</div>
                <div style={{ flexBasis: '5%', letterSpacing: '1px' }}></div>
                <div style={{ flexBasis: '45%', textAlign: 'left', fontWeight: 600, width: 26 }}>
                  ({(evaluationBehaviorSkills?.[index]?.pointEvaluator2 || 0) * record.difficulty})
                </div>
              </>
            ) : (
              ''
            )}
          </div>
        ) : (
          <Row align={'middle'}>
            <Col
              span={
                checkPointIs0(evaluationBehaviorSkills[index] && evaluationBehaviorSkills[index].pointEvaluator2)
                  ? SPAN_ITEM
                  : SPAN_ITEM_NO_ALERT
              }
              offset={SPAN_OFFSET}
            >
              <Form.Item
                name={['behavior', index, 'pointEvaluator2']}
                rules={[
                  {
                    required: true,
                    message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM').toString(),
                  },
                ]}
                style={{ textAlign: 'left', margin: 0 }}
              >
                <Select
                  id="pointEvaluator2"
                  onChange={(e) => {
                    if (evaluationBehaviorSkills.length > 0) {
                      const value = e;
                      evaluationBehaviorSkills[index].pointEvaluator2 = value;
                      dispatch(
                        userEvaluationSetBehaviorSkillScoreEvaluator2(
                          handleTotalForm('pointEvaluator2') !== null
                            ? Math.round((handleTotalForm('pointEvaluator2') / totalPointPercent) * 100)
                            : null,
                        ),
                      );
                      dispatch(userEvaluationBehaviorSkill(evaluationBehaviorSkills));
                    }
                  }}
                  options={optionsLists}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? '').includes(input)}
                  style={{ display: 'absolute' }}
                />
              </Form.Item>
            </Col>
            <Col
              span={
                checkPointIs0(evaluationBehaviorSkills[index] && evaluationBehaviorSkills?.[index]?.pointEvaluator2)
                  ? SPAN_ICON
                  : SPAN_ICON_NO_ALERT
              }
            >
              {evaluationBehaviorSkills[index] &&
                evaluationBehaviorSkills?.[index]?.pointEvaluator2 === 0 &&
                displayAlert0Point}
            </Col>
            <Col
              span={
                checkPointIs0(evaluationBehaviorSkills[index] && evaluationBehaviorSkills[index].pointEvaluator2)
                  ? SPAN_POINT
                  : SPAN_POINT_NO_ALERT
              }
            >
              <Typography style={{ fontWeight: 600 }}>
                (
                {((evaluationBehaviorSkills[index] && evaluationBehaviorSkills[index].pointEvaluator2) || 0) *
                  record.difficulty}
                )
              </Typography>
            </Col>
          </Row>
        );
      },
    },
  ].filter((v: any) => {
    if (role === 'user' && !store.isDisable) {
      if ([0, 1, 2].includes(status) && isGoalDate) {
        return (
          v.dataIndex !== 'pointEvaluator2' &&
          v.dataIndex !== 'pointEvaluator1' &&
          v.dataIndex !== 'pointUser' &&
          v.dataIndex !== 'pointEvaluator05'
        );
      } else if (status < 50 || (status === 50 && !isEvaluationDate)) {
        return (
          v.dataIndex !== 'pointEvaluator2' &&
          v.dataIndex !== 'pointEvaluator1' &&
          v.dataIndex !== 'pointUser' &&
          v.dataIndex !== 'pointEvaluator05'
        );
      } else if (status < 100) {
        return (
          v.dataIndex !== 'pointEvaluator2' && v.dataIndex !== 'pointEvaluator1' && v.dataIndex !== 'pointEvaluator05'
        );
      } else {
        if (!comment05Infos[0]) buffList.push('pointEvaluator05');
        if (!comment1Infos[0]) buffList.push('pointEvaluator1');
        if (!comment2Infos[0]) buffList.push('pointEvaluator2');

        return !buffList.includes(v.dataIndex);
      }
    } else {
      if (status < 50 || (status === 50 && !isEvaluationDate)) {
        return (
          v.dataIndex !== 'pointEvaluator2' &&
          v.dataIndex !== 'pointEvaluator1' &&
          v.dataIndex !== 'pointUser' &&
          v.dataIndex !== 'pointEvaluator05'
        );
      }
      if (status < 100) {
        if (!isDisplay05 || (isDisplay05 && status < 54)) buffList1s.push('pointEvaluator05');
        if (!isDisplay1 || (isDisplay1 && status < 57)) buffList1s.push('pointEvaluator1');
        if (!isDisplay2 || (isDisplay2 && status < 60)) buffList1s.push('pointEvaluator2');
        if (
          !(
            ([54, 55].includes(status) && maxOrder === '0.5') ||
            ([57, 58].includes(status) && maxOrder === '1.0') ||
            ([60, 61].includes(status) && maxOrder === '2.0')
          )
        )
          buffList1s.push('action');

        return !buffList1s.includes(v.dataIndex);
      } else if (status === 100) {
        if (!comment05Infos[0]) buffList2s.push('pointEvaluator05');
        if (!comment1Infos[0]) buffList2s.push('pointEvaluator1');
        if (!comment2Infos[0]) buffList2s.push('pointEvaluator2');

        return !buffList2s.includes(v.dataIndex);
      }
    }

    return v;
  }) as ColumnsType<BasicBehaviorSkillType>;
};

export default BehaviorSkillColumns;
