// ** Antd Imports
import Icon from '@ant-design/icons';
import { DeleteOutlined, InfoCircleOutlined, ProfileOutlined } from '@ant-design/icons/lib/icons';
import { Popover, Tooltip } from 'antd';
import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import TextArea from 'antd/es/input/TextArea';
import Select from 'antd/es/select';
import { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import { CSSProperties, startTransition, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIdAchievement, isFloat } from '../../../../common/util';
import { AppDispatch, RootState } from '../../../../store';
import { setFocusAchievementPersonalError, userEvaluationAchievement } from '../../../../store/userEvaluation';
import { UserEvaluationAchievementType } from '../../../../types/pages/user-evaluation/UserEvaluationType';

interface Props {
  deleteRow: (key: string | number, index: number) => void;
  achievementSettings: { value: any; label: string }[];
  dataSources: any[];
  isHiddenInput?: boolean;

  // ** evaluator 0.5
  isDisplayEvaluator05: boolean;
  isEditEvaluation05: boolean;

  // ** evaluator 1.0
  isDisplayEvaluator1: boolean;
  isEditEvaluation1: boolean;

  // ** evaluator 2.0
  isDisplayEvaluator2: boolean;
  isEditEvaluation2: boolean;

  // ** Modal
  setOpenPopup: (props: { isOpen: boolean; childrens: any }) => void;
  isDisplayUserEvaluator?: boolean;

  isOpen: boolean;
  setDataSource: React.Dispatch<React.SetStateAction<any[]>>;
}
const AchievementColumnPersonal810 = ({
  deleteRow,
  achievementSettings,
  dataSources,
  isHiddenInput,
  isDisplayEvaluator05,
  isEditEvaluation05,
  isDisplayEvaluator1,
  isEditEvaluation1,
  isDisplayEvaluator2,
  isEditEvaluation2,

  setOpenPopup,
  isDisplayUserEvaluator,
  setDataSource,
}: Props) => {
  const { Item } = Form;
  const store = useSelector((state: RootState) => state.userEvaluation);
  const userEvaluationAchievements: any[] = store.achievementDatas?.map((v: any) => ({ ...v })) || [];

  const reduceDatas = userEvaluationAchievements.reduce((pre, curr, index) => ({ ...pre, [index]: curr }), {});
  const [evaluationAchievementOjb, setEvaluationAchievement] = useState<any>(reduceDatas);

  const dispatch = useDispatch<AppDispatch>();
  const widthColumnEvaluator = (isEdit: boolean | undefined) => (!isEdit ? '60px' : '120px');
  const widthColumnEvaluator05 = (isEdit: boolean | undefined) => (!isEdit ? '60px' : '170px');

  // ** Data redux Achievement Persional
  const isFocusAchievementPersonalError = store.isFocusAchievementPersonalError;

  // ** Effect
  useEffect(() => {
    const convertDataList = Object.values(evaluationAchievementOjb);
    if (convertDataList.length > 0) dispatch(userEvaluationAchievement(convertDataList));
  }, [evaluationAchievementOjb]);

  const widthColumn = isHiddenInput ? '100px' : '10%';

  // ** Functional
  const onCell = () => {
    return { style: { verticalAlign: 'top', padding: 0 } };
  };

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

  let columns: ColumnsType<UserEvaluationAchievementType> = [
    {
      title: t('IDS_ACHIEVEMENT_PERSONAL'),
      dataIndex: 'title',
      width: '150px',
      align: 'left' as const,
      key: 'title',

      onCell,
      render: (text, record, index) => (
        <>
          {index !== 0 && <div style={styleTitle}>{t('IDS_ACHIEVEMENT_PERSONAL')}</div>}

          {!isHiddenInput ? (
            <Item
              name={`achievement-personal-title-key-${record.key}`}
              initialValue={text}
              rules={[
                { type: 'string' },
                { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string },
                { max: 1000, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '1000') },
              ]}
              style={{ textAlign: 'left', margin: 0 }}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 100 }}
                maxLength={1001}
                onChange={(e) => {
                  const reduceDatas = userEvaluationAchievements.reduce(
                    (pre, curr, index) => ({ ...pre, [index]: curr }),
                    {},
                  );

                  const value = e.target.value;

                  reduceDatas[index] = {
                    ...reduceDatas[index],
                    title: value,
                    key: record.key,
                  };

                  startTransition(() => setEvaluationAchievement({ ...reduceDatas }));
                }}
              />
            </Item>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
          )}
        </>
      ),
    },
    {
      title: t('IDS_ACHIEVEMENT_VALUE'),
      dataIndex: 'achievementValue',
      width: '250px',
      align: 'left' as const,
      key: 'achievementValue',
      onCell,
      render: (text, record, index) => (
        <>
          {index !== 0 && <div style={styleTitle}>{t('IDS_ACHIEVEMENT_VALUE')}</div>}

          {!isHiddenInput ? (
            <Item
              name={`achievement-personal-achievementValue-key-${record.key}`}
              initialValue={text}
              rules={[
                { type: 'string' },
                { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string },
                { max: 1000, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '1000') },
              ]}
              style={{ textAlign: 'left', margin: 0 }}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 100 }}
                maxLength={1001}
                onChange={(e) => {
                  const reduceDatas = userEvaluationAchievements.reduce(
                    (pre, curr, index) => ({ ...pre, [index]: curr }),
                    {},
                  );
                  const value = e.target.value;
                  reduceDatas[index] = {
                    ...reduceDatas[index],
                    achievementValue: value,
                    key: record.key,
                  };
                  startTransition(() => setEvaluationAchievement({ ...reduceDatas }));
                }}
              />
            </Item>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
          )}
        </>
      ),
    },
    {
      title: t('IDS_METHOD'),
      dataIndex: 'method',
      align: 'left' as const,
      key: 'method',
      onCell,
      render: (text, record, index) => (
        <>
          {index !== 0 && <div style={styleTitle}>{t('IDS_METHOD')}</div>}

          {!isHiddenInput ? (
            <Item
              name={`achievement-personal-method-key-${record.key}`}
              initialValue={text}
              rules={[
                { type: 'string' },
                { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string },
                {
                  max: 5000,
                  message: (t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER') as string).replace('{maxLength}', '5000'),
                },
              ]}
              style={{ textAlign: 'left', margin: 0 }}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 100 }}
                maxLength={5001}
                onChange={(e) => {
                  const reduceDatas = userEvaluationAchievements.reduce(
                    (pre, curr, index) => ({ ...pre, [index]: curr }),
                    {},
                  );
                  const value = e.target.value;
                  reduceDatas[index] = {
                    ...reduceDatas[index],
                    method: value,
                    key: record.key,
                  };
                  startTransition(() => setEvaluationAchievement({ ...reduceDatas }));
                }}
              />
            </Item>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
          )}
        </>
      ),
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
      align: 'center' as const,
      key: 'weight',
      width: widthColumn,
      onCell,
      render: (text, record, index) => (
        <>
          {index !== 0 && (
            <div style={styleTitle}>
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
            </div>
          )}

          {!isHiddenInput ? (
            <Item
              name={`achievement-personal-weight-key-${record.key}`}
              initialValue={text}
              style={{ textAlign: 'left', margin: 0 }}
              className={
                isFocusAchievementPersonalError
                  ? 'focus-achievement-personal-error'
                  : 'focus-achievement-personal-error'
              }
              rules={[
                {
                  validator(_, value: string) {
                    if (!value || value === '')
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string));
                    else if (isNaN(Number(value))) {
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER') as string));
                    } else if (isFloat(value)) {
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER') as string));
                    } else if (Number(value) < 1)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_MIN_POINT').replace('{min value}', '0') as string),
                      );
                    else if (Number(value) > 100)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '100')));

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                className="inputWeight"
                suffix={'%'}
                maxLength={3}
                styles={{
                  input: {
                    borderRadius: '6px',
                  },
                }}
                style={{
                  borderRadius: '6px',
                  outline: 'none',
                  borderColor: isFocusAchievementPersonalError ? '#FF4D4F' : '',
                }}
                onChange={(e) => {
                  const reduceDatas = userEvaluationAchievements.reduce(
                    (pre, curr, index) => ({ ...pre, [index]: curr }),
                    {},
                  );
                  const value = e.target.value;

                  reduceDatas[index] = {
                    ...reduceDatas[index],
                    weight: value,
                    key: record.key,
                  };
                  startTransition(() => {
                    isFocusAchievementPersonalError && dispatch(setFocusAchievementPersonalError(false));
                    setEvaluationAchievement({ ...reduceDatas });
                  });
                }}
              />
            </Item>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
          )}
        </>
      ),
    },
    {
      title: (
        <>
          {t('IDS_EVALUATION_JUDGMENT_INDEX_TITLE')}
          <Tooltip
            title={t('IDS_EVALUATION_JUDGMENT_INDEX_TOOLTIP') as string}
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
      width: '80px',
      align: 'center' as const,
      key: 'popupSub',
      onCell,
      render(_, record) {
        return (
          <>
            <ProfileOutlined
              style={{ color: '#007240 ', fontSize: 25, marginTop: 2 }}
              onClick={() => setOpenPopup({ isOpen: true, childrens: record })}
            />
          </>
        );
      },

      // dataIndex: '1',
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
      dataIndex: 'difficultyUser',
      key: 'difficultyUser',
      width: widthColumnEvaluator(!isHiddenInput),
      align: 'center' as const,
      onCell,
      render: (text, record, index) => (
        <>
          {index !== 0 && (
            <div style={styleTitle}>
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
            </div>
          )}

          {!isHiddenInput ? (
            <Item
              name={`achievement-personal-difficultyUser-key-${record.key}`}
              initialValue={text}
              rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
              style={{ margin: 0, textAlign: 'left' }}
            >
              <Select
                allowClear
                showSearch
                options={achievementSettings}
                style={{ textAlign: 'center' }}
                onChange={(value) => {
                  const reduceDatas = userEvaluationAchievements.reduce(
                    (pre, curr, index) => ({ ...pre, [index]: curr }),
                    {},
                  );
                  reduceDatas[index] = {
                    ...reduceDatas[index],
                    difficultyUser: value,
                    key: record.key,
                  };
                  startTransition(() => setEvaluationAchievement({ ...reduceDatas }));
                }}
              />
            </Item>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap' }}>{text ? parseFloat(text).toFixed(1) : ''}</div>
          )}
        </>
      ),
    },

    {
      title: ' ',
      dataIndex: 'action',
      align: 'center' as const,
      key: 'action',
      width: '50px',
      onCell,
      render: (_, record, index) => (
        <>
          {index !== 0 && <div style={styleTitle}>{t(' ')}</div>}

          <Button
            icon={<DeleteOutlined />}
            style={{ color: '#007240' }}
            onClick={() => {
              // let key: string = index.toString();

              let key: string = record?.key?.toString();
              Object.keys(evaluationAchievementOjb).some((s) => {
                if (evaluationAchievementOjb[s].key === record.key) return (key = s);
              });

              if (key) {
                delete evaluationAchievementOjb[key];

                const converObj: any = Object.values(evaluationAchievementOjb).reduce(
                  (pre: any, curr, index) => ({ ...pre, [index]: curr }),
                  {},
                );

                // setEvaluationAchievement({ ...converObj });

                deleteRow(record.key, index);
              }
            }}
          />
        </>
      ),
    },
  ];
  // if (isDisplayUserEvaluator)
  //   columns.push({
  //     title: (
  //       <>
  //         {t('IDS_EVALUATION_JUDGMENT_INDEX_TITLE')}
  //         <Tooltip
  //           title={t('IDS_EVALUATION_JUDGMENT_INDEX_TOOLTIP') as string}
  //           color="#424242"
  //           overlayInnerStyle={{ fontSize: '11px' }}
  //         >
  //           <Icon
  //             component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
  //             style={{ cursor: 'default', paddingLeft: 2 }}
  //           />
  //         </Tooltip>
  //       </>
  //     ),
  //     width: '80px',
  //     align: 'center' as const,
  //     onCell,
  //     render(_, record) {
  //       return (
  //         <>
  //           <ProfileOutlined
  //             style={{ color: '#007240 ', fontSize: 25, marginTop: 2 }}
  //             onClick={() => setOpenPopup({ isOpen: true, childrens: record })}
  //           />
  //         </>
  //       );
  //     },

  //     // dataIndex: '1',
  //   });
  if (isDisplayEvaluator05 || isDisplayEvaluator1 || isDisplayEvaluator2) {
    const indexUser = columns.findIndex((f) => f.key === 'difficultyUser');
    columns.splice(indexUser, 1);
    columns.push({
      key: 'difficulty',
      title: (
        <>
          {t('IDS_DIFFICULTY')}
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
      children: [
        {
          title: t('IDS_POINT_USER'),
          dataIndex: 'difficultyUser',
          key: 'difficultyUser',

          // width: widthColumnEvaluator(!isHiddenInput),
          width: isHiddenInput ? '59px' : '120px',
          align: 'center' as const,
          onCell,
          render: (text, record, index) => {
            if (!isHiddenInput)
              return (
                <Item
                  name={`achievement-personal-difficultyUser-key-${record.key}`}
                  initialValue={text}
                  rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
                  style={{ textAlign: 'center', margin: 0 }}
                >
                  <Select
                    allowClear
                    showSearch
                    options={achievementSettings}
                    onChange={(value) => {
                      evaluationAchievementOjb[index] = {
                        ...evaluationAchievementOjb[index],
                        difficultyUser: value,
                        key: record.key,
                      };
                      startTransition(() => setEvaluationAchievement({ ...evaluationAchievementOjb }));
                    }}
                  />
                </Item>
              );

            return <>{text ? parseFloat(text).toFixed(1) : 0}</>;
          },
        },
      ],
    });
  }
  const indexParent = columns.findIndex((f) => f.key === 'difficulty');

  // ** evaluator 0.5
  if (isDisplayEvaluator05)
    (columns[indexParent] as { children: any[] }).children.push({
      title: t('IDS_EVALUATOR_0_5'),
      dataIndex: 'difficultyEvaluator05',
      key: 'difficultyUser05',

      // width: widthColumnEvaluator05(isEditEvaluation05),
      width: !isEditEvaluation05 ? '69.5px' : '169px',
      align: 'center' as const,
      onCell,
      render: (text: string, record: any) => {
        if (isEditEvaluation05)
          return (
            <Item
              name={`achievement-personal-difficultyUser05-key-${record.key}`}
              initialValue={text}
              rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
              style={{ textAlign: 'center', margin: 0 }}
            >
              <Select
                allowClear
                showSearch
                options={achievementSettings}
                onChange={(value) => {
                  const index = userEvaluationAchievements.findIndex((f) => f.key === record.key);
                  if (index >= 0) {
                    userEvaluationAchievements[index] = {
                      ...userEvaluationAchievements[index],
                      difficultyEvaluator05: value,
                    };
                    dispatch(userEvaluationAchievement(userEvaluationAchievements));
                  }
                }}
              />
            </Item>
          );

        return <>{text ? parseFloat(text).toFixed(1) : ''}</>;
      },
    });

  // ** evaluator 1.0
  if (isDisplayEvaluator1)
    (columns[indexParent] as { children: any[] }).children.push({
      title: t('IDS_POINT_EVALUATOR_1'),
      dataIndex: 'difficultyEvaluator1',
      key: 'difficultyUser1',

      // width: widthColumnEvaluator(isEditEvaluation1),
      width: !isEditEvaluation1 ? '59px' : '169.5px',
      align: 'center' as const,
      onCell,
      render: (text: string, record: any) => {
        if (isEditEvaluation1)
          return (
            <Item
              name={`achievement-personal-difficultyUser1-key-${record.key}`}
              initialValue={text}
              rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
              style={{ textAlign: 'center', margin: 0 }}
            >
              <Select
                allowClear
                showSearch
                options={achievementSettings}
                onChange={(value) => {
                  const index = userEvaluationAchievements.findIndex((f) => f.key === record.key);
                  if (index >= 0) {
                    userEvaluationAchievements[index] = {
                      ...userEvaluationAchievements[index],
                      difficultyEvaluator1: value,
                    };
                    dispatch(userEvaluationAchievement(userEvaluationAchievements));
                  }
                }}
              />
            </Item>
          );

        return <>{text ? parseFloat(text).toFixed(1) : ''}</>;
      },
    });

  // ** evaluator 2.0
  if (isDisplayEvaluator2)
    (columns[indexParent] as { children: any[] }).children.push({
      title: t('IDS_POINT_EVALUATOR_2'),
      dataIndex: 'difficultyEvaluator2',
      key: 'difficultyUser2',

      // width: widthColumnEvaluator(isEditEvaluation2),
      width: !isEditEvaluation2 ? '58.5px' : '169px',
      align: 'center' as const,
      onCell,
      render: (text: string, record: any) => {
        if (isEditEvaluation2)
          return (
            <Item
              name={`achievement-personal-difficultyUser3-key-${record.key}`}
              initialValue={text}
              rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
              style={{ textAlign: 'center', margin: 0 }}
            >
              <Select
                allowClear
                showSearch
                options={achievementSettings}
                onChange={(value) => {
                  const index = userEvaluationAchievements.findIndex((f) => f.key === record.key);
                  if (index >= 0) {
                    userEvaluationAchievements[index] = {
                      ...userEvaluationAchievements[index],
                      difficultyEvaluator2: value,
                    };
                    dispatch(userEvaluationAchievement(userEvaluationAchievements));
                  }
                }}
              />
            </Item>
          );

        return <>{text ? parseFloat(text).toFixed(1) : ''}</>;
      },
    });
  if (!isDisplayUserEvaluator) columns = columns.filter((f: any) => f.key !== 'popupSub');
  if (isHiddenInput) return columns.filter((f: any) => f.dataIndex !== 'action');

  return columns;
};

const { Item } = Form;
export const AchievementSubColumn2 = ({
  key,
  index,
  isHiddenInput,
  handle,
}: {
  isHiddenInput?: boolean;
  key: string | number;
  index: number;
  handle: any;
  isOpen: boolean;
}) => {
  const columns: ColumnsType<any[]> = [
    {
      title: t('IDS_EVALUATION_JUDGMENT_INDEX'),
      dataIndex: 'evaluationDecision',

      render: (text, record: any, i) => {
        if (!isHiddenInput) {
          return (
            <Item
              name={`achievement-personal-note-key-${record.key}-${key}-${i}`}
              initialValue={text}
              rules={[
                { type: 'string' },
                { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string },
                { max: 1000, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '1000') },
              ]}
              style={{ textAlign: 'left', margin: 0 }}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 100 }}
                maxLength={1001}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value !== null) handle && handle(value, index, i);
                }}
                defaultValue={text}
              />
            </Item>
          );
        }

        return text;
      },
    },
    {
      title: t('IDS_DEGREE'),
      dataIndex: 'degree',
      align: 'left',
      width: 100,
    },
  ];

  return columns;
};

export default AchievementColumnPersonal810;
