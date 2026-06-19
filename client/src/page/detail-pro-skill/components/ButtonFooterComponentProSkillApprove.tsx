import { Button, ButtonProps, Col, Form, Grid, Row, Space, Tooltip, Typography } from 'antd';
import { t } from 'i18next';
import styled from '@emotion/styled';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import TextArea from 'antd/es/input/TextArea';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import { urlCompanyCode } from '../../../common/util';
const { useBreakpoint } = Grid;
interface Props {
  form: any;
  dataState: any;
  isLoading: any;
  setOpenApprovateGoal: any;
  setOpen: any;
  isOpen: any;
  skillId: any;
  id: any;
  handleOk: any;
  handleOpen: any;
  isOpenApprovateGoal: any;
  handleProcessApproved: any;
  handleProcessApprovedClose: any;
  breaks: any;
}
const ButtonFooterComponentProSkillApprove = (props: Props) => {
  const {
    form,
    dataState,
    isLoading,
    setOpenApprovateGoal,
    setOpen,
    isOpen,
    skillId,
    id,
    handleOk,
    handleOpen,
    isOpenApprovateGoal,
    handleProcessApproved,
    handleProcessApprovedClose,
    breaks,
  } = props;

  const screens = useBreakpoint();

  const ButtonCustom = styled(Button)<ButtonProps>((theme) => ({
    '&.ant-btn-primary': {
      paddingLeft: screens.xs ? 15 : theme.style?.paddingLeft, // '1.5rem'
      paddingRight: screens.xs ? 15 : theme.style?.paddingRight, // '1.5rem'
    },
  }));

  const { Item } = Form;

  return (
    <>
      <Form style={{ paddingTop: 0 }} form={form}>
        {dataState.dataSource.status === 3 && (
          <div>
            <Row style={{ marginBottom: '5px' }}>
              <Typography>{t('IDS_TITLE_REJECT')}</Typography>
              <Tooltip title={t('IDS_TOOLTIP_REJECT')} overlayInnerStyle={{ fontSize: '12px' }}>
                <Icon
                  component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                  style={{ cursor: 'default', paddingLeft: 4 }}
                />
              </Tooltip>
            </Row>
            <Row>
              <Col xs={24} md={24} style={{ paddingBottom: 5 }}>
                <Item
                  name={'commentReject'}
                  style={{ margin: 0 }}
                  rules={[
                    { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string },
                    {
                      max: 500,
                      message: (t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER') as string).replace('{maxLength}', '500'),
                    },
                  ]}
                >
                  <TextArea autoSize={{ maxRows: 2 }} style={{ width: '100%' }} maxLength={501} />
                </Item>
              </Col>
            </Row>

            <Row style={{ justifyContent: 'space-between' }}>
              <Col
                xl={6}
                md={12}
                style={{
                  marginBottom: breaks.xs ? 5 : 0,
                }}
                xs={24}
                sm={18}
              >
                <Row
                  style={{
                    flexWrap: 'wrap',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 5,
                  }}
                >
                  <Button
                    type="primary"
                    className="button-normal"
                    onClick={() => setOpenApprovateGoal(true)}
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {/* Approved button */}
                    {t('IDS_BUTTON_APPROVE')}
                  </Button>

                  <Button
                    type="primary"
                    onClick={() => {
                      form
                        .validateFields()
                        .then(() => {
                          setOpen(true);
                        })
                        .catch(() => {});
                    }}
                    className="button-normal"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {/* Reject button */}
                    {t('IDS_BUTTON_REJECT')}
                  </Button>
                </Row>
              </Col>

              <Col sm={6} xs={24} md={12} style={{ display: 'flex', justifyContent: breaks.xs ? 'start' : 'end' }}>
                <Button
                  loading={isLoading}
                  style={{ marginRight: '7.5px' }}
                  type="primary"
                  size="middle"
                  className="button-normal"
                  onClick={() => {
                    window.open(
                      urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + `/detail-pro-skill-public/skill/${skillId}`,
                      '_blank',
                    );
                  }}
                >
                  {t('IDS_BUTTON_PRO_SKILL_PUBLIC')}
                </Button>
                <Button
                  loading={isLoading}
                  type="primary"
                  className="button-normal"
                  onClick={() => {
                    window.open(urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + `/pro-skill/history/${id}`, '_blank');
                  }}
                >
                  {t('IDS_HISTORY_APPROVE')}
                </Button>
              </Col>
            </Row>
          </div>
        )}
        {dataState.dataSource.status !== 3 && (
          <Row>
            <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'start', paddingBottom: 2 }}></Col>
            <Col xs={24} md={12} style={{ display: 'flex', justifyContent: screens.xs ? 'start' : 'end' }}>
              <Space direction="horizontal" wrap>
                <ButtonCustom
                  loading={isLoading}
                  className="button-normal"
                  type="primary"
                  size="middle"
                  onClick={() =>
                    window.open(urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + `/pro-skill/history/${id}`, '_blank')
                  }
                >
                  {t('IDS_HISTORY_APPROVE')}
                </ButtonCustom>
              </Space>
            </Col>
          </Row>
        )}

        {/* Modal Reject */}
        <ModalCustomComponent
          isOpen={isOpen}
          header={<Typography.Title level={4}>{t('POPUP_DIALOG.TITLE.CONFIRM')}</Typography.Title>}
          content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_REJECT')}
          fnHandleOk={handleOk}
          fnHandleCancel={handleOpen}
          okText={t('POPUP_DIALOG.BUTTON.REJECT') as string}
          cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
          loading={isLoading}
        />

        {/* Modal Approvate */}
        <ModalCustomComponent
          bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
          isOpen={isOpenApprovateGoal}
          header={<Typography.Title level={4}>{t('POPUP_DIALOG.TITLE.CONFIRM')}</Typography.Title>}
          content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_APPROVE')}
          fnHandleOk={handleProcessApproved}
          fnHandleCancel={handleProcessApprovedClose}
          okText={t('POPUP_DIALOG.BUTTON.APPROVE') as string}
          cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
          loading={isLoading}
        />
      </Form>
    </>
  );
};
export default ButtonFooterComponentProSkillApprove;
