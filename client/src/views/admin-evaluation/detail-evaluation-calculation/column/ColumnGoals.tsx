/* eslint-disable @typescript-eslint/naming-convention */
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { t } from 'i18next';
import {
  DetailEvaluationCalculationDto,
  SettingAchievementPersonalDto,
} from '../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { Dispatch, SetStateAction, startTransition, useEffect, useRef } from 'react';

interface Props {
  form: any;
  isEdit: any;
  dataSource: DetailEvaluationCalculationDto;
  setDataSource: Dispatch<SetStateAction<DetailEvaluationCalculationDto>>;
  isLoading: boolean;
}

const POINT_INDEX = 'point';
const NOTE_INDEX = 'note';
const isDecimalNumber = /^-?\d+(?:\.\d{1,2})?$/;
const isDecimalNumber2 = /^-?\d+(?:\.\d)?$/;

const checkDuplicatePersonalSetting = (
  value: any,
  indexException: number,
  listSettingPersonal: SettingAchievementPersonalDto[],
) => {
  const isDuplicate = listSettingPersonal
    .filter((el) => el !== listSettingPersonal.at(indexException))
    .some((el) => Number(el.point) === Number(value));

  return isDuplicate;
};

const ColumnGoalDiffs = (props: Props) => {
  const POINT_KEY_1 = 'point1';
  const NOTE_KEY_1 = 'note1';
  const ACTION_KEY_1 = 'action1';
  const ACTION_INDEX_1 = 'action1';

  const isValueChange = useRef(false);
  useEffect(() => {
    const arr: any = [];
    props.dataSource?.settingAchievementPersonalDiff?.forEach((e: any, _index: any) => {
      const countDuplicate =
        props.dataSource?.settingAchievementPersonalDiff?.filter((num) => e.point === num.point && num.point !== 0)
          .length || 0;
      if (countDuplicate > 1 || e.point > 0) {
        arr.push(`input_point_goal_${e.key}`);
      }
    });
    if (isValueChange.current) {
      props.form.validateFields(arr);
      isValueChange.current = false;
    }
  }, [props.dataSource]);

  return [
    {
      title: t('IDS_DIFFICULTY'),
      dataIndex: POINT_INDEX,
      key: POINT_KEY_1,
      align: 'left' as const,
      width: '15rem',
      render: (text: any, _record: any, index: any) => {
        const convertedNum = text ? (Number.isInteger(Number(text)) ? Number(text).toFixed(1) : parseFloat(text)) : '';

        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>{convertedNum}</div>
        ) : (
          <Form.Item
            initialValue={convertedNum || ''}
            name={`input_point_goal_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  if (value === '') return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  else {
                    const listSettingPersonalDiff = props.dataSource.settingAchievementPersonalDiff || [];
                    const isDuplicatePoint = checkDuplicatePersonalSetting(value, index, listSettingPersonalDiff);

                    if (!isDecimalNumber.test(value))
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER').replace('{min value}', '0.0')),
                      );
                    if (value <= 0)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE_DECIMAL').replace('{min value}', '0.0')),
                      );
                    if (value > 10)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_DECIMAL_MAX_VALUE').replace('{max value}', '10.0')),
                      );
                    if (!isDecimalNumber2.test(value)) {
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_DECIMAL_MAX_DIGIT_2').replace('{max value}', '1')),
                      );
                    }
                    if (isDuplicatePoint) {
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_VALUE_NOT_DUPLICATE') as string));
                    }
                  }
                },
              },
            ]}
          >
            <Input
              maxLength={4}
              defaultValue={convertedNum}
              style={{ width: '100%', textAlign: 'center' }}
              onChange={(e) => {
                const value = e.target.value;
                const dataTemps = [...(props.dataSource.settingAchievementPersonalDiff || [])];
                dataTemps[index] = { ...dataTemps[index], point: value ? Number(value) : undefined };
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingAchievementPersonalDiff: dataTemps }),
                );
                isValueChange.current = true;
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_DESCRIPTION'),
      dataIndex: NOTE_INDEX,
      key: NOTE_KEY_1,
      render: (text: any, _record: any, index: any) => {
        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text || ' '}</div>
        ) : (
          <Form.Item
            initialValue={text}
            name={`input_note_goal_${_record.key}`}
            style={{ margin: 0 }}
            rules={[{ max: 200, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '200') }]}
          >
            <TextArea
              maxLength={201}
              autoSize
              defaultValue={text}
              onChange={(e) => {
                const dataTemps = [...(props.dataSource.settingAchievementPersonalDiff || [])];
                dataTemps[index] = { ...dataTemps[index], note: e.target.value };
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingAchievementPersonalDiff: dataTemps }),
                );
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_ACTION'),
      dataIndex: ACTION_INDEX_1,
      key: ACTION_KEY_1,
      width: '100px',
      align: 'center' as const,
      render: (_text: any, record: any) => {
        return (
          props.dataSource.settingAchievementPersonalDiff!.length > 1 && (
            <Button
              icon={<DeleteOutlined style={{ color: '#007240 ' }} />}
              onClick={async () => {
                const dataList = props.dataSource.settingAchievementPersonalDiff!.filter(
                  (item: any) => item.key !== record.key,
                );
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingAchievementPersonalDiff: dataList }),
                );
              }}
              loading={props.isLoading}
            ></Button>
          )
        );
      },
    },
  ].filter((v) => {
    if (!props.isEdit) {
      return v.key !== ACTION_KEY_1;
    }

    return v.key;
  });
};

const ColumnGoalJudgeIndexes = (props: Props) => {
  const POINT_KEY_2 = 'point2';
  const NOTE_KEY_2 = 'note2';
  const ACTION_KEY_2 = 'action2';
  const ACTION_INDEX_2 = 'action2';

  const isValueChange = useRef(false);
  useEffect(() => {
    const arr: any = [];
    props.dataSource?.settingAchievementPersonalJudgeIndex?.forEach((e: any, _index: any) => {
      const countDuplicate =
        props.dataSource?.settingAchievementPersonalJudgeIndex?.filter(
          (num) => e.point === num.point && num.point !== 0,
        ).length || 0;
      if (countDuplicate > 1 || e.point > 0) {
        arr.push(`input_point_goal_${e.key}`);
      }
    });
    if (isValueChange.current) {
      props.form.validateFields(arr);
      isValueChange.current = false;
    }
  }, [props.dataSource]);

  return [
    {
      title: t('IDS_JUDGMENT'),
      dataIndex: POINT_INDEX,
      key: POINT_KEY_2,
      align: 'left' as const,
      width: '15rem',
      render: (text: any, _record: any, index: any) => {
        const convertedNum = text ? (Number.isInteger(Number(text)) ? Number(text).toFixed(1) : parseFloat(text)) : '';

        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>{convertedNum}</div>
        ) : (
          <Form.Item
            initialValue={convertedNum || ''}
            name={`input_point_goal_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  if (value === '') return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  else {
                    const listSettingAchievementPersonalJudgeIndex =
                      props.dataSource.settingAchievementPersonalJudgeIndex || [];
                    const isDuplicatePoint = checkDuplicatePersonalSetting(
                      value,
                      index,
                      listSettingAchievementPersonalJudgeIndex,
                    );

                    if (!isDecimalNumber.test(value))
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER').replace('{min value}', '0.0')),
                      );
                    if (value <= 0)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE_DECIMAL').replace('{min value}', '0.0')),
                      );
                    if (value > 10)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_DECIMAL_MAX_VALUE').replace('{max value}', '10.0')),
                      );
                    if (!isDecimalNumber2.test(value)) {
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_DECIMAL_MAX_DIGIT_2').replace('{max value}', '1')),
                      );
                    }
                    if (isDuplicatePoint) {
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_VALUE_NOT_DUPLICATE') as string));
                    }
                  }
                },
              },
            ]}
          >
            <Input
              maxLength={4}
              defaultValue={convertedNum}
              style={{ width: '100%', textAlign: 'center' }}
              onChange={(e) => {
                const value = e.target.value;
                const dataTemps = [...(props.dataSource.settingAchievementPersonalJudgeIndex || [])];
                dataTemps[index] = { ...dataTemps[index], point: value ? Number(value) : undefined };
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingAchievementPersonalJudgeIndex: dataTemps }),
                );
                isValueChange.current = true;
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_DEGREE'),
      dataIndex: NOTE_INDEX,
      key: NOTE_KEY_2,
      width: '20rem',
      render: (text: any, _record: any, index: any) => {
        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text || ' '}</div>
        ) : (
          <Form.Item
            initialValue={text}
            name={`input_note_goal_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              { max: 200, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '200') },
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
            ]}
          >
            <TextArea
              maxLength={201}
              autoSize
              defaultValue={text}
              onChange={(e) => {
                const dataTemps = [...(props.dataSource.settingAchievementPersonalJudgeIndex || [])];
                dataTemps[index] = { ...dataTemps[index], note: e.target.value };
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingAchievementPersonalJudgeIndex: dataTemps }),
                );
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_DESCRIPTION'),
      dataIndex: 'description',
      key: 'description2',
      render: (text: any, _record: any, index: any) => {
        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text || ' '}</div>
        ) : (
          <Form.Item
            initialValue={text}
            name={`input_description_goal_${_record.key}`}
            style={{ margin: 0 }}
            rules={[{ max: 500, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '500') }]}
          >
            <TextArea
              maxLength={501}
              autoSize
              defaultValue={text}
              onChange={(e) => {
                const dataTemps = [...(props.dataSource.settingAchievementPersonalJudgeIndex || [])];
                dataTemps[index] = { ...dataTemps[index], description: e.target.value };
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingAchievementPersonalJudgeIndex: dataTemps }),
                );
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_ACTION'),
      dataIndex: ACTION_INDEX_2,
      key: ACTION_KEY_2,
      width: '100px',
      align: 'center' as const,
      render: (_text: any, record: any) => {
        return (
          props.dataSource.settingAchievementPersonalJudgeIndex!.length > 1 && (
            <Button
              icon={<DeleteOutlined style={{ color: '#007240 ' }} />}
              onClick={async () => {
                const dataList = props.dataSource.settingAchievementPersonalJudgeIndex!.filter(
                  (item: any) => item.key !== record.key,
                );
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingAchievementPersonalJudgeIndex: dataList }),
                );
              }}
              loading={props.isLoading}
            ></Button>
          )
        );
      },
    },
  ].filter((v) => {
    if (!props.isEdit) {
      return v.key !== ACTION_KEY_2;
    }

    return v.key;
  });
};

export { ColumnGoalDiffs, ColumnGoalJudgeIndexes };
