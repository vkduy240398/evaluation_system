/* eslint-disable @typescript-eslint/naming-convention */
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { t } from 'i18next';
import { useEffect, useRef } from 'react';
import { dataTab810GoalDepartmentAdditional } from '../interfaces/dataSource8_10';

interface Props {
  editing: any;
  setEditingKey: (record: any) => void;
  form: any;
  isEdit: any;
  data: dataTab810GoalDepartmentAdditional;
  setData: any;
  dataHandling: any;
  setDataHandling: any;
}

const ColumnAdditionalDep = (props: Props) => {
  const { isEdit, data, setData, form, dataHandling, setDataHandling } = props;
  const tmp = useRef(0);
  useEffect(() => {
    const arr: any = [];
    dataHandling.settingAchievementAdditionalDep.forEach((e: any, _index: any) => {
      arr.push(`ratingAdd${e.key}`);
      arr.push(`pointAdd${e.key}`);
    });
    if (tmp.current !== 0) form.validateFields(arr);
  }, [dataHandling && tmp.current]);

  return [
    {
      title: t('IDS_EVALUATION'),
      dataIndex: 'rating',
      key: 'rating',
      align: 'center' as const,

      width: '200px',
      render: (text: any, _record: any, index: any) => {
        return !isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
        ) : (
          <Form.Item
            initialValue={text}
            name={`ratingAdd${_record.key}`}
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
                    dataHandling.settingAchievementAdditionalDep.findIndex(
                      (e: any) => e.rating == value && _record.key !== e.key,
                    ) !== -1
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
                const dataTemp = [...dataHandling.settingAchievementAdditionalDep];
                dataTemp[index] = { ...dataTemp[index], rating: e.target.value };
                setDataHandling({ ...dataHandling, settingAchievementAdditionalDep: dataTemp });
                tmp.current += 1;
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
      width: '200px',
      render: (text: any, _record: any, index: any) => {
        return !isEdit ? (
          <div
            style={{
              whiteSpace: 'pre-wrap',
              textAlign: 'center',
            }}
          >
            {text ? Number(text).toFixed(2) : null}
          </div>
        ) : (
          <Form.Item
            initialValue={text ? Number(text).toFixed(2) : null}
            name={`pointAdd${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  if (!value && value !== 0)
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  else {
                    if (!Number(value) && Number(value) !== 0)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER').toString()));
                    if (value > 10)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_DECIMAL_MAX_VALUE').replace('{max value}', '10.00')),
                      );
                    if (value < -10)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE_DECIMAL_2').replace('{min value}', '-10.00')),
                      );
                    if (value.toString()?.split('.')[1] && value.toString().split('.')[1].length > 2)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_DECIMAL_MAX_DIGIT_2').replace('{max value}', '2')),
                      );
                    if (
                      dataHandling.settingAchievementAdditionalDep.findIndex(
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
              style={{ width: '100%', textAlign: 'center' }}
              maxLength={5}
              onChange={(e) => {
                const dataTemp = [...dataHandling.settingAchievementAdditionalDep];
                dataTemp[index] = { ...dataTemp[index], point: e.target.value };
                setDataHandling({ ...dataHandling, settingAchievementAdditionalDep: dataTemp });
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
            name={`noteAdd${_record.key}`}
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
                const dataTemp = [...dataHandling.settingAchievementAdditionalDep];
                dataTemp[index] = { ...dataTemp[index], note: e.target.value };
                setDataHandling({ ...dataHandling, settingAchievementAdditionalDep: dataTemp });
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
          <Space size="middle">
            {data.settingAchievementAdditionalDep.length > 1 ? (
              <Button
                icon={<DeleteOutlined />}
                style={{ color: '#007240 ' }}
                onClick={async () => {
                  const dataList = data.settingAchievementAdditionalDep.filter((item: any) => item.key !== record.key);
                  setData({ ...data, settingAchievementAdditionalDep: [...dataList] });

                  const dataListTabs = data.settingAchievementAdditionalDep.filter(
                    (item: any) => item.key !== record.key,
                  );
                  setDataHandling({
                    ...dataHandling,
                    settingAchievementAdditionalDep: [...dataListTabs],
                  });
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

export default ColumnAdditionalDep;
