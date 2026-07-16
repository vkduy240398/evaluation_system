import Button from 'antd/es/button';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import { t } from 'i18next';
import { urlCompanyCode } from '../../../../common/util';
interface Props {
  isLoading: boolean;
  OpenPopupConfirm: () => void;
  OpenPopupReject: () => void;
  publicStatus: number;
  status: number;
  id: number;
}
const ButtonComponent = (props: Props) => {
  const { isLoading, OpenPopupConfirm, OpenPopupReject, publicStatus, status, id } = props;

  return (
    <>
      <Row style={{ marginTop: 0 }}>
        {publicStatus === 2 && status === 4 && (
          <Col style={{ display: 'flex', gap: 5 }}>
            <Button
              type="primary"
              onClick={OpenPopupConfirm}
              className="button-normal"
              disabled={isLoading}
              loading={isLoading}
            >
              {t('IDS_PUBLIC')}
            </Button>
            <Button
              type="primary"
              onClick={OpenPopupReject}
              className="button-normal"
              disabled={isLoading}
              loading={isLoading}
            >
              {t('IDS_BUTTON_REJECT')}
            </Button>
          </Col>
        )}

        <Col
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginLeft: 'auto',
          }}
        >
          <Button
            type="primary"
            onClick={() =>
              window.open(urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + '/pro-skill/history/' + id, '_blank')
            }
            className="button-normal"
            disabled={isLoading}
            loading={isLoading}
          >
            {t('IDS_HISTORY_APPROVE')}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default ButtonComponent;
