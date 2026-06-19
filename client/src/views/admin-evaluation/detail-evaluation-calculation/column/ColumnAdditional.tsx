/* eslint-disable @typescript-eslint/naming-convention */
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {
  DetailEvaluationCalculationDto,
  SettingAchievementAdditionalDto,
} from '../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { Dispatch, SetStateAction, startTransition } from 'react';
import { t } from 'i18next';
import { isInteger } from '../../../../common/util';

interface Props {
  form: any;
  isEdit: any;
  dataSource: DetailEvaluationCalculationDto;
  setDataSource: Dispatch<SetStateAction<DetailEvaluationCalculationDto>>;
  isLoading: boolean;
  isValueChange: any;
}

const ColumnAdditional = (props: Props) => {
  const RATING_TYPE = 1;
  const POINT_TYPE = 2;

  const checkDuplicateValue = (
    value: any,
    type: number,
    indexException: number,
    listSettingAchievementAdditional: SettingAchievementAdditionalDto[],
  ) => {
    let isDuplicate = false;
    if (type === RATING_TYPE) {
      isDuplicate = listSettingAchievementAdditional
        .filter((el) => el !== listSettingAchievementAdditional.at(indexException))
        .some((el) => el.rating === value && el.rating != '');
    } else {
      isDuplicate = listSettingAchievementAdditional
        .filter((el) => el !== listSettingAchievementAdditional.at(indexException))
        .some((el) => Number(el.point) === Number(value));
    }

    return isDuplicate;
  };

  return [
    {
      title: t('IDS_EVALUATION'),
      dataIndex: 'rating',
      key: 'rating',
      align: 'center' as const,
      width: '15rem',
      render: (text: any, _record: any, index: any) => {
        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
        ) : (
          <Form.Item
            initialValue={text}
            name={`input_rating_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              { max: 5, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '5') },
              {
                validator: async (_, value) => {
                  const listSettingAchievementAdditional = props.dataSource.settingAchievementAdditional || [];
                  const isDuplicatePoint = checkDuplicateValue(
                    value,
                    RATING_TYPE,
                    index,
                    listSettingAchievementAdditional,
                  );

                  if (isDuplicatePoint) {
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_VALUE_NOT_DUPLICATE') as string));
                  }
                },
              },
            ]}
          >
            <Input
              maxLength={6}
              defaultValue={text}
              style={{ textAlign: 'center' }}
              onChange={(e) => {
                const dataTemp = [...(props.dataSource.settingAchievementAdditional || [])];
                dataTemp[index] = { ...dataTemp[index], rating: e.target.value };
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingAchievementAdditional: dataTemp }),
                );
                props.isValueChange.current = true;
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_POINT'),
      dataIndex: 'point',
      key: 'point',
      align: 'left' as const,
      width: '15rem',
      render: (text: any, _record: any, index: any) => {
        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>{text}</div>
        ) : (
          <Form.Item
            initialValue={text ? Number.parseInt(text) : ''}
            name={`input_point_additional_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  if (value === '') return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  else {
                    const listSettingAchievementAdditional = props.dataSource.settingAchievementAdditional || [];
                    const isDuplicatePoint = checkDuplicateValue(
                      value,
                      POINT_TYPE,
                      index,
                      listSettingAchievementAdditional,
                    );

                    if (!isInteger(value) || value < -50)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE').replace('{min value}', '-50')));
                    if (value > 50)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '50')));
                    if (isDuplicatePoint) {
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_VALUE_NOT_DUPLICATE') as string));
                    }
                  }
                },
              },
            ]}
          >
            <Input
              maxLength={3}
              defaultValue={text}
              style={{ width: '100%', textAlign: 'center' }}
              onChange={(event) => {
                const value = event.target.value;
                const dataTemp = props.dataSource.settingAchievementAdditional || [];
                dataTemp[index] = { ...dataTemp[index], point: value ? Number(value) : undefined };
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingAchievementAdditional: dataTemp }),
                );
                props.isValueChange.current = true;
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_DESCRIPTION'),
      dataIndex: 'note',
      key: 'note',
      render: (text: any, _record: any, index: any) => {
        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text || ' '}</div>
        ) : (
          <Form.Item
            initialValue={text}
            name={`input_note_additional_${_record.key}`}
            style={{ margin: 0 }}
            rules={[{ max: 200, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '200') }]}
          >
            <TextArea
              maxLength={201}
              autoSize
              defaultValue={text}
              onChange={(e) => {
                const dataTemp = [...(props.dataSource.settingAchievementAdditional || [])];
                dataTemp[index] = { ...dataTemp[index], note: e.target.value };
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingAchievementAdditional: dataTemp }),
                );
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_ACTION'),
      dataIndex: 'action',
      key: 'action',
      width: '100px',
      align: 'center' as const,
      render: (_text: any, record: any) => {
        const MIN_ROW = 1;

        return (
          props.dataSource.settingAchievementAdditional!.length > MIN_ROW && (
            <Button
              icon={<DeleteOutlined />}
              style={{ color: '#007240 ' }}
              onClick={async () => {
                const dataList = props.dataSource.settingAchievementAdditional!.filter(
                  (item: any) => item.key !== record.key,
                );
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingAchievementAdditional: [...dataList] }),
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
      return v.key !== 'action';
    }

    return v.key;
  });
};

export default ColumnAdditional;
