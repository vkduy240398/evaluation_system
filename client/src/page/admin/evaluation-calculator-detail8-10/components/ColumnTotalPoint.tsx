/* eslint-disable @typescript-eslint/naming-convention */
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { t } from 'i18next';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { dataSubSetting810, dataTab810Formula } from '../interfaces/dataSource8_10';

interface Props {
  isEdit?: any;
  data: dataTab810Formula;
  setData: any;
  form: any;
  dataHandling: dataSubSetting810;
  setDataHandling: Dispatch<SetStateAction<dataSubSetting810>>;
}

const ColumnTotalPoint = (props: Props) => {
  const { isEdit, data, setData, form, dataHandling, setDataHandling } = props;
  const tmp = useRef(0);

  useEffect(() => {
    const arr: any = [];
    dataHandling.settingFormula810.forEach((e: any, _index: any) => {
      arr.push(`pointTotal${e.key}`);
      arr.push(`resultTotal${e.key}`);
    });
    if (tmp.current !== 0) form.validateFields(arr);
  }, [dataHandling && tmp.current]);

  return [
    {
      title: t('IDS_DIVISION_EVALUATION'),
      dataIndex: 'point',
      key: 'point',
      align: 'left' as const,
      width: '200px',
      render: (text: any, _record: any, index: any) => {
        return !isEdit ? (
          text === '-99999.99' ? (
            <Form.Item name={`pointTotal${_record.key}`}>
              <Typography>{t('IDS_DEFAULT')}</Typography>
            </Form.Item>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {text ? '>=' + (Number.isInteger(Number(text)) ? Number(text).toFixed(1) : parseFloat(text)) : '>='}
            </div>
          )
        ) : text === '-99999.99' ? (
          <Form.Item name={`pointTotal${_record.key}`}>
            <Typography>{t('IDS_DEFAULT')}</Typography>
          </Form.Item>
        ) : (
          <Form.Item
            initialValue={text ? (Number.isInteger(Number(text)) ? Number(text).toFixed(1) : parseFloat(text)) : null}
            // initialValue={text ? text : null}
            name={`pointTotal${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  if (!value && value !== 0)
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  else {
                    if (!Number(value) && value !== '0')
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER').toString()));
                    if (value > 10)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_DECIMAL_MAX_VALUE').replace('{max value}', '10.0')),
                      );
                    if (value < 0)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE_DECIMAL_2').replace('{min value}', '0.0')),
                      );
                    if (value.toString()?.split('.')[1] && value.toString().split('.')[1].length > 1)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_DECIMAL_MAX_DIGIT_2').replace('{max value}', '1')),
                      );
                    if (
                      dataHandling.settingFormula810.findIndex(
                        (e: any) => Number(e.point) === Number(value) && _record.key !== e.key,
                      ) !== -1
                    ) {
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_VALUE_NOT_DUPLICATE').toString()));
                    }
                  }
                },
              },
            ]}
          >
            <Input
              prefix=">="
              style={{ width: '100%' }}
              maxLength={4}
              onChange={(e) => {
                const dataTemp = [...dataHandling.settingFormula810];
                dataTemp[index] = { ...dataTemp[index], point: e.target.value };
                setDataHandling({ ...dataHandling, settingFormula810: dataTemp });
                tmp.current += 1;
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_EVALUATION_PERSONAL'),
      dataIndex: 'result',
      key: 'result',
      align: 'center' as const,
      width: '200px',
      render: (text: any, _record: any, index: any) => {
        return !isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
        ) : (
          <Form.Item
            initialValue={text}
            name={`resultTotal${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  if (!value && value !== 0)
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  if (value.toString().length > 5)
                    return Promise.reject(
                      new Error(t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '5')),
                    );
                  if (
                    dataHandling.settingFormula810.findIndex((e: any) => e.result == value && _record.key !== e.key) !==
                    -1
                  )
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_VALUE_NOT_DUPLICATE').toString()));
                },
              },
            ]}
          >
            <Input
              style={{ width: 200, textAlign: 'center' }}
              maxLength={6}
              onChange={(e) => {
                const dataTemp = [...dataHandling.settingFormula810];
                dataTemp[index] = { ...dataTemp[index], result: e.target.value };
                setDataHandling({ ...dataHandling, settingFormula810: dataTemp });
                tmp.current += 1;
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
        return !isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
        ) : (
          <Form.Item
            initialValue={text}
            name={`noteTotal${_record.key}`}
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
              onChange={(e) => {
                const dataTemp = [...dataHandling.settingFormula810];
                dataTemp[index] = { ...dataTemp[index], note: e.target.value };
                setDataHandling({ ...dataHandling, settingFormula810: dataTemp });
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
      render: (_text: any, record: any, _index: any) => {
        return (
          <Space size="middle">
            {data.settingFormula810.length > 1 && _index !== 0 ? (
              <Button
                icon={<DeleteOutlined />}
                style={{ color: '#007240 ' }}
                onClick={async () => {
                  const dataList = data.settingFormula810.filter((item: any) => item.key !== record.key);
                  setData({ ...data, settingFormula810: [...dataList] });

                  const dataListTabs = dataHandling.settingFormula810.filter((item: any) => item.key !== record.key);
                  setDataHandling({ ...dataHandling, settingFormula810: [...dataListTabs] });
                }}
              />
            ) : (
              <></>
            )}
          </Space>
        );
      },
    },
  ].filter((v) => {
    if (!isEdit) {
      return v.key !== 'action';
    }

    return v.key;
  });
};

export default ColumnTotalPoint;
