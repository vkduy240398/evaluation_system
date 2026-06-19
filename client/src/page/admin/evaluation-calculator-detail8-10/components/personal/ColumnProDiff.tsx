/* eslint-disable @typescript-eslint/naming-convention */
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Row, Space } from 'antd';
import { t } from 'i18next';
import { RandomHelper } from '../../../../../common/utils/RandomHelper';
import { SettingProFormulaSubDto } from '../../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { dataTab17ProSkill } from '../../interfaces/dataSource8_10';

interface Props {
  isEdit: any;
  form: any;
  dataSource: dataTab17ProSkill;
  setDataSource: any;
  isLoading: boolean;
  index: any;
  openNotification: any;
  isValueChange: any;
  dataTabProSkill: any;
  setDataTabProSkill: any;
}

const isNumber = /^\d+$/;
const isDecimalNumber = /^\d+(?:\.\d{1,5})?$/;
export const ColumnProDiff = (props: Props) => {
  const checkDuplicateValue = (value: number, indexException: number, listProSubFormula: SettingProFormulaSubDto[]) => {
    return listProSubFormula
      .filter((el) => el !== listProSubFormula.at(indexException))
      .some((el) => el.totalItem === value);
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
                          (props.dataTabProSkill.settingProFormula &&
                            props.dataTabProSkill.settingProFormula[props.index].settingProFormulaSub) ||
                          [];
                        const isDuplicatePoint = checkDuplicateValue(Number(value), indexSub, listSettingProFormulaSub);

                        if (value < 1)
                          return Promise.reject(
                            new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE_DECIMAL_2').replace('{min value}', '1')),
                          );
                        if (value > 100) {
                          return Promise.reject(
                            new Error(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '100')),
                          );
                        }
                        if (!isNumber.test(value)) {
                          return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER').toString()));
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
                    const dataTemp = [...(props.dataTabProSkill.settingProFormula || [])];
                    const dataSubTemp = [...(dataTemp[props.index].settingProFormulaSub || [])];
                    dataSubTemp[indexSub] = {
                      ...dataSubTemp[indexSub],
                      totalItem: Number(e.target.value),
                    };
                    dataTemp[props.index] = {
                      ...dataTemp[props.index],
                      settingProFormulaSub: [...dataSubTemp],
                    };
                    props.setDataTabProSkill({
                      ...props.dataTabProSkill,
                      settingProFormula: dataTemp,
                    });
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
                const dataTemp = [...(props.dataTabProSkill.settingProFormula || [])];
                const dataSubTemp = [...(dataTemp[props.index].settingProFormulaSub || [])];
                dataSubTemp[indexSub] = {
                  ...dataSubTemp[indexSub],
                  coefficient: Number(e.target.value),
                };
                dataTemp[props.index] = {
                  ...dataTemp[props.index],
                  settingProFormulaSub: [...dataSubTemp],
                };
                props.setDataTabProSkill({ ...props.dataTabProSkill, settingProFormula: dataTemp });
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
      render: (_text: any, record: any, indexSub: any) => {
        return (
          <Space size={'middle'}>
            <Button
              icon={<PlusOutlined style={{ color: '#007240 ' }} />}
              onClick={async () => {
                const dataTempTab = [...(props.dataTabProSkill.settingProFormula || [])];
                const dataSubTempTab = [...(dataTempTab[props.index].settingProFormulaSub || [])];

                if (dataTempTab.length < 10) {
                  dataSubTempTab.push({
                    key: RandomHelper.randomString(32),
                    formulaId: props.dataTabProSkill.settingProFormula![props.index].id,
                    totalItem: undefined,
                    coefficient: undefined,
                  });
                  dataTempTab[props.index] = {
                    ...dataTempTab[props.index],
                    settingProFormulaSub: [...dataSubTempTab],
                  };
                  props.setDataSource({ ...props.dataSource, settingProFormula: dataTempTab });
                  props.setDataTabProSkill({
                    ...props.dataTabProSkill,
                    settingProFormula: dataTempTab,
                  });
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
                  const dataTempTab = [...(props.dataTabProSkill.settingProFormula || [])];
                  const dataSubTempTab = [...(dataTempTab[props.index].settingProFormulaSub || [])];
                  const dataListTab = dataSubTempTab.filter((item: any) => item.key !== record.key);
                  dataTempTab[props.index] = {
                    ...dataTempTab[props.index],
                    settingProFormulaSub: [...dataListTab],
                  };
                  props.setDataSource({ ...props.dataSource, settingProFormula: dataTempTab });
                  props.setDataTabProSkill({
                    ...props.dataTabProSkill,
                    settingProFormula: dataTempTab,
                  });
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
