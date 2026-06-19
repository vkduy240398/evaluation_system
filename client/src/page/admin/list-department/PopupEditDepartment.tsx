import { Form, Input, Radio, Select, Space, Typography, message } from 'antd';
import { CancelButton, MainButton } from '../../../common/MainButton';
import httpAxios from '../../../common/http';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import EmptyComponent from '../../../common/EmptyComponent';
import departmentApiService from '../../../common/api/department.api';
import { EvaluationPeriodHelper } from '../../../common/utils/datetime/EvaluationPeriodHelper';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import { useAuth } from '../../../hooks/useAuth';
export interface Props {
  editRecord: any;
  handleCancel: any;
  handleSearch: any;
  dataSource: any;
  selectedDivision: any;
}
const PopupEditDepartment: React.FC<Props> = ({
  editRecord,
  handleCancel,
  handleSearch,
  dataSource,
  selectedDivision,
}: Props) => {
  const [_form] = Form.useForm();
  const [isDisable, setDisable] = useState(false);
  const [departmentList, setDepartmentList] = useState([]) as any;
  const { Option } = Select;
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => setOpenModal(!isOpenModal);

  const [radioPeriod, setRadioPeriod] = useState();
  const auth = useAuth();
  useEffect(() => {
    departmentApiService.getListDivisionSystem(setDepartmentList);
  }, []);
  const optionList = departmentList?.map((item: any) => {
    return (
      <Option value={item.id} key={item.id}>
        {`${item.name}`}
      </Option>
    );
  });

  const handleSubmit = () => {
    _form
      .validateFields()
      .then(async (_value) => {
        setDisable(true);
        const id = editRecord.id;
        const data = {
          code:
            editRecord.class == 1
              ? 'GNW-' + _form.getFieldValue('departmentCode')
              : _form.getFieldValue('departmentCode'),
          name: _form.getFieldValue('departmentName'),
          oldCode: editRecord.code.trim(),
          oldName: editRecord.name.trim(),
          updatedTime: editRecord.updatedTime,
          divisionId: _value.division,
          divisionOldId: selectedDivision?.id,
          radioPeriod: radioPeriod,
        };
        if (
          _value.departmentCode !== editRecord.code.substring(4) ||
          _value.departmentName !== editRecord.name ||
          _value.division !== selectedDivision.id
        ) {
          await httpAxios.Put(`/api/v1/f8/management-user/edit-deparment-gnw/${id}`, { ...data }).then((res) => {
            if (res?.status === 200) {
              message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
              setOpenModal(false);
              handleSearch();
              handleCancel();
            }
            setOpenModal(false);
            handleCancel();
          });
        }
        setOpenModal(false);
        handleCancel();
        setDisable(false);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const onChange = (e: any) => {
    setRadioPeriod(e.target.value);
  };

  const handleValidate = () => {
    _form
      .validateFields()
      .then(async () => {
        setOpenModal(!isOpenModal);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Form
        form={_form}
        labelAlign="left"
        labelCol={{ span: 1 }}
        colon={false}
        requiredMark={false}
        initialValues={{
          departmentCode:
            (editRecord.type === 1 && editRecord.class === 0) || editRecord.class === 0
              ? editRecord.code
              : editRecord.code.substring(4),
          departmentName: editRecord.name,
        }}
      >
        {/* <Form.Item label={t('IDS_CATEGORIES')} colon={false}>
          <Typography>{editRecord.type === 0 ? t('IDS_TYPE_DEPARTMENT') : t('IDS_TYPE_DIVISION')}</Typography>
        </Form.Item> */}

        <Form.Item
          hidden
          colon={false}
          label={editRecord.type === 1 ? t('IDS_DIVISION_CODE') : t('IDS_DEPART_CODE')}

          // name="departmentCode"
          // style={{ paddingBottom: 0 }}
          // rules={[
          //   {
          //     required: true,
          //     message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
          //   },
          //   {
          //     max: 10,
          //     message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '10'),
          //   },
          //   {
          //     validator(_rule, value) {
          //       if (value) {
          //         const codeConflict = dataSource.filter((item: any) =>
          //           editRecord.class === 1
          //             ? value.trim().toLowerCase() === item.code.substring(4).trim().toLowerCase()
          //             : value.trim().toLowerCase() === item.code.trim().toLowerCase(),
          //         );
          //         if (codeConflict[0]?.code && codeConflict[0]?.code !== editRecord.code)
          //           return Promise.reject(
          //             new Error(t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_DEPARTMENT_CODE_EXIST') as string),
          //           );
          //         if (!/^[0-9]+$/.test(value))
          //           return Promise.reject(
          //             new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER') as string),
          //           );
          //       }

          //       return Promise.resolve();
          //     },
          //   },
          // ]}
        >
          {/* <Input
            addonBefore={editRecord.class === 0 ? '' : t('IDS_GNW_CODE')}
            maxLength={11}
            style={{ width: '170px' }}

          /> */}
          <Typography.Text>{editRecord.code}</Typography.Text>
        </Form.Item>

        <Form.Item
          label={editRecord.type === 1 ? t('IDS_TYPE_DIVISION_NAME') : t('IDS_TYPE_DEPARTMENT_NAME')}
          colon={false}
          name="departmentName"
          style={{ paddingTop: 0 }}
          rules={[
            {
              required: true,
              message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
            },
            {
              max: 100,
              message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '100'),
            },
            {
              validator(_rule, value) {
                if (value) {
                  const nameConflict = dataSource.filter(
                    (item: any) => value.trim().toLowerCase() === item.name.trim().toLowerCase(),
                  );
                  if (nameConflict[0]?.name && nameConflict[0]?.name !== editRecord.name)
                    return Promise.reject(
                      new Error(t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_DEPARTMENT_NAME_EXIST') as string),
                    );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            maxLength={101}
            style={{ width: '300px' }}

            // disabled={editRecord.class === 0}
          />
        </Form.Item>
        {editRecord.type == 0 && (
          <Form.Item
            label={t('IDS_TYPE_DIVISION_NAME')}
            name="division"
            colon={false}
            rules={[
              {
                required: true,
                message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
              },
            ]}
            initialValue={selectedDivision.id}
          >
            <Select
              showSearch
              style={{ width: '250px' }}
              filterOption={(inputValue, option) =>
                option?.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())
              }
              notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
            >
              {optionList}
            </Select>
          </Form.Item>
        )}
        <Form.Item label={t('IDS_CLASSIFICATION')}>
          <Typography>{editRecord.class === 1 ? t('IDS_CREATE_MANUAL') : t('IDS_ORACLE_DEPARTMENT')}</Typography>
        </Form.Item>

        <Form.Item
          label={t('IDS_APPLICATION_PERIOD')}
          colon={false}
          name={'radioPeriod'}
          rules={[
            {
              required: true,
              message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM') as string,
            },
          ]}
        >
          <Radio.Group onChange={onChange} value={radioPeriod}>
            <Space direction="vertical">
              <Radio value={2}>{`${EvaluationPeriodHelper.getCurrentPeriodYear(
                auth.user?.timeZone || 'Asia/Tokyo',
              )}年${EvaluationPeriodHelper.getCurrentPeriodIndex(
                auth.user?.timeZone || 'Asia/Tokyo',
              )}の目標レコードに適用せず、来期以降に適用`}</Radio>
              <Radio value={1}>{`${EvaluationPeriodHelper.getCurrentPeriodYear(
                auth.user?.timeZone || 'Asia/Tokyo',
              )}年${EvaluationPeriodHelper.getCurrentPeriodIndex(
                auth.user?.timeZone || 'Asia/Tokyo',
              )}の目標レコードに適用せず、新部署名で例外を設定可能`}</Radio>
              <Radio value={0}>{`${EvaluationPeriodHelper.getCurrentPeriodYear(
                auth.user?.timeZone || 'Asia/Tokyo',
              )}年${EvaluationPeriodHelper.getCurrentPeriodIndex(
                auth.user?.timeZone || 'Asia/Tokyo',
              )}のすべての目標レコードに適用（例外は新部署名で設定）`}</Radio>
            </Space>
          </Radio.Group>
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
            onClick={handleValidate}
            disabled={isDisable}
          >
            {t('IDS_BUTTON_SAVE')}
          </MainButton>
          <CancelButton form="form" onClick={handleCancel}>
            {t('IDS_BUTTON_CANCEL')}
          </CancelButton>
        </Space>
      </Form>

      <ModalCustomComponent
        isOpen={isOpenModal}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE')}
        fnHandleOk={handleSubmit}
        fnHandleCancel={handleOpenModal}
        okText={t('IDS_BUTTON_SAVE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isDisable}
      />
    </div>
  );
};

export default PopupEditDepartment;
