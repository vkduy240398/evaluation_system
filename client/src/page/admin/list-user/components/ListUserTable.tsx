/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Modal, Space, Table, message, Typography, Grid, Row, Col } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainButton } from '../../../../common/MainButton';
import ModalPopup from '../../../../common/ModalPopup';
import { MetaModal } from '../../../../model/MetalModel';
import PopupEditUser from './PopupEditUser';
import httpAxios from '../../../../common/http';
import { t } from 'i18next';
import { itemUserList } from '../../../../model/Conditions';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import { DownloadOutlined } from '@ant-design/icons';
import { urlCompanyCode } from '../../../../common/util';

interface Props {
  dataState: itemUserList[] | undefined;
  isLoading: boolean;
  handleOnchange: any;
  setSelectedRowKeys: any;
  selectedRowKeys: any;
  setSelectedRows: any;
  selectedRows: any;
  condition: any;
}
const ListUserTable: React.FC<Props> = (props: Props) => {
  const [metaModal, setMetaModal] = useState({
    type: '',
    record: {},
    title: '',
    isOpen: false,
  } as MetaModal);

  // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const [selectedRows, setSelectedRows] = useState([]);
  const { selectedRowKeys, condition } = props;
  const [isVisableNotify, setIsVisibleNotify] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  let [textNotify, setTextNotify] = useState('');

  const roleName = {
    1: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[1],
    2: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[2],
    3: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[3],
    4: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[4],
    5: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[5],
    6: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[6],
    7: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[7],
    8: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[8],
    9: t('IDS_SYSTEM_ADMIN'),
  } as any;

  const handleDisplayFlagSkillByLevel = (record: { level: number; flagSkill: number }): string => {
    const { level, flagSkill } = record;
    if (flagSkill === 1) {
      return t('IDS_HAVE');
    } else if (flagSkill === 0) {
      return t('IDS_NOT_HAVE');
    } else {
      return '';
    }
  };

  const columns = [
    {
      title: t('IDS_FULLNAME'),
      dataIndex: 'name',
      width: '13%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{record.employeeNumber + ': ' + record.fullName}</div>;
      },
    },
    {
      title: t('IDS_COMPANY'),
      dataIndex: 'companyName',
      width: '16%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{record.company === null ? '' : record.company.name}</div>;
      },
    },
    {
      title: t('IDS_TYPE_DIVISION_NAME'),
      dataIndex: 'divisionName',
      width: '16%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <div style={{ textAlign: 'left', maxWidth: 200 }}>{record.division === null ? '' : record.division.name}</div>
        );
      },
    },
    {
      title: t('IDS_TYPE_DEPARTMENT_NAME'),
      dataIndex: 'departmentName',
      width: '16%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <div style={{ textAlign: 'left', maxWidth: 200 }}>
            {record.department === null ? '' : record.department.name}
          </div>
        );
      },
    },
    {
      title: t('IDS_LEVEL'),
      dataIndex: 'level',
      width: '4%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'center' }}>{record.level === null ? '' : record.level}</div>;
      },
    },
    {
      title: t('IDS_EVALUATION_SKILL'),
      dataIndex: 'flagSkill',
      width: '6%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'center' }}>{handleDisplayFlagSkillByLevel(record)}</div>;
      },
    },
    {
      title: t('IDS_EMAIL'),
      dataIndex: 'email',
      width: '18%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{record.email ? record.email : ''}</div>;
      },
    },
    {
      title: t('IDS_ROLE'),
      dataIndex: 'role',
      width: '20%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <div style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
            {record.roles.length === 0
              ? ''
              : record.roles
                  .sort((a: any, b: any) => {
                    if (a.id < b.id) {
                      return -1;
                    }
                    if (a.id > b.id) {
                      return 1;
                    }

                    return 0;
                  })
                  .map((i: any, index: any) => {
                    return roleName[`${i.id}`] + (index !== record.roles.length - 1 ? '、' : '');
                  })}
          </div>
        );
      },
    },
  ];
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {
    // console.log(newSelectedRowKeys, ' *** ', selectedRows);
    props.setSelectedRowKeys(newSelectedRowKeys);
    props.setSelectedRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleOpen = () => {
    setMetaModal({ ...metaModal, isOpen: true, title: t('POPUP_DIALOG.TITLE.EDIT_MULTIPLE_USER') });
  };

  const handleCancel = () => {
    setMetaModal({ ...metaModal, isOpen: false });
  };

  const handleOKPopupConfirm = async () => {
    await httpAxios.Put('/api/v1/f8/management-user/delete-user', { selectedRowKeys }).then((res) => {
      if (res && res.status === 200) {
        if (res.data.userInfor.length == 0) {
          message.success(t('MESSAGE.COMMON.IDM_DELETE_USER_SUCCESS'));
          props.setSelectedRowKeys([]);
          handleOpenModal();
          props.handleOnchange();
        } else {
          props.setSelectedRowKeys([]);
          handleOpenModal();
          props.handleOnchange();

          /**Set messager notify user cannot delete */
          let text = t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_1') + '\n';
          for (let i = 0; i < res.data.userInfor.length; i++) {
            text +=
              res.data.userInfor[i].employeeNumber +
              ' : ' +
              res.data.userInfor[i].fullName +
              t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_REASON') +
              '\n';
          }
          text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_2');
          text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_3');
          text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_4');
          text += '\n';
          text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_5');

          setTextNotify(text.replace(/\n/g, '<br />'));

          /**Set notify open */
          setIsVisibleNotify(true);
        }
      }
    });
  };
  const navigate = useNavigate();
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => setOpenModal(!isOpenModal);

  const exportListUser = async () => {
    setLoading(true);
    await httpAxios
      .Get('/api/v1/f8/management-user/export-list-user', {
        params: {
          ...condition,
          limit: 99999,
          offset: 0,
        },
        responseType: 'arraybuffer',
      })
      .then((res) => {
        if (res && res.status === 200) {
          const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${t('IDS_LIST_USER')}.xlsx`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    setLoading(false);
  };

  return (
    <div>
      <Modal
        title={<Typography.Title level={4}>{t('POPUP_DIALOG.TITLE.PROCESS_RESULT')}</Typography.Title>}
        open={isVisableNotify}
        maskClosable={false}
        onCancel={() => setIsVisibleNotify(false)}
        footer={[
          // eslint-disable-next-line react/jsx-key
          <div style={{ textAlign: 'left' }}>
            <Button className="cancel_button" onClick={() => setIsVisibleNotify(false)}>
              {t('IDS_BUTTON_CLOSE')}
            </Button>
          </div>,
        ]}
      >
        <p dangerouslySetInnerHTML={{ __html: textNotify }} />
      </Modal>
      <Row>
        <Space size={'large'}>
          <MainButton
            type="primary"
            name="Search"
            value="txt_evaluation_search"
            style={{ marginBottom: '20px' }}
            onClick={handleOpenModal}
            disabled={props.selectedRowKeys.length === 0 || props.dataState?.length === 0 ? true : false}
          >
            {t('IDS_BUTTON_DELETE_MULTIPLE')}
          </MainButton>
          <MainButton
            type="primary"
            name="Search"
            value="txt_evaluation_search"
            style={{ marginBottom: '20px' }}
            onClick={handleOpen}
            disabled={props.selectedRowKeys.length === 0 || props.dataState?.length === 0 ? true : false}
          >
            {t('IDS_BUTTON_EDIT_MULTIPLE')}
          </MainButton>
        </Space>
        <Col
          style={{
            marginLeft: 'auto',
          }}
        >
          <MainButton
            type="primary"
            name="Search"
            value="txt_evaluation_search"
            style={{ marginBottom: '20px', float: 'right' }}
            onClick={exportListUser}
            disabled={props.dataState?.length === 0 ? true : false || isLoading}
            loading={isLoading || props.isLoading}
          >
            {t('IDS_LABLE_OUTPUT_LIST_USER')}
            <DownloadOutlined style={{ fontSize: 18 }} />
          </MainButton>
        </Col>
      </Row>

      <Table
        bordered
        rowKey={(row) => row.id}
        rowSelection={rowSelection}
        dataSource={props.dataState}
        columns={columns}
        loading={props.isLoading}
        pagination={false}
        size="small"
        className={'ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer'}
        onRow={(record) => {
          return {
            onClick: async (_e) => {
              let id = record.id;
              navigate(urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + '/list-user/detail', {
                state: id,
              });

              // navigate('/' + window.location.pathname.split('/')[1] + '/list-user/detail', { state: record });
            }, // click row
          };
        }}
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
        scroll={{ x: 1097 }}
      />
      <ModalPopup
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        metaModal={metaModal}
        setMetaModal={setMetaModal}
        FormModal={
          <PopupEditUser
            selectedRecords={props.selectedRows}
            selectedRowKeys={props.selectedRowKeys}
            handleCancel={handleCancel}
            handleSearch={props.handleOnchange}
            setSelectedRowKeys={props.setSelectedRowKeys}
          />
        }
      />

      <ModalCustomComponent
        isOpen={isOpenModal}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_USER')}
        fnHandleOk={handleOKPopupConfirm}
        fnHandleCancel={handleOpenModal}
        okText={t('IDS_DELETE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={props.isLoading}
      />
    </div>
  );
};

export default ListUserTable;
