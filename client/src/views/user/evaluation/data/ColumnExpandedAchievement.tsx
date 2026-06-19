import Input from 'antd/es/input';
import TextArea from 'antd/es/input/TextArea';
import Select from 'antd/es/select';
import { ColumnsType } from 'antd/es/table';
import { UserEvaluationAchievementType } from '../../../../types/pages/user-evaluation/UserEvaluationType';
import Form, { RuleObject } from 'antd/es/form';

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import {
  userEvaluationAchievement,
  userEvaluationSetAchievementPersonalScore05,
  userEvaluationSetAchievementPersonalScore1,
  userEvaluationSetAchievementPersonalScore2,
  userEvaluationSetAchievementPersonalScoreUser,
} from '../../../../store/userEvaluation';
import { CSSProperties, startTransition, useEffect, useRef, useState } from 'react';
import { t } from 'i18next';
import { isFloat } from '../../../../common/util';
import Tooltip from 'antd/es/tooltip';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { Col, Row } from 'antd';

type keyObject = keyof UserEvaluationAchievementType;
interface Props {
  isDisplayUserEvaluator: boolean;
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
const expandedAchievementColumn = ({
  isDisplayUserEvaluator,
  isEditUserEvaluation,
  isDisplayEvaluator05,
  isEditEvaluation05,
  isDisplayEvaluator1,
  isEditEvaluation1,

  // ** evaluator 2.0
  isDisplayEvaluator2,
  isEditEvaluation2,
  openNotification,
}: Props) => {
  // ** State
  // const [values, setValue] = useState<{ index: number; key: keyObject; value: any }>();

  // ** Hook
  const { Item } = Form;
  const isColSpan = (value: any) => !value;
  const store = useSelector((state: RootState) => state.userEvaluation);
  const dispatch = useDispatch<AppDispatch>();
  const userEvaluationAchievements: any[] = store.achievementDatas?.map((v: any) => ({ ...v })) || [];
  const initialValuesRef = useRef<{ [key: string]: string | undefined | null }>({});

  // ** Effect
  useEffect(() => {
    if (userEvaluationAchievements.length > 0) {
      // ** Set total
      dispatch(userEvaluationSetAchievementPersonalScoreUser(handleTotal('pointUser')));
      dispatch(userEvaluationSetAchievementPersonalScore05(handleTotal('pointEvaluator05')));
      dispatch(userEvaluationSetAchievementPersonalScore1(handleTotal('pointEvaluator1')));
      dispatch(userEvaluationSetAchievementPersonalScore2(handleTotal('pointEvaluator2')));
    }
  }, [userEvaluationAchievements]);

  // useEffect(() => {
  //   const timeout = setTimeout(() => values && handleOnChange(values.index, values.key, values.value), 100);

  //   return () => clearTimeout(timeout);
  // }, [values]);

  const widthColumn = (isEdit: boolean | undefined) => (!isEdit ? '59px' : '170px');

  const widthColumn2 = (isEdit: boolean | undefined) => (!isEdit ? '70px' : '170px');

  // ** Functional
  const handleOnChange = (index: number, key: keyObject, value: any) => {
    if (userEvaluationAchievements.length > 0) {
      userEvaluationAchievements[index][key] = value;
      dispatch(userEvaluationAchievement(userEvaluationAchievements));
      dispatch(userEvaluationSetAchievementPersonalScoreUser(handleTotal(key)));
    }
  };

  const handleTotal = (key: keyObject) => {
    let difficulKey: keyObject = 'difficultyUser';
    if (key === 'pointEvaluator05') difficulKey = 'difficultyEvaluator05';
    if (key === 'pointEvaluator1') difficulKey = 'difficultyEvaluator1';
    if (key === 'pointEvaluator2') difficulKey = 'difficultyEvaluator2';

    if (
      userEvaluationAchievements.filter((e) => e?.[key] !== null && e?.[key] !== undefined && e?.[key] !== '').length <=
      0
    )
      return null;

    return (
      userEvaluationAchievements.reduce(
        (pre, cur: UserEvaluationAchievementType) =>
          Math.round(pre + (Number(cur?.[difficulKey] || 0) * Number(cur.weight || 0) * Number(cur?.[key] || 0)) / 100),
        0,
      ) || 0
    );
  };

  // ** Col span
  const shareOnCell3 = (record: UserEvaluationAchievementType) => {
    if (isColSpan(record.title) && record.key === 0)
      return { colSpan: 3, style: { verticalAlign: 'top', backgroundColor: '#59ad5b78' } };

    return { style: { verticalAlign: 'top' } };
  };
  const shareOnCell = (record: UserEvaluationAchievementType) => {
    if (isColSpan(record.title) && record.key === 0) return { colSpan: 0, style: { verticalAlign: 'top' } };

    return { style: { verticalAlign: 'top' } };
  };

  const onCell = (record: any) => ({
    style: { verticalAlign: 'top', backgroundColor: record.key === 0 ? '#59ad5b78' : '' },
  });

  const styleTitle = {
    fontSize: 13,
    backgroundColor: '#007240',
    color: 'white',
    textAlign: 'center',
    margin: -4,
    marginBottom: 4,
    whiteSpace: 'nowrap',
    padding: '0 4px',
    fontWeight: 'bold',
  } as CSSProperties;

  const columns: ColumnsType<UserEvaluationAchievementType> = [
    {
      title: t('IDS_STATUS_ACHIEVED'),
      dataIndex: 'achievementStatus',
      key: 'achievementStatus',
      align: 'center' as const,
      render: (text, record, index) => (
        <>
          {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
            <div style={styleTitle}>{t('IDS_STATUS_ACHIEVED')}</div>
          )}

          {isColSpan(record.title) && record.key === 0 ? (
            <>{text}</>
          ) : isEditUserEvaluation ? (
            <Item
              rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
              name={`achievementStatus-key${record.key}`}
              style={{ textAlign: 'left', margin: 0 }}
              initialValue={text}
            >
              <Select
                allowClear
                showSearch
                style={{ width: '100%', textAlign: 'left' }}
                options={[
                  { value: t('IDS_ACHIEVED'), label: t('IDS_ACHIEVED') },
                  { value: t('IDS_NOT_ACHIEVE'), label: t('IDS_NOT_ACHIEVE') },
                ]}
                onChange={(value) => handleOnChange(index, 'achievementStatus', value)}
              />
            </Item>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap', minHeight: '22px' }}>{text}</div>
          )}
        </>
      ),
      onCell: shareOnCell3,

      width: 60,
    },
    {
      title: t('IDS_REASON_ACHIEVEMENT'),
      dataIndex: 'reasonComment',
      width: isEditUserEvaluation ? '30%' : 'auto',
      key: 'reasonComment',
      render: (text, record, index) => (
        <>
          {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
            <div style={styleTitle}>{t('IDS_REASON_ACHIEVEMENT')}</div>
          )}

          {isEditUserEvaluation ? (
            <Item
              name={`reasonComment-key-${record.key}`}
              initialValue={text}
              rules={[
                { type: 'string' },
                { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string },
                {
                  max: 1000,
                  message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '1000') as string,
                },
              ]}
              style={{ textAlign: 'left', margin: 0 }}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 100 }}
                maxLength={1001}
                onFocus={(e) => {
                  initialValuesRef.current[`reasonComment-key-${record.key}`] = e.target.value; // Lưu giá trị ban đầu theo key
                }}
                onBlur={(e) => {
                  const newValue = e.target.value ?? '';
                  const oldValue = initialValuesRef.current[`reasonComment-key-${record.key}`] ?? '';

                  if (newValue !== oldValue) {
                    startTransition(() => {
                      handleOnChange(index, 'reasonComment', newValue); // Chỉ chạy nếu có thay đổi
                    });
                  }
                }}
              />
            </Item>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
          )}
        </>
      ),
      onCell: shareOnCell,
    },
    {
      title: t('IDS_ACTION_PLAN'),
      dataIndex: 'actionPlan',
      width: isEditUserEvaluation ? '40%' : 'auto',
      onCell: shareOnCell,
      key: 'actionPlan',
      render: (text, record, index) => (
        <>
          {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
            <div style={styleTitle}>{t('IDS_ACTION_PLAN')}</div>
          )}

          {isEditUserEvaluation ? (
            <Item
              name={`actionPlan-key-${record.key}`}
              initialValue={text}
              rules={[
                { type: 'string' },
                {
                  required: userEvaluationAchievements[index]?.achievementStatus === t('IDS_NOT_ACHIEVE'),
                  message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
                },
                {
                  max: 1000,
                  message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '1000') as string,
                },
              ]}
              style={{ textAlign: 'left', margin: 0 }}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 100 }}
                maxLength={1001}
                onFocus={(e) => {
                  initialValuesRef.current[`actionPlan-key-${record.key}`] = e.target.value; // Lưu giá trị ban đầu theo key
                }}
                onBlur={(e) => {
                  const newValue = e.target.value ?? '';
                  const oldValue = initialValuesRef.current[`actionPlan-key-${record.key}`] ?? '';
                  if (newValue !== oldValue) {
                    startTransition(() => {
                      handleOnChange(index, 'actionPlan', newValue); // Chỉ chạy nếu có thay đổi
                    });
                  }
                }}
              />
            </Item>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
          )}
        </>
      ),
    },
  ];

  const checkPointIs0 = (point: string | number) => {
    return point !== null && point !== '' && Number(point) === 0;
  };
  const SPAN_ICON = 4;
  const FULL_SPAN = 24;
  const calculateSpanAlert0Point = (point: string | number): number => {
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
  const displayAlert0Point = (point: string | number) => {
    if (checkPointIs0(point)) {
      return componentAlert0Point;
    } else {
      return <></>;
    }
  };

  if (isDisplayUserEvaluator)
    columns.push({
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
      key: 'pointUser',
      width: widthColumn(isEditUserEvaluation),
      onCell,
      align: 'center' as const,
      render: (text, record, index) => (
        <>
          {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
            <div style={styleTitle}>
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

          {isEditUserEvaluation ? (
            isColSpan(record.title) && record.key === 0 ? (
              <>{handleTotal('pointUser') !== null ? Math.round(handleTotal('pointUser')) : null}</>
            ) : (
              <Row align="middle">
                <Col span={calculateSpanAlert0Point(userEvaluationAchievements[index]?.pointUser)}>
                  <Item
                    name={`pointUser-key-${record.key}`}
                    style={{ textAlign: 'left', margin: 0, width: '100%' }}
                    initialValue={text}
                    rules={[{ validator }]}
                  >
                    <Input
                      maxLength={3}
                      style={{ textAlign: 'center' }}
                      onFocus={(e) => {
                        initialValuesRef.current[`pointUser-key-${record.key}`] = e.target.value; // Lưu giá trị ban đầu theo key
                      }}
                      onBlur={(e) => {
                        const newValue = e.target.value ?? '';
                        const oldValue = initialValuesRef.current[`pointUser-key-${record.key}`] ?? '';
                        if (newValue !== oldValue) {
                          startTransition(() => {
                            handleOnChange(index, 'pointUser', newValue); // Chỉ chạy nếu có thay đổi
                          });
                        }
                      }}
                    />
                  </Item>
                </Col>
                {displayAlert0Point(userEvaluationAchievements[index]?.pointUser)}
              </Row>
            )
          ) : text !== null ? (
            Math.round(text)
          ) : (
            ''
          )}
        </>
      ),
    });

  // ** evaluator 0.5
  if (isDisplayEvaluator05)
    columns.push({
      title: (
        <>
          {t('IDS_EVALUATION_0_5')}
          <Tooltip title={t('IDS_TOOLTIP_ACHIEVEMENT_COLUMN')} color="#424242" overlayInnerStyle={{ fontSize: '11px' }}>
            <Icon
              component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
              style={{ cursor: 'default', paddingLeft: 2 }}
            />
          </Tooltip>
        </>
      ),
      dataIndex: 'pointEvaluator05',
      key: 'pointEvaluator05',
      width: widthColumn2(isEditEvaluation05),
      onCell,
      align: 'center' as const,
      render: (text, record, index) => (
        <>
          {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
            <div style={styleTitle}>
              {t('IDS_EVALUATION_0_5')}
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

          {isEditEvaluation05 ? (
            isColSpan(record.title) && record.key === 0 ? (
              <>{handleTotal('pointEvaluator05') !== null ? Math.round(handleTotal('pointEvaluator05')) : null}</>
            ) : (
              <Row align="middle">
                <Col span={calculateSpanAlert0Point(userEvaluationAchievements[index]?.pointEvaluator05)}>
                  <Item
                    name={`point05-key-${record.key}`}
                    style={{ textAlign: 'left', margin: 0, width: '100%' }}
                    initialValue={text}
                    rules={[{ validator }]}
                  >
                    <Input
                      maxLength={3}
                      style={{ textAlign: 'center' }}
                      onFocus={(e) => {
                        initialValuesRef.current[`point05-key-${record.key}`] = e.target.value; // Lưu giá trị ban đầu theo key
                      }}
                      onBlur={(e) => {
                        const newValue = e.target.value ?? '';
                        const oldValue = initialValuesRef.current[`point05-key-${record.key}`] ?? '';
                        if (newValue !== oldValue) {
                          startTransition(() => {
                            handleOnChange(index, 'pointEvaluator05', newValue); // Chỉ chạy nếu có thay đổi
                          });
                        }
                      }}
                    />
                  </Item>
                </Col>
                {displayAlert0Point(userEvaluationAchievements[index]?.pointEvaluator05)}
              </Row>
            )
          ) : text !== null ? (
            Math.round(text)
          ) : (
            ''
          )}
        </>
      ),
    });

  // ** evaluator 1.0
  if (isDisplayEvaluator1)
    columns.push({
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
      dataIndex: 'pointEvaluator1',
      key: 'pointEvaluator1',
      width: widthColumn(isEditEvaluation1),
      onCell,
      align: 'center' as const,
      render: (text, record, index) => (
        <>
          {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
            <div style={styleTitle}>
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

          {isEditEvaluation1 ? (
            isColSpan(record.title) && record.key === 0 ? (
              <>{handleTotal('pointEvaluator1') !== null ? Math.round(handleTotal('pointEvaluator1')) : null}</>
            ) : (
              <Row align="middle">
                <Col span={calculateSpanAlert0Point(userEvaluationAchievements[index]?.pointEvaluator1)}>
                  <Item
                    name={`point1-key-${record.key}`}
                    style={{ textAlign: 'left', margin: 0, width: '100%' }}
                    initialValue={text}
                    rules={[{ validator }]}
                  >
                    <Input
                      maxLength={3}
                      style={{ textAlign: 'center' }}
                      onFocus={(e) => {
                        initialValuesRef.current[`point1-key-${record.key}`] = e.target.value; // Lưu giá trị ban đầu theo key
                      }}
                      onBlur={(e) => {
                        const newValue = e.target.value ?? '';
                        const oldValue = initialValuesRef.current[`point1-key-${record.key}`] ?? '';
                        if (newValue !== oldValue) {
                          startTransition(() => {
                            handleOnChange(index, 'pointEvaluator1', newValue); // Chỉ chạy nếu có thay đổi
                          });
                        }
                      }}
                    />
                  </Item>
                </Col>
                {displayAlert0Point(userEvaluationAchievements[index]?.pointEvaluator1)}
              </Row>
            )
          ) : text !== null ? (
            Math.round(text)
          ) : (
            ''
          )}
        </>
      ),
    });

  // ** evaluator 2.0
  if (isDisplayEvaluator2)
    columns.push({
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
      dataIndex: 'pointEvaluator2',
      key: 'pointEvaluator2',
      width: widthColumn(isEditEvaluation2),
      onCell,
      align: 'center' as const,
      render: (text, record, index) => (
        <>
          {index !== 0 && record.achievementStatus !== t('IDS_SUB_TOTAL') && (
            <div style={styleTitle}>
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

          {isEditEvaluation2 ? (
            isColSpan(record.title) && record.key === 0 ? (
              <>{handleTotal('pointEvaluator2') !== null ? Math.round(handleTotal('pointEvaluator2')) : null}</>
            ) : (
              <Row align="middle">
                <Col span={calculateSpanAlert0Point(userEvaluationAchievements[index]?.pointEvaluator2)}>
                  <Item
                    name={`point2-key-${record.key}`}
                    style={{ textAlign: 'left', margin: 0, width: '100%' }}
                    initialValue={text}
                    rules={[{ validator }]}
                  >
                    <Input
                      maxLength={3}
                      style={{ textAlign: 'center' }}
                      onFocus={(e) => {
                        initialValuesRef.current[`point2-key-${record.key}`] = e.target.value; // Lưu giá trị ban đầu theo key
                      }}
                      onBlur={(e) => {
                        const newValue = e.target.value ?? '';
                        const oldValue = initialValuesRef.current[`point2-key-${record.key}`] ?? '';
                        if (newValue !== oldValue) {
                          startTransition(() => {
                            handleOnChange(index, 'pointEvaluator2', newValue); // Chỉ chạy nếu có thay đổi
                          });
                        }
                      }}
                    />
                  </Item>
                </Col>
                {displayAlert0Point(userEvaluationAchievements[index]?.pointEvaluator2)}
              </Row>
            )
          ) : text !== null ? (
            Math.round(text)
          ) : (
            ''
          )}
        </>
      ),
    });

  return columns;
};

function validator(_: RuleObject, value: any): Promise<any> {
  if (value === null || value === undefined || value === '')
    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string));
  else if (isNaN(Number(value))) {
    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER') as string));
  } else if (isFloat(value)) {
    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER') as string));
  } else if (Number(value) < 0)
    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MIN_POINT').replace('{min value}', '-1')));
  else if (Number(value) > 100)
    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '100')));

  return Promise.resolve();
}

export default expandedAchievementColumn;
