/* eslint-disable @typescript-eslint/naming-convention */
import { Form, Input } from 'antd';
import { t } from 'i18next';
import { Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../store';
import { setFocusLevelError } from '../../../../../store/userEvaluation';
import { dataSubSetting810NS, dataTab17Level } from '../../interfaces/dataSource8_10';
import { isInteger } from '../../../../../common/util';

interface Props {
  form: any;
  isEdit: any;
  dataSource: dataTab17Level;
  setDataSource: Dispatch<SetStateAction<dataTab17Level>>;
  dataHandling: dataSubSetting810NS;
  setDataHandling: Dispatch<SetStateAction<dataSubSetting810NS>>;
}

const ColumnPricingNs = (props: Props) => {
  const store = useSelector((state: RootState) => state.userEvaluation);
  const dispatch = useDispatch<AppDispatch>();
  const listFocusError = store.isFocusLevelError;
  const LEVEL_TEXT = 'level';
  const BEHAVIOR_PERCENT_TEXT = 'behaviorPercent';
  const ACHIEVEMENT_PERCENT_TEXT = 'achievementPercent';

  return [
    {
      title: t('IDS_LEVEL'),
      dataIndex: LEVEL_TEXT,
      key: LEVEL_TEXT,
      align: 'center' as const,
      width: '10rem',
    },
    {
      title: t('IDS_BEHAVIOR') + '(%)',
      dataIndex: BEHAVIOR_PERCENT_TEXT,
      key: BEHAVIOR_PERCENT_TEXT,
      align: 'center' as const,
      width: '20rem',
      render: (text: any, _record: any, index: any) => {
        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
        ) : (
          <Form.Item
            initialValue={text || ''}
            name={`input_behaviorpercent_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  if (value === null || value === '')
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  else {
                    if (!isInteger(value) || value < 1)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE').replace('{min value}', '1')));
                    if (value > 99)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '99')));
                  }
                },
              },
            ]}
          >
            <Input
              maxLength={3}
              defaultValue={text}
              style={{
                borderColor: listFocusError.includes(_record.level) ? '#FF4D4F' : '#D9D9D9',
                width: '100%',
                textAlign: 'center',
              }}
              onChange={(e) => {
                const value = e.target.value;
                listFocusError?.length > 0 &&
                  dispatch(setFocusLevelError(listFocusError.filter((el) => el !== _record.level)));
                const dataTemp = [...(props.dataHandling.settingLevel || [])];
                dataTemp[index] = { ...dataTemp[index], behaviorPercent: Number(value) };
                props.setDataHandling({ ...props.dataHandling, settingLevel: dataTemp });
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_ACHIEVEMENT') + '(%)',
      dataIndex: ACHIEVEMENT_PERCENT_TEXT,
      key: ACHIEVEMENT_PERCENT_TEXT,
      align: 'center' as const,
      width: '20rem',
      render: (text: any, _record: any, index: any) => {
        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
        ) : (
          <Form.Item
            initialValue={text || ''}
            name={`input_achievementpercent_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  if (value === null || value === '')
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  else {
                    if (!isInteger(value) || value < 1)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE').replace('{min value}', '1')));
                    if (value > 99)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '99')));
                  }
                },
              },
            ]}
          >
            <Input
              maxLength={3}
              defaultValue={text}
              style={{
                borderColor: listFocusError.includes(_record.level) ? '#FF4D4F' : '#D9D9D9',
                width: '100%',
                textAlign: 'center',
              }}
              onChange={(e) => {
                const value = e.target.value;
                listFocusError?.length > 0 &&
                  dispatch(setFocusLevelError(listFocusError.filter((el: any) => el !== _record.level)));
                const dataTemp = [...(props.dataHandling.settingLevel || [])];
                dataTemp[index] = { ...dataTemp[index], achievementPercent: Number(value) };
                props.setDataHandling({ ...props.dataHandling, settingLevel: dataTemp });
              }}
            />
          </Form.Item>
        );
      },
    },
  ];
};

export default ColumnPricingNs;
