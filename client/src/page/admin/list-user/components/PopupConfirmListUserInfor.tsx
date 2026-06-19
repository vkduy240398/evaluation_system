/* eslint-disable @typescript-eslint/naming-convention */
import { Modal, Space, Table, Tooltip, Typography } from 'antd';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import httpAxios from '../../../../common/http';
import { CancelButton, MainButton } from '../../../../common/MainButton';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';

interface Props {
  isOpenPopup?: any;
  setOpenPopup?: any;
  submitData?: any;
  isLoading?: any;
  dataChange?: any;
}
const PopupConfirmListUserInfor: React.FC<Props> = (props: Props) => {
  const { setOpenPopup, isOpenPopup, submitData, isLoading, dataChange } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const [dataSources, setDataSources] = useState<any>();

  useEffect(() => {
    if (isOpenPopup) {
      loadData();
    }
  }, [isOpenPopup]);

  const loadData = async () => {
    setLoading(true);
    await httpAxios
      .Put('/api/v1/f8/management-user/confirm-edit-list-user', {
        dataChange,
      })
      .then((res) => {
        if (res && res.status === 200) {
          // callBack && callBack(res?.data);
          setDataSources(res?.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      title: t('IDS_FULLNAME'),
      dataIndex: 'fullName',
      key: 'fullName',
      width: '8%',
    },
    {
      title: (
        <>
          {t('IDS_USER_INFOR_CHANGE')}
          <Tooltip title={t('IDS_TOOLTIP_USER_INFOR_CHANGE')} color="#424242" overlayInnerStyle={{ fontSize: '11px' }}>
            <Icon
              component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
              style={{ cursor: 'default', paddingLeft: 2 }}
            />
          </Tooltip>
        </>
      ),
      dataIndex: 'userInforChange',
      key: 'userInforChange',
      width: '10%',
    },
    {
      title: t('IDS_USER_EVALUATION_CHANGE'),
      dataIndex: 'userEvaluationChange',
      key: 'userEvaluationChange',
      width: '20%',
    },
  ];

  return (
    <div>
      <Modal
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        title={<Typography.Title level={4}>{t('IDS_CONFIRM_USER_INFOR_CHANGE')}</Typography.Title>}
        open={isOpenPopup}
        footer={null}
        style={{ top: 20 }}
        width="90%"
        maskClosable={false}
        onCancel={() => setOpenPopup(false)}
      >
        <div>
          <Typography>{t('IDS_TEXT_CHANGE_USER_INFOR')}</Typography>
          <Table
            style={{ marginTop: 20 }}
            bordered
            dataSource={dataSources}
            columns={columns}
            loading={loading}
            pagination={false}
            size="small"
            className={'ant-custom-table-title'}
            locale={{
              emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
            }}
            scroll={{ x: 1097 }}
          />
          <div style={{ marginTop: 10 }}>
            <Typography style={{ fontSize: 15 }}> {t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE')}</Typography>
          </div>

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
              loading={isLoading || loading}
              onClick={submitData}
            >
              {t('IDS_BUTTON_SAVE')}
            </MainButton>
            <CancelButton form="form" onClick={() => setOpenPopup(false)} loading={isLoading || loading}>
              {t('IDS_BUTTON_CANCEL')}
            </CancelButton>
          </Space>
        </div>
      </Modal>
    </div>
  );
};
export default PopupConfirmListUserInfor;
