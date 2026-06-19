// ** Antd Imports
import { ColumnsType } from 'antd/es/table';
import { AchievementAdditionalType } from '../../../../types/pages/user-evaluation/UserEvaluationType';
import Form from 'antd/es/form';
import TextArea from 'antd/es/input/TextArea';
import Select from 'antd/es/select';
import Button from 'antd/es/button';
import { DeleteOutlined } from '@ant-design/icons/lib/icons';
import { Dispatch, SetStateAction, startTransition, useEffect, useState } from 'react';

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import {
  setDeleteOption,
  userEvaluationAchievementAdditional,
  userEvaluationSetAchievementAdditionalScore05,
  userEvaluationSetAchievementAdditionalScore1,
  userEvaluationSetAchievementAdditionalScore2,
  userEvaluationSetAchievementAdditionalScoreUser,
} from '../../../../store/userEvaluation';
import { t } from 'i18next';

type KeyObject = 'pointUser' | 'pointEvaluator05' | 'pointEvaluator1' | 'pointEvaluator2';
type ColumnType = 'title' | 'status' | 'reason' | 'evaluation';
interface Props {
  achievementAddSettings: { value: any; label: string }[];
  deleteRow: (key: string | number) => void;
  achievementAdditionals: AchievementAdditionalType[];
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
  setIsOpenPopUpConfirm: Dispatch<SetStateAction<boolean>>;
  evaluationAchievementAddOjb: any;
  setEvaluationAchievementAdd: any;
  status: number;
}

const achievementAdditionalColumn = ({
  deleteRow,
  achievementAdditionals,
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
  setIsOpenPopUpConfirm,
  evaluationAchievementAddOjb,
  setEvaluationAchievementAdd,
  status,
}: Props) => {
  // ** State

  const store = useSelector((state: RootState) => state.userEvaluation);

  const totalAdditional = (key: KeyObject) => {
    if (
      Object.values(evaluationAchievementAddOjb).filter(
        (e: any) =>
          store.additionPoinOptions.find((s: any) => s.label === e?.[key])?.value !== null &&
          store.additionPoinOptions.find((s: any) => s.label === e?.[key])?.value !== undefined,
      ).length <= 0
    )
      return null;

    return Object.values(evaluationAchievementAddOjb).reduce(
      (pre: number, cur: any) =>
        pre + Number(store.additionPoinOptions.find((s: any) => s.label === cur?.[key])?.value || 0),
      0,
    );
  };

  // ** Effect

  useEffect(() => {
    const convertDataList = Object.values(evaluationAchievementAddOjb);
    const total =
      convertDataList.filter(
        (e: any) =>
          store.additionPoinOptions.find((s: any) => s.label === e.pointUser)?.value !== null &&
          store.additionPoinOptions.find((s: any) => s.label === e.pointUser)?.value !== undefined,
      ).length <= 0
        ? null
        : convertDataList.reduce(
            (pre: number, cur: any) =>
              pre + Number(store.additionPoinOptions.find((s: any) => s.label === cur.pointUser)?.value || 0),
            0,
          );

    if (store.additionPoinOptions.length > 0) {
      dispatch(userEvaluationSetAchievementAdditionalScoreUser(total));
      dispatch(userEvaluationSetAchievementAdditionalScore05(totalAdditional('pointEvaluator05')));
      dispatch(userEvaluationSetAchievementAdditionalScore1(totalAdditional('pointEvaluator1')));
      dispatch(userEvaluationSetAchievementAdditionalScore2(totalAdditional('pointEvaluator2')));
      dispatch(userEvaluationAchievementAdditional(convertDataList));
    }
  }, [evaluationAchievementAddOjb]);

  // ** Hook
  const { Item } = Form;
  const dispatch = useDispatch<AppDispatch>();
  const isColSpan = (value: any) => value === 'itemRowTotal';
  const widthColumn = (isEdit: boolean) => (!isEdit ? '65px' : '10%');

  // ** Col span
  const shareOnCell3 = (record: AchievementAdditionalType) => {
    if (isColSpan(record.key)) return { colSpan: 3, style: { verticalAlign: 'top', backgroundColor: '#59ad5b78' } };

    return { style: { verticalAlign: 'top' } };
  };

  const shareOnCell2 = (record: AchievementAdditionalType) => {
    if (isColSpan(record.key)) return { colSpan: 1, style: { verticalAlign: 'top', backgroundColor: '#59ad5b78' } };

    return { style: { verticalAlign: 'top' } };
  };

  const shareOnCell = (record: AchievementAdditionalType) => {
    if (isColSpan(record.key)) return { colSpan: 0, style: { verticalAlign: 'top' } };

    return { style: { verticalAlign: 'top' } };
  };

  const onCell = () => {
    return { style: { verticalAlign: 'top' } };
  };

  const countColumnDisplay = (
    isDisplayUser: boolean,
    isDisplayEvaluator05: boolean,
    isDisplayEvaluator1: boolean,
    isDisplayEvaluator2: boolean,
  ): number => {
    let column = 0;

    if (isDisplayUser) {
      column++;
    }
    if (isDisplayEvaluator05) {
      column++;
    }
    if (isDisplayEvaluator1) {
      column++;
    }
    if (isDisplayEvaluator2) {
      column++;
    }

    return column;
  };

  const calculateWidthColumn = (type: ColumnType, isEdit?: boolean) => {
    const columnEvaluator = countColumnDisplay(
      isDisplayUserEvaluator,
      isDisplayEvaluator05,
      isDisplayEvaluator1,
      isDisplayEvaluator2,
    );

    if (columnEvaluator === 0) {
      if (type === 'title') {
        return '45%';
      } else if (type === 'status') {
        return '10%';
      } else if (type === 'reason') {
        return '45%';
      } else if (type === 'evaluation') {
        return '0%';
      }
    } else if (columnEvaluator === 1) {
      if (type === 'title') {
        return '40%';
      } else if (type === 'status') {
        return '10%';
      } else if (type === 'reason') {
        return '40%';
      } else if (type === 'evaluation') {
        return '10%';
      }
    } else if (columnEvaluator === 2) {
      if (type === 'title') {
        return '40%';
      } else if (type === 'status') {
        return '10%';
      } else if (type === 'reason') {
        return '35%';
      } else if (type === 'evaluation') {
        if (isEdit) {
          return '10%';
        } else {
          return '5%';
        }
      }
    } else if (columnEvaluator === 3) {
      if (type === 'title') {
        return '35%';
      } else if (type === 'status') {
        return '10%';
      } else if (type === 'reason') {
        return '35%';
      } else if (type === 'evaluation') {
        if (isEdit) {
          return '10%';
        } else {
          return '5%';
        }
      }
    } else if (columnEvaluator === 4) {
      if (type === 'title') {
        return '35%';
      } else if (type === 'status') {
        return '10%';
      } else if (type === 'reason') {
        return '30%';
      } else if (type === 'evaluation') {
        if (isEdit) {
          return '10%';
        } else {
          return '5%';
        }
      }
    }
  };

  // ** Functional
  const columns: ColumnsType<AchievementAdditionalType> = [
    {
      title: t('IDS_OTHER_ITEM'),
      dataIndex: 'titleAdditional',
      onCell: shareOnCell3,
      align: 'left' as const,
      key: 'titleAdditional',
      width: calculateWidthColumn('title'),
      render: (text, record, index) => {
        if (isColSpan(record.key)) return <div style={{ textAlign: 'center' }}>{text}</div>;

        if (
          (isEditUserEvaluation && Number(record.evaluationOrder) === 0) ||
          (isEditEvaluation05 && Number(record.evaluationOrder) === 0.5) ||
          (isEditEvaluation1 && Number(record.evaluationOrder) === 1) ||
          (isEditEvaluation2 && Number(record.evaluationOrder) === 2)
        )
          return (
            <Item
              name={`titleAdditional-key-${record.key}`}
              initialValue={text}
              rules={[
                { type: 'string' },
                { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string },
                {
                  max: 1000,
                  message: (t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER') as string).replace('{maxLength}', '1000'),
                },
              ]}
              style={{ textAlign: 'left', margin: 0 }}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 100 }}
                maxLength={1001}
                onChange={(e) => {
                  const value = e.target.value;
                  evaluationAchievementAddOjb[index] = {
                    ...record,
                    ...evaluationAchievementAddOjb[index],
                    titleAdditional: value,
                  };
                  startTransition(() => setEvaluationAchievementAdd({ ...evaluationAchievementAddOjb }));
                }}
              />
            </Item>
          );

        return <div style={{ whiteSpace: 'pre-wrap', minHeight: '22px' }}>{text}</div>;
      },
    },
    {
      title: t('IDS_STATUS_ACHIEVED'),
      dataIndex: 'achievementStatus',
      onCell: shareOnCell,
      align: 'center' as const,
      key: 'achievementStatus',
      width: calculateWidthColumn('status'),
      render: (text, record, index) => {
        return (isEditUserEvaluation && Number(record.evaluationOrder) === 0) ||
          (isEditEvaluation05 && Number(record.evaluationOrder) === 0.5) ||
          (isEditEvaluation1 && Number(record.evaluationOrder) === 1) ||
          (isEditEvaluation2 && Number(record.evaluationOrder) === 2) ? (
          <Item
            rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
            name={`achievementStatus-key${record.key}`}
            style={{ textAlign: 'left', margin: 0 }}
            initialValue={text}
          >
            <Select
              allowClear
              showSearch
              style={{ width: '100%' }}
              options={[
                { value: t('IDS_ACHIEVED'), label: t('IDS_ACHIEVED') },
                { value: t('IDS_NOT_ACHIEVE'), label: t('IDS_NOT_ACHIEVE') },
              ]}
              onChange={(value) => {
                evaluationAchievementAddOjb[index] = {
                  ...record,

                  ...evaluationAchievementAddOjb[index],
                  achievementStatus: value,
                };
                startTransition(() => setEvaluationAchievementAdd({ ...evaluationAchievementAddOjb }));
              }}
            />
          </Item>
        ) : (
          text
        );
      },
    },
    {
      title: t('IDS_ACHIEVEMENT_ADDITIONAL_REASON'),
      dataIndex: 'reasonComment',
      onCell: shareOnCell,
      align: 'left' as const,
      key: 'reasonComment',
      // width: calculateWidthColumn('reason'), // de auto cho case F5 admin xem thi se tu dong tinh
      render: (text, record, index) => {
        if (
          (isEditUserEvaluation && Number(record.evaluationOrder) === 0) ||
          (isEditEvaluation05 && Number(record.evaluationOrder) === 0.5) ||
          (isEditEvaluation1 && Number(record.evaluationOrder) === 1) ||
          (isEditEvaluation2 && Number(record.evaluationOrder) === 2)
        )
          return (
            <Item
              name={`reasonComment-key-${record.key}`}
              initialValue={text}
              rules={[
                { type: 'string' },
                { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string },
                {
                  max: 1000,
                  message: (t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER') as string).replace('{maxLength}', '1000'),
                },
              ]}
              style={{ textAlign: 'left', margin: 0 }}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 100 }}
                maxLength={1001}
                onChange={(e) => {
                  const value = e.target.value;
                  evaluationAchievementAddOjb[index] = {
                    ...record,

                    ...evaluationAchievementAddOjb[index],
                    reasonComment: value,
                  };
                  startTransition(() => setEvaluationAchievementAdd({ ...evaluationAchievementAddOjb }));
                }}
              />
            </Item>
          );

        return text;
      },
    },
  ];

  if (isDisplayUserEvaluator)
    columns.push({
      title: t('IDS_EVALUATION_SELF_USER'),
      dataIndex: 'pointUser',
      onCell: shareOnCell2,
      align: 'center' as const,
      // width: widthColumn(isEditUserEvaluation),
      width: calculateWidthColumn('evaluation', isEditUserEvaluation),
      key: 'pointUser',
      render: (text, record, index) => {
        if (isColSpan(record.key))
          if (status >= 98) return text && Math.floor(text);
          else return totalAdditional('pointUser');

        if (isEditUserEvaluation && Number(record.evaluationOrder) === 0) {
          return (
            <Item
              rules={[
                {
                  required: isEditUserEvaluation && Number(record.evaluationOrder) === 0 ? true : false,
                  message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
                },
              ]}
              name={`pointUser-key${record.key}`}
              style={{ textAlign: 'left', margin: 0 }}
              initialValue={text}
            >
              <Select
                allowClear
                showSearch
                style={{ width: '100%' }}
                options={store.additionPoinOptions}
                onChange={(_, option: any) => {
                  const value = option ? option.value : null;
                  const label = option ? option.label : null;

                  // const { value, label } = option as { value: any; label: string };
                  evaluationAchievementAddOjb[index] = {
                    ...record,

                    ...evaluationAchievementAddOjb[index],
                    pointUser: label,
                    value,
                  };
                  startTransition(() => setEvaluationAchievementAdd({ ...evaluationAchievementAddOjb }));
                }}
              />
            </Item>
          );
        }
        if (text && !isNaN(Number(text))) return Math.floor(text);

        return text;
      },
    });

  // ** evaluator 0.5
  if (isDisplayEvaluator05)
    columns.push({
      title: t('IDS_EVALUATION_0_5'),
      dataIndex: 'pointEvaluator05',
      onCell: shareOnCell2,
      align: 'center' as const,
      // width: widthColumn(isEditEvaluation05),
      width: calculateWidthColumn('evaluation', isEditEvaluation05),
      key: 'pointEvaluator05',
      render: (text, record, index) => {
        if (isColSpan(record.key))
          if (status >= 98) return text && Math.floor(text);
          else return totalAdditional('pointEvaluator05');

        if (isEditEvaluation05 && Number(record.evaluationOrder) <= 0.5) {
          return (
            <Item
              rules={[
                {
                  required: isEditEvaluation05 && Number(record.evaluationOrder) <= 0.5 ? true : false,
                  message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
                },
              ]}
              name={`pointEvaluator05-key${record.key}`}
              style={{ textAlign: 'left', margin: 0 }}
              initialValue={text}
            >
              <Select
                allowClear
                showSearch
                style={{ width: '100%' }}
                options={store.additionPoinOptions}
                onChange={(_, option: any) => {
                  const value = option ? option.value : null;
                  const label = option ? option.label : null;

                  // const { value, label } = option as { value: any; label: string };
                  evaluationAchievementAddOjb[index] = {
                    ...record,

                    ...evaluationAchievementAddOjb[index],
                    pointEvaluator05: label,
                    value,
                  };
                  startTransition(() => setEvaluationAchievementAdd({ ...evaluationAchievementAddOjb }));
                }}
              />
            </Item>
          );
        }

        if (text && !isNaN(Number(text))) return Math.floor(text);

        return text;
      },
    });

  // ** evaluator 1.0
  if (isDisplayEvaluator1)
    columns.push({
      title: t('IDS_POINT_EVALUATOR_1'),
      dataIndex: 'pointEvaluator1',
      onCell: shareOnCell2,
      align: 'center' as const,
      // width: widthColumn(isEditEvaluation1),
      width: calculateWidthColumn('evaluation', isEditEvaluation1),
      key: 'pointEvaluator1',
      render: (text, record, index) => {
        if (isColSpan(record.key))
          if (status >= 98) return text && Math.floor(text);
          else return totalAdditional('pointEvaluator1');

        if (isEditEvaluation1 && Number(record.evaluationOrder) <= 1) {
          return (
            <Item
              rules={[
                {
                  required: true,
                  message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
                },
              ]}
              name={`pointEvaluator1-key${record.key}`}
              style={{ textAlign: 'left', margin: 0 }}
              initialValue={text}
            >
              <Select
                allowClear
                showSearch
                style={{ width: '100%' }}
                options={store.additionPoinOptions}
                onChange={(_, option: any) => {
                  const value = option ? option.value : null;
                  const label = option ? option.label : null;

                  // const { value, label } = option as { value: any; label: string };
                  evaluationAchievementAddOjb[index] = {
                    ...record,

                    ...evaluationAchievementAddOjb[index],
                    pointEvaluator1: label,
                    value,
                  };
                  startTransition(() => setEvaluationAchievementAdd({ ...evaluationAchievementAddOjb }));
                }}
              />
            </Item>
          );
        }

        if (text && !isNaN(Number(text))) return Math.floor(text);

        return text;
      },
    });

  // ** evaluator 2.0
  if (isDisplayEvaluator2)
    columns.push({
      title: t('IDS_POINT_EVALUATOR_2'),
      dataIndex: 'pointEvaluator2',
      onCell: shareOnCell2,
      align: 'center' as const,
      // width: widthColumn(isEditEvaluation2),
      width: calculateWidthColumn('evaluation', isEditEvaluation2),
      key: 'pointEvaluator2',
      render: (text, record, index) => {
        if (isColSpan(record.key))
          if (status >= 98) return text && Math.floor(text);
          else return totalAdditional('pointEvaluator2');
        if (isEditEvaluation2) {
          return (
            <Item
              rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
              name={`pointEvaluator2-key${record.key}`}
              style={{ textAlign: 'left', margin: 0 }}
              initialValue={text}
            >
              <Select
                allowClear
                showSearch
                style={{ width: '100%' }}
                options={store.additionPoinOptions}
                onChange={(_, option: any) => {
                  const value = option ? option.value : null;
                  const label = option ? option.label : null;

                  // const { value, label } = option as { value: any; label: string };
                  evaluationAchievementAddOjb[index] = {
                    ...record,

                    ...evaluationAchievementAddOjb[index],
                    pointEvaluator2: label,
                    value,
                  };
                  startTransition(() => setEvaluationAchievementAdd({ ...evaluationAchievementAddOjb }));
                }}
              />
            </Item>
          );
        }

        if (text && !isNaN(Number(text))) return Math.floor(text);

        return text;
      },
    });
  if (isEditUserEvaluation || isEditEvaluation05 || isEditEvaluation1 || isEditEvaluation2)
    columns.push({
      title: ' ',
      dataIndex: 'action',
      onCell,
      align: 'center' as const,
      width: '50px',
      key: 'action',
      render: (_, record) => {
        if (isColSpan(record.key)) return '';

        return (
          <Button
            icon={<DeleteOutlined />}
            style={{ color: '#007240 ' }}
            disabled={
              !(
                (isEditUserEvaluation && Number(record.evaluationOrder) <= 0) ||
                (isEditEvaluation05 && Number(record.evaluationOrder) <= 0.5) ||
                (isEditEvaluation1 && Number(record.evaluationOrder) <= 1) ||
                (isEditEvaluation2 && Number(record.evaluationOrder) <= 2)
              )
            }
            onClick={() => {
              // let findIndex: string | null = null;

              // Object.keys(evaluationAchievementAddOjb).some((key) => {
              //   const element: any = evaluationAchievementAddOjb[key];
              //   if (element && element.key === record.key) return (findIndex = key);
              // });

              // if (findIndex) {
              //   delete evaluationAchievementAddOjb[findIndex];

              //   const converObj: any = Object.values(evaluationAchievementAddOjb).reduce(
              //     (pre: any, curr, index) => ({ ...pre, [index]: curr }),
              //     {},
              //   );
              //   setEvaluationAchievementAdd({ ...converObj });
              // }

              // deleteRow(record.key);
              setIsOpenPopUpConfirm(true);
              dispatch(
                setDeleteOption({
                  record: record,
                  setEvaluationAchievementAdd,
                }),
              );
            }}
          />
        );
      },
    });

  return columns;
};

export default achievementAdditionalColumn;
