import React, { useEffect, useState } from 'react';
import { Button, Cascader, DatePicker, Form, Input, message, Radio, Space, Typography } from 'antd';
import { t } from 'i18next';
import Icon, { PlusCircleOutlined } from '@ant-design/icons';
import EmptyComponent from '../../../../common/EmptyComponent';
import { MainButton, CancelButton } from '../../../../common/MainButton';
import PopupAddUserSettingHistoryReference from './popupAddUserSettingHistoryReference';
import httpAxios from '../../../../common/http';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import { useLocation, useNavigate } from 'react-router-dom';
import { urlCompanyCode } from '../../../../common/util';
import dayjs from 'dayjs';
import { EvaluationPeriodHelper } from '../../../../common/utils/datetime/EvaluationPeriodHelper';
import moment from 'moment';
import { useAuth } from '../../../../hooks/useAuth';
interface Props {
  type: string;
}
const AddEditUserEvaluationReference: React.FC<Props> = (props: Props) => {
  //* Props, parameters
  const { type } = props;

  //* React hook
  const [formAdd] = Form.useForm();

  const navigate = useNavigate();

  const [listUsers, setListUser] = useState([]) as any;

  const [isOpenPopupAddUser, setOpenPopupAddUser] = useState(false);

  const [typeUser, setTypeUser] = useState('');

  const [isDisable, setDisable] = useState(false);

  const [isOpenModalConfirm, setOpenModalConfirm] = useState<boolean>(false);

  const state = useLocation().state;

  const data = state?.data;

  const condition = state?.condition;

  const [mainGroupValue, setMainGroupValue] = useState(0);

  const [subGroupValue, setSubGroupValue] = useState(null);

  const auth = useAuth();

  //* Component
  const buttonAdd = (type: string) => {
    return (
      <div>
        <Button
          type="text"
          icon={
            <Icon
              component={PlusCircleOutlined as React.ForwardRefExoticComponent<any>}
              style={{ color: '#00874d', fontSize: 20 }}
            />
          }
          onClick={() => {
            setOpenPopupAddUser(true);
            setTypeUser(type);
          }}
          style={{ textAlign: 'center' }}
        />
      </div>
    );
  };

  //* Function
  const convertString = (text: string) => {
    const index = text.indexOf('期分');

    return text.substring(0, index);
  };

  useEffect(() => {
    if (type === 'edit') {
      if (!state || state == null) {
        navigate(urlCompanyCode() + '/admin-evaluation/setting-evaluation-history-reference', {
          replace: false,
        });
      } else {
        formAdd.setFieldValue('viewer', [[data?.viewer_id]]);
        formAdd.setFieldValue('targetAudience', [[data?.user_id]]);
        formAdd.setFieldValue('viewPeriod', convertString(data?.rangePeriod));
        formAdd.setFieldValue('viewRange', data?.type);
        formAdd.setFieldValue('periodIndex', data?.maxYearPeriod);
        formAdd.setFieldValue('year', dayjs(moment(data?.maxYear, 'YYYY').format('YYYY')));
        formAdd.setFieldValue('order', data?.order);
        setMainGroupValue(data?.type);
      }
    }
    getListUser();
    initForm();
  }, []);

  const getListUser = async () => {
    await httpAxios.Get('/api/v1/f6/management-evaluation/get-all-user').then((res) => {
      if (res && res?.status) {
        const arrays = res?.data.map((v: any) => ({
          label: `${v.employeeNumber}: ${v.fullName}（${
            v.level <= 7 ? (v.department == null ? '' : v.department?.name) : v.division == null ? '' : v.division?.name
          }）`,
          value: v.id,
        }));
        setListUser(arrays);
      }
    });
  };

  const initForm = async () => {
    if (type === 'add') {
      await httpAxios.Get('/api/v1/f6/management-evaluation/get-setting-default-period', {}).then((res) => {
        formAdd.setFieldValue('viewPeriod', res?.data?.number || '');
      });
      formAdd.setFieldValue(
        'year',
        dayjs(
          moment(EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'), 'YYYY').format(
            'YYYY',
          ),
        ),
      );
      formAdd.setFieldValue(
        'periodIndex',
        EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo') === '上期' ? 1 : 2,
      );
    }
  };

  const handleSubmit = async () => {
    formAdd
      .validateFields()
      .then(async (_value) => {
        setDisable(true);
        const viewer = _value.viewer?.flat();
        const targetAudience = _value.targetAudience?.flat();
        const viewPeriod = parseInt(_value.viewPeriod);
        const viewRange = parseInt(_value.viewRange);
        const year = dayjs(_value.year, 'YYYY').format('YYYY');
        const order = _value.order === undefined || null ? null : _value.order;
        const periodIndex = _value.periodIndex;

        const dataSubmit = {
          viewer: viewer,
          targetAudience: targetAudience,
          viewPeriod: viewPeriod,
          viewRange: viewRange,
          year: year,
          order: order,
          periodIndex: periodIndex,
          typeAction: type === 'add' ? 'add' : 'edit',
          listId: data?.ListHistoryId || [],
        };

        await httpAxios
          .Post('/api/v1/f6/management-evaluation/add-edit-user-setting-evaluation-history-reference', {
            ...dataSubmit,
          })
          .then(async (res) => {
            if (res && res.status === 201) {
              setDisable(false);
              setOpenModalConfirm(false);
              if (type === 'add') {
                message.success(t('MESSAGE.COMMON.IDM_ADD_SUCCESS'));
                navigate(
                  urlCompanyCode() +
                    '/' +
                    window.location.pathname.split('/')[3] +
                    '/setting-evaluation-history-reference',
                );
              } else {
                message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
                navigate(
                  urlCompanyCode() +
                    '/' +
                    window.location.pathname.split('/')[3] +
                    '/setting-evaluation-history-reference',
                  {
                    state: {
                      ...condition,
                      page: condition.page,
                    },
                    replace: true,
                  },
                );
              }
            } else {
              setDisable(false);
              setOpenModalConfirm(false);
              navigate(
                urlCompanyCode() +
                  '/' +
                  window.location.pathname.split('/')[3] +
                  '/setting-evaluation-history-reference',
                {
                  state: {
                    ...condition,
                    page: condition.page,
                  },
                  replace: true,
                },
              );
            }
          });
      })
      .catch(() => {});
    setDisable(false);
  };

  return (
    <div>
      <Typography.Title level={3}>
        {type === 'add' ? t('IDS_ADD_PERMISSION_EVALUATION') : t('IDS_EDIT_PERMISSION_EVALUATION')}
      </Typography.Title>

      <Form
        form={formAdd}
        name="create_template_form"
        colon={false}
        requiredMark={false}
        labelCol={{ span: 1 }}
        style={{ width: '100%' }}
        labelAlign="left"
      >
        <Form.Item label={t('IDS_VIEWER')} style={{ marginBottom: 0 }}>
          <Form.Item
            name={'viewer'}
            style={{ display: 'inline-block', minWidth: 350, width: 'calc(23% - 8px)' }}
            rules={[
              {
                required: true,
                message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
              },
            ]}
          >
            <Cascader
              showSearch
              style={{ width: 350 }}
              size="small"
              options={listUsers}
              multiple
              allowClear={false}
              maxTagTextLength={150}
              notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
              open={false}
              suffixIcon
            />
          </Form.Item>
          {<span style={{ position: 'absolute', left: 350 }}>{buttonAdd('1')}</span>}
        </Form.Item>

        <Form.Item label={t('IDS_TARGET_AUDIENCE')} style={{ marginBottom: 0 }}>
          <Form.Item
            name={'targetAudience'}
            style={{ display: 'inline-block', minWidth: 350, width: 'calc(23% - 8px)' }}
            rules={[
              {
                required: true,
                message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
              },
            ]}
          >
            <Cascader
              showSearch
              style={{ width: 350 }}
              size="small"
              options={listUsers}
              multiple
              allowClear={false}
              maxTagTextLength={150}
              notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
              open={false}
              suffixIcon
            />
          </Form.Item>
          {<span style={{ position: 'absolute', left: 350 }}>{buttonAdd('2')}</span>}
        </Form.Item>

        <Form.Item
          label={t('IDS_VIEW_PERIOD')}
          name="viewPeriod"
          rules={[
            {
              validator: async (_, value) => {
                const isNumber = /^-?\d+$/;
                if (value === '') return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                else {
                  if (!isNumber.test(value)) {
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER').toString()));
                  }
                  if (value > 100)
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '100')));
                  if (value < 1)
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MIN_POINT').replace('{min value}', '0')));
                }
              },
            },
          ]}
        >
          <Input style={{ width: '50px', textAlign: 'center' }} maxLength={3}></Input>
        </Form.Item>

        <Form.Item
          label={t('IDS_VIEW_RANGE')}
          colon={false}
          name={'viewRange'}
          rules={[
            {
              required: true,
              message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM') as string,
            },
          ]}
        >
          <Radio.Group
            onChange={(e) => {
              setMainGroupValue(e.target.value);
              setSubGroupValue(null); // Clear subGroupValue when main group changes
              formAdd.setFieldValue('order', null);
            }}
          >
            <Space direction="vertical">
              <Radio value={1}>{(t('IDL_LIST_PERMISSION_VIEW_EVALUATION', { returnObjects: true }) as any)[1]}</Radio>
              <Radio value={2}>{(t('IDL_LIST_PERMISSION_VIEW_EVALUATION', { returnObjects: true }) as any)[2]}</Radio>
              <Radio value={3}>{(t('IDL_LIST_PERMISSION_VIEW_EVALUATION', { returnObjects: true }) as any)[3]}</Radio>
              <Radio value={4}>{(t('IDL_LIST_PERMISSION_VIEW_EVALUATION', { returnObjects: true }) as any)[4]}</Radio>
              <Radio value={5}>{(t('IDL_LIST_PERMISSION_VIEW_EVALUATION', { returnObjects: true }) as any)[5]}</Radio>
              <Radio value={6}>{(t('IDL_LIST_PERMISSION_VIEW_EVALUATION', { returnObjects: true }) as any)[6]}</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        {[3, 5, 6].includes(mainGroupValue) && (
          <Form.Item
            label={t('IDS_DISPLAY_ORDER')}
            colon={false}
            name={'order'}
            rules={[
              {
                required: [3, 5, 6].includes(mainGroupValue),
                message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM') as string,
              },
            ]}
          >
            <Radio.Group onChange={(e) => setSubGroupValue(e.target.value)}>
              <Space direction="horizontal">
                <Radio value={'0.5'}>{t('IDS_POINT_EVALUATOR_0_5')}</Radio>
                <Radio value={'1.0'}>{t('IDS_POINT_EVALUATOR_1')}</Radio>
                <Radio value={'2.0'}>{t('IDS_POINT_EVALUATOR_2')}</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        )}

        <Form.Item label={t('IDS_PERIOD_VIEW_REFERENCE')} style={{ marginBottom: 0 }}>
          <Space direction="horizontal" size={'small'}>
            <Form.Item name={'year'}>
              <DatePicker
                format={'YYYY'}
                picker="year"
                disabledDate={(current) => {
                  return (current && current > dayjs().add(5, 'year')) || (current && current < dayjs().year(2020));
                }}
                size="small"
                placeholder="YYYY"
                allowClear={true}
                clearIcon={false}
                style={{ width: 100 }}
              />
            </Form.Item>
            <Form.Item name="periodIndex">
              <Radio.Group>
                <Radio value={1}>{t('IDS_FIRST_PERIOD')}</Radio>
                <Radio value={2}>{t('IDS_SECOND_PERIOD')}</Radio>
              </Radio.Group>
            </Form.Item>
          </Space>
        </Form.Item>

        <Space
          size={'middle'}
          style={{
            marginTop: 10,
          }}
        >
          <MainButton
            type="primary"
            name="Search"
            value="txt_evaluation_search"
            onClick={() => {
              formAdd
                .validateFields()
                .then(() => {
                  setOpenModalConfirm(true);
                })
                .catch(() => {});
            }}
            loading={isDisable}
          >
            {type === 'add' ? t('IDS_BUTTON_ADD') : t('IDS_BUTTON_SAVE')}
          </MainButton>
          <CancelButton
            form="form"
            onClick={() => {
              if (type === 'add') {
                navigate(-1);
              } else {
                navigate(
                  urlCompanyCode() +
                    '/' +
                    window.location.pathname.split('/')[3] +
                    '/setting-evaluation-history-reference',
                  {
                    state: {
                      ...condition,
                      page: condition.page,
                    },
                    replace: true,
                  },
                );
              }
            }}
            loading={isDisable}
          >
            {t('IDS_BUTTON_CANCEL')}
          </CancelButton>
        </Space>
      </Form>

      <PopupAddUserSettingHistoryReference
        state={undefined}
        handleOnchange={undefined}
        conditions={undefined}
        isOpenPopupAddUser={isOpenPopupAddUser}
        setOpenPopupAddUser={setOpenPopupAddUser}
        typeUser={typeUser}
        formAdd={formAdd}
      />

      <ModalCustomComponent
        isOpen={isOpenModalConfirm}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={
          type === 'add'
            ? (t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_ADD') as string)
            : (t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE') as string)
        }
        fnHandleOk={handleSubmit}
        fnHandleCancel={() => {
          setOpenModalConfirm(false);
        }}
        okText={type === 'add' ? (t('IDS_BUTTON_ADD') as string) : (t('IDS_BUTTON_SAVE') as string)}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isDisable}
      />
    </div>
  );
};
export default AddEditUserEvaluationReference;
