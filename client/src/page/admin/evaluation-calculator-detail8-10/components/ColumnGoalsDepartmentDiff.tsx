import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance, Input, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { t } from 'i18next';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { dataSubSetting810, dataTab810GoalDepartment } from '../interfaces/dataSource8_10';

interface Props {
  isEdit?: any;
  data: dataTab810GoalDepartment;
  setData: any;
  form: FormInstance;
  dataHandling: dataSubSetting810;
  setDataHandling: Dispatch<SetStateAction<dataSubSetting810>>;
}

const ColumnGoalsDepartmentDiff = (props: Props) => {
  const { isEdit, data, setData, form, dataHandling, setDataHandling } = props;
  const tmp = useRef(0);
  useEffect(() => {
    const arr: any = [];
    dataHandling.settingAchievementDepDiff.forEach((e: any, _index: any) => {
      arr.push(`evaluationGoals${e.key}`);
    });

    if (tmp.current !== 0) form.validateFields(arr);
  }, [dataHandling && tmp.current]);

  return [
    {
      title: t('IDS_DIFFICULTY'),
      dataIndex: 'point',
      key: 'point',
      align: 'left' as const,
      width: '200px',
      render: (text: any, _record: any, index: any) => {
        return !isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
            {text ? (Number.isInteger(Number(text)) ? Number(text).toFixed(1) : parseFloat(text)) : null}
          </div>
        ) : (
          <Form.Item
            initialValue={text ? (Number.isInteger(Number(text)) ? Number(text).toFixed(1) : parseFloat(text)) : null}
            name={`evaluationGoals${_record.key}`}
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
                    if (value <= 0)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE_DECIMAL').replace('{min value}', '0.0')),
                      );
                    if (
                      value.toString()?.split('.')[1] === '' ||
                      (value.toString()?.split('.')[1] && value.toString()?.split('.')[1].length > 1)
                    )
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_DECIMAL_MAX_DIGIT_2').replace('{max value}', '1')),
                      );
                    if (
                      dataHandling.settingAchievementDepDiff.findIndex(
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
              maxLength={4}
              onChange={(e) => {
                const dataTemps = [...dataHandling.settingAchievementDepDiff];
                dataTemps[index] = { ...dataTemps[index], point: e.target.value || undefined };
                setDataHandling({ ...dataHandling, settingAchievementDepDiff: dataTemps });
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
            name={`noteGoals${_record.key}`}
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
                const dataTemps = [...dataHandling.settingAchievementDepDiff];
                dataTemps[index] = { ...dataTemps[index], note: e.target.value };
                setDataHandling({ ...dataHandling, settingAchievementDepDiff: dataTemps });
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
            {data.settingAchievementDepDiff.length > 1 ? (
              <Button
                icon={<DeleteOutlined />}
                style={{ color: '#007240 ' }}
                onClick={async () => {
                  const dataList = data.settingAchievementDepDiff.filter((item: any) => item.key !== record.key);
                  setData({ ...data, settingAchievementDepDiff: [...dataList] });

                  const dataListTabs = dataHandling.settingAchievementDepDiff.filter(
                    (item: any) => item.key !== record.key,
                  );
                  setDataHandling({ ...dataHandling, settingAchievementDepDiff: [...dataListTabs] });
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

export default ColumnGoalsDepartmentDiff;
