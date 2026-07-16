/* eslint-disable prefer-const */
import { Button, Cascader, Checkbox, Grid, Modal, Row, Space, Table, Tooltip, message } from 'antd';
import { useState } from 'react';
import { MainButton } from '../../../../common/MainButton';
import ModalPopup from '../../../../common/ModalPopup';
import { MetaModal } from '../../../../model/MetalModel';
import MultiEditForm from './MultiEditForm';
import SetEvaluationColumn from './SetEvaluationColumn';
import SingleEditForm from './SingleEditForm';
import { i18n, t } from 'i18next';
import { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import httpAxios from '../../../../common/http';
import TableCustomComponent from '../../../../@core/components/table-custom/TableCustomComponent';
import dayjs from 'dayjs';

// ** Styles
import styles from '../../../../common/css/stylesTable.module.css';
import ExceptionPeriodInfor from '../../../../views/admin-period/ExceptionPeriodInfor';
import Icon, { DashOutlined, InfoCircleOutlined } from '@ant-design/icons';
import ShowMoreSkillUserPopUp from './ShowMoreSkillUser';

interface Props {
  dataState: any | undefined;
  isLoading: boolean;
  handleOnchange: any;
  setSelectedRowKeys: any;
  selectedRowKeys: any;
  setSelectedRows: any;
  selectedRows: any;
  isFixed: any;
  setTextNotify: any;
  setIsVisibleNotify: any;
  state: any;
  conditions: any;
  handleSearchSavePopUp: any;
  isEvaluationTime?: boolean;
  i18n: i18n;
}
const SetEvaluationTable: React.FC<Props> = (props: Props) => {
  const {
    selectedRowKeys,
    isFixed,
    setTextNotify,
    setIsVisibleNotify,
    state,
    conditions,
    handleSearchSavePopUp,
    isEvaluationTime,
    i18n,
  } = props;
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [openPopUp, setOpenPopUp] = useState<boolean>(false);
  const [userInfor, setUserInfor] = useState<any>({
    id: null,
    key: 'user-key',
    fullName: '',
    companyName: '',
    departmentName: '',
    email: '',
    company: {},
    department: {},
  });

  // const dispatch = useDispatch<AppDispatch>();
  const [metaModal, setMetaModal] = useState({
    type: '',
    record: {},
    title: '',
    isOpen: false,
  } as MetaModal);

  let temListEvaluators: any[] = [];
  let listChangeOptinals: any[] = [];
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => setOpenModal(!isOpenModal);

  const handleOpen = () => {
    setMetaModal({
      ...metaModal,
      isOpen: true,
      title: props.selectedRows.length > 1 ? t('IDS_EDIT_EVALUATOR_MULTIPLE') : t('IDS_EDIT_EVALUATOR'),
    });
  };

  const handleCancel = () => {
    setMetaModal({ ...metaModal, isOpen: false });
    temListEvaluators = [];
    listChangeOptinals = [];
  };
  const handleCancelPopUp = () => {
    if (!isEdit || !data) {
      setOpenPopUp(false);
    }
    setIsEdit(false);
  };
  const handleOKPopupConfirmDelete = async () => {
    const data = {
      selectedKeyDeleted: selectedRowKeys,
      state: state,
    };

    await httpAxios
      .Put(`/api/v1/f5/management-evaluation-history/delete-user-setting-evaluator`, { ...data })
      .then((res) => {
        if (res && res.status === 200) {
          message.success(t('MESSAGE.COMMON.IDM_DELETE_USER_SUCCESS'));
          handleOpenModal();
          props.handleOnchange();
        }
      });
    handleOpenModal();
    props.handleOnchange();
    props.setSelectedRows([]);
    props.setSelectedRowKeys([]);
  };

  const handleOpenPopupConfirm = () => {
    handleOpenModal();
  };
  const [isOpenPopup, setOpenPopup] = useState<boolean>(false);
  const [tableSkill, setTableSkill] = useState() as any;

  const buttonShowMore = (record: any) => {
    return (
      <>
        <Button
          style={{ marginLeft: '5px', marginTop: '2px' }}
          onClick={() => {
            setTableSkill(record);
            setOpenPopup(true);
          }}
        >
          <DashOutlined />
        </Button>
      </>
    );
  };

  const exceptionUserPeriodChildrenColumn = () => {
    const columns: ColumnsType<any> = [
      {
        title: t('IDS_EVALUATION_PERIOD'),
        dataIndex: 'period',
        key: 'period',
        width: '10%',
        align: 'center',

        render(_, record) {
          const startTime = record.periodStart ? dayjs(record.periodStart, 'YYYY/M') : null;
          const endTime = record.periodEnd ? dayjs(record.periodEnd, 'YYYY/M') : null;

          return `${startTime?.format('YYYY/M')} ～ ${endTime?.format('YYYY/M')}`;
        },

        onCell(value: any) {
          if (value.isColSpan) return { colSpan: 0 };

          return {};
        },
      },
      {
        title: t('IDS_DEPARTMENT'),
        key: 'departmentName',
        width: '20%',

        render(text) {
          return (
            <>
              {text.divisionName && (
                <div style={{ textAlign: 'left' }}>
                  {t('IDS_DEPARTMENT')}: {text.divisionName}
                </div>
              )}
              {text.departmentName && (
                <div style={{ textAlign: 'left' }}>
                  {t('IDS_TYPE_DEPARTMENT_NAME')}: {text.departmentName}
                </div>
              )}
            </>
          );
        },

        onCell(value: any) {
          if (value.isColSpan) return { colSpan: 0 };

          return {};
        },
      },
      {
        title: t('IDS_LEVEL'),
        dataIndex: 'level',
        key: 'level',
        align: 'center' as const,
        width: '3%',

        render(text) {
          return text;
        },

        onCell(value: any) {
          if (value.isColSpan) return { colSpan: 0 };

          return {};
        },
      },
      {
        title: t('IDS_EVALUATION_SKILL'),

        // dataIndex: 'flagSkill',
        key: 'level',
        align: 'center' as const,
        width: '5%',

        render(text) {
          return text.flagSkill === 1 ? t('IDS_HAVE') : t('IDS_NOT_HAVE');
        },

        onCell(value: any) {
          if (value.isColSpan) return { colSpan: 0 };

          return {};
        },
      },

      {
        title: t('IDS_EVALUATOR'),
        dataIndex: 'evaluator05',
        key: 'evaluator05',
        width: '15%',
        render(text, record) {
          const evaluator05 = record?.evaluator05;
          const evaluator10 = record?.evaluator10;
          const evaluator20 = record?.evaluator20;

          return (
            <>
              {evaluator05 && (
                <div style={{ textAlign: 'left' }}>
                  {t('IDS_POINT_EVALUATOR_0_5')} : {evaluator05}
                </div>
              )}
              {evaluator10 && (
                <div style={{ textAlign: 'left' }}>
                  {t('IDS_POINT_EVALUATOR_1')} : {evaluator10}
                </div>
              )}
              {evaluator20 && (
                <div style={{ textAlign: 'left' }}>
                  {t('IDS_POINT_EVALUATOR_2')} : {evaluator20}
                </div>
              )}
            </>
          );
        },
      },

      {
        title: t('IDS_TEMPLATE'),
        dataIndex: 'evaluator05',
        key: 'evaluator05',
        width: '30%',
        render: (_text: any, record: any, _index: any) => {
          if (record.skillUser?.length > 0) {
            const skills = record.skillUser.map((v: any) => v.skill.name);

            const options: { skillName: string }[] = [];
            const defaultValueList: string[] = [];

            skills.forEach((item: any) => {
              options.push({
                skillName: item,
              });
              defaultValueList.push(item.split(','));
            });

            return (
              <>
                <Row>
                  <Cascader
                    style={{ width: '80%' }}
                    multiple
                    allowClear={false}
                    maxTagCount="responsive"
                    value={defaultValueList}
                    open={false}
                    suffixIcon
                    removeIcon
                  />
                  {buttonShowMore(options)}
                </Row>
              </>
            );
          }

          return <></>;
        },
      },
    ];

    return columns;
  };
  const renderTable = (record: any) => {
    return (
      <TableCustomComponent
        columns={exceptionUserPeriodChildrenColumn()}
        dataSources={record}
        style={{ wordBreak: 'break-word', verticalAlign: 'top' }}

        // rowClassName={(r) => (r.isEdit ? '' : styles.inActiveUser)}
      />
    );
  };
  const handleClosePopUp = () => {
    setIsEdit(false);
    setOpenPopUp(false);
  };

  const handleSelectAll = (e: any) => {
    const checked = e.target.checked;
    if (checked) {
      const allKeys = props.dataState.map((item: any) => item.userId);
      props.setSelectedRowKeys(allKeys);
      props.setSelectedRows(props.dataState);
    } else {
      props.setSelectedRowKeys([]);
      props.setSelectedRows([]);
    }
  };

  const showColumnTitle = () => {
    return (
      <Space>
        <Checkbox
          indeterminate={props.selectedRowKeys?.length > 0 && props.selectedRowKeys?.length < props.dataState?.length}
          onChange={handleSelectAll}
          checked={props.dataState?.length > 0 && props.selectedRowKeys?.length === props.dataState?.length}
          disabled={isFixed || !props.dataState?.length}
        ></Checkbox>
        <Tooltip title={t('IDS_TOOLTIP_CHECKBOX_EVALUATOR')}>
          <Icon component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>} />
        </Tooltip>
      </Space>
    );
  };

  const [data, setData] = useState<any>([]);

  return (
    <div>
      <Space size={'large'}>
        <MainButton
          type="primary"
          name="Search"
          value="txt_evaluation_search"
          style={{ marginBottom: '20px', marginTop: 20 }}
          onClick={handleOpenPopupConfirm}
          disabled={props.selectedRowKeys.length === 0 || props.dataState?.length === 0 ? true : false}
        >
          {t('IDS_BUTTON_DELETE_MULTIPLE')}
        </MainButton>
        <MainButton
          type="primary"
          name="Search"
          value="txt_evaluation_search"
          style={{ marginBottom: '20px', marginTop: 20 }}
          onClick={handleOpen}
          disabled={
            props.selectedRowKeys.length === 0 ||
            props.dataState?.length === 0 ||
            (props.selectedRows.length > 0 && props.selectedRows.every((row: any) => row.childrens?.length > 0))
              ? true
              : false
          }
        >
          {t('IDS_BUTTON_EDIT_MULTIPLE')}
        </MainButton>
      </Space>
      <Table
        bordered
        rowKey={(row) => row.userId}

        // rowSelection={rowSelection}
        columns={SetEvaluationColumn(
          setOpenPopUp,
          setUserInfor,
          userInfor,
          setData,
          setIsEdit,
          showColumnTitle,
          isFixed,
          props.setSelectedRowKeys,
          props.selectedRowKeys,
          props.setSelectedRows,
          props.selectedRows,
          buttonShowMore,
        )}
        loading={props.isLoading}
        dataSource={props.dataState}
        pagination={false}
        size="small"
        expandable={{
          columnWidth: '1%',
          defaultExpandAllRows: true,
          showExpandColumn: false,
          expandedRowKeys: props.dataState?.map((o: any) => o.userId),
          indentSize: 2,
          rowExpandable: (record) => record?.childrens,
          expandedRowRender: (record) => renderTable(record.childrens),
        }}
        className={'ant-custom-table-title hover-table-currsor-pointerant-custom-table'}
        locale={{ emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA') }}
        scroll={{ x: screens.xs || screens.sm ? 1500 : undefined }}
      />
      <ModalPopup
        bodyStyle={{
          overflowY: 'auto',
          overflowX: 'hidden',
          maxHeight: 'calc(100vh - 150px)',
          maxWidth: 'calc(100vw - 50px)',
        }}
        metaModal={metaModal}
        setMetaModal={setMetaModal}
        width={'750px'}
        FormModal={
          props.selectedRows.length > 1 ? (
            <MultiEditForm
              selectedRecord={props.selectedRows}
              handleCancel={handleCancel}
              setSelectedRowKeys={props.setSelectedRowKeys}
              selectedRowKeys={props.selectedRowKeys}
              handleSearch={props.handleOnchange}
              setTextNotify={setTextNotify}
              setIsVisibleNotify={setIsVisibleNotify}
              temListEvaluators={temListEvaluators}
              state={state}
              setSelectedRows={props.setSelectedRows}
            />
          ) : (
            <SingleEditForm
              selectedRecord={props.selectedRows}
              handleCancel={handleCancel}
              setSelectedRowKeys={props.setSelectedRowKeys}
              selectedRowKeys={props.selectedRowKeys}
              handleSearch={props.handleOnchange}
              listChangeOptinals={listChangeOptinals}
              setTextNotify={setTextNotify}
              setIsVisibleNotify={setIsVisibleNotify}
              state={state}
              setSelectedRows={props.setSelectedRows}
            />
          )
        }
      />

      <ModalCustomComponent
        isOpen={isOpenModal}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_USER')}
        fnHandleOk={handleOKPopupConfirmDelete}
        fnHandleCancel={handleOpenModal}
        okText={t('IDS_DELETE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={props.isLoading}
      />
      <Modal
        open={openPopUp}
        maskClosable={false}
        footer={false}
        width={'90%'}
        destroyOnClose={true}
        onCancel={() => {
          setIsEdit(false);
          setOpenPopUp(false);
        }}
        centered
      >
        <ExceptionPeriodInfor
          userInfo={userInfor}
          isLoading={true}
          periodIndex={conditions.periodIndex}
          year={conditions.year}
          data={data}
          periodId={conditions.id}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          handleCancelPopUp={handleCancelPopUp}
          handleClosePopUp={handleClosePopUp}
          handleSearchSavePopUp={handleSearchSavePopUp}
          isFixed={isFixed}
          isEvaluationTime={isEvaluationTime}
          buttonShowMore={buttonShowMore}
          i18n={i18n}
        />
      </Modal>
      <ShowMoreSkillUserPopUp
        isOpenPopup={isOpenPopup}
        setOpenPopup={setOpenPopup}
        tableSkill={tableSkill}
        setTableSkill={setTableSkill}
      />
    </div>
  );
};

export default SetEvaluationTable;
