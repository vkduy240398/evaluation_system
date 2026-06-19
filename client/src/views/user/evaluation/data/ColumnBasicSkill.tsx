import { ColumnsType } from 'antd/es/table';
import { BasicBehaviorSkillType } from '../../../../types/pages/user-evaluation/UserEvaluationType';
import Form from 'antd/es/form';
import Space from 'antd/es/space';
import Select from 'antd/es/select';
import Typography from 'antd/es/typography';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import {
  userEvaluationBasicSkill,
  userEvaluationSetBasicSkillScore05,
  userEvaluationSetBasicSkillScore1,
  userEvaluationSetBasicSkillScore2,
  userEvaluationSetBasicSkillScoreUser,
} from '../../../../store/userEvaluation';
import { useEffect } from 'react';
import { t } from 'i18next';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { Col, Row, Tooltip } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import { InfoCircleOutlined } from '@ant-design/icons';

type HandleTotalType = 'pointUser' | 'pointEvaluator05' | 'pointEvaluator1' | 'pointEvaluator2';
interface Props {
  isDisplayUserEvaluator: boolean; // ** Display/Allow edit - column user to self-evaluate
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

  openNotification: (placement: NotificationPlacement, mesage: string) => void;
}

const basicSkillColumn = ({
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
}: Props) => {
  // ** Hook
  const store = useSelector((state: RootState) => state.userEvaluation);
  const options = store.basicSkillPointOptions;
  const dispatch = useDispatch<AppDispatch>();
  const evaluationBasicSkills = store.evaluationBasicSkills.map((v) => ({ ...v }));
  const isColSpan = (value: any) => !value;
  const { Item } = Form;
  const widthColumn = (isEdit: boolean) => (!isEdit ? '85px' : '135px');

  // ** useEffect
  useEffect(() => {
    if (evaluationBasicSkills.length > 0) {
      dispatch(userEvaluationSetBasicSkillScoreUser(handleTotal('pointUser')));
      dispatch(userEvaluationSetBasicSkillScore05(handleTotal('pointEvaluator05')));
      dispatch(userEvaluationSetBasicSkillScore1(handleTotal('pointEvaluator1')));
      dispatch(userEvaluationSetBasicSkillScore2(handleTotal('pointEvaluator2')));
    }
  }, [evaluationBasicSkills]);

  // ** Functional
  const handleCalculatorUser = (_record: BasicBehaviorSkillType, index: number, value: number) => {
    if (evaluationBasicSkills.length > 0) {
      evaluationBasicSkills[index].pointUser = value;
      dispatch(userEvaluationBasicSkill(evaluationBasicSkills));
    }
  };

  const handleCalculator05 = (_record: BasicBehaviorSkillType, index: number, value: number) => {
    if (evaluationBasicSkills.length > 0) {
      evaluationBasicSkills[index].pointEvaluator05 = value;
      dispatch(userEvaluationBasicSkill(evaluationBasicSkills));
    }
  };

  const handleCalculator1 = (_record: BasicBehaviorSkillType, index: number, value: number) => {
    if (evaluationBasicSkills.length > 0) {
      evaluationBasicSkills[index].pointEvaluator1 = value;
      dispatch(userEvaluationBasicSkill(evaluationBasicSkills));
    }
  };

  const handleCalculator2 = (_record: BasicBehaviorSkillType, index: number, value: number) => {
    if (evaluationBasicSkills.length > 0) {
      evaluationBasicSkills[index].pointEvaluator2 = value;
      dispatch(userEvaluationBasicSkill(evaluationBasicSkills));
    }
  };

  const handleTotal = (key: HandleTotalType) => {
    if (evaluationBasicSkills.filter((e) => e?.[key] !== null && e?.[key] !== undefined).length <= 0) return null;

    return evaluationBasicSkills.reduce((pre: number, cur) => {
      return pre + Number((cur?.[key] || 0) * cur.difficulty) || 0;
    }, 0);
  };

  // ** Col span
  const shareOnCell3 = (record: BasicBehaviorSkillType) => {
    if (isColSpan(record.content)) return { colSpan: 3, style: { verticalAlign: 'top', backgroundColor: '#59ad5b78' } };

    return { style: { verticalAlign: 'top' } };
  };
  const shareOnCell = (record: BasicBehaviorSkillType) => {
    if (isColSpan(record.content)) return { colSpan: 0, style: { verticalAlign: 'top' } };

    return { style: { verticalAlign: 'top' } };
  };

  const onCell = (record: BasicBehaviorSkillType) => {
    return { style: { verticalAlign: 'top', backgroundColor: record.itemNo === -1 ? '#59ad5b78' : '' } };
  };
  const columns: ColumnsType<BasicBehaviorSkillType> = [
    {
      title: t('IDS_EVALUATION_ITEM'),
      dataIndex: 'title',
      align: isDisplayUserEvaluator ? ('center' as const) : ('left' as const),
      width: '14rem',
      onCell: shareOnCell3,
      render: (text, record) => <div style={{ textAlign: isColSpan(record.content) ? 'center' : 'left' }}>{text}</div>,
    },
    {
      title: t('IDS_EVALUATION_CONTENT'),
      dataIndex: 'content',
      align: 'left' as const,
      width: '70rem',
      onCell: shareOnCell,
    },
    {
      title: t('IDS_DIFFICULTY'),
      dataIndex: 'difficulty',
      width: '4rem',
      align: 'center' as const,
      onCell: shareOnCell,
    },
  ];

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

  if (isDisplayUserEvaluator)
    columns.push({
      title: t('IDS_POINT_SELF_USER'),
      width: widthColumn(isEditUserEvaluation),
      dataIndex: 'pointUser',
      onCell,
      align: 'center' as const,
      render: (text: any, record: BasicBehaviorSkillType, index: any) => {
        if (isEditUserEvaluation) {
          if (isColSpan(record.content)) return <>{handleTotal('pointUser')}</>;

          return (
            <Row align={'middle'}>
              <Col
                span={checkPointIs0(evaluationBasicSkills?.[index]?.pointUser) ? SPAN_ITEM : SPAN_ITEM_NO_ALERT}
                offset={SPAN_OFFSET}
              >
                <Item
                  rules={[
                    {
                      validator: async (_, value) => {
                        if (value === null || value === '' || value === undefined)
                          return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                      },
                    },
                  ]}
                  style={{ textAlign: 'left', margin: 0 }}
                  name={`pointEvaluatorUser-key${record.key}`}
                  initialValue={text}
                >
                  <Select
                    allowClear
                    showSearch
                    options={options}
                    onChange={(value) => handleCalculatorUser(record, index, value)}
                  />
                </Item>
              </Col>
              <Col span={checkPointIs0(evaluationBasicSkills?.[index]?.pointUser) ? SPAN_ICON : SPAN_ICON_NO_ALERT}>
                {evaluationBasicSkills?.[index]?.pointUser === 0 && displayAlert0Point}
              </Col>
              <Col span={checkPointIs0(evaluationBasicSkills?.[index]?.pointUser) ? SPAN_POINT : SPAN_POINT_NO_ALERT}>
                <Typography style={{ fontWeight: 600 }}>
                  ({(evaluationBasicSkills?.[index]?.pointUser || 0) * record.difficulty})
                </Typography>
              </Col>
            </Row>
          );
        }
        if (isColSpan(record.content)) return text;

        return (
          <>
            {evaluationBasicSkills?.[index]?.pointUser !== null ? (
              <div style={{ display: 'flex' }}>
                <div style={{ flexBasis: '45%', textAlign: 'right' }}>{text || 0}</div>
                <div style={{ flexBasis: '5%', letterSpacing: '1px' }}></div>
                <div style={{ flexBasis: '45%', textAlign: 'left', fontWeight: 600, width: 26 }}>
                  ({(evaluationBasicSkills?.[index]?.pointUser || 0) * record.difficulty})
                </div>
              </div>
            ) : (
              ''
            )}
          </>
        );
      },
    });

  // ** evaluator 0.5
  if (isDisplayEvaluator05)
    columns.push({
      title: t('IDS_EVALUATION_0_5'),
      width: widthColumn(isEditEvaluation05),
      dataIndex: 'pointEvaluator05',
      onCell,
      align: 'center' as const,
      render: (text: any, record: BasicBehaviorSkillType, index: any) => {
        if (isEditEvaluation05) {
          if (isColSpan(record.content)) return <>{handleTotal('pointEvaluator05')}</>;

          return (
            <Row align={'middle'}>
              <Col
                offset={SPAN_OFFSET}
                span={checkPointIs0(evaluationBasicSkills?.[index]?.pointEvaluator05) ? SPAN_ITEM : SPAN_ITEM_NO_ALERT}
              >
                <Item
                  rules={[
                    {
                      validator: async (_, value) => {
                        if (value === null || value === '' || value === undefined) {
                          return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                        }
                      },
                    },
                  ]}
                  style={{ textAlign: 'left', margin: 0 }}
                  name={`pointEvaluator05-key${record.key}`}
                  initialValue={text}
                >
                  <Select
                    allowClear
                    showSearch
                    options={options}
                    onChange={(value) => handleCalculator05(record, index, value)}
                  />
                </Item>
              </Col>
              <Col
                span={checkPointIs0(evaluationBasicSkills?.[index]?.pointEvaluator05) ? SPAN_ICON : SPAN_ICON_NO_ALERT}
              >
                {evaluationBasicSkills?.[index]?.pointEvaluator05 === 0 && displayAlert0Point}
              </Col>
              <Col
                span={
                  checkPointIs0(evaluationBasicSkills?.[index]?.pointEvaluator05) ? SPAN_POINT : SPAN_POINT_NO_ALERT
                }
              >
                <Typography style={{ fontWeight: 600 }}>
                  ({(evaluationBasicSkills?.[index]?.pointEvaluator05 || 0) * record.difficulty})
                </Typography>
              </Col>
            </Row>
          );
        }
        if (isColSpan(record.content)) return text;

        return (
          <>
            {evaluationBasicSkills?.[index]?.pointEvaluator05 !== null ? (
              <div style={{ display: 'flex' }}>
                <div style={{ flexBasis: '45%', textAlign: 'right' }}>{text || 0}</div>
                <div style={{ flexBasis: '5%', letterSpacing: '1px' }}></div>
                <div style={{ flexBasis: '45%', textAlign: 'left', fontWeight: 600, width: 26 }}>
                  ({(evaluationBasicSkills?.[index]?.pointEvaluator05 || 0) * record.difficulty})
                </div>
              </div>
            ) : (
              ''
            )}
          </>
        );
      },
    });

  // ** evaluator 1.0
  if (isDisplayEvaluator1)
    columns.push({
      title: t('IDS_POINT_EVALUATOR_1'),
      width: widthColumn(isEditEvaluation1),
      dataIndex: 'pointEvaluator1',
      onCell,
      align: 'center' as const,
      render: (text: any, record: BasicBehaviorSkillType, index: any) => {
        if (isEditEvaluation1) {
          if (isColSpan(record.content)) return <>{handleTotal('pointEvaluator1')}</>;

          return (
            <Row align={'middle'}>
              <Col
                offset={SPAN_OFFSET}
                span={checkPointIs0(evaluationBasicSkills?.[index]?.pointEvaluator1) ? SPAN_ITEM : SPAN_ITEM_NO_ALERT}
              >
                <Item
                  rules={[
                    {
                      validator: async (_, value) => {
                        if (value === null || value === '' || value === undefined) {
                          return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                        }
                      },
                    },
                  ]}
                  style={{ textAlign: 'left', margin: 0 }}
                  name={`pointEvaluator1-key${record.key}`}
                  initialValue={text}
                >
                  <Select
                    allowClear
                    showSearch
                    options={options}
                    onChange={(value) => handleCalculator1(record, index, value)}
                  />
                </Item>
              </Col>
              <Col
                span={checkPointIs0(evaluationBasicSkills?.[index]?.pointEvaluator1) ? SPAN_ICON : SPAN_ICON_NO_ALERT}
              >
                {evaluationBasicSkills?.[index]?.pointEvaluator1 === 0 && displayAlert0Point}
              </Col>
              <Col
                span={checkPointIs0(evaluationBasicSkills?.[index]?.pointEvaluator1) ? SPAN_POINT : SPAN_POINT_NO_ALERT}
              >
                <Typography style={{ fontWeight: 600 }}>
                  ({(evaluationBasicSkills?.[index]?.pointEvaluator1 || 0) * record.difficulty})
                </Typography>
              </Col>
            </Row>
          );
        }

        if (isColSpan(record.content)) return text;

        return (
          <>
            {evaluationBasicSkills?.[index]?.pointEvaluator1 !== null ? (
              <div style={{ display: 'flex' }}>
                <div style={{ flexBasis: '45%', textAlign: 'right' }}>{text || 0}</div>
                <div style={{ flexBasis: '5%', letterSpacing: '1px' }}></div>
                <div style={{ flexBasis: '45%', textAlign: 'left', fontWeight: 600, width: 26 }}>
                  ({(evaluationBasicSkills?.[index]?.pointEvaluator1 || 0) * record.difficulty})
                </div>
              </div>
            ) : (
              ''
            )}
          </>
        );
      },
    });

  // ** evaluator 2.0
  if (isDisplayEvaluator2)
    columns.push({
      title: t('IDS_POINT_EVALUATOR_2'),
      width: widthColumn(isEditEvaluation2),
      dataIndex: 'pointEvaluator2',
      onCell,
      align: 'center' as const,
      render: (text: any, record: BasicBehaviorSkillType, index: any) => {
        if (isEditEvaluation2) {
          if (isColSpan(record.content)) return <>{handleTotal('pointEvaluator2')}</>;

          return (
            <Row align={'middle'}>
              <Col
                offset={SPAN_OFFSET}
                span={checkPointIs0(evaluationBasicSkills?.[index]?.pointEvaluator2) ? SPAN_ITEM : SPAN_ITEM_NO_ALERT}
              >
                <Item
                  rules={[
                    {
                      validator: async (_, value) => {
                        if (value === null || value === '' || value === undefined) {
                          return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                        }
                      },
                    },
                  ]}
                  style={{ textAlign: 'left', margin: 0 }}
                  name={`pointEvaluator2-key${record.key}`}
                  initialValue={text}
                >
                  <Select
                    allowClear
                    showSearch
                    options={options}
                    onChange={(value) => handleCalculator2(record, index, value)}
                  />
                </Item>
              </Col>
              <Col
                span={checkPointIs0(evaluationBasicSkills?.[index]?.pointEvaluator2) ? SPAN_ICON : SPAN_ICON_NO_ALERT}
              >
                {evaluationBasicSkills?.[index]?.pointEvaluator2 === 0 && displayAlert0Point}
              </Col>
              <Col
                span={checkPointIs0(evaluationBasicSkills?.[index]?.pointEvaluator2) ? SPAN_POINT : SPAN_POINT_NO_ALERT}
              >
                <Typography style={{ fontWeight: 600 }}>
                  ({(evaluationBasicSkills?.[index]?.pointEvaluator2 || 0) * record.difficulty})
                </Typography>
              </Col>
            </Row>
          );
        }
        if (isColSpan(record.content)) return text;

        return (
          <>
            {evaluationBasicSkills?.[index]?.pointEvaluator2 !== null ? (
              <div style={{ display: 'flex' }}>
                <div style={{ flexBasis: '45%', textAlign: 'right' }}>{text || 0}</div>
                <div style={{ flexBasis: '5%', letterSpacing: '1px' }}></div>
                <div style={{ flexBasis: '45%', textAlign: 'left', fontWeight: 600, width: 26 }}>
                  ({(evaluationBasicSkills?.[index]?.pointEvaluator2 || 0) * record.difficulty})
                </div>
              </div>
            ) : (
              ''
            )}
          </>
        );
      },
    });

  return columns;
};

export default basicSkillColumn;
