/* eslint-disable @typescript-eslint/naming-convention */
import { Form, Input } from 'antd';
import { DetailEvaluationCalculationDto } from '../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { Dispatch, SetStateAction, startTransition } from 'react';
import { t } from 'i18next';
import { AppDispatch, RootState } from '../../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { setFocusLevelError } from '../../../../store/userEvaluation';
import { isInteger } from '../../../../common/util';

interface Props {
  form: any;
  isEdit: any;
  dataSource: DetailEvaluationCalculationDto;
  setDataSource: Dispatch<SetStateAction<DetailEvaluationCalculationDto>>;
  isLoading: boolean;
}

const ComlumnPricing = (props: Props) => {
  const store = useSelector((state: RootState) => state.userEvaluation);
  const dispatch = useDispatch<AppDispatch>();
  const listFocusError = store.isFocusLevelError;

  return [
    {
      title: t('IDS_LEVEL'),
      dataIndex: 'level',
      key: 'level',
      align: 'center' as const,
      width: '10rem',
    },
    {
      title: t('IDS_SKILL') + '(%)',
      dataIndex: 'skillPercent',
      key: 'skillPercent',
      align: 'center' as const,
      width: '20rem',
      render: (text: any, _record: any, index: any) => {
        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
        ) : (
          <Form.Item
            initialValue={Number.isInteger(text) ? text : ''}
            name={`input_skillpercent_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  if (value === null || value === '')
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  else {
                    if (!isInteger(value) || value < 1)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE').replace('{min value}', '1')),
                      );
                    if (value > 98)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '98')));
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
                const dataTemp = [...(props.dataSource.settingLevel || [])];
                dataTemp[index] = { ...dataTemp[index], skillPercent: value ? Number(value) : undefined };
                startTransition(() => props.setDataSource({ ...props.dataSource, settingLevel: dataTemp }));
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_BEHAVIOR') + '(%)',
      dataIndex: 'behaviorPercent',
      key: 'behaviorPercent',
      align: 'center' as const,
      width: '20rem',
      render: (text: any, _record: any, index: any) => {
        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
        ) : (
          <Form.Item
            initialValue={Number.isInteger(text) ? text : ''}
            name={`input_behaviorpercent_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  if (value === null || value === '')
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  else {
                    if (!isInteger(value) || value < 1)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE').replace('{min value}', '1')),
                      );
                    if (value > 98)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '98')));
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
                const dataTemp = [...(props.dataSource.settingLevel || [])];
                dataTemp[index] = { ...dataTemp[index], behaviorPercent: value ? Number(value) : undefined };
                startTransition(() => props.setDataSource({ ...props.dataSource, settingLevel: dataTemp }));
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_ACHIEVEMENT') + '(%)',
      dataIndex: 'achievementPercent',
      key: 'achievementPercent',
      align: 'center' as const,
      width: '20rem',
      render: (text: any, _record: any, index: any) => {
        return !props.isEdit ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
        ) : (
          <Form.Item
            initialValue={Number.isInteger(text) ? text : ''}
            name={`input_achievementpercent_${_record.key}`}
            style={{ margin: 0 }}
            rules={[
              {
                validator: async (_, value) => {
                  if (value === null || value === '')
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                  else {
                    if (!isInteger(value) || value < 1)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE').replace('{min value}', '1')),
                      );
                    if (value > 98)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '98')));
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
                const dataTemp = [...(props.dataSource.settingLevel || [])];
                dataTemp[index] = { ...dataTemp[index], achievementPercent: value ? Number(value) : undefined };
                startTransition(() => props.setDataSource({ ...props.dataSource, settingLevel: dataTemp }));
              }}
            />
          </Form.Item>
        );
      },
    },
  ];
};

export default ComlumnPricing;
