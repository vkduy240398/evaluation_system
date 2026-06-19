/* eslint-disable @typescript-eslint/naming-convention */
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { t } from 'i18next';
import { Dispatch, SetStateAction, startTransition, useEffect, useRef } from 'react';
import { SettingPointBasicBehaviorProDto } from '../../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { dataSubSetting810 } from '../../interfaces/dataSource8_10';
import { isInteger } from '../../../../../common/util';

interface Props {
  form: any;
  isEdit: any;
  dataSource: any;
  setDataSource: any;
  isLoading: boolean;
  dataHandling: dataSubSetting810;
  setDataHandling: Dispatch<SetStateAction<dataSubSetting810>>;
}

const ColumnBehavior = (props: Props) => {
  const isValueChange = useRef(false);
  useEffect(() => {
    const arr: any = [];
    props.dataHandling?.settingPointBehavior?.forEach((e: any, _index: any) => {
      const countDuplicate =
        props.dataHandling?.settingPointBehavior?.filter((num: any) => e.point === num.point).length || 0;
      if (countDuplicate > 1 || e.point >= 0) {
        arr.push(`input_point_behavior_${e.key}`);
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
    listSettingPointBehavior: SettingPointBasicBehaviorProDto[],
  ) => {
    return listSettingPointBehavior
      .filter((el) => el !== listSettingPointBehavior.at(indexException))
      .some((el) => Number(el.point) === value);
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
            name={`input_point_behavior_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  if (value === '') return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  else {
                    const listSettingPointBehavior = props.dataHandling.settingPointBehavior || [];
                    const isDuplicatePoint = checkDuplicatePoint(Number(value), index, listSettingPointBehavior);

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
                const dataTemps = [...(props.dataHandling.settingPointBehavior || [])];
                dataTemps[index] = { ...dataTemps[index], point: value ? Number(value) : undefined };
                props.setDataHandling({ ...props.dataHandling, settingPointBehavior: dataTemps });
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
            name={`input_note_behavior_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                max: 200,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '200'),
              },
            ]}
          >
            <TextArea
              maxLength={201}
              autoSize
              defaultValue={text}
              onChange={(e) => {
                const dataTemps = [...(props.dataHandling.settingPointBehavior || [])];
                dataTemps[index] = { ...dataTemps[index], note: e.target.value };
                props.setDataHandling({ ...props.dataHandling, settingPointBehavior: dataTemps });
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
          props.dataSource.settingPointBehavior!.length > MIN_ROW && (
            <Button
              icon={<DeleteOutlined style={{ color: '#007240 ' }} />}
              onClick={async () => {
                const dataList = props.dataSource.settingPointBehavior!.filter((item: any) => item.key !== record.key);
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingPointBehavior: [...dataList] }),
                );

                const dataListTabs = props.dataHandling.settingPointBehavior!.filter(
                  (item: any) => item.key !== record.key,
                );
                props.setDataHandling({ ...props.dataHandling, settingPointBehavior: [...dataListTabs] });
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

export default ColumnBehavior;
