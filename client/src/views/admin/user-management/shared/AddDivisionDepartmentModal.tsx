import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Radio, RadioChangeEvent, Space, Typography, message } from 'antd';
import { FormInstance } from 'antd/lib';
import { useTranslation } from 'react-i18next';
import httpAxios from '../../../../common/http';
import departmentApiService from '../../../../common/api/department.api';
import EmptyComponent from '../../../../common/EmptyComponent';
import { validateName } from '../../../../page/admin/list-department/processes/getAndValidate';
import { MetaModal } from '../../../../model/MetalModel';
import styles from '../user-list/user-list/BulkUserManagement.module.css';
import {
  FONT_SIZE,
  COLOR_CLOSE_ICON,
  MODAL_TOP,
  MODAL_WIDTH_NORMAL,
  HEADER_MARGIN_BOTTOM,
  TITLE_MARGIN_BOTTOM,
  BODY_PADDING,
  FOOTER_GAP,
} from './editUserWizard.constants';
import { ColoredSelect } from './EditUserWizardShared';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DepartmentProps {
  id: any;
  code?: string;
  name?: string;
  codeName: string;
}

interface DivisionProps {
  divisionId: any;
  code?: string;
  name?: string;
  codeName: string;
  childrens: DepartmentProps[];
}

interface DataProps {
  code: string;
  name: string;
  class: any;
  type: number;
  active: number;
  division: any;
}

interface ResProps {
  id: number;
  class: number;
  type: number;
  code: string;
  name: string;
  active: number;
}

interface AddDivisionDepartmentModalProps {
  metaModal: MetaModal;
  setMetaModal: React.Dispatch<React.SetStateAction<MetaModal>>;
  onClose: () => void;
  form: FormInstance;
  listDepartmentTypeDepartments: DepartmentProps[];
  setListDepartmentTypeDepartment: (args: DepartmentProps[]) => void;
  listDepartmentTypeDivisions: DivisionProps[];
  setListDepartmentTypeDivision: (args: DivisionProps[]) => void;
  recordInfo: any;
  handleSetRadioButtonAfterClick?: () => void;
}

// ── Component ────────────────────────────────────────────────────────────────
// Data/submit logic mirrors PopupAddDepartment (page/admin/user-detail/PopupAddDepartment.tsx) 1:1 —
// only the presentation is restyled to match the ModalEditUserFromDetail / ModalEditUser wizard.

const AddDivisionDepartmentModal: React.FC<AddDivisionDepartmentModalProps> = ({
  metaModal,
  setMetaModal,
  onClose,
  form,
  setListDepartmentTypeDepartment,
  setListDepartmentTypeDivision,
  listDepartmentTypeDepartments,
  listDepartmentTypeDivisions,
  recordInfo,
  handleSetRadioButtonAfterClick,
}) => {
  const { t } = useTranslation();
  const [dataSave, setDataSave] = useState([]) as any;
  const [isLoading, setLoading] = useState(false);
  const [checkOracle, setCheckOracle] = useState(1);
  const [isLoadingOracle, setLoadingOracle] = useState(false);
  const [listDivisionOracle, setListDivisionOracle] = useState([]) as any;
  const [listMerge, setListMerge] = useState([]) as any;

  useEffect(() => {
    if (!metaModal.isOpen) return;

    const dataList: any[] = [];
    departmentApiService.getListDepartmentGNW(dataList, setDataSave, setLoading);
    form.setFieldsValue({ class: 1 });

    // neu chot de sdefault la division da chon thi ko can goi list nay nua
    if (listMerge.length < 1 && Number(metaModal.type) === 0) {
      departmentApiService.getListMergerOracle(setListMerge, setLoadingOracle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaModal.isOpen]);

  const handleSubmit = async () => {
    setLoading(true);

    await form
      .validateFields(['division_oracle', 'department_oracle', 'code', 'input_name'])
      .then(async (values: any) => {
        let code = '';
        let name = '';

        // check oracle or create
        if (form.getFieldValue('class') === 0) {
          if (Number(metaModal.type) === 1) {
            code = values.division_oracle.split(':')[0].trim();
            name = values.division_oracle.split(':')[1].trim();
          } else {
            code = values.department_oracle.split(':')[0].trim();
            name = values.department_oracle.split(':')[1].trim();
          }
        } else {
          code = 'GNW-' + values.code;
          name = values.input_name;
        }
        const dataSaveReq: DataProps = {
          code: code,
          name: name,
          class: form.getFieldValue('class'),
          type: Number(metaModal.type),
          active: 1,
          division: form.getFieldValue('division_oracle'),
        };

        await httpAxios.Post('/api/v1/f8/management-user/add-division-deparment', { ...dataSaveReq }).then((res) => {
          if (res?.status === 201) {
            const resData = res.data as ResProps;
            message.success(t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_ADDED_NEW_DEPARTMENT_SUCCESSFULLY'));

            // ** Add Only Division
            if (metaModal.type === '1') {
              if (resData) {
                const division = resData;
                form.setFieldsValue({ division: division.id });

                // ** Find division
                const find = listDepartmentTypeDivisions.find((f) => f.divisionId === division.id);

                if (!find) {
                  const divisionItem: DivisionProps = {
                    divisionId: division.id,
                    codeName: `${division.name}`,
                    childrens: [],
                  };

                  // ** Set division new into division exit
                  setListDepartmentTypeDivision([...listDepartmentTypeDivisions, divisionItem]);

                  // ** Set department
                  form.setFieldsValue({ department: '' });

                  setListDepartmentTypeDepartment([]);
                }
              }
            } else {
              const department = resData;

              const departmentId: DepartmentProps = {
                id: department.id,
                codeName: `${department.name}`,
              };
              setListDepartmentTypeDepartment([...listDepartmentTypeDepartments, departmentId]);

              // ** Set department
              form.setFieldsValue({ department: department.id || '' });
            }
            form.setFieldsValue({ class: 1, code: '', input_name: '', division_oracle: '', department_oracle: '' });
            setMetaModal({ ...metaModal, isOpen: false, title: '' });
          } else if (res?.status === 204) {
            message.error(t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_DEPARTMENT_NAME_EXIST'));
          }
        });
        handleSetRadioButtonAfterClick?.();
      })
      .catch((err) => console.log({ err }));
    setLoading(false);
  };

  const handleTypeChange = async (e: RadioChangeEvent) => {
    setCheckOracle(e.target.value);
    if (e.target.value === 0) {
      if (listDivisionOracle.length < 1) {
        await departmentApiService.getListDivisionOracle(setListDivisionOracle, setLoadingOracle);
      }
      if (listMerge.length < 1) {
        await departmentApiService.getListMergerOracle(setListMerge, setLoadingOracle);
      }
    }
  };

  const oracleOptionList = listDivisionOracle?.map((item: any) => ({ value: item.id, label: `${item.name}` }));
  const mergeOptionList = listMerge?.map((item: any) => ({ value: item.id, label: `${item.name}` }));

  return (
    <Modal
      open={metaModal.isOpen}
      footer={null}
      closable={false}
      destroyOnClose
      maskClosable={false}
      centered
      width={MODAL_WIDTH_NORMAL}
      className={styles.modalContainer}
      style={{ top: MODAL_TOP }}
    >
      <Form form={form} layout="vertical" colon={false} requiredMark={false}>
        {/* Header */}
        <div className={styles.headerSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: HEADER_MARGIN_BOTTOM }}>
            <Typography.Title
              level={4}
              style={{ margin: 0, marginBottom: TITLE_MARGIN_BOTTOM, paddingBottom: 0 }}
              className={styles.stepTitle}
            >
              {t('IDS_ADD_DEPARTMENT')}
            </Typography.Title>
            <span style={{ cursor: 'pointer', color: COLOR_CLOSE_ICON }} onClick={onClose}>
              ✕
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: BODY_PADDING, display: 'grid', gap: 8 }}>
          <Form.Item
            label={t('IDS_CLASSIFICATION')}
            name="class"
            colon={false}
            initialValue={1}
            style={{ marginBottom: 0 }}
          >
            <Radio.Group onChange={handleTypeChange}>
              <Space size={16}>
                <Radio value={1} style={{ fontSize: FONT_SIZE }}>
                  {t('IDS_CREATE_MANUAL')}
                </Radio>
                <Radio value={0} style={{ fontSize: FONT_SIZE }}>
                  {t('IDS_ORACLE_DEPARTMENT')}
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {checkOracle === 1 && (
            <Form.Item
              label={Number(metaModal.type) ? t('IDS_TYPE_DIVISION_NAME') : t('IDS_TYPE_DEPARTMENT_NAME')}
              name="input_name"
              colon={false}
              style={{ marginBottom: 0 }}
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
                    return validateName(value, form, metaModal.type, dataSave);
                  },
                },
              ]}
            >
              <Input maxLength={101} style={{ width: '100%' }} />
            </Form.Item>
          )}

          {Number(metaModal.type) === 0 && checkOracle === 0 && (
            <Form.Item
              label={t('IDS_TYPE_DEPARTMENT_NAME')}
              name="department_oracle"
              colon={false}
              style={{ marginBottom: 0 }}
              rules={[
                {
                  required: true,
                  message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
                },
              ]}
            >
              <ColoredSelect
                showSearch
                style={{ width: '100%' }}
                filterOption={(input: string, option: any) => option?.label.toLowerCase().includes(input.toLowerCase())}
                options={oracleOptionList}
                notFoundContent={<EmptyComponent />}
                disabled={isLoadingOracle}
                loading={isLoadingOracle}
              />
            </Form.Item>
          )}

          {(checkOracle === 0 || (checkOracle === 1 && Number(metaModal.type) === 0)) && (
            <Form.Item
              label={t('IDS_TYPE_DIVISION_NAME')}
              name="division_oracle"
              colon={false}
              style={{ marginBottom: 0 }}
              rules={[
                {
                  required: true,
                  message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
                },
              ]}
              initialValue={Number(metaModal.type) === 0 ? recordInfo?.divisionId : ''}
            >
              <ColoredSelect
                showSearch
                style={{ width: '100%' }}
                filterOption={(input: string, option: any) => option?.label.toLowerCase().includes(input.toLowerCase())}
                options={Number(metaModal.type) === 1 ? oracleOptionList : mergeOptionList}
                notFoundContent={<EmptyComponent />}
                disabled={isLoadingOracle || Number(metaModal.type) === 0}
                loading={isLoadingOracle}
              />
            </Form.Item>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div style={{ display: 'flex', gap: FOOTER_GAP }}>
            <Button type="primary" size="middle" loading={isLoading || isLoadingOracle} onClick={handleSubmit}>
              {t('IDS_BUTTON_ADD')}
            </Button>
            <Button type="default" size="middle" disabled={isLoading || isLoadingOracle} onClick={onClose}>
              {t('IDS_BUTTON_CANCEL')}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddDivisionDepartmentModal;
