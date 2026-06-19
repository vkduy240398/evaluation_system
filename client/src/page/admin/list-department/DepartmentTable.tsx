/* eslint-disable prefer-const */
import { Grid, Table, message } from 'antd';
import { useState } from 'react';
import httpAxios from '../../../common/http';
import { MetaModal } from '../../../model/MetalModel';
import ModalPopup from '../../../common/ModalPopup';
import PopupEditDepartment from './PopupEditDepartment';
import { t } from 'i18next';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import { useNavigate } from 'react-router-dom';
import { DivisionInfo, DivisionListResponse, DivisionType, conditionsDepartment } from './interfaces/interfaces';
import DivisionColumns from './components/divisionColumns';
import { urlCompanyCode } from '../../../common/util';
interface Props {
  tableData: DivisionListResponse;
  isLoading: boolean;
  handleOnchange: () => void;
  type: number;
  form: any;
  setConditions: (data: conditionsDepartment) => void;
  selectedDivision: DivisionType;
}

const { useBreakpoint } = Grid;
const DepartmentTable: React.FC<Props> = (props: Props) => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { type, form, setConditions, selectedDivision } = props;

  const [deletedRecord, getDeletedRecord] = useState({} as DivisionInfo);

  const [editRecord, getEditedRecord] = useState({} as DivisionInfo);

  let [metaModal, setMetaModal] = useState({
    type: '',
    record: {},
    title: '',
    isOpen: false,
  } as MetaModal);

  const handleOpenPopupConfirm = (record: DivisionInfo) => {
    getDeletedRecord(record);
    handleOpenModal();
  };

  const handleOKPopupConfirm = async () => {
    const id = deletedRecord.id;

    const data = {
      updateTime: deletedRecord.updatedTime,
    };
    await httpAxios.Put(`/api/v1/f8/management-user/delete-deparment/${id}`, { ...data }).then((res) => {
      if (res && res.status === 200) {
        if (res.data.result === 200) {
          message.success(
            type === 1
              ? t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_DELETED_DIVISION_SUCCESSFULLY')
              : t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_DELETED_DEPARTMENT_SUCCESSFULLY'),
          );
          handleOpenModal();
          props.handleOnchange();
        } else {
          message.error(
            type === 1
              ? t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_DELETED_DIVISION_FAILED')
              : t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_DELETED_DEPARTMENT_FAILED'),
          );
          handleOpenModal();
        }
      }
      if (res?.status === 204) {
        message.error(t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_DELETED_DIVISION_EXIST_DEPARTMENT'));
        handleOpenModal();
      }
    });
  };

  const handleOpenPopupEdit = (record: DivisionInfo) => {
    getEditedRecord(record);
    setMetaModal({
      ...metaModal,
      isOpen: true,
      title: type === 1 ? t('POPUP_DIALOG.TITLE.DIVISION_EDIT') : t('POPUP_DIALOG.TITLE.DEPARTMENT_EDIT'),
    });
  };

  const handleClosePopupEdit = () => {
    setMetaModal({ ...metaModal, isOpen: false });
  };

  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => setOpenModal(!isOpenModal);

  return (
    <div>
      <Table
        className={
          type == 1
            ? 'ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer'
            : ''
        }
        loading={props.isLoading}
        bordered
        dataSource={props.tableData?.data}
        columns={DivisionColumns({
          type: type,
          handleOpenPopupEdit: handleOpenPopupEdit,
          handleOpenPopupConfirm: handleOpenPopupConfirm,
        })}
        pagination={false}
        rowKey={(row) => row.id}
        size="small"
        locale={{ emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA') }}
        scroll={{ x: screens.xs ? 1000 : undefined }}
        onRow={(record, _rowIndex) => {
          return {
            onClick: async (_e) => {
              if (type === 1) {
                navigate(urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + '/list-sub-department', {
                  replace: false,
                  state: {
                    offset: 0,
                    limit: 20,
                    sortBy: 'periodIndex',
                    sortType: 'ASC',
                    catergory: 0,
                    departmentCodeAndName: '',
                    classification: t('IDS_ALL'),
                    current: 1,
                    divisionId: record.id,
                    search: true,
                  },
                });
                setConditions({
                  offset: 0,
                  limit: 20,
                  sortBy: 'periodIndex',
                  sortType: 'ASC',
                  catergory: 0,
                  departmentCodeAndName: '',
                  classification: t('IDS_ALL'),
                  current: 1,
                  divisionId: record.id,
                  search: true,
                });
                form.setFieldsValue({ departmentCodeAndName: '' });
              }
            },
          };
        }}
      />

      <ModalPopup
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        metaModal={metaModal}
        setMetaModal={setMetaModal}
        FormModal={
          <PopupEditDepartment
            editRecord={editRecord}
            handleCancel={handleClosePopupEdit}
            dataSource={props.tableData.fullData}
            handleSearch={props.handleOnchange}
            selectedDivision={selectedDivision}
          />
        }
      />

      <ModalCustomComponent
        isOpen={isOpenModal}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={
          type === 1
            ? t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_DIVISION')
            : t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_DEPARTMENT')
        }
        fnHandleOk={handleOKPopupConfirm}
        fnHandleCancel={handleOpenModal}
        okText={t('IDS_DELETE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={props.isLoading}
      />
    </div>
  );
};
export default DepartmentTable;
