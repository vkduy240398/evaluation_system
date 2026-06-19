/* eslint-disable @typescript-eslint/naming-convention */
import { Button, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { DeleteOutlined } from '@ant-design/icons';
import { t } from 'i18next';
import { DetailEvaluationCalculationDto } from '../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { Dispatch, SetStateAction, startTransition, useEffect, useRef } from 'react';
import { isInteger } from '../../../../common/util';

interface Props {
  isEdit?: any;
  form: any;
  dataSource: DetailEvaluationCalculationDto;
  setDataSource: Dispatch<SetStateAction<DetailEvaluationCalculationDto>>;
  isLoading: boolean;
}

const checkDuplicatePoint = (value: number, indexException: number, listPoint: any[]) => {
  const isDuplicate = listPoint
    .filter((el) => el !== listPoint.at(indexException))
    .some((el) => Number(el.point) === value);

  return isDuplicate;
};

export const ColumnProFormula = (props: Props) => {
  const isValueChange = useRef(false);
  useEffect(() => {
    const arr: any = [];
    props.dataSource?.settingProFormula?.forEach((e: any, _index: any) => {
      const countDuplicate =
        props.dataSource?.settingProFormula?.filter((num) => e.point === num.point && num.point !== 0).length || 0;
      if (countDuplicate > 1 || e.point >= 0) {
        arr.push(`input_point_pro_formula_${e.key}`);
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
      dataIndex: 'point',
      key: 'point',
      align: 'left' as const,
      width: '200px',
      render: (text: any, _record: any, index: any) => {
        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
        ) : (
          <Form.Item
            initialValue={text !== null ? text : ''}
            name={`input_point_pro_formula_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  const listSettingProFormuala = props.dataSource.settingProFormula || [];
                  const isDuplicatePoint = checkDuplicatePoint(Number(value), index, listSettingProFormuala);

                  if (!value) return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  else {
                    if (!isInteger(value) || value < 1)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE').replace('{min value}', '1')));
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
                const dataTemp = props.dataSource.settingProFormula || [];
                dataTemp[index] = { ...dataTemp[index], point: value ? Number(value) : undefined };
                startTransition(() => props.setDataSource({ ...props.dataSource, settingProFormula: dataTemp }));
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
            name={`input_note_pro_formula_${_record.key}`}
            style={{ margin: 0 }}
            rules={[{ max: 200, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '200') }]}
          >
            <TextArea
              autoSize
              maxLength={201}
              defaultValue={text}
              onChange={(e) => {
                const dataTemp = [...(props.dataSource.settingProFormula || [])];
                dataTemp[index] = { ...dataTemp[index], note: e.target.value };
                startTransition(() => props.setDataSource({ ...props.dataSource, settingProFormula: dataTemp }));
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
      render: (text: any, record: any) => {
        return (
          props.dataSource.settingProFormula!.length > 1 && (
            <Button
              icon={<DeleteOutlined style={{ color: '#007240 ' }} />}
              onClick={async () => {
                const dataList = props.dataSource.settingProFormula!.filter((item: any) => item.key !== record.key);
                startTransition(() => props.setDataSource({ ...props.dataSource, settingProFormula: [...dataList] }));
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

export const ColumnPointPro = (props: Props) => {
  const isValueChange = useRef(false);
  useEffect(() => {
    const arr: any = [];
    props.dataSource?.settingPointPro?.forEach((e: any, _index: any) => {
      const countDuplicate = props.dataSource?.settingPointPro?.filter((num) => e.point === num.point).length || 0;
      if (countDuplicate > 1 || e.point >= 0) {
        arr.push(`input_point_pro_${e.key}`);
      }
    });
    if (isValueChange.current) {
      props.form.validateFields(arr);
      isValueChange.current = false;
    }
  }, [props.dataSource]);

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
            name={`input_point_pro_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  if (value === '') return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  else {
                    const listSettingPointPro = props.dataSource.settingPointPro || [];
                    const isDuplicatePoint = checkDuplicatePoint(Number(value), index, listSettingPointPro);

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
                const dataTemp = [...(props.dataSource.settingPointPro || [])];
                dataTemp[index] = { ...dataTemp[index], point: value ? Number(value) : undefined };
                startTransition(() => props.setDataSource({ ...props.dataSource, settingPointPro: dataTemp }));
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
            name={`input_note_pro_${_record.key}`}
            style={{ margin: 0 }}
            rules={[{ max: 200, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '200') }]}
          >
            <TextArea
              autoSize
              maxLength={201}
              defaultValue={text}
              onChange={(e) => {
                const dataTemp = [...(props.dataSource.settingPointPro || [])];
                dataTemp[index] = { ...dataTemp[index], note: e.target.value };
                startTransition(() => props.setDataSource({ ...props.dataSource, settingPointPro: dataTemp }));
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
        return (
          props.dataSource.settingPointPro!.length > 1 && (
            <Button
              icon={<DeleteOutlined style={{ color: '#007240 ' }} />}
              onClick={async () => {
                const dataList = props.dataSource.settingPointPro!.filter((item: any) => item.key !== record.key);
                startTransition(() => props.setDataSource({ ...props.dataSource, settingPointPro: [...dataList] }));
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
