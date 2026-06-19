/* eslint-disable @typescript-eslint/naming-convention */
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { t } from 'i18next';

import { Dispatch, SetStateAction, startTransition, useEffect, useRef } from 'react';
import { SettingPointBasicBehaviorProDto } from '../../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { dataSubSetting810, dataTab17BasicSkill } from '../../interfaces/dataSource8_10';
import { FormInstance } from 'antd/lib';
import { isInteger } from '../../../../../common/util';

interface Props {
  isEdit?: boolean;
  dataSource: dataTab17BasicSkill;
  setDataSource: Dispatch<SetStateAction<dataTab17BasicSkill>>;
  isLoading: boolean;
  form: FormInstance;
  dataHandling: dataSubSetting810;
  setDataHandling: Dispatch<SetStateAction<dataSubSetting810>>;
}

const ColumnBasic = (props: Props) => {
  const isValueChange = useRef(false);
  useEffect(() => {
    const arr: any = [];
    props.dataHandling?.settingPointBasic?.forEach((e: any) => {
      const countDuplicate = props.dataHandling?.settingPointBasic?.filter((num) => e.point === num.point).length || 0;
      if (countDuplicate > 1 || Number(e.point) >= 0) {
        arr.push(`input_point_basic_${e.key}`);
      }
    });
    if (isValueChange.current) {
      props.form.validateFields(arr);
      isValueChange.current = false;
    }
  }, [props.dataHandling]);

  const checkDuplicatePoint = (
    value: number,
    indexException: number,
    listSettingPointBasic: SettingPointBasicBehaviorProDto[],
  ) => {
    const isDuplicate = listSettingPointBasic
      .filter((el) => el !== listSettingPointBasic.at(indexException))
      .some((el) => Number(el.point) === value);

    return isDuplicate;
  };

  return [
    {
      title: t('IDS_EVALUATION'),
      dataIndex: 'point',
      key: 'point',
      align: 'left' as const,
      width: '15rem',
      render: (text: any, _record: any, index: any) => {
        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>{text}</div>
        ) : (
          <Form.Item
            initialValue={Number.isInteger(text) ? text : ''}
            name={`input_point_basic_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  if (value === '') return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  else {
                    const listSettingPointBasic = props.dataHandling.settingPointBasic || [];
                    const isDuplicatePoint = checkDuplicatePoint(Number(value), index, listSettingPointBasic);

                    if (!isInteger(value) || value < 0)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE').replace('{min value}', '0')));
                    if (value > 10)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '10')));
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
              onChange={(e) => {
                const value = e.target.value;
                // const dataTemp = props.dataSource.settingPointBasic || [];
                // dataTemp[index] = { ...dataTemp[index], point: value ? Number(value) : undefined };
                // startTransition(() => props.setDataSource({ ...props.dataSource, settingPointBasic: dataTemp }));

                const dataTemp = props.dataHandling.settingPointBasic || [];
                dataTemp[index] = { ...dataTemp[index], point: value ? Number(value) : undefined };
                props.setDataHandling({ ...props.dataHandling, settingPointBasic: dataTemp });
                isValueChange.current = true;
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
            name={`input_note_basic_${_record.key}`}
            style={{ margin: 0 }}
            rules={[{ max: 200, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '200') }]}
          >
            <TextArea
              maxLength={201}
              autoSize
              defaultValue={text}
              onChange={(e) => {
                // const dataTemp = [...(props.dataSource.settingPointBasic || [])];
                // dataTemp[index] = { ...dataTemp[index], note: e.target.value };
                // startTransition(() => props.setDataSource({ ...props.dataSource, settingPointBasic: dataTemp }));

                const dataTemp = [...(props.dataHandling.settingPointBasic || [])];
                dataTemp[index] = { ...dataTemp[index], note: e.target.value };
                props.setDataHandling({ ...props.dataHandling, settingPointBasic: dataTemp });
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
      width: '10rem',
      align: 'center' as const,
      render: (_text: any, record: any) => {
        const MIN_ROW = 1;

        return (
          props.dataHandling.settingPointBasic!.length > MIN_ROW && (
            <Button
              icon={<DeleteOutlined />}
              style={{ color: '#007240 ' }}
              onClick={async () => {
                // const dataList = props.dataSource.settingPointBasic!.filter((item: any) => item.key !== record.key);

                const dataListTab = props.dataHandling.settingPointBasic!.filter(
                  (item: any) => item.key !== record.key,
                );
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingPointBasic: [...dataListTab] }),
                );
                props.setDataHandling({ ...props.dataHandling, settingPointBasic: [...dataListTab] });
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

export default ColumnBasic;
