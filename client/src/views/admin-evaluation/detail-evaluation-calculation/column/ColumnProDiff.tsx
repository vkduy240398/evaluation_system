/* eslint-disable @typescript-eslint/naming-convention */
import { Button, Form, Input, Row, Space } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { t } from 'i18next';
import {
  DetailEvaluationCalculationDto,
  SettingProFormulaSubDto,
} from '../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { Dispatch, SetStateAction, startTransition } from 'react';
import { RandomHelper } from '../../../../common/utils/RandomHelper';
import { isInteger } from '../../../../common/util';

interface Props {
  isEdit: any;
  form: any;
  dataSource: DetailEvaluationCalculationDto;
  setDataSource: Dispatch<SetStateAction<DetailEvaluationCalculationDto>>;
  isLoading: boolean;
  index: any;
  openNotification: any;
  isValueChange: any;
}

const isDecimalNumber = /^-?\d+(?:\.\d{1,5})?$/;
export const ColumnProDiff = (props: Props) => {
  const checkDuplicateValue = (value: number, indexException: number, listProSubFormula: SettingProFormulaSubDto[]) => {
    const isDuplicate = listProSubFormula
      .filter((el) => el !== listProSubFormula.at(indexException))
      .some((el) => el.totalItem === value);

    return isDuplicate;
  };

  return [
    {
      title: t('IDS_NUMBER_ITEM'),
      dataIndex: 'totalItem',
      key: 'totalItem',
      align: 'left' as const,
      width: '200px',
      render: (text: any, _record: any, indexSub: any) => {
        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{'>=' + text}</div>
        ) : (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <Row justify={'center'} align={'middle'}>
              <Form.Item
                initialValue={text !== null ? text : ''}
                name={`input_totalitem_${_record.key}`}
                style={{ margin: 0 }}
                required={true}
                rules={[
                  {
                    validator: async (_, value) => {
                      if (value === '') return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                      else {
                        const listSettingProFormulaSub =
                          (props.dataSource.settingProFormula &&
                            props.dataSource.settingProFormula[props.index].settingProFormulaSub) ||
                          [];
                        const isDuplicatePoint = checkDuplicateValue(Number(value), indexSub, listSettingProFormulaSub);

                        if (!isInteger(value) || value < 1)
                          return Promise.reject(
                            new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE').replace('{min value}', '1')),
                          );
                        if (value > 100) {
                          return Promise.reject(
                            new Error(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '100')),
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
                  defaultValue={text ? text : ''}
                  disabled={indexSub === 0 ?? true}
                  style={{ width: '100%' }}
                  maxLength={3}
                  prefix=">="
                  onChange={(e) => {
                    const dataTemp = [...(props.dataSource.settingProFormula || [])];
                    const dataSubTemp = [...(dataTemp[props.index].settingProFormulaSub || [])];
                    dataSubTemp[indexSub] = { ...dataSubTemp[indexSub], totalItem: Number(e.target.value) };
                    dataTemp[props.index] = { ...dataTemp[props.index], settingProFormulaSub: [...dataSubTemp] };
                    startTransition(() => props.setDataSource({ ...props.dataSource, settingProFormula: dataTemp }));
                    props.isValueChange.current = true;
                  }}
                />
              </Form.Item>
            </Row>
          </div>
        );
      },
    },
    {
      title: t('IDS_COEFFICIENT'),
      dataIndex: 'coefficient',
      key: 'coefficient',
      render: (text: any, _record: any, indexSub: any) => {
        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text ? parseFloat(text) : text}</div>
        ) : (
          <Form.Item
            initialValue={text ? parseFloat(text) : ''}
            name={`input_coef_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  if (value === '') return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  else {
                    if (!isDecimalNumber.test(value)) {
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER').toString()));
                    }
                    if (value < 1) {
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE_DECIMAL').replace('{min value}', '1.0')),
                      );
                    }
                    if (value > 10) {
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_DECIMAL_MAX_VALUE').replace('{max value}', '10.0')),
                      );
                    }
                  }
                },
              },
            ]}
          >
            <Input
              maxLength={6}
              defaultValue={text ? parseFloat(text) : ''}
              style={{ width: '100%' }}
              onChange={(e) => {
                const dataTemp = [...(props.dataSource.settingProFormula || [])];
                const dataSubTemp = [...(dataTemp[props.index].settingProFormulaSub || [])];
                dataSubTemp[indexSub] = {
                  ...dataSubTemp[indexSub],
                  coefficient: Number(e.target.value),
                };
                dataTemp[props.index] = { ...dataTemp[props.index], settingProFormulaSub: [...dataSubTemp] };
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
      render: (text: any, record: any, indexSub: any) => {
        return (
          <Space size={'middle'}>
            <Button
              icon={<PlusOutlined style={{ color: '#007240 ' }} />}
              onClick={async () => {
                const dataTemp = [...(props.dataSource.settingProFormula || [])];
                const dataSubTemp = [...(dataTemp[props.index].settingProFormulaSub || [])];

                if (dataSubTemp.length < 10) {
                  dataSubTemp.push({
                    key: RandomHelper.randomString(32),
                    formulaId: props.dataSource.settingProFormula![props.index].id,
                    totalItem: undefined,
                    coefficient: undefined,
                  });
                  dataTemp[props.index] = { ...dataTemp[props.index], settingProFormulaSub: [...dataSubTemp] };
                  props.setDataSource({ ...props.dataSource, settingProFormula: dataTemp });
                } else {
                  props.openNotification(
                    'bottomRight',
                    t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '10'),
                  );
                }
              }}
              loading={props.isLoading}
            ></Button>
            {indexSub !== 0 || !record.totalItem ? (
              <Button
                icon={<CloseOutlined style={{ color: 'red' }} />}
                onClick={async () => {
                  const dataTemp = [...(props.dataSource.settingProFormula || [])];
                  const dataSubTemp = [...(dataTemp[props.index].settingProFormulaSub || [])];
                  const dataList = dataSubTemp.filter((item: any) => item.key !== record.key);
                  dataTemp[props.index] = { ...dataTemp[props.index], settingProFormulaSub: [...dataList] };
                  props.setDataSource({ ...props.dataSource, settingProFormula: dataTemp });
                }}
                loading={props.isLoading}
              ></Button>
            ) : (
              <></>
            )}
          </Space>
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
