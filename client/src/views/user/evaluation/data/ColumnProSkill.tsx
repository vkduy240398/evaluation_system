import { ColumnsType } from 'antd/es/table';
import { UserEvaluationToProSkillType } from '../../../../types/pages/user-evaluation/UserEvaluationType';
import Button from 'antd/es/button';
import { CheckOutlined, DeleteOutlined, InfoCircleOutlined, StopOutlined, UndoOutlined } from '@ant-design/icons';
import Space from 'antd/es/space';
import Select from 'antd/es/select';
import Typography from 'antd/es/typography';
import Form from 'antd/es/form';

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import {
  userEvaluationCalculatorProSkill,
  userEvaluationSetProSkillScore05,
  userEvaluationSetProSkillScore1,
  userEvaluationSetProSkillScore2,
  userEvaluationSetProSkillScoreUser,
} from '../../../../store/userEvaluation';
import { useEffect } from 'react';
import { changeLanguage, t } from 'i18next';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { Col, Row, Tooltip } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';

type HandleTotalType = 'pointUser' | 'pointEvaluator05' | 'pointEvaluator1' | 'pointEvaluator2';
interface Props {
  deleteRow: (key: string) => void;
  isEditUserEvaluation?: boolean;
  isHiddenButtonUserCreateContent?: boolean;
  isHiddenButtonEvaluator: boolean;
  isDisplayUserEvaluator?: boolean;

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
  disableItem: (
    index: number,
    value: boolean,
    userRole: boolean,
    evaluator05: boolean,
    evaluator1: boolean,
    evaluator2: boolean,
  ) => void;
  setDataSource: React.Dispatch<React.SetStateAction<UserEvaluationToProSkillType[]>>;
  dataList: UserEvaluationToProSkillType[];
  evaluatorOrder: number;
  isLoading: boolean;
}

const proSkillColumn = ({
  deleteRow,
  isHiddenButtonUserCreateContent,
  isHiddenButtonEvaluator,
  isDisplayUserEvaluator,
  isEditUserEvaluation,
  isDisplayEvaluator05,
  isEditEvaluation05,
  isDisplayEvaluator1,
  isEditEvaluation1,
  isDisplayEvaluator2,
  isEditEvaluation2,
  openNotification,
  disableItem,
  setDataSource,
  dataList,
  evaluatorOrder,
  isLoading,
}: Props) => {
  // ** Hook
  const { Item } = Form;
  const store = useSelector((state: RootState) => state.userEvaluation);
  const dispatch = useDispatch<AppDispatch>();
  const isColSpan = (value: any) => !value;
  const options = store.proSkillPointOptions;

  const evaluationProSkills = store.evaluationProSkills.map((v) => ({ ...v }));
  const settingProFormulas = store.settingProFormulas;

  const widthColumn = (isEdit: boolean | undefined) => (!isEdit ? '80px' : '135px');
  useEffect(() => {
    if (evaluationProSkills.length > 0) {
      // const maxLength = evaluationProSkills.length;
      const userPoint = handleTotalRow('pointUser');
      const userPoint05 = handleTotalRow('pointEvaluator05');
      const userPoint1 = handleTotalRow('pointEvaluator1');
      const userPoint2 = handleTotalRow('pointEvaluator2');

      dispatch(userEvaluationSetProSkillScoreUser(userPoint));
      dispatch(userEvaluationSetProSkillScore05(userPoint05));
      dispatch(userEvaluationSetProSkillScore1(userPoint1));
      dispatch(userEvaluationSetProSkillScore2(userPoint2));

      // setDataSource((dataState) => {
      //   const totalRows = dataState.slice(dataState.length - 1);
      //   totalRows[0].totalPointUser = Number(userPoint);
      //   totalRows[0].totalPointEvaluator05 = Number(userPoint05);
      //   totalRows[0].totalPointEvaluator05 = Number(userPoint1);
      //   totalRows[0].totalPointEvaluator2 = Number(userPoint2);

      //   return [...dataState.slice(0, dataState.length - 1), ...totalRows];
      // });
    }
  }, [evaluationProSkills]);

  // ** Functional
  const handleCalculatorUser = (index: number, value: any, difficulty: number) => {
    if (evaluationProSkills.length > 0) {
      const handleTotalPointRow = handleTotalPoint(Number(value), Number(difficulty));
      evaluationProSkills[index].totalPointUser = handleTotalPointRow;
      evaluationProSkills[index].pointUser = value !== null && value !== undefined ? Number(value) : null;
      dispatch(userEvaluationCalculatorProSkill(evaluationProSkills));
      setDataSource([...evaluationProSkills, dataList[dataList.length - 1]]);
    }
  };

  const handleCalculator05 = (index: number, value: any, difficulty: number) => {
    if (evaluationProSkills.length > 0) {
      const handleTotalPointRow = handleTotalPoint(Number(value), Number(difficulty));
      evaluationProSkills[index].totalPointEvaluator05 = handleTotalPointRow;
      evaluationProSkills[index].pointEvaluator05 = value !== null && value !== undefined ? Number(value) : null;
      dispatch(userEvaluationCalculatorProSkill(evaluationProSkills));
      setDataSource([...evaluationProSkills, dataList[dataList.length - 1]]);
    }
  };

  const handleCalculator1 = (index: number, value: any, difficulty: number) => {
    if (evaluationProSkills.length > 0) {
      const handleTotalPointRow = handleTotalPoint(Number(value), Number(difficulty));
      evaluationProSkills[index].totalPointEvaluator1 = handleTotalPointRow;
      evaluationProSkills[index].pointEvaluator1 = value !== null && value !== undefined ? Number(value) : null;
      dispatch(userEvaluationCalculatorProSkill(evaluationProSkills));
      setDataSource([...evaluationProSkills, dataList[dataList.length - 1]]);
    }
  };

  const handleCalculator2 = (index: number, value: any, difficulty: number) => {
    if (evaluationProSkills.length > 0) {
      const handleTotalPointRow = handleTotalPoint(Number(value), Number(difficulty));
      evaluationProSkills[index].totalPointEvaluator2 = handleTotalPointRow;
      evaluationProSkills[index].pointEvaluator2 = value !== null && value !== undefined ? Number(value) : null;
      dispatch(userEvaluationCalculatorProSkill(evaluationProSkills));
      setDataSource([...evaluationProSkills, dataList[dataList.length - 1]]);
    }
  };
  const handleSearchForluma = (difficulty: number, maxLength: number) =>
    (settingProFormulas &&
      settingProFormulas.find((f) => f.settingProFormula?.point === difficulty && f.totalItem <= maxLength)
        ?.coefficient) ||
    1;

  const handleTotal = (record: UserEvaluationToProSkillType, index: number, key: HandleTotalType) => {
    return Math.floor(
      Number(evaluationProSkills[index]?.[key] || 0) *
        Number(record.difficulty) *
        handleSearchForluma(record.difficulty, evaluationProSkills.filter((v) => v.isDisable === false).length),
    );
  };

  const handleTotalRow = (key: HandleTotalType) => {
    if (evaluationProSkills.filter((e) => e?.[key] !== null && e?.[key] !== undefined).length <= 0) {
      return null;
    } else {
      return Math.floor(
        evaluationProSkills.reduce((pre: number, cur: UserEvaluationToProSkillType, index) => {
          return pre + (cur.isDisable === false ? handleTotal(cur, index, key) || 0 : 0);
        }, 0),
      );
    }
  };

  const handleTotalPoint = (value: any, difficulty: number) => {
    const handleTotalPointRow = Math.floor(
      Number(value) *
        Number(difficulty) *
        handleSearchForluma(difficulty, evaluationProSkills.filter((e) => e.isDisable === false).length),
    );

    return handleTotalPointRow;
  };

  // ** Col span
  const shareOnCell3 = (record: UserEvaluationToProSkillType) => {
    if (isColSpan(record.itemId)) return { colSpan: 5, style: { verticalAlign: 'top', backgroundColor: '#59ad5b78' } };

    return { style: { verticalAlign: 'top', backgroundColor: record.isDisable ? '#ccc' : 'unset' } };
  };
  const shareOnCell = (record: UserEvaluationToProSkillType) => {
    if (isColSpan(record.itemId)) return { colSpan: 0, style: { verticalAlign: 'top' } };

    return { style: { verticalAlign: 'top', backgroundColor: record.isDisable ? '#ccc' : 'unset' } };
  };

  const onCell = (record: any) => {
    return {
      style: {
        verticalAlign: 'top',
        backgroundColor: record.itemNo === -1 ? '#59ad5b78' : record.isDisable ? '#ccc' : 'unset',
      },
    };
  };

  const columns: ColumnsType<UserEvaluationToProSkillType> | UserEvaluationToProSkillType = [
    {
      title: t('IDS_JOB_TYPE'),
      width: 130,
      dataIndex: 'jobType',
      onCell: shareOnCell,
      align: 'left' as const,
    },
    {
      title: t('IDS_EVALUATION_ITEM'),
      dataIndex: 'itemTitle',
      width: 130,

      onCell: shareOnCell3,
      render: (text, record) => <div style={{ textAlign: isColSpan(record.itemId) ? 'center' : 'left' }}>{text}</div>,
    },
    {
      title: t('IDS_EVALUATION_CONTENT'),
      dataIndex: 'content',
      width: '30%',

      // width: 80,
      onCell: shareOnCell,
    },
    {
      title: t('IDS_DIFFICULTY'),

      width: 70,
      dataIndex: 'difficulty',
      align: 'center' as const,
      onCell: shareOnCell,
    },
    {
      title: t('IDS_EVALUATION_CRITERIA'),
      dataIndex: 'note',

      width: 'auto',
      render: (text, record, _index) =>
        !isColSpan(record.itemId) ? (
          <div style={{ textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-word', minWidth: '300px' }}>
            {text}
          </div>
        ) : (
          <></>
        ),
      onCell: shareOnCell,
    },

    {
      title: ' ',
      width: 50,
      dataIndex: 'action',
      align: 'center' as const,
      onCell: shareOnCell,

      render: (_, record) => {
        return (
          <Button
            hidden={isHiddenButtonUserCreateContent}
            icon={<DeleteOutlined />}
            style={{ color: '#0f7a12' }}
            onClick={() => deleteRow(record.key)}
          />
        );
      },
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
      render: (text: any, record: UserEvaluationToProSkillType, index: any) => {
        if (isEditUserEvaluation && !record.isDisable) {
          if (isColSpan(record.itemId)) {
            return <>{handleTotalRow('pointUser')}</>;
          }

          return (
            <Row align={'middle'}>
              <Col
                span={checkPointIs0(evaluationProSkills?.[index]?.pointUser) ? SPAN_ITEM : SPAN_ITEM_NO_ALERT}
                offset={SPAN_OFFSET}
              >
                <Item
                  style={{ textAlign: 'left', margin: 0 }}
                  name={`evaluationUser-key${record.key}`}
                  initialValue={text}
                  rules={[
                    {
                      validator: async (_, value) => {
                        if (value === null || value === '' || value === undefined) {
                          return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                        }
                      },
                    },
                  ]}
                >
                  <Select
                    options={options}
                    onChange={(value) => handleCalculatorUser(index, value, record.difficulty)}
                    allowClear
                    showSearch
                  />
                </Item>
              </Col>
              <Col span={checkPointIs0(evaluationProSkills?.[index]?.pointUser) ? SPAN_ICON : SPAN_ICON_NO_ALERT}>
                {evaluationProSkills?.[index]?.pointUser === 0 && displayAlert0Point}
              </Col>
              <Col span={checkPointIs0(evaluationProSkills?.[index]?.pointUser) ? SPAN_POINT : SPAN_POINT_NO_ALERT}>
                <Typography style={{ fontWeight: 600 }}>({handleTotal(record, index, 'pointUser')})</Typography>
              </Col>
            </Row>
          );
        }

        if (isColSpan(record.itemId)) return text;

        return (
          <>
            {record.totalPointUser !== null && record.totalPointUser !== undefined ? (
              <div style={{ display: 'flex' }}>
                <div style={{ flexBasis: '45%', textAlign: 'right' }}>{text || 0}</div>
                <div style={{ flexBasis: '5%', letterSpacing: '1px' }}></div>
                <div style={{ flexBasis: '45%', textAlign: 'left', fontWeight: 600 }}>
                  ({record.totalPointUser || 0})
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
      render: (text: any, record: UserEvaluationToProSkillType, index: any) => {
        if (isEditEvaluation05 && !record.isDisable) {
          if (isColSpan(record.itemId)) return <>{handleTotalRow('pointEvaluator05')}</>;

          return (
            <Row align={'middle'}>
              <Col
                offset={SPAN_OFFSET}
                span={checkPointIs0(evaluationProSkills?.[index]?.pointEvaluator05) ? SPAN_ITEM : SPAN_ITEM_NO_ALERT}
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
                  name={`evaluation05-key${record.key}`}
                  initialValue={text}
                >
                  <Select
                    allowClear
                    showSearch
                    options={options}
                    onChange={(value) => handleCalculator05(index, value, record.difficulty)}
                  />
                </Item>
              </Col>
              <Col
                span={checkPointIs0(evaluationProSkills?.[index]?.pointEvaluator05) ? SPAN_ICON : SPAN_ICON_NO_ALERT}
              >
                {evaluationProSkills?.[index]?.pointEvaluator05 === 0 && displayAlert0Point}
              </Col>
              <Col
                span={checkPointIs0(evaluationProSkills?.[index]?.pointEvaluator05) ? SPAN_POINT : SPAN_POINT_NO_ALERT}
              >
                <Typography style={{ fontWeight: 600 }}>({handleTotal(record, index, 'pointEvaluator05')})</Typography>
              </Col>
            </Row>
          );
        }

        if (isColSpan(record.itemId)) return text;

        return (
          <>
            {record.totalPointEvaluator05 !== null && record.totalPointEvaluator05 !== undefined ? (
              <div style={{ display: 'flex' }}>
                <div style={{ flexBasis: '45%', textAlign: 'right' }}>{text || 0}</div>
                <div style={{ flexBasis: '5%', letterSpacing: '1px' }}></div>
                <div style={{ flexBasis: '45%', textAlign: 'left', fontWeight: 600 }}>
                  ({record.totalPointEvaluator05 || 0})
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
      render: (text: any, record: UserEvaluationToProSkillType, index: any) => {
        if (isEditEvaluation1 && !record.isDisable) {
          if (isColSpan(record.itemId)) return <>{handleTotalRow('pointEvaluator1')}</>;

          return (
            <Row align={'middle'}>
              <Col
                offset={SPAN_OFFSET}
                span={checkPointIs0(evaluationProSkills?.[index]?.pointEvaluator1) ? SPAN_ITEM : SPAN_ITEM_NO_ALERT}
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
                  name={`evaluation10-key${record.key}`}
                  initialValue={text}
                >
                  <Select
                    allowClear
                    showSearch
                    options={options}
                    onChange={(value) => handleCalculator1(index, value, record.difficulty)}
                  />
                </Item>
              </Col>
              <Col span={checkPointIs0(evaluationProSkills?.[index]?.pointEvaluator1) ? SPAN_ICON : SPAN_ICON_NO_ALERT}>
                {evaluationProSkills?.[index]?.pointEvaluator1 === 0 && displayAlert0Point}
              </Col>
              <Col
                span={checkPointIs0(evaluationProSkills?.[index]?.pointEvaluator1) ? SPAN_POINT : SPAN_POINT_NO_ALERT}
              >
                <Typography style={{ fontWeight: 600 }}>({handleTotal(record, index, 'pointEvaluator1')})</Typography>
              </Col>
            </Row>
          );
        }

        if (isColSpan(record.itemId)) return text;

        return (
          <>
            {record.totalPointEvaluator1 !== null && record.totalPointEvaluator1 !== undefined ? (
              <div style={{ display: 'flex' }}>
                <div style={{ flexBasis: '45%', textAlign: 'right' }}>{text || 0}</div>
                <div style={{ flexBasis: '5%', letterSpacing: '1px' }}></div>
                <div style={{ flexBasis: '45%', textAlign: 'left', fontWeight: 600 }}>
                  ({record.totalPointEvaluator1 || 0})
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
      render: (text: any, record: UserEvaluationToProSkillType, index: any) => {
        if (isEditEvaluation2 && !record.isDisable) {
          if (isColSpan(record.itemId)) return <>{handleTotalRow('pointEvaluator2')}</>;

          return (
            <Row align={'middle'}>
              <Col
                offset={SPAN_OFFSET}
                span={checkPointIs0(evaluationProSkills?.[index]?.pointEvaluator2) ? SPAN_ITEM : SPAN_ITEM_NO_ALERT}
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
                  name={`evaluation20-key${record.key}`}
                  initialValue={text}
                >
                  <Select
                    allowClear
                    showSearch
                    options={options}
                    onChange={(value) => handleCalculator2(index, value, record.difficulty)}
                  />
                </Item>
              </Col>
              <Col span={checkPointIs0(evaluationProSkills?.[index]?.pointEvaluator2) ? SPAN_ICON : SPAN_ICON_NO_ALERT}>
                {evaluationProSkills?.[index]?.pointEvaluator2 === 0 && displayAlert0Point}
              </Col>
              <Col
                span={checkPointIs0(evaluationProSkills?.[index]?.pointEvaluator2) ? SPAN_POINT : SPAN_POINT_NO_ALERT}
              >
                <Typography style={{ fontWeight: 600 }}>({handleTotal(record, index, 'pointEvaluator2')})</Typography>
              </Col>
            </Row>
          );
        }

        if (isColSpan(record.itemId)) return <>{text}</>;

        return (
          <>
            {record.totalPointEvaluator2 !== null && record.totalPointEvaluator2 !== undefined ? (
              <div style={{ display: 'flex' }}>
                <div style={{ flexBasis: '45%', textAlign: 'right' }}>{text || 0}</div>
                <div style={{ flexBasis: '5%', letterSpacing: '1px' }}></div>
                <div style={{ flexBasis: '45%', textAlign: 'left', fontWeight: 600 }}>
                  ({record.totalPointEvaluator2 || 0})
                </div>
              </div>
            ) : (
              ''
            )}
          </>
        );
      },
    });
  if (isEditUserEvaluation && !isHiddenButtonEvaluator) {
    // Giả định nút này thuộc về Evaluator role
    columns.push({
      title: ' ',
      onCell: shareOnCell,
      align: 'center' as const,
      render(value, record, index) {
        if (isColSpan(record.itemId)) return <></>;

        return (
          <>
            <Space direction="horizontal">
              <Tooltip
                key={record.isDisable ? `disabled${index}` : `enabled${index}`}
                title={
                  record.isDisable ? (t('IDS_TOOLTIP_EVALUATE') as string) : (t('IDS_TOOLTIP_NO_EVALUATE') as string)
                }
                color="#424242"
                overlayInnerStyle={{ fontSize: '11px' }}
              >
                <Button
                  loading={isLoading}
                  hidden={record.isEvaluateDate ? true : false}
                  icon={
                    record.isDisable ? (
                      <UndoOutlined onClick={() => {}} style={{ color: 'green' }} />
                    ) : (
                      <StopOutlined style={{ color: 'red' }} />
                    )
                  }
                  size="middle"
                  onClick={() => {
                    disableItem(
                      index,
                      record.isDisable,
                      Boolean(isEditUserEvaluation),
                      Boolean(isEditEvaluation05),
                      Boolean(isEditEvaluation1),
                      Boolean(isEditEvaluation2),
                    );
                  }}
                />
              </Tooltip>
            </Space>
          </>
        );
      },
    });
  }

  if (isHiddenButtonUserCreateContent || isHiddenButtonEvaluator)
    return columns.filter((f: any) => f.dataIndex !== 'action');

  return columns;
};

export default proSkillColumn;
